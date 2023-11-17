export const convertTime = (time: string | null, date: number | null ) => {
    if(time === 'one-time'){
        return 'One-time'
    }

    const convertedDate = new Date(date);

    return convertedDate.toLocaleDateString();
}