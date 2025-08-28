const startBtn = document.getElementById("beginButton");
const playerName = document.getElementById("playerName");
const welcomeMessage = document.getElementById("welcomeMessage");

const continueButton = document.getElementById("continueButton");
const continueButton2 = document.getElementById("continueButton2");
const continueButton3 = document.getElementById("continueButton3");
const continueButton4 = document.getElementById("AbilityScoreButton")

const profInputs = document.getElementById("proficiencyChoices");
const otherprofInputs = document.getElementById("otherProficiencyChoice");
const startingEquipmentInputs = document.getElementById("startingEquipmentOptions");

const rollButton = document.getElementById("rollDice");
const clearButton = document.getElementById("clearDice");

const dice = [
    document.getElementById("dice1"),
    document.getElementById("dice2"),
    document.getElementById("dice3"),
    document.getElementById("dice4")
];
const rollResults = document.getElementById("rollResults");
const diceTotals = document.getElementById("totalsList");

const dropdowns = [
    document.getElementById("str"),
    document.getElementById("dex"),
    document.getElementById("con"),
    document.getElementById("int"),
    document.getElementById("wis"),
    document.getElementById("cha")
];

/* -------------------------- FUNCTIONS -------------------------- */

function StartPDFEditing() {
    CreateThePDF()
}

//returns the array of ability score values that have yet to be chosen/selected. RETURNS AN ARRAY
function RemainingAbilityScoreValues() {
    const chosenValues = dropdowns.map(d => d.value).filter(v => v)
    const allValues = Array.from(diceTotals.children).map(c => c.innerHTML)
    const remainingValues = [...allValues]

    chosenValues.forEach(val => {
        const index = remainingValues.indexOf(val)
        if (index > -1) {
            remainingValues.splice(index, 1);
        }
    })

    return remainingValues
}

//Used to detect when the dropdown values are changed for selecting your ability scores
function AbilityScoreDropdownValueChanged() {
    
    const chosenValues = dropdowns.map(d => d.value).filter(v => v)
    const remainingValues = RemainingAbilityScoreValues()

    dropdowns.forEach(down => {
        down.innerText = ""
    })

    for (let i = 0; i < dropdowns.length; i++){
        const selectedOption = document.createElement("option");
        selectedOption.textContent = chosenValues[i]
        selectedOption.value = chosenValues[i]

        const blank = document.createElement("option");
        blank.textContent = " "
        blank.value = " "

        dropdowns[i].appendChild(selectedOption)
        dropdowns[i].appendChild(blank)

        remainingValues.forEach(val => {
            const newOption = document.createElement("option");
            newOption.value = val;
            newOption.innerHTML = val;
            dropdowns[i].appendChild(newOption);    
        })
    }
};

/* -------------------------- EVENT LISTENERS -------------------------- */

//Welcome message click
startBtn.addEventListener('click', () => {
    const name = playerName.value.trim();
    if (name) {
        welcomeMessage.textContent = `Welcome ${name} to your new DND character, lets get started!`;
        character.player_name = name
    }else{
        welcomeMessage.textContent = '';
    }
});

//disbale choose race input, choose class input, and any proficiency choice boxes(which should then be added once clicked)
continueButton.addEventListener('click', () => {
    raceSelection.disabled = true;
    classSelection.disabled = true;
    continueButton.disabled = true;

    //handling proficiency choices
    const inputs = profInputs.querySelectorAll('input');
    inputs.forEach(input => {
        if (input.checked){
            const inputName = input.value;
            found = false
            character.skills.forEach(skill => {
                if (skill.hasOwnProperty(inputName)){
                    found = true;
                    skill.proficient = true;
                }
            });
            if (!found && !(inputName in character.other_proficiencies)){
                character.other_proficiencies.push(inputName);
            }
        }
        input.disabled = true;
    });

    //handling other proficiency choices
    const inputs2 = otherprofInputs.querySelectorAll('input');
    inputs2.forEach(input => {
        if (input.checked){
            const inputName = input.value;
            found = false
            character.skills.forEach(skill => {
                if (skill.hasOwnProperty(inputName)){
                    found = true;
                    skill.proficient = true;
                }
            });
            if (!found && !(inputName in character.other_proficiencies)){
                character.other_proficiencies.push(inputName);
            }
        }
        input.disabled = true;
    });

    //handling starting equipment options
    const inputs3 = startingEquipmentInputs.querySelectorAll('input');
    inputs3.forEach(input => {
        if (input.checked){
            const inputName = input.value;
            character.inventory.push(inputName);
        }
        input.disabled = true;
    });


    console.log(character);
});

//Next continue button for getting the player's level
continueButton2.addEventListener('click', () => {
    continueButton2.disabled = true;
    levelInput.disabled = true;
    
    character.level = levelInput.value;

    console.log(character)
});

//Roll button to roll the 4d6 for stats
rollButton.addEventListener('click', () => {
    const rolls = [];

    for (let i = 0; i < 4; i++){
        const roll = (Math.floor(Math.random() * 6) + 1);
        rolls.push(roll);
        dice[i].innerHTML = roll;
    }
    rolls.sort((a,b) => a-b);
    const total = rolls[1] + rolls[2] + rolls[3]

    rollResults.innerHTML = total;

    if (diceTotals.childElementCount < 6){
        const newListItem = document.createElement("li");
        newListItem.innerHTML = total;
        diceTotals.appendChild(newListItem);
    }
});

//clear button if you wanna reroll your ability scores
clearButton.addEventListener('click', () => {
    Array.from(diceTotals.children).forEach(child => {
        child.remove();
    });
});

//continue button to lock in your ability scores
continueButton3.addEventListener('click', () => {
    if (diceTotals.childElementCount == 6){
        rollButton.disabled = true;
        clearButton.disabled = true;
        continueButton3.disabled = true;

        //add intial options to all of the dropdowns
        Array.from(diceTotals.children).forEach(child => {
            dropdowns.forEach(down => {
                const newOption = document.createElement("option");
                newOption.value = child.innerHTML;
                newOption.innerHTML = child.innerHTML;
                down.appendChild(newOption);

                down.addEventListener("change", AbilityScoreDropdownValueChanged)
            });
        });
    }
});

//continue button to finalize your ability score choices dropdowns
continueButton4.addEventListener('click', () => {
    const valuesLeft = RemainingAbilityScoreValues()

    if (valuesLeft.length > 0) {
        return
    }else{
        continueButton4.disabled = true

        dropdowns.forEach(down => {
            down.disabled = true
        })
    }

    StartPDFEditing()
})
