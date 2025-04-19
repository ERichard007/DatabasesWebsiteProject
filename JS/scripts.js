const startBtn = document.getElementById("beginButton");
const playerName = document.getElementById("playerName");
const welcomeMessage = document.getElementById("welcomeMessage");

const continueButton = document.getElementById("continueButton");

const profInputs = document.getElementById("proficiencyInputs");

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

    console.log(character);
});