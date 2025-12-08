from flask import Flask, request, redirect, render_template, session, jsonify
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
            return render_template("login.html", error="Incorrect username or password")
            

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
            return render_template("register.html", error="Username already taken!")

    return render_template("register.html")

@app.route("/logout", methods=["GET","POST"]) #logout page
def logout():
    session.clear()
    return redirect("/")

@app.route("/list")
def list_characters():
    conn = sqlite3.connect("DnDCharacterManager.db")
    cursor = conn.cursor()

    user_id = session.get("userid")
    if not user_id:
        conn.close()
        return redirect("/login")

    # Sorting
    sort = request.args.get("sort", "name")
    direction = request.args.get("dir", "asc").lower()
    direction = "DESC" if direction == "desc" else "ASC"

    # Filters
    min_level = request.args.get("min_level", type=int)
    search = request.args.get("search", default="")  # name search

    sort_columns = {
        "id": "c.characterid",
        "name": "c.name",
        "background": "c.background",
        "race": "race_name",
        "level": "max_class_level",
        "maxhp": "total_maxhp",
        "ac": "ac",
        "gold": "c.gold",
    }
    order_by = sort_columns.get(sort, "c.name")

    params = [user_id]
    where_extra = ""
    if search:
        where_extra += " AND c.name LIKE ?"
        params.append(f"%{search}%")

    having_clause = ""
    if min_level is not None:
        having_clause = "HAVING max_class_level >= ?"
        params.append(min_level)

    cursor.execute(f"""
        SELECT
            c.characterid,
            c.name,
            c.background,
            COALESCE(r.name, 'Unknown') AS race_name,
            COALESCE(MAX(cl.classlevel), 0) AS max_class_level,
            COALESCE(SUM(cl.maxhitpoints), 0) AS total_maxhp,
            COALESCE(s.armorclass, 0) AS ac,
            c.gold,
            c.silver,
            c.electrum,
            c.copper,
            c.platinum
        FROM Character c
        LEFT JOIN Race r ON r.characterid = c.characterid
        LEFT JOIN Class cl ON cl.characterid = c.characterid
        LEFT JOIN Stats s ON s.characterid = c.characterid
        WHERE c.userid = ? AND c.iscompanion = 0
        {where_extra}
        GROUP BY
            c.characterid, c.name, c.background,
            race_name, ac,
            c.gold, c.silver, c.electrum, c.copper, c.platinum
        {having_clause}
        ORDER BY {order_by} {direction}
    """, params)
    characters = cursor.fetchall()

    # (you can leave the summary query unfiltered, or reuse min_level similarly)
    cursor.execute("""
        SELECT
            COUNT(DISTINCT c.characterid) AS char_count,
            COALESCE(AVG(cl.classlevel), 0) AS avg_level,
            COALESCE(SUM(c.gold), 0) AS total_gold
        FROM Character c
        LEFT JOIN Class cl ON cl.characterid = c.characterid
        WHERE c.userid = ? AND c.iscompanion = 0
    """, (user_id,))
    summary_row = cursor.fetchone()
    summary = {
        "char_count": summary_row[0],
        "avg_level": round(summary_row[1], 2) if summary_row[1] is not None else 0,
        "total_gold": summary_row[2],
    }

    cursor.execute("SELECT username FROM User WHERE userid = ?", (user_id,))
    username = cursor.fetchone()[0]

    conn.close()

    return render_template(
        "list.html",
        characters=characters,
        username=username,
        summary=summary,
        current_sort=sort,
        current_dir="desc" if direction == "DESC" else "asc",
        min_level=min_level,
        search=search,
    )

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

    total_water = sum(w[2] for w in containers)

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
       
    total_rations = sum(r[2] for r in rations)  

    conn.close()

    print(character, companions, stats, skills, classes, race, savingthrows, abilities, feats, features, effects, lore, items, containers, siegeequipments, poisons, adventuringgears, weapons, armorshields, spells, explosives, tools, trinkets, firearms, others, wondrous, rations)

    return render_template("character.html", character=character, companions=companions, stats=stats, skills=skills, classes=classes, race=race, savingthrows=savingthrows, abilities=abilities, feats=feats, features=features, effects=effects, lore=lore, items=items, containers=containers, siegeequipments=siegeequipments, poisons=poisons, adventuringgears=adventuringgears, weapons=weapons, armorshields=armorshields, spells=spells, explosives=explosives, tools=tools, trinkets=trinkets, firearms=firearms, others=others, wondrous=wondrous, rations=rations, total_water=total_water, total_rations=total_rations)

