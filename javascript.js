const calculatorContainer = document.querySelector('body').querySelector('.calculatorContainer');
const calculatorText = calculatorContainer.querySelector('.calculatorTextContainer').querySelector('.calculatorText');
// ADDING METHODS FOR BUTTON EVENTS

let number1 = "";
let number2 = "";
let operator = "";
let operated = false;

const resetCalculatorVariables = () => {
    number1 = ""; 
    number2 = "";
    operator = "";
}

const updateText = () => {
    calculatorText.textContent = `${number1} ${operator} ${number2}`;
}

function addDigitToNum(nextDigit, number) {
    if (number == 1) {
        number1 = number1 + nextDigit;
        return number1;
    }
    else {
        number2 = number2 + nextDigit;
        return number2;
    }
}

function add(first, second) {
    return first + second;
}
function subtract(first, second) {
    return first - second;
}
function multiply(first, second) {
    return first * second;
}
function divide(first, second) {
    return first / second;
}

function operate() {
    operated = true;
    var realNumber1 = parseInt(number1);
    var realNumber2 = parseInt(number2);
    if (operator == "+") {
        return add(realNumber1, realNumber2);
    }
    else if (operator == "-") {
        return subtract(realNumber1, realNumber2);
    }
    else if (operator == "*") {
        return multiply(realNumber1, realNumber2);
    }
    else if (operator == "/") {
        return divide(realNumber1, realNumber2);
    }
    alert("ERROR: operate() failed!");
    return 0;
}

function giveCurrentNumber() {
    if (operator == "" || operated == true) {
        if (operated == true) {
            resetCalculatorVariables();
        }
        return 1;
    }
    else {
        return 2;
    }
}

// ADDING BUTTONS TO CALCULATOR CONTAINER

function giveButton() { 
    calculatorContainer.appendChild(document.createElement('button'));
    return calculatorContainer.lastChild;
}

let buttonList = {
    "CE" : giveButton(),  "C" : giveButton(),  "<-" : giveButton(), "/" : giveButton(),
    "7" : giveButton(),   "8" : giveButton(),  "9" : giveButton(),  "*" : giveButton(),
    "4" : giveButton(),   "5" : giveButton(),  "6" : giveButton(),  "-" : giveButton(),
    "1" : giveButton(),   "2" : giveButton(),  "3" : giveButton(),  "+" : giveButton(),
    "+/-" : giveButton(), "0" : giveButton(),  "\." : giveButton(),  "=" : giveButton()
}

// GIVING BUTTONS TEXT AND EVENT LISTENERS

const buttonListMap = new Map(Object.entries(buttonList));

buttonListMap.forEach((element, name) => {
    element.textContent = name; // Objects, like the element node here, are always passed by reference which makes this mutation possible in a forEach method
    element.addEventListener('click', (event) => {
        switch (event.currentTarget.textContent) {
            // Backtracking
            case ("CE"):
            case ("C"):
            case ("<-"):
                resetCalculatorVariables();
                break;
            // Digit adders
            case ("1"):
            case ("2"):
            case ("3"):
            case ("4"):
            case ("5"):
            case ("6"):
            case ("7"):
            case ("8"):
            case ("9"):
            case ("0"):
                addDigitToNum(event.currentTarget.textContent, giveCurrentNumber());
                break;
            // Evaluation operators
            case ("+"):
            case ("-"):
            case ("*"):
            case ("/"):
                operator = event.currentTarget.textContent;
                break;
            case ("="):
                calculatorText.textContent+= " = " + operate();
                return; //avoids reverting operated to true at the end
            // Special number mutators
            case ("+/-"): //strings can be operated on as numbers can except for when the + operator is used, so this case works as intended
                if (giveCurrentNumber() == 1) { number1*= -1; }
                else { number2*= -1; }
                break;
            case ("."):
                // TODO
                break;
        }
        updateText();
        operated = false;
    })
});