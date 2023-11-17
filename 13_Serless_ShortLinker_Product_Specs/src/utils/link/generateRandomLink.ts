import {RepositoryDynamo} from "src/services/RepositoryDynamo"

const dynamodb = new RepositoryDynamo()

export const generateRandomLink = async  (length: number, protocol: string, host: string, stage?:string) =>{
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters.charAt(randomIndex);
    }
    const linkUser = `${protocol}://${host}/${stage}/${code}`;`${protocol}://${host}/${stage}/${code}`;
    const existenceSameLink = await dynamodb.findLongLinkByShort(linkUser);
    const link = existenceSameLink.Items.find(link => link.active)
    if (link) {
        generateRandomLink(length, protocol, host);
    }
    return linkUser;
}