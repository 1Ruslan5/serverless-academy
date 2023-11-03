import express from 'express';
import crypto from "crypto";
import jwt from "jsonwebtoken";
import {validateEmail} from "../utils/validateEmail.mjs"
import { checkPassword } from "../utils/checkPassword.mjs";
import { messages } from '../utils/messageToUser.mjs';
import { Repository } from "../services/Repository.mjs";
import { responseJSON } from '../utils/responseJSON.mjs';
import bcrypt from "bcrypt";

const auth = express.Router();
const repository = new Repository();

auth.post('/sign-in', async (req, res) => {
    try {
        const { email, password } = req.body;

        const emptyMailandPassword = checkForEmptyEmailAndPassword(email, password);
        if (emptyMailandPassword) return res.status(emptyMailandPassword.status).json(emptyMailandPassword);

        const userExistence = await repository.getUserByEmail(email);
        if (!userExistence) return res.status(404).json(responseJSON(404, { error: messages.userNotFound }));

        const properlyPassword = await bcrypt.compare(password, userExistence.password);
        if(!properlyPassword) return res.status(401).json(responseJSON(401, "Invalid password"));

        const refresh_token = crypto.randomBytes(16).toString('hex');

        const { id } = await repository.getUserByEmail(email);
        const updateRefreshToken = await repository.updateRefereshToken(id, refresh_token);
        if(!id || !updateRefreshToken){
            res.status(500).json(responseJSON(500, { error: 'Internal Server Error' }))
        }

        const access_token = jwt.sign({ id, email }, process.env.SECRET_KEY, { expiresIn: '1h' })

        return res.status(201).json(responseJSON(201, { id, access_token, refresh_token }));
    } catch (err) {
        console.log(err);
        res.status(500).json(responseJSON(500, { error: 'Internal Server Error' }))
    }
});

auth.post('/sign-up', async (req, res) => {
    try {
        const { email, password } = req.body;

        const emptyMailandPassword = checkForEmptyEmailAndPassword(email, password);
        if (emptyMailandPassword) return res.status(emptyMailandPassword.status).json(emptyMailandPassword);
        const validEmailAndPassword = checkForValidEmailAndPassword(email, password);
        if (validEmailAndPassword) return res.status(validEmailAndPassword.status).json(validEmailAndPassword);

        const userExistence = await repository.checkUserByEmail(email);
        if (userExistence) return res.status(409).json(responseJSON(409, { error: messages.sameEmail }));

        const refresh_token = crypto.randomBytes(16).toString('hex');
        const hashPassword = await bcrypt.hash(password, 1);

        const userId = await repository.createUser({ email, hashPassword, refresh_token });
        if(!userId) return res.status(500).json(responseJSON(500, { error: 'Internal Server Error' }));

        const access_token = jwt.sign({ id: userId, email }, process.env.SECRET_KEY, { expiresIn: '1h' });

        return res.status(201).json(responseJSON(201, { id: userId, access_token, refresh_token }));
    } catch (err) {
        console.log(err);
        res.status(500).json(responseJSON(500, { error: 'Internal Server Error' }));
    }

});

export {auth};

function checkForEmptyEmailAndPassword(email, password) {
    if (!email) return responseJSON(401, { error: messages.emptyEmail });
    if (!password) return responseJSON(401, { error: messages.emptyPassword });
    return null
}

function checkForValidEmailAndPassword(email, password) {
    if (!validateEmail(email)) return responseJSON(401, { error: messages.invalidEmail });
    if (!checkPassword(password)) return responseJSON(401, { error: messages.invalidPassword });
    return null
}
