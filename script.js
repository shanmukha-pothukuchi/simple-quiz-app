const questions = [
  {
    questionText: "Commonly used data types DO NOT include:",
    options: ["1. strings", "2. booleans", "3. alerts", "4. numbers"],
    answer: "3. alerts",
  },
  {
    questionText: "Arrays in JavaScript can be used to store ______.",
    options: [
      "1. numbers and strings",
      "2. other arrays",
      "3. booleans",
      "4. all of the above",
    ],
    answer: "4. all of the above",
  },
  {
    questionText:
      "String values must be enclosed within _____ when being assigned to variables.",
    options: ["1. commas", "2. curly brackets", "3. quotes", "4. parentheses"],
    answer: "3. quotes",
  },
  {
    questionText:
      "A very useful tool used during development and debugging for printing content to the debugger is:",
    options: [
      "1. JavaScript",
      "2. terminal/bash",
      "3. for loops",
      "4. console.log",
    ],
    answer: "4. console.log",
  },
  {
    questionText:
      "Which of the following is a statement that can be used to terminate a loop, switch or label statement?",
    options: ["1. break", "2. stop", "3. halt", "4. exit"],
    answer: "1. break",
  },
];

let card = document.querySelector(".card");
let timer;
let time;
let correctAnswerCount;

function loadStartCard() {
  card.innerHTML = `<h1>Coding Quiz Challenge</h1>
    <p class="body-text">
      Try to answer to following code related questions within the time
      limit.
    </p>
    <p class="body-text">
      Keep in mind that incorrrect answers will penalize your score/time by
      ten seconds.
    </p>
    <button class="button" onclick="startQuiz()">Start Quiz!</button>`;
}

document.addEventListener("DOMContentLoaded", loadStartCard);

function startQuiz() {
  time = questions.length * 10;
  correctAnswerCount = 0;

  document.querySelector("#time").innerHTML = `Time: ${time}`;

  timer = setInterval(() => {
    time--;
    document.querySelector("#time").innerHTML = `Time: ${time}`;
    if (time <= 0) {
      endQuiz();
    }
  }, 1000);

  askQuestion(0);
}

function askQuestion(questionIndex) {
  card.innerHTML = `<h1 class="header-text">${questions[questionIndex].questionText}</h1>`;
  questions[questionIndex].options.forEach(
    (option, optionIndex) =>
      (card.innerHTML += `<button class="button w100 option" onclick="checkAnswer(${questionIndex}, ${optionIndex})">${option}</button>`)
  );
}

function checkAnswer(questionIndex, optionIndex) {
  let correct;

  if (
    questions[questionIndex].options[optionIndex] ===
    questions[questionIndex].answer
  ) {
    correct = true;
  } else {
    correct = false;
  }

  document.querySelectorAll(".option").forEach((option) => {
    option.disabled = true;
  });

  if (time <= 0) return endQuiz();

  if (questionIndex < questions.length - 1) {
    setTimeout(() => askQuestion(questionIndex + 1), 300);
    evaluateAnswer(correct);
  } else {
    evaluateAnswer(correct);
    setTimeout(() => endQuiz(), 300);
  }
}

function evaluateAnswer(correct) {
  if (correct) {
    card.innerHTML += `<hr class="divider" /> <p class="body-text">Correct!</p>`;
    correctAnswerCount++;
  } else {
    card.innerHTML += `<hr class="divider" /> <p class="body-text">Incorrect!</p>`;
    if (time > 10) {
      time -= 10;
    } else {
      time = 0;
      clearInterval(timer);
      endQuiz();
    }
  }
}

function endQuiz(shouldLoadScoreSheet = true) {
  document.querySelector("#time").innerHTML = `Time: `;
  clearInterval(timer);
  if (shouldLoadScoreSheet) loadScoreSheet();
}

function loadScoreSheet() {
  card.innerHTML = `<h1 class="header-text">All Done</h1>
    <p class="body-text">
      Your final score is ${time}
    </p>
    <div>
    <span class="body-text">
    Enter initials:
    </span>
    <input type="text" id="initials" class="input" maxlength="2" />
    <button class="button" onclick="storeToLeaderboard()">Submit</button>
    </div>`;
}

function storeToLeaderboard() {
  let leaderboard = JSON.parse(localStorage.getItem("leaderboard"));
  let initials = document.querySelector("#initials").value;
  if (!leaderboard) {
    if (initials.length > 0) {
      leaderboard = [
        { initials: document.querySelector("#initials").value, score: time },
      ];
    } else {
      return;
    }
  } else {
    if (initials.length > 0) {
      leaderboard.push({
        initials: document.querySelector("#initials").value,
        score: time,
      });
    } else {
      return;
    }
  }
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
  loadLeaderboard();
}

function clearLeaderboard() {
  localStorage.removeItem("leaderboard");
}

function loadLeaderboard() {
  let leaderboard = JSON.parse(localStorage.getItem("leaderboard"));
  card.innerHTML = `<h1 class="header-text">Leaderboard</h1>`;
  if (leaderboard) {
    leaderboard.forEach((examinee, examineeIndex) => {
      card.innerHTML += `<p style="text-indent: 1rem;">${examineeIndex + 1}. ${
        examinee.initials
      } - ${examinee.score}</p>`;
    });
  }
  card.innerHTML += `<button class="button" style="margin-right: 0.25rem;" onclick="loadStartCard()">Go Back</button>`;
  card.innerHTML += `<button class="button" onclick="(() => {clearLeaderboard(); loadLeaderboard();})()">Clear Leaderboard</button>`;
}
