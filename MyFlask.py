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
            return "Incoreect username or password"
            

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
    return render_template("charactercreation.html")

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8080, debug=True)