@app.route("/character/<int:cid>/save", methods=["POST"]) #character updating/saving in character.html
def save_character(cid):
    user_id = session.get("userid")
    if not user_id:
        return "Unauthorized", 401

    data = request.get_json(silent=True) or {}

    conn = sqlite3.connect("DnDCharacterManager.db")
    cursor = conn.cursor()

    # Ensure character belongs to user
    cursor.execute("SELECT userid FROM Character WHERE characterid = ?", (cid,))
    row = cursor.fetchone()
    if not row or row[0] != user_id:
        conn.close()
        return "Forbidden", 403

    # ---- Stats ----
    stats = data.get("stats", {})
    if stats:
        totals = stats.get("spellSlotsTotal", {}) or {}
        used   = stats.get("spellSlotsUsed", {}) or {}

        def get_total(level):
            return int(totals.get(str(level), 0))

        def get_used(level, total):
            u = int(used.get(str(level), 0))
            return min(u, total)

        t1 = get_total(1); u1 = get_used(1, t1)
        t2 = get_total(2); u2 = get_used(2, t2)
        t3 = get_total(3); u3 = get_used(3, t3)
        t4 = get_total(4); u4 = get_used(4, t4)
        t5 = get_total(5); u5 = get_used(5, t5)
        t6 = get_total(6); u6 = get_used(6, t6)
        t7 = get_total(7); u7 = get_used(7, t7)
        t8 = get_total(8); u8 = get_used(8, t8)
        t9 = get_total(9); u9 = get_used(9, t9)

        cursor.execute("""
            UPDATE Stats
            SET inspiration = ?,
                currenthitpoints = ?,
                temporaryhitpoints = ?,
                exp = ?,
                deathsuccesses = ?,
                deathfailures = ?,
                totalspellslotslevel1 = ?,
                totalspellslotslevel2 = ?,
                totalspellslotslevel3 = ?,
                totalspellslotslevel4 = ?,
                totalspellslotslevel5 = ?,
                totalspellslotslevel6 = ?,
                totalspellslotslevel7 = ?,
                totalspellslotslevel8 = ?,
                totalspellslotslevel9 = ?,
                usedspellslotslevel1 = ?,
                usedspellslotslevel2 = ?,
                usedspellslotslevel3 = ?,
                usedspellslotslevel4 = ?,
                usedspellslotslevel5 = ?,
                usedspellslotslevel6 = ?,
                usedspellslotslevel7 = ?,
                usedspellslotslevel8 = ?,
                usedspellslotslevel9 = ?
            WHERE characterid = ?
        """, (
            int(stats.get("inspiration", 0)),
            int(stats.get("currentHP", 0)),
            int(stats.get("tempHP", 0)),
            int(stats.get("exp", 0)),
            int(stats.get("deathSuccesses", 0)),
            int(stats.get("deathFailures", 0)),
            t1, t2, t3, t4, t5, t6, t7, t8, t9,
            u1, u2, u3, u4, u5, u6, u7, u8, u9,
            cid,
        ))

    # ---- Abilities ----
    for ab in data.get("abilities", []):
        cursor.execute(
            "UPDATE Ability SET score = ? WHERE characterid = ? AND name = ?",
            (int(ab.get("score", 0)), cid, ab.get("name")),
        )

    # ---- Saving Throws ----
    for st in data.get("savingThrows", []):
        cursor.execute(
            "UPDATE SavingThrow SET score = ?, proficient = ? WHERE characterid = ? AND name = ?",
            (int(st.get("score", 0)), int(st.get("proficient", 0)), cid, st.get("name")),
        )

    # ---- Skills ----
    for sk in data.get("skills", []):
        cursor.execute(
            "UPDATE Skill SET score = ?, proficient = ? WHERE characterid = ? AND name = ?",
            (int(sk.get("score", 0)), int(sk.get("proficient", 0)), cid, sk.get("name")),
        )

    # ---- Classes (replace) ----
    cursor.execute("DELETE FROM Class WHERE characterid = ?", (cid,))
    for cl in data.get("classes", []):
        name = cl.get("name") or ""
        if not name:
            continue

        cursor.execute("""
            INSERT INTO Class(
                characterid, name, proficiencybonus,
                totalhitdice, currenthitdice, typeofhitdice,
                maxhitpoints, classlevel, isSpellCastingClass,
                spellcastingability, spellcastingmodifier
            ) VALUES (?,?,?,?,?,?,?,?,?,?,?)
        """, (
            cid,
            name,
            int(cl.get("proficiencybonus", 0)),
            int(cl.get("totalhitdice", 0)),
            int(cl.get("currenthitdice", 0)),
            int(cl.get("typeofhitdice", 6)),
            int(cl.get("maxhitpoints", 0)),
            int(cl.get("classlevel", 0)),
            int(cl.get("isSpellCastingClass", 0)),
            cl.get("spellcastingability", "Int"),
            int(cl.get("spellcastingmodifier", 0)),
        ))

    # ---- Feats ----
    cursor.execute("DELETE FROM Feat WHERE characterid = ?", (cid,))
    for ft in data.get("feats", []):
        name = ft.get("name") or ""
        if not name:
            continue
        cursor.execute("""
            INSERT INTO Feat(characterid, name, description)
            VALUES(?,?,?)
        """, (cid, name, ft.get("description", "")))


    # ---- Features ----
    cursor.execute("DELETE FROM Features WHERE characterid = ?", (cid,))
    for ft in data.get("features", []):
        name = ft.get("name") or ""
        if not name:
            continue
        cursor.execute("""
            INSERT INTO Features(characterid, name, description)
            VALUES(?,?,?)
        """, (cid, name, ft.get("description", "")))


    # ---- Effects (replace full set) ----
    cursor.execute("DELETE FROM Effects WHERE characterid = ?", (cid,))
    for ef in data.get("effects", []):
        name = ef.get("name") or ""
        if not name:
            continue
        cursor.execute("""
            INSERT INTO Effects(characterid, name, description, duration)
            VALUES(?,?,?,?)
        """, (cid, name, ef.get("description", ""), ef.get("duration", "")))


    # ---- Item names & descriptions ----
    for im in data.get("itemMeta", []):
        cursor.execute(
            "UPDATE Item SET name = ?, description = ? "
            "WHERE characterid = ? AND itemid = ?",
            (
                im.get("name", ""),
                im.get("description", ""),
                cid,
                int(im.get("itemid", 0)),
            ),
        )

    # ---- Deleted Items ----
    for iid in data.get("deletedItems", []):
        try:
            item_id = int(iid)
        except (TypeError, ValueError):
            continue

        # Delete from all subtype tables that reference Item
        for tbl in [
            "WaterContainer",
            "SiegeEquipment",
            "Poison",
            "AdventuringGear",
            "Weapon",
            "ArmorShield",
            "Explosive",
            "Tool",
            "Trinket",
            "Firearm",
            "Other",
            "Wondrous",
            "Ration",
            "Spell",
        ]:
            cursor.execute(
                f"DELETE FROM {tbl} WHERE characterid = ? AND itemid = ?",
                (cid, item_id),
            )

        # Finally delete base Item row
        cursor.execute(
            "DELETE FROM Item WHERE characterid = ? AND itemid = ?",
            (cid, item_id),
        )

    # ---- Inventory: Water & Rations ----
    for w in data.get("water", []):
        cursor.execute(
            "UPDATE WaterContainer SET ozfilled = ? WHERE characterid = ? AND itemid = ?",
            (int(w.get("ozfilled", 0)), cid, int(w.get("itemid", 0))),
        )

    for r in data.get("rations", []):
        cursor.execute(
            "UPDATE Ration SET days = ? WHERE characterid = ? AND itemid = ?",
            (int(r.get("days", 0)), cid, int(r.get("itemid", 0))),
        )
    
    # ---- Siege Equipment ----
    for se in data.get("siegeEquipment", []):
        cursor.execute(
            "UPDATE SiegeEquipment SET ac = ?, damageimmunities = ?, hitpoints = ? "
            "WHERE characterid = ? AND itemid = ?",
            (
                int(se.get("ac", 0)),
                se.get("damageimmunities", ""),
                int(se.get("hitpoints", 0)),
                cid,
                int(se.get("itemid", 0)),
            ),
        )

    # ---- Poisons ----
    for p in data.get("poisons", []):
        cursor.execute(
            "UPDATE Poison SET type = ?, cost = ? "
            "WHERE characterid = ? AND itemid = ?",
            (
                p.get("type", ""),
                p.get("cost", ""),
                cid,
                int(p.get("itemid", 0)),
            ),
        )

    # ---- Adventuring Gear ----
    for g in data.get("adventuringGear", []):
        cursor.execute(
            "UPDATE AdventuringGear SET cost = ?, weight = ? "
            "WHERE characterid = ? AND itemid = ?",
            (
                g.get("cost", ""),
                float(g.get("weight", 0.0)),
                cid,
                int(g.get("itemid", 0)),
            ),
        )

    # ---- Weapons ----
    for w in data.get("weapons", []):
        cursor.execute(
            "UPDATE Weapon SET weight = ?, cost = ?, damage = ? "
            "WHERE characterid = ? AND itemid = ?",
            (
                float(w.get("weight", 0.0)),
                w.get("cost", ""),
                w.get("damage", ""),
                cid,
                int(w.get("itemid", 0)),
            ),
        )

    # ---- Armor & Shields ----
    for a in data.get("armorShields", []):
        cursor.execute(
            "UPDATE ArmorShield SET equipped = ?, weight = ?, cost = ?, ac = ? "
            "WHERE characterid = ? AND itemid = ?",
            (
                int(a.get("equipped", 0)),
                float(a.get("weight", 0.0)),
                a.get("cost", ""),
                int(a.get("ac", 0)),
                cid,
                int(a.get("itemid", 0)),
            ),
        )

    # ---- Explosives ----
    for ex in data.get("explosives", []):
        cursor.execute(
            "UPDATE Explosive SET cost = ?, weight = ? "
            "WHERE characterid = ? AND itemid = ?",
            (
                ex.get("cost", ""),
                float(ex.get("weight", 0.0)),
                cid,
                int(ex.get("itemid", 0)),
            ),
        )

    # ---- Tools ----
    for t in data.get("tools", []):
        cursor.execute(
            "UPDATE Tool SET cost = ?, weight = ? "
            "WHERE characterid = ? AND itemid = ?",
            (
                t.get("cost", ""),
                float(t.get("weight", 0.0)),
                cid,
                int(t.get("itemid", 0)),
            ),
        )

    # ---- Firearms ----
    for f in data.get("firearms", []):
        cursor.execute(
            "UPDATE Firearm SET cost = ?, damage = ?, weight = ? "
            "WHERE characterid = ? AND itemid = ?",
            (
                f.get("cost", ""),
                f.get("damage", ""),
                float(f.get("weight", 0.0)),
                cid,
                int(f.get("itemid", 0)),
            ),
        )

    # ---- Other Items ----
    for o in data.get("others", []):
        cursor.execute(
            "UPDATE Other SET cost = ?, weight = ? "
            "WHERE characterid = ? AND itemid = ?",
            (
                o.get("cost", ""),
                float(o.get("weight", 0.0)),
                cid,
                int(o.get("itemid", 0)),
            ),
        )
    
    # ---- Spells ----
    for sp in data.get("spells", []):
        cursor.execute(
            "UPDATE Spell SET duration = ?, components = ?, range = ?, castingtime = ?, ready = ? "
            "WHERE characterid = ? AND itemid = ?",
            (
                sp.get("duration", ""),
                sp.get("components", ""),
                sp.get("range", ""),
                sp.get("castingtime", ""),
                int(sp.get("ready", 0)),
                cid,
                int(sp.get("itemid", 0)),
            ),
        )

    # ---- Currency ----
    currency = data.get("currency", {})
    if currency:
        cursor.execute("""
            UPDATE Character
            SET copper = ?, silver = ?, electrum = ?, gold = ?, platinum = ?
            WHERE characterid = ?
        """, (
            int(currency.get("copper", 0)),
            int(currency.get("silver", 0)),
            int(currency.get("electrum", 0)),
            int(currency.get("gold", 0)),
            int(currency.get("platinum", 0)),
            cid,
        ))

    # ---- Lore ----
    lore = data.get("lore", {})
    if lore:
        cursor.execute("""
            UPDATE Lore
            SET skin = ?, eye = ?, ideals = ?, bonds = ?, flaws = ?,
                age = ?, personalitytraits = ?, weight = ?, height = ?,
                allies = ?, appearance = ?, backstory = ?, hair = ?, alignment = ?
            WHERE characterid = ?
        """, (
            lore.get("skin", ""),
            lore.get("eyes", ""),
            lore.get("ideals", ""),
            lore.get("bonds", ""),
            lore.get("flaws", ""),
            lore.get("age", 0),
            lore.get("traits", ""),
            lore.get("weight", 0),
            lore.get("height", 0),
            lore.get("allies", ""),
            lore.get("appearance", ""),
            lore.get("backstory", ""),
            lore.get("hair", ""),
            lore.get("alignment", ""),
            cid,
        ))

    conn.commit()
    conn.close()

    return jsonify({"status": "ok"})

