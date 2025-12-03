let quizData = null;
let currentQuestion = 0;
let userAnswers = [];
let score = 0;
let answerVerified = [];
const elements = {
  quizStart: document.querySelector(".quiz-start"),
  quizGame: document.getElementById("quiz-game"),
  quizResult: document.getElementById("quiz-result"),
  loadingState: document.getElementById("loading-state"),
  themeForm: document.getElementById("theme-form"),
  themeInput: document.getElementById("theme-input"),
  btnClose: document.getElementById("btn-close"),
  currentQuestionSpan: document.getElementById("current-question"),
  questionText: document.getElementById("question-text"),
  optionsGrid: document.getElementById("options-grid"),
  btnPrev: document.getElementById("btn-prev"),
  btnNext: document.getElementById("btn-next"),
  btnVerify: document.getElementById("btn-verify"),
  finalScore: document.getElementById("final-score"),
  btnNewQuiz: document.getElementById("btn-new-quiz"),
  btnReviewAnswers: document.getElementById("btn-review-answers"),
  reviewContainer: document.getElementById("review-container"),
  progressBar: document.getElementById("progress-bar"),
};
document.addEventListener("DOMContentLoaded", () => {
  initEventListeners();
  initAudioControls();
});
function initEventListeners() {
  elements.themeForm.addEventListener("submit", handleThemeSubmit);
  elements.btnPrev.addEventListener("click", handlePrevQuestion);
  elements.btnNext.addEventListener("click", handleNextQuestion);
  elements.btnVerify.addEventListener("click", handleVerifyAnswer);
  elements.btnClose.addEventListener("click", handleCloseQuiz);
  elements.btnNewQuiz.addEventListener("click", handleNewQuiz);
  elements.btnReviewAnswers.addEventListener("click", handleReviewAnswers);
  elements.optionsGrid.addEventListener("click", handleOptionSelect);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && elements.quizGame.classList.contains("active")) {
      handleCloseQuiz();
    }
  });
}
async function handleThemeSubmit(e) {
  e.preventDefault();
  const theme = elements.themeInput.value.trim();
  if (!theme) {
    elements.themeInput.focus();
    return;
  }
  const submitBtn = elements.themeForm.querySelector(".btn-primary");
  const originalText = submitBtn.textContent;

  try {
    submitBtn.disabled = true;
    submitBtn.textContent = "Gerando...";
    showLoading(true);

    quizData = await window.generateQuiz(theme);

    if (!quizData || !Array.isArray(quizData) || quizData.length !== 10) {
      throw new Error("Quiz gerado está incompleto. Tente novamente.");
    }

    currentQuestion = 0;
    userAnswers = new Array(10).fill(null);
    answerVerified = new Array(10).fill(false);
    score = 0;
    showLoading(false);
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;

    hideElement(elements.quizStart);
    showElement(elements.quizGame);
    elements.quizGame.classList.add("active");

    if (window.audioManager) {
      window.audioManager.changeTrack(2, true);
    }

    if (window.voiceManager) {
      await window.voiceManager.speak(
        "Quiz gerado com sucesso! Vamos começar."
      );
    }

    loadQuestion(0);
  } catch (error) {
    console.error("Erro ao gerar quiz:", error);
    showLoading(false);
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
    alert(
      `Erro ao gerar quiz: ${error.message}\n\nTente novamente com outro tema.`
    );
  }
}
function loadQuestion(index) {
  if (!quizData || index < 0 || index >= quizData.length) {
    console.error("Índice de pergunta inválido:", index);
    return;
  }
  const question = quizData[index];
  currentQuestion = index;
  elements.currentQuestionSpan.textContent = `Pergunta ${index + 1}`;
  elements.questionText.textContent = question.question;

  if (elements.progressBar) {
    const progress = ((index + 1) / 10) * 100;
    elements.progressBar.style.width = `${progress}%`;
  }

  elements.optionsGrid.innerHTML = "";
  const optionLetters = ["A", "B", "C", "D"];
  question.options.forEach((option, i) => {
    const button = document.createElement("button");
    button.className = "option-btn";
    button.setAttribute("data-option", optionLetters[i]);
    button.textContent = option;

    if (userAnswers[index] === optionLetters[i]) {
      button.classList.add("selected");
    }

    if (answerVerified[index]) {
      button.disabled = true;
      if (optionLetters[i] === question.correct) {
        button.classList.add("correct");
      } else if (optionLetters[i] === userAnswers[index]) {
        button.classList.add("incorrect");
      }
    }

    elements.optionsGrid.appendChild(button);
  });
  updateNavigationButtons();
  updateVerifyButton();
  elements.questionText.classList.add("question-enter");
  setTimeout(() => {
    elements.questionText.classList.remove("question-enter");
  }, 300);

  narrateQuestion(question, index);
}
function handleOptionSelect(e) {
  const button = e.target.closest(".option-btn");
  if (!button) return;

  if (window.audioManager) {
    window.audioManager.playEffect("click");
  }

  const allButtons = elements.optionsGrid.querySelectorAll(".option-btn");
  allButtons.forEach((btn) => btn.classList.remove("selected"));
  button.classList.add("selected");
  const selectedOption = button.getAttribute("data-option");
  userAnswers[currentQuestion] = selectedOption;
  updateVerifyButton();

  console.log(
    `Pergunta ${currentQuestion + 1}: Resposta ${selectedOption} selecionada`
  );
}
function handlePrevQuestion() {
  if (currentQuestion > 0) {
    currentQuestion--;
    loadQuestion(currentQuestion);
  }
}
function handleNextQuestion() {
  if (currentQuestion === 9) {
    const unanswered = userAnswers.findIndex((answer) => answer === null);
    if (unanswered !== -1) {
      const confirm = window.confirm(
        `Você ainda não respondeu a pergunta ${
          unanswered + 1
        }.\n\nDeseja finalizar mesmo assim?`
      );
      if (!confirm) {
        return;
      }
    }
    finishQuiz();
  } else {
    currentQuestion++;
    loadQuestion(currentQuestion);
  }
}
function updateNavigationButtons() {
  elements.btnPrev.disabled = currentQuestion === 0;
  if (currentQuestion === 9) {
    elements.btnNext.textContent = "Ver Resultado →";
  } else {
    elements.btnNext.textContent = "Próxima →";
  }
}

