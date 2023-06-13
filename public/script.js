// front end js

const getJokeBut = document.getElementById('get-joke-button');
const getAllJokesBut = document.getElementById('get-all-jokes-butt');
const displayJoke = document.getElementById('joke-text');
const allJokesField = document.getElementById('all-jokes-field');

let paragraph;
let visible = false;

const toggle = () => {
    visible = !visible;
    console.log(visible);
}

const buttonTextToggle = () => {
    if (visible == true) {
        getAllJokesBut.innerHTML = "Get all jokes";
    } else {
        getAllJokesBut.innerHTML = "Hide jokes";
    }
}

const renderJoke = (joke) => {
    displayJoke.innerHTML = joke;
}

const deleteElement = (idOfJoke) => {
    const idNameOfJoke = "joke-delete-" + idOfJoke;
    console.log(idNameOfJoke);
    console.log(`Element with id if ${idOfJoke} should be deleted from DOM`);
    const parentToDelete = document.getElementById(idNameOfJoke).parentElement.parentElement;
    parentToDelete.remove();
  }

const deleteJoke = (id) => {
    fetch('/jokes/' + id, {
      method: 'DELETE'
    })
      .then(response => {
        if (response.ok) {
          return response.text();
        } else {
          throw new Error('Failed to delete joke');
        }
      })
      .then(message => {
        console.log(message);
        deleteElement(id)
      })
      .catch(error => {
        console.log(error);
      });
  }


const formatJokes = (arr) => {
    if (arr.jokes.length > 0) {
        for (let i = 0; i < arr.jokes.length; i++) {
            const newJokeField = document.createElement('div');
            newJokeField.className = "new-joke-field";

            const jokeHeaderDiv = document.createElement('div');
            const jokeIndex = document.createElement('p');
            const jokeDelete = document.createElement('p');
            const line = document.createElement('hr');

            jokeHeaderDiv.className = "joke-header-div";
            jokeHeaderDiv.appendChild(jokeIndex);
            jokeHeaderDiv.appendChild(jokeDelete);

            line.className = "line";
            jokeIndex.className = "joke-index";
            jokeDelete.className = "joke-delete";
            const idName = "joke-delete-" + arr.jokes[i].id;
            jokeDelete.setAttribute('id', idName);

            const jokeDeleteElements = document.getElementsByClassName("joke-delete");
            const indexik = arr.jokes[i].id;

            jokeDelete.addEventListener('click', () => {
                deleteJoke(indexik);
            });

            jokeIndex.innerHTML = "#" + arr.jokes[i].id;
            jokeDelete.innerHTML = "Delete";


            const newJoke = document.createElement('p');
            newJoke.className = "new-joke"
            newJoke.innerHTML = arr.jokes[i].text;
            newJokeField.appendChild(jokeHeaderDiv);
            newJokeField.appendChild(line);
            newJokeField.appendChild(newJoke);
            allJokesField.appendChild(newJokeField); 
        }
    } else {
        const errorMessage = '<p>no jokes rendered - error</p>'
        allJokesField.appendChild(errorMessage);
    }
}

const cleanJokes = () => {
    displayJoke.innerHTML = "";
}


getJokeBut.addEventListener('click', () => {
    fetch('/jokes')
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error ('Request failed!')
        }
    })
    .then(response => {
        renderJoke(response.joke);
    })
});

getAllJokesBut.addEventListener('click', () => {
    if (visible == false) {
        fetch('/jokes/all')
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error ('Request failed!')
            }
        })
        .then(response => {
            formatJokes(response);
            buttonTextToggle();
            toggle();

        })
    } else if (visible == true) {
        allJokesField.innerHTML = "";
        buttonTextToggle();
        toggle();
    }
});