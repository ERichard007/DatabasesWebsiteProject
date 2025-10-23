const { PDFDocument } = PDFLib

function SetCharacterSheetFields(form) {
    // Dictionary of all form field names
    const formFieldDict = {
        "ClassLevel": form.getTextField("ClassLevel"),
        "Background": form.getTextField("Background"),
        "PlayerName": form.getTextField("PlayerName"),
        "CharacterName": form.getTextField("CharacterName"),
        "Race": form.getTextField("Race "),
        "Alignment": form.getTextField("Alignment"),
        "XP": form.getTextField("XP"),
        "Inspiration": form.getTextField("Inspiration"),
        "STR": form.getTextField("STR"),
        "ProfBonus": form.getTextField("ProfBonus"),
        "AC": form.getTextField("AC"),
        "Initiative": form.getTextField("Initiative"),
        "Speed": form.getTextField("Speed"),
        "PersonalityTraits": form.getTextField("PersonalityTraits "),
        "STRmod": form.getTextField("STRmod"),
        "HPMax": form.getTextField("HPMax"),
        "ST Strength": form.getTextField("ST Strength"),
        "DEX": form.getTextField("DEX"),
        "HPCurrent": form.getTextField("HPCurrent"),
        "Ideals": form.getTextField("Ideals"),
        "DEXmod": form.getTextField("DEXmod "),
        "HPTemp": form.getTextField("HPTemp"),
        "Bonds": form.getTextField("Bonds"),
        "CON": form.getTextField("CON"),
        "HDTotal": form.getTextField("HDTotal"),
        "Check Box 12": form.getCheckBox("Check Box 12"),
        "Check Box 13": form.getCheckBox("Check Box 13"),
        "Check Box 14": form.getCheckBox("Check Box 14"),
        "CONmod": form.getTextField("CONmod"),
        "Check Box 15": form.getCheckBox("Check Box 15"),
        "Check Box 16": form.getCheckBox("Check Box 16"),
        "Check Box 17": form.getCheckBox("Check Box 17"),
        "HD": form.getTextField("HD"),
        "Flaws": form.getTextField("Flaws"),
        "INT": form.getTextField("INT"),
        "ST Dexterity": form.getTextField("ST Dexterity"),
        "ST Constitution": form.getTextField("ST Constitution"),
        "ST Intelligence": form.getTextField("ST Intelligence"),
        "ST Wisdom": form.getTextField("ST Wisdom"),
        "ST Charisma": form.getTextField("ST Charisma"),
        "Acrobatics": form.getTextField("Acrobatics"),
        "Animal": form.getTextField("Animal"),
        "Athletics": form.getTextField("Athletics"),
        "Deception": form.getTextField("Deception "),
        "History": form.getTextField("History "),
        "Insight": form.getTextField("Insight"),
        "Intimidation": form.getTextField("Intimidation"),
        "Check Box 11": form.getCheckBox("Check Box 11"),
        "Check Box 18": form.getCheckBox("Check Box 18"),
        "Check Box 19": form.getCheckBox("Check Box 19"),
        "Check Box 20": form.getCheckBox("Check Box 20"),
        "Check Box 21": form.getCheckBox("Check Box 21"),
        "Check Box 22": form.getCheckBox("Check Box 22"),
        "Wpn Name": form.getTextField("Wpn Name"),
        "Wpn1 AtkBonus": form.getTextField("Wpn1 AtkBonus"),
        "Wpn1 Damage": form.getTextField("Wpn1 Damage"),
        "INTmod": form.getTextField("INTmod"),
        "Wpn Name 2": form.getTextField("Wpn Name 2"),
        "Wpn2 AtkBonus": form.getTextField("Wpn2 AtkBonus "),
        "Wpn2 Damage": form.getTextField("Wpn2 Damage "),
        "Investigation": form.getTextField("Investigation "),
        "WIS": form.getTextField("WIS"),
        "Wpn Name 3": form.getTextField("Wpn Name 3"),
        "Wpn3 AtkBonus": form.getTextField("Wpn3 AtkBonus  "),
        "Arcana": form.getTextField("Arcana"),
        "Wpn3 Damage": form.getTextField("Wpn3 Damage "),
        "Perception": form.getTextField("Perception "),
        "WISmod": form.getTextField("WISmod"),
        "CHA": form.getTextField("CHA"),
        "Nature": form.getTextField("Nature"),
        "Performance": form.getTextField("Performance"),
        "Medicine": form.getTextField("Medicine"),
        "Religion": form.getTextField("Religion"),
        "Stealth": form.getTextField("Stealth "),
        "Check Box 23": form.getCheckBox("Check Box 23"),
        "Check Box 24": form.getCheckBox("Check Box 24"),
        "Check Box 25": form.getCheckBox("Check Box 25"),
        "Check Box 26": form.getCheckBox("Check Box 26"),
        "Check Box 27": form.getCheckBox("Check Box 27"),
        "Check Box 28": form.getCheckBox("Check Box 28"),
        "Check Box 29": form.getCheckBox("Check Box 29"),
        "Check Box 30": form.getCheckBox("Check Box 30"),
        "Check Box 31": form.getCheckBox("Check Box 31"),
        "Check Box 32": form.getCheckBox("Check Box 32"),
        "Check Box 33": form.getCheckBox("Check Box 33"),
        "Check Box 34": form.getCheckBox("Check Box 34"),
        "Check Box 35": form.getCheckBox("Check Box 35"),
        "Check Box 36": form.getCheckBox("Check Box 36"),
        "Check Box 37": form.getCheckBox("Check Box 37"),
        "Check Box 38": form.getCheckBox("Check Box 38"),
        "Check Box 39": form.getCheckBox("Check Box 39"),
        "Check Box 40": form.getCheckBox("Check Box 40"),
        "Persuasion": form.getTextField("Persuasion"),
        "SleightofHand": form.getTextField("SleightofHand"),
        "CHamod": form.getTextField("CHamod"),
        "Survival": form.getTextField("Survival"),
        "AttacksSpellcasting": form.getTextField("AttacksSpellcasting"),
        "Passive": form.getTextField("Passive"),
        "CP": form.getTextField("CP"),
        "ProficienciesLang": form.getTextField("ProficienciesLang"),
        "SP": form.getTextField("SP"),
        "EP": form.getTextField("EP"),
        "GP": form.getTextField("GP"),
        "PP": form.getTextField("PP"),
        "Equipment": form.getTextField("Equipment"),
        "Features and Traits": form.getTextField("Features and Traits"),
        "CharacterName 2": form.getTextField("CharacterName 2"),
        "Age": form.getTextField("Age"),
        "Height": form.getTextField("Height"),
        "Weight": form.getTextField("Weight"),
        "Eyes": form.getTextField("Eyes"),
        "Skin": form.getTextField("Skin"),
        "Hair": form.getTextField("Hair"),
        "Faction Symbol Image": form.getButton("Faction Symbol Image"),
        "Allies": form.getTextField("Allies"),  
        "FactionName": form.getTextField("FactionName"),
        "Backstory": form.getTextField("Backstory"),
        "Feat+Traits": form.getTextField("Feat+Traits"),
        "Treasure": form.getTextField("Treasure"),
        "CHARACTER IMAGE": form.getButton("CHARACTER IMAGE"),
        "Spellcasting Class 2": form.getTextField("Spellcasting Class 2"),
        "SpellcastingAbility 2": form.getTextField("SpellcastingAbility 2"),
        "SpellSaveDC  2": form.getTextField("SpellSaveDC  2"),
        "SpellAtkBonus 2": form.getTextField("SpellAtkBonus 2"),
        "SlotsTotal 19": form.getTextField("SlotsTotal 19"),
        "SlotsRemaining 19": form.getTextField("SlotsRemaining 19"),
        "Spells 1014": form.getTextField("Spells 1014"),
        "Spells 1015": form.getTextField("Spells 1015"),
        "Spells 1016": form.getTextField("Spells 1016"),
        "Spells 1017": form.getTextField("Spells 1017"),
        "Spells 1018": form.getTextField("Spells 1018"),
        "Spells 1019": form.getTextField("Spells 1019"),
        "Spells 1020": form.getTextField("Spells 1020"),
        "Spells 1021": form.getTextField("Spells 1021"),
        "Spells 1022": form.getTextField("Spells 1022"),
        "Check Box 314": form.getCheckBox("Check Box 314"),
        "Check Box 3031": form.getCheckBox("Check Box 3031"),
        "Check Box 3032": form.getCheckBox("Check Box 3032"),
        "Check Box 3033": form.getCheckBox("Check Box 3033"),
        "Check Box 3034": form.getCheckBox("Check Box 3034"),
        "Check Box 3035": form.getCheckBox("Check Box 3035"),
        "Check Box 3036": form.getCheckBox("Check Box 3036"),
        "Check Box 3037": form.getCheckBox("Check Box 3037"),
        "Check Box 3038": form.getCheckBox("Check Box 3038"),
        "Check Box 3039": form.getCheckBox("Check Box 3039"),
        "Check Box 3040": form.getCheckBox("Check Box 3040"),
        "Check Box 321": form.getCheckBox("Check Box 321"),
        "Check Box 320": form.getCheckBox("Check Box 320"),
        "Check Box 3060": form.getCheckBox("Check Box 3060"),
        "Check Box 3061": form.getCheckBox("Check Box 3061"),
        "Check Box 3062": form.getCheckBox("Check Box 3062"),
        "Check Box 3063": form.getCheckBox("Check Box 3063"),
        "Check Box 3064": form.getCheckBox("Check Box 3064"),
        "Check Box 3065": form.getCheckBox("Check Box 3065"),
        "Check Box 3066": form.getCheckBox("Check Box 3066"),
        "Check Box 315": form.getCheckBox("Check Box 315"),
        "Check Box 3041": form.getCheckBox("Check Box 3041"),
        "Spells 1023": form.getTextField("Spells 1023"),
        "Check Box 251": form.getCheckBox("Check Box 251"),
        "Check Box 309": form.getCheckBox("Check Box 309"),
        "Check Box 3010": form.getCheckBox("Check Box 3010"),
        "Check Box 3011": form.getCheckBox("Check Box 3011"),
        "Check Box 3012": form.getCheckBox("Check Box 3012"),
        "Check Box 3013": form.getCheckBox("Check Box 3013"),
        "Check Box 3014": form.getCheckBox("Check Box 3014"),
        "Check Box 3015": form.getCheckBox("Check Box 3015"),
        "Check Box 3016": form.getCheckBox("Check Box 3016"),
        "Check Box 3017": form.getCheckBox("Check Box 3017"),
        "Check Box 3018": form.getCheckBox("Check Box 3018"),
        "Check Box 3019": form.getCheckBox("Check Box 3019"),
        "Spells 1024": form.getTextField("Spells 1024"),
        "Spells 1025": form.getTextField("Spells 1025"),
        "Spells 1026": form.getTextField("Spells 1026"),
        "Spells 1027": form.getTextField("Spells 1027"),
        "Spells 1028": form.getTextField("Spells 1028"),
        "Spells 1029": form.getTextField("Spells 1029"),
        "Spells 1030": form.getTextField("Spells 1030"),
        "Spells 1031": form.getTextField("Spells 1031"),
        "Spells 1032": form.getTextField("Spells 1032"),
        "Spells 1033": form.getTextField("Spells 1033"),
        "SlotsTotal 20": form.getTextField("SlotsTotal 20"),
        "SlotsRemaining 20": form.getTextField("SlotsRemaining 20"),
        "Spells 1034": form.getTextField("Spells 1034"),
        "Spells 1035": form.getTextField("Spells 1035"),
        "Spells 1036": form.getTextField("Spells 1036"),
        "Spells 1037": form.getTextField("Spells 1037"),
        "Spells 1038": form.getTextField("Spells 1038"),
        "Spells 1039": form.getTextField("Spells 1039"),
        "Spells 1040": form.getTextField("Spells 1040"),
        "Spells 1041": form.getTextField("Spells 1041"),
        "Spells 1042": form.getTextField("Spells 1042"),
        "Spells 1043": form.getTextField("Spells 1043"),
        "Spells 1044": form.getTextField("Spells 1044"),
        "Spells 1045": form.getTextField("Spells 1045"),
        "Spells 1046": form.getTextField("Spells 1046"),
        "SlotsTotal 21": form.getTextField("SlotsTotal 21"),
        "SlotsRemaining 21": form.getTextField("SlotsRemaining 21"),
        "Spells 1047": form.getTextField("Spells 1047"),
        "Spells 1048": form.getTextField("Spells 1048"),
        "Spells 1049": form.getTextField("Spells 1049"),
        "Spells 1050": form.getTextField("Spells 1050"),
        "Spells 1051": form.getTextField("Spells 1051"),
        "Spells 1052": form.getTextField("Spells 1052"),
        "Spells 1053": form.getTextField("Spells 1053"),
        "Spells 1054": form.getTextField("Spells 1054"),
        "Spells 1055": form.getTextField("Spells 1055"),
        "Spells 1056": form.getTextField("Spells 1056"),
        "Spells 1057": form.getTextField("Spells 1057"),
        "Spells 1058": form.getTextField("Spells 1058"),
        "Spells 1059": form.getTextField("Spells 1059"),
        "SlotsTotal 22": form.getTextField("SlotsTotal 22"),
        "SlotsRemaining 22": form.getTextField("SlotsRemaining 22"),
        "Spells 1060": form.getTextField("Spells 1060"),
        "Spells 1061": form.getTextField("Spells 1061"),
        "Spells 1062": form.getTextField("Spells 1062"),
        "Spells 1063": form.getTextField("Spells 1063"),
        "Spells 1064": form.getTextField("Spells 1064"),
        "Check Box 323": form.getCheckBox("Check Box 323"),
        "Check Box 322": form.getCheckBox("Check Box 322"),
        "Check Box 3067": form.getCheckBox("Check Box 3067"),
        "Check Box 3068": form.getCheckBox("Check Box 3068"),
        "Check Box 3069": form.getCheckBox("Check Box 3069"),
        "Check Box 3070": form.getCheckBox("Check Box 3070"),
        "Check Box 3071": form.getCheckBox("Check Box 3071"),
        "Check Box 3072": form.getCheckBox("Check Box 3072"),
        "Check Box 3073": form.getCheckBox("Check Box 3073"),
        "Spells 1065": form.getTextField("Spells 1065"),
        "Spells 1066": form.getTextField("Spells 1066"),
        "Spells 1067": form.getTextField("Spells 1067"),
        "Spells 1068": form.getTextField("Spells 1068"),
        "Spells 1069": form.getTextField("Spells 1069"),
        "Spells 1070": form.getTextField("Spells 1070"),
        "Spells 1071": form.getTextField("Spells 1071"),
        "Check Box 317": form.getCheckBox("Check Box 317"),
        "Spells 1072": form.getTextField("Spells 1072"),
        "SlotsTotal 23": form.getTextField("SlotsTotal 23"),
        "SlotsRemaining 23": form.getTextField("SlotsRemaining 23"),
        "Spells 1073": form.getTextField("Spells 1073"),
        "Spells 1074": form.getTextField("Spells 1074"),
        "Spells 1075": form.getTextField("Spells 1075"),
        "Spells 1076": form.getTextField("Spells 1076"),
        "Spells 1077": form.getTextField("Spells 1077"),
        "Spells 1078": form.getTextField("Spells 1078"),
        "Spells 1079": form.getTextField("Spells 1079"),
        "Spells 1080": form.getTextField("Spells 1080"),
        "Spells 1081": form.getTextField("Spells 1081"),
        "SlotsTotal 24": form.getTextField("SlotsTotal 24"),
        "SlotsRemaining 24": form.getTextField("SlotsRemaining 24"),
        "Spells 1082": form.getTextField("Spells 1082"),
        "Spells 1083": form.getTextField("Spells 1083"),
        "Spells 1084": form.getTextField("Spells 1084"),
        "Spells 1085": form.getTextField("Spells 1085"),
        "Spells 1086": form.getTextField("Spells 1086"),
        "Spells 1087": form.getTextField("Spells 1087"),
        "Spells 1088": form.getTextField("Spells 1088"),
        "Spells 1089": form.getTextField("Spells 1089"),
        "Spells 1090": form.getTextField("Spells 1090"),
        "SlotsTotal 25": form.getTextField("SlotsTotal 25"),
        "SlotsRemaining 25": form.getTextField("SlotsRemaining 25"),
        "Spells 1091": form.getTextField("Spells 1091"),
        "Spells 1092": form.getTextField("Spells 1092"),
        "Spells 1093": form.getTextField("Spells 1093"),
        "Spells 1094": form.getTextField("Spells 1094"),
        "Spells 1095": form.getTextField("Spells 1095"),
        "Spells 1096": form.getTextField("Spells 1096"),
        "Spells 1097": form.getTextField("Spells 1097"),
        "Spells 1098": form.getTextField("Spells 1098"),
        "Spells 1099": form.getTextField("Spells 1099"),
        "SlotsTotal 26": form.getTextField("SlotsTotal 26"),
        "SlotsRemaining 26": form.getTextField("SlotsRemaining 26"),
        "Spells 10100": form.getTextField("Spells 10100"),
        "Spells 10101": form.getTextField("Spells 10101"),
        "Spells 10102": form.getTextField("Spells 10102"),
        "Spells 10103": form.getTextField("Spells 10103"),
        "Check Box 316": form.getCheckBox("Check Box 316"),
        "Check Box 3042": form.getCheckBox("Check Box 3042"),
        "Check Box 3043": form.getCheckBox("Check Box 3043"),
        "Check Box 3044": form.getCheckBox("Check Box 3044"),
        "Check Box 3045": form.getCheckBox("Check Box 3045"),
        "Check Box 3046": form.getCheckBox("Check Box 3046"),
        "Check Box 3047": form.getCheckBox("Check Box 3047"),
        "Check Box 3048": form.getCheckBox("Check Box 3048"),
        "Check Box 3049": form.getCheckBox("Check Box 3049"),
        "Check Box 3050": form.getCheckBox("Check Box 3050"),
        "Check Box 3051": form.getCheckBox("Check Box 3051"),
        "Check Box 3052": form.getCheckBox("Check Box 3052"),
        "Spells 10104": form.getTextField("Spells 10104"),
        "Check Box 325": form.getCheckBox("Check Box 325"),
        "Check Box 324": form.getCheckBox("Check Box 324"),
        "Check Box 3074": form.getCheckBox("Check Box 3074"),
        "Check Box 3075": form.getCheckBox("Check Box 3075"),
        "Check Box 3076": form.getCheckBox("Check Box 3076"),
        "Check Box 3077": form.getCheckBox("Check Box 3077"),
        "Spells 10105": form.getTextField("Spells 10105"),
        "Spells 10106": form.getTextField("Spells 10106"),
        "Check Box 3078": form.getCheckBox("Check Box 3078"),
        "SlotsTotal 27": form.getTextField("SlotsTotal 27"),
        "SlotsRemaining 27": form.getTextField("SlotsRemaining 27"),
        "Check Box 313": form.getCheckBox("Check Box 313"),
        "Check Box 310": form.getCheckBox("Check Box 310"),
        "Check Box 3020": form.getCheckBox("Check Box 3020"),
        "Check Box 3021": form.getCheckBox("Check Box 3021"),
        "Check Box 3022": form.getCheckBox("Check Box 3022"),
        "Check Box 3023": form.getCheckBox("Check Box 3023"),
        "Check Box 3024": form.getCheckBox("Check Box 3024"),
        "Check Box 3025": form.getCheckBox("Check Box 3025"),
        "Check Box 3026": form.getCheckBox("Check Box 3026"),
        "Check Box 3027": form.getCheckBox("Check Box 3027"),
        "Check Box 3028": form.getCheckBox("Check Box 3028"),
        "Check Box 3029": form.getCheckBox("Check Box 3029"),
        "Check Box 3030": form.getCheckBox("Check Box 3030"),
        "Spells 10107": form.getTextField("Spells 10107"),
        "Spells 10108": form.getTextField("Spells 10108"),
        "Spells 10109": form.getTextField("Spells 10109"),
        "Spells 101010": form.getTextField("Spells 101010"),
        "Spells 101011": form.getTextField("Spells 101011"),
        "Spells 101012": form.getTextField("Spells 101012"),
        "Check Box 319": form.getCheckBox("Check Box 319"),
        "Check Box 318": form.getCheckBox("Check Box 318"),
        "Check Box 3053": form.getCheckBox("Check Box 3053"),
        "Check Box 3054": form.getCheckBox("Check Box 3054"),
        "Check Box 3055": form.getCheckBox("Check Box 3055"),
        "Check Box 3056": form.getCheckBox("Check Box 3056"),
        "Check Box 3057": form.getCheckBox("Check Box 3057"),
        "Check Box 3058": form.getCheckBox("Check Box 3058"),
        "Check Box 3059": form.getCheckBox("Check Box 3059"),
        "Check Box 327": form.getCheckBox("Check Box 327"),
        "Check Box 326": form.getCheckBox("Check Box 326"),
        "Check Box 3079": form.getCheckBox("Check Box 3079"),
        "Check Box 3080": form.getCheckBox("Check Box 3080"),
        "Check Box 3081": form.getCheckBox("Check Box 3081"),
        "Check Box 3082": form.getCheckBox("Check Box 3082"),
        "Spells 101013": form.getTextField("Spells 101013"),
        "Check Box 3083": form.getCheckBox("Check Box 3083")
    };

    //formFieldDict.CharacterName.setText(character.CharacterName) Need this
    formFieldDict.ClassLevel.setText(`${character.class} ${character.level}`)
    //formFieldDict.Background.setText(character.background) Need this
    formFieldDict.PlayerName.setText(character.player_name)
    formFieldDict.Race.setText(character.Race)
    formFieldDict.Alignment.setText(character.Alignment)
    //formFieldDict.XP.setText(character.XP) Need to fix this with some function depending on level
   
    formFieldDict.STR.setText(character.ability_scores[0].STR.toString())
    formFieldDict.STRmod.setText(character.ability_scores[0].bonus > 0 ? `+${character.ability_scores[0].bonus.toString()}` : character.ability_scores[0].bonus.toString())
    formFieldDict.DEX.setText(character.ability_scores[1].DEX.toString())
    formFieldDict.DEXmod.setText(character.ability_scores[1].bonus > 0 ? `+${character.ability_scores[1].bonus.toString()}` : character.ability_scores[1].bonus.toString())
    formFieldDict.CON.setText(character.ability_scores[2].CON.toString())
    formFieldDict.CONmod.setText((character.ability_scores[2].bonus > 0 ? `+${character.ability_scores[2].bonus.toString()}` : character.ability_scores[2].bonus.toString()))
    formFieldDict.INT.setText(character.ability_scores[3].INT.toString())
    formFieldDict.INTmod.setText((character.ability_scores[3].bonus > 0 ? `+${character.ability_scores[3].bonus.toString()}` : character.ability_scores[3].bonus.toString()))
    formFieldDict.WIS.setText(character.ability_scores[4].WIS.toString())
    formFieldDict.WISmod.setText((character.ability_scores[4].bonus > 0 ? `+${character.ability_scores[4].bonus.toString()}` : character.ability_scores[4].bonus.toString()))
    formFieldDict.CHA.setText(character.ability_scores[5].CHA.toString())
    formFieldDict.CHamod.setText((character.ability_scores[5].bonus > 0 ? `+${character.ability_scores[5].bonus.toString()}` : character.ability_scores[5].bonus.toString()))

    formFieldDict.Inspiration.setText(character.inspiration.toString())
    //formFieldDict.ProfBonus.setText(character.proficiency_bonus.toString()) Need to get proficiency bonus still
    /* Need to set saving throws up (very simple)
    formFieldDict["ST Strength"].setText(character.saving_throws[0].bonus > 0 ? `+${character.saving_throws[0].bonus.toString()}` : character.saving_throws[0].bonus.toString())
    formFieldDict["ST Dexterity"].setText(character.saving_throws[1].bonus > 0 ? `+${character.saving_throws[1].bonus.toString()}` : character.saving_throws[1].bonus.toString())
    formFieldDict["ST Constitution"].setText(character.saving_throws[2].bonus > 0 ? `+${character.saving_throws[2].bonus.toString()}` : character.saving_throws[2].bonus.toString())
    formFieldDict["ST Intelligence"].setText(character.saving_throws[3].bonus > 0 ? `+${character.saving_throws[3].bonus.toString()}` : character.saving_throws[3].bonus.toString())
    formFieldDict["ST Wisdom"].setText(character.saving_throws[4].bonus > 0 ? `+${character.saving_throws[4].bonus.toString()}` : character.s
    */
    formFieldDict["Check Box 11"].checked = character.saving_throws[0].proficient
    formFieldDict["Check Box 18"].checked = character.saving_throws[1].proficient
    formFieldDict["Check Box 19"].checked = character.saving_throws[2].proficient
    formFieldDict["Check Box 20"].checked = character.saving_throws[3].proficient
    formFieldDict["Check Box 21"].checked = character.saving_throws[4].proficient
    formFieldDict["Check Box 22"].checked = character.saving_throws[5].proficient

    /*
    formFieldDict.Acrobatics.setText(character.skills[0].Acrobatics.toString())
    formFieldDict["Check Box 23"].checked = character.skills[0].proficient
    formFieldDict.Animal.setText(character.skills[1]["Animal Handling"].toString())
    formFieldDict["Check Box 24"].checked = character.skills[1].proficient
    formFieldDict.Arcana.setText(character.skills[2].Arcana.toString())
    formFieldDict["Check Box 25"].checked = character.skills[2].proficient
    formFieldDict.Athletics.setText(character.skills[3].Athletics.toString())
    formFieldDict["Check Box 26"].checked = character.skills[3].proficient
    formFieldDict.Deception.setText(character.skills[4].Deception.toString())
    formFieldDict["Check Box 27"].checked = character.skills[4].proficient
    formFieldDict.History.setText(character.skills[5].History.toString())
    formFieldDict["Check Box 28"].checked = character.skills[5].proficient
    formFieldDict.Insight.setText(character.skills[6].Insight.toString())
    formFieldDict["Check Box 29"].checked = character.skills[6].proficient
    formFieldDict.Intimidation.setText(character.skills[7].Intimidation.toString())
    formFieldDict["Check Box 30"].checked = character.skills[7].proficient
    formFieldDict.Investigation.setText(character.skills[8].Investigation.toString())
    formFieldDict["Check Box 31"].checked = character.skills[8].proficient
    formFieldDict.Medicine.setText(character.skills[9].Medicine.toString())
    formFieldDict["Check Box 32"].checked = character.skills[9].proficient
    formFieldDict.Nature.setText(character.skills[10].Nature.toString())
    formFieldDict["Check Box 33"].checked = character.skills[10].proficient
    formFieldDict.Perception.setText(character.skills[11].Perception.toString())
    formFieldDict["Check Box 34"].checked = character.skills[11].proficient
    formFieldDict.Performance.setText(character.skills[12].Performance.toString())
    formFieldDict["Check Box 35"].checked = character.skills[12].proficient
    formFieldDict.Persuasion.setText(character.skills[13].Persuasion.toString())
    formFieldDict["Check Box 36"].checked = character.skills[13].proficient
    formFieldDict.Religion.setText(character.skills[14].Religion.toString())
    formFieldDict["Check Box 37"].checked = character.skills[14].proficient
    formFieldDict.SleightofHand.setText(character.skills[15]["Sleight of Hand"].toString())
    formFieldDict["Check Box 38"].checked = character.skills[15].proficient
    formFieldDict.Stealth.setText(character.skills[16].Stealth.toString())
    formFieldDict["Check Box 39"].checked = character.skills[16].proficient
    formFieldDict.Survival.setText(character.skills[17].Survival.toString())
    formFieldDict["Check Box 40"].checked = character.skills[17].proficient
    */

    
    //formFieldDict.AC.setText(character.armor_class) Need to fix this as well
    //formFieldDict.Initiative.setText(character.initiative >= 0 ? `+${character.initiative}` : `${character.initiative}`) need to get this
    formFieldDict.Speed.setText(`${character.speed.toString()} ft.`)
    //formFieldDict.HPMax.setText(character.hitpoints.toString())
    formFieldDict.HPCurrent.setText(character.hitpoints.toString())
    formFieldDict.HPTemp.setText("0")
    formFieldDict.HDTotal.setText(character.hit_dice)
    formFieldDict.HD.setText(character.hit_dice)

    formFieldDict.Passive.setText
}

async function CreateThePDF() {
    //fetching local doc (note: might not work if website published ever and might only work because vscode plugin)
    const respone = await fetch("../assets/DNDForm/CharacterSheet.pdf")
    const pdfArrayBuffer = await respone.arrayBuffer();

    const pdfDoc = await PDFDocument.load(pdfArrayBuffer)
    
    const form = pdfDoc.getForm()
    const fields = form.getFields()

    // pints all the field names
    fields.forEach(field => {
        console.log(field.getName());
    });

    // sets all of the fields for the character sheet
    SetCharacterSheetFields(form);

    //save and download form
    const pdfBytes = await pdfDoc.save()
    const blob = new Blob([pdfBytes], { type: "application/pdf"})
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a")

    a.href = url
    a.download = "CharacterSheet.pdf"
    a.click()
    URL.revokeObjectURL(url);
}





