// ==========================================
// CCC QUEST - QUIZ ENGINE
// ==========================================

// ---------- Demo Question Bank ----------

const questionBank = [
    {
        english: "What is Computer?",
        hindi: "कंप्यूटर क्या है?",
        options: [
            "An electronic device",
            "A type of network",
            "A communication cable",
            "A type of software"
        ],
        correct: 0,
        explanation:
            "A computer is an electronic device that accepts data, processes it and produces information."
    },

    {
        english: "Which of the following is a basic function of a computer?",
        hindi: "निम्नलिखित में से कंप्यूटर का मूल कार्य कौन सा है?",
        options: [
            "Input",
            "Cooking",
            "Driving",
            "Printing money"
        ],
        correct: 0,
        explanation:
            "Input is one of the basic functions of a computer."
    },

    {
        english: "Which component is used to enter data into a computer?",
        hindi: "कंप्यूटर में डेटा दर्ज करने के लिए किस घटक का उपयोग किया जाता है?",
        options: [
            "Input device",
            "Output device",
            "Speaker",
            "Monitor"
        ],
        correct: 0,
        explanation:
            "Input devices are used to enter data and instructions into a computer."
    },

    {
        english: "Which device is commonly used to display information?",
        hindi: "जानकारी प्रदर्शित करने के लिए सामान्यतः किस डिवाइस का उपयोग किया जाता है?",
        options: [
            "Monitor",
            "Keyboard",
            "Mouse",
            "Scanner"
        ],
        correct: 0,
        explanation:
            "A monitor is an output device used to display information."
    },

    {
        english: "Which device is commonly used to enter text?",
        hindi: "टेक्स्ट दर्ज करने के लिए सामान्यतः किस डिवाइस का उपयोग किया जाता है?",
        options: [
            "Keyboard",
            "Monitor",
            "Speaker",
            "Projector"
        ],
        correct: 0,
        explanation:
            "A keyboard is an input device commonly used to enter text."
    }
];


// ---------- Quiz State ----------

let currentQuestion = 0;
let quizScore = 0;
let quizXP = 0;
let lives = 3;
let streak = 0;
let questionAnswered = false;
let timerValue = 30;
let timerInterval = null;


// ---------- Player Data ----------

let playerData = JSON.parse(
    localStorage.getItem("cccQuestPlayer")
) || {
    xp: 0,
    level: 1,
    questionsAttempted: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    bestStreak: 0
};


// ---------- Elements ----------

const homeScreen =
    document.getElementById("homeScreen");

const quizScreen =
    document.getElementById("quizScreen");

const playQuizButton =
    document.getElementById("playQuizButton");

const quitQuizButton =
    document.getElementById("quitQuizButton");

const questionEnglish =
    document.getElementById("questionEnglish");

const questionHindi =
    document.getElementById("questionHindi");

const optionsContainer =
    document.getElementById("optionsContainer");

const questionNumber =
    document.getElementById("questionNumber");

const totalQuestions =
    document.getElementById("totalQuestions");

const quizProgress =
    document.getElementById("quizProgress");

const livesElement =
    document.getElementById("lives");

const streakElement =
    document.getElementById("streak");

const quizXPElement =
    document.getElementById("quizXP");

const timerElement =
    document.getElementById("timer");

const answerCard =
    document.getElementById("answerCard");

const answerStatus =
    document.getElementById("answerStatus");

const answerExplanation =
    document.getElementById("answerExplanation");

const nextQuestionButton =
    document.getElementById("nextQuestionButton");


// ---------- Save Data ----------

function savePlayerData() {

    localStorage.setItem(
        "cccQuestPlayer",
        JSON.stringify(playerData)
    );

}


// ---------- Update Home XP ----------

function updatePlayerUI() {

    const xpValue =
        document.getElementById("xpValue");

    const xpProgress =
        document.getElementById("xpProgress");

    const levelElement =
        document.querySelector(".player-info h2");

    if (!xpValue || !xpProgress) return;

    const level =
        Math.floor(playerData.xp / 1000) + 1;

    const currentLevelXP =
        playerData.xp % 1000;

    playerData.level = level;

    xpValue.textContent =
        `${currentLevelXP} / 1000`;

    xpProgress.style.width =
        `${currentLevelXP / 10}%`;

    if (levelElement) {
        levelElement.textContent =
            `Level ${level}`;
    }

}


