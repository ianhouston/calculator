const calculatorContainer = document.querySelector('body').querySelector('.calculatorContainer');

let buttonRows = [];

for (let i = 0; i < 4; i++) {
    buttonRows.push([]);
    for (let j = 0; j < 4; j++) {
        buttonRows.push(document.createElement('button'));
        calculatorContainer.appendChild(buttonRows[i][j]);
    }
}