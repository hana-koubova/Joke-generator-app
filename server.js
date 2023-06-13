const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser')

const jokesJson = fs.readFileSync('./jokes.json', 'utf-8');
const jokes = JSON.parse(jokesJson).jokes;

const randomElement = require('./helper');
const jokesData = require('./jokes.json');

const port = process.env.PORT || 4001;

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/jokes', (req, res) => {
    const randomJoke = randomElement(jokes);
    res.json({ joke: randomJoke.text });
});

app.get('/jokes/all', (req, res) => {
    res.send(jokesJson);
})

app.post('/new-joke-submit', (req, res, next) => {
    console.log(req.body);

    const newJoke = {
        id: jokesData.jokes.length + 1,
        text: req.body.jokeNew
      };
      jokes.push(newJoke);
    fs.writeFile('./jokes.json', JSON.stringify({ jokes: jokes }, null, 2), (error) => {
        if (error) {
          console.log('An error occurred while updating the database:', error);
          return;
        }
        console.log('Database updated successfully');
      });

    res.send(`
        <script>
            setTimeout(() => {
                window.location.href = 'index.html';
                }, 2000);
        </script>
        <p>Hello, you submitted a joke. Well done!</p>
    `);
    next();
});

app.delete('/jokes/:id', (req, res, next) => {
    const id = req.params.id;
    console.log("This is id in the back-end: " + id);

    // generate array that will be updated (incl indexes)

    const jokesArrDeleted = JSON.parse(jokesJson).jokes;
    jokesArrDeleted.splice(id-1, 1);
    for (let i = 0; i < jokesArrDeleted.length; i++) {
        jokesArrDeleted[i].id = i + 1;
    }
    console.log(jokesArrDeleted);

    // update the database

    fs.writeFile('./jokes.json', JSON.stringify({ jokes: jokesArrDeleted }, null, 2), (error) => {
        if (error) {
          console.log('An error occurred while updating the database:', error);
          return;
        }
        console.log('Database updated successfully - joke deleted');
      });

    res.send('I got the id');
})

app.listen(port, () => {
    console.log(`Listening to ${port}`);
});