// ---------- Start Quiz ----------

function startQuiz() {

    currentQuestion = 0;
    quizScore = 0;
    quizXP = 0;
    lives = 3;
    streak = 0;

    homeScreen.style.display = "none";
    quizScreen.style.display = "block";

    totalQuestions.textContent =
        questionBank.length;

    loadQuestion();

}


// ---------- Load Question ----------

function loadQuestion() {

    clearInterval(timerInterval);

    questionAnswered = false;

    const question =
        questionBank[currentQuestion];

    questionEnglish.textContent =
        question.english;

    questionHindi.textContent =
        question.hindi;

    questionNumber.textContent =
        currentQuestion + 1;

    quizXPElement.textContent =
        quizXP;

    livesElement.textContent =
        lives;

    streakElement.textContent =
        streak;

    const progress =
        ((currentQuestion + 1) /
        questionBank.length) * 100;

    quizProgress.style.width =
        `${progress}%`;


    // Reset answer area

    answerCard.style.display =
        "none";

    nextQuestionButton.style.display =
        "none";


    // Create options

    optionsContainer.innerHTML = "";


    question.options.forEach(
        (option, index) => {

            const button =
                document.createElement("button");

            button.className =
                "option-button";

            button.dataset.option =
                index;

            const letter =
                String.fromCharCode(
                    65 + index
                );

            button.innerHTML = `
                <span class="option-letter">
                    ${letter}
                </span>

                <span class="option-text">
                    ${option}
                </span>
            `;

            button.addEventListener(
                "click",
                () => selectAnswer(index)
            );

            optionsContainer.appendChild(
                button
            );

        }
    );


    // Start timer

    startTimer();

}


// ---------- Timer ----------

function startTimer() {

    timerValue = 30;

    timerElement.textContent =
        timerValue;

    timerInterval =
        setInterval(() => {

            timerValue--;

            timerElement.textContent =
                timerValue;

            if (timerValue <= 0) {

                clearInterval(timerInterval);

                if (!questionAnswered) {

                    handleWrongAnswer(
                        -1,
                        true
                    );

                }

            }

        }, 1000);

}


// ---------- Select Answer ----------

function selectAnswer(selectedIndex) {

    if (questionAnswered) return;

    questionAnswered = true;

    clearInterval(timerInterval);

    const question =
        questionBank[currentQuestion];

    const buttons =
        document.querySelectorAll(
            ".option-button"
        );


    buttons.forEach(button => {

        button.disabled = true;

    });


    if (selectedIndex === question.correct) {

        handleCorrectAnswer(
            selectedIndex
        );

    } else {

        handleWrongAnswer(
            selectedIndex,
            false
        );

    }

}


// ---------- Correct Answer ----------

function handleCorrectAnswer(
    selectedIndex
) {

    const question =
        questionBank[currentQuestion];

    const buttons =
        document.querySelectorAll(
            ".option-button"
        );

    buttons[selectedIndex]
        .classList.add("correct");

    quizScore++;

    streak++;

    const earnedXP = 100;

    quizXP += earnedXP;

    playerData.xp += earnedXP;

    playerData.questionsAttempted++;

    playerData.correctAnswers++;

    if (
        streak >
        (playerData.bestStreak || 0)
    ) {

        playerData.bestStreak =
            streak;

    }

    savePlayerData();

    answerStatus.textContent =
        "✅ Correct Answer!";

    answerStatus.style.color =
        "var(--green)";

    answerExplanation.textContent =
        question.explanation;

    answerCard.style.display =
        "block";

    nextQuestionButton.style.display =
        "block";

    quizXPElement.textContent =
        quizXP;

    streakElement.textContent =
        streak;

}


// ---------- Wrong Answer ----------

function handleWrongAnswer(
    selectedIndex,
    timedOut
) {

    const question =
        questionBank[currentQuestion];

    const buttons =
        document.querySelectorAll(
            ".option-button"
        );


    if (
        selectedIndex >= 0 &&
        buttons[selectedIndex]
    ) {

        buttons[selectedIndex]
            .classList.add("wrong");

    }


    // Highlight correct answer

    if (buttons[question.correct]) {

        buttons[question.correct]
            .classList.add("correct");

    }


    lives--;

    streak = 0;

    playerData.questionsAttempted++;

    playerData.wrongAnswers++;

    savePlayerData();


    livesElement.textContent =
        lives;

    streakElement.textContent =
        streak;


    if (timedOut) {

        answerStatus.textContent =
            "⏰ Time's Up!";

    } else {

        answerStatus.textContent =
            "❌ Wrong Answer!";

    }

    answerStatus.style.color =
        "var(--red)";


    answerExplanation.textContent =
        `${question.explanation} ` +
        `Correct answer: ` +
        `${question.options[question.correct]}.`;


    answerCard.style.display =
        "block";

    nextQuestionButton.style.display =
        "block";


    // No lives left

    if (lives <= 0) {

        nextQuestionButton.textContent =
            "View Result →";

    }

}


