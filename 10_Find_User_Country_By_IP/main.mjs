import express from 'express';
import { connect } from 'ngrok';
import { readFileSync } from 'fs';
import { searchIP } from './utils/searchIP.mjs';

const { PORT, NGROK_TOKEN } = process.env
let arrayIP = [];
let array;
const app = express();

app.set('trust proxy', true);

app.get('/', (req, res) => {
    const ip = req.ip;
    const index = searchIP(arrayIP, ipToNumber(ip));
    const country = getCountry(array[index]);
    res.json({
        ip,
        country
    })
});

readCSV();
server();

async function server() {
    try {
        app.listen(PORT, () => {
            console.log(`Server started on port: ${PORT}`);
        });
        const url = await connect({
            addr: PORT,
            authtoken: NGROK_TOKEN,
        });
        console.log('URL:', url);
    } catch (err) {
        console.log(err);
    }
}

function readCSV (){
    array = readFileSync('C:/serverless-academy/10_Find_User_Country_By_IP/IP2LOCATION-LITE-DB1.CSV', 'utf8').trim().split("\r\n")
    for(let line of array){
        const [number] = line.split(',');
        arrayIP.push(Number(number.replace(/"/g, '')));
    }
}

function getCountry (string) {
    const values = string.split(',');
    return values[3].replace(/"/g, '')
}

function ipToNumber(ip) {
    const parts = ip.split(".");
    return parts.reduce((result, part) => ((result << 8) + parseInt(part, 10)) >>> 0, 0);
}
