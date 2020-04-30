class Character {
    constructor (CharacterIndex, CharacterAssetFamily) {
        this.Index = CharacterIndex;
		this.Name = "";
		this.AssetFamily = CharacterAssetFamily;
		this.AccountName = "";
		this.Owner = "";
		this.Lover = "";
		this.Money = 0;
		this.Inventory = [];
		this.Appearance = [];
		this.Stage = "0";
		this.CurrentDialog = "";
		this.Dialog = [];
		this.Reputation = [];
		this.Skills = [];
		this.Pose = [];
		this.Effects = [];
		this.FocusGroup = null;
		this.Canvas = null;
		this.CanvasBlink = null;
		this.MustDraw = false;
		this.BlinkFactor = Math.round(Math.random() * 10) + 10;
		this.AllowItem = true;
		this.BlockItems = [];
		this.HeightModifier = 0;
    }

    CanTalk () {
        return !this.Effects.find(e => e.startsWith("Gag"));
    }

    CanWalk () {
        const EffectsPreventingWalking = ["Freeze", "Tethered", "Kneel", "KneelFreeze"];
        return !this.Effects.find(e => EffectsPreventingWalking.includes(e));
    }

    CanKneel () {
        const EffectsPreventingKneeling = ["Freeze", "ForceKneel"];
        const PosesPreventingKneeling = ["LegsClosed", "Supension", "Suspension", "Hogtied"];
        return !this.Effects.find(e => EffectsPreventingKneeling.includes(e)) && (!this.Pose || !this.Pose.find(p => PosesPreventingKneeling.includes(p)));
    }

    CanInteract () { 
        return !this.Effects.find(e => e === "Block");
    }

    CanChange () { 
        const EffectsPreventingChange = ["Freeze", "Block", "Prone"];
        return !this.Effects.find(e => EffectsPreventingChange.includes(e)) && 
            !ManagementIsClubSlave() && 
            !LogQuery("BlockChange", "Rule") &&
            (!LogQuery("BlockChange", "OwnerRule" || !Player.Ownership || Player.Ownership.Stage !== 1));
    }

    IsProne () { 
        return this.Effects.find(e => e === "Prone");
    }

    IsRestrained () {
        const RestrainingEffects = ["Freeze", "Block", "Prone"];
        return this.Effects.find(e => RestrainingEffects.includes(e));
    }

    IsBlind () { 
        return this.Effects.find(e => e.startsWith("Blind"));
    }

    IsEnclose () { 
        return this.Effects.find(e => e === "Enclose");
    }
    IsMounted () { 
        return this.Effects.find(e => e === "Mounted");
    }

    IsChaste () {
        const ChastityEffects = ["Chaste", "BreastChaste"];
        return this.Effects.find(e => ChastityEffects.includes(e)); 
    }

    IsVulvaChaste () { 
        return this.Effects.find(e => e === "Chaste");
    }

    IsBreastChaste () { 
        return this.Effects.find(e => e === "BreastChaste");
    }

    IsEgged () { 
        return this.Effects.find(e => e === "Egged");
    }

    IsOwned () { 
        return this.Owner && this.Owner.trim();
    }

    IsOwnedByPlayer () {
        return (this.Owner && this.Owner.trim() === Player.Name) ||
            (NPCEventGet(this, "EndDomTrial") > 0 && !this.Ownership) ||
            (this.Ownership && this.Ownership.MemberNumber && this.Ownership.MemberNumber === Player.MemberNumber);
    }

    IsOwner () { 
        return NPCEventGet(this, "EndSubTrial") > 0 || this.Name === Player.Owner.replace("NPC-", "");
    }

    IsLoved () { 
        return this.Lover && this.Lover.trim();
    }

    IsLoverOfPlayer () { 
        return (this.Lover && this.Lover.trim() === Player.Name) || 
            (NPCEventGet(this, "Girlfriend") > 0 && !this.Lovership) || 
            (this.Lovership && this.Lovership.MemberNumber === Player.MemberNumber);
    }

    IsLover () { 
        return NPCEventGet(this, "Girlfriend") > 0 || this.Name === Player.Lover.replace("NPC-", "");
    }

    IsKneeling () { 
        return this.Pose && this.Pose.find("Kneel");
    }

    IsNaked () { 
        return CharacterIsNaked(this); 
    }

    IsDeaf () {
        return this.Effects.find(e => e.startsWith("Deaf"));
    }

    HasNoItem () { 
        return CharacterHasNoItem(this); 
    }

    // Backward compatibility
    get Effect () {
        return this.Effects;
    }

    // Backward compatibility
    get Skill () {
        return this.Skills;
    }

    // Backward compatibility
    get ID () {
        return this.Index;
    }
}

export default Character;