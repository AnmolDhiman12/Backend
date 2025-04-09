import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
const app = express()

app.use(cors());
app.use(cors({
    origin:process.env.CLIENT_URL,
    credentials:false,
    methods:["GET","POST","PUT","DELETE"]
}))
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"})) // url ke andar url
app.use(express.static("public"))
app.use(cookieParser())
//routes import 
import { Userrouter } from './routes/Userrouter.js';
app.get('/', (req, res) => {
  res.send('Hello World!')
})
// routes decleration
app.use("/api/v1/users",Userrouter) // it means when the user go  to user then the conmtroller go to  userroute and then it goes to register or login

  
export {app};