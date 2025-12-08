import sqlite3

connection = sqlite3.connect('DnDCharacterManager.db')
cursor = connection.cursor()

def tryCreateTable(sql):
    try:
        cursor.execute(sql)
    except sqlite3.OperationalError as e:
        print(f'there was an error creating table: {e}')

tables = [
    "WaterContainer", "SiegeEquipment", "Poison", "AdventuringGear",
    "Weapon", "ArmorShield", "Spell", "Explosive", "Tool", "Trinket",
    "Firearm", "Other", "Wondrous", "Ration", "Item", "Lore", "Effects",
    "Features", "Feat", "Ability", "SavingThrow", "Race", "Class",
    "Skill", "Stats", "Character", "User"
]

for t in tables:
    cursor.execute(f"DROP TABLE IF EXISTS {t};")

UserTable = """CREATE TABLE IF NOT EXISTS
User(
userid INTEGER PRIMARY KEY AUTOINCREMENT,
username TEXT UNIQUE NOT NULL,
passw TEXT NOT NULL
)"""

CharacterTable = """CREATE TABLE IF NOT EXISTS
Character(
characterid INTEGER PRIMARY KEY AUTOINCREMENT,
userid INTEGER REFERENCES User(userid),
background TEXT NOT NULL,
iscompanion INTEGER CHECK(iscompanion >= 0) DEFAULT NULL, 
name TEXT,
playername TEXT,
electrum INTEGER CHECK(electrum >= 0) DEFAULT 0,
gold INTEGER CHECK(gold >= 0) DEFAULT 0,
silver INTEGER CHECK(silver >= 0) DEFAULT 0,
copper INTEGER CHECK(copper >= 0) DEFAULT 0,
platinum INTEGER CHECK(platinum >= 0) DEFAULT 0,
ownerid INTEGER REFERENCES Character(characterid) DEFAULT NULL
)"""

StatsTable = """CREATE TABLE IF NOT EXISTS
Stats(
characterid INTEGER REFERENCES Character(characterid),
id INTEGER PRIMARY KEY AUTOINCREMENT,
inspiration INTEGER CHECK(inspiration >= 0) DEFAULT 0,
currenthitpoints INTEGER DEFAULT 0,
temporaryhitpoints INTEGER CHECK(temporaryhitpoints >= 0) DEFAULT 0,
exp INTEGER CHECK(exp >= 0) DEFAULT 0,
deathsuccesses INTEGER CHECK(deathsuccesses >= 0 AND deathsuccesses <= 3) DEFAULT 0,
deathfailures INTEGER CHECK(deathfailures >= 0 AND deathfailures <= 3) DEFAULT 0,
totalspellslotslevel1 INTEGER NOT NULL CHECK(totalspellslotslevel1 >= 0) DEFAULT 0,
totalspellslotslevel2 INTEGER NOT NULL CHECK(totalspellslotslevel2 >= 0) DEFAULT 0,
totalspellslotslevel3 INTEGER NOT NULL CHECK(totalspellslotslevel3 >= 0) DEFAULT 0,
totalspellslotslevel4 INTEGER NOT NULL CHECK(totalspellslotslevel4 >= 0) DEFAULT 0,
totalspellslotslevel5 INTEGER NOT NULL CHECK(totalspellslotslevel5 >= 0) DEFAULT 0,
totalspellslotslevel6 INTEGER NOT NULL CHECK(totalspellslotslevel6 >= 0) DEFAULT 0,
totalspellslotslevel7 INTEGER NOT NULL CHECK(totalspellslotslevel7 >= 0) DEFAULT 0,
totalspellslotslevel8 INTEGER NOT NULL CHECK(totalspellslotslevel8 >= 0) DEFAULT 0,
totalspellslotslevel9 INTEGER NOT NULL CHECK(totalspellslotslevel9 >= 0) DEFAULT 0,
usedspellslotslevel1 INTEGER NOT NULL CHECK(usedspellslotslevel1 >= 0 AND usedspellslotslevel1 <= totalspellslotslevel1) DEFAULT 0,
usedspellslotslevel2 INTEGER NOT NULL CHECK(usedspellslotslevel2 >= 0 AND usedspellslotslevel2 <= totalspellslotslevel2) DEFAULT 0,
usedspellslotslevel3 INTEGER NOT NULL CHECK(usedspellslotslevel3 >= 0 AND usedspellslotslevel3 <= totalspellslotslevel3) DEFAULT 0,
usedspellslotslevel4 INTEGER NOT NULL CHECK(usedspellslotslevel4 >= 0 AND usedspellslotslevel4 <= totalspellslotslevel4) DEFAULT 0,
usedspellslotslevel5 INTEGER NOT NULL CHECK(usedspellslotslevel5 >= 0 AND usedspellslotslevel5 <= totalspellslotslevel5) DEFAULT 0,
usedspellslotslevel6 INTEGER NOT NULL CHECK(usedspellslotslevel6 >= 0 AND usedspellslotslevel6 <= totalspellslotslevel6) DEFAULT 0,
usedspellslotslevel7 INTEGER NOT NULL CHECK(usedspellslotslevel7 >= 0 AND usedspellslotslevel7 <= totalspellslotslevel7) DEFAULT 0,
usedspellslotslevel8 INTEGER NOT NULL CHECK(usedspellslotslevel8 >= 0 AND usedspellslotslevel8 <= totalspellslotslevel8) DEFAULT 0,
usedspellslotslevel9 INTEGER NOT NULL CHECK(usedspellslotslevel9 >= 0 AND usedspellslotslevel9 <= totalspellslotslevel9) DEFAULT 0,
armorclass INTEGER NOT NULL DEFAULT 0
)"""

