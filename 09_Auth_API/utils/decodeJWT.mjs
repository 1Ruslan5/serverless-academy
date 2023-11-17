import jwt from "jsonwebtoken"

export const decodeJWT = (access_token) => {
    try{
        const token = jwt.verify(access_token);
    
        return token; 
    }catch(err){
        return null
    }
}