// ---------- Next Question ----------

nextQuestionButton.addEventListener(
    "click",
    function () {

        if (lives <= 0) {

            showQuizResult();

            return;

        }


        currentQuestion++;


        if (
            currentQuestion >=
            questionBank.length
        ) {

            showQuizResult();

            return;

        }


        loadQuestion();

    }
);


// ---------- Quiz Result ----------

function showQuizResult() {

    clearInterval(timerInterval);

    const percentage =
        Math.round(
            (quizScore /
            questionBank.length) * 100
        );


    quizScreen.innerHTML = `

        <div class="question-card"
             style="margin-top:40px;text-align:center;">

            <div class="question-label">
                QUIZ COMPLETE
            </div>

            <h2>
                🎉 Great Job!
            </h2>

            <p class="question-hindi">
                Your Quiz Results
            </p>

            <div style="
                margin-top:25px;
                font-size:40px;
                font-weight:bold;
            ">
                ${percentage}%
            </div>

            <p style="
                margin-top:10px;
                color:#8d96a8;
                font-size:13px;
            ">
                ${quizScore}
                / ${questionBank.length}
                correct
            </p>

            <div style="
                margin-top:25px;
                color:#ffc857;
                font-size:15px;
            ">
                ⭐ ${quizXP} XP earned
            </div>

        </div>


        <button
            class="next-button"
            id="backHomeButton">

            Back to Home

        </button>

    `;


    document
        .getElementById("backHomeButton")
        .addEventListener(
            "click",
            returnHome
        );

}


// ---------- Return Home ----------

function returnHome() {

    clearInterval(timerInterval);

    quizScreen.style.display =
        "none";

    homeScreen.style.display =
        "block";

    updatePlayerUI();

}


// ---------- Quit Quiz ----------

quitQuizButton.addEventListener(
    "click",
    function () {

        const shouldQuit =
            confirm(
                "Quit this quiz?"
            );

        if (shouldQuit) {

            returnHome();

        }

    }
);


// ---------- Play Button ----------

playQuizButton.addEventListener(
    "click",
    startQuiz
);


// ---------- Other Home Buttons ----------

document
    .getElementById("mockExamButton")
    .addEventListener(
        "click",
        () => {

            alert(
                "Mock Exam mode will be added next! 🎯"
            );

        }
    );


document
    .getElementById("chaptersButton")
    .addEventListener(
        "click",
        () => {

            alert(
                "Chapter selection will be added next! 📚"
            );

        }
    );


document
    .getElementById("progressButton")
    .addEventListener(
        "click",
        () => {

            alert(
                `XP: ${playerData.xp}\n` +
                `Level: ${playerData.level}\n` +
                `Questions: ${playerData.questionsAttempted}\n` +
                `Correct: ${playerData.correctAnswers}\n` +
                `Wrong: ${playerData.wrongAnswers}\n` +
                `Best Streak: ${playerData.bestStreak}`
            );

        }
    );


document
    .getElementById("achievementsButton")
    .addEventListener(
        "click",
        () => {

            alert(
                "Achievements will be added next! 🏆"
            );

        }
    );


document
    .getElementById("wrongQuestionsButton")
    .addEventListener(
        "click",
        () => {

            alert(
                "Wrong Questions review will be added next! ❌"
            );

        }
    );


document
    .getElementById("dailyChallengeButton")
    .addEventListener(
        "click",
        startQuiz
    );


document
    .getElementById("settingsButton")
    .addEventListener(
        "click",
        () => {

            alert(
                "Settings will be added later. ⚙️"
            );

        }
    );


// ---------- Initialize ----------

updatePlayerUI();

savePlayerData();

console.log(
    "CCC QUEST Quiz Engine Loaded!"
);
