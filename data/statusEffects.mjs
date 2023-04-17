const burned = {
    onTurn: "opponent",
    damage: 10,
    turnsLeft: 3,
    statEffects: null,
    overTime: function () {
        this.turnsLeft -- 
    }
}

const poisoned = {
    onTurn: "self",
    damage: 5,
    turnsLeft: 100,
    statEffects: null,
    overTime: function () {
        this.turnsLeft -- 
    }
}


export {burned, poisoned}
