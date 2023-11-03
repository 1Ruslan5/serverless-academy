import jwt from "jsonwebtoken";

export const generateJWT = (data, time) =>{
    return jwt.sign(data, process.env.SECRET_KEY, time)
}