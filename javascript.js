const calculatorContainer = document.querySelector('body').querySelector('.calculatorContainer');
const calculatorTextContainer = calculatorContainer.querySelector('.calculatorTextContainer');
const calculatorText = calculatorTextContainer.querySelector('.calculatorText');
const calculatorResult = calculatorTextContainer.querySelector('.calculatorResult');

const decimalLimit = 3;
let numbers = [];
let operators = [];
let lastResult = "0";
let justEvaluated = false;

///// ADDING METHODS FOR BUTTON EVENTS /////

// TEXT UPDATING/RESETTING //

//changes the calculator's text to the current variable values
// and resets the result to nothing if there is already an evaluation
// because this method implies that there is a new button press that
// will generate new data for a new evaluation.
const updateText = () => {
    calculatorText.textContent = "";
    numbers.forEach((number, numberIndex) => {
        calculatorText.textContent+= number;
        if (operators.length - 1 >= numberIndex) {
            calculatorText.textContent+= ` ${operators[numberIndex]} `;
        }
    });
    
    if (justEvaluated) {
        calculatorResult.textContent = "";
        justEvaluated = false;
    }
}

const resetTextVariables = () => {
    numbers = [];
    operators = [];
    updateText();
}


// TEXT BACKTRACKING //

const clearEntry = () => {
    if (justEvaluated) {
        resetTextVariables();
        return;
    }

    let lastNumbersIndex = numbers.length - 1;

    if (numbers.length == operators.length) {
        operators.pop();
    }
    else if (numbers[lastNumbersIndex] == "") {
        numbers.pop();
        operators.pop();
    }
    else {
        numbers.pop();
    }
    updateText();
}

const backspaceOnce = () => {
    if (justEvaluated) {
        resetTextVariables();
        return;
    }

    let lastNumbersIndex = numbers.length - 1;

    if (numbers.length == operators.length) {
        operators.pop();
    }
    else if (numbers[lastNumbersIndex] == "") {
        numbers.pop();
        operators.pop();
    }
    else {
        numbers[lastNumbersIndex] = numbers[lastNumbersIndex].substring(0, numbers[lastNumbersIndex].length - 1);
    }
    updateText();
}

// CALCULATION MUTATORS //

//returns the index of the current number
// and can generate a new index if needed
// and given permission with addNumberAllowed
function getCurrentNumberIndex(addNumberAllowed = true) {
    if (justEvaluated) {
        resetTextVariables();
    }

    if (operators.length == numbers.length) {
        if (addNumberAllowed) {
            numbers.push("");
        }
        return numbers.length - 1;
    }
    else {
        return numbers.length - 1;
    }
}

//adds another digit to the end of
// the string holding the full number
function addToNumber(nextDigit) {
    numberIndex = getCurrentNumberIndex();
    numbers[numberIndex]+= nextDigit;
    updateText();
}

const addArithmeticOperator = (newOperator) => {
    if (justEvaluated) {
        resetTextVariables();
        numbers.push(lastResult);
        justEvaluated = false;
    }

    if (operators.length < numbers.length) {
        operators.push(newOperator);
    }
    else {
        operators[operators.length - 1] = newOperator; 
    }
    updateText();
}

const changeNumberSign = () => {
    numberIndex = getCurrentNumberIndex();
    if (numbers[numberIndex] == "") { 
        numbers[numberIndex] = "-";
    }
    else if (numbers[numberIndex] == "-") {
        numbers[numberIndex] = "";
    }
    else {
        numbers[numberIndex] = `${numbers[numberIndex] * -1}`; 
    }
    updateText();
}


const addDecimalToNumber = () => { 
    if (!numbers[getCurrentNumberIndex()].includes(".")) {
        addToNumber("."); 
    }
    updateText();
}

// EVALUATION METHODS //

function stringNumberToRealNumber(stringNumber) {
    if (stringNumber.includes(".")) {
        return parseFloat(stringNumber);
    }
    else {
        return parseInt(stringNumber);
    }
}

function add(number1, number2) {
    return stringNumberToRealNumber(number1) + stringNumberToRealNumber(number2);
}
function subtract(number1, number2) {
    return stringNumberToRealNumber(number1) - stringNumberToRealNumber(number2);
}
function multiply(number1, number2) {
    return stringNumberToRealNumber(number1) * stringNumberToRealNumber(number2);
}
function divide(number1, number2) {
    if (number2 == "0") { 
        alert("Cannot divide by zero");
        return NaN;
    }
    return stringNumberToRealNumber(number1) / stringNumberToRealNumber(number2);
}

