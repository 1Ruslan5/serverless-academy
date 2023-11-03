import TelegramBot from "node-telegram-bot-api";
import axios from "axios";
import NodeCache from "node-cache";

//t.me/exchange_rates_serverless_bot

const { TOKEN, PRIVATAPI, MONOAPI, KEY } = process.env;

const bot = new TelegramBot(TOKEN, { polling: true });

const cache = new NodeCache({ stdTTL: 120, checkperiod: 120 });

bot.onText(/\/start/, async (msg) => {
    const { from: { id, first_name } } = msg;
    await bot.sendMessage(id, `Hi, ${first_name}.`, {
        "reply_markup": {
            "keyboard": [["Exchange Rates"]]
        }
    })
});

bot.on('message', async (msg) => {
    const { from: { id }, text } = msg;
    if (text === 'Exchange Rates') {
        await bot.sendMessage(id, `Select which course you want to check.`, {
            "reply_markup": {
                "keyboard": [["USD"], ["EUR"]]
            }
        })
    }

    if (text === "USD") {
        getAnswear(id, 0)
    }

    if (text === "EUR") {
        getAnswear(id, 1)
    }
});

function getAnswear(id, index) {
    try {
        var arratCourse = cache.get(KEY);
        var answear = "";
        const currency = ["USD", "EUR"]
        answear += `PrivatBank ${currency[index]}:\nbuy: ${roundUp(arratCourse[1][index].buy)}\nsale: ${roundUp(arratCourse[1][index].sale)}`;
        answear += `\nMonobank ${currency[index]}:\nbuy: ${roundUp(arratCourse[0][index].rateBuy)}\nsale: ${roundUp(arratCourse[0][index].rateSell)}`;
        bot.sendMessage(id, answear);
    } catch (err) {
        console.log(err);
    }
}

function roundUp(number) {
    return Math.round(number * 100) / 100
}

async function getExchange() {
    try {
        let { data: mono } = await axios.get(MONOAPI);
        let { data: privat } = await axios.get(PRIVATAPI);
        var array = [
            [mono[0], mono[1]],
            [privat[1], privat[0]]
        ];
        cache.set(KEY, array);
    } catch (err) {
        console.log(err)
    }
}
await getExchange();
setInterval(async () => { await getExchange() }, 120000);
