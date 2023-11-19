import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda"
import { jsonResponse } from "src/utils/responses/jsonResponse"
import { messages } from "src/utils/responses/messages"
import { RepositoryDynamo } from "src/services/RepositoryDynamo"
import { checkExpire } from "src/utils/link/checkExpire";
import { SQS } from "src/services/SQS";
import { messagesSES } from "src/utils/responses/messagesSES";

const dynamodb = new RepositoryDynamo();
const sqs = new SQS();

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const protocol = event.headers?.['X-Forwarded-Proto'] || 'http';
        const host = event.headers?.Host;
        const path = event.path;

        const shortLink = `${protocol}://${host}/shortLink${path}`;

        const links = await dynamodb.findLongLinkByShort(shortLink);
        if (!links) return jsonResponse(404, { error: messages.linkNotFound })
        if (links.Items.length === 0) return jsonResponse(404, { error: messages.linkNotFound })

        const activeLink = links.Items.find(link => link.active);
        if(!activeLink) return jsonResponse(401, { error: messages.linkAlreadyDeactivated })
        if (!checkExpire(activeLink.time, activeLink.time_to_expired, activeLink.requestsCount)) {
            await dynamodb.deactivateLink(activeLink.link_id);
            await sqs.sendMessageToSQS({email: activeLink.email, message: messagesSES("Deactivated notification", activeLink.short_link)})
            return jsonResponse(401, { error: messages.linkAlreadyDeactivated })
        }
        const addRequest = await dynamodb.addRequst(activeLink.link_id, activeLink.requestsCount);
        if (!addRequest) return jsonResponse(500, { error: messages.serverError })
        
        return {
            statusCode: 302,
            headers: {
                Location: activeLink.long_link
            },
            body: ''
        }
    } catch (err) {
        console.log(err)
        return jsonResponse(500, { error: messages.serverError })
    }
}