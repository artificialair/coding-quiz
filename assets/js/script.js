var startScreen = document.querySelector('.start');
var quizScreen = document.querySelector('.quiz');
var endScreen = document.querySelector('.end');
var scoresScreen = document.querySelector('.highscores');
var startButton = document.querySelector('#start-button');
var questionsArea = document.querySelector('.question-area');
var viewHighscores = document.querySelector('#view-scores');
var scoreDisplay = document.querySelector('#score');

var initialsField = document.querySelector('#initials-field');
var submitButton = document.querySelector('#submit-button');

var highscores = [];

var questions = [
    {
        "question": "test question 1",
        "answers": ["a", "b", "c", "d"],
        "correctAnswer": 1
    },
    {
        "question": "test question 2",
        "answers": ["a", "a", "c", "d"],
        "correctAnswer": 2
    },
    {
        "question": "test question 3",
        "answers": ["a", "4", "c", "d"],
        "correctAnswer": 3
    },
    {
        "question": "test question 4",
        "answers": ["a", "b", "c", "d"],
        "correctAnswer": 0
    }
];
var index = 0;

var score = 100;
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

viewHighscores.addEventListener('click', function() {
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

    highscores += {
        "initials": initialsField.value,
        "score": score
    }

    console.log(highscores)

    localStorage.setItem("highscores", JSON.stringify(highscores))
});

function init() {
    var storedHighscores = JSON.parse(localStorage.getItem("highscores"));
    if (storedHighscores !== null) {
        highscores = storedHighscores;
    }
    
    show('start');
}

init();