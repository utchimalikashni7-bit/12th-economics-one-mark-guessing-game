const questions = [
  {
    question: "The study of how people use limited resources to satisfy unlimited wants is called:",
    options: ["Economics", "Sociology", "Political Science", "Psychology"],
    answer: "Economics"
  },
  {
    question: "The demand curve generally slopes:",
    options: ["Upward from left to right", "Downward from left to right", "Vertically", "Horizontally"],
    answer: "Downward from left to right"
  },
  {
    question: "A rise in the general price level is called:",
    options: ["Deflation", "Inflation", "Stagnation", "Recession"],
    answer: "Inflation"
  },
  {
    question: "The value of the next best alternative forgone is called:",
    options: ["Fixed cost", "Opportunity cost", "Marginal cost", "Total cost"],
    answer: "Opportunity cost"
  },
  {
    question: "GDP stands for:",
    options: ["Gross Domestic Product", "General Development Plan", "Government Development Programme", "Gross Distribution Price"],
    answer: "Gross Domestic Product"
  },
  {
    question: "According to the law of supply, when price rises, supply:",
    options: ["Falls", "Remains constant", "Rises", "Becomes zero"],
    answer: "Rises"
  },
  {
    question: "Which of the following is a direct tax?",
    options: ["Sales tax", "Income tax", "Excise duty", "Custom duty"],
    answer: "Income tax"
  },
  {
    question: "The central bank of India is:",
    options: ["SBI", "RBI", "ICICI", "PNB"],
    answer: "RBI"
  },
  {
    question: "Elasticity of demand measures:",
    options: ["Change in supply", "Responsiveness of demand to price", "Cost of production", "Government revenue"],
    answer: "Responsiveness of demand to price"
  },
  {
    question: "The total amount received by a firm from sales is called:",
    options: ["Profit", "Income", "Revenue", "Wage"],
    answer: "Revenue"
  },
  {
    question: "When expenditure exceeds income, it is called:",
    options: ["Surplus", "Deficit", "Savings", "Balance"],
    answer: "Deficit"
  },
  {
    question: "A market with only one seller is called:",
    options: ["Monopoly", "Oligopoly", "Duopoly", "Competition"],
    answer: "Monopoly"
  }
];

const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");
const studentNameInput = document.getElementById("student-name");
const questionNumber = document.getElementById("question-number");
const scoreBoard = document.getElementById("score-board");
const timerDisplay = document.getElementById("timer");
const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options");
const feedback = document.getElementById("feedback");

let currentIndex = 0;
let score = 0;
let correct = 0;
let wrong = 0;
let skipped = 0;
let answered = false;
let timeLeft = 30;
let timerId = null;
let startTime = 0;
let totalTime = 0;
let questionTimes = [];

function startGame() {
  const studentName = studentNameInput.value.trim();
  if (!studentName) {
    alert("Please enter your name");
    return;
  }

  currentIndex = 0;
  score = 0;
  correct = 0;
  wrong = 0;
  skipped = 0;
  answered = false;
  questionTimes = [];
  
  startTime = Date.now();
  
  startScreen.classList.remove("active");
  startScreen.classList.add("hidden");
  resultScreen.classList.add("hidden");
  resultScreen.classList.remove("active");
  quizScreen.classList.remove("hidden");
  quizScreen.classList.add("active");
  
  showQuestion();
}

function startTimer() {
  clearInterval(timerId);

  timeLeft = 30;
  timerDisplay.textContent = `${timeLeft}s`;

  timerId = setInterval(() => {
    timeLeft -= 1;
    timerDisplay.textContent = `${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(timerId);
      handleTimeout();
    }
  }, 1000);
}

function showQuestion() {
  const question = questions[currentIndex];
  answered = false;
  nextBtn.classList.add("hidden");
  feedback.classList.add("hidden");
  feedback.classList.remove("correct", "wrong");
  optionsContainer.innerHTML = "";

  questionNumber.textContent = `Question ${currentIndex + 1}`;
  scoreBoard.textContent = `Score: ${score}`;
  questionText.textContent = question.question;

  question.options.forEach((option) => {
    const button = document.createElement("button");
    button.className = "option";
    button.textContent = option;
    button.type = "button";

    button.addEventListener("click", () => checkAnswer(option, question.answer));
    optionsContainer.appendChild(button);
  });

  startTimer();
}

function checkAnswer(selectedOption, correctAnswer) {
  if (answered) return;
  answered = true;
  clearInterval(timerId);

  const optionButtons = document.querySelectorAll(".option");

  optionButtons.forEach((button) => {
    button.disabled = true;

    if (button.textContent === correctAnswer) {
      button.classList.add("correct");
    }

    if (button.textContent === selectedOption && selectedOption !== correctAnswer) {
      button.classList.add("wrong");
    }

    if (button.textContent === selectedOption) {
      button.classList.add("selected");
    }
  });

  if (selectedOption === correctAnswer) {
    score += 1;
    correct += 1;
    scoreBoard.textContent = `Score: ${score}`;
    feedback.textContent = "Correct! Great job.";
    feedback.classList.add("correct");
  } else {
    wrong += 1;
    feedback.textContent = `Wrong! The correct answer is: ${correctAnswer}`;
    feedback.classList.add("wrong");
  }

  feedback.classList.remove("hidden");
  nextBtn.classList.remove("hidden");
}

function handleTimeout() {
  if (answered) return;

  answered = true;
  skipped += 1;

  const question = questions[currentIndex];
  const optionButtons = document.querySelectorAll(".option");

  optionButtons.forEach((button) => {
    button.disabled = true;

    if (button.textContent === question.answer) {
      button.classList.add("correct");
    }
  });

  feedback.textContent = `Time is over! The correct answer is: ${question.answer}`;
  feedback.classList.add("wrong");
  feedback.classList.remove("hidden");
  nextBtn.classList.remove("hidden");
}

function nextQuestion() {
  currentIndex += 1;

  if (currentIndex < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  clearInterval(timerId);
  
  totalTime = Math.round((Date.now() - startTime) / 1000);
  const averageSpeed = (totalTime / 12).toFixed(1);
  const percentage = Math.round((score / 12) * 100);
  const accuracy = Math.round((correct / 12) * 100);

  quizScreen.classList.add("hidden");
  quizScreen.classList.remove("active");
  resultScreen.classList.remove("hidden");
  resultScreen.classList.add("active");

  const studentName = studentNameInput.value.trim();
  document.getElementById("result-student").textContent = studentName;
  document.getElementById("result-correct").textContent = correct;
  document.getElementById("result-wrong").textContent = wrong;
  document.getElementById("result-skipped").textContent = skipped;
  document.getElementById("result-score").textContent = `${score} / 12`;
  document.getElementById("result-percentage").textContent = `${percentage}%`;
  document.getElementById("result-accuracy").textContent = `${accuracy}%`;
  document.getElementById("result-total-time").textContent = `${totalTime}s`;
  document.getElementById("result-avg-speed").textContent = `${averageSpeed}s/q`;
}

startBtn.addEventListener("click", startGame);
nextBtn.addEventListener("click", nextQuestion);
restartBtn.addEventListener("click", () => {
  startScreen.classList.add("active");
  startScreen.classList.remove("hidden");
  resultScreen.classList.add("hidden");
  resultScreen.classList.remove("active");
  studentNameInput.value = "";
  studentNameInput.focus();
});
