const startBtn = document.getElementById("beginButton");
const playerName = document.getElementById("playerName");
const welcomeMessage = document.getElementById("welcomeMessage");

const continueButton = document.getElementById("continueButton");
const continueButton2 = document.getElementById("continueButton2");

const profInputs = document.getElementById("proficiencyChoices");
const otherprofInputs = document.getElementById("otherProficiencyChoice");
const startingEquipmentInputs = document.getElementById("startingEquipmentOptions");

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