const character = {
    'player_name': "",
    'character_name': "",
    'level': null,
    'class': "",
    'race': "",
    'alignment': "",
    'background': "",
    'experience': null,
    'ability_scores': [
        {
            'STR': null,
            'bonus': 0
        },
        {
            'DEX': null,
            'bonus': 0
        },
        {
            'CON': null,
            'bonus': 0
        },
        {
            'INT': null,
            'bonus': 0
        },
        {
            'WIS': null,
            'bonus': 0
        },
        {
            'CHA': null,
            'bonus': 0
        }
    ],
    'inspiration': 0,
    'proficiency_bonus': null,
    'saving_throws': [
        {
            'STR': null,
            'proficient': false
        },
        {
            'DEX': null,
            'proficient': false
        },
        {
            'CON': null,
            'proficient': false
        },
        {
            'INT': null,
            'proficient': false
        },
        {
            'WIS': null,
            'proficient': false
        },
        {
            'CHA': null,
            'proficient': false
        }
    ],
    'skills': [
        {
            'Acrobatics': null,
            'proficient': false
        },
        {
            'Animal Handling': null,
            'proficient': false
        },
        {
            'Arcana': null,
            'proficient': false
        },
        {
            'Athletics': null,
            'proficient': false
        },
        {
            'Deception': null,
            'proficient': false
        },
        {
            'History': null,
            'proficient': false
        },
        {
            'Insight': null,
            'proficient': false
        },
        {
            'Intimidation': null,
            'proficient': false
        },
        {
            'Investigation': null,
            'proficient': false
        },
        {
            'Medicine': null,
            'proficient': false
        },
        {
            'Nature': null,
            'proficient': false
        },
        {
            'Perception': null,
            'proficient': false
        },
        {
            'Performance': null,
            'proficient': false
        },
        {
            'Persuasion': null,
            'proficient': false
        },
        {
            'Religion': null,
            'proficient': false
        },
        {
            'Sleight of Hand': null,
            'proficient': false
        },
        {
            'Stealth': null,
            'proficient': false
        },
        {
            'Survival': null,
            'proficient': false
        }
    ],
    'passive_wisdom': null,
    'armor_class': null,
    'initiative': null,
    'speed': null,
    'hitpoints': null,
    'hit_dice': null,
    'languages': [],
    'traits' : [],
    'other_proficiencies': [],
    'other_proficiencies2': [],
    'inventory': []
}

const raceSelection = document.getElementById('raceSelection')
const raceDescription = document.getElementById('raceDescription')
const raceImage = document.getElementById('raceImage')

const classSelection = document.getElementById('classSelection')
const classDescription = document.getElementById('classDescription')

const levelInput = document.getElementById("levelInput");
const levelImage = document.getElementById("levelImage");

//Fetching stuff -----------------------------------------------------
fetch('https://www.dnd5eapi.co/api/2014/races')
    .then(Response => Response.json())
    .then(data => {
        const races = data.results;

        races.forEach(race => {
            const option = document.createElement('option');
            option.value = race.index;
            option.textContent = race.name;
            raceSelection.appendChild(option);
        });
    })
    .catch(error => {
        console.error("Error loading races for selection: ", error);
        raceSelection.innerHTML = "<option>Error Loading Races</option>";
    });

fetch('https://www.dnd5eapi.co/api/2014/classes')
    .then(Response => Response.json())
    .then(data => {
        const classes = data.results;

        classes.forEach(class1 => {
            const option = document.createElement('option');
            option.value = class1.index;
            option.textContent = class1.name;
            classSelection.appendChild(option);
        });
    })
    .catch(error => {
        console.error("There was an error loading the classes: ", error);
        classSelection.innerHTML = "Error loading classes";
    });


//Event Listeners -----------------------------------------------------
//race changed
raceSelection.addEventListener('change', () => {
    const selectedRace = raceSelection.value;
    const fetchURL = `https://www.dnd5eapi.co/api/2014/races/${selectedRace}`

    fetch(fetchURL)
        .then(Response => Response.json())
        .then(data => {
            const raceData = data;
            const alignment = raceData.alignment;
            const age = raceData.age;
            const sizeDesc = raceData.size_description;

            raceDescription.innerHTML = `${alignment} ${age} ${sizeDesc}`

            switch (raceData.index) {
                case 'elf':
                    raceImage.src = "../assets/raceImages/Elf.jpg"
                    break;
                case 'dragonborn':
                    raceImage.src = "../assets/raceImages/dragonborn.avif"
                    break;
                case 'dwarf':
                    raceImage.src = "../assets/raceImages/dwarf.jpg"
                    break;
                case 'gnome':
                    raceImage.src = "../assets/raceImages/gnome.jpg"
                    break;
                case 'half-elf':
                    raceImage.src = "../assets/raceImages/halfelf.avif"
                    break;
                case 'halfling':
                    raceImage.src = "../assets/raceImages/halfling.webp"
                    break;
                case 'half-orc':
                    raceImage.src = "../assets/raceImages/halforc.jpg"
                    break;
                case 'human':
                    raceImage.src = "../assets/raceImages/human.webp"
                    break;
                case 'tiefling':
                    raceImage.src = "../assets/raceImages/tiefling.jpg"
                    break;
                default:
                    raceImage.src = ""
                    break;
            }

            BuildCharacterFromRace(character, raceData);
            console.log(character);
        })
        .catch(error => {
            console.error("Could not get data from race changing: ", error);
            raceDescription.innerHTML = "Error";
        });
});

//class changed
classSelection.addEventListener('change', () =>{
    const selectedClass = classSelection.value;
    const fetchURL = `https://www.dnd5eapi.co/api/2014/classes/${selectedClass}`

    fetch(fetchURL)
        .then(Response => Response.json())
        .then(data => {
            const classData = data;
            const shortDesc = classData.proficiency_choices;


            ct = 1;
            classDescription.innerHTML = '';
            shortDesc.forEach(choice => {
                classDescription.innerHTML += (ct + ": " + choice.desc + "<br>")
                ct += 1;
            });

            BuildCharacterFromClass(character, classData);
            console.log(character);
        })
        .catch(error => {
            console.error("Could not get data from class changing: ", error);
            classDescription.innerHTML = "Error";
        });
});

//level changed
levelInput.addEventListener('change', () => {
    if (levelInput.value < 1){
        levelInput.value = 1;
        levelImage.src="../assets/levelImages/Level 1-5.png"
    }else if (levelInput.value < 6){
        levelImage.src="../assets/levelImages/Level 1-5.png"
    }else if (levelInput.value < 11){
        levelImage.src="../assets/levelImages/Level 6-10-1.png"
    }else if (levelInput.value < 16){
        levelImage.src="../assets/levelImages/Level 11-15-1.png"
    }else if (levelInput.value < 21){
        levelImage.src="../assets/levelImages/Level 16-20-1.png"
    }else{
        levelInput.value = 20;
        levelImage.src="../assets/levelImages/Level 16-20-1.png"
    }
});