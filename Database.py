import sqlite3

connection = sqlite3.connect('DnDCharacterManager.db')
cursor = connection.cursor()

UserTable = """CREATE TABLE IF NOT EXISTS
User(
userid SERIAL PRIMARY KEY,
username TEXT NOT NULL,
passw TEXT NOT NULL
)"""

cursor.execute(UserTable)

connection.commit()
connection.close()