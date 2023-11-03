import { readFileSync } from 'fs'
import axios from 'axios'

let countTrue = 0;
let countFalse = 0;
let jsonLink = readFileSync('C:/serverless-academy/08_JSON_Sorting/links.txt', 'utf-8').split("\r\n");

await main();

async function main() {
    await Promise.all(jsonLink.map(link => getLink(link, 0)));
    console.log(`Found True values: ${countTrue}`);
    console.log(`Found False values: ${countFalse}`);
}

async function getLink(link, number) {
    try {
        let { data } = await axios.get(link);
        let isDone = searchIsDone(data);
        if(isDone === undefined){
            console.log(`[Success]${link}  The isDone didn't find`);
            return
        }
        console.log(`[Success]${link} isDone - ${isDone}`);
    } catch (err) {
        if (number < 3) {
            await getLink(link, number + 1)
        }else{
            console.log(`[Fail]${link}  The endpoint is unavailable`);
            countTF(false);
        }
    }
}

function countTF(tf) {
    if (tf) {
        countTrue++;
        return
    }
    countFalse++;
}

function searchIsDone(data){
    let variabl = 'isDone';
    let isDone;

    if (variabl in data) {
        countTF(data[variabl]);
        isDone = data[variabl];
    } else {
        Object.entries(data).forEach(([key, value]) => {
            if (typeof value == 'object') {
                isDone = searchIsDone(value);
            }
        })
    }
    return isDone
}
