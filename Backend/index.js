import express from "express"
import dotenv from "dotenv";
import cors from "cors"
import connectToMongoDB from "./db/db.js";

import authRouter from "./routes/auth.js";
import noteRouter from "./routes/note.js";

const app = express();
dotenv.config();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/note", noteRouter);

app.listen(port, () => {
    connectToMongoDB();
    console.log(`Server is Running ${port}`);
});