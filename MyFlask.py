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
        print(request.form)

        cursor.execute("SELECT MAX(characterid) FROM Character")
        new_id = cursor.fetchone()[0] + 1
        characterid = new_id

        userid = session.get("userid") 
        isCompanion = request.form['companion']
        ownerid = new_id if isCompanion else None

        className = request.form.getlist('classSelection')
        profBonus = request.form.getlist('profBonus')
        hitDice = request.form.getlist('hitDice')
        maxHP = request.form.getlist('maxHP')
        levelInput = request.form.getlist('levelInput')
        spellCastingClass = request.form.getlist('spellcastingClass')
        spellSlots = request.form.getlist('spellSlots')
        spellMod = request.form.getlist('spellMod')


        #database insertion
        cursor.execute("INSERT INTO Character(userid, background, iscompanion, name, playername, electrum, gold, silver, copper, platinum, ownerid) VALUES(?,?,?,?,?,?,?,?,?,?,?)", (userid,request.form['background'],isCompanion,request.form['characterName'],request.form['playerName'],request.form['electrum'],request.form['gold'],request.form['silver'],request.form['copper'],request.form['platinum'],ownerid,))

        cursor.execute("INSERT INTO Stats(characterid, exp) VALUES(?,?)", (characterid, request.form['experience'],))

        cursor.execute("INSERT INTO Skill(characterid,name,score,proficient) VALUES(?,?,?,?)", (characterid, "Acrobatics", request.form['dexterity'], request.form['acrobatics'],))
        cursor.execute("INSERT INTO Skill(characterid,name,score,proficient) VALUES(?,?,?,?)", (characterid, "Animal Handling", request.form['wisdom'], request.form['animalHandling'],))
        cursor.execute("INSERT INTO Skill(characterid,name,score,proficient) VALUES(?,?,?,?)", (characterid, "Arcana", request.form['intelligence'], request.form['arcana'],))
        cursor.execute("INSERT INTO Skill(characterid,name,score,proficient) VALUES(?,?,?,?)", (characterid, "Athletics", request.form['strength'], request.form['athletics'],))
        cursor.execute("INSERT INTO Skill(characterid,name,score,proficient) VALUES(?,?,?,?)", (characterid, "Deception", request.form['charisma'], request.form['deception'],))
        cursor.execute("INSERT INTO Skill(characterid,name,score,proficient) VALUES(?,?,?,?)", (characterid, "History", request.form['intelligence'], request.form['history'],))
        cursor.execute("INSERT INTO Skill(characterid,name,score,proficient) VALUES(?,?,?,?)", (characterid, "Insight", request.form['wisdom'], request.form['insight'],))
        cursor.execute("INSERT INTO Skill(characterid,name,score,proficient) VALUES(?,?,?,?)", (characterid, "Intimidation", request.form['charisma'], request.form['intimidation'],))
        cursor.execute("INSERT INTO Skill(characterid,name,score,proficient) VALUES(?,?,?,?)", (characterid, "Investigation", request.form['intelligence'], request.form['investigation'],))
        cursor.execute("INSERT INTO Skill(characterid,name,score,proficient) VALUES(?,?,?,?)", (characterid, "Medicine", request.form['wisdom'], request.form['medicine'],))
        cursor.execute("INSERT INTO Skill(characterid,name,score,proficient) VALUES(?,?,?,?)", (characterid, "Nature", request.form['intelligence'], request.form['nature'],))
        cursor.execute("INSERT INTO Skill(characterid,name,score,proficient) VALUES(?,?,?,?)", (characterid, "Perception", request.form['wisdom'], request.form['perception'],))
        cursor.execute("INSERT INTO Skill(characterid,name,score,proficient) VALUES(?,?,?,?)", (characterid, "Performance", request.form['charisma'], request.form['performance'],))
        cursor.execute("INSERT INTO Skill(characterid,name,score,proficient) VALUES(?,?,?,?)", (characterid, "Persuasion", request.form['charisma'], request.form['persuasion'],))
        cursor.execute("INSERT INTO Skill(characterid,name,score,proficient) VALUES(?,?,?,?)", (characterid, "Religion", request.form['intelligence'], request.form['religion'],))
        cursor.execute("INSERT INTO Skill(characterid,name,score,proficient) VALUES(?,?,?,?)", (characterid, "Sleight of Hand", request.form['dexterity'], request.form['sleightOfHand'],))
        cursor.execute("INSERT INTO Skill(characterid,name,score,proficient) VALUES(?,?,?,?)", (characterid, "Stealth", request.form['dexterity'], request.form['stealth'],))
        cursor.execute("INSERT INTO Skill(characterid,name,score,proficient) VALUES(?,?,?,?)", (characterid, "Survival", request.form['wisdom'], request.form['survival'],))    

        for className, profBonus, hitDice, maxHP, levelInput, spellCastingClass, spellSlots, spellMod in zip(className, profBonus, hitDice, maxHP, levelInput, spellCastingClass, spellSlots, spellMod):
            cursor.execute("INSERT INTO Class(characterid, name, proficiencybonus, totalhitdice, currenthitdice, maxhitpoints, currenthitpoints, classlevel, spellcastingmodifier) VALUES(?,?,?,?,?,?,?,?,?,?)", (characterid, className, profBonus, hitDice, hitDice, maxHP, maxHP, levelInput, spellMod,))

        cursor.execute("INSERT INTO Race(characterid, name, speed) VALUES(?,?,?)", (characterid, request.form['raceSelection'], request.form['speed'],))

        cursor.execute("INSERT INTO SavingThrow(characterid, name, proficient, score) VALUES(?,?,?,?)", (characterid, "Strength", request.form['strSave'], request.form['strength'],))
        cursor.execute("INSERT INTO SavingThrow(characterid, name, proficient, score) VALUES(?,?,?,?)", (characterid, "Dexterity", request.form['dexSave'], request.form['dexterity'],))
        cursor.execute("INSERT INTO SavingThrow(characterid, name, proficient, score) VALUES(?,?,?,?)", (characterid, "Constitution", request.form['conSave'], request.form['constitution'],))
        cursor.execute("INSERT INTO SavingThrow(characterid, name, proficient, score) VALUES(?,?,?,?)", (characterid, "Intelligence", request.form['intSave'], request.form['intelligence'],))
        cursor.execute("INSERT INTO SavingThrow(characterid, name, proficient, score) VALUES(?,?,?,?)", (characterid, "Wisdom", request.form['wisSave'], request.form['wisdom'],))
        cursor.execute("INSERT INTO SavingThrow(characterid, name, proficient, score) VALUES(?,?,?,?)", (characterid, "Charisma", request.form['chaSave'], request.form['charisma'],))

        cursor.execute("INSERT INTO Ability(characterid, name, score) VALUES(?,?,?)", (characterid, "Strength", request.form['strength'],))
        cursor.execute("INSERT INTO Ability(characterid, name, score) VALUES(?,?,?)", (characterid, "Dexterity", request.form['dexterity'],))
        cursor.execute("INSERT INTO Ability(characterid, name, score) VALUES(?,?,?)", (characterid, "Constitution", request.form['constitution'],))
        cursor.execute("INSERT INTO Ability(characterid, name, score) VALUES(?,?,?)", (characterid, "Intelligence", request.form['intelligence'],))
        cursor.execute("INSERT INTO Ability(characterid, name, score) VALUES(?,?,?)", (characterid, "Wisdom", request.form['wisdom'],))
        cursor.execute("INSERT INTO Ability(characterid, name, score) VALUES(?,?,?)", (characterid, "Charisma", request.form['charisma'],))

        cursor.execute("INSERT INTO Feat(characterid, name, description) VALUES(?,?,?)", (characterid,))

        conn.commit()
        cursor.close()

        return redirect('/list')
        
    return render_template("charactercreation.html")

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8080, debug=True)