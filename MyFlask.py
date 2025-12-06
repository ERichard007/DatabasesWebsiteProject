from flask import Flask, request, redirect, render_template, session
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3

app = Flask(__name__)
app.secret_key = "dev12345" ## NEED TO CHANGE LATER (IMPORTANT!!!)

@app.route("/") #default page
def index():
    return render_template("index.html")
    
@app.route("/login", methods=["GET","POST"]) #login page
def login():
    if request.method == "POST":
        user = request.form["username"]
        passw = request.form["password"]

        conn = sqlite3.connect('DnDCharacterManager.db')
        cursor = conn.cursor()
        cursor.execute("SELECT passw, userid FROM User WHERE username = ?", (user,))
        row = cursor.fetchone()

        conn.close()

        if row and check_password_hash(row[0], passw):
            session["userid"] = row[1]
            return redirect("/list")
        else:
            return "Incorrect username or password"
            

    return render_template("login.html")

@app.route("/register", methods=["GET","POST"]) #registeration page
def register():
    if request.method == "POST":
        user = request.form["username"]
        passw = request.form["password"]

        conn = sqlite3.connect('DnDCharacterManager.db')
        cursor = conn.cursor()
        cursor.execute("SELECT username FROM User WHERE username = ?", (user,))

        row = cursor.fetchone()

        try:
            hashp = generate_password_hash(passw)
            cursor.execute("INSERT INTO User(username, passw) VALUES(?,?)", (user, hashp,))
            conn.commit()
            conn.close()
            return render_template("login.html")

        except sqlite3.IntegrityError:
            conn.close()
            return "username already taken!"

    return render_template("register.html")

@app.route("/list") #character listing page
def list_characters():
    conn = sqlite3.connect("DnDCharacterManager.db")
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM User")
    print(cursor.fetchall())
    cursor.execute("SELECT * FROM Character")
    print(cursor.fetchall())

    user_id = session.get("userid")

    cursor.execute("SELECT characterid, name, background FROM Character WHERE userid = ? AND iscompanion = 0", (user_id,))
    characters = cursor.fetchall()

    cursor.execute("SELECT username FROM User WHERE userid = ?", (user_id,))
    username = cursor.fetchone()[0]

    conn.close()

    return render_template("list.html", characters=characters, username=username)