function updateVerifyButton() {
  const hasAnswer = userAnswers[currentQuestion] !== null;
  const isVerified = answerVerified[currentQuestion];
  elements.btnVerify.disabled = !hasAnswer || isVerified;
  elements.btnVerify.textContent = isVerified
    ? "✓ Verificada"
    : "Verificar Resposta";
}

function handleVerifyAnswer() {
  if (
    answerVerified[currentQuestion] ||
    userAnswers[currentQuestion] === null
  ) {
    return;
  }

  answerVerified[currentQuestion] = true;
  const selectedOption = userAnswers[currentQuestion];
  const correctOption = quizData[currentQuestion].correct;
  const isCorrect = selectedOption === correctOption;

  const allButtons = elements.optionsGrid.querySelectorAll(".option-btn");
  allButtons.forEach((btn) => {
    btn.disabled = true;
    const option = btn.getAttribute("data-option");
    if (option === correctOption) {
      btn.classList.add("correct");
    } else if (option === selectedOption && !isCorrect) {
      btn.classList.add("incorrect");
    }
  });

  if (window.audioManager) {
    window.audioManager.playEffect(isCorrect ? "correct" : "incorrect");
  }

  if (window.voiceManager) {
    window.voiceManager.speak(
      isCorrect ? "Resposta correta" : "Resposta incorreta"
    );
  }

  updateVerifyButton();
}
function finishQuiz() {
  score = 0;
  quizData.forEach((question, index) => {
    if (userAnswers[index] === question.correct) {
      score++;
    }
  });
  console.log(`Quiz finalizado! Pontuação: ${score}/10`);

  if (window.audioManager) {
    window.audioManager.playEffect("success");
  }

  hideElement(elements.quizGame);
  elements.quizGame.classList.remove("active");
  showElement(elements.quizResult);
  elements.quizResult.classList.add("active");

  const percentage = (score / 10) * 100;
  let message = "";
  if (percentage >= 90) {
    message = "🎉 Excelente! Você domina o assunto!";
  } else if (percentage >= 70) {
    message = "👏 Muito bom! Continue estudando!";
  } else if (percentage >= 50) {
    message = "👍 Bom trabalho! Há espaço para melhorar.";
  } else {
    message = "📚 Continue praticando! O aprendizado é contínuo.";
  }

  elements.finalScore.innerHTML = `
        <strong>Você acertou ${score} de 10 perguntas!</strong><br>
        <span style="font-size: 1.2rem; color: var(--gray-text);">${percentage}%</span><br>
        <span style="font-size: 1rem; margin-top: 1rem; display: block;">${message}</span>
    `;

  if (elements.btnReviewAnswers) {
    elements.btnReviewAnswers.style.display = "inline-block";
  }

  if (window.audioManager) {
    if (percentage >= 70) {
      window.audioManager.changeTrack(3, true);
    } else {
      window.audioManager.changeTrack(1, true);
    }
  }

  if (window.voiceManager) {
    window.voiceManager.speak(
      `Quiz finalizado! Você acertou ${score} de 10 perguntas. ${percentage} por cento de acerto. ${message.replace(
        /[🎉👏👍📚]/g,
        ""
      )}`
    );
  }
}
function handleCloseQuiz() {
  const confirm = window.confirm(
    "Deseja sair do quiz?\n\nSeu progresso será perdido."
  );
  if (confirm) {
    resetQuiz();
    hideElement(elements.quizGame);
    elements.quizGame.classList.remove("active");
    showElement(elements.quizStart);
    elements.themeInput.value = "";
    elements.themeInput.focus();
  }
}
function handleNewQuiz() {
  resetQuiz();
  hideElement(elements.quizResult);
  elements.quizResult.classList.remove("active");
  showElement(elements.quizStart);
  elements.themeInput.value = "";
  elements.themeInput.focus();
}
function resetQuiz() {
  quizData = null;
  currentQuestion = 0;
  userAnswers = [];
  answerVerified = [];
  score = 0;
  if (elements.reviewContainer) {
    elements.reviewContainer.innerHTML = "";
    elements.reviewContainer.style.display = "none";
  }
  if (elements.btnReviewAnswers) {
    elements.btnReviewAnswers.style.display = "none";
  }
}

