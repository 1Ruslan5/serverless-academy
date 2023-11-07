import { Collection, Db, Document, MongoClient } from 'mongodb';
import { objectLink } from '../module/interfaceLink';

class Repository {
    client: MongoClient;
    db: Db;
    collection_link: Collection<Document>;

    constructor() {
        this.client = new MongoClient(process.env.MONGO_URL!);
        this.db = this.client.db(process.env.MONGO_DB);
        this.collection_link = this.db.collection('link');
    }

    insertLinks = async (links: objectLink) => {
        try {
            const response = await this.collection_link.insertOne(links);
            return response
        } catch (err) {
            console.log(err);
        }
    }

    getLinksByShort = async (shortLink: string) => {
        try {
            const response = await this.collection_link.findOne({ shortLink });
            return response
        } catch (err) {
            console.log(err);
        }
    }

    getLinksByLong = async (longLink: string) => {
        try {
            const response = await this.collection_link.findOne({ longLink });
            return response
        } catch (err) {
            console.log(err);
        }
    }
}

export { Repository } 