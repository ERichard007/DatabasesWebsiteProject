const raceSelection = document.getElementById('raceSelection')
const raceDescription = document.getElementById('raceDescription')
const raceImage = document.getElementById('raceImage')

const classSelection = document.getElementById('classSelection')
const classDescription = document.getElementById('classDescription')

//Fetching stuff
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


//Event Listeners
raceSelection.addEventListener('change', () => {
    const selectedRace = raceSelection.value;
    const fetchURL = `https://www.dnd5eapi.co/api/2014/races/${selectedRace}`

    fetch(fetchURL)
        .then(Response => Response.json())
        .then(data => {
            console.log(data);

            const raceData = data;
            const alignment = raceData.alignment;
            const age = raceData.age;
            const sizeDesc = raceData.size_description;

            raceDescription.innerHTML = `${alignment} ${age} ${sizeDesc}`

            console.log(raceData.index)
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
        })
        .catch(error => {
            console.error("Could not get data from race changing: ", error);
            raceDescription.innerHTML = "Error";
        });
});

classSelection.addEventListener('change', () =>{
    const selectedClass = classSelection.value;
    const fetchURL = `https://www.dnd5eapi.co/api/2014/classes/${selectedClass}`

    fetch(fetchURL)
        .then(Response => Response.json())
        .then(data => {
            console.log(data);

            const classData = data;
            const shortDesc = classData.proficiency_choices;


            ct = 1;
            classDescription.innerHTML = '';
            shortDesc.forEach(choice => {
                classDescription.innerHTML += (ct + ": " + choice.desc + "<br>")
                ct += 1;
            });

        })
        .catch(error => {
            console.error("Could not get data from class changing: ", error);
            classDescription.innerHTML = "Error";
        });
});