import sqlite3

connection = sqlite3.connect('DnDCharacterManager.db')
cursor = connection.cursor()

ResetTables = """DROP TABLE IF EXISTS User"""

UserTable = """CREATE TABLE IF NOT EXISTS
User(
userid INTEGER PRIMARY KEY AUTOINCREMENT,
username TEXT UNIQUE NOT NULL,
passw TEXT NOT NULL
)"""

cursor.execute(ResetTables)
cursor.execute(UserTable)

connection.commit()
connection.close()