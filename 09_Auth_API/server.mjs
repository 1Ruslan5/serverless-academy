import express from "express";
import { auth } from "./controllers/auth.mjs";
import { user } from "./controllers/user.mjs";

const app = express();

const port = process.env.PORT;

app.use(express.json());

app.use('/auth', auth);
app.use(user);

app.listen(port, () => {
    console.log(`Start server on port ${port}`);
})