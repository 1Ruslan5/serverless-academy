import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda"
import { jsonResponse } from "src/utils/responses/jsonResponse"
import { messages } from "src/utils/responses/messages"
import { RepositoryDynamo } from "src/services/RepositoryDynamo"
import { SQS } from "src/services/SQS";
import {messagesSES} from "src/utils/responses/messagesSES";

const dynamodb = new RepositoryDynamo();
const sqs = new SQS();

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const { link_id } = JSON.parse(event.body || '');
        const { email } = event.requestContext.authorizer;

        if (!link_id) return jsonResponse(401, { error: messages.emptyShortLink });

        const existLink = await dynamodb.findLinkById(link_id);
        if (!existLink) return jsonResponse(401, { error: messages.linkNotFound });
        if (!existLink.Items[0].active) return jsonResponse(401, { error: messages.linkAlreadyDeactivated });

        const deactiveLink = await dynamodb.deactivateLink(link_id);
        if (!deactiveLink) return jsonResponse(401, { error: messages.linkNotFound });

        await sqs.sendMessageToSQS({email, message: messagesSES("Deactivated notification", existLink.Items[0].short_link)})

        return jsonResponse(200, { message: messages.successDeactive })
    } catch (err) {
        console.log(err)
        return jsonResponse(500, { error: messages.serverError })
    }
}