function handleReviewAnswers() {
  if (!quizData) return;

  const reviewHTML = quizData
    .map((question, index) => {
      const userAnswer = userAnswers[index];
      const isCorrect = userAnswer === question.correct;
      const statusClass = isCorrect ? "correct" : "incorrect";
      const statusIcon = isCorrect ? "✓" : "✗";
      const statusText = isCorrect ? "Correto" : "Incorreto";

      return `
      <div class="review-item ${statusClass}">
        <div class="review-header">
          <span class="review-number">Pergunta ${index + 1}</span>
          <span class="review-status ${statusClass}">${statusIcon} ${statusText}</span>
        </div>
        <div class="review-question">${question.question}</div>
        <div class="review-options">
          ${question.options
            .map((opt, i) => {
              const letter = ["A", "B", "C", "D"][i];
              const isUserAnswer = letter === userAnswer;
              const isCorrectAnswer = letter === question.correct;
              let optionClass = "";
              if (isCorrectAnswer) optionClass = "correct";
              else if (isUserAnswer && !isCorrect) optionClass = "incorrect";
              return `<div class="review-option ${optionClass}">
              <span class="option-letter">${letter}</span>
              <span class="option-text">${opt}</span>
              ${
                isUserAnswer
                  ? '<span class="user-mark">Sua resposta</span>'
                  : ""
              }
              ${
                isCorrectAnswer
                  ? '<span class="correct-mark">Correta</span>'
                  : ""
              }
            </div>`;
            })
            .join("")}
        </div>
      </div>
    `;
    })
    .join("");

  elements.reviewContainer.innerHTML = `<h3>Revisão das Respostas</h3>${reviewHTML}`;
  elements.reviewContainer.style.display = "block";
  elements.reviewContainer.scrollIntoView({ behavior: "smooth" });
}
function showElement(element) {
  if (element) {
    element.style.display = "block";
  }
}
function hideElement(element) {
  if (element) {
    element.style.display = "none";
  }
}
function showLoading(show) {
  if (show) {
    elements.loadingState.classList.add("active");
    elements.themeForm.style.display = "none";
  } else {
    elements.loadingState.classList.remove("active");
    elements.themeForm.style.display = "flex";
  }
}
window.quizDebug = {
  getState: () => ({
    quizData,
    currentQuestion,
    userAnswers,
    score,
  }),
  showAnswers: () => {
    if (!quizData) {
      console.log("Nenhum quiz ativo");
      return;
    }
    console.table(
      quizData.map((q, i) => ({
        Pergunta: i + 1,
        "Resposta Correta": q.correct,
        "Sua Resposta": userAnswers[i] || "Não respondida",
        Status: userAnswers[i] === q.correct ? "✓ Correto" : "✗ Incorreto",
      }))
    );
  },
};

