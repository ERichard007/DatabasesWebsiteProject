// --------------------------------------- VARIABLES ---------------------------------------- //

const SKILL_TO_ABILITY = {
    'Acrobatics': 'Dex',
    'Animal Handling': 'Wis',
    'Arcana': 'Int',
    'Athletics': 'Str',
    'Deception': 'Cha',
    'History': 'Int',
    'Insight': 'Wis',
    'Intimidation': 'Cha',
    'Investigation': 'Int',
    'Medicine': 'Wis',
    'Nature': 'Int',
    'Perception': 'Wis',
    'Performance': 'Cha',
    'Persuasion': 'Cha',
    'Religion': 'Int',
    'Sleight of Hand': 'Dex',
    'Stealth': 'Dex',
    'Survival': 'Wis'
};



// --------------------------------------- FUNCTIONS ---------------------------------------- //

function addClassRemoveButton(li) {
    const classList = document.getElementById('classList');

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = 'Remove Class';
    btn.classList.add('remove-class-button');

    btn.addEventListener('click', () => {
        const currentClasses = classList.querySelectorAll('.spellcasting-class');
        if (currentClasses.length <= 1) {
            return;
        }
        li.remove();
    });

    li.appendChild(btn);
}

function addFeatRemoveButton(li) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = 'Remove';
    btn.classList.add('remove-feat-button');
    btn.addEventListener('click', () => li.remove());
    li.appendChild(btn);
}

function addFeatureRemoveButton(li) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = 'Remove';
    btn.classList.add('remove-feature-button');
    btn.addEventListener('click', () => li.remove());
    li.appendChild(btn);
}

function addEffectRemoveButton(li) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = 'Remove';
    btn.classList.add('remove-effect-button');
    btn.addEventListener('click', () => li.remove());
    li.appendChild(btn);
}

function recalcSkills() {
    const abilityMods = {};
    document.querySelectorAll('.ability-row').forEach(row => {
        const abilityName = (row.dataset.abilityName || '').toLowerCase();
        const input = row.querySelector('.ability-score');
        if (!input) return;
        const mod = abilityScoreToMod(input.value);
        if (abilityName.startsWith('str')) abilityMods['Str'] = mod;
        else if (abilityName.startsWith('dex')) abilityMods['Dex'] = mod;
        else if (abilityName.startsWith('con')) abilityMods['Con'] = mod;
        else if (abilityName.startsWith('int')) abilityMods['Int'] = mod;
        else if (abilityName.startsWith('wis')) abilityMods['Wis'] = mod;
        else if (abilityName.startsWith('cha')) abilityMods['Cha'] = mod;
    });

  
    let profBonus = 2;
    const firstProfInput = document.querySelector('.class-prof-bonus');
    if (firstProfInput) {
        const v = parseInt(firstProfInput.value, 10);
        if (!isNaN(v)) profBonus = v;
    }

    document.querySelectorAll('.skill-score').forEach(input => {
        const skillName = input.dataset.name;
        if (!skillName) return;

        const abilityCode = SKILL_TO_ABILITY[skillName];
        if (!abilityCode) return;

        const baseMod = abilityMods[abilityCode] || 0;

        const selectorName =
            (typeof CSS !== 'undefined' && CSS.escape)
                ? CSS.escape(skillName)
                : skillName;
        const profCheckbox = document.querySelector(
            `.skill-prof[data-name="${selectorName}"]`
        );
        const proficient = profCheckbox && profCheckbox.checked;

        const total = baseMod + (proficient ? profBonus : 0);
        input.value = total;
    });
}

function sumInputs(selector) {
    let total = 0;
    document.querySelectorAll(selector).forEach(input => {
        total += parseInt(input.value);
    });
    return total;
}

function abilityScoreToMod(score) {
    const n = parseInt(score, 10);
    return Math.floor((n - 10) / 2);
}

function recalcWaterTotal() {
    const total = sumInputs('.water-amount');
    const span = document.getElementById('totalWaterValue');
    span.textContent = total;
}

