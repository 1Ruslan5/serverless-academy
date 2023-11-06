import express from 'express';
import { responseJSON } from '../utils/responseJSON';
import { messages } from '../utils/messageToUser';
import { Repository } from '../services/Repository';

const jsonR = express.Router();
const repository = new Repository();

jsonR.put('/*', async (req, res) => {
    try {
        const { url: link, body, protocol  } = req;
        if (!body || !link) {
            return res.status(401).json(responseJSON(401, { error: messages.emptyLinkOrBody }));
        }

        const existenceSameLink = await repository.getJSON(link);
        if (existenceSameLink) {
            return res.status(409).json(responseJSON(409, { error: messages.sameLink }));
        }

        const sendLink = await repository.insertJSON({ link, body });
        if (!sendLink) {
            res.status(500).json(responseJSON(500, { error: 'Internal Server Error' }))
        }

        const fullLink = protocol + '://' + req.get('host') + link

        return res.status(201).json(responseJSON(201, { link: fullLink }))
    } catch (err) {
        console.log(err);
        res.status(500).json(responseJSON(500, { error: 'Internal Server Error' }))
    }
});

jsonR.get('/*', async (req, res) => {
    try {
        const { url: link } = req;

        if (!link) {
            return res.status(401).json(responseJSON(401, { error: messages.emptyLink }));
        }

        const json = await repository.getJSON(link);
        if (!json) {
            return res.status(404).json(responseJSON(404, { error: messages.notFoundLink }));
        }

        return res.status(201).json(responseJSON(200,  json.body))
    } catch (err) {
        console.log(err);
        res.status(500).json(responseJSON(500, { error: 'Internal Server Error' }))
    }
})

export { jsonR }
