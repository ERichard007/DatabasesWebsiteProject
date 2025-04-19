const subrace = document.getElementById('subrace');

const chooseProficiency = document.getElementById('proficiencyChoices');
const chooseOtherProficiency = document.getElementById('otherProficiencyChoice');

//BUilds the inital character from the race values, RUNS FIRST!
function BuildCharacterFromRace(character, raceData){
    //INITIALIZATIONS --------------------------------------------
    character.other_proficiencies = [];
    character.languages = [];
    character.traits = [];
    character.speed = raceData.speed;

    character.ability_scores.forEach(ability =>{
        ability[Object.keys(ability)[0]] = 0;
        ability.bonus = 0;
    });

    character.skills.forEach(skill => {
        skill.proficient = false;
    });

    //Function starts here ------------------------------------------

    //Race Name
    if (raceData.subraces.length > 0){
        character.race = raceData.subraces[0].name;
    }else{
        character.race = raceData.name;
    }

    
    //setting the ability score bonuses!
    raceData.ability_bonuses.forEach(ability => {
        const abilityName = ability.ability_score.name;
        const bonus = ability.bonus

        character.ability_scores.forEach(charAbility => {
            if (charAbility.hasOwnProperty(abilityName)){
                charAbility.bonus = bonus;
            }
        });
    });

    //setting the race starting proficiencies!
    if (raceData.starting_proficiencies.length>0){
        raceData.starting_proficiencies.forEach(prof => {
            const skillName = prof.name.split("Skill: ")[1];

            character.skills.forEach(skill => {
                if (skill.hasOwnProperty(skillName)){
                    skill.proficient = true;
                }
            });
        })
    }
    
    //add languages
    raceData.languages.forEach(lang => {
        character.languages.push(lang.name);
    });

    //giving player's their traits
    raceData.traits.forEach(trait =>{
        fetch(`https://www.dnd5eapi.co/api/2014/traits/${trait.index}`)
            .then(Response => Response.json())
            .then(data => {
                const traitData = data

                character.traits.push({'name': traitData.name, 'desc': traitData.desc})
            })
            .catch(error => {
                console.error("Error loading trait data: ", error);
            });
    });

    //If they have a subrace
    if (raceData.subraces.length>0){
        fetch(`https://www.dnd5eapi.co/api/2014/subraces/${raceData.subraces[0].index}`)
            .then(Response => Response.json())
            .then(data => {
                const subraceData = data;

                subrace.innerHTML = `${subraceData.name}: ${subraceData.desc}`

                //Adding new ability bonuses
                subraceData.ability_bonuses.forEach(ability => {
                    const abilityName = ability.ability_score.name;
                    const bonus = ability.bonus

                    character.ability_scores.forEach(charAbility => {
                        if (charAbility.hasOwnProperty(abilityName)){
                            charAbility.bonus += bonus;
                        }
                    });
                })

                //Add new starting proficiencies to other proficiencies
                subraceData.starting_proficiencies.forEach(prof => {
                    character.other_proficiencies.push(prof.name);
                })

                //Adding any more racial traits
                subraceData.racial_traits.forEach(trait => {
                    fetch(`https://www.dnd5eapi.co/api/2014//traits/${trait.index}`)
                        .then(Response => Response.json())
                        .then(data => {
                            const traitData = data;
                            character.traits.push({'name': traitData.name, 'desc': traitData.desc})
                        })
                        .catch(error => {
                            console.error("Error loading racial traits for subrace: ", error)
                        });
                })
            })
            .catch(error => {
                console.error("Problem loading subrace data: ", error);
            });
    }else{
        subrace.innerHTML = "Subrace: No Subrace Available";
    }
}

//Builds the character from the class, runs second to from race!
function BuildCharacterFromClass(character, classData){
    //INITIALIZATIONS -------------------------------------------- 
    character.hit_dice = classData.hit_die;

    //Function starts here ------------------------------------------

    //giving the player their choice of proficiencies
    //chooseProficiency.innerHTML = '';
    classData.proficiency_choices[0].from.options.forEach(option => {
        const profName = option.item.name.split("Skill: ")[1];

        const checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.id = `${profName}-choice`
        checkbox.name = "Proficiency Choice"
        checkbox.value = profName

        const label = document.createElement('label');
        label.htmlFor = checkbox.id;
        label.textContent = profName;

        chooseProficiency.appendChild(checkbox);
        chooseProficiency.appendChild(label);

        checkbox.addEventListener('change', () => {
            const selectedCheckboxes = document.querySelectorAll('input[name="Proficiency Choice"]:checked');
            if (selectedCheckboxes.length > classData.proficiency_choices[0].choose){
                checkbox.checked = false;
            }
        });
    });

    //giving players second choice of proficiency if applicable
    if (classData.proficiency_choices.length>1){
        classData.proficiency_choices[1].from.options.forEach(option => {
            const profName = option.item.name;
    
            const checkbox = document.createElement('input');
            checkbox.type = "checkbox";
            checkbox.id = `${profName}-choice`
            checkbox.name = "Other Proficiency Choice"
            checkbox.value = profName
    
            const label = document.createElement('label');
            label.htmlFor = checkbox.id;
            label.textContent = profName;
    
            chooseOtherProficiency.appendChild(checkbox);
            chooseOtherProficiency.appendChild(label);
    
            checkbox.addEventListener('change', () => {
                const selectedCheckboxes = document.querySelectorAll('input[name="Other Proficiency Choice"]:checked');
                if (selectedCheckboxes.length > classData.proficiency_choices[1].choose){
                    checkbox.checked = false;
                }
            });
        });
    }
}