function recalcRationTotal() {
    const total = sumInputs('.ration-amount');
    const span = document.getElementById('totalRationsValue');
    span.textContent = total;
}

function recalcAbilityModifiers() {
    const rows = document.querySelectorAll('.ability-row');

    rows.forEach(row => {
        const input = row.querySelector('.ability-score');
        const modSpan = row.querySelector('.ability-mod');

        const mod = abilityScoreToMod(input.value);
        modSpan.textContent = (mod >= 0 ? '+' : '') + mod;
    });

    const initiativeInput = document.getElementById('initiativeInput');

    let dexMod = 0;
    rows.forEach(row => {
        const name = row.dataset.abilityName.toLowerCase();
        if (name.startsWith('dex')) {
            const modSpan = row.querySelector('.ability-mod');
            if (modSpan) {
                const text = modSpan.textContent.trim();
                dexMod = parseInt(text, 10) || 0;
            }
        }
    });
    initiativeInput.value = dexMod;
}

function recalcSpellcasting() {
    document.querySelectorAll('.spellcasting-class').forEach(li => {
        const profInput = li.querySelector('.class-prof-bonus');
        const modInput = li.querySelector('.spellcasting-mod');
        const dcInput = li.querySelector('.spellsave-dc');
        const attackInput = li.querySelector('.spell-attack-bonus');

        if (!profInput || !modInput || !dcInput || !attackInput) return;

        const prof = parseInt(profInput.value, 10) || 0;
        const mod = parseInt(modInput.value, 10) || 0;

        dcInput.value = 8 + prof + mod;
        attackInput.value = prof + mod;
    });
}

function recalcMaxhp() {
    let totalMaxHp = sumInputs('.class-maxhp');

    const maxHpInput = document.getElementById('totalMaxHpInput');
    maxHpInput.textContent = totalMaxHp;

    return totalMaxHp;
}

function renderExtraFields() {
    const extraFieldsDiv = document.getElementById('newItemExtraFields');
    const itemTypeSelect = document.getElementById('newItemType');

    if (!itemTypeSelect || !extraFieldsDiv) return;
    const t = itemTypeSelect.value;
    extraFieldsDiv.innerHTML = '';

    const makeInputRow = (labelText, id, type = 'text') => {
        const p = document.createElement('p');
        const label = document.createElement('label');
        label.textContent = labelText + ' ';
        const input = document.createElement('input');
        input.type = type;
        input.id = id;
        label.appendChild(input);
        p.appendChild(label);
        extraFieldsDiv.appendChild(p);
    };

    if (t === 'Container') {
        makeInputRow('Ounces filled:', 'newItemOzfilled', 'number');
    } else if (t === 'SiegeEquipment') {
        makeInputRow('AC:', 'newItemAC', 'number');
        makeInputRow('Hit Points:', 'newItemHP', 'number');
        makeInputRow('Damage Immunities:', 'newItemDamageImm');
    } else if (t === 'Poison') {
        makeInputRow('Type:', 'newItemPoisonType');
        makeInputRow('Cost:', 'newItemCost');
    } else if (t === 'AdventuringGear') {
        makeInputRow('Cost:', 'newItemCost');
        makeInputRow('Weight:', 'newItemWeight', 'number');
    } else if (t === 'Weapon') {
        makeInputRow('Cost:', 'newItemCost');
        makeInputRow('Weight:', 'newItemWeight', 'number');
        makeInputRow('Damage:', 'newItemDamage');
    } else if (t === 'Armor&Shield') {
        makeInputRow('Cost:', 'newItemCost');
        makeInputRow('Weight:', 'newItemWeight', 'number');
        makeInputRow('AC:', 'newItemAC', 'number');
    
    } else if (t === 'Explosive') {
        makeInputRow('Cost:', 'newItemCost');
        makeInputRow('Weight:', 'newItemWeight', 'number');
    } else if (t === 'Tools') {
        makeInputRow('Cost:', 'newItemCost');
        makeInputRow('Weight:', 'newItemWeight', 'number');
    } else if (t === 'Trinket') {
        
    } else if (t === 'Firearm') {
        makeInputRow('Cost:', 'newItemCost');
        makeInputRow('Damage:', 'newItemDamage');
        makeInputRow('Weight:', 'newItemWeight', 'number');
    } else if (t === 'Other') {
        makeInputRow('Cost:', 'newItemCost');
        makeInputRow('Weight:', 'newItemWeight', 'number');
    } else if (t === 'Wondrous') {
        
    } else if (t === 'Ration') {
        makeInputRow('Days / Quantity:', 'newItemDays', 'number');
    } else if (t === 'Spells') {
        makeInputRow('Duration:', 'newItemDuration');
        makeInputRow('Components:', 'newItemComponents');
        makeInputRow('Level:', 'newItemLevel', 'number');
        makeInputRow('Range:', 'newItemRange');
        makeInputRow('Casting Time:', 'newItemCastingTime');
    }
}


