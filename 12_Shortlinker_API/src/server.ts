import express from "express";
import { shortLinks } from "./controllers/shortLinks";

const app = express();
const port = process.env.PORT!;

app.use(express.json());

app.use(shortLinks);

app.listen(port, ()=>{
    console.log(`Start server on port ${port}`);
})