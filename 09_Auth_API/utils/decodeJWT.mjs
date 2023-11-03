import jwt from "jsonwebtoken"

export const decodeJWT = (access_token) => {
    try{
        const token = jwt.decode(access_token);
        const currentTime = Math.floor(Date.now() / 1000);
    
        return (token.exp > currentTime)? token : null; 
    }catch(err){
        return null
    }
}