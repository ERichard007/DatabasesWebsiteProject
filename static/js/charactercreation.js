// ------------------------------------------------------- VARIABLES -------------------------------------------------------------

//Dice Variables
const dice = [
    document.getElementById("dice1"),
    document.getElementById("dice2"),
    document.getElementById("dice3"),
    document.getElementById("dice4")
]

const diceTotal = document.getElementById("rollResults")
const rollButton = document.getElementById("rollDice")
const clearButton = document.getElementById("clearDice")
const totalsList = document.getElementById("totalsList")

// ------------------------------------------------------- FUNCTIONS -------------------------------------------------------------

//Dice Rolling Functions
rollButton.addEventListener('click', () => {
    let rolls = []

    let numberOfDice = totalsList.childElementCount
    if (numberOfDice < 6){
        for (let i = 0; i < 4; i++){
            let randomRoll = Math.floor((Math.random() * 6) + 1)
            dice[i].innerHTML = randomRoll
            rolls.push(randomRoll)
        }
    }else{
        return
    }

    rolls.sort((a,b) => a - b)
    let total = rolls[1] + rolls[2] + rolls[3]
    diceTotal.textContent = total

    let newListItem = document.createElement('li')
    newListItem.textContent = diceTotal.textContent
    totalsList.appendChild(newListItem)
})

clearButton.addEventListener('click', () => {
    Array.from(totalsList.children).forEach(child => {
        child.remove()
    })
})