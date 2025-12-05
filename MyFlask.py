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

    cursor.execute("SELECT characterid, name, background FROM Character WHERE userid = ?", (user_id,))
    characters = cursor.fetchall()

    cursor.execute("SELECT username FROM User WHERE userid = ?", (user_id,))
    username = cursor.fetchone()[0]

    conn.close()

    return render_template("list.html", characters=characters, username=username)

@app.route("/character/<int:cid>") #character editing page
def character(cid):
    return render_template("character.html")

@app.route("/charactercreation", methods=["GET","POST"]) #character creation page
def create_character():
    if request.method == "POST":
        conn = sqlite3.connect("DnDCharacterManager.db")
        cursor = conn.cursor()

        #form variables from character creation page
        cursor.execute("SELECT MAX(characterid) FROM Character")
        row = cursor.fetchone()
        print(row)
        new_id = (row[0] or 0) + 1
        characterid = new_id

        userid = session.get("userid") 
        isCompanion = 1 if request.form.get('companion') == 'on' else 0
        ownerid = new_id if isCompanion else None

        className = request.form.getlist('classSelection')
        profBonus = request.form.getlist('profBonus')
        hitDice = request.form.getlist('hitDice')
        maxHP = request.form.getlist('maxHP')
        levelInput = request.form.getlist('levelInput')
        spellCastingClass = request.form.getlist('spellcastingClass')
        spellSlots = request.form.getlist('spellSlots')
        spellMod = request.form.getlist('spellMod')

        featNames = request.form.getlist('featName')
        featDescriptions = request.form.getlist('featDesc')

        featureNames = request.form.getlist('featureName')
        featureDescriptions = request.form.getlist('featureDescription')

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

        for className, profBonus, hitDice, maxHP, levelInput, spellCastingClass, spellSlots, spellMod in zip(className, profBonus, hitDice, maxHP, levelInput, spellCastingClass, spellSlots, spellMod):
            cursor.execute("INSERT INTO Class(characterid, name, proficiencybonus, totalhitdice, currenthitdice, maxhitpoints, currenthitpoints, classlevel, spellcastingmodifier) VALUES(?,?,?,?,?,?,?,?,?,?)", (characterid, className, profBonus, hitDice, hitDice, maxHP, maxHP, levelInput, spellMod,))

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

        for itemName, itemDesc in zip(itemNames, itemDescriptions):
            cursor.execute("INSERT INTO ItemTable(characterid, name, description) VALUES(?,?,?)", (characterid, itemName, itemDesc,))
            if itemName == 'Container':
                cursor.execute("INSERT INTO Container(characterid, ozfilledofwater) VALUES(?,?)", (characterid, ozFilledOfWaters.pop(0),))
            elif itemName == 'SiegeEquipment':
                cursor.execute("INSERT INTO SiegeEquipment(characterid, ac, damageimmunities, hp) VALUES(?,?,?,?)", (characterid, siegeACs.pop(0), siegeDamageImmunities.pop(0), siegeHPs.pop(0),))
            elif itemName == 'Poison':
                cursor.execute("INSERT INTO Poison(characterid, type, cost) VALUES(?,?,?)", (characterid, poisonTypes.pop(0), poisonCosts.pop(0),))
            elif itemName == 'AdventuringGear':
                cursor.execute("INSERT INTO AdventuringGear(characterid, cost, weight) VALUES(?,?,?)", (characterid, adventuringGearCosts.pop(0), adventuringGearWeights.pop(0),))
            elif itemName == 'Weapon':
                cursor.execute("INSERT INTO Weapon(characterid, weight, cost, damage) VALUES(?,?,?,?)", (characterid, weaponWeights.pop(0), weaponCosts.pop(0), weaponDamages.pop(0),))
            elif itemName == 'Armor&Shield':
                cursor.execute("INSERT INTO ArmorAndShield(characterid, weight, cost, ac, equipped) VALUES(?,?,?,?,?)", (characterid, armorShieldWeights.pop(0), armorShieldCosts.pop(0), armorShieldAcs.pop(0), armorShieldEquippeds.pop(0),))
            elif itemName == 'Explosive':
                cursor.execute("INSERT INTO Explosive(characterid, weight, cost) VALUES(?,?,?)", (characterid, explosiveWeights.pop(0), explosiveCosts.pop(0),))
            elif itemName == 'Tools':
                cursor.execute("INSERT INTO Tools(characterid, weight, cost) VALUES(?,?,?)", (characterid, toolWeights.pop(0), toolCosts.pop(0),))
            elif itemName == 'Trinket':
                cursor.execute("INSERT INTO Trinket(characterid) VALUES(?)", (characterid,))
            elif itemName == 'Firearm':
                cursor.execute("INSERT INTO Firearm(characterid, weight, cost, damage) VALUES(?,?,?,?)", (characterid, firearmWeights.pop(0), firearmCosts.pop(0), firearmDamages.pop(0),))
            elif itemName == 'Other':
                cursor.execute("INSERT INTO Other(characterid, weight, cost) VALUES(?,?,?)", (characterid, otherWeights.pop(0), otherCosts.pop(0),))
            elif itemName == 'Wondrous':
                cursor.execute("INSERT INTO Wondrous(characterid, rationcount) VALUES(?,?)", (characterid, rationCounts.pop(0),))
            elif itemName == 'Ration':
                cursor.execute("INSERT INTO Ration(characterid, rationcount) VALUES(?,?)", (characterid, rationCounts.pop(0),))
            elif itemName == 'Spells':
                cursor.execute("INSERT INTO Spells(characterid, duration, component, spelllevel, spellrange, castingtime) VALUES(?,?,?,?,?,?)", (characterid, spellDurations.pop(0), spellComponents.pop(0), spellLevels.pop(0), spellRanges.pop(0), spellCastingTimes.pop(0),))

        conn.commit()
        cursor.close()

        return redirect('/list')
        
    return render_template("charactercreation.html")

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8080, debug=True)