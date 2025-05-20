const startBtn = document.getElementById("beginButton");
const playerName = document.getElementById("playerName");
const welcomeMessage = document.getElementById("welcomeMessage");

const continueButton = document.getElementById("continueButton");
const continueButton2 = document.getElementById("continueButton2");
const continueButton3 = document.getElementById("continueButton3");

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

function AbilityScoreDropdownValueChanged() {
    //first lets go see what has been selected through all of them and get rid of all their past children except for the one selected
    const chosenStats = new Set();
    dropdowns.forEach(d => {
        const valueSelected = d.value;
        chosenStats.add(valueSelected);

        Array.from(d.children).forEach(opt => {
            opt.remove();
        });

        const newOption = document.createElement("option");
        newOption.value = valueSelected;
        newOption.innerHTML = valueSelected;
        newOption.selected = true;
        d.appendChild(newOption);
    });
    
    console.log(chosenStats);
    
    //now lets give them new children
    const diceTotalSet = new Set(Array.from(diceTotals.children).map(child => child.innerHTML));
    const unchosenStats = new Set([...diceTotalSet].filter(x => !chosenStats.has(x)));
    console.log(unchosenStats)
    dropdowns.forEach(d => {
        Array.from(unchosenStats).forEach(t => {
            const newOption = document.createElement("option");
            newOption.value = t.innerHTML;
            newOption.innerHTML = t.innerHTML;
            d.appendChild(newOption);
        });
    });
}

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

