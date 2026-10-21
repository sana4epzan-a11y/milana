const questions = [
  {
    kicker: "сначала самое важное",
    title: "Где устроим наш ужин?",
    hint: "Выбирай место, а я позабочусь об остальном",
    choices: [
      {
        image: "Снимок%20экрана%202026-10-21%20212416.png",
        imageAlt: "Карта с отмеченным местом для домашнего ужина",
        title: "Дома",
        detail: "уютно, вкусно и только мы",
        value: "дома",
        kisses: 7,
      },
      {
        image: "Снимок%20экрана%202026-10-21%202125055.png",
        imageAlt: "Карта с отмеченным местом для ужина в ресторанчике",
        title: "В ресторанчике",
        detail: "нарядимся и устроим свидание",
        value: "в ресторанчике",
        kisses: 12,
      },
    ],
  },
  {
    kicker: "представь наш вечер",
    title: "Какое настроение выбираешь?",
    hint: "То самое ощущение идеального вечера",
    choices: [
      { icon: "🕯️", title: "Уютный вечер", detail: "ну там разговорчики анау мынау", value: "уютный вечер", kisses: 4 },
      { icon: "✨", title: "Маленький праздник", detail: "красиво, весело и по-особенному", value: "маленький праздник", kisses: 8 },
      { icon: "🎬", title: "Киношный вайб", detail: "фильм, ОБНИМАШКИ канешна и вкусняшки", value: "киношный вайб", kisses: 6 },
      { icon: "🌙", title: "Сюрприз для меня", detail: "доверяю твоему вкусу", value: "сюрприз для тебя", kisses: 10 },
    ],
  },
  {
    kicker: "без этого никуда",
    title: "Что закажем к ужину?",
    hint: "Самый важный выбор после того, с кем ужинать",
    choices: [
      { icon: "🍝", title: "Что-нибудь итальянское", detail: "паста и много-много сыра", value: "итальянский ужин", kisses: 5 },
      {
        icon: "🍣",
        title: "Роллы и всякое вкусное",
        detail: "идеальный набор для двоих",
        spoiler: "ахахахаха бля знаю что ты выберешь)",
        value: "роллы и вкусняшки",
        kisses: 7,
      },
      { icon: "🍕", title: "Пиццу!", detail: "классика, которая не подводит", value: "пицца и уют", kisses: 4 },
      { icon: "🍰", title: "Выбирай за меня", detail: "у тебя хороший вкус", value: "то, что выберет любимая", kisses: 9 },
    ],
  },
  {
    kicker: "и финальный штрих",
    title: "Что будем делать потом?",
    hint: "Ничего не планировать тоже считается",
    choices: [
      { icon: "🚶‍♀️", title: "Пойдём гулять", detail: "и пусть вечер длится подольше", value: "прогулка вдвоём", kisses: 5 },
      { icon: "🎥", title: "Посмотрим кино", detail: "главное — рядом устроиться", value: "кино и обнимашки", kisses: 6 },
      { icon: "🍓", title: "Десерт и разговоры", detail: "у нас всегда найдётся тема", value: "десерт и разговоры", kisses: 7 },
      { icon: "💞", title: "Будем просто вместе", detail: "мне больше ничего не надо", value: "время только для нас", kisses: 10 },
    ],
  },
];

const answers = Array(questions.length).fill(null);
let currentQuestion = 0;

const screens = [...document.querySelectorAll(".screen")];
const choiceGrid = document.querySelector("#choice-grid");
const questionTitle = document.querySelector("#question-title");
const questionHint = document.querySelector("#question-hint");
const questionKicker = document.querySelector("#question-kicker");
const stepCount = document.querySelector("#step-count");
const progressBar = document.querySelector("#progress-bar");
const backButton = document.querySelector("#back-button");

