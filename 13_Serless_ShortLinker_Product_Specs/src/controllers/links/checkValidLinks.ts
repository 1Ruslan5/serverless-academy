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
        const links = await dynamodb.findAllLinks();
        if(!links) return jsonResponse(401, { error: messages.serverError });
        if(links.Items.length === 0) return jsonResponse(401, { error: messages.serverError });

        for(const link of links.Items){
            if(!checkExpire(link.time, link.time_to_expired, link.requestsCount) && link.active){
                const deactivateLink = await dynamodb.deactivateLink(link.link_id);
                if(!deactivateLink) return jsonResponse(401, { error: messages.serverError });
                await sqs.sendMessageToSQS({email: link.Items[0].email, message: messagesSES("Deactivated notification", link.short_link)})
            }
        }

        return jsonResponse(200, { message: messages.successDeactive })
    } catch (err) {
        console.log(err)
        return jsonResponse(500, { error: messages.serverError })
    }
}