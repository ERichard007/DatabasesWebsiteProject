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

//Class Variables
let numOfClasses = 1

const raceDiv = document.getElementById('raceAndClassDiv')
const classDiv = document.getElementById('classDiv')

const levelImage = document.getElementById('levelImage')
const classLevel = document.getElementById('levelInput')
const profBonus = document.getElementById('profBonus')
const hitDice = document.getElementById('hitDice')
const maxHP = document.getElementById('maxHP')
const spellcastingClass = document.getElementById('spellcastingClass')
const spellSlots = document.getElementById('spellSlots')
const spellcastingModifier = document.getElementById('spellMod')

const addClass = document.getElementById('addClass')
const removeClassLabel = document.getElementById('removeClassLabel')
const removeClass = document.getElementById('removeClass')

//Features/Trait Variables
let numOfTraits = 0

const featureDiv = document.getElementById('featureDiv')
const addFeature = document.getElementById('addFeature')
const removeFeatureLabel = document.getElementById('removeFeatureLabel')
const removeFeature = document.getElementById('removeFeature')

// ------------------------------------------------------- FUNCTIONS -------------------------------------------------------------

// image changing function
function classImageChange(classLeveler) {
    let level = classLeveler.value
    let closestClassDiv = classLeveler.closest(".classDiv")
    let img = closestClassDiv.querySelector('img')

    if (level <= 5){
        img.src ="/static/assets/levelImages/Level 1-5.png"
    }else if (level <= 10){
        img.src ="/static/assets/levelImages/Level 6-10-1.png"
    }else if (level <= 15){
        img.src ="/static/assets/levelImages/Level 11-15-1.png"
    }else{
        img.src ="/static/assets/levelImages/Level 16-20-1.png"
    }
}

// ------------------------------------------------------- EVENT LISTENERS -------------------------------------------------------------

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

//class adding functionality
addClass.addEventListener('click', () => {
    numOfClasses++

    removeClass.hidden = false
    removeClassLabel.hidden = false

    let classBlock2 = classDiv.cloneNode(true)
    classBlock2.id += numOfClasses

    Array.from(classBlock2.children).forEach(child => {
        if (child.id.split('Input')[0] == 'level'){
            child.addEventListener('input', () => {
                classImageChange(child)
            })
        }
        child.id += numOfClasses
        child.name += numOfClasses
    })

    raceDiv.appendChild(classBlock2)
})

//class removing functionality
removeClass.addEventListener('click', () => {
    if (numOfClasses == 1){
        return
    }

    let divName = "classDiv" + numOfClasses
    let divToRemove = document.getElementById(divName)
    divToRemove.remove()

    numOfClasses--

    if (numOfClasses == 1){
        removeClass.hidden = true
        removeClassLabel.hidden = true
    }
})

//class image changing fucntionality
classLevel.addEventListener('input', () => {
    classImageChange(classLevel)
})

//features and trait adding fucntionality
addFeature.addEventListener('click', () => {
    numOfTraits++

    removeFeatureLabel.hidden = false
    removeFeature.hidden = false

    let nameLabel = document.createElement('label')
    nameLabel.htmlFor= 'name' + numOfTraits
    nameLabel.id = 'nameLabel' + numOfTraits
    nameLabel.innerText = 'Name:'

    let name = document.createElement('input')
    name.type = 'text'
    name.id = 'name' + numOfTraits
    name.name = 'name' + numOfTraits
    name.required = true

    let descLabel = document.createElement('label')
    descLabel.htmlFor = 'description' + numOfTraits
    descLabel.id = 'descriptionLabel' + numOfTraits
    descLabel.innerText = 'Description: '

    let desc = document.createElement('input')
    desc.type = 'text'
    desc.id = 'description' + numOfTraits
    desc.name = 'description' + numOfTraits
    desc.required = true

    let break1 = document.createElement('br')
    break1.id = 'break1' + numOfTraits
    let break2 = document.createElement('br')
    break2.id = 'break2' + numOfTraits

    featureDiv.appendChild(nameLabel)
    featureDiv.appendChild(name)
    featureDiv.appendChild(break1)
    featureDiv.appendChild(descLabel)
    featureDiv.appendChild(desc)
    featureDiv.appendChild(break2)
})

//feature/trait removing functionality
removeFeature.addEventListener('click', () =>{
    if (numOfTraits == 0){
        return
    }

    let featureName = featureDiv.querySelector('#name'+numOfTraits)
    let featureLabel = featureDiv.querySelector('#nameLabel'+numOfTraits)
    let featureDesc = featureDiv.querySelector("#description"+numOfTraits)
    let featureDescLabel = featureDiv.querySelector("#descriptionLabel"+numOfTraits)
    let break1 = featureDiv.querySelector("#break1"+numOfTraits)
    let break2 = featureDiv.querySelector("#break2"+numOfTraits)

    featureName.remove()
    featureLabel.remove()
    featureDesc.remove()
    featureDescLabel.remove()
    break1.remove()
    break2.remove()

    numOfTraits--

    if (numOfTraits == 0){
        removeFeatureLabel.hidden = true
        removeFeature.hidden = true
    }
})