@app.route("/character/<int:cid>/items", methods=["POST"]) #character item saving in character.html
def add_item(cid):
    user_id = session.get("userid")
    if not user_id:
        return "Unauthorized", 401

    data = request.get_json(silent=True) or {}
    item_type = data.get("type")
    name = (data.get("name") or "").strip()
    description = data.get("description") or ""
    extra = data.get("extra") or {}

    if not name:
        return "Name required", 400

    conn = sqlite3.connect("DnDCharacterManager.db")
    cursor = conn.cursor()

    # Ensure character belongs to user
    cursor.execute("SELECT userid FROM Character WHERE characterid = ?", (cid,))
    row = cursor.fetchone()
    if not row or row[0] != user_id:
        conn.close()
        return "Forbidden", 403

    # Base Item row
    cursor.execute(
        "INSERT INTO Item(characterid, name, description) VALUES(?,?,?)",
        (cid, name, description),
    )
    itemid = cursor.execute("SELECT last_insert_rowid()").fetchone()[0]

    # Subtable per type
    if item_type == "Container":
        oz = int(extra.get("ozfilled", 0))
        cursor.execute(
            "INSERT INTO WaterContainer(characterid, itemid, ozfilled) VALUES(?,?,?)",
            (cid, itemid, oz),
        )
    elif item_type == "SiegeEquipment":
        ac = int(extra.get("ac", 0))
        hp = int(extra.get("hitpoints", 0))
        dmgimm = extra.get("damageimmunities", "")
        cursor.execute(
            "INSERT INTO SiegeEquipment(characterid, itemid, ac, damageimmunities, hitpoints) VALUES(?,?,?,?,?)",
            (cid, itemid, ac, dmgimm, hp),
        )
    elif item_type == "Poison":
        ptype = extra.get("type", "")
        cost = extra.get("cost", "")
        cursor.execute(
            "INSERT INTO Poison(characterid, itemid, type, cost) VALUES(?,?,?,?)",
            (cid, itemid, ptype, cost),
        )
    elif item_type == "AdventuringGear":
        cost = extra.get("cost", "")
        weight = float(extra.get("weight", 0.0))
        cursor.execute(
            "INSERT INTO AdventuringGear(characterid, itemid, cost, weight) VALUES(?,?,?,?)",
            (cid, itemid, cost, weight),
        )
    elif item_type == "Weapon":
        weight = float(extra.get("weight", 0.0))
        cost = extra.get("cost", "")
        damage = extra.get("damage", "")
        cursor.execute(
            "INSERT INTO Weapon(characterid, itemid, weight, cost, damage) VALUES(?,?,?,?,?)",
            (cid, itemid, weight, cost, damage),
        )
    elif item_type == "Armor&Shield":
        cost = extra.get("cost", "")
        weight = float(extra.get("weight", 0.0))
        ac = int(extra.get("ac", 0))
        equipped = int(extra.get("equipped", 0))
        cursor.execute(
            "INSERT INTO ArmorShield(characterid, itemid, equipped, weight, cost, ac) VALUES(?,?,?,?,?,?)",
            (cid, itemid, equipped, weight, cost, ac),
        )
    elif item_type == "Explosive":
        cost = extra.get("cost", "")
        weight = float(extra.get("weight", 0.0))
        cursor.execute(
            "INSERT INTO Explosive(characterid, itemid, cost, weight) VALUES(?,?,?,?)",
            (cid, itemid, cost, weight),
        )
    elif item_type == "Tools":
        cost = extra.get("cost", "")
        weight = float(extra.get("weight", 0.0))
        cursor.execute(
            "INSERT INTO Tool(characterid, itemid, cost, weight) VALUES(?,?,?,?)",
            (cid, itemid, cost, weight),
        )
    elif item_type == "Trinket":
        cursor.execute(
            "INSERT INTO Trinket(characterid, itemid) VALUES(?,?)",
            (cid, itemid),
        )
    elif item_type == "Firearm":
        cost = extra.get("cost", "")
        damage = extra.get("damage", "")
        weight = float(extra.get("weight", 0.0))
        cursor.execute(
            "INSERT INTO Firearm(characterid, itemid, cost, damage, weight) VALUES(?,?,?,?,?)",
            (cid, itemid, cost, damage, weight),
        )
    elif item_type == "Other":
        cost = extra.get("cost", "")
        weight = float(extra.get("weight", 0.0))
        cursor.execute(
            "INSERT INTO Other(characterid, itemid, cost, weight) VALUES(?,?,?,?)",
            (cid, itemid, cost, weight),
        )
    elif item_type == "Wondrous":
        cursor.execute(
            "INSERT INTO Wondrous(characterid, itemid) VALUES(?,?)",
            (cid, itemid),
        )
    elif item_type == "Ration":
        days = int(extra.get("days", 0))
        cursor.execute(
            "INSERT INTO Ration(characterid, itemid, days) VALUES(?,?,?)",
            (cid, itemid, days),
        )
    elif item_type == "Spells":
        duration = extra.get("duration", "")
        components = extra.get("components", "")
        level = int(extra.get("level", 0))
        rng = extra.get("range", "")
        castingtime = extra.get("castingtime", "")
        cursor.execute(
            "INSERT INTO Spell(characterid, itemid, duration, components, level, range, castingtime) VALUES(?,?,?,?,?,?,?)",
            (cid, itemid, duration, components, level, rng, castingtime),
        )

    conn.commit()
    conn.close()

    return jsonify({"status": "ok", "itemid": itemid})

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
        spellCastingClassFlags = request.form.getlist('isSpellcastingClass')

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

        spcf_flags = []
        i = 0
        while i < len(spellCastingClassFlags):
            if spellCastingClassFlags[i] == 'off' and i+1 < len(spellCastingClassFlags) and spellCastingClassFlags[i+1] == 'on':
                spcf_flags.append(1)
                i += 2
            else:
                spcf_flags.append(0)
                i += 1

        for cn, pb, hd, mhp, lvl, sm, spcf in zip(className, profBonus, hitDice, maxHP, levelInput, spellMod, spcf_flags):
            cursor.execute("""INSERT INTO Class(characterid, name, proficiencybonus, totalhitdice, currenthitdice, maxhitpoints, classlevel, isSpellCastingClass, spellcastingmodifier) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""", (characterid, cn, pb, hd, hd, mhp, lvl, spcf, sm))

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

        containerIdx = siegeIdx = poisonIdx = gearIdx = weaponIdx = armorIdx = explosiveIdx = toolIdx = firearmIdx = otherIdx = rationIdx = spellIdx = 0

        for idx in range(len(itemTypes)):
            cursor.execute("INSERT INTO Item(characterid, name, description) VALUES(?,?,?)", (characterid, itemNames[idx], itemDescriptions[idx]))
            itemId = cursor.execute("SELECT last_insert_rowid()").fetchone()[0]

            if itemTypes[idx] == 'Container': cursor.execute("INSERT INTO WaterContainer(characterid, itemid, ozfilled) VALUES(?,?,?)", (characterid, itemId, ozFilledOfWaters[containerIdx])); containerIdx += 1
            elif itemTypes[idx] == 'SiegeEquipment': cursor.execute("INSERT INTO SiegeEquipment(characterid, itemid, ac, damageimmunities, hitpoints) VALUES(?,?,?,?,?)", (characterid, itemId, siegeACs[siegeIdx], siegeDamageImmunities[siegeIdx], siegeHPs[siegeIdx])); siegeIdx += 1
            elif itemTypes[idx] == 'Poison': cursor.execute("INSERT INTO Poison(characterid, itemid, type, cost) VALUES(?,?,?,?)", (characterid, itemId, poisonTypes[poisonIdx], poisonCosts[poisonIdx])); poisonIdx += 1
            elif itemTypes[idx] == 'AdventuringGear': cursor.execute("INSERT INTO AdventuringGear(characterid, itemid, cost, weight) VALUES(?,?,?,?)", (characterid, itemId, adventuringGearCosts[gearIdx], adventuringGearWeights[gearIdx])); gearIdx += 1
            elif itemTypes[idx] == 'Weapon': cursor.execute("INSERT INTO Weapon(characterid, itemid, weight, cost, damage) VALUES(?,?,?,?,?)", (characterid, itemId, weaponWeights[weaponIdx], weaponCosts[weaponIdx], weaponDamages[weaponIdx])); weaponIdx += 1
            elif itemTypes[idx] == 'Armor&Shield': cursor.execute("INSERT INTO ArmorShield(characterid, itemid, weight, cost, ac, equipped) VALUES(?,?,?,?,?,?)", (characterid, itemId, armorShieldWeights[armorIdx], armorShieldCosts[armorIdx], armorShieldAcs[armorIdx], 1 if (armorIdx < len(armorShieldEquippeds) and armorShieldEquippeds[armorIdx] == 'on') else 0)); armorIdx += 1
            elif itemTypes[idx] == 'Explosive': cursor.execute("INSERT INTO Explosive(characterid, itemid, weight, cost) VALUES(?,?,?,?)", (characterid, itemId, explosiveWeights[explosiveIdx], explosiveCosts[explosiveIdx])); explosiveIdx += 1
            elif itemTypes[idx] == 'Tools': cursor.execute("INSERT INTO Tool(characterid, itemid, weight, cost) VALUES(?,?,?,?)", (characterid, itemId, toolWeights[toolIdx], toolCosts[toolIdx])); toolIdx += 1
            elif itemTypes[idx] == 'Trinket': cursor.execute("INSERT INTO Trinket(characterid, itemid) VALUES(?,?)", (characterid, itemId))
            elif itemTypes[idx] == 'Firearm': cursor.execute("INSERT INTO Firearm(characterid, itemid, weight, cost, damage) VALUES(?,?,?,?,?)", (characterid, itemId, firearmWeights[firearmIdx], firearmCosts[firearmIdx], firearmDamages[firearmIdx])); firearmIdx += 1
            elif itemTypes[idx] == 'Other': cursor.execute("INSERT INTO Other(characterid, itemid, weight, cost) VALUES(?,?,?,?)", (characterid, itemId, otherWeights[otherIdx], otherCosts[otherIdx])); otherIdx += 1
            elif itemTypes[idx] == 'Wondrous': cursor.execute("INSERT INTO Wondrous(characterid, itemid) VALUES(?,?)", (characterid, itemId))
            elif itemTypes[idx] == 'Ration': cursor.execute("INSERT INTO Ration(characterid, itemid, days) VALUES(?,?,?)", (characterid, itemId, rationCounts[rationIdx])); rationIdx += 1
            elif itemTypes[idx] == 'Spells': cursor.execute("INSERT INTO Spell(characterid, itemid, duration, components, level, range, castingtime) VALUES(?,?,?,?,?,?,?)", (characterid, itemId, spellDurations[spellIdx], spellComponents[spellIdx], spellLevels[spellIdx], spellRanges[spellIdx], spellCastingTimes[spellIdx])); spellIdx += 1

        conn.commit()
        cursor.close()

        return redirect('/list')
        
    return render_template("charactercreation.html")

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8080, debug=True)