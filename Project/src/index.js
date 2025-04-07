import dotenv from 'dotenv';
import express from 'express';
const app  =express();
dotenv.config({
    path:'./env'
})
import connectDB from './db/index.js';
connectDB().then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server  is Connected at ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("MONGODB Connection failed");
})
/*
;( async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        app.on("error",(error)=>{
            console.error(error);
        })

        app.listen(process.env.PORT,()=>{
            console.log(`App is Listening on ${process.env.PORT}`)
        })
    } catch (error) {
        console.log(error);
    }
})()

*/