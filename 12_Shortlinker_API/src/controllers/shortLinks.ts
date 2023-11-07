import express from "express";
import { Repository } from "../services/Repository";
import { responseJSON } from "../utils/responseJSON";
import { messages } from "../utils/messageToUser";
import { generateRandomLink } from "../utils/generateRandomLink";
import { checkValidUserLink } from "../utils/checkValidUserLink";

const repository = new Repository();
const shortLinks = express.Router();

shortLinks.post('/shortLink', async (req, res) => {
    try {
        const { body: { link:fullLongLink }, protocol } = req;

        if (!fullLongLink) {
            return res.status(401).json(responseJSON(401, { error: messages.emptyLink }))
        }

        const checkedUserLink = await checkValidUserLink(fullLongLink)
        if(!checkedUserLink){
            return res.status(401).json(responseJSON(401, { error: messages.unvalidUserLink }));
        }

        const sameShortLink = await repository.getLinksByLong(fullLongLink);
        if (sameShortLink) {
            return res.status(200).json(responseJSON(200, { shortLink: sameShortLink.shortLink }));
        }
        const shortLink = await generateRandomLink(8, protocol, req.get('host')!);
        const linkObject = { longLink: fullLongLink, shortLink };
        const insertLinks = await repository.insertLinks(linkObject);
        if (!insertLinks) {
            res.status(500).json(responseJSON(500, { error: 'Internal Server Error' }))
        }

        return res.status(201).json(responseJSON(201, { shortLink }));
    } catch (err) {
        console.log(err);
        res.status(500).json(responseJSON(500, { error: 'Internal Server Error' }))
    }
});

shortLinks.get('/*', async (req, res) => {
    try {
        const { protocol, originalUrl } = req;
        const shortLink = `${protocol}://${req.get('host')}${req.originalUrl}`;
        const link = await repository.getLinksByShort(shortLink);
        if (!link) {
            res.statusCode = 404
            return res.json(responseJSON(404, { error: messages.notFoundLink }));
        }

        return res.redirect(link.longLink);
    } catch (err) {
        console.log(err);
        res.status(500).json(responseJSON(500, { error: 'Internal Server Error' }))
    }
})

export { shortLinks }

