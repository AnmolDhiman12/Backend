import dotenv from 'dotenv';
import connectDB from './db/index.js';
import { app } from './app.js';

dotenv.config({ path: './.env' });

connectDB().then(() => {
  app.listen(process.env.PORT || 8000, () => {
    console.log(`🚀 Server running at http://localhost:${process.env.PORT || 8000}`);
  });
});

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