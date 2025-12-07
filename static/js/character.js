// --------------------------------------- FUNCTIONS ---------------------------------------- //
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

// --------------------------------------- EVENT LISTENERS ---------------------------------------- //
document.addEventListener('DOMContentLoaded', () => {
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

    // Abilities & Initiative
    document.querySelectorAll('.ability-score').forEach(input => {
        input.addEventListener('input', () => {
            recalcAbilityModifiers();
            recalcSpellcasting();
        });
        input.addEventListener('change', () => {
            recalcAbilityModifiers();
            recalcSpellcasting();
        });
    });

    // Spellcasting
    document.querySelectorAll('.class-prof-bonus, .spellcasting-mod').forEach(input => {
        input.addEventListener('input', recalcSpellcasting);
        input.addEventListener('change', recalcSpellcasting);
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
        li.innerHTML = `
            <strong><input type="text" placeholder="Class name"></strong>
            (Level: <input type="number" min="1" max="20" value="1">)<br>
            Max HP: <input type='number' class="class-maxhp" value="0" min="0"><br>
            Hit Dice: <input type="number" min="0" value="0"> /
            <input type="number" min="0" value="0">d
            <select>
                <option value="6">6</option>
                <option value="8">8</option>
                <option value="10">10</option>
                <option value="12">12</option>
            </select><br>
            Proficiency Bonus:
            +<input type="number" class="class-prof-bonus" min="0" value="2"><br>
            Spellcasting Modifier:
            <input type="number" class="spellcasting-mod" value="0"><br>
            Spellsave DC:
            <input type="number" class="spellsave-dc" readonly><br>
            Spell Attack Bonus:
            <input type="number" class="spell-attack-bonus" readonly><br>
        `;
        classList.appendChild(li);

        li.querySelectorAll('.class-prof-bonus, .spellcasting-mod, .class-maxhp').forEach(input => {
            input.addEventListener('input', recalcSpellcasting);
            input.addEventListener('change', recalcSpellcasting);
        });

        

        recalcSpellcasting();
    });
    

    // Add Feat 
    const featList = document.getElementById('featList');
    const addFeatButton = document.getElementById('addFeatButton');

    addFeatButton.addEventListener('click', () => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong><input type="text" placeholder="Feat name"></strong>:
            <input type="text" placeholder="Feat description">
        `;
        featList.appendChild(li);
    });
    

    // Add Feature 
    const featureList = document.getElementById('featureList');
    const addFeatureButton = document.getElementById('addFeatureButton');

    addFeatureButton.addEventListener('click', () => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong><input type="text" placeholder="Feature name"></strong>:
            <input type="text" placeholder="Feature description">
        `;
        featureList.appendChild(li);
    });
    

    // Add Effect 
    const effectList = document.getElementById('effectList');
    const addEffectButton = document.getElementById('addEffectButton');

    addEffectButton.addEventListener('click', () => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong><input type="text" placeholder="Effect name"></strong>:
            <input type="text" placeholder="Effect description"><br>
            Duration: (<input type="text" placeholder="Duration">)
        `;
        effectList.appendChild(li);
    });
    
    // Save inventory (water + rations) 
    const saveBtn = document.getElementById('saveInventoryButton');
    const statusSpan = document.getElementById('saveInventoryStatus');
    const characterId = document.body.dataset.characterId;

    saveBtn.addEventListener('click', () => {
        const water = Array.from(document.querySelectorAll('.water-amount')).map(input => ({
            itemid: parseInt(input.dataset.itemid, 10),
            ozfilled: parseInt(input.value, 10) || 0
        }));

        const rations = Array.from(document.querySelectorAll('.ration-amount')).map(input => ({
            itemid: parseInt(input.dataset.itemid, 10),
            days: parseInt(input.value, 10) || 0
        }));

        statusSpan.textContent = 'Saving...';

        fetch(`/character/${characterId}/inventory`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ water, rations })
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
    

    // Initial calculations
    recalcWaterTotal();
    recalcRationTotal();
    recalcAbilityModifiers();
    recalcSpellcasting();
    recalcMaxhp();
});
