// Globals
const validNumbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const validOperators = ["+", "-", "*", "/"];
const lowerDisplayTarget = document.getElementById("lower-display");
const upperDisplayTarget = document.getElementById("upper-display");
const historyList = document.getElementById("history-list");
let inputSequence = [];
let leftOperant = null;
let rightOperant = null;
let operator = null;
let equalCache = false;

function validateInput(userInput) {
  if (equalCache) {
    // If coming from equal
    if (validOperators.includes(userInput)) {
      // if operator follow on equal
      operator = userInput;
      drawUpperDisplay(leftOperant + " " + operator);
      drawLowerDisplay(leftOperant);
      equalCache = false;
    } else if (validNumbers.includes(userInput)) {
      inputSequence.push(Number(userInput));
      drawLowerDisplay(arrayToNumber());
      drawUpperDisplay("clear");
      equalCache = false;
      leftOperant = null;
      rightOperant = null;
      operator = null;
    }
  } else if (!equalCache) {
    if (validNumbers.includes(userInput)) {
      // Input is a number

      inputSequence.push(Number(userInput));
      drawLowerDisplay(arrayToNumber());
    } else if (validOperators.includes(userInput)) {
      // Input is an operator
      if (inputSequence.length === 0) {
        operator = userInput;
        if (upperDisplayTarget.innerHTML !== "") {
          upperDisplayTarget.innerHTML =
            upperDisplayTarget.innerHTML.slice(0, -1) + operator;
        }
      } else {
        if (leftOperant === null) {
          leftOperant = arrayToNumber();
          operator = userInput;
          inputSequence = [];
          drawUpperDisplay(
            upperDisplayTarget.innerHTML + " " + leftOperant + " " + operator
          );
        } else if (leftOperant !== null) {
          rightOperant = arrayToNumber();
          leftOperant = calcExpression();
          operator = userInput;
          inputSequence = [];
          drawUpperDisplay(
            upperDisplayTarget.innerHTML + " " + rightOperant + " " + operator
          );
          drawLowerDisplay(leftOperant);
          rightOperant = null;
        }
      }
      //
    } else if (userInput === "=") {
      // Input is equal-sign
      rightOperant = arrayToNumber();
      inputSequence = [];
      leftOperant = calcExpression();
      drawLowerDisplay(leftOperant);
      drawUpperDisplay(
        upperDisplayTarget.innerHTML + " " + rightOperant + " ="
      );
      drawHistory();
      equalCache = true;
    }
  }
  if (userInput === "CE") {
    // Input is CE
    drawHistory("clear");
    drawLowerDisplay("clear");
    drawUpperDisplay("clear");
    inputSequence = [];
    leftOperant = null;
    rightOperant = null;
    operator = null;
    equalCache = false;
  }
}

function arrayToNumber() {
  let sequenceNumber = 0;
  for (let i = 0; i < inputSequence.length; i++) {
    sequenceNumber +=
      inputSequence[i] * Math.pow(10, inputSequence.length - 1 - i);
  }
  return sequenceNumber;
}

function calcExpression() {
  let result = 0;
  if (operator === "+") {
    result = leftOperant + rightOperant;
  } else if (operator === "-") {
    result = leftOperant - rightOperant;
  } else if (operator === "*") {
    result = leftOperant * rightOperant;
  } else if (operator === "/") {
    result = leftOperant / rightOperant;
  }
  return result;
}

function drawLowerDisplay(option) {
  if (option === "clear") {
    lowerDisplayTarget.innerHTML = "0";
  } else {
    lowerDisplayTarget.innerHTML = option;
  }
}
function drawUpperDisplay(option) {
  if (option === "clear") {
    upperDisplayTarget.innerHTML = "";
  } else {
    upperDisplayTarget.innerHTML = option;
  }
}

function drawHistory(option) {
  if (option === "clear") {
    historyList.innerHTML = "";
  } else {
    const historyResult = document.createElement("li");
    historyResult.classList.add("history-result");
    historyResult.textContent = lowerDisplayTarget.innerHTML;
    historyList.prepend(historyResult);
    const historyCalc = document.createElement("li");
    historyCalc.classList.add("history-calc");
    historyCalc.textContent = upperDisplayTarget.innerHTML;
    historyList.prepend(historyCalc);
  }
}

drawLowerDisplay("clear");

// Eventlistener to intercept button-inputs
const btnField = document.querySelector(".btn-field");
btnField.addEventListener("click", (event) => {
  validateInput(event.target.textContent);
});