// --------------------------------------- EVENT LISTENERS ---------------------------------------- //
document.addEventListener('DOMContentLoaded', () => {
    //Item Removal
    const deletedItemIds = new Set();

    function addItemRemoveButton(li) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = 'Remove Item';
        btn.classList.add('remove-item-button');

        btn.addEventListener('click', () => {
            const id = parseInt(li.dataset.itemid, 10);
            if (!isNaN(id)) {
                deletedItemIds.add(id);
            }
            li.remove();
        });

        li.appendChild(btn);
    }

    document.querySelectorAll('.inv-item').forEach(li => {
        addItemRemoveButton(li);
    });


    // Water
    document.querySelectorAll('.water-amount').forEach(input => {
        input.addEventListener('input', recalcWaterTotal);
        input.addEventListener('change', recalcWaterTotal);
    });

    // Rations
    document.querySelectorAll('.ration-amount').forEach(input => {
        input.addEventListener('input', recalcRationTotal);
        input.addEventListener('change', recalcRationTotal);
    });

    // Skill proficiency changes
    document.querySelectorAll('.skill-prof').forEach(cb => {
        cb.addEventListener('change', recalcSkills);
    });

    // Abilities & Initiative
    document.querySelectorAll('.ability-score').forEach(input => {
        input.addEventListener('input', () => {
            recalcAbilityModifiers();
            recalcSpellcasting();
            recalcSkills();
        });
        input.addEventListener('change', () => {
            recalcAbilityModifiers();
            recalcSpellcasting();
            recalcSkills();
        });
    });

    // Spellcasting
    document.querySelectorAll('.class-prof-bonus, .spellcasting-mod').forEach(input => {
        input.addEventListener('input', () => {
            recalcSpellcasting();
            recalcSkills();
        });
        input.addEventListener('change', () => {
            recalcSpellcasting();
            recalcSkills();
        });
    });

    // Max HP
    document.querySelectorAll('.class-maxhp').forEach(input => {
        input.addEventListener('input', recalcMaxhp);
        input.addEventListener('change', recalcMaxhp);
    });

    // Drink water button 
    const drinkAmountInput = document.getElementById('drinkWaterAmount');
    const drinkButton = document.getElementById('drinkWaterButton');

    drinkButton.addEventListener('click', () => {
        let remaining = parseInt(drinkAmountInput.value);
        if (remaining <= 0) return;

        const containers = document.querySelectorAll('.water-amount');
        containers.forEach(input => {
            if (remaining <= 0) return;

            const current = parseInt(input.value);
            if (current <= 0) return;

            const consumed = Math.min(current, remaining);
            input.value = current - consumed;
            remaining -= consumed;
        });

        recalcWaterTotal();
    });
    

    // Eat food button
    const eatAmountInput = document.getElementById('eatRationAmount');
    const eatButton = document.getElementById('eatRationButton');

    eatButton.addEventListener('click', () => {
        let remaining = parseInt(eatAmountInput.value);
        if (remaining <= 0) return;

        const rationInputs = document.querySelectorAll('.ration-amount');
        rationInputs.forEach(input => {
            if (remaining <= 0) return;

            const current = parseFloat(input.value);
            if (current <= 0) return;

            const consumed = Math.min(current, remaining);
            input.value = current - consumed;
            remaining -= consumed;
        });

        recalcRationTotal();
    });
    

    // Add Class 
    const classList = document.getElementById('classList');
    const addClassButton = document.getElementById('addClassButton');

    addClassButton.addEventListener('click', () => {
        const li = document.createElement('li');
        li.classList.add('spellcasting-class');
        li.innerHTML =`
        <strong><input type="text" class="class-name" value="0"></strong>
        (Level: <input type="number" class="class-level" value="0" min="0" max="20">)<br>

        Max HP: <input type="number" class="class-maxhp" value="0" min="0"><br>
        Hit Dice: <input type="number" class="class-currenthd" value="0" min="0"> /
        <input type="number" class="class-totalhd" value="0" min="0">d
        <select class="class-die-size">
            <option value="6" selected>6</option>
            <option value="8">8</option>
            <option value="10">10</option>
            <option value="12">12</option>    
        </select><br>

        Proficiency Bonus:
        +<input type="number" class="class-prof-bonus" value="0" min="0"><br>

        Spellcasting Modifier:
        <input type="number" class="spellcasting-mod" value="0"><br>

        Spellcasting Ability:
        <select class="class-spell-ability">
            <option value="Str">Str</option>
            <option value="Dex">Dex</option>
            <option value="Con">Con</option>
            <option value="Int" selected>Int</option>
            <option value="Wis">Wis</option>
            <option value="Cha">Cha</option>
        </select><br>

        Is Spellcasting Class?
        <input type="checkbox" class="class-is-spellcasting"><br>

        Spellsave DC:
        <input type="number" class="spellsave-dc" readonly><br>
        Spell Attack Bonus:
        <input type="number" class="spell-attack-bonus" readonly><br>
        `;
        classList.appendChild(li);

        li.querySelectorAll('.class-prof-bonus, .spellcasting-mod, .class-maxhp').forEach(input => {
            input.addEventListener('input', () => {
                recalcSpellcasting();
                recalcSkills();
                recalcMaxhp();
            });
            input.addEventListener('change', () => {
                recalcSpellcasting();
                recalcSkills();
                recalcMaxhp();
            });
        });

        addClassRemoveButton(li)
        recalcSpellcasting();
        recalcSkills();
        recalcMaxhp();
    });
    

    // Add Feat 
    const featList = document.getElementById('featList');
    const addFeatButton = document.getElementById('addFeatButton');

    addFeatButton.addEventListener('click', () => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong><input type="text" class="feat-name" value=""></strong>: 
            <input type="text" class="feat-desc" value="">
        `;
        featList.appendChild(li);
        addFeatRemoveButton(li);
    });
    

    // Add Feature 
    const featureList = document.getElementById('featureList');
    const addFeatureButton = document.getElementById('addFeatureButton');

    addFeatureButton.addEventListener('click', () => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong><input type="text" class="feature-name" value=""></strong>:
            <input type="text" class="feature-desc" value="">
        `;
        featureList.appendChild(li);
        addFeatureRemoveButton(li);
    });
    

    // Add Effect 
    const effectList = document.getElementById('effectList');
    const addEffectButton = document.getElementById('addEffectButton');

    addEffectButton.addEventListener('click', () => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong><input type="text" class="effect-name" value=""></strong>:
            <input type="text" class="effect-desc" value=""><br>
            Duration: (<input type="text" class="effect-duration" value="">)
        `;
        effectList.appendChild(li);
        addEffectRemoveButton(li);
    });

    // Add Item panel 
    const itemTypeSelect = document.getElementById('newItemType');
    const addItemButton = document.getElementById('addItemButton');
    const addItemStatus = document.getElementById('addItemStatus');
    const characterId = document.body.dataset.characterId;

    if (itemTypeSelect) {
        itemTypeSelect.addEventListener('change', renderExtraFields);
        renderExtraFields();
    }

    addItemButton.addEventListener('click', () => {
        const type = itemTypeSelect.value;
        const name = document.getElementById('newItemName').value.trim();
        const description = document.getElementById('newItemDescription').value.trim();

        if (!name) {
            addItemStatus.textContent = 'Name required';
            return;
        }

        const extra = {};
        const getVal = id => {
            const el = document.getElementById(id);
            return el ? el.value : '';
        };

        if (type === 'Container') {
            extra.ozfilled = parseInt(getVal('newItemOzfilled') || 0, 10);
        } else if (type === 'SiegeEquipment') {
            extra.ac = parseInt(getVal('newItemAC') || 0, 10);
            extra.hitpoints = parseInt(getVal('newItemHP') || 0, 10);
            extra.damageimmunities = getVal('newItemDamageImm');
        } else if (type === 'Poison') {
            extra.type = getVal('newItemPoisonType');
            extra.cost = getVal('newItemCost');
        } else if (type === 'AdventuringGear') {
            extra.cost = getVal('newItemCost');
            extra.weight = parseFloat(getVal('newItemWeight') || 0);
        } else if (type === 'Weapon') {
            extra.cost = getVal('newItemCost');
            extra.weight = parseFloat(getVal('newItemWeight') || 0);
            extra.damage = getVal('newItemDamage');
        } else if (type === 'Armor&Shield') {
            extra.cost = getVal('newItemCost');
            extra.weight = parseFloat(getVal('newItemWeight') || 0);
            extra.ac = parseInt(getVal('newItemAC') || 0, 10);
            extra.equipped = 0;
        } else if (type === 'Explosive') {
            extra.cost = getVal('newItemCost');
            extra.weight = parseFloat(getVal('newItemWeight') || 0);
        } else if (type === 'Tools') {
            extra.cost = getVal('newItemCost');
            extra.weight = parseFloat(getVal('newItemWeight') || 0);
        } else if (type === 'Trinket') {
        } else if (type === 'Firearm') {
            extra.cost = getVal('newItemCost');
            extra.damage = getVal('newItemDamage');
            extra.weight = parseFloat(getVal('newItemWeight') || 0);
        } else if (type === 'Other') {
            extra.cost = getVal('newItemCost');
            extra.weight = parseFloat(getVal('newItemWeight') || 0);
        } else if (type === 'Wondrous') {
        } else if (type === 'Ration') {
            extra.days = parseInt(getVal('newItemDays') || 0, 10);
        } else if (type === 'Spells') {
            extra.duration = getVal('newItemDuration');
            extra.components = getVal('newItemComponents');
            extra.level = parseInt(getVal('newItemLevel') || 0, 10);
            extra.range = getVal('newItemRange');
            extra.castingtime = getVal('newItemCastingTime');
        }

        addItemStatus.textContent = 'Adding...';

        fetch(`/character/${characterId}/items`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type, name, description, extra })
        })
        .then(resp => {
            if (!resp.ok) throw new Error('Add failed');
            return resp.json();
        })
        .then(() => {
            addItemStatus.textContent = 'Added! Reloading...';
            window.location.reload();
        })
        .catch(err => {
            console.error(err);
            addItemStatus.textContent = 'Error adding item';
        });
    });
    
    
    
    // Save Character
    const saveBtn = document.getElementById('saveCharacterButton');
    const statusSpan = document.getElementById('saveCharacterStatus');

    saveBtn.addEventListener('click', () => {
        const payload = {};

        // ---- Stats ----
        const stats = {};
        stats.inspiration = parseInt(document.getElementById('statsInspiration').value || 0, 10);
        stats.currentHP = parseInt(document.getElementById('statsCurrentHP').value || 0, 10);
        stats.tempHP = parseInt(document.getElementById('statsTempHP').value || 0, 10);
        stats.exp = parseInt(document.getElementById('statsExp').value || 0, 10);
        stats.ac = parseInt(document.getElementById('statsAC').value || 0, 10);

        const successes = Array.from(document.querySelectorAll('.death-success'))
            .filter(cb => cb.checked).length;
        const failures  = Array.from(document.querySelectorAll('.death-failure'))
            .filter(cb => cb.checked).length;
        stats.deathSuccesses = successes;
        stats.deathFailures  = failures;

        stats.spellSlotsTotal = {};
        stats.spellSlotsUsed  = {};
        document.querySelectorAll('.slot-total').forEach(input => {
            const lvl = input.dataset.level;
            stats.spellSlotsTotal[lvl] = parseInt(input.value || 0, 10);
        });
        document.querySelectorAll('.slot-used').forEach(input => {
            const lvl = input.dataset.level;
            stats.spellSlotsUsed[lvl] = parseInt(input.value || 0, 10);
        });
        payload.stats = stats;

        // ---- Abilities ----
        payload.abilities = Array.from(document.querySelectorAll('.ability-row')).map(row => {
            const name = row.dataset.abilityName;
            const scoreInput = row.querySelector('.ability-score');
            return {
                name,
                score: parseInt(scoreInput.value || 0, 10)
            };
        });

        // ---- Saving Throws ----
        payload.savingThrows = Array.from(document.querySelectorAll('.saving-score')).map(input => {
            const name = input.dataset.name;
            const score = parseInt(input.value || 0, 10);
            const prof = document.querySelector(
                `.saving-prof[data-name="${CSS.escape(name)}"]`
            )?.checked ? 1 : 0;
            return { name, score, proficient: prof };
        });

        // ---- Skills ----
        payload.skills = Array.from(document.querySelectorAll('.skill-score')).map(input => {
            const name = input.dataset.name;
            const score = parseInt(input.value || 0, 10);
            const prof = document.querySelector(
                `.skill-prof[data-name="${CSS.escape(name)}"]`
            )?.checked ? 1 : 0;
            return { name, score, proficient: prof };
        });

        // ---- Classes ----
        payload.classes = Array.from(document.querySelectorAll('.spellcasting-class')).map(li => {
            const originalName = li.dataset.originalName || null;
            const name  = li.querySelector('.class-name')?.value || '';
            const level = parseInt(li.querySelector('.class-level')?.value || 0, 10);
            const maxhp = parseInt(li.querySelector('.class-maxhp')?.value || 0, 10);
            const currenthd = parseInt(li.querySelector('.class-currenthd')?.value || 0, 10);
            const totalhd   = parseInt(li.querySelector('.class-totalhd')?.value || 0, 10);
            const dieSize   = parseInt(li.querySelector('.class-die-size')?.value || 6, 10);
            const profBonus = parseInt(li.querySelector('.class-prof-bonus')?.value || 0, 10);
            const spellMod  = parseInt(li.querySelector('.spellcasting-mod')?.value || 0, 10);
            const spellAbility = li.querySelector('.class-spell-ability')?.value || 'Int';
            const spellFlagInput = li.querySelector('.class-is-spellcasting');
            const isSpellCastingClass = spellFlagInput && spellFlagInput.checked ? 1 : 0

            return {
                originalName,
                name,
                classlevel: level,
                maxhitpoints: maxhp,
                currenthitdice: currenthd,
                totalhitdice: totalhd,
                typeofhitdice: dieSize,
                proficiencybonus: profBonus,
                spellcastingmodifier: spellMod,
                spellcastingability: spellAbility,
                isSpellCastingClass
            };
        });

        // ---- Feats ----
        payload.feats = Array.from(document.querySelectorAll('#featList li')).map(li => {
            const originalName = li.dataset.originalName || null;
            const name = li.querySelector('.feat-name')?.value || '';
            const description = li.querySelector('.feat-desc')?.value || '';
            return { originalName, name, description };
        });

        // ---- Features ----
        payload.features = Array.from(document.querySelectorAll('#featureList li')).map(li => {
            const originalName = li.dataset.originalName || null;
            const name = li.querySelector('.feature-name')?.value || '';
            const description = li.querySelector('.feature-desc')?.value || '';
            return { originalName, name, description };
        });

        // ---- Effects ----
        payload.effects = Array.from(document.querySelectorAll('#effectList li')).map(li => {
            const originalName = li.dataset.originalName || null;
            const name = li.querySelector('.effect-name')?.value || '';
            const description = li.querySelector('.effect-desc')?.value || '';
            const duration = li.querySelector('.effect-duration')?.value || '';
            return { originalName, name, description, duration };
        });

        // ---- Item meta ----
        payload.itemMeta = Array.from(document.querySelectorAll('.inv-item')).map(el => {
            const id = parseInt(el.dataset.itemid, 10);
            const nameInput = el.querySelector('.inv-item-name');
            const descInput = el.querySelector('.inv-item-desc');
            if (!id || !nameInput || !descInput) return null;

            return {
                itemid: id,
                name: nameInput.value || '',
                description: descInput.value || ''
            };
        }).filter(Boolean);

        // ---- Inventory: water + rations ----
        payload.water = Array.from(document.querySelectorAll('.water-amount')).map(input => ({
            itemid: parseInt(input.dataset.itemid, 10),
            ozfilled: parseInt(input.value || 0, 10)
        }));

        payload.rations = Array.from(document.querySelectorAll('.ration-amount')).map(input => ({
            itemid: parseInt(input.dataset.itemid, 10),
            days: parseInt(input.value || 0, 10)
        }));

        // ---- Siege Equipment ----
        payload.siegeEquipment = Array.from(document.querySelectorAll('.inv-siege')).map(li => ({
            itemid: parseInt(li.dataset.itemid, 10),
            ac: parseInt(li.querySelector('.inv-siege-ac').value || 0, 10),
            hitpoints: parseInt(li.querySelector('.inv-siege-hp').value || 0, 10),
            damageimmunities: li.querySelector('.inv-siege-imm').value || ''
        }));

        // ---- Poisons ----
        payload.poisons = Array.from(document.querySelectorAll('.inv-poison')).map(li => ({
            itemid: parseInt(li.dataset.itemid, 10),
            type: li.querySelector('.inv-poison-type').value || '',
            cost: li.querySelector('.inv-poison-cost').value || ''
        }));

        // ---- Adventuring Gear ----
        payload.adventuringGear = Array.from(document.querySelectorAll('.inv-gear')).map(li => ({
            itemid: parseInt(li.dataset.itemid, 10),
            cost: li.querySelector('.inv-gear-cost').value || '',
            weight: parseFloat(li.querySelector('.inv-gear-weight').value || 0)
        }));

        // ---- Weapons ----
        payload.weapons = Array.from(document.querySelectorAll('.inv-weapon')).map(li => ({
            itemid: parseInt(li.dataset.itemid, 10),
            weight: parseFloat(li.querySelector('.inv-weapon-weight').value || 0),
            cost: li.querySelector('.inv-weapon-cost').value || '',
            damage: li.querySelector('.inv-weapon-damage').value || ''
        }));

        // ---- Armor & Shields ----
        payload.armorShields = Array.from(document.querySelectorAll('.inv-armor')).map(li => ({
            itemid: parseInt(li.dataset.itemid, 10),
            equipped: li.querySelector('.inv-armor-equipped').checked ? 1 : 0,
            weight: parseFloat(li.querySelector('.inv-armor-weight').value || 0),
            cost: li.querySelector('.inv-armor-cost').value || '',
            ac: parseInt(li.querySelector('.inv-armor-ac').value || 0, 10)
        }));

        // ---- Explosives ----
        payload.explosives = Array.from(document.querySelectorAll('.inv-explosive')).map(li => ({
            itemid: parseInt(li.dataset.itemid, 10),
            cost: li.querySelector('.inv-explosive-cost').value || '',
            weight: parseFloat(li.querySelector('.inv-explosive-weight').value || 0)
        }));

        // ---- Tools ----
        payload.tools = Array.from(document.querySelectorAll('.inv-tool')).map(li => ({
            itemid: parseInt(li.dataset.itemid, 10),
            cost: li.querySelector('.inv-tool-cost').value || '',
            weight: parseFloat(li.querySelector('.inv-tool-weight').value || 0)
        }));

        // ---- Firearms ----
        payload.firearms = Array.from(document.querySelectorAll('.inv-firearm')).map(li => ({
            itemid: parseInt(li.dataset.itemid, 10),
            cost: li.querySelector('.inv-firearm-cost').value || '',
            damage: li.querySelector('.inv-firearm-damage').value || '',
            weight: parseFloat(li.querySelector('.inv-firearm-weight').value || 0)
        }));

        // ---- Other Items ----
        payload.others = Array.from(document.querySelectorAll('.inv-other')).map(li => ({
            itemid: parseInt(li.dataset.itemid, 10),
            cost: li.querySelector('.inv-other-cost').value || '',
            weight: parseFloat(li.querySelector('.inv-other-weight').value || 0)
        }));

        // ---- Spells ----
        payload.spells = Array.from(document.querySelectorAll('.inv-spell')).map(div => ({
            itemid: parseInt(div.dataset.itemid, 10),
            duration: div.querySelector('.inv-spell-duration')?.value || '',
            components: div.querySelector('.inv-spell-components')?.value || '',
            range: div.querySelector('.inv-spell-range')?.value || '',
            castingtime: div.querySelector('.inv-spell-casting')?.value || '',
            ready: div.querySelector('.inv-spell-ready')?.checked ? 1 : 0
        }));


        // ---- Currency ----
        payload.currency = {
            copper:   parseInt(document.getElementById('currencyCopper').value   || 0, 10),
            silver:   parseInt(document.getElementById('currencySilver').value   || 0, 10),
            electrum: parseInt(document.getElementById('currencyElectrum').value || 0, 10),
            gold:     parseInt(document.getElementById('currencyGold').value     || 0, 10),
            platinum: parseInt(document.getElementById('currencyPlatinum').value || 0, 10)
        };

        // ---- Lore ----
        payload.lore = {
            skin:        document.getElementById('loreSkin').value,
            eyes:        document.getElementById('loreEyes').value,
            ideals:      document.getElementById('loreIdeals').value,
            bonds:       document.getElementById('loreBonds').value,
            flaws:       document.getElementById('loreFlaws').value,
            age:         document.getElementById('loreAge').value,
            traits:      document.getElementById('loreTraits').value,
            weight:      document.getElementById('loreWeight').value,
            height:      document.getElementById('loreHeight').value,
            allies:      document.getElementById('loreAllies').value,
            appearance:  document.getElementById('loreAppearance').value,
            backstory:   document.getElementById('loreBackstory').value,
            hair:        document.getElementById('loreHair').value,
            alignment:   document.getElementById('loreAlignment').value
        };

        payload.deletedItems = Array.from(deletedItemIds);

        statusSpan.textContent = 'Saving...';

        fetch(`/character/${characterId}/save`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(resp => {
            if (!resp.ok) throw new Error('Save failed');
            return resp.json();
        })
        .then(() => {
            statusSpan.textContent = 'Saved!';
        })
        .catch(err => {
            console.error(err);
            statusSpan.textContent = 'Error saving';
        });
    });
    
    const exitBtn = document.getElementById('exitButton')

    exitBtn.addEventListener('click', () => {
        window.location.href = '/list';
    });

    document.querySelectorAll('#featList li').forEach(addFeatRemoveButton);
    document.querySelectorAll('#featureList li').forEach(addFeatureRemoveButton);
    document.querySelectorAll('#effectList li').forEach(addEffectRemoveButton);
    classList.querySelectorAll('.spellcasting-class').forEach(li => {
        addClassRemoveButton(li);
    });

    recalcWaterTotal();
    recalcRationTotal();
    recalcAbilityModifiers();
    recalcSpellcasting();
    recalcSkills();
});
