export const responseJSON = (code, body) =>{
    return{
        status: code,
        body
    }
}