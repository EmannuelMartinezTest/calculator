const buttons = document.querySelector<HTMLElement>("#buttons");
const inputDisplay = document.querySelector<HTMLElement>("#inputDisplay");
// prettier-ignore
const historyDisplay = document.querySelector<HTMLElement>("#pastResultsDisplay");

buttons?.addEventListener("click", processButtons);

document.addEventListener("keydown", processKeys);

function processKeys(evt: KeyboardEvent) {
  let key = evt.key;

  if (key === "/") {
    key = "÷";
    evt.preventDefault();
    calculate(key);
    lastOperator = key;
    return;
  }
  switch (key) {
    case "0":
    case "1":
    case "2":
    case "3":
    case "4":
    case "5":
    case "6":
    case "7":
    case "8":
    case "9":
    case ".":
      updateInputDisplay(key);
      break;
    case "+":
    case "-":
    case "*":
    case "=":
    case "Enter":
      if (key === "Enter") key = "=";
      if (key === "-") key = "﹣";
      if (key === "*") key = "×";
      calculate(key);
      lastOperator = key;
      break;
    case "Backspace":
      // Assuming you have a function to handle backspace or delete
      inputArray = [];
      updateInputDisplay();
      break;
  }
}

let inputArray: string[] = [];
let historyArray: string[] = [];
let operand1: any, operand2: any;
let lastOperator = "";

function processButtons(evt: Event) {
  if (!(evt.target instanceof HTMLButtonElement)) return;
  let input = evt.target.textContent;
  if (!input) return;

  switch (input) {
    case "AC":
      resetParameters();
      updateDisplay();
      break;
    case "C":
      inputArray = [];
      updateInputDisplay();
      // Code for C button
      break;
    case "←":
      inputArray.pop();
      updateInputDisplay();
      // Code for delete button
      break;
    case "÷":
    case "×":
    case "﹣":
    case "+":
    case "=":
      calculate(input);
      lastOperator = input;
      break;
    case ".":
    default:
      updateInputDisplay(input);
      break;
  }
}
// I'm going to explain my thoughts as to how we calculate items.
function calculate(operator: string) {
  /*
      Should only be accessed if this is the first time we load the app, we've pressed AC, or we pressed
      the "=" button
   */
  if (operand1 === undefined) {
    /*
        As calculate only performs a calculation when both operand1 and operand2 are defined, I purposefully
        set operand1 as undefined whenever we press the "=" button, as just pressing another operator will
        try and perform a computation with a null value, causing an error

        And since we had messed up the order "earlier" when we pressed "=", we have to reset them back
        for formatting purposes. so it goes from (operand2 operator operand1) => (operand1 operator operand2)
    */
    if (operand2) {
      operand1 = operand2;
      operand2 = undefined;
    } else {
      // this is our AC or first load entry point
      operand1 = parseFloat(inputArray.join(""));
    }
    inputArray = [];
    historyArray = [`${operand1} ${operator}`];
    updateDisplay();
  } else {
    operand2 = parseFloat(inputArray.join(""));
    let result: string | number = round(
      getResults(operand1, operand2, lastOperator),
    );

    historyArray =
      operator === "="
        ? [`${operand1} ${lastOperator} ${operand2} =`]
        : [`${result} ${operator}`];
    inputArray = [result.toString()];
    updateDisplay();
    inputArray = [];

    if (operator === "=") {
      operand2 = +result;
      operand1 = undefined;
    } else {
      operand1 = +result;
    }
  }
}

function getResults(a: number, b: number, operator: string): number {
  let result;
  switch (operator) {
    case "÷":
      if (b === 0) return NaN;
      result = a / b;
      break;
    case "×":
      result = a * b;
      break;
    case "﹣":
      result = a - b;
      break;
    case "+":
      result = a + b;
      break;
  }
  if (!result) return NaN;
  return result;
}

function resetParameters() {
  inputArray = [];
  historyArray = [];
  operand1 = undefined;
  operand2 = undefined;
}
function updateDisplay() {
  updateInputDisplay();
  updateHistoryDisplay();
}

function updateInputDisplay(input?: string) {
  if (inputArray.length > 8) return;
  if (!inputDisplay) return;
  if (input === "." && inputArray.indexOf(".") !== -1) return;
  if (input) inputArray.push(input);
  inputDisplay.textContent =
    inputArray.length === 0 ? "0" : inputArray.join("");
}

function updateHistoryDisplay() {
  if (!historyDisplay) return;
  historyDisplay.textContent = historyArray.join("");
}

function round(result: number): string | number {
  // Have to check if we have a result in sciNotation
  let resultString = result.toString();

  if (resultString.includes("e")) {
    return toScientificNotation(result);
  }

  // We want a max of 9 characters, including the decimal
  const decimalIndex = resultString.indexOf(".");

  if (decimalIndex === -1) {
    return resultString.length <= 9 ? result : toScientificNotation(result);
  }

  // If the decimal doesn't exist, we give ourselves another decimal place
  const maxDecimalPlaces = 8 - decimalIndex;
  let roundedResult = parseFloat(result.toFixed(maxDecimalPlaces));

  resultString = roundedResult.toString();

  if (resultString.length > 9) {
    return toScientificNotation(roundedResult);
  }

  return roundedResult;
}

function toScientificNotation(number: number): string {
  let sciNotation = number.toExponential(4);

  if (sciNotation.length > 9) {
    sciNotation = number.toExponential(3);
  }

  return sciNotation;
}

updateInputDisplay();