SkillTable = """CREATE TABLE IF NOT EXISTS
Skill(
characterid INTEGER REFERENCES Character(characterid),
name TEXT,
score INTEGER NOT NULL,
proficient INTEGER NOT NULL CHECK(proficient IN (0, 1)) DEFAULT 0,
PRIMARY KEY(characterid, name)
)"""

ClassTable = """CREATE TABLE IF NOT EXISTS
Class(
characterid INTEGER REFERENCES Character(characterid),
name TEXT,
proficiencybonus INTEGER NOT NULL CHECK(proficiencybonus >= 0),
totalhitdice INTEGER NOT NULL CHECK(totalhitdice >= 0),
currenthitdice INTEGER CHECK(currenthitdice >= 0) DEFAULT 0,
typeofhitdice INTEGER NOT NULL DEFAULt 6 CHECK(typeofhitdice IN (6, 8, 10, 12)),
maxhitpoints INTEGER NOT NULL CHECK(maxhitpoints >= 0),
classlevel INTEGER NOT NULL CHECK(classlevel >= 0),
isSpellCastingClass INTEGER NOT NULL CHECK(isSpellCastingClass IN (0, 1)) DEFAULT 0,
spellcastingability TEXT NOT NULL CHECK(spellcastingability IN ('Str', 'Dex', 'Con', 'Int', 'Wis', 'Cha')) DEFAULT 'Int',
spellcastingmodifier INTEGER NOT NULL CHECK(spellcastingmodifier >= 0),
PRIMARY KEY(characterid, name)
)"""

RaceTable = """CREATE TABLE IF NOT EXISTS
Race(
characterid INTEGER REFERENCES Character(characterid),
name TEXT,
speed INTEGER NOT NULL CHECK(speed >= 0),
PRIMARY KEY(characterid, name)
)"""

SavingThrowTable = """CREATE TABLE IF NOT EXISTS
SavingThrow(
characterid INTEGER REFERENCES Character(characterid),
name TEXT,
proficient INTEGER NOT NULL CHECK(proficient IN (0, 1)) DEFAULT 0,
score INTEGER NOT NULL,
PRIMARY KEY(characterid, name)
)"""

AbilityTable = """CREATE TABLE IF NOT EXISTS
Ability(
characterid INTEGER REFERENCES Character(characterid),
name TEXT,
score INTEGER NOT NULL,
PRIMARY KEY(characterid, name)
)
"""

FeatTable = """CREATE TABLE IF NOT EXISTS
Feat(
characterid INTEGER REFERENCES Character(characterid),
name TEXT,
description TEXT,
PRIMARY KEY(characterid, name)
)
"""
FeaturesTable = """CREATE TABLE IF NOT EXISTS
Features(
characterid INTEGER REFERENCES Character(characterid),
name TEXT,
description TEXT,
PRIMARY KEY(characterid, name)
)"""

EffectsTable = """CREATE TABLE IF NOT EXISTS
Effects(
characterid INTEGER REFERENCES Character(characterid),
name TEXT,
description TEXT,
duration TEXT,
PRIMARY KEY(characterid, name)
)"""

LoreTable = """CREATE TABLE IF NOT EXISTS
Lore(
characterid INTEGER REFERENCES Character(characterid),
id INTEGER PRIMARY KEY AUTOINCREMENT,
skin TEXT,
eye TEXT,
ideals TEXT,
bonds TEXT,
flaws TEXT,
age INTEGER CHECK(age >= 0),
personalitytraits TEXT,
weight INTEGER CHECK(weight >= 0),
height INTEGER CHECK(height >= 0),
allies TEXT,
appearance TEXT,
backstory TEXT,
hair TEXT,
alignment TEXT
)"""

