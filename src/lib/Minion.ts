export enum MinionStatus {
    TAUNT = "taunt", 
    STEALTH = "stealth", 
    CHARGE = "charge", 
    DIVINE_SHIELD = "divineShield"
}

export class Minion {
    name: string
    attack: number
    health: number
    statuses: Set<MinionStatus>

    static default = () => new Minion("Test", 4, 8, new Set([MinionStatus.TAUNT, MinionStatus.DIVINE_SHIELD]))

    constructor(name: string, attack: number, health: number, statuses: Set<MinionStatus> = new Set()) {
        this.name = name
        this.attack = attack
        this.health = health
        this.statuses = statuses
    }

    toJSON() {
        return {
            name: this.name,
            attack: this.attack,
            health: this.health,
            statuses: [...this.statuses]
        }
    }
}