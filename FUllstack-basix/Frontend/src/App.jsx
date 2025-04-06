import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios';
function App() {
  const [joke, setJoke] = useState([])
  useEffect(()=>{
    axios.get('/api/jokes').then(
      (res)=>setJoke(res.data)
    )
  },[]);
  return (
    <>
    <h1> Chai aur code</h1>
    <p> JOKES :{joke.length}</p>
    {
      joke.map((item) =>{
        return (
          <div key={item.id}>
            <h2>{item.setup}</h2>
            <p>{item.punchline}</p>
          </div>
        )
      })
    }
    </>
  )
}

export default App
