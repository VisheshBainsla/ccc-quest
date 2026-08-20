// ==========================================
// CCC QUEST - QUIZ ENGINE
// ==========================================


// ==========================================
// QUESTION BANK
// ==========================================

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


// ==========================================
// QUIZ STATE
// ==========================================

let currentQuestion = 0;

let quizScore = 0;

let quizXP = 0;

let lives = 3;

let streak = 0;

let questionAnswered = false;

let timerValue = 30;

let timerInterval = null;

let quizFinished = false;


// ==========================================
// PLAYER DATA
// ==========================================

let playerData;

try {

    playerData =
        JSON.parse(
            localStorage.getItem("cccQuestPlayer")
        ) || {};

} catch (error) {

    playerData = {};

}


// Make sure all required data exists

playerData.xp =
    Number(playerData.xp) || 0;

playerData.level =
    Number(playerData.level) || 1;

playerData.questionsAttempted =
    Number(playerData.questionsAttempted) || 0;

playerData.correctAnswers =
    Number(playerData.correctAnswers) || 0;

playerData.wrongAnswers =
    Number(playerData.wrongAnswers) || 0;

playerData.bestStreak =
    Number(playerData.bestStreak) || 0;

playerData.wrongQuestions =
    Array.isArray(playerData.wrongQuestions)
        ? playerData.wrongQuestions
        : [];


// ==========================================
// ELEMENTS
// ==========================================

const homeScreen =
    document.getElementById("homeScreen");

const quizScreen =
    document.getElementById("quizScreen");

const chaptersScreen =
    document.getElementById("chaptersScreen");

const playQuizButton =
    document.getElementById("playQuizButton");

const chaptersButton =
    document.getElementById("chaptersButton");

const backToHomeButton =
    document.getElementById("backToHomeButton");

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


// ==========================================
// SAVE PLAYER DATA
// ==========================================

function savePlayerData() {

    localStorage.setItem(
        "cccQuestPlayer",
        JSON.stringify(playerData)
    );

}


// ==========================================
// UPDATE HOME UI
// ==========================================

function updatePlayerUI() {

    const xpValue =
        document.getElementById("xpValue");

    const xpProgress =
        document.getElementById("xpProgress");

    const levelElement =
        document.querySelector(
            ".player-info h2"
        );


    const level =
        Math.floor(
            playerData.xp / 1000
        ) + 1;


    const currentLevelXP =
        playerData.xp % 1000;


    playerData.level =
        level;


    if (xpValue) {

        xpValue.textContent =
            `${currentLevelXP} / 1000`;

    }


    if (xpProgress) {

        xpProgress.style.width =
            `${currentLevelXP / 10}%`;

    }


    if (levelElement) {

        levelElement.textContent =
            `Level ${level}`;

    }


    savePlayerData();

}


// ==========================================
// SHOW HOME
// ==========================================

function showHome() {

    clearInterval(timerInterval);

    quizFinished = false;

    if (quizScreen) {

        quizScreen.style.display =
            "none";

    }


    if (chaptersScreen) {

        chaptersScreen.style.display =
            "none";

    }


    if (homeScreen) {

        homeScreen.style.display =
            "block";

    }


    updatePlayerUI();

    window.scrollTo(0, 0);

}


// ==========================================
// START QUIZ
// ==========================================

function startQuiz() {

    clearInterval(timerInterval);

    currentQuestion = 0;

    quizScore = 0;

    quizXP = 0;

    lives = 3;

    streak = 0;

    questionAnswered = false;

    quizFinished = false;


    if (homeScreen) {

        homeScreen.style.display =
            "none";

    }


    if (chaptersScreen) {

        chaptersScreen.style.display =
            "none";

    }


    if (quizScreen) {

        quizScreen.style.display =
            "block";

    }


    if (totalQuestions) {

        totalQuestions.textContent =
            questionBank.length;

    }


    if (nextQuestionButton) {

        nextQuestionButton.textContent =
            "Next Question";

        nextQuestionButton.style.display =
            "none";

    }


    loadQuestion();

    window.scrollTo(0, 0);

}


// ==========================================
// LOAD QUESTION
// ==========================================

