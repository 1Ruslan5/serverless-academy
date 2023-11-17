export const jsonResponse = (statusCode: number, body: object) =>{
    return {
        statusCode,
        body: JSON.stringify(body)
    }
}