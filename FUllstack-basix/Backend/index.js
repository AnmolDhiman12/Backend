const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
const port = 5000;
// app.use(express.static('dist')); // bad practice 
app.get('/api/jokes', (req, res) => {
  const jokes = [
    {
      id: 1,
      setup: "Why don't scientists trust atoms?",
      punchline: "Because they make up everything!"
    },
    {
      id: 2,
      setup: "Why did the math book look sad?",
      punchline: "Because it had too many problems."
    },
    {
      id: 3,
      setup: "Why don’t skeletons fight each other?",
      punchline: "They don’t have the guts."
    },
    {
      id: 4,
      setup: "I told my computer I needed a break.",
      punchline: "It said: 'No problem, I’ll go to sleep.'"
    },
    {
      id: 5,
      setup: "Why did the scarecrow win an award?",
      punchline: "Because he was outstanding in his field!"
    }
  ];
  res.send(jokes);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
