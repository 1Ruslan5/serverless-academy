import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { RepositoryDynamo } from "src/services/RepositoryDynamo";
import { convertTime } from "src/utils/link/convertTime";
import { jsonResponse } from "src/utils/responses/jsonResponse";
import { messages } from "src/utils/responses/messages";


const dynamodb = new RepositoryDynamo();

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const { user_id } = event.requestContext.authorizer;

        const existLinks = await dynamodb.findLinksByUserId(user_id);
        if(existLinks.Items.length[0] === 0) return jsonResponse(200, {messages: messages.emptyUserListLinks});

        const arrayLinks = existLinks.Items.map(link => {
            return {
                idLink: link.link_id,
                short_link: link.short_link,
                long_link: link.long_link,
                timeToValid: convertTime( link.time, link.time_to_expired),
                requests: link.requestsCount,
                active: link.active
            }
        });

        return jsonResponse(200, { links: arrayLinks })
    } catch (err) {
        console.log(err)
        return jsonResponse(500, {error : messages.serverError })
    }
}