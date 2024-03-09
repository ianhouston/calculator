const calculatorContainer = document.querySelector('body').querySelector('.calculatorContainer');

function giveButton() { 
    calculatorContainer.appendChild(document.createElement('button'));
    return calculatorContainer.lastChild;
};

let buttonList = {
    "CE" : giveButton(),  "C" : giveButton(),  "<-" : giveButton(), "/" : giveButton(),
    "7" : giveButton(),   "8" : giveButton(),  "9" : giveButton(),  "*" : giveButton(),
    "4" : giveButton(),   "5" : giveButton(),  "6" : giveButton(),  "-" : giveButton(),
    "1" : giveButton(),   "2" : giveButton(),  "3" : giveButton(),  "+" : giveButton(),
    "+/-" : giveButton(), "0" : giveButton(),  "\." : giveButton(),  "=" : giveButton()
};

const buttonListMap = new Map(Object.entries(buttonList));

buttonListMap.forEach((element, name) => {
    element.textContent = name;
});