@app.route("/character/<int:cid>") #character editing page
def character(cid):
    conn = sqlite3.connect("DnDCharacterManager.db")
    cursor = conn.cursor()

    user_id = session.get("userid")

    cursor.execute("SELECT * FROM Character WHERE characterid = ? AND userid = ?", (cid, user_id,))
    character = cursor.fetchone()

    cursor.execute("SELECT * FROM Character WHERE ownerid = ? AND userid = ?", (cid, user_id,))
    companions = cursor.fetchall()

    cursor.execute("SELECT * FROM Stats WHERE characterid = ?", (cid,))
    stats = cursor.fetchone()

    cursor.execute("SELECT * FROM Skill WHERE characterid = ?", (cid,))
    skills = cursor.fetchall()

    cursor.execute("SELECT * FROM Class WHERE characterid = ?", (cid,))
    classes = cursor.fetchall()

    cursor.execute("SELECT * FROM Race WHERE characterid = ?", (cid,))
    race = cursor.fetchone()

    cursor.execute("SELECT * FROM SavingThrow WHERE characterid = ?", (cid,))
    savingthrows = cursor.fetchall()

    cursor.execute("SELECT * FROM Ability WHERE characterid = ?", (cid,))
    abilities = cursor.fetchall()

    cursor.execute("SELECT * FROM Feat WHERE characterid = ?", (cid,))
    feats = cursor.fetchall()

    cursor.execute("SELECT * FROM Features WHERE characterid = ?", (cid,))
    features = cursor.fetchall()

    cursor.execute("SELECT * From Effects WHERE characterid = ?", (cid,))
    effects = cursor.fetchall()

    cursor.execute("SELECT * FROM Lore WHERE characterid = ?", (cid,))
    lore = cursor.fetchone()

    cursor.execute("SELECT * FROM Item WHERE characterid = ?", (cid,))
    items = cursor.fetchall()

    cursor.execute("SELECT w.*, i.name, i.description FROM WaterContainer w JOIN Item i ON w.itemid = i.itemid WHERE w.characterid = ?", (cid,))
    containers = cursor.fetchall()

    cursor.execute("SELECT s.*, i.name, i.description FROM SiegeEquipment s JOIN Item i ON s.itemid = i.itemid WHERE s.characterid = ?", (cid,))
    siegeequipments = cursor.fetchall()

    cursor.execute("SELECT p.*, i.name, i.description FROM Poison p JOIN Item i ON p.itemid = i.itemid WHERE p.characterid = ?", (cid,))
    poisons = cursor.fetchall()

    cursor.execute("SELECT a.*, i.name, i.description FROM AdventuringGear a JOIN Item i ON a.itemid = i.itemid WHERE a.characterid = ?", (cid,))
    adventuringgears = cursor.fetchall()

    cursor.execute("SELECT w.*, i.name, i.description FROM Weapon w JOIN Item i ON w.itemid = i.itemid WHERE w.characterid = ?", (cid,))
    weapons = cursor.fetchall()

    cursor.execute("SELECT a.*, i.name, i.description FROM ArmorShield a JOIN Item i ON a.itemid = i.itemid WHERE a.characterid = ?", (cid,))
    armorshields = cursor.fetchall()

    cursor.execute("SELECT s.*, i.name, i.description FROM Spell s JOIN Item i ON s.itemid = i.itemid WHERE s.characterid = ?", (cid,))
    spells = cursor.fetchall()

    cursor.execute("SELECT e.*, i.name, i.description FROM Explosive e JOIN Item i ON e.itemid = i.itemid WHERE e.characterid = ?", (cid,))
    explosives = cursor.fetchall()

    cursor.execute("SELECT t.*, i.name, i.description FROM Tool t JOIN Item i ON t.itemid = i.itemid WHERE t.characterid = ?", (cid,))
    tools = cursor.fetchall()

    cursor.execute("SELECT t.*, i.name, i.description FROM Trinket t JOIN Item i ON t.itemid = i.itemid WHERE t.characterid = ?", (cid,))
    trinkets = cursor.fetchall()

    cursor.execute("SELECT f.*, i.name, i.description FROM Firearm f JOIN Item i ON f.itemid = i.itemid WHERE f.characterid = ?", (cid,))
    firearms = cursor.fetchall()

    cursor.execute("SELECT o.*, i.name, i.description FROM Other o JOIN Item i ON o.itemid = i.itemid WHERE o.characterid = ?", (cid,))
    others = cursor.fetchall()

    cursor.execute("SELECT w.*, i.name, i.description FROM Wondrous w JOIN Item i ON w.itemid = i.itemid WHERE w.characterid = ?", (cid,))
    wondrous = cursor.fetchall()

    cursor.execute("SELECT r.*, i.name, i.description FROM Ration r JOIN Item i ON r.itemid = i.itemid WHERE r.characterid = ?", (cid,))
    rations = cursor.fetchall()

    conn.close()

    print(character, companions, stats, skills, classes, race, savingthrows, abilities, feats, features, effects, lore, items, containers, siegeequipments, poisons, adventuringgears, weapons, armorshields, spells, explosives, tools, trinkets, firearms, others, wondrous, rations)

    return render_template("character.html", character=character, companions=companions, stats=stats, skills=skills, classes=classes, race=race, savingthrows=savingthrows, abilities=abilities, feats=feats, features=features, effects=effects, lore=lore, items=items, containers=containers, siegeequipments=siegeequipments, poisons=poisons, adventuringgears=adventuringgears, weapons=weapons, armorshields=armorshields, spells=spells, explosives=explosives, tools=tools, trinkets=trinkets, firearms=firearms, others=others, wondrous=wondrous, rations=rations)