function loadQuestion() {

    clearInterval(timerInterval);

    questionAnswered = false;


    const question =
        questionBank[currentQuestion];


    if (!question) {

        showQuizResult();

        return;

    }


    if (questionEnglish) {

        questionEnglish.textContent =
            question.english;

    }


    if (questionHindi) {

        questionHindi.textContent =
            question.hindi;

    }


    if (questionNumber) {

        questionNumber.textContent =
            currentQuestion + 1;

    }


    if (totalQuestions) {

        totalQuestions.textContent =
            questionBank.length;

    }


    if (quizXPElement) {

        quizXPElement.textContent =
            quizXP;

    }


    if (livesElement) {

        livesElement.textContent =
            lives;

    }


    if (streakElement) {

        streakElement.textContent =
            streak;

    }


    const progress =
        (
            (currentQuestion + 1) /
            questionBank.length
        ) * 100;


    if (quizProgress) {

        quizProgress.style.width =
            `${progress}%`;

    }


    if (answerCard) {

        answerCard.style.display =
            "none";

    }


    if (nextQuestionButton) {

        nextQuestionButton.style.display =
            "none";

        nextQuestionButton.textContent =
            "Next Question";

    }


    if (!optionsContainer) {

        return;

    }


    optionsContainer.innerHTML =
        "";


    question.options.forEach(
        function (option, index) {

            const button =
                document.createElement(
                    "button"
                );


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
                function () {

                    selectAnswer(index);

                }
            );


            optionsContainer.appendChild(
                button
            );

        }
    );


    startTimer();

}


// ==========================================
// TIMER
// ==========================================

function startTimer() {

    clearInterval(timerInterval);

    timerValue = 30;


    if (timerElement) {

        timerElement.textContent =
            timerValue;

    }


    timerInterval =
        setInterval(
            function () {

                if (questionAnswered) {

                    clearInterval(
                        timerInterval
                    );

                    return;

                }


                timerValue--;


                if (timerElement) {

                    timerElement.textContent =
                        timerValue;

                }


                if (timerValue <= 0) {

                    clearInterval(
                        timerInterval
                    );


                    if (!questionAnswered) {

                        questionAnswered =
                            true;

                        disableOptions();

                        handleWrongAnswer(
                            -1,
                            true
                        );

                    }

                }

            },
            1000
        );

}


// ==========================================
// DISABLE OPTIONS
// ==========================================

function disableOptions() {

    const buttons =
        document.querySelectorAll(
            ".option-button"
        );


    buttons.forEach(
        function (button) {

            button.disabled =
                true;

        }
    );

}


// ==========================================
// SELECT ANSWER
// ==========================================

function selectAnswer(
    selectedIndex
) {

    if (questionAnswered) {

        return;

    }


    questionAnswered =
        true;


    clearInterval(
        timerInterval
    );


    const question =
        questionBank[currentQuestion];


    disableOptions();


    if (
        selectedIndex ===
        question.correct
    ) {

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


// ==========================================
// CORRECT ANSWER
// ==========================================

function handleCorrectAnswer(
    selectedIndex
) {

    const question =
        questionBank[currentQuestion];


    const buttons =
        document.querySelectorAll(
            ".option-button"
        );


    if (buttons[selectedIndex]) {

        buttons[selectedIndex]
            .classList.add(
                "correct"
            );

    }


    quizScore++;

    streak++;


    const earnedXP =
        100;


    quizXP +=
        earnedXP;


    playerData.xp +=
        earnedXP;


    playerData.questionsAttempted++;

    playerData.correctAnswers++;


    if (
        streak >
        playerData.bestStreak
    ) {

        playerData.bestStreak =
            streak;

    }


    savePlayerData();


    if (answerStatus) {

        answerStatus.textContent =
            "✅ Correct Answer!";

        answerStatus.style.color =
            "var(--green)";

    }


    if (answerExplanation) {

        answerExplanation.textContent =
            question.explanation;

    }


    if (answerCard) {

        answerCard.style.display =
            "block";

    }


    if (nextQuestionButton) {

        nextQuestionButton.style.display =
            "block";

    }


    if (quizXPElement) {

        quizXPElement.textContent =
            quizXP;

    }


    if (streakElement) {

        streakElement.textContent =
            streak;

    }

}


// ==========================================
// WRONG ANSWER
// ==========================================

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
            .classList.add(
                "wrong"
            );

    }


    if (buttons[question.correct]) {

        buttons[question.correct]
            .classList.add(
                "correct"
            );

    }


    lives--;

    streak = 0;


    playerData.questionsAttempted++;

    playerData.wrongAnswers++;


    // Save wrong question

    if (
        !playerData.wrongQuestions.includes(
            currentQuestion
        )
    ) {

        playerData.wrongQuestions.push(
            currentQuestion
        );

    }


    savePlayerData();


    if (livesElement) {

        livesElement.textContent =
            lives;

    }


    if (streakElement) {

        streakElement.textContent =
            streak;

    }


    if (timedOut) {

        if (answerStatus) {

            answerStatus.textContent =
                "⏰ Time's Up!";

        }

    } else {

        if (answerStatus) {

            answerStatus.textContent =
                "❌ Wrong Answer!";

        }

    }


    if (answerStatus) {

        answerStatus.style.color =
            "var(--red)";

    }


    if (answerExplanation) {

        answerExplanation.textContent =
            `${question.explanation} ` +
            `Correct answer: ` +
            `${question.options[question.correct]}.`;

    }


    if (answerCard) {

        answerCard.style.display =
            "block";

    }


    if (nextQuestionButton) {

        nextQuestionButton.style.display =
            "block";

    }


    if (lives <= 0) {

        if (nextQuestionButton) {

            nextQuestionButton.textContent =
                "View Result →";

        }

    }

}


