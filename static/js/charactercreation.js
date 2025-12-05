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

//Feat Variables
const featDiv = document.getElementById('featDiv')
const addFeat = document.getElementById('addFeat')

//Features/Trait Variables
const featureDiv = document.getElementById('featureDiv')
const addFeature = document.getElementById('addFeature')

//Profiency and Languages Variables
const profDiv = document.getElementById('proficiencyDiv')
const addProf = document.getElementById('addProficiency')

//Item Management Variables
const addItem = document.getElementById('addItem')
const itemType = document.getElementById('itemType')
const itemDiv = document.getElementById('itemDiv')

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
    let classBlock2 = classDiv.cloneNode(true)

    Array.from(classBlock2.children).forEach(child => {
        if (child.id.split('Input')[0] == 'level'){
            child.addEventListener('input', () => {
                classImageChange(child)
            })
        }

        let x = crypto.randomUUID()
        child.id += x
    })

    let x = crypto.randomUUID()
    let classRemoveLabel = document.createElement('label')
    classRemoveLabel.htmlFor = 'removeClass'+x
    classRemoveLabel.id = 'removeClassLabel'+x

    let classRemoveButton = document.createElement('button')
    classRemoveButton.type = 'button'
    classRemoveButton.id = 'removeClass'+x
    classRemoveButton.name = 'removeClass'+x
    classRemoveButton.innerText = '➖'

    let finalBreak = document.createElement('br')
    finalBreak.id = 'finalBreak'+x

    classBlock2.appendChild(classRemoveLabel)
    classBlock2.appendChild(classRemoveButton)
    classBlock2.appendChild(finalBreak)

    classRemoveButton.addEventListener('click', () => {
        classBlock2.remove()
    })

    raceDiv.appendChild(classBlock2)
})

//class image changing fucntionality
classLevel.addEventListener('input', () => {
    classImageChange(classLevel)
})

//feat adding functionality
addFeat.addEventListener('click', () => {
    let x = crypto.randomUUID()
    let nameLabel = document.createElement('label')
    nameLabel.htmlFor= 'name' + x
    nameLabel.id = 'nameLabel' + x
    nameLabel.innerText = 'Name:'

    let name = document.createElement('input')
    name.type = 'text'
    name.id = 'name' + x
    name.name = 'featName'
    name.required = true

    let break1 = document.createElement('br')
    break1.id = 'break1' + crypto.randomUUID()

    x = crypto.randomUUID()
    let descLabel = document.createElement('label')
    descLabel.htmlFor = 'desc' + x
    descLabel.id = 'descLabel' + x
    descLabel.innerText = 'Description: '

    let desc = document.createElement('input')
    desc.type = 'text'
    desc.id = 'desc' + x
    desc.name = 'featDesc'
    desc.required = true

    let break2 = document.createElement('br')
    break2.id = 'break2' + crypto.randomUUID()

    x = crypto.randomUUID()
    let removeLabel = document.createElement('label')
    removeLabel.id = 'removeLabel' + x
    removeLabel.htmlFor = 'remove' + x
    removeLabel.innerText = 'Remove'

    let remove = document.createElement('button')
    remove.type = 'button'
    remove.id = 'remove' + x
    remove.name = 'remove' + x
    remove.innerText = '➖'

    let finalBreak = document.createElement('br')
    finalBreak.id = 'finalBreak' + crypto.randomUUID()

    let newDiv = document.createElement('div')
    newDiv.id = 'addedFeat' + crypto.randomUUID()

    remove.addEventListener('click', () => {
        newDiv.remove()
    })

    newDiv.appendChild(nameLabel)
    newDiv.appendChild(name)
    newDiv.appendChild(break1)
    newDiv.appendChild(descLabel)
    newDiv.appendChild(desc)
    newDiv.appendChild(break2)
    newDiv.appendChild(removeLabel)
    newDiv.appendChild(remove)
    newDiv.appendChild(finalBreak)

    featDiv.appendChild(newDiv)
})

