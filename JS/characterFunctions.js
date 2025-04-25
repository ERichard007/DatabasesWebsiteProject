const subrace = document.getElementById('subrace');

const chooseProficiency = document.getElementById('proficiencyChoices');
const chooseOtherProficiency = document.getElementById('otherProficiencyChoice');

const startingEquipmentOptions = document.getElementById('startingEquipmentOptions');

//Give player subclass stuff
function BuildPlayerSubclass(character, subclassData){
    subclassData.forEach(levelData => {
        if (character.level >= levelData.level){
            levelData.features.forEach(feature => {
                fetch(`https://www.dnd5eapi.co${feature.url}`)
                .then(Response => Response.json())
                .then(featureData => {
                    character.features.push({[feature.name]: featureData.desc})
                })
                .catch(error => {
                    console.error(`There was an error retrieving feature level data: ${error}`)
                });
            });
        }
    })
}

//Give the player all their level specific stuff
function BuildPlayerLevelSpecificStuff(character, levelData){
    const playerLevel = character.level;

    levelData.forEach(levelStuff => {
        const level = levelStuff.level;

        if (playerLevel >= level){

            //start with features
            if (levelStuff.features){
                levelStuff.features.forEach(feature => {
                    fetch(`https://www.dnd5eapi.co${feature.url}`)
                    .then(Response => Response.json())
                    .then(featureData => {
                        character.features.push({[feature.name]: featureData.desc});
                    })
                    .catch(error => {
                        console.error(`Error accessing **${feature.name}** data: ${error}`)
                    })
                });
            }

            //give profbonus
            character.proficiency_bonus = levelStuff.prof_bonus;

            //need to handle spellcasting
            if (levelStuff.spellcasting){
                character.spellSlots = levelStuff.spellcasting;
            }

            //handle class specific values
            character.classSpecificAttributes = levelStuff.class_specific;
        }
    });

    fetch(`https://www.dnd5eapi.co${levelData.subclasses[0].url}`)
    .then(Response => Response.json())
    .then(subclassData => {
        character.subclass = subclassData.class.name;
        fetch(`https://www.dnd5eapi.co${subclassData.subclass_levels}`)
        .then(Response => Response.json())
        .then(subclassLevelData => {
            BuildPlayerSubclass(character, subclassLevelData);
        })
        .catch(error => {
            console.error(`Issues with loading the subclass levels: ${error}`);
        });
    })
    .catch(error => {
        console.error(`Problem getting subclass data: ${error}`);
    });
}

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
    character.class = classData.name;

    character.other_proficiencies2 = [];
    character.inventory = [];

    character.saving_throws.forEach(save => {
        save.proficient = false;
    });

    //Function starts here ------------------------------------------

    //giving the player their choice of starting proficiencies
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

        chooseProficiency.appendChild(label);
        chooseProficiency.appendChild(checkbox);

        checkbox.addEventListener('change', () => {
            const selectedCheckboxes = document.querySelectorAll('input[name="Proficiency Choice"]:checked');
            if (selectedCheckboxes.length > classData.proficiency_choices[0].choose){
                checkbox.checked = false;
            }
        });
    });

    //giving players second choice of starting proficiency if applicable
    if (classData.proficiency_choices.length>1){
        classData.proficiency_choices[1].from.options.forEach(option => {
            const profName = option.item.name;
    
            const checkbox = document.createElement('input');
            checkbox.type = "checkbox";
            checkbox.id = `${profName}-choice`;
            checkbox.name = "Other Proficiency Choice";
            checkbox.value = profName;
    
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

    //giving player's their proficiencies and saving throws
    classData.proficiencies.forEach(prof => {
        const name = prof.name.split("Saving Throw: ");
        if (name[1]) {
            const savingThrow = name[1];
            character.saving_throws.forEach(save => {
                if (save.hasOwnProperty(savingThrow)){
                    save.proficient = true;
                }
            })
        }else if (!(name[0] in character.other_proficiencies)){
            character.other_proficiencies2.push(name[0]);
        }
    })

    //give starting equipment
    classData.starting_equipment.forEach(equip => {
        for (let i = 0; i < equip.quantity; i++) {
            character.inventory.push(equip.equipment.name);
        }
    });

    //adding player's starting equipment options
    ct = 0;
    classData.starting_equipment_options.forEach(option => {
        ct+=1;

        const numChoices = option.choose;

        const newParagraph = document.createElement('p');
        newParagraph.innerHTML = `Choose ${numChoices}: ${option.desc}`;

        startingEquipmentOptions.appendChild(newParagraph)

        option.from.options.forEach(item => {
            console.log(item);
            if (item.of){
                const checkbox = document.createElement('input');
                checkbox.type = "checkbox";
                checkbox.id = `${item.of.name}-choice`;
                checkbox.name = `Starting Equipment Choice${ct}`;
                checkbox.value = item.of.name;

                const label = document.createElement('label');
                label.htmlFor = checkbox.id;
                label.textContent = `${item.count} ${item.of.name}`;

                checkbox.addEventListener('change', ((choiceGroup) => () => {
                    const selectedCheckboxes = document.querySelectorAll(`input[name="Starting Equipment Choice${choiceGroup}"]:checked`)
                    if (selectedCheckboxes.length > numChoices){
                        checkbox.checked = false;
                    }
                })(ct));

                startingEquipmentOptions.appendChild(label);
                startingEquipmentOptions.appendChild(checkbox);
                
            }else if (item.choice){
                const new_item = item.choice;
                const choices = new_item.choose;

                const checkbox = document.createElement('input');
                checkbox.type = "checkbox";
                checkbox.id = `${new_item.desc}-choice`;
                checkbox.name = `Starting Equipment Choice${ct}`;
                checkbox.value = new_item.desc;

                const label = document.createElement('label');
                label.htmlFor = checkbox.id;
                label.textContent = `${choices} ${new_item.desc}`;

                checkbox.addEventListener('change', ((choiceGroup) => () => {
                    const selectedCheckboxes = document.querySelectorAll(`input[name="Starting Equipment Choice${choiceGroup}"]:checked`)
                    if (selectedCheckboxes.length > numChoices){
                        checkbox.checked = false;
                    }
                })(ct));

                startingEquipmentOptions.appendChild(label);
                startingEquipmentOptions.appendChild(checkbox);

            }else{
                const description = item.desc;
                const choices = item.choose;
                item.from.options.forEach(option2 => {
                    const checkbox = document.createElement('input');
                    checkbox.type = "checkbox";
                    checkbox.id = `${option2.of.name}-choice`;
                    checkbox.name = `Starting Equipment Choice${ct}`;
                    checkbox.value = option2.of.name;

                    const label = document.createElement('label');
                    label.htmlFor = checkbox.id;
                    label.textContent = `${option2.count} ${option2.of.name}`;

                    startingEquipmentOptions.appendChild(label);
                    startingEquipmentOptions.appendChild(checkbox);

                    checkbox.addEventListener('change', ((choiceGroup) => () => {
                        const selectedCheckboxes = document.querySelectorAll(`input[name="Starting Equipment Choice${choiceGroup}"]:checked`)
                        if (selectedCheckboxes.length > numChoices){
                            checkbox.checked = false;
                        }
                    })(ct));
                });
            }
        });
    });

    //adding level specific things and features
    continueButton2.addEventListener('click', () => {
        fetch(`https://www.dnd5eapi.co${classData.class_levels}`)
        .then(Response => Response.json())
        .then(data => {
            BuildPlayerLevelSpecificStuff(character, data);
        })
        .catch(error => {
            console.error(`There was an error when trying to retrieve class leveling data: ${error}`);
        });
    });
}