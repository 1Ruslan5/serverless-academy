import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda"
import { generateRandomLink } from "src/utils/link/generateRandomLink";
import { generateTime } from "src/utils/link/generateTime";
import { jsonResponse } from "src/utils/responses/jsonResponse"
import { messages } from "src/utils/responses/messages"
import { RepositoryDynamo } from "src/services/RepositoryDynamo"
import { convertTime } from "src/utils/link/convertTime"
import * as crypto from 'crypto';
import { checkValidUserLink } from "src/utils/link/checkValidUserLink";

const dynamodb = new RepositoryDynamo();

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const { link: long_link, time: userTime } = JSON.parse(event.body || '');
        const { user_id, email } = event.requestContext.authorizer;

        if (!long_link) return jsonResponse(401, { error: messages.emptyLink });
        if (!userTime) return jsonResponse(401, { error: messages.emptyTime });

        const existLinks = await dynamodb.findLinksByUserId(user_id);
        const existLink = existLinks.Items.find(link => link.long_link === long_link && link.active);
        if (existLink) return jsonResponse(200, { idLink: existLink.link_id, shortLink: existLink.short_link, timeToValid: convertTime(existLink.time, existLink.time_to_expired), message: messages.existenceShortLink });

        const validLongLink = await checkValidUserLink(long_link);
        if (!validLongLink) return jsonResponse(401, { error: messages.unvalidUserLink })

        const { time, date } = generateTime(userTime);
        if (!time && !date) return jsonResponse(401, { error: messages.unvalidTime })

        const protocol = event.headers?.['X-Forwarded-Proto'] || 'http';
        const host = event.headers?.Host;
        const short_link = await generateRandomLink(6, protocol, host, 'shortLink');
        const link_id = crypto.randomBytes(16).toString('hex');

        const link: Link = {
            link_id,
            user_id,
            email,
            long_link,
            short_link,
            time_to_expired: date,
            time,
            requestsCount: 0,
            active: true
        }

        const createLink = await dynamodb.createLink(link);
        if (!createLink) return jsonResponse(500, { message: messages.serverError })

        return jsonResponse(200, { idLink: link_id, shortLink: short_link, timeToValid: convertTime(time, date) })
    } catch (err) {
        console.log(err)
        return jsonResponse(500, { error: messages.serverError })
    }
}