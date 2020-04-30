import Character from "./Character";

class CharacterManager {
    constructor () {
        this.Characters = [];
        this._RandomNamesOverload = 0;
    }

    ResetCharacter (CharacterIndex, CharacterAssetFamily) {
        const NewCharacter = new Character(CharacterIndex, CharacterAssetFamily);
        this.Characters[CharacterIndex] = NewCharacter;
        if (CharacterIndex === 0) {
            Player = NewCharacter;
            CharacterAppearanceSetDefault(NewCharacter);
        }
        CharacterLoadCanvas(NewCharacter);
    }

    GenRandomNameForChar (Char) {
        const AvailableNames = CharacterName
            .filter(n => !this.Characters.find(c => c.Name === n && c.Index !== Char.Index) && !PrivateCharacter.find(c => c.Name === n && c.Index !== Char.Index));
        Char.Name = AvailableNames[Math.floor(Math.random() * AvailableNames.length)] || `${this._RandomNamesOverload++}`;
    }

    BuildDialogForChar (Char, CSV) {
        for (const Line of CSV) {
            Char.Dialog.push({
                Stage: Line[0],
                NextStage: Line[1] && Line[1].trim() ? Line[1] : undefined,
                Option: Line[2] && Line[2].trim() ? Line[2].replace("DialogCharacterName", Char.Name).replace("DialogPlayerName", Player.Name) : undefined,
                Result: Line[3] && Line[3].trim() ? Line[3].replace("DialogCharacterName", Char.Name).replace("DialogPlayerName", Player.Name) : undefined,
                Function: Line[4] && Line[4].trim() ? (CSV[4].trim().substring(0, 6) === "Dialog" ? "" : CurrentScreen + CSV[4]) : undefined,
                Prerequisite: Line[5] && Line[5].trim() ? Line[5] : undefined,
                Group: Line[6] && Line[6].trim() ? Line[6] : undefined,
                Trait: Line[7] && Line[7].trim() ? Line[7] : undefined
            });
        }

        TranslationDialog(Char);
    }

    LoadCSVDialogForChar (Char, Override) {
        // Finds the full path of the CSV file to use cache
        const FullPath = Char.Index === 0 ? 
            "Screens/Character/Player/Dialog_Player" : 
            (Override ? `Screens/${CurrentModule}/${CurrentScreen}/Dialog_${Char.AccountName}` : Override) + ".csv";
        if (CommonCSVCache[FullPath]) {
            this.BuildDialogForChar(Char, CommonCSVCache[FullPath]);
            return;
        }

        // Opens the file, parse it and returns the result it to build the dialog
        CommonGet(FullPath, function () {
            if (this.status === 200) {
                CommonCSVCache[FullPath] = CommonParseCSV(this.responseText);
                CharacterBuildDialog(Char, CommonCSVCache[FullPath]);
            }
        });
    }

    LoadClothesOfChar (Char, Archetype, ForceColor) {
        switch (Archetype) {
            case "Maid":
                InventoryAdd(Char, "MaidOutfit1", "Cloth", false);
                CharacterAppearanceSetItem(Char, "Cloth", Char.Inventory[Char.Inventory.length - 1].Asset);
                CharacterAppearanceSetColorForGroup(Char, "Default", "Cloth");
                InventoryAdd(Char, "MaidHairband1", "Hat", false);
                CharacterAppearanceSetItem(Char, "Hat", Char.Inventory[Char.Inventory.length - 1].Asset);
                CharacterAppearanceSetColorForGroup(Char, "Default", "Hat");
                InventoryAdd(Char, "MaidOutfit2", "Cloth", false);
                const ClothesToRemove = ["ClothAccessory", "HairAccessory1", "HairAccessory2", "ClothLower"];
                for (const ToRemove of ClothesToRemove) {
                    InventoryRemove(Char, ToRemove);
                }
                Char.AllowItem = (LogQuery("LeadSorority", "Maid"));
                break;
            case "Mistress":
                const ColorList = ["#333333", "#AA4444", "#AAAAAA"];
                const Color = !ForceColor ? CommonRandomItemFromList("", ColorList) : ForceColor;
                CharacterAppearanceSetItem(Char, "Hat", null);
                InventoryAdd(Char, "MistressGloves", "Gloves", false);
                InventoryWear(Char, "MistressGloves", "Gloves", Color);
                InventoryAdd(Char, "MistressBoots", "Shoes", false);
                InventoryWear(Char, "MistressBoots", "Shoes", Color);
                InventoryAdd(Char, "MistressTop", "Cloth", false);
                InventoryWear(Char, "MistressTop", "Cloth", Color);
                InventoryAdd(Char, "MistressBottom", "ClothLower", false);
                InventoryWear(Char, "MistressBottom", "ClothLower", Color);
                InventoryAdd(Char, "MistressPadlock", "ItemMisc", false);
                InventoryAdd(Char, "MistressTimerPadlock","ItemMisc", false);
                InventoryAdd(Char, "MistressPadlockKey", "ItemMisc", false);
                InventoryRemove(Char, "ClothAccessory");
                InventoryRemove(Char, "HairAccessory1");
                InventoryRemove(Char, "HairAccessory2");
        }
    }

    LoadNPC (NPCType) {
        const AlreadyExisting = this.Characters.find(c => c.AccountName === NPCType);
        if (AlreadyExisting) {
            return AlreadyExisting;
        }

        // Randomize the new character
        CharacterReset(this.Characters.length, "Female3DCG");
        const Char = this.Characters[this.Characters.length - 1];
        Char.AccountName = NPCType;
        CharacterLoadCSVDialog(Char);
        CharacterRandomName(Char);
        CharacterAppearanceBuildAssets(Char);
        CharacterAppearanceFullRandom(Char);

        // Sets archetype clothes
        if (NPCType.includes("Maid")) {
            CharacterArchetypeClothes(Char, "Maid");
        } else if (NPCType.includes("Mistress")) {
            CharacterArchetypeClothes(Char, "Mistress");
        }

        // Returns the new character
        return Char;
    }
}

export default new CharacterManager();