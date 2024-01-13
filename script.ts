const buttons = document.querySelector<HTMLElement>("#buttons");
const inputDisplay = document.querySelector<HTMLElement>("#inputDisplay");
// prettier-ignore
const historyDisplay = document.querySelector<HTMLElement>("#pastResultsDisplay");

buttons?.addEventListener("click", processButtons);

let inputArray: string[] = [];
let historyArray: string[] = [];
let op1, op2;
let lastOperator = "";

function processButtons(evt: Event) {
  if (!(evt.target instanceof HTMLButtonElement)) return;
  let input = evt.target.textContent;
  if (!input) return;

  switch (input) {
    case "AC":
      inputArray = [];
      historyArray = [];
      op1 = undefined;
      op2 = undefined;
      updateInputDisplay();
      updateHistoryDisplay();
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
      calculate(input);
      lastOperator = input;
      break;
    case "=":
      equals();
      break;
    case ".":
    default:
      updateInputDisplay(input);
      break;
  }
}

function calculate(operator: string) {
  if (op1 === undefined) {
    if (op2) {
      op1 = op2;
      op2 = undefined;
    } else {
      op1 = parseFloat(inputArray.join(""));
    }
    inputArray = [];
    historyArray = [`${op1} ${operator}`];
    updateInputDisplay();
    updateHistoryDisplay();
  } else {
    op2 = parseFloat(inputArray.join(""));
    let result = round(getResults(op1, op2, lastOperator));
    historyArray = [`${result} ${operator}`];
    inputArray = [result];
    updateHistoryDisplay();
    updateInputDisplay();
    inputArray = [];
    op1 = result;
  }
}

function round(result) {
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

function toScientificNotation(number) {
  let sciNotation = number.toExponential(4);

  if (sciNotation.length > 9) {
    sciNotation = number.toExponential(3);
  }

  return sciNotation;
}

function equals() {
  op2 = parseFloat(inputArray.join(""));
  let result = round(getResults(op1, op2, lastOperator));
  historyArray = [`${op1} ${lastOperator} ${op2} =`];
  inputArray = [result];
  updateHistoryDisplay();
  updateInputDisplay();
  inputArray = [];
  op2 = result;
  op1 = undefined;
}

function getResults(a, b, operator) {
  switch (operator) {
    case "÷":
      if (b === 0) return NaN;
      return a / b;
    case "×":
      return a * b;
    case "﹣":
      return a - b;
    case "+":
      return a + b;
  }
}

function updateInputDisplay(input?: string) {
  if (inputArray.length > 8) return;
  if (!inputDisplay) return;
  if (input) inputArray.push(input);
  inputDisplay.textContent =
    inputArray.length === 0 ? "0" : inputArray.join("");
}

function updateHistoryDisplay() {
  if (!historyDisplay) return;
  historyDisplay.textContent = historyArray.join("");
}

updateInputDisplay();
