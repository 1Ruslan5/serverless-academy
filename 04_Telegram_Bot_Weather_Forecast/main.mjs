import axios from "axios"
import TelegramBot from 'node-telegram-bot-api'
//t.me/weather_forecast_severless_bot


const { TOKEN, FORECASTAPI } = process.env;
console.log(FORECASTAPI);
const bot = new TelegramBot(TOKEN, { polling: true })


bot.onText(/\/start/, async (msg) => {
    const { from: { id, first_name } } = msg;
    await bot.sendMessage(id, `Hi, ${first_name}.`, {
        "reply_markup": {
            "keyboard": [["Forecast in Kharkiv"]]
        }
    })
});

bot.on('message', async (msg) => {
    const { from: { id }, text } = msg;
    if (text === 'Forecast in Kharkiv') {
        await bot.sendMessage(id, `Select one of the time intervals.`, {
            "reply_markup": {
                "keyboard": [["at intervals of 3 hours"], ["at intervals of 6 hours"]]
            }
        })
    }

    if (text === "at intervals of 3 hours") {
        getForecastKharkiv(id, 1)
    }

    if (text === "at intervals of 6 hours") {
        getForecastKharkiv(id, 2)
    }
});

async function getForecastKharkiv(id, index) {
    try {
        let { data: { list } } = await axios.get(FORECASTAPI);
        let text = "Weather forecast in Kharkiv:\n";
        let day;
        let indexValue = (index % 2) ? 1 : 2;
        for (let i = 0; i <= 16; i += indexValue) {
            let date = new Date(list[i].dt_txt);
            let temp = Math.round(list[i].main.temp);
            let feel = Math.round(list[i].main.feels_like);
            let weather = list[i].weather[0].description;
            if (date.getDate() === day) {
                text += `${date.getHours()}:00, weather: ${weather}, air temperature: ${temp}°C, feels like: ${feel}°C \n`;
            } else {
                day = date.getDate();
                text += `\n${day} ${await getDate(date, 'month')}, ${await getDate(date, 'weekday')}\n${date.getHours()}:00, weather: ${weather} air temperature: ${temp}°C, feels like: ${feel}°C \n`;
            }
        }
        bot.sendMessage(id, text);
    } catch (err) {
        console.log(err)
    }
}

const getDate = async (currentData, type) => {
    return type === 'weekday'
        ? currentData.toLocaleString('en-US', { weekday: 'long' })
        : currentData.toLocaleString('en-US', { month: 'long' })
}