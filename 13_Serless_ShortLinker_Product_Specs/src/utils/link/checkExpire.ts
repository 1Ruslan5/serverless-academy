export const checkExpire = (time:string, date: number, requests:number) => {
    if(time === 'one-time'){
        return requests < 1;
    }

    const currentTime = new Date();
    return currentTime.getTime() < date; 
} 