function showScreen(id) {
  screens.forEach((screen) => {
    screen.classList.toggle("is-active", screen.id === id);
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderQuestion() {
  const question = questions[currentQuestion];
  questionKicker.textContent = question.kicker;
  questionTitle.textContent = question.title;
  questionHint.textContent = question.hint;
  stepCount.innerHTML = `${String(currentQuestion + 1).padStart(2, "0")} <span>/ ${String(questions.length).padStart(2, "0")}</span>`;
  progressBar.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
  backButton.hidden = currentQuestion === 0;
  choiceGrid.replaceChildren();

  question.choices.forEach((choice, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `choice-card${choice.image ? " has-photo" : ""}${answers[currentQuestion]?.value === choice.value ? " is-selected" : ""}`;
    button.setAttribute("aria-pressed", String(answers[currentQuestion]?.value === choice.value));
    button.innerHTML = `
      ${choice.image
        ? `<img class="choice-photo" src="${choice.image}" alt="${choice.imageAlt}" />`
        : `<span class="choice-icon" aria-hidden="true">${choice.icon}</span>`}
      <span class="choice-copy">
        <strong>${choice.title}</strong>
        <small>${choice.detail}</small>
        ${choice.spoiler ? `<span class="choice-spoiler" role="button" tabindex="0" aria-expanded="false"><span class="choice-spoiler-mask">нажми, чтобы узнать</span><span class="choice-spoiler-text" aria-hidden="true"></span></span>` : ""}
      </span>
      <span class="choice-check" aria-hidden="true">✓</span>
    `;
    const spoilerButton = button.querySelector(".choice-spoiler");
    if (spoilerButton) {
      spoilerButton.dataset.revealText = choice.spoiler;
      const revealSpoiler = (event) => {
        event.stopPropagation();
        spoilerButton.classList.add("is-revealed");
        spoilerButton.setAttribute("aria-expanded", "true");
        spoilerButton.querySelector(".choice-spoiler-mask").hidden = true;
        const spoilerText = spoilerButton.querySelector(".choice-spoiler-text");
        spoilerText.textContent = spoilerButton.dataset.revealText;
        spoilerText.removeAttribute("aria-hidden");
      };
      spoilerButton.addEventListener("click", revealSpoiler);
      spoilerButton.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          revealSpoiler(event);
        }
      });
    }
    button.addEventListener("click", () => {
      answers[currentQuestion] = choice;
      if (currentQuestion < questions.length - 1) {
        currentQuestion += 1;
        renderQuestion();
      } else {
        resetSpoiler();
        showScreen("confession");
      }
    });
    choiceGrid.append(button);
  });
}

document.querySelector("#start-button").addEventListener("click", () => {
  currentQuestion = 0;
  resetSpoiler();
  renderQuestion();
  showScreen("quiz");
});

backButton.addEventListener("click", () => {
  if (currentQuestion > 0) {
    currentQuestion -= 1;
    renderQuestion();
  } else {
    showScreen("welcome");
  }
});

function resetSpoiler() {
  const button = document.querySelector("#spoiler-button");
  button.classList.remove("is-revealed");
  button.setAttribute("aria-expanded", "false");
  button.setAttribute("aria-label", "Открыть скрытую часть признания");
  const spoilerText = document.querySelector("#spoiler-text");
  spoilerText.textContent = "";
  spoilerText.setAttribute("aria-hidden", "true");
  document.querySelector("#confession-subline").hidden = true;
  document.querySelector("#confession-next").hidden = true;
}

document.querySelector("#spoiler-button").addEventListener("click", (event) => {
  const button = event.currentTarget;
  button.classList.add("is-revealed");
  button.setAttribute("aria-expanded", "true");
  button.removeAttribute("aria-label");
  const spoilerText = document.querySelector("#spoiler-text");
  spoilerText.textContent = "я тебя обожаю";
  spoilerText.removeAttribute("aria-hidden");
  document.querySelector("#confession-subline").hidden = false;
  document.querySelector("#confession-next").hidden = false;
});

document.querySelector("#confession-next").addEventListener("click", () => showScreen("letter"));

document.querySelector("#result-button").addEventListener("click", () => {
  const place = answers[0]?.value;
  const plan = answers.slice(1).map((answer) => answer?.value);
  const totalKisses = answers.reduce((total, answer) => total + (answer?.kisses ?? 0), 0);

  if (!place || plan.some((choice) => !choice)) {
    throw new Error("Невозможно показать результат: не на все вопросы получены ответы.");
  }

  document.querySelector("#result-place").textContent = place;
  document.querySelector("#result-plan").textContent = plan.join(", ");
  document.querySelector("#kiss-total").textContent = totalKisses;
  showScreen("result");
});

document.querySelector("#restart-button").addEventListener("click", () => {
  answers.fill(null);
  currentQuestion = 0;
  showScreen("welcome");
});
