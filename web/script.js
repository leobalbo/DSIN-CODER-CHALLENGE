//URL do servidor
const serverUrl = "http://localhost:3000";

const codeInput = document.getElementById("code-input");
const form = document.querySelector("form");
const nameInput = document.getElementById("name");
const ageInput = document.getElementById("age");
const ageErrorMessage = document.getElementById("ageErrorMessage");
const genderInput = document.getElementById("gender");
const bloodTypeSelect = document.getElementById("blood");
const musicSelect = document.getElementById("music");
const sportSelect = document.getElementById("sport");
const gameSelect = document.getElementById("game");

// Opções para seleção
const bloodType = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const musicOptions = [
  "Pop",
  "Rock",
  "Pagode",
  "Sertanejo",
  "Hip-Hop/Rap",
  "Eletrônica",
  "Funk",
  "Metal",
  "Demais gêneros estranhos",
];
const sportOptions = [
  "Futebol",
  "Basquete",
  "Vôlei",
  "Luta",
  "Atletismo",
  "eSports",
  "Natação",
];
const gameOptions = [
  "Counter-Strike",
  "Minecraft",
  "Fortnite",
  "The Witcher",
  "Valorant",
  "Assassin's Creed",
  "World of Warcraft",
  "FIFA",
  "League of Legends",
  "Dota",
  "Rocket League",
  "Outro - pouco relevante",
];

// Função para abrir o formulário
function openForm() {
  document.querySelector(".container-main").style.display = "none";
  document.querySelector(".container-form").style.display = "block";
}

// Função para abrir a tela de atributos
function openAttributes() {
  document.querySelector(".container-main").style.display = "none";
  document.querySelector(".container-code").style.display = "block";
}

// Função para inserir as habilidades na tela
function insertSkills(data) {
  const { strength, speed, intelligence } = classifyInfected(data);

  const infectedNameElement = document.getElementById("infected-name");
  const strengthElement = document.getElementById("strength");
  const strengthBar = document.querySelector(".skill-per.strength");
  const speedElement = document.getElementById("speed");
  const speedBar = document.querySelector(".skill-per.speed");
  const intelligenceElement = document.getElementById("intelligence");
  const intelligenceBar = document.querySelector(".skill-per.intelligence");

  if (infectedNameElement) {
    infectedNameElement.textContent = data.name;
  }

  if (strengthElement) {
    strengthElement.textContent = strength + "%";
  }

  if (strengthBar) {
    const strengthWidth = strength + "%";
    strengthBar.style.width = strengthWidth;
  }

  if (speedElement) {
    speedElement.textContent = speed + "%";
  }

  if (speedBar) {
    const speedWidth = speed + "%";
    speedBar.style.width = speedWidth;
  }

  if (intelligenceElement) {
    intelligenceElement.textContent = intelligence + "%";
  }

  if (intelligenceBar) {
    const intelligenceWidth = intelligence + "%";
    intelligenceBar.style.width = intelligenceWidth;
  }
}

// Função para abrir a tela de habilidades
function openSkills() {
  const code = codeInput.value;

  if (code.length >= 6) {
    getDataToServer(code, function (success, data) {
      if (success) {
        insertSkills(data);
        document.querySelector(".container-code").style.display = "none";
        document.querySelector(".container-skills").style.display = "block";
      } else {
        showError(codeInput);
      }
    });
  } else {
    showError(codeInput);
  }
}

document.getElementById("form").addEventListener("click", openForm);
document.getElementById("attributes").addEventListener("click", openAttributes);

const skillButton = document.getElementById("verify-code");
skillButton.addEventListener("click", (e) => {
  e.preventDefault();
  openSkills();
});

// Preenchimento das opções nas seleções
function createSelectOptions(selectElement, options) {
  options.forEach((optionValue) => {
    const option = document.createElement("option");
    option.value = optionValue;
    option.textContent = optionValue;
    selectElement.appendChild(option);
  });
}

createSelectOptions(bloodTypeSelect, bloodType);
createSelectOptions(musicSelect, musicOptions);
createSelectOptions(sportSelect, sportOptions);
createSelectOptions(gameSelect, gameOptions);

// Validação da entrada de idade
ageInput.addEventListener("input", () => {
  const enteredAge = parseInt(ageInput.value, 10);

  if (isNaN(enteredAge) || enteredAge < 1 || enteredAge > 200) {
    ageInput.setCustomValidity(
      "Idade inválida. Insira um número entre 1 e 200."
    );
    ageErrorMessage.textContent =
      "Idade inválida. Insira um número entre 1 e 200.";
    ageErrorMessage.style.display = "block";
  } else {
    ageInput.setCustomValidity("");
    ageErrorMessage.textContent = "";
    ageErrorMessage.style.display = "none";
  }
});

// Função para exibir erros no formulário
const showError = (field, errorText) => {
  field.classList.add("error");
  if (errorText) {
    const errorElement = document.createElement("small");
    errorElement.classList.add("error-text");
    errorElement.innerText = errorText;
    field.closest(".form-group").appendChild(errorElement);
  }
};

