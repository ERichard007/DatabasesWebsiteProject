from flask import Flask, request, redirect, render_template
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")
    
@app.route("/login", methods=["GET","POST"])
def login():
    if request.method == "POST":
        user = request.form["username"]
        passw = request.form["password"]

        conn = sqlite3.connect('DnDCharacterManager.db')
        cursor = conn.cursor()
        cursor.execute("SELECT passw FROM User WHERE username = ?", (user,))
        row = cursor.fetchone()

        conn.close()

        if row and check_password_hash(row[0], passw):
            return "login succesfull!"
        else:
            return "unsuccesfull login"
            

    return render_template("login.html")

@app.route("/register", methods=["GET","POST"])
def register():
    if request.method == "POST":
        user = request.form["username"]
        passw = request.form["password"]

        conn = sqlite3.connect('DnDCharacterManager.db')
        cursor = conn.cursor()
        cursor.execute("SELECT username FROM User WHERE username = ?", (user,))

        row = cursor.fetchone()

        cursor.execute("SELECT * FROM User")
        rows = cursor.fetchall()
        for row in rows:
            print(row)

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

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8080, debug=True)