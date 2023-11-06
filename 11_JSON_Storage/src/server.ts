import express from "express";
import { jsonR } from "./controllers/json";

const app = express();
const port = process.env.PORT!;

app.use(express.json());

app.use(jsonR);

app.listen(port, async () =>{
    console.log(`Start server on port ${port}`);
})