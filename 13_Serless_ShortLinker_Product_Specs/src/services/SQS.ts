import * as AWS from "aws-sdk";
import { SendEmailSES } from "./SES";

const ses = new SendEmailSES();

class SQS {
    sqs: AWS.SQS;
    isProcessing: boolean = false;

    constructor() {
        this.sqs = new AWS.SQS()
    }

    sendMessageToSQS = async (messageBody: { email: string, message: { name: string, message: string } }) => {
        const params = {
            QueueUrl: process.env.SQS_LINK,
            MessageBody: JSON.stringify(messageBody),
        }

        try {
            await this.sqs.sendMessage(params).promise();
        } catch (err) {
            console.error(err);
        }
    }

    processMessagesFromSQS = async () => {
        while (true) {
            try {
                const messages = await this.sqs.receiveMessage({
                    QueueUrl: process.env.SQS_LINK,
                    MaxNumberOfMessages: 10,
                }).promise();

                if (messages.Messages && messages.Messages.length > 0) {
                    this.isProcessing = true;
                    for (const message of messages.Messages) {
                        const body = JSON.parse(message.Body);
                        console.log(body);

                        await ses.sendExpireEmail(body.email, body.message);

                        await this.sqs.deleteMessage({
                            QueueUrl: process.env.SQS_LINK,
                            ReceiptHandle: message.ReceiptHandle,
                        }).promise();
                    }
                } else {
                    console.log('No messages to process');
                }
            } catch (err) {
                console.error('Error processing messages from SQS:', err);
            }
        }
    }
}

export { SQS };