// ==========================================
// NEXT QUESTION
// ==========================================

function nextQuestion() {

    if (quizFinished) {

        return;

    }


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


// ==========================================
// QUIZ RESULT
// ==========================================

function showQuizResult() {

    clearInterval(timerInterval);

    quizFinished = true;


    const percentage =
        Math.round(
            (
                quizScore /
                questionBank.length
            ) * 100
        );


    if (answerStatus) {

        answerStatus.textContent =
            "🎉 Quiz Complete!";

        answerStatus.style.color =
            "var(--green)";

    }


    if (answerExplanation) {

        answerExplanation.textContent =
            `You scored ${quizScore} out of ` +
            `${questionBank.length} ` +
            `(${percentage}%). ` +
            `You earned ${quizXP} XP.`;

    }


    if (answerCard) {

        answerCard.style.display =
            "block";

    }


    disableOptions();


    if (nextQuestionButton) {

        nextQuestionButton.textContent =
            "Back to Home";

        nextQuestionButton.style.display =
            "block";

    }

}


// ==========================================
// NEXT BUTTON
// ==========================================

if (nextQuestionButton) {

    nextQuestionButton.addEventListener(
        "click",
        function () {

            if (quizFinished) {

                showHome();

                return;

            }


            nextQuestion();

        }
    );

}


// ==========================================
// QUIT QUIZ
// ==========================================

if (quitQuizButton) {

    quitQuizButton.addEventListener(
        "click",
        function () {

            const shouldQuit =
                confirm(
                    "Quit this quiz?"
                );


            if (shouldQuit) {

                showHome();

            }

        }
    );

}


// ==========================================
// PLAY QUIZ
// ==========================================

if (playQuizButton) {

    playQuizButton.addEventListener(
        "click",
        startQuiz
    );

}


// ==========================================
// CHAPTERS
// ==========================================

if (chaptersButton) {

    chaptersButton.addEventListener(
        "click",
        function () {

            /*
             * The current index.html does not yet
             * contain a Chapters Screen.
             *
             * Therefore we safely show a message
             * instead of causing a JavaScript error.
             */

            if (
                chaptersScreen
            ) {

                if (homeScreen) {

                    homeScreen.style.display =
                        "none";

                }


                if (quizScreen) {

                    quizScreen.style.display =
                        "none";

                }


                chaptersScreen.style.display =
                    "block";

                window.scrollTo(0, 0);

            } else {

                alert(
                    "Chapter system is ready to be added next! 📚"
                );

            }

        }
    );

}


// ==========================================
// BACK TO HOME
// ==========================================

if (backToHomeButton) {

    backToHomeButton.addEventListener(
        "click",
        showHome
    );

}


// ==========================================
// MOCK EXAM
// ==========================================

const mockExamButton =
    document.getElementById(
        "mockExamButton"
    );


if (mockExamButton) {

    mockExamButton.addEventListener(
        "click",
        function () {

            alert(
                "Mock Exam mode will be added next! 🎯"
            );

        }
    );

}


// ==========================================
// PROGRESS
// ==========================================

const progressButton =
    document.getElementById(
        "progressButton"
    );


if (progressButton) {

    progressButton.addEventListener(
        "click",
        function () {

            const accuracy =
                playerData.questionsAttempted > 0
                    ? Math.round(
                        (
                            playerData.correctAnswers /
                            playerData.questionsAttempted
                        ) * 100
                    )
                    : 0;


            alert(
                `📊 MY PROGRESS\n\n` +
                `XP: ${playerData.xp}\n` +
                `Level: ${playerData.level}\n\n` +
                `Questions: ${playerData.questionsAttempted}\n` +
                `Correct: ${playerData.correctAnswers}\n` +
                `Wrong: ${playerData.wrongAnswers}\n` +
                `Accuracy: ${accuracy}%\n` +
                `Best Streak: ${playerData.bestStreak}`
            );

        }
    );

}


// ==========================================
// ACHIEVEMENTS
// ==========================================

const achievementsButton =
    document.getElementById(
        "achievementsButton"
    );


if (achievementsButton) {

    achievementsButton.addEventListener(
        "click",
        function () {

            const achievements = [];


            if (
                playerData.correctAnswers >= 1
            ) {

                achievements.push(
                    "🥉 First Correct Answer"
                );

            }


            if (
                playerData.correctAnswers >= 10
            ) {

                achievements.push(
                    "🥈 10 Correct Answers"
                );

            }


            if (
                playerData.bestStreak >= 5
            ) {

                achievements.push(
                    "🔥 5 Question Streak"
                );

            }


            if (
                playerData.xp >= 1000
            ) {

                achievements.push(
                    "⭐ 1000 XP Master"
                );

            }


            if (
                achievements.length === 0
            ) {

                alert(
                    "🏆 ACHIEVEMENTS\n\n" +
                    "No achievements unlocked yet.\n\n" +
                    "Keep playing to unlock rewards!"
                );

            } else {

                alert(
                    "🏆 ACHIEVEMENTS\n\n" +
                    achievements.join("\n\n")
                );

            }

        }
    );

}


// ==========================================
// WRONG QUESTIONS
// ==========================================

const wrongQuestionsButton =
    document.getElementById(
        "wrongQuestionsButton"
    );


if (wrongQuestionsButton) {

    wrongQuestionsButton.addEventListener(
        "click",
        function () {

            const count =
                playerData.wrongQuestions.length;


            if (count === 0) {

                alert(
                    "❌ WRONG QUESTIONS\n\n" +
                    "You don't have any wrong questions yet.\n\n" +
                    "Keep playing!"
                );

                return;

            }


            let message =
                "❌ WRONG QUESTIONS\n\n";


            playerData.wrongQuestions.forEach(
                function (index, position) {

                    const question =
                        questionBank[index];


                    if (question) {

                        message +=
                            `${position + 1}. ` +
                            `${question.english}\n`;

                    }

                }
            );


            alert(message);

        }
    );

}


// ==========================================
// DAILY CHALLENGE
// ==========================================

const dailyChallengeButton =
    document.getElementById(
        "dailyChallengeButton"
    );


if (dailyChallengeButton) {

    dailyChallengeButton.addEventListener(
        "click",
        startQuiz
    );

}


// ==========================================
// SETTINGS
// ==========================================

const settingsButton =
    document.getElementById(
        "settingsButton"
    );


if (settingsButton) {

    settingsButton.addEventListener(
        "click",
        function () {

            alert(
                "⚙️ Settings\n\n" +
                "More settings will be added later."
            );

        }
    );

}


// ==========================================
// INITIALIZE
// ==========================================

updatePlayerUI();

savePlayerData();


console.log(
    "CCC QUEST Quiz Engine Loaded Successfully! 🚀"
);
