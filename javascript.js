const calculatorContainer = document.querySelector('body').querySelector('.calculatorContainer');
const calculatorDisplayContainer = calculatorContainer.querySelector('.calculatorDisplayContainer');
const calculatorDisplayEquation = calculatorDisplayContainer.querySelector('.calculatorDisplayEquation');
const calculatorDisplayResult = calculatorDisplayContainer.querySelector('.calculatorDisplayResult');

const decimalLimit = 3;
let numbers = [];
let operators = [];
let lastResult;
let justEvaluated = false;

///// ADDING METHODS FOR BUTTON EVENTS /////

// TEXT UPDATING/RESETTING //

//changes the calculator's text to the current variable values
// and resets the result to nothing if there is already an evaluation
// because this method implies that there is a new button press that
// will generate new data for a new evaluation.

//takes a number in a string and 
// inserts commas if it is a large number
const commaForLargeNumberRegex = new RegExp('(?<=\\d)\\d{3}$', 'gm');
function insertCommasInNumber(number) {
    if (number > 999) {
        for (let indexForComma = number.search(commaForLargeNumberRegex); 
        indexForComma != -1 || (number.indexOf(".") != -1 && indexForComma > number.indexOf(".")); 
        indexForComma = number.slice(0, indexForComma).search(commaForLargeNumberRegex)) {
            number = number.slice(0, indexForComma) + "," + number.slice(indexForComma);
        }
    }
    return number;
}

const updateText = () => {
    calculatorDisplayEquation.textContent = "";
    numbers.forEach((number, numberIndex) => {
        number = insertCommasInNumber(number);
        calculatorDisplayEquation.textContent+= number;
        if (operators.length - 1 >= numberIndex) {
            calculatorDisplayEquation.textContent+= ` ${operators[numberIndex]} `;
        }
    });
    
    if (justEvaluated) {
        calculatorDisplayResult.textContent = "";
        justEvaluated = false;
    }
}

const resetDisplayVariables = () => {
    numbers = [];
    operators = [];
    updateText();
}


// TEXT BACKTRACKING //

const clearEntry = () => {
    if (justEvaluated) {
        resetDisplayVariables();
        return;
    }

    const lastNumbersIndex = numbers.length - 1;
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
        resetDisplayVariables();
        return;
    }

    const lastNumbersIndex = numbers.length - 1;
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
function getCurrentNumberIndex() {
    if (justEvaluated) {
        resetDisplayVariables();
        numbers.push("");
        return 0;
    }
    else {
        if (operators.length == numbers.length) {
            numbers.push("");
            return numbers.length - 1;
        }
        else {
            return numbers.length - 1;
        }
    }
}

//adds another digit to the end of
// the string holding the full number
function addToNumber(nextDigit) {
    const numberIndex = getCurrentNumberIndex();
    numbers[numberIndex]+= nextDigit;
    updateText();
}

const addArithmeticOperator = (newOperator) => {
    if (justEvaluated) {
        resetDisplayVariables();
        numbers.push(lastResult);
        operators.push(newOperator);
        justEvaluated = false;
    }
    else {
        if (operators.length < numbers.length) {
            operators.push(newOperator);
        }
        else {
            operators[operators.length - 1] = newOperator; 
        }
    }
    updateText();
}

const changeNumberSign = () => {
    const numberIndex = getCurrentNumberIndex();
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
        updateText();
    }
}

// EVALUATION METHODS //

function add(number1, number2) {
    return parseFloat(number1) + parseFloat(number2);
}
function subtract(number1, number2) {
    return parseFloat(number1) - parseFloat(number2);
}
function multiply(number1, number2) {
    return parseFloat(number1) * parseFloat(number2);
}
function divide(number1, number2) {
    if (number2 == "0") { 
        alert("Cannot divide by zero");
        return NaN;
    }
    return parseFloat(number1) / parseFloat(number2);
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
            alert("ERROR: evaluation could not parse operator!");
            return NaN;
    }
    
    if (numbers.length - 1 > number2Index) {
        result = evaluate(result.toString(), operatorIndex + 1, number2Index + 1);
    }

    return result;
}

//handles the validity of the request and
// manipulating the textContent
const processEvaluationRequest = () => {
    if (numbers.length < 2) {
        alert("ERROR: cannot evaluate without at least 2 numbers!");
        return;
    }
    let result = evaluate();

    if (result % 1 == 0) {
        calculatorDisplayResult.textContent = "= " + 
            insertCommasInNumber(result.toString()); 
    }
    else {
        calculatorDisplayResult.textContent = "= " + 
            insertCommasInNumber(parseFloat(result.toFixed(decimalLimit)).toString()); 
    }

    justEvaluated = true;
    lastResult = result.toString();
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
            element.addEventListener('click', resetDisplayVariables);
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
            element.addEventListener('click', changeNumberSign);
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
    switch (event.key) {
        // Backtracking
        case ("Delete"):
            if (event.shiftKey) {
                resetDisplayVariables();
            }
            else {
                clearEntry();
            }
            break;
        case ("Backspace"):
            if (event.shiftKey) {
                if (event.ctrlKey) {
                    resetDisplayVariables();
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
            const keyInt = parseInt(event.key);
            if (!isNaN(keyInt) && keyInt > -1 && keyInt < 10) {
                addToNumber(event.key);
            }
    }
});