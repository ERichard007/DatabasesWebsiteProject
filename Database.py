import sqlite3

connection = sqlite3.connect('DnDCharacterManager.db')
cursor = connection.cursor()

ResetTable = """DROP TABLE IF EXISTS Character"""
ResetTable2 = """DROP TABLE IF EXISTS User"""

UserTable = """CREATE TABLE IF NOT EXISTS
User(
userid INTEGER PRIMARY KEY AUTOINCREMENT,
username TEXT UNIQUE NOT NULL,
passw TEXT NOT NULL
)"""

CharacterTable = """CREATE TABLE IF NOT EXISTS
Character(
characterid INTEGER PRIMARY KEY AUTOINCREMENT,
userid INTEGER NOT NULL REFERENCES User(userid),
background TEXT NOT NULL,
iscompanion INTEGER NOT NULL CHECK(iscompanion IN (0, 1)) DEFAULT 0, 
name TEXT,
playername TEXT,
electrum INTEGER CHECK(electrum >= 0) DEFAULT 0,
gold INTEGER CHECK(gold >= 0) DEFAULT 0,
silver INTEGER CHECK(silver >= 0) DEFAULT 0,
copper INTEGER CHECK(copper >= 0) DEFAULT 0,
platinum INTEGER CHECK(platinum >= 0) DEFAULT 0,
ownerid INTEGER REFERENCES Character(characterid) DEFAULT NULL
)"""

cursor.execute("PRAGMA foreign_keys = ON;")
cursor.execute(ResetTable)
cursor.execute(ResetTable2)
cursor.execute(UserTable)
cursor.execute(CharacterTable)

connection.commit()
connection.close()