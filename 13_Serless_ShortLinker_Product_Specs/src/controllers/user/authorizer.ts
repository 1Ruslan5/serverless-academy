import {JWT} from "src/utils/tokens/JWT"
import { APIGatewayProxyEventHeaders, Callback } from "aws-lambda";
import { Context } from "vm";
import { AccToken } from "src/models/interfaceAccToken";
import { RepositoryDynamo } from "src/services/RepositoryDynamo";

const jwt = new JWT();
const dynamodb = new RepositoryDynamo();

interface AuthResponse {
    principalId: string;
    policyDocument?: {
        Version: string;
        Statement: Array<{
            Action: string;
            Effect: string;
            Resource: any;
        }>;
    };
    context?: {
        user_id?: string;
        email?: string;
    };
}

export const handler =  async function(event: APIGatewayProxyEventHeaders, _context:Context, callback:Callback) {
    const token = event.authorizationToken;

    if(!token){
        callback("Unauthorized");
    }

    const tokenParts = event.authorizationToken.split(' ');
    const tokenValue = tokenParts[1];

    if (!(tokenParts[0].toLowerCase() === 'bearer' && tokenValue)) {
        return callback('Unauthorized');
    }

    try{
        const decodeToken = jwt.decodeToken(tokenValue);
        if(!decodeToken){
            console.log('Error invalid token');
            return callback('Unauthorized');
        }
        const user = await dynamodb.findUserByUserId(decodeToken.user_id);
        if(!user.Items[0].verify) return callback('Unaunthorized')

        return callback(null, generatePolicy({user_id: decodeToken.user_id, email: decodeToken.email}, "Allow", event.methodArn))
    }catch(err){
        console.log('Error invalid token', err);
        return callback('Unauthorized');
    }
};



function generatePolicy(token: AccToken, effect: string, resource: any) {
    var authResponse: AuthResponse = {
        principalId: token.user_id,
    };

    if (effect && resource) {
        var policyDocument = {
            Version: '2012-10-17',
            Statement: [{
                Action: 'execute-api:Invoke',
                Effect: effect,
                Resource: resource,
            }],
        };

        authResponse.policyDocument = policyDocument;
    }

    authResponse.context = {
        user_id: token.user_id,
        email: token.email
    };
    
    return authResponse;
}