//will recursively evaluate values with operators 
// until it has gone through the entirety of the 
// numbers and operators arrays
function evaluate(number1 = numbers[0], operatorIndex = 0, number2Index = 1) {
    let result;

    switch(operators[operatorIndex]) {
        case ("+"):
            result = add(number1, numbers[number2Index]);
            break;
        case ("-"):
            result = subtract(number1, numbers[number2Index]);
            break;
        case ("*"):
            result = multiply(number1, numbers[number2Index]);
            break;
        case ("/"):
            result = divide(number1, numbers[number2Index]);
            break;
        default:
            alert("ERROR: evaluation failed!");
            return NaN;
    }
    
    if (numbers.length - 1> number2Index) {
        result = evaluate(`${result}`, operatorIndex + 1, number2Index + 1);
    }

    return result;
}

//handles the validity of the request and
// manipulating the textContent
const processEvaluationRequest = () => {
    let result;

    if (numbers.length >= 2) {
        result = evaluate();
    }
    else {
        alert("ERROR: cannot evaluate without at least 2 numbers!");
        return;
    }

    if (result % 1 == 0) {
        calculatorResult.textContent = "= " + result; 
    }
    else {
        calculatorResult.textContent = "= " + parseFloat(result.toFixed(decimalLimit)); 
    }

    justEvaluated = true;
    lastResult = `${result}`;
}

///// DEFINING CALCULATOR BUTTONS /////

function giveButton() { 
    calculatorContainer.appendChild(document.createElement('button'));
    return calculatorContainer.lastChild;
}

let buttonDefinitions = {
    "CE" : giveButton(),  "C" : giveButton(),  "<-" : giveButton(), "/" : giveButton(),
    "7" : giveButton(),   "8" : giveButton(),  "9" : giveButton(),  "*" : giveButton(),
    "4" : giveButton(),   "5" : giveButton(),  "6" : giveButton(),  "-" : giveButton(),
    "1" : giveButton(),   "2" : giveButton(),  "3" : giveButton(),  "+" : giveButton(),
    "+/-" : giveButton(), "0" : giveButton(),  "." : giveButton(),  "=" : giveButton()
}

const buttonListMap = new Map(Object.entries(buttonDefinitions));

//defines buttons with their element textContents
// and click event listeners for their respective natures
buttonListMap.forEach((element, name) => {
    element.textContent = name;
    switch (name) {
        // Backtracking
        case ("CE"):
            element.addEventListener('click', clearEntry);
            break;
        case ("C"):
            element.addEventListener('click', resetTextVariables);
            break;
        case ("<-"):
            element.addEventListener('click', backspaceOnce);
            break;
        // Digit input
        case ("0"):
        case ("1"):
        case ("2"):
        case ("3"):
        case ("4"):
        case ("5"):
        case ("6"):
        case ("7"):
        case ("8"):
        case ("9"):
            element.addEventListener('click', (event) => { addToNumber(event.currentTarget.textContent) });
            break;
        // Arithmetic input
        case ("+"):
        case ("-"):
        case ("*"):
        case ("/"):
            element.addEventListener('click', (event) => { addArithmeticOperator(event.currentTarget.textContent) });
            break;
        // Evaluation operation
        case ("="):
            element.addEventListener('click', processEvaluationRequest);
            break;
        // Special number mutators
        case ("+/-"): 
            element.addEventListener('click', () => { changeNumberSign() });
            break;
        case ("."):
            element.addEventListener('click', addDecimalToNumber);
            break;
    }
});

//// ADDING KEYBOARD CONTROLS /////

//applies event listeners on the calculator that
// extends use to the keyboard to press buttons
// except for sign changes
document.body.addEventListener('keydown', (event) => {
    console.log(`key pressed: ${event.key}`);
    switch (event.key) {
        // Backtracking
        case ("Delete"):
            if (event.shiftKey) {
                resetTextVariables();
            }
            else {
                clearEntry();
            }
            break;
        case ("Backspace"):
            if (event.shiftKey) {
                if (event.ctrlKey) {
                    resetTextVariables();
                }
                else {
                    clearEntry();
                }
            }
            else {
                backspaceOnce();
            }
            break;
        // Arithmetic input
        case ("+"):
        case ("-"):
        case ("*"):
        case ("/"):
            addArithmeticOperator(event.key);
            break;
        // Evaluation operator
        case ("Enter"):
            processEvaluationRequest();
            break;
        // Special number mutator
        case ("."):
            addDecimalToNumber();
            break;
        // Digit input
        default:
            let keyInt = parseInt(event.key);
            if (!isNaN(keyInt) && keyInt > -1 && keyInt < 10) {
                addToNumber(event.key);
            }
    }
});