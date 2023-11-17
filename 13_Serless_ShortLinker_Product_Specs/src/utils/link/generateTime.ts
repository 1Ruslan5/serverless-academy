export const generateTime = (time: string) => {
    const response = { time: null, date: null }
    switch(time){
        case "one-time":
            response.time = "one-time";
            break;
        case '1 day':
            response.date = new Date().setDate(new Date().getDate() + 1);
            break;
        case '3 days':
            response.date = new Date().setDate(new Date().getDate() + 3);
            break;
        case '7 days':
            response.date = new Date().setDate(new Date().getDate() + 7);
            break;
    }
    return response
}

console.log(generateTime('1 day'));