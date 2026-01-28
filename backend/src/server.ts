import express from 'express';
import passport from "passport";
import "./config/passport";
import type { Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectdb from './config/connectdb'
import UserRoutes from './routes/UserRoutes';
import PostRoutes from './routes/PostRoutes';
import CommentRoutes from './routes/CommentRoutes';


connectdb();
const app =express();
const PORT = process.env.PORT||3000 ;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use('/user',UserRoutes);
app.use('/post',PostRoutes);
app.use('/comment',CommentRoutes)

app.get('/',(req:Request ,res:Response)=>{
    res.send('hello');
})

app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`);
})



