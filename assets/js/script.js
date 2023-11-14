// Querying a lot of HTML elements. Elements are sorted by order of appearance.
var viewHighscores = document.querySelector('#view-scores');
var scoreDisplay = document.querySelector('#score');
var feedbackText = document.querySelector("#feedback-text");

var startScreen = document.querySelector('.start');
var startButton = document.querySelector('#start-button');

var quizScreen = document.querySelector('.quiz');
var questionsArea = document.querySelector('.question-area');

var endScreen = document.querySelector('.end');
var initialsField = document.querySelector('#initials-field');
var submitButton = document.querySelector('#submit-button');

var scoresScreen = document.querySelector('.highscores');
var highscoresList = document.querySelector('#highscore-list');
var clearScoresButton = document.querySelector('#clear-scores-button');
var playAgainButton = document.querySelector('#play-again-button');

var questions = [
    {
        "question": "What is JavaScript primarily used for?",
        "answers": ["Styling web pages", "Enhancing the layout of web pages", "Adding interactivity to web pages", "Structuring the content of web pages"],
        "correctAnswer": 2
    },
    {
        "question": "How do you include an external JavaScript file in an HTML document?",
        "answers": ['<script src="script.js"></script>', '<javascript src="script.js"></javascript>', '<link rel="js" href="script.js">', '<include script="script.js">'],
        "correctAnswer": 0
    },
    {
        "question": "Which of the following is not a commonly used data type in JavaScript?",
        "answers": ["number", "float", "integer", "string"],
        "correctAnswer": 2
    },
    {
        "question": "How many possible values can be stored in the boolean data type?",
        "answers": ["1", "2", "3", "4"],
        "correctAnswer": 1
    },
    {
        "question": "What is the purpose of the 'alert()' function in JavaScript",
        "answers": ["Display an input box", "Print an error to the console", "Execute a loop", "Display a message box with a specified message"],
        "correctAnswer": 3
    }
];
var index = 0;

var score = 100;
var highscores = [];
var timer;

function show(screen) {
    // Clears start, end, and quiz displays and shows the section with the class specified in the "screen" variable
    startScreen.style.display = "none";
    quizScreen.style.display = "none";
    endScreen.style.display = "none";
    scoresScreen.style.display = "none";

    document.querySelector("." + screen).style.display = null;
}

function startQuiz() {
    // Resetting some important variables
    index = 0;
    score = 100;
    scoreDisplay.textContent = "Score: " + score;

    // Shows the quiz section, displays the first question, and starts the timer.
    show('quiz');
    displayQuestion();
    timer = setInterval(decrementScore, 1000, 1);
}

function displayQuestion() {
    // Clears the question area
    questionsArea.innerHTML = null;

    // Gets the question from the "questions" list and adds it to the questions area as a paragraph (I might change to h3)
    var questionElement = document.createElement('p');
    questionElement.textContent = questions[index].question
    questionsArea.appendChild(questionElement);

    // Gets the answers from the "questions" list and adds them to the questions area as buttons
    var answers = questions[index].answers;
    for (var i = 0; i < answers.length; i++) {
        var answerElement = document.createElement('button');
        answerElement.textContent = answers[i];
        answerElement.setAttribute("style", "display: block;");
        questionsArea.appendChild(answerElement);
    }
}

function decrementScore(amount) {
    score -= amount;
    scoreDisplay.textContent = "Score: " + score;
    if (score <= 0) {
        clearInterval(timer);
        show('end');
    }
}

// The following function renders items in the highscores list as <li> elements
function renderHighscores() {
    // Clear highscoresList element
    highscoresList.innerHTML = "";
  
    // sort the list by score in descending order
    highscores = highscores.sort(function(a, b){return b.score - a.score})
    // Render a new li for each highscore, including initials and score
    for (var i = 0; i < highscores.length; i++) {
      var highscore = highscores[i];
  
      var li = document.createElement("li");
      li.textContent = highscore.initials + " - " + highscore.score;
      li.setAttribute("data-index", i);

      highscoresList.appendChild(li);
    }
  }

viewHighscores.addEventListener('click', function() {
    // if the timer is active, stop it.
    if (timer) {
        clearInterval(timer);
    }
    show('highscores');
})

startButton.addEventListener('click', function() {
    startQuiz();
})

quizScreen.addEventListener('click', function(event) {
    if (event.target.matches('button')) {
        // If the answer does not match the correct answer for that index, remove 15 score.
        if (event.target.textContent != questions[index]["answers"][questions[index]['correctAnswer']]) // this is messy but... it works
        {
            decrementScore(15);
            feedbackText.textContent = "WRONG";
            setTimeout(() => {feedbackText.textContent = ""}, 1000);
        } else {
            feedbackText.textContent = "CORRECT";
            setTimeout(() => {feedbackText.textContent = ""}, 1000);
        }

        // If there's still questions in the list, we display the next one.
        index++;
        if (questions[index]) {
            displayQuestion();
            return;
        }

        //  Otherwise, we stop the timer and progress to the end screen.
        clearInterval(timer);
        show('end');
    }
})

submitButton.addEventListener('click', function(event) {
    event.preventDefault();

    // add data from the forum and score to the local highscores list
    highscores.push({
        "initials": initialsField.value,
        "score": score
    });

    // clear text field
    initialsField.value = "";

    // update local storage and move to highscores page
    localStorage.setItem("highscores", JSON.stringify(highscores));
    show('highscores');
    renderHighscores();
});

clearScoresButton.addEventListener('click', function() {
    highscores = [];
    localStorage.removeItem('highscores');
    renderHighscores();
});

playAgainButton.addEventListener('click', function() {
    show('start');
})

function init() {
    // fetch highscore data from local storage, if it exists.
    var storedHighscores = JSON.parse(localStorage.getItem("highscores"));
    if (storedHighscores !== null) {
        highscores = storedHighscores;
    }

    show('start');
}

init();
