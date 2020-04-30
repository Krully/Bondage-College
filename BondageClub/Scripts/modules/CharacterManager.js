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
            (Override ? `Screens/${CurrentModule}/${CurrentScreen}/Dialog_${C.AccountName}` : Override) + ".csv";
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
}

export default new CharacterManager();