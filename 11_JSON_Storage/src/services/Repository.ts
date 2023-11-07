import { Collection, Db, Document, MongoClient } from "mongodb";
import { jsonObject } from "../module/interafaceJsonObject";

class Repository {
    client: MongoClient;
    db: Db;
    collection_json: Collection<Document>;

    constructor() {
        this.client = new MongoClient(process.env.MONGO_URL!);
        this.db = this.client.db(process.env.MONGO_DB);
        this.collection_json = this.db.collection('json');
    }

    async insertJSON(json:jsonObject) {
        try{
            const result = await this.collection_json.insertOne(json);
            return result
        }catch(err){
            console.log(err);
        }
    }

    async getJSON(link : string){
        try{
            const result = await this.collection_json.findOne({link});
            return result
        }catch(err){
            console.log(err);
        }
    }

}
export { Repository }