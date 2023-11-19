import { jsonResponse } from "src/utils/responses/jsonResponse";
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { messages } from "src/utils/responses/messages";
import { validateEmail } from "src/utils/validation/validateEmail";
import { RepositoryDynamo } from "src/services/RepositoryDynamo";
import * as bcryptjs from 'bcryptjs';
import { JWT } from "src/utils/tokens/JWT";

const dynamodb = new RepositoryDynamo();
const jwt = new JWT();

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const { email, password } = JSON.parse(event.body || '');

        if (!email) return jsonResponse(401, { error: messages.emptyEmail });
        if (!password) return jsonResponse(401, { error: messages.emptyPassword });
        if (!validateEmail(email)) return jsonResponse(401, { error: messages.unvalidEmail });

        const existenceUser = await dynamodb.findUserByEmail(email);
        if (existenceUser.Items.length === 0) return jsonResponse(404, { error: messages.notFoundEmail });

        const properlyPassword = await bcryptjs.compare(password, existenceUser.Items[0].password);
        if (!properlyPassword) return jsonResponse(401, { error: messages.unvalidPassword });
        if(!existenceUser.Items[0].verify) return jsonResponse(401, {erorr: messages.notVerify})

        const accessToken = jwt.generateToken({ user_id: existenceUser.Items[0].user_id, email }, { expiresIn: '1h' });

        return jsonResponse(200, {messages:messages.successSignIn, accessToken });
    } catch (err) {
        console.log(err);
        return jsonResponse(500, { message: messages.serverError });
    }
} 