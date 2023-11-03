import express from "express";
import { Repository } from "../services/Repository.mjs"
import { responseJSON } from "../utils/responseJSON.mjs";
import { messages } from "../utils/messageToUser.mjs";
import { decodeJWT } from "../utils/decodeJWT.mjs";
import { generateJWT } from "../utils/generateJWT.mjs";
import crypto from "crypto";

const user = express.Router();
const repository = new Repository();

user.get('/me', async (res, req) => {
    try {
        const access_token = res.header('authorization');
        if (!access_token) {
            req.statusCode = 401;
            return req.json(responseJSON(401, { error: messages.emptyAuthorization }));
        }

        const decodedToken = decodeJWT(access_token);
        if (!decodedToken) {
            req.statusCode = 401;
            return req.json(responseJSON(401, { error: messages.access_tokenExpired }));
        }

        const existenceUser = await repository.checkUserByEmail(decodedToken.email);
        if (!existenceUser) {
            req.statusCode = 404;
            return req.json(responseJSON(404, { error: messages.userNotFound }));
        }

        req.statusCode = 200;
        return req.json(responseJSON(200, { id: decodedToken.id, email: decodedToken.email }));
    } catch (err) {
        console.log(err);
        req.statusCode = 500;
        req.json(responseJSON(500, { error: 'Internal Server Error' }))
    }
});

user.get('/getAccessToken', async (res, req) => {
    try {
        const refresh_token = res.header('RefreshToken');
        if (!refresh_token) {
            req.statusCode = 401;
            return req.json(responseJSON(401, { error: messages.emptyRefreshToken }));
        }

        const user = await repository.getUserByRefreshToken(refresh_token);
        if (!user) {
            req.statusCode = 404;
            return req.json(responseJSON(404, { error: messages.refreshTokenNotFound }));
        }
        
        const newRefresh_token = crypto.randomBytes(16).toString('hex');

        const updateRefreshToken = await repository.updateRefereshToken(user.id, newRefresh_token)
        if (!updateRefreshToken) {
            req.statusCode = 500;
            req.json(responseJSON(500, { error: 'Internal Server Error' }));
        }

        const access_token = generateJWT({ id: user.id, email: user.email }, { expiresIn: '1h' });

        req.statusCode = 200;
        return req.json(responseJSON(200, { access_token, refresh_token: newRefresh_token }));
    } catch (err) {
        console.log(err);
        req.statusCode = 500;
        req.json(responseJSON(500, { error: 'Internal Server Error' }));
    }
})

export {user}