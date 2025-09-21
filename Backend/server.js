import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import router from './Routes/ICD-11.js';

dotenv.config();

const app=express();
app.use(cors());
app.use(express.json())

app.use("/",router)
const PORT=process.env.PORT||5000;
app.listen(PORT,()=> console.log(`Server running on port ${PORT}`));
