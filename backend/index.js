
import cookieParser from 'cookie-parser';
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './Config/db.js';
import AuthRouter from './Routes/AuthRouter.js';
import LeadRouter from './Routes/LeadRouter.js';

const app=express()
dotenv.config();

const PORT = process.env.PORT || 8080

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: "https://lead-management-frontend-j06o.onrender.com",
    credentials: true
}));

app.get('/',(req,res)=>{
    res.send('Welcome to the APP')
})

app.use('/api/auth', AuthRouter)
app.use('/api/leads', LeadRouter)


app.listen(PORT,()=>{
    connectDB()
    console.log(`Server is running on port ${PORT}`)
})