//features and trait adding fucntionality
addFeature.addEventListener('click', () => {
    let newDiv = document.createElement('div')
    newDiv.id = 'addedFeature'+crypto.randomUUID()

    let x = crypto.randomUUID()
    let nameLabel = document.createElement('label')
    nameLabel.htmlFor= 'name' + x
    nameLabel.id = 'nameLabel' + x
    nameLabel.innerText = 'Name:'

    let name = document.createElement('input')
    name.type = 'text'
    name.id = 'name' + x
    name.name = 'featureName'
    name.required = true

    x = crypto.randomUUID()
    let descLabel = document.createElement('label')
    descLabel.htmlFor = 'description' + x
    descLabel.id = 'descriptionLabel' + x
    descLabel.innerText = 'Description: '

    let desc = document.createElement('input')
    desc.type = 'text'
    desc.id = 'description' + x
    desc.name = 'featureDescription'
    desc.required = true

    x = crypto.randomUUID()
    let removeLabel = document.createElement('label')
    removeLabel.id = 'removeFeatureLabel' + x
    removeLabel.htmlFor = 'removeFeature'
    removeLabel.innerText = 'Remove'

    let remove = document.createElement('button')
    remove.type = 'button'
    remove.id = 'removeFeature' + x
    remove.name = 'removeFeature' + x
    remove.innerText = '➖'

    let break1 = document.createElement('br')
    break1.id = 'break1' + crypto.randomUUID()
    let break2 = document.createElement('br')
    break2.id = 'break2' + crypto.randomUUID()
    let break3 = document.createElement('br')
    break3.id = 'break3' + crypto.randomUUID()

    newDiv.appendChild(nameLabel)
    newDiv.appendChild(name)
    newDiv.appendChild(break1)
    newDiv.appendChild(descLabel)
    newDiv.appendChild(desc)
    newDiv.appendChild(break2)
    newDiv.appendChild(removeLabel)
    newDiv.appendChild(remove)
    newDiv.appendChild(break3)
    featureDiv.appendChild(newDiv)

    remove.addEventListener('click', () => {
        newDiv.remove()
    })
})

//proficiency and language adding functionality
addProf.addEventListener('click', () => {
    let newDiv = document.createElement('div')
    newDiv.id = 'addedProf'+crypto.randomUUID()

    let x = crypto.randomUUID()
    let nameLabel = document.createElement('label')
    nameLabel.htmlFor= 'name' + x
    nameLabel.id = 'nameLabel' + x
    nameLabel.innerText = 'Name:'

    let name = document.createElement('input')
    name.type = 'text'
    name.id = 'name' + x
    name.name = 'name' + x
    name.required = true

    x = crypto.randomUUID()
    let descLabel = document.createElement('label')
    descLabel.htmlFor = 'description' + x
    descLabel.id = 'descriptionLabel' + x
    descLabel.innerText = 'Description: '

    let desc = document.createElement('input')
    desc.type = 'text'
    desc.id = 'description' + x
    desc.name = 'description' + x
    desc.required = true

    x = crypto.randomUUID()
    let removeProfLabel = document.createElement('label')
    removeProfLabel.id = 'removeProfLabel'+x
    removeProfLabel.htmlFor = 'removeProf'+x
    removeProfLabel.innerText = 'Remove'

    let removeProf = document.createElement('button')
    removeProf.id = 'removeProf' + x
    removeProf.name = 'removeProf' + x
    removeProf.type = 'button'
    removeProf.innerText = '➖'

    let break1 = document.createElement('br')
    break1.id = 'break1' + crypto.randomUUID()
    let break2 = document.createElement('br')
    break2.id = 'break2' + crypto.randomUUID()
    let break3 = document.createElement('br')
    break3.id = 'break3' + crypto.randomUUID()

    newDiv.appendChild(nameLabel)
    newDiv.appendChild(name)
    newDiv.appendChild(break1)
    newDiv.appendChild(descLabel)
    newDiv.appendChild(desc)
    newDiv.appendChild(break2)
    newDiv.appendChild(removeProfLabel)
    newDiv.appendChild(removeProf)
    newDiv.appendChild(break3)
    profDiv.appendChild(newDiv)

    removeProf.addEventListener('click', () => {
        newDiv.remove()
    })
})

