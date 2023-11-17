import { jsonResponse } from "src/utils/responses/jsonResponse";
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { messages } from "src/utils/responses/messages";
import { RepositoryDynamo } from "src/services/RepositoryDynamo";
import { JWT } from "src/utils/tokens/JWT";

const dynamodb = new RepositoryDynamo();
const jwt = new JWT();

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const access_token = event.path.split('/')[2];

        const decodeToken = jwt.decodeToken(access_token);
        if(!decodeToken) return jsonResponse(401, { error: messages.unvalidVerifyLink })
        
        const findUser = await dynamodb.findUserByEmail(decodeToken.email);
        if(findUser.Items[0].verify) return jsonResponse(401, {error: messages.alreadyVerify});

        const activateUser = await dynamodb.activateUser(decodeToken.user_id, decodeToken.email);
        if(!activateUser) return jsonResponse(500, { error: messages.serverError })
    
        return jsonResponse(200, { message: messages.successVerify  });
    } catch (err) {
        console.log(err);
        return jsonResponse(500, { message: messages.serverError });
    }
} 