@app.route("/charactercreation", methods=["GET","POST"]) #character creation page
def create_character():
    if request.method == "POST":
        conn = sqlite3.connect("DnDCharacterManager.db")
        cursor = conn.cursor()

        #form variables from character creation page
        userid = session.get("userid") 
        isCompanion = request.form['companion']
        ownerid = isCompanion if int(isCompanion) >= 1 else None

        className = request.form.getlist('classSelection')
        profBonus = request.form.getlist('profBonus')
        hitDice = request.form.getlist('hitDice')
        maxHP = request.form.getlist('maxHP')
        levelInput = request.form.getlist('levelInput')
        spellMod = request.form.getlist('spellMod')

        featNames = request.form.getlist('featName')
        featDescriptions = request.form.getlist('featDesc')

        featureNames = request.form.getlist('featureName')
        featureDescriptions = request.form.getlist('featureDescription')

        itemTypes = request.form.getlist('itemType')
        itemNames = request.form.getlist('itemName')
        itemDescriptions = request.form.getlist('itemDesc')
        ozFilledOfWaters = request.form.getlist('ozFilledOfWater')
        siegeACs = request.form.getlist('siegeAc')
        siegeDamageImmunities = request.form.getlist('siegeDamageImmunities')
        siegeHPs = request.form.getlist('siegeHP')
        poisonTypes = request.form.getlist('poisonType')
        poisonCosts = request.form.getlist('poisonCost')
        adventuringGearCosts = request.form.getlist('adventuringGearCost')
        adventuringGearWeights = request.form.getlist('adventuringGearWeight')
        weaponWeights = request.form.getlist('weaponWeight')
        weaponCosts = request.form.getlist('weaponCost')
        weaponDamages = request.form.getlist('weaponDamage')
        armorShieldWeights = request.form.getlist('armor&ShieldWeight')
        armorShieldCosts = request.form.getlist('armor&ShieldCost')
        armorShieldAcs = request.form.getlist('armor&ShiledAc')
        armorShieldEquippeds = request.form.getlist('armor&ShieldEquipped')
        explosiveWeights = request.form.getlist('explosiveWeight')
        explosiveCosts = request.form.getlist('explosiveCost')
        toolWeights = request.form.getlist('toolWeight')
        toolCosts = request.form.getlist('toolCost')
        firearmWeights = request.form.getlist('firearmWeight')
        firearmCosts = request.form.getlist('firearmCost')
        firearmDamages = request.form.getlist('firearmDamage')
        otherWeights = request.form.getlist('otherWeight')
        otherCosts = request.form.getlist('otherCost')
        rationCounts = request.form.getlist('rationCount')
        spellDurations = request.form.getlist('spellDuration')
        spellComponents = request.form.getlist('spellComponent')
        spellLevels = request.form.getlist('spellLevel')
        spellRanges = request.form.getlist('spellRange')
        spellCastingTimes = request.form.getlist('spellCastingTime')

        #database insertion
        cursor.execute("INSERT INTO Character(userid, background, iscompanion, name, playername, electrum, gold, silver, copper, platinum, ownerid) VALUES(?,?,?,?,?,?,?,?,?,?,?)", (userid,request.form['background'],isCompanion,request.form['characterName'],request.form['playerName'],request.form['electrum'],request.form['gold'],request.form['silver'],request.form['copper'],request.form['platinum'],ownerid,))

        characterid = cursor.execute("SELECT last_insert_rowid()").fetchone()[0]

        cursor.execute("INSERT INTO Stats(characterid, exp) VALUES(?,?)", (characterid, request.form['experience'],))

        cursor.execute("INSERT INTO Skill(characterid,name,score,proficient) VALUES(?,?,?,?)", (characterid, "Acrobatics", request.form['dexterity'], 1 if request.form.get('acrobatics') == 'on' else 0,))
        cursor.execute("INSERT INTO Skill(characterid,name,score,proficient) VALUES(?,?,?,?)", (characterid, "Animal Handling", request.form['wisdom'], 1 if request.form.get('animalHandling') == 'on' else 0,))
        cursor.execute("INSERT INTO Skill(characterid,name,score,proficient) VALUES(?,?,?,?)", (characterid, "Arcana", request.form['intelligence'], 1 if request.form.get('arcana') == 'on' else 0,))
        cursor.execute("INSERT INTO Skill(characterid,name,score,proficient) VALUES(?,?,?,?)", (characterid, "Athletics", request.form['strength'], 1 if request.form.get('athletics') == 'on' else 0,))
        cursor.execute("INSERT INTO Skill(characterid,name,score,proficient) VALUES(?,?,?,?)", (characterid, "Deception", request.form['charisma'], 1 if request.form.get('deception') == 'on' else 0,))
        cursor.execute("INSERT INTO Skill(characterid,name,score,proficient) VALUES(?,?,?,?)", (characterid, "History", request.form['intelligence'], 1 if request.form.get('history') == 'on' else 0,))
        cursor.execute("INSERT INTO Skill(characterid,name,score,proficient) VALUES(?,?,?,?)", (characterid, "Insight", request.form['wisdom'], 1 if request.form.get('insight') == 'on' else 0,))
        cursor.execute("INSERT INTO Skill(characterid,name,score,proficient) VALUES(?,?,?,?)", (characterid, "Intimidation", request.form['charisma'], 1 if request.form.get('intimidation') == 'on' else 0,))
        cursor.execute("INSERT INTO Skill(characterid,name,score,proficient) VALUES(?,?,?,?)", (characterid, "Investigation", request.form['intelligence'], 1 if request.form.get('investigation') == 'on' else 0,))
        cursor.execute("INSERT INTO Skill(characterid,name,score,proficient) VALUES(?,?,?,?)", (characterid, "Medicine", request.form['wisdom'], 1 if request.form.get('medicine') == 'on' else 0,))
        cursor.execute("INSERT INTO Skill(characterid,name,score,proficient) VALUES(?,?,?,?)", (characterid, "Nature", request.form['intelligence'], 1 if request.form.get('nature') == 'on' else 0,))
        cursor.execute("INSERT INTO Skill(characterid,name,score,proficient) VALUES(?,?,?,?)", (characterid, "Perception", request.form['wisdom'], 1 if request.form.get('perception') == 'on' else 0,))
        cursor.execute("INSERT INTO Skill(characterid,name,score,proficient) VALUES(?,?,?,?)", (characterid, "Performance", request.form['charisma'], 1 if request.form.get('performance') == 'on' else 0,))
        cursor.execute("INSERT INTO Skill(characterid,name,score,proficient) VALUES(?,?,?,?)", (characterid, "Persuasion", request.form['charisma'], 1 if request.form.get('persuasion') == 'on' else 0,))
        cursor.execute("INSERT INTO Skill(characterid,name,score,proficient) VALUES(?,?,?,?)", (characterid, "Religion", request.form['intelligence'], 1 if request.form.get('religion') == 'on' else 0,))
        cursor.execute("INSERT INTO Skill(characterid,name,score,proficient) VALUES(?,?,?,?)", (characterid, "Sleight of Hand", request.form['dexterity'], 1 if request.form.get('sleightOfHand') == 'on' else 0,))
        cursor.execute("INSERT INTO Skill(characterid,name,score,proficient) VALUES(?,?,?,?)", (characterid, "Stealth", request.form['dexterity'], 1 if request.form.get('stealth') == 'on' else 0,))
        cursor.execute("INSERT INTO Skill(characterid,name,score,proficient) VALUES(?,?,?,?)", (characterid, "Survival", request.form['wisdom'], 1 if request.form.get('survival') == 'on' else 0,))    

        for cn, pb, hd, mhp, lvl, sm in zip(className, profBonus, hitDice, maxHP, levelInput, spellMod):
            cursor.execute("""INSERT INTO Class(characterid, name, proficiencybonus, totalhitdice, currenthitdice, maxhitpoints, classlevel, spellcastingmodifier)VALUES (?, ?, ?, ?, ?, ?, ?, ?)""", (characterid, cn, pb, hd, hd, mhp, lvl, sm))

        cursor.execute("INSERT INTO Race(characterid, name, speed) VALUES(?,?,?)", (characterid, request.form['raceSelection'], request.form['speed'],))

        cursor.execute("INSERT INTO SavingThrow(characterid, name, proficient, score) VALUES(?,?,?,?)", (characterid, "Strength", 1 if request.form.get('strSave') == 'on' else 0, request.form['strength'],))
        cursor.execute("INSERT INTO SavingThrow(characterid, name, proficient, score) VALUES(?,?,?,?)", (characterid, "Dexterity", 1 if request.form.get('dexSave') == 'on' else 0, request.form['dexterity'],))
        cursor.execute("INSERT INTO SavingThrow(characterid, name, proficient, score) VALUES(?,?,?,?)", (characterid, "Constitution", 1 if request.form.get('conSave') == 'on' else 0, request.form['constitution'],))
        cursor.execute("INSERT INTO SavingThrow(characterid, name, proficient, score) VALUES(?,?,?,?)", (characterid, "Intelligence", 1 if request.form.get('intSave') == 'on' else 0, request.form['intelligence'],))
        cursor.execute("INSERT INTO SavingThrow(characterid, name, proficient, score) VALUES(?,?,?,?)", (characterid, "Wisdom", 1 if request.form.get('wisSave') == 'on' else 0, request.form['wisdom'],))
        cursor.execute("INSERT INTO SavingThrow(characterid, name, proficient, score) VALUES(?,?,?,?)", (characterid, "Charisma", 1 if request.form.get('chaSave') == 'on' else 0, request.form['charisma'],))

        cursor.execute("INSERT INTO Ability(characterid, name, score) VALUES(?,?,?)", (characterid, "Strength", request.form['strength'],))
        cursor.execute("INSERT INTO Ability(characterid, name, score) VALUES(?,?,?)", (characterid, "Dexterity", request.form['dexterity'],))
        cursor.execute("INSERT INTO Ability(characterid, name, score) VALUES(?,?,?)", (characterid, "Constitution", request.form['constitution'],))
        cursor.execute("INSERT INTO Ability(characterid, name, score) VALUES(?,?,?)", (characterid, "Intelligence", request.form['intelligence'],))
        cursor.execute("INSERT INTO Ability(characterid, name, score) VALUES(?,?,?)", (characterid, "Wisdom", request.form['wisdom'],))
        cursor.execute("INSERT INTO Ability(characterid, name, score) VALUES(?,?,?)", (characterid, "Charisma", request.form['charisma'],))

        for featName, featDesc in zip(featNames, featDescriptions):
            cursor.execute("INSERT INTO Feat(characterid, name, description) VALUES(?,?,?)", (characterid, featName, featDesc,))

        for featureName, featureDesc in zip(featureNames, featureDescriptions):
            cursor.execute("INSERT INTO Features(characterid, name, description) VALUES(?,?,?)", (characterid, featureName, featureDesc,))
        
        cursor.execute("INSERT INTO Lore(characterid, skin, eye, ideals, bonds, flaws, age, personalitytraits, weight, height, allies, appearance, backstory, hair, alignment) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", (characterid, request.form['skin'], request.form['eyes'], request.form['ideals'], request.form['bonds'], request.form['flaws'], request.form['age'], request.form['traits'], request.form['weight'], request.form['height'], request.form['allies'], request.form['appearance'], request.form['backstory'], request.form['hair'], request.form['alignment'],))

        for itemType, itemName, itemDesc in zip(itemTypes, itemNames, itemDescriptions):
            cursor.execute("INSERT INTO Item(characterid, name, description) VALUES(?,?,?)", (characterid, itemName, itemDesc,))
            itemId = cursor.execute("SELECT last_insert_rowid()").fetchone()[0]
            print(itemId)
            if itemType == 'Container':
                cursor.execute("INSERT INTO WaterContainer(characterid, itemid, ozfilled) VALUES(?,?,?)", (characterid, itemId, ozFilledOfWaters.pop(0),))
            elif itemType == 'SiegeEquipment':
                cursor.execute("INSERT INTO SiegeEquipment(characterid, itemid, ac, damageimmunities, hitpoints) VALUES(?,?,?,?,?)", (characterid, itemId, siegeACs.pop(0), siegeDamageImmunities.pop(0), siegeHPs.pop(0),))
            elif itemType == 'Poison':
                cursor.execute("INSERT INTO Poison(characterid, itemid, type, cost) VALUES(?,?,?,?)", (characterid, itemId, poisonTypes.pop(0), poisonCosts.pop(0),))
            elif itemType == 'AdventuringGear':
                cursor.execute("INSERT INTO AdventuringGear(characterid, itemid, cost, weight) VALUES(?,?,?,?)", (characterid, itemId, adventuringGearCosts.pop(0), adventuringGearWeights.pop(0),))
            elif itemType == 'Weapon':
                cursor.execute("INSERT INTO Weapon(characterid, itemid, weight, cost, damage) VALUES(?,?,?,?,?)", (characterid, itemId, weaponWeights.pop(0), weaponCosts.pop(0), weaponDamages.pop(0),))
            elif itemType == 'Armor&Shield':
                cursor.execute("INSERT INTO ArmorShield(characterid, itemid, weight, cost, ac, equipped) VALUES(?,?,?,?,?,?)", (characterid, itemId, armorShieldWeights.pop(0), armorShieldCosts.pop(0), armorShieldAcs.pop(0), 1 if armorShieldEquippeds.pop(0) == 'on' else 0,))
            elif itemType == 'Explosive':
                cursor.execute("INSERT INTO Explosive(characterid, itemid, weight, cost) VALUES(?,?,?,?)", (characterid, itemId, explosiveWeights.pop(0), explosiveCosts.pop(0),))
            elif itemType == 'Tools':
                cursor.execute("INSERT INTO Tool(characterid, itemid, weight, cost) VALUES(?,?,?,?)", (characterid, itemId, toolWeights.pop(0), toolCosts.pop(0),))
            elif itemType == 'Trinket':
                cursor.execute("INSERT INTO Trinket(characterid, itemid) VALUES(?,?)", (characterid, itemId,))
            elif itemType == 'Firearm':
                cursor.execute("INSERT INTO Firearm(characterid, itemid, weight, cost, damage) VALUES(?,?,?,?,?)", (characterid, itemId, firearmWeights.pop(0), firearmCosts.pop(0), firearmDamages.pop(0),))
            elif itemType == 'Other':
                cursor.execute("INSERT INTO Other(characterid, itemid, weight, cost) VALUES(?,?,?,?)", (characterid, itemId, otherWeights.pop(0), otherCosts.pop(0),))
            elif itemType == 'Wondrous':
                cursor.execute("INSERT INTO Wondrous(characterid, itemid) VALUES(?,?)", (characterid, itemId,))
            elif itemType == 'Ration':
                cursor.execute("INSERT INTO Ration(characterid, itemid, rationcount) VALUES(?,?,?)", (characterid, itemId, rationCounts.pop(0),))
            elif itemType == 'Spells':
                cursor.execute("INSERT INTO Spell(characterid, itemid, duration, components, level, range, castingtime) VALUES(?,?,?,?,?,?,?)", (characterid, itemId, spellDurations.pop(0), spellComponents.pop(0), spellLevels.pop(0), spellRanges.pop(0), spellCastingTimes.pop(0),))

        conn.commit()
        cursor.close()

        return redirect('/list')
        
    return render_template("charactercreation.html")

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8080, debug=True)