//Item Adding Functionality
addItem.addEventListener('click', () => {

    //stuff that is the same for every item
    let newItemDiv = document.createElement('div')
    newItemDiv.id = 'itemDiv'+crypto.randomUUID()
    
    let x = 'itemName'+crypto.randomUUID()
    let itemNameLabel = document.createElement('label')
    itemNameLabel.htmlFor = x
    itemNameLabel.innerText = 'Name:'

    let itemName = document.createElement('input')
    itemName.type = 'text'
    itemName.id = x
    itemName.name = 'itemName'

    let break1 = document.createElement('br')
    break1.id = 'break1'+crypto.randomUUID()
    
    x = 'descriptionAndProperties'+crypto.randomUUID()
    let descriptionAndPropertiesLabel = document.createElement('label')
    descriptionAndPropertiesLabel.htmlFor = x
    descriptionAndPropertiesLabel.innerText = 'Description And/Or Properties:'

    let descriptionAndProperties = document.createElement('input')
    descriptionAndProperties.type = 'text'
    descriptionAndProperties.id = x
    descriptionAndProperties.name = 'itemDesc'

    let break2 = document.createElement('br')
    break2.id = 'break2'+crypto.randomUUID()

    x = 'removeItemButton'+crypto.randomUUID()
    let removeItemLabel = document.createElement('label')
    removeItemLabel.htmlFor = x
    removeItemLabel.innerText = 'Remove'

    let removeItemButton = document.createElement('button')
    removeItemButton.type = 'button'
    removeItemButton.id = x
    removeItemButton.name = x
    removeItemButton.innerText = '➖'

    let finalBreak = document.createElement('br')
    finalBreak.id = 'finalBreak'+crypto.randomUUID()

    newItemDiv.appendChild(itemNameLabel)
    newItemDiv.appendChild(itemName)
    newItemDiv.appendChild(break1)
    newItemDiv.appendChild(descriptionAndPropertiesLabel)
    newItemDiv.appendChild(descriptionAndProperties)
    newItemDiv.appendChild(break2)

    //stuff that changes per item
    if (itemType.value == 'Container') {

        x = crypto.randomUUID()
        let ozFilledOfWaterLabel = document.createElement('label')
        ozFilledOfWaterLabel.id = 'ozFilledOfWaterLabel'+ x
        ozFilledOfWaterLabel.htmlFor = 'ozFilledOfWater'+ x
        ozFilledOfWaterLabel.innerText = 'Oz Filled: '

        let ozFilledOfWater = document.createElement('input')
        ozFilledOfWater.type = 'number'
        ozFilledOfWater.min = 0
        ozFilledOfWater.placeholder = 0
        ozFilledOfWater.id = 'ozFilledOfWater' + x
        ozFilledOfWater.name = 'ozFilledOfWater'

        let finalBreak = document.createElement('br')
        finalBreak.id = 'finalBreak' + crypto.randomUUID()

        newItemDiv.appendChild(ozFilledOfWaterLabel)
        newItemDiv.appendChild(ozFilledOfWater)
        newItemDiv.appendChild(finalBreak)

    } else if (itemType.value == 'SiegeEquipment') {

        x = crypto.randomUUID()
        let acLabel = document.createElement('label')
        acLabel.id = 'acLabel'+x
        acLabel.htmlFor = 'ac'+x
        acLabel.innerText = 'AC:'

        let ac = document.createElement('input')
        ac.type = 'number'
        ac.id = 'ac'+x
        ac.name = 'siegeAc'
        ac.placeholder = 0

        let innerBreak1 = document.createElement('br')
        innerBreak1.id = 'innerBreak1' + crypto.randomUUID()

        x = crypto.randomUUID()
        let damageImmunitiesLabel = document.createElement('label')
        damageImmunitiesLabel.id = 'damageImmunitiesLabel' + x
        damageImmunitiesLabel.htmlFor = 'damageImmunities' + x
        damageImmunitiesLabel.innerText = 'Damage Immunities:'

        let damageImmunities = document.createElement('input')
        damageImmunities.type = 'text'
        damageImmunities.id = 'damageImmunities' + x
        damageImmunities.name = 'siegeDamageImmunities'

        let innerBreak2 = document.createElement('br')
        innerBreak2.id = 'innerBreak2' + crypto.randomUUID()

        x = crypto.randomUUID()
        let HPLabel = document.createElement('label')
        HPLabel.id = 'HPLabel' + x
        HPLabel.htmlFor = 'HP' + x
        HPLabel.innerText = 'HP:'

        let HP = document.createElement('input')
        HP.type = 'number'
        HP.id = 'HP' + x
        HP.name = 'siegeHP'
        HP.placeholder = 0

        let finalBreak = document.createElement('br')
        finalBreak.id = 'finalBreak' + crypto.randomUUID()

        newItemDiv.appendChild(acLabel)
        newItemDiv.appendChild(ac)
        newItemDiv.appendChild(innerBreak1)
        newItemDiv.appendChild(damageImmunitiesLabel)
        newItemDiv.appendChild(damageImmunities)
        newItemDiv.appendChild(innerBreak2)
        newItemDiv.appendChild(HPLabel)
        newItemDiv.appendChild(HP)
        newItemDiv.appendChild(finalBreak)

    } else if (itemType.value == 'Poison') {

        x = crypto.randomUUID()
        let typeLabel = document.createElement('label')
        typeLabel.id = 'typeLabel' + x
        typeLabel.htmlFor = 'type'+x
        typeLabel.innerText = 'Type:'

        let type = document.createElement('input')
        type.type = 'text'
        type.id = 'type' + x
        type.name = 'poisonType'

        let innerBreak1 = document.createElement('br')
        innerBreak1.id = 'innerBreak1' + crypto.randomUUID()

        x = crypto.randomUUID()
        let costLabel = document.createElement('label')
        costLabel.id = 'costLabel' + x
        costLabel.htmlFor = 'cost' + x
        costLabel.innerText = 'Cost:'

        let cost = document.createElement('input')
        cost.type = 'text'
        cost.id = 'cost' + x
        cost.name = 'poisonCost'

        let finalBreak = document.createElement('br')
        finalBreak.id = 'finalBreak' + crypto.randomUUID()

        newItemDiv.appendChild(typeLabel)
        newItemDiv.appendChild(type)
        newItemDiv.appendChild(innerBreak1)
        newItemDiv.appendChild(costLabel)
        newItemDiv.appendChild(cost)
        newItemDiv.appendChild(finalBreak)

    } else if (itemType.value == 'AdventuringGear') {

        x = crypto.randomUUID()
        let costLabel = document.createElement('label')
        costLabel.id = 'costLabel' + x
        costLabel.htmlFor = 'cost' + x
        costLabel.innerText = 'Cost:'

        let cost = document.createElement('input')
        cost.type = 'text'
        cost.id = 'cost' + x
        cost.name = 'adventuringGearCost'

        let innerBreak1 = document.createElement('br')
        innerBreak1.id = 'innerBreak1' + crypto.randomUUID()

        x = crypto.randomUUID()
        let weightLabel = document.createElement('label')
        weightLabel.id = 'weightLabel' + x
        weightLabel.htmlFor = 'weight' + x
        weightLabel.innerText = 'Weight:'

        let weight = document.createElement('input')
        weight.type = 'number'
        weight.id = 'weight' + x
        weight.name = 'adventuringGearWeight'
        weight.placeholder = 0
        weight.min = 0

        let finalBreak = document.createElement('br')
        finalBreak.id = 'finalBreak' + crypto.randomUUID()

        newItemDiv.appendChild(costLabel)
        newItemDiv.appendChild(cost)
        newItemDiv.appendChild(innerBreak1)
        newItemDiv.appendChild(weightLabel)
        newItemDiv.appendChild(weight)
        newItemDiv.appendChild(finalBreak)

    } else if (itemType.value == 'Weapon') {

        x = crypto.randomUUID()
        let weightLabel = document.createElement('label')
        weightLabel.id = 'weightLabel' + x
        weightLabel.htmlFor = 'weight' + x
        weightLabel.innerText = 'Weight:'

        let weight = document.createElement('input')
        weight.type = 'number'
        weight.id = 'weight' + x
        weight.name = 'weaponWeight'
        weight.placeholder = 0
        weight.min = 0

        let innerBreak1 = document.createElement('br')
        innerBreak1.id = 'innerBreak1' + crypto.randomUUID()

        x = crypto.randomUUID()
        let costLabel = document.createElement('label')
        costLabel.id = 'costLabel' + x
        costLabel.htmlFor = 'cost' + x
        costLabel.innerText = 'Cost:'

        let cost = document.createElement('input')
        cost.type = 'text'
        cost.id = 'cost' + x
        cost.name = 'weaponCost'

        let innerBreak2 = document.createElement('br')
        innerBreak2.id = 'innerBreak2' + crypto.randomUUID()

        x = crypto.randomUUID()
        let damageLabel = document.createElement('label')
        damageLabel.id = 'damageLabel' + x
        damageLabel.htmlFor = 'damage' + x
        damageLabel.innerText = 'Damage:'

        let damage = document.createElement('input')
        damage.type = 'text'
        damage.id = 'damage' + x
        damage.name = 'weaponDamage'

        let finalBreak = document.createElement('br')
        finalBreak.id = 'finalBreak' + crypto.randomUUID()

        newItemDiv.appendChild(weightLabel)
        newItemDiv.appendChild(weight)
        newItemDiv.appendChild(innerBreak1)
        newItemDiv.appendChild(costLabel)
        newItemDiv.appendChild(cost)
        newItemDiv.appendChild(innerBreak2)
        newItemDiv.appendChild(damageLabel)
        newItemDiv.appendChild(damage)
        newItemDiv.appendChild(finalBreak)

    } else if (itemType.value == 'Armor&Shield') {

        x = crypto.randomUUID()
        let weightLabel = document.createElement('label')
        weightLabel.id = 'weightLabel' + x
        weightLabel.htmlFor = 'weight' + x
        weightLabel.innerText = 'Weight:'

        let weight = document.createElement('input')
        weight.type = 'number'
        weight.id = 'weight' + x
        weight.name = 'armor&ShieldWeight'
        weight.placeholder = 0
        weight.min = 0

        let innerBreak1 = document.createElement('br')
        innerBreak1.id = 'innerBreak1' + crypto.randomUUID()

        x = crypto.randomUUID()
        let costLabel = document.createElement('label')
        costLabel.id = 'costLabel' + x
        costLabel.htmlFor = 'cost' + x
        costLabel.innerText = 'Cost:'

        let cost = document.createElement('input')
        cost.type = 'text'
        cost.id = 'cost' + x
        cost.name = 'armor&ShieldCost'

        let innerBreak2 = document.createElement('br')
        innerBreak2.id = 'innerBreak2' + crypto.randomUUID()

        x = crypto.randomUUID()
        let acLabel = document.createElement('label')
        acLabel.id = 'acLabel'+x
        acLabel.htmlFor = 'ac'+x
        acLabel.innerText = 'AC:'

        let ac = document.createElement('input')
        ac.type = 'number'
        ac.id = 'ac'+x
        ac.name = 'armor&ShiledAc'
        ac.required = true
        ac.placeholder = 0

        let innerBreak3 = document.createElement('br')
        innerBreak3.id = 'innerBreak3' + crypto.randomUUID()

        x = crypto.randomUUID()
        let equippedLabel = document.createElement('label')
        equippedLabel.id = 'equippedLabel' + x
        equippedLabel.htmlFor = 'equipped' + x
        equippedLabel.innerText = 'Equipped:'

        let equipped = document.createElement('input')
        equipped.type = 'checkbox'
        equipped.id = 'equipped' + x
        equipped.name = 'armor&ShieldEquipped'

        let finalBreak = document.createElement('br')
        finalBreak.id = 'finalBreak' + crypto.randomUUID()

        newItemDiv.appendChild(weightLabel)
        newItemDiv.appendChild(weight)
        newItemDiv.appendChild(innerBreak1)
        newItemDiv.appendChild(costLabel)
        newItemDiv.appendChild(cost)
        newItemDiv.appendChild(innerBreak2)
        newItemDiv.appendChild(acLabel)
        newItemDiv.appendChild(ac)
        newItemDiv.appendChild(innerBreak3)
        newItemDiv.appendChild(equippedLabel)
        newItemDiv.appendChild(equipped)
        newItemDiv.appendChild(finalBreak)

    } else if (itemType.value == 'Explosive') {

        x = crypto.randomUUID()
        let weightLabel = document.createElement('label')
        weightLabel.id = 'weightLabel' + x
        weightLabel.htmlFor = 'weight' + x
        weightLabel.innerText = 'Weight:'

        let weight = document.createElement('input')
        weight.type = 'number'
        weight.id = 'weight' + x
        weight.name = 'explosiveWeight'
        weight.placeholder = 0
        weight.min = 0

        let innerBreak1 = document.createElement('br')
        innerBreak1.id = 'innerBreak1' + crypto.randomUUID()

        x = crypto.randomUUID()
        let costLabel = document.createElement('label')
        costLabel.id = 'costLabel' + x
        costLabel.htmlFor = 'cost' + x
        costLabel.innerText = 'Cost:'

        let cost = document.createElement('input')
        cost.type = 'text'
        cost.id = 'cost' + x
        cost.name = 'explosiveCost'

        let finalBreak = document.createElement('br')
        finalBreak.id = 'finalBreak' + crypto.randomUUID()

        newItemDiv.appendChild(weightLabel)
        newItemDiv.appendChild(weight)
        newItemDiv.appendChild(innerBreak1)
        newItemDiv.appendChild(costLabel)
        newItemDiv.appendChild(cost)
        newItemDiv.appendChild(finalBreak)

    } else if (itemType.value == 'Tools') {

        x = crypto.randomUUID()
        let weightLabel = document.createElement('label')
        weightLabel.id = 'weightLabel' + x
        weightLabel.htmlFor = 'weight' + x
        weightLabel.innerText = 'Weight:'

        let weight = document.createElement('input')
        weight.type = 'number'
        weight.id = 'weight' + x
        weight.name = 'toolWeight'
        weight.placeholder = 0
        weight.min = 0

        let innerBreak1 = document.createElement('br')
        innerBreak1.id = 'innerBreak1' + crypto.randomUUID()

        x = crypto.randomUUID()
        let costLabel = document.createElement('label')
        costLabel.id = 'costLabel' + x
        costLabel.htmlFor = 'cost' + x
        costLabel.innerText = 'Cost:'

        let cost = document.createElement('input')
        cost.type = 'text'
        cost.id = 'cost' + x
        cost.name = 'toolCost'

        let finalBreak = document.createElement('br')
        finalBreak.id = 'finalBreak' + crypto.randomUUID()

        newItemDiv.appendChild(weightLabel)
        newItemDiv.appendChild(weight)
        newItemDiv.appendChild(innerBreak1)
        newItemDiv.appendChild(costLabel)
        newItemDiv.appendChild(cost)
        newItemDiv.appendChild(finalBreak)

    } else if (itemType.value == 'Trinket') {

        // nothing extra for trinkets

    } else if (itemType.value == 'Firearm') {

        x = crypto.randomUUID()
        let weightLabel = document.createElement('label')
        weightLabel.id = 'weightLabel' + x
        weightLabel.htmlFor = 'weight' + x
        weightLabel.innerText = 'Weight:'

        let weight = document.createElement('input')
        weight.type = 'number'
        weight.id = 'weight' + x
        weight.name = 'firearmWeight'
        weight.placeholder = 0
        weight.min = 0

        let innerBreak1 = document.createElement('br')
        innerBreak1.id = 'innerBreak1' + crypto.randomUUID()

        x = crypto.randomUUID()
        let costLabel = document.createElement('label')
        costLabel.id = 'costLabel' + x
        costLabel.htmlFor = 'cost' + x
        costLabel.innerText = 'Cost:'

        let cost = document.createElement('input')
        cost.type = 'text'
        cost.id = 'cost' + x
        cost.name = 'firearmCost'

        let innerBreak2 = document.createElement('br')
        innerBreak2.id = 'innerBreak2' + crypto.randomUUID()

        x = crypto.randomUUID()
        let damageLabel = document.createElement('label')
        damageLabel.id = 'damageLabel' + x
        damageLabel.htmlFor = 'damage' + x
        damageLabel.innerText = 'Damage:'

        let damage = document.createElement('input')
        damage.type = 'text'
        damage.id = 'damage' + x
        damage.name = 'firearmDamage'

        let finalBreak = document.createElement('br')
        finalBreak.id = 'finalBreak' + crypto.randomUUID()

        newItemDiv.appendChild(weightLabel)
        newItemDiv.appendChild(weight)
        newItemDiv.appendChild(innerBreak1)
        newItemDiv.appendChild(costLabel)
        newItemDiv.appendChild(cost)
        newItemDiv.appendChild(innerBreak2)
        newItemDiv.appendChild(damageLabel)
        newItemDiv.appendChild(damage)
        newItemDiv.appendChild(finalBreak)

    } else if (itemType.value == 'Other') {

        x = crypto.randomUUID()
        let weightLabel = document.createElement('label')
        weightLabel.id = 'weightLabel' + x
        weightLabel.htmlFor = 'weight' + x
        weightLabel.innerText = 'Weight:'

        let weight = document.createElement('input')
        weight.type = 'number'
        weight.id = 'weight' + x
        weight.name = 'otherWeight'
        weight.placeholder = 0
        weight.min = 0

        let innerBreak1 = document.createElement('br')
        innerBreak1.id = 'innerBreak1' + crypto.randomUUID()

        x = crypto.randomUUID()
        let costLabel = document.createElement('label')
        costLabel.id = 'costLabel' + x
        costLabel.htmlFor = 'cost' + x
        costLabel.innerText = 'Cost:'

        let cost = document.createElement('input')
        cost.type = 'text'
        cost.id = 'cost' + x
        cost.name = 'otherCost'

        let finalBreak = document.createElement('br')
        finalBreak.id = 'finalBreak' + crypto.randomUUID()

        newItemDiv.appendChild(weightLabel)
        newItemDiv.appendChild(weight)
        newItemDiv.appendChild(innerBreak1)
        newItemDiv.appendChild(costLabel)
        newItemDiv.appendChild(cost)
        newItemDiv.appendChild(finalBreak)

    } else if (itemType.value == 'Wondrous') {

        // nothing extra for wondrous items

    } else if (itemType.value == 'Ration') {

        x = crypto.randomUUID()
        let countLabel = document.createElement('label')
        countLabel.id = 'countLabel' + x
        countLabel.htmlFor = 'count' + x
        countLabel.innerText = 'Count:'

        let count = document.createElement('input')
        count.type = 'number'
        count.id = 'count' + x
        count.name = 'rationCount'
        count.min = 0
        count.placeholder = 0

        let finalBreak = document.createElement('br')
        finalBreak.id = 'finalBreak' + crypto.randomUUID()

        newItemDiv.appendChild(countLabel)
        newItemDiv.appendChild(count)
        newItemDiv.appendChild(finalBreak)

    } else if (itemType.value == 'Spells') {

        x = crypto.randomUUID()
        let durationLabel = document.createElement('label')
        durationLabel.id = 'durationLabel' + x
        durationLabel.htmlFor = 'duration' + x
        durationLabel.innerText = 'Duration:'

        let duration = document.createElement('input')
        duration.type = 'text'
        duration.id = 'duration' + x
        duration.name = 'spellDuration'

        let innerBreak1 = document.createElement('br')
        innerBreak1.id = 'innerBreak1' + crypto.randomUUID()

        x = crypto.randomUUID()
        let componentLabel = document.createElement('label')
        componentLabel.id = 'componentLabel' + x
        componentLabel.htmlFor = 'component' + x
        componentLabel.innerText = 'Components:'

        let component = document.createElement('input')
        component.type = 'text'
        component.id = 'component' + x
        component.name = 'spellComponent'

        let innerBreak2 = document.createElement('br')
        innerBreak2.id = 'innerBreak2' + crypto.randomUUID()

        x = crypto.randomUUID()
        let spellLevelLabel = document.createElement('label')
        spellLevelLabel.id = 'spellLevelLabel' + x
        spellLevelLabel.htmlFor = 'spellLevel' + x
        spellLevelLabel.innerText = 'Spell Level:'

        let spellLevel = document.createElement('input')
        spellLevel.type = 'number'
        spellLevel.id = 'spellLevel' + x
        spellLevel.name = 'spellLevel'
        spellLevel.min = 0
        spellLevel.placeholder = 0

        let innerBreak3 = document.createElement('br')
        innerBreak3.id = 'innerBreak3' + crypto.randomUUID()

        x = crypto.randomUUID()
        let rangeLabel = document.createElement('label')
        rangeLabel.id = 'rangeLabel' + x
        rangeLabel.htmlFor = 'range' + x
        rangeLabel.innerText = 'Range:'

        let range = document.createElement('input')
        range.type = 'text'
        range.id = 'range' + x
        range.name = 'spellRange'

        let innerBreak4 = document.createElement('br')
        innerBreak4.id = 'innerBreak4' + crypto.randomUUID()

        x = crypto.randomUUID()
        let castingTimeLabel = document.createElement('label')
        castingTimeLabel.id = 'castingTimeLabel' + crypto.randomUUID()
        castingTimeLabel.htmlFor = 'castingTime' + crypto.randomUUID()
        castingTimeLabel.innerText = 'Casting Time:'

        let castingTime = document.createElement('input')
        castingTime.type = 'text'
        castingTime.id = 'castingTime' + x
        castingTime.name = 'spellCastingTime'

        let finalBreak = document.createElement('br')
        finalBreak.id = 'finalBreak' + crypto.randomUUID()

        newItemDiv.appendChild(durationLabel)
        newItemDiv.appendChild(duration)
        newItemDiv.appendChild(innerBreak1)
        newItemDiv.appendChild(componentLabel)
        newItemDiv.appendChild(component)
        newItemDiv.appendChild(innerBreak2)
        newItemDiv.appendChild(spellLevelLabel)
        newItemDiv.appendChild(spellLevel)
        newItemDiv.appendChild(innerBreak3)
        newItemDiv.appendChild(rangeLabel)
        newItemDiv.appendChild(range)
        newItemDiv.appendChild(innerBreak4)
        newItemDiv.appendChild(castingTimeLabel)
        newItemDiv.appendChild(castingTime)
        newItemDiv.appendChild(finalBreak)
    }

    newItemDiv.appendChild(removeItemLabel)
    newItemDiv.appendChild(removeItemButton)
    itemDiv.appendChild(newItemDiv)

    removeItemButton.addEventListener('click', () => {
        newItemDiv.remove()
    })
})