function initAudioControls() {
  const btnToggleMusic = document.getElementById("btn-toggle-music");

  if (btnToggleMusic) {
    btnToggleMusic.addEventListener("click", () => {
      if (!window.audioManager) return;

      if (window.audioManager.isPlaying) {
        window.audioManager.pauseBackground();
        btnToggleMusic.textContent = "🔇";
        btnToggleMusic.title = "Tocar música";
      } else {
        window.audioManager.resumeBackground();
        btnToggleMusic.textContent = "🎵";
        btnToggleMusic.title = "Pausar música";
      }
    });
  }
}

async function narrateQuestion(question, index) {
  if (!window.voiceManager) return;

  const autoNarrate = localStorage.getItem("eduvoice_auto_narrate") !== "false";
  if (!autoNarrate) return;

  try {
    if (window.audioManager && index > 0) {
      window.audioManager.playEffect("nextQuestion");
    }

    window.voiceManager.stop();

    await window.voiceManager.speak(`Pergunta ${index + 1}`);
    await sleep(300);

    await window.voiceManager.speakWithHighlight(
      question.question,
      elements.questionText
    );
    await sleep(500);

    const letters = ["A", "B", "C", "D"];
    for (let i = 0; i < question.options.length; i++) {
      await window.voiceManager.speak(
        `Opção ${letters[i]}: ${question.options[i]}`
      );
      await sleep(300);
    }
  } catch (error) {
    console.warn("⚠️ Erro na narração:", error);
  }
}

async function provideFeedback(selectedOption, correctOption) {
  const isCorrect = selectedOption === correctOption;

  if (isCorrect) {
    if (window.audioManager) {
      window.audioManager.playEffect("correct");
    }

    if (window.voiceManager) {
      const feedbacks = [
        "Correto!",
        "Muito bem!",
        "Excelente!",
        "Parabéns!",
        "Isso aí!",
      ];
      const randomFeedback =
        feedbacks[Math.floor(Math.random() * feedbacks.length)];
      window.voiceManager.speak(randomFeedback);
    }
  } else {
    if (window.audioManager) {
      window.audioManager.playEffect("incorrect");
    }
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function reNarrateCurrentQuestion() {
  if (quizData && currentQuestion >= 0 && currentQuestion < quizData.length) {
    narrateQuestion(quizData[currentQuestion], currentQuestion);
  }
}

window.reNarrateCurrentQuestion = reNarrateCurrentQuestion;

console.log(
  "Quiz inicializado! Use quizDebug.getState() e quizDebug.showAnswers() para debug."
);
