require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/twitter',(req,res)=>{
    res.send('anmoldhiman')
})

app.get('/youtube',(req,res)=>{
    res.send("<h1>Anmol Dhiman is Live/h1>");
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.get('/login',(req,res)=>{
    res.send("<h1>Please login at  chai with code</h1>");
})
