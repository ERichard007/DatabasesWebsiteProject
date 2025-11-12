from flask import Flask, render_template
import sqlite3

connection = sqlite3.connect('DnDCharacterManager.db')

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")
    
@app.route("/login")
def login():
    return render_template("login.html")

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8080, debug=True)