import TelegramBot from 'node-telegram-bot-api'
import { Command } from 'commander';
//t.me/echo_serverless_bot

const program = new Command();

const TOKEN = process.env.TOKEN;

const bot = new TelegramBot(TOKEN, { polling: true });
const id = await getId();

program.command('message <text>')
    .alias('m')
    .description('Send a message to the bot')
    .action(async (text) => {
        try{
            if (typeof text === 'string') {
                console.log("Please, convert you your message to string: 'message'");
                process.exit();
            }
            await bot.sendMessage(id, text);
            console.log('Message sent successfully!');
            process.exit();
        }catch(err){
            console.log(err);
        }
    })


program.command('photo <path>')
    .alias('p')
    .description('Send a photo to the bot')
    .action(async (photo) => {
        try{
        await bot.sendPhoto(id, photo);
        console.log('Photo send successfully!')
        process.exit();
        }catch (err){
            console.log('Check your photo path');
            process.exit();
        }
    })

program.parse();

async function getId() {
    try {
        const [updates] = await bot.getUpdates();
        if (updates) {
            const { message: { chat: { id: chatId } } } = updates;
            return chatId;
        }
        console.log('No updates found');
        process.exit();
    } catch (err) {
        console.log(err)
    }
}