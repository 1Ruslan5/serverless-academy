import { DynamoDB } from "aws-sdk"
import { User } from "../models/interfaceUser";

class RepositoryDynamo {
    private dynamodb: DynamoDB.DocumentClient;

    constructor() {
        this.dynamodb = new DynamoDB.DocumentClient();
    }
     
    createUser = async (user: User) => {
        try {
            const result = await this.dynamodb.put({
                TableName: process.env.AWS_DYNAMODB_TABLE_USER,
                Item: user,
            }).promise();

            return result;
        } catch (err) {
            console.log(err);
            return undefined
        }
    }

    findUserByUserId = async (user_id: string) => {
        try {
            const payload = {
                TableName: process.env.AWS_DYNAMODB_TABLE_USER,
                IndexName: 'userId-index',
                KeyConditionExpression: 'user_id = :user_id',
                ExpressionAttributeValues: {
                    ':user_id': user_id
                }
            }

            const response = await this.dynamodb.query(payload).promise();
            return response;
        } catch (error) {
            return null;
        }
    };

    findUserByEmail = async (email: string) => {
        try {
            const payload = {
                TableName: process.env.AWS_DYNAMODB_TABLE_USER,
                IndexName: 'email-index',
                KeyConditionExpression: 'email = :email',
                ExpressionAttributeValues: {
                    ':email': email
                }
            }

            const response = await this.dynamodb.query(payload).promise();
            return response;
        } catch (error) {
            return null;
        }
    };

    findUserbyPrimeKey = async (user_id: string, email: string) => {
        try {
            const params = {
                TableName: process.env.AWS_DYNAMODB_TABLE_USER,
                KeyConditionExpression: 'user_id = :user_id and email = :email',
                ExpressionAttributeValues: {
                    ':user_id': user_id,
                    ':email': email
                }
            }

            const response = await this.dynamodb.query(params).promise();
            return response
        } catch (error) {
            console.log(error)
            return null;
        }
    }

    activateUser = async (user_id:string, email: string) => {
        try {
            const params = {
                TableName: process.env.AWS_DYNAMODB_TABLE_USER,
                Key: {
                    user_id: user_id,
                    email: email
                },
                UpdateExpression: "set verify = :verify",
                ExpressionAttributeValues: {
                    ":verify": true
                },
            }

            const response = await this.dynamodb.update(params).promise();
            return response
        } catch (error) {
            console.log(error)
            return null;
        }
    
    }

    createLink = async (link: Link) => {
        try {
            const params = {
                TableName: process.env.AWS_DYNAMODB_TABLE_LINK,
                Item: link,
            };

            const response = await this.dynamodb.put(params).promise();
            return response;
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    findAllLinks = async () =>{
        try{
            const params = {
                TableName: process.env.AWS_DYNAMODB_TABLE_LINK,
            }

            const response = await this.dynamodb.scan(params).promise();
            return response;
        }catch(err){
            console.log(err);
            return null;
        }
    }

    findLinkById = async (link_id: string) => {
        try {
            const params = {
                TableName: process.env.AWS_DYNAMODB_TABLE_LINK,
                KeyConditionExpression: 'link_id = :link_id',
                ExpressionAttributeValues: {
                    ':link_id': link_id,
                }
            };
    
            const response = await this.dynamodb.query(params).promise();
            return response;
        } catch (err) {
            console.log(err);
            return null;
        }
    };

    findLongLinkByShort = async (shortLink: string) => {
        try {
            const params = {
                TableName: process.env.AWS_DYNAMODB_TABLE_LINK,
                IndexName: 'shortLink-index',
                KeyConditionExpression: 'short_link = :short_link',
                ExpressionAttributeValues: {
                    ':short_link': shortLink
                }
            }

            const response = await this.dynamodb.query(params).promise();
            return response;
        } catch (err) {
            console.log(err);
            return null
        }
    }

    findLinksByUserId = async (user_id: string) => {
        try {
            const params = {
                TableName: process.env.AWS_DYNAMODB_TABLE_LINK,
                IndexName: 'user_id-index',
                KeyConditionExpression: 'user_id = :user_id',
                ExpressionAttributeValues: {
                    ':user_id': user_id
                }
            }

            const response = await this.dynamodb.query(params).promise();
            return response;
        } catch (err) {
            console.log(err);
            return null
        }
    }

    deactivateLink = async (link_id: string) => {
        try {
            const params = {
                TableName: process.env.AWS_DYNAMODB_TABLE_LINK,
                Key: {
                    link_id
                },
                UpdateExpression: "set active = :active",
                ExpressionAttributeValues: {
                    ":active": false
                }
            }

            const response = await this.dynamodb.update(params).promise();
            return response;
        } catch (err) {
            console.log(err);
            return null
        }
    }

    addRequst = async (link_id:string, request: number) => {
        try{
            const params = {
                TableName: process.env.AWS_DYNAMODB_TABLE_LINK,
                Key: {
                    link_id
                },
                UpdateExpression: "set requestsCount = :requestsCount",
                ExpressionAttributeValues: {
                    ":requestsCount": request+1
                }
            }

            const response = await this.dynamodb.update(params).promise();
            return response;
        }catch(err){
            console.log(err);
            return null
        }
    }
}

export { RepositoryDynamo }