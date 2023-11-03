import { greeting, condition, farewell } from './text.js';
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let array;

start();

function start() {
    rl.question(greeting, words => {
        if (words.length < 10) {
            console.log('Please, input 10 words.');
            start();
            return
        }
        array = words.split(' ');

        rl.question(condition, answear => {
            if(answear === 'exit'){
                console.log(farewell);
                return rl.close();
            }
            switch (Number(answear)) {
                case 1:
                    console.log(separateWords('w', array).sort());
                    break;
                case 2:
                    console.log(separateWords('n', array).sort());
                    break;
                case 3:
                    console.log(separateWords('n', array).sort((a,b)=>b-a));
                    break;
                case 4:
                    console.log(separateWords('w', array).sort((a,b)=>a.length-b.length));
                    break;
                case 5:
                    const setWords = new Set(separateWords('w', array));
                    console.log(Array.from(setWords));
                    break;
                case 6:
                    const setAll = new Set(array);
                    console.log(Array.from(setAll));
                    break;
                default:
                    console.log(array);
            }
            start();
            return
        })
    })


}


function separateWords(type, array) {
    switch (type) {
        case 'n':
            return array.filter((value) => value.match(/(^[-+]?([0-9]+)(\.[0-9]+)?)$/))
        case 'w':
            return array.filter((value) => value.match(/[A-Za-z]/))
    }
}