ItemTable = """CREATE TABLE IF NOT EXISTS
Item(
characterid INTEGER REFERENCES Character(characterid),
itemid INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT,
description TEXT
)"""

WaterContainerTable = """CREATE TABLE IF NOT EXISTS
WaterContainer(
characterid INTEGER REFERENCES Character(characterid),
itemid INTEGER REFERENCES Item(itemid),
ozfilled INTEGER CHECK(ozfilled >= 0) DEFAULT 0
)"""

SiegeEquipmentTable = """CREATE TABLE IF NOT EXISTS
SiegeEquipment(
characterid INTEGER REFERENCES Character(characterid),
itemid INTEGER REFERENCES Item(itemid),
ac INTEGER NOT NULL,
damageimmunities TEXT,
hitpoints INTEGER NOT NULL CHECK(hitpoints >= 0)
)"""

PoisonTable = """CREATE TABLE IF NOT EXISTS
Poison(
characterid INTEGER REFERENCES Character(characterid),
itemid INTEGER REFERENCES Item(itemid),
type TEXT,
cost TEXT
)"""

AdventuringGearTable = """CREATE TABLE IF NOT EXISTS
AdventuringGear(
characterid INTEGER REFERENCES Character(characterid),
itemid INTEGER REFERENCES Item(itemid),
cost TEXT,
weight REAL CHECK(weight >= 0) DEFAULT 0.0
)""" 

WeaponTable = """CREATE TABLE IF NOT EXISTS
Weapon(
characterid INTEGER REFERENCES Character(characterid),
itemid INTEGER REFERENCES Item(itemid),
weight REAL CHECK(weight >= 0) DEFAULT 0.0,
cost TEXT,
damage TEXT
)"""

ArmorShieldTable = """CREATE TABLE IF NOT EXISTS
ArmorShield(
characterid INTEGER REFERENCES Character(characterid),
itemid INTEGER REFERENCES Item(itemid),
equipped INTEGER NOT NULL CHECK(equipped IN (0, 1)) DEFAULT 0,
weight REAL CHECK(weight >= 0) DEFAULT 0.0,
cost TEXT,
ac INTEGER NOT NULL
)"""

SpellTable = """CREATE TABLE IF NOT EXISTS
Spell(
characterid INTEGER REFERENCES Character(characterid),
itemid INTEGER REFERENCES Item(itemid),
duration TEXT,
components TEXT,
level INTEGER NOT NULL CHECK(level >= 0 AND level <= 9),
range TEXT,
castingtime TEXT,
ready INTEGER NOT NULL CHECK(ready IN (0, 1)) DEFAULT 0
)"""

ExplosiveTable = """CREATE TABLE IF NOT EXISTS
Explosive(
characterid INTEGER REFERENCES Character(characterid),
itemid INTEGER REFERENCES Item(itemid),
cost TEXT,
weight REAL CHECK(weight >= 0) DEFAULT 0.0
)"""

ToolTable = """CREATE TABLE IF NOT EXISTS
Tool(
characterid INTEGER REFERENCES Character(characterid),
itemid INTEGER REFERENCES Item(itemid),
cost TEXT,
weight REAL CHECK(weight >= 0) DEFAULT 0.0
)"""

TrinketTable = """CREATE TABLE IF NOT EXISTS
Trinket(
characterid INTEGER REFERENCES Character(characterid),
itemid INTEGER REFERENCES Item(itemid)
)"""

FirearmTable = """CREATE TABLE IF NOT EXISTS
Firearm(
characterid INTEGER REFERENCES Character(characterid),
itemid INTEGER REFERENCES Item(itemid),
cost TEXT,
damage TEXT,
weight REAL CHECK(weight >= 0) DEFAULT 0.0
)"""

OtherTable = """CREATE TABLE IF NOT EXISTS
Other(
characterid INTEGER REFERENCES Character(characterid),
itemid INTEGER REFERENCES Item(itemid),
cost TEXT,
weight REAL CHECK(weight >= 0) DEFAULT 0.0
)"""

WondrousTable = """CREATE TABLE IF NOT EXISTS
Wondrous(
characterid INTEGER REFERENCES Character(characterid),
itemid INTEGER REFERENCES Item(itemid)
)"""

RationTable = """CREATE TABLE IF NOT EXISTS
Ration(
characterid INTEGER REFERENCES Character(characterid),
itemid INTEGER REFERENCES Item(itemid),
days INTEGER NOT NULL CHECK(days >= 0) DEFAULT 0
)"""

cursor.execute("PRAGMA foreign_keys = ON;")

for t in tables:
    tryCreateTable(eval(f"{t}Table"))

connection.commit()
connection.close()