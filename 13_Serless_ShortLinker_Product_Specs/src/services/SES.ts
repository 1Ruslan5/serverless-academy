import { SES } from "aws-sdk"

class SendEmailSES {
    ses: SES

    constructor() {
        this.ses = new SES()
    }

    verifyEmail = async (email: string, message: { name: string, message: string }) => {
        try {
            const params = {
                Destination: {
                    ToAddresses: [email]
                },
                Message: {
                    Body: {
                        Html: {
                            Charset: "UTF-8",
                            Data: message.message
                        }
                    },
                    Subject: {
                        Charset: "UTF-8",
                        Data:message.name
                    }
                },
                Source: process.env.SES_EMAIL
            }

            const response = await this.ses.sendEmail(params).promise()
            return response
        } catch (err) {
            console.log(err);
        }
    }

    sendExpireEmail = async (email: string, message: { name: string, message: string }) => {
        try {
            const params = {
                Destination: {
                    ToAddresses: [email]
                },
                Message: {
                    Body: {
                        Html: {
                            Charset: "UTF-8",
                            Data: message.message
                        }
                    },
                    Subject: {
                        Charset: "UTF-8",
                        Data: message.name
                    }
                },
                Source: process.env.SES_EMAIL
            }

            const response = await this.ses.sendEmail(params).promise();
            return response
        } catch (err) {
            console.log(err);
        }
    }
}

export { SendEmailSES }