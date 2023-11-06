export const responseJSON = (code: number, body:object) =>{
    return{
        status: code,
        body
    }
}