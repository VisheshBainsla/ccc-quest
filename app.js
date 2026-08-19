// ==========================================
// CCC QUEST
// Main Application JavaScript
// ==========================================


// ---------- Player Data ----------

let playerData = JSON.parse(
    localStorage.getItem("cccQuestPlayer")
) || {
    xp: 0,
    level: 1,
    questionsAttempted: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    bestStreak: 0,
    currentStreak: 0
};


// ---------- Save Player Data ----------

function savePlayerData() {
    localStorage.setItem(
        "cccQuestPlayer",
        JSON.stringify(playerData)
    );
}


// ---------- Calculate Level ----------

function updateLevel() {

    const newLevel =
        Math.floor(playerData.xp / 1000) + 1;

    playerData.level = newLevel;

    savePlayerData();

    updatePlayerUI();
}


// ---------- Add XP ----------

function addXP(amount) {

    playerData.xp += amount;

    updateLevel();
    savePlayerData();
}


// ---------- Update Home Screen ----------

function updatePlayerUI() {

    const xpValue =
        document.getElementById("xpValue");

    const xpProgress =
        document.getElementById("xpProgress");

    if (!xpValue || !xpProgress) return;


    const currentLevelXP =
        playerData.xp % 1000;


    xpValue.textContent =
        `${currentLevelXP} / 1000`;


    xpProgress.style.width =
        `${currentLevelXP / 10}%`;


    const levelElement =
        document.querySelector(".player-info h2");


    if (levelElement) {

        levelElement.textContent =
            `Level ${playerData.level}`;

    }
}


// ---------- Button Helper ----------

function showMessage(title, message) {

    alert(`${title}\n\n${message}`);

}


// ---------- Play Quiz ----------

const playQuizButton =
    document.getElementById("playQuizButton");


if (playQuizButton) {

    playQuizButton.addEventListener(
        "click",
        function () {

            showMessage(
                "PLAY QUIZ",
                "The quiz engine is coming next! 🎮"
            );

        }
    );

}


// ---------- Mock Exam ----------

const mockExamButton =
    document.getElementById("mockExamButton");


if (mockExamButton) {

    mockExamButton.addEventListener(
        "click",
        function () {

            showMessage(
                "MOCK EXAM",
                "The CCC exam simulator is coming soon
