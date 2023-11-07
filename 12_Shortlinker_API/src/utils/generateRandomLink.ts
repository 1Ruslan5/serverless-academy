import { Repository } from "../services/Repository";

const repository = new Repository();

export const generateRandomLink = async  (length: number, protocol: string, host: string) =>{
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters.charAt(randomIndex);
    }
    const linkUser = `${protocol}://${host}/${code}`;
    const existenceSameLink = await repository.getLinksByShort(linkUser);
    if (existenceSameLink) {
        generateRandomLink(length, protocol, host);
    }
    return linkUser;
}