import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda"
import { jsonResponse } from "src/utils/responses/jsonResponse"
import { SQS } from "src/services/SQS";
import { messages } from "src/utils/responses/messages";

const sqs = new SQS();

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try{
        await sqs.processMessagesFromSQS();
        return jsonResponse(200, {message:"Success"})
    } catch (error) {
        console.log(error);
        return jsonResponse(500, {error: messages.serverError});
    }
}