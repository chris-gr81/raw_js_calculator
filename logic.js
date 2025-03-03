// Globals
const validNumbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const validOperators = ["+", "-", "*", "/"];
const lowerDisplay = document.getElementById("lower-display");
const upperDisplay = document.getElementById("upper-display");
const historyList = document.getElementById("history-list");
const calculator = {
  inputSequence: [],
  leftOperant: null,
  rightOperant: null,
  operator: null,
  equalCache: false,
};

function controlLogic(userInput) {
  if (validNumbers.includes(userInput)) {
    // is number
    processNumber(userInput);
  } else if (validOperators.includes(userInput)) {
    // is operator
    processOperator(userInput);
  } else if (userInput === "=") {
    // is equal-button
    processEquals(userInput);
  } else if (userInput === "CE") {
    // is CE-button
    processClear(userInput);
  }
}

function processNumber(userInput) {
  calculator.inputSequence.push(Number(userInput));
  renderLowerDisplay(arrayToNumber());

  if (calculator.equalCache) {
    renderUpperDisplay("clear");
    calculator.leftOperant = null;
    calculator.rightOperant = null;
    calculator.operator = null;
    calculator.equalCache = false;
  }
}

function processOperator(userInput) {
  if (calculator.equalCache) {
    calculator.operator = userInput;
    renderUpperDisplay(calculator.leftOperant + " " + calculator.operator);
    renderLowerDisplay(calculator.leftOperant);
    calculator.equalCache = false;
    return;
  }

  if (calculator.inputSequence.length === 0 && upperDisplay.innerHTML !== "") {
    // wenn keine zahl im cache (vorherige Eingabe war auch Operator)
    calculator.operator = userInput;
    upperDisplay.innerHTML =
      upperDisplay.innerHTML.slice(0, -1) + calculator.operator;
  } else {
    // wenn zahl im cache
    if (calculator.leftOperant === null) {
      calculator.leftOperant = arrayToNumber();
      calculator.operator = userInput;
    } else {
      calculator.rightOperant = arrayToNumber();
      calculator.leftOperant = calcExpression();
      calculator.operator = userInput;
    }
    calculator.inputSequence = [];
    renderUpperDisplay(
      `${upperDisplay.innerHTML} ${
        calculator.rightOperant ?? calculator.leftOperant
      } ${calculator.operator}`
    );
    renderLowerDisplay(calculator.leftOperant);
    calculator.rightOperant = null;
  }
}

function processEquals(userInput) {
  calculator.rightOperant = arrayToNumber();
  calculator.inputSequence = [];
  calculator.leftOperant = calcExpression();

  renderLowerDisplay(calculator.leftOperant);
  renderUpperDisplay(
    upperDisplay.innerHTML + " " + calculator.rightOperant + " ="
  );

  calculator.equalCache = true;
}

function processClear(userInput) {
  renderHistory("clear");
  renderLowerDisplay("clear");
  renderUpperDisplay("clear");
  calculator.inputSequence = [];
  calculator.leftOperant = null;
  calculator.rightOperant = null;
  calculator.operator = null;
  calculator.equalCache = false;
}

function arrayToNumber() {
  let sequenceNumber = 0;
  for (let i = 0; i < calculator.inputSequence.length; i++) {
    sequenceNumber +=
      calculator.inputSequence[i] *
      Math.pow(10, calculator.inputSequence.length - 1 - i);
  }
  return sequenceNumber;
}

function calcExpression() {
  let result = 0;
  if (calculator.operator === "+") {
    result = calculator.leftOperant + calculator.rightOperant;
  } else if (calculator.operator === "-") {
    result = calculator.leftOperant - calculator.rightOperant;
  } else if (calculator.operator === "*") {
    result = calculator.leftOperant * calculator.rightOperant;
  } else if (calculator.operator === "/") {
    result = calculator.leftOperant / calculator.rightOperant;
  }
  renderHistory(result);
  return result;
}

function renderLowerDisplay(option) {
  if (option === "clear") {
    lowerDisplay.innerHTML = "0";
  } else {
    lowerDisplay.innerHTML = option;
  }
}
function renderUpperDisplay(option) {
  if (option === "clear") {
    upperDisplay.innerHTML = "";
  } else {
    upperDisplay.innerHTML = option;
  }
}

function renderHistory(option) {
  if (option === "clear") {
    historyList.innerHTML = "";
  } else {
    const historyResult = document.createElement("li");
    historyResult.classList.add("history-result");
    historyResult.textContent = option;
    historyList.prepend(historyResult);
    const historyCalc = document.createElement("li");
    historyCalc.classList.add("history-calc");
    historyCalc.textContent = `${calculator.leftOperant} ${calculator.operator} ${calculator.rightOperant} =`;
    historyList.prepend(historyCalc);
  }
}

renderLowerDisplay("clear");

// Eventlistener to intercept button-inputs
const btnField = document.querySelector(".btn-field");
btnField.addEventListener("click", (event) => {
  controlLogic(event.target.value);
});