const submitButton = document.querySelector(".send-form");
submitButton.addEventListener("click", function (e) {
  e.preventDefault();

  const name = nameInput.value.trim();
  const age = ageInput.value;
  const gender = genderInput.value;
  const blood = bloodTypeSelect.value;
  const music = musicSelect.value;
  const sports = sportSelect.value;
  const game = gameSelect.value;
  const code = Math.floor(100000 + Math.random() * 900000);

  document
    .querySelectorAll(".form-group .error")
    .forEach((field) => field.classList.remove("error"));
  document
    .querySelectorAll(".error-text")
    .forEach((errorText) => errorText.remove());

  // Validação dos campos
  if (name === "") {
    showError(nameInput, "Digite seu nome");
  }
  if (age === "") {
    showError(ageInput, "Digite sua idade");
  }
  if (gender === "") {
    showError(genderInput, "Selecione o seu gênero");
  }
  if (blood === "") {
    showError(bloodTypeSelect, "Selecione o seu tipo sanguíneo");
  }
  if (music === "") {
    showError(musicSelect, "Selecione o seu gênero musical");
  }
  if (sports === "") {
    showError(sportSelect, "Selecione o seu esporte preferido");
  }
  if (game === "") {
    showError(gameSelect, "Selecione o seu jogo preferido");
  }

  // Verificação de erros
  const errorInputs = document.querySelectorAll(".form-group .error");
  if (errorInputs.length === 0) {
    const data = {
      name,
      age,
      gender,
      blood,
      music,
      sports,
      game,
      code,
    };
    openModal(code, data);
  }
});

// Função para enviar dados ao servidor
function sendFormDataToServer(formData) {
  fetch(`${serverUrl}/submitData`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error("Erro:", error);
    });
}

// Função para obter dados do servidor
function getDataToServer(code, callback) {
  const requestData = { code: code };
  fetch(`${serverUrl}/getData`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data) {
        if (data.error == 404) {
          console.log("Nenhum dado encontrado com o código fornecido.");
          callback(false, null);
        } else {
          console.log("Dados recuperados com sucesso:", data);
          callback(true, data);
        }
      }
    })
    .catch((error) => {
      console.error("Erro:", error);
      callback(false, null);
    });
}

// Função para abrir o modal com os resultados
const section = document.querySelector(".container-notify");
const overlay = document.querySelector(".overlay");
const closeBtn = document.querySelector(".close-btn");

function openModal(code, data) {
  section.style.display = "block";
  section.classList.add("active");
  document.getElementById("code").textContent = code;

  closeBtn.addEventListener("click", () => {
    section.style.display = "none";
    section.classList.remove("active");
    console.log(data);
    sendFormDataToServer(data);
  });
}

// Função para classificar o infectado com base em atributos
function classifyInfected(infected) {
  let strength = 40;
  let speed = 40;
  let intelligence = 40;

  if (infected.age >= 18 && infected.age <= 30) {
    speed += 35;
    strength += 25;
    intelligence += 5;
  } else if (infected.age >= 31 && infected.age <= 45) {
    speed += 20;
    strength += 10;
    intelligence += 35;
  } else if (infected.age >= 46 && infected.age <= 55) {
    strength += 5;
    speed += 10;
    intelligence += 15;
  } else if (infected.age >= 56 && infected.age <= 65) {
    strength -= 5;
    speed -= 15;
    intelligence += 20;
  } else if (infected.age >= 66) {
    strength -= 10;
    speed -= 20;
    intelligence += 25;
  }

  if (infected.sports === "Futebol") {
    strength += 15;
    speed += 40;
  } else if (infected.sports === "Basquete") {
    strength += 25;
    speed += 30;
  } else if (infected.sports === "Vôlei") {
    strength += 20;
    speed += 10;
  } else if (infected.sports === "Luta") {
    strength += 40;
    speed += 25;
  } else if (infected.sports === "Atletismo") {
    strength += 20;
    speed += 10;
  } else if (infected.sports === "eSports") {
    strength -= 15;
    speed -= 15;
    intelligence += 20;
  } else if (infected.sports === "Natação") {
    strength += 20;
    speed += 30;
  }

  if (infected.music === "Eletrônica") {
    speed -= 15;
    strength -= 10;
    intelligence -= 5;
  } else if (infected.music === "Hip-Hop/Rap") {
    speed += 5;
    strength += 10;
    intelligence += 15;
  } else if (infected.music === "Rock") {
    strength += 5;
    intelligence += 10;
  } else if (infected.music === "Metal") {
    speed += 5;
    intelligence += 10;
  } else if (infected.music === "Pagode") {
    strength -= 20;
    intelligence -= 10;
  } else if (infected.music === "Funk") {
    speed += 20;
    strength -= 15;
  } else if (infected.music === "Sertanejo") {
    speed += 5;
    strength += 5;
  } else if (infected.music === "Pop") {
    speed += 5;
    strength += 5;
    intelligence += 5;
  } else if (infected.music === "Demais gêneros estranhos") {
    speed -= 10;
    strength -= 10;
    intelligence -= 10;
  }

  if (infected.game === "The Witcher") {
    intelligence += 15;
  } else if (infected.game === "Assassin's Creed") {
    intelligence += 5;
  } else if (infected.game === "League of Legends") {
    intelligence -= 10;
  } else if (infected.game === "Dota") {
    intelligence += 20;
  } else if (infected.game === "FIFA") {
    intelligence -= 5;
  } else if (infected.game === "Minecraft") {
    intelligence += 35;
  } else if (infected.game === "Fortnite") {
    intelligence += 5;
  } else if (infected.game === "Valorant") {
    intelligence -= 15;
  } else if (infected.game === "Counter-Strike") {
    intelligence += 25;
  } else if (infected.game === "World of Warcraft") {
    intelligence += 20;
  } else if (infected.game === "Rocket League") {
    intelligence += 10;
  } else if (infected.game === "Outro - pouco relevante") {
    intelligence -= 15;
  }

  return { strength, speed, intelligence };
}
