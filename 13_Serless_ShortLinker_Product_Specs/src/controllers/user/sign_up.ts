import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { jsonResponse } from "src/utils/responses/jsonResponse";
import { messages } from "src/utils/responses/messages";
import { JWT } from "src/utils/tokens/JWT";
import { validateEmail } from "src/utils/validation/validateEmail";
import { validatePassword } from "src/utils/validation/validatePassword";
import { RepositoryDynamo } from "src/services/RepositoryDynamo";
import * as crypto from 'crypto';
import * as bcryptjs from 'bcryptjs';
import { User } from "src/models/interfaceUser";
import { SendEmailSES } from "src/services/SES";
import { messagesSES } from "src/utils/responses/messagesSES";

const repository = new RepositoryDynamo();
const jwt = new JWT();
const ses = new SendEmailSES();

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const { email, password } = JSON.parse(event.body || '');

        if (!email) return jsonResponse(401, { error: messages.emptyEmail })
        if (!password) return jsonResponse(401, { error: messages.emptyPassword })
        if (!validateEmail(email)) return jsonResponse(401, { error: messages.unvalidEmail });
        if (!validatePassword(password)) return jsonResponse(401, { error: messages.unvalidPassword });

        const existenceUser = await repository.findUserByEmail(email);
        if (existenceUser.Items && existenceUser.Items.length > 0) return jsonResponse(401, { error: messages.sameEmail });

        const idUser = crypto.randomBytes(16).toString('hex');
        const hashPassword = await bcryptjs.hash(password, 1);
        const newUser: User = {
            user_id: idUser,
            email,
            password: hashPassword,
            verify: false
        }

        const responseCreate = await repository.createUser(newUser);
        if (!responseCreate) return jsonResponse(500, { error: messages.serverError });

        const protocol = event.headers?.['X-Forwarded-Proto'] || 'http';
        const host = event.headers?.Host;
        const accessCode = jwt.generateToken({ user_id: idUser, email });
        const accessLink = `${protocol}://${host}/shortLink/verify/${accessCode}`;

        const sendVerifyEmail = await ses.verifyEmail(email, messagesSES('Email verify', accessLink));
        if (!sendVerifyEmail) return jsonResponse(500, { error: messages.serverError });

        const accessToken = jwt.generateToken({ user_id: idUser, email }, { expiresIn: '1h' });

        return jsonResponse(200, { messages: messages.successSingUp, accessToken })
    } catch (err) {
        console.log(err);
        return jsonResponse(500, { error: messages.serverError });
    }
}