import inquirer from "inquirer";
import { appendFileSync, readFileSync } from "fs";

start();

function start() {
    const questions = [
        {
            type: 'list',
            name: 'gender',
            message: 'Choose your Gender.',
            choices: [
                'male',
                'female'
            ]
        },
        {
            type: 'input',
            name: 'age',
            message: "Enter your age:",
            validate(age) {
                if (!isNaN(age) || !age) {
                    return true

                }
                return 'Please, enter your age'
            }
        }
    ]

    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: "Enter the user's name. To cancel press ENTER:",
            validate(name) {
                if (name === " ") {
                    return "Please enter the user's name"
                }
                return true
            },
        }
    ]).then((answear_name => {
        if (answear_name.name === '') {
            searchValue();
            return;
        }
        const name = answear_name.name[0].toUpperCase() + answear_name.name.toLowerCase().slice(1);
        inquirer.prompt(questions).then(answear => {
            parseToBd({ name, gender: answear.gender, age: answear.age });
            start();
        })
    }));
}

function searchValue() {
    const questionSearch = [
        {
            type: 'confirm',
            name: 'questionSearch',
            message: "Woud you to search values in DB?"
        }
    ]

    const questionSearchName = [
        {
            type: 'input',
            name: 'searchName',
            message: "Enter the user's name you wanna find in DB: ",
            validate(searchName) {
                if (!searchName) {
                    return "Please enter the user's name"
                }
                return true
            },
        }
    ]

    let objects = [];
    inquirer.prompt(questionSearch).then((questionSearch_answear) => {
        if (questionSearch_answear.questionSearch) {
            const json_array = readFileSync('/serverless-academy/02_CLI_Primitive_DB/repository.txt', 'utf-8').split('\n');
            if (json_array.length === 1) {
                console.log(`Your DB is empty.`);
                return ;
            }
            for (let i = 0; i < json_array.length - 1; i++) {
                objects.push(JSON.parse(json_array[i]));
            }
            console.log(objects);

            inquirer.prompt(questionSearchName).then((searchName_answear) => {
                let answear = [];
                for (let i in objects) {
                    if (objects[i].name.toLowerCase() === searchName_answear.searchName.toLowerCase()) {
                        answear.push(objects[i]);
                    }
                }
                if (!answear.length) {
                    console.log("User didn't find.");
                    return
                }
                console.log(answear);
                return
            })
        }
        return
    })
}

function parseToBd(textBDJson) {
    appendFileSync('/serverless-academy/02_CLI_Primitive_DB/repository.txt', JSON.stringify(textBDJson) + '\n')
}