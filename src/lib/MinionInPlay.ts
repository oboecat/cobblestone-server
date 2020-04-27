import { v4 as uuid } from 'uuid'
import { Minion, MinionStatus } from './Minion'
import { Health } from './Character'
import { Card } from './Card'
import { PlayerColor } from './Player'

const { CHARGE } = MinionStatus

export class MinionInPlay {
    id: string
    name: string
    attack: number
    health: Health
    statuses: Set<MinionStatus>
    color: PlayerColor
    attacksRemaining: number

    static defaultRed = MinionInPlay.fromMinion(Minion.default(), PlayerColor.RED)
    
    constructor(name: string, attack: number, health: number, statuses: Set<MinionStatus> = new Set(), color: PlayerColor, mustRest: boolean = true, id: string = uuid()) {
        this.id = id
        this.color = color
        this.name = name
        this.attack = attack
        this.health = new Health(health)
        this.statuses = statuses
        this.attacksRemaining = statuses.has(CHARGE) || mustRest ? 1 : 0
    }
    
    static fromMinion(minion: Minion, color: PlayerColor, id: string = uuid(), mustRest: boolean = true) {
        return new MinionInPlay(minion.name, minion.attack, minion.health, minion.statuses, color, mustRest, id)
    }
    
    static fromCard(card: Card, color: PlayerColor, mustRest: boolean = true) {
        return this.fromMinion(card.minion, color, card.id, mustRest)
    }
    
    canAttack() {
        return this.attacksRemaining > 0
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            attack: this.attack,
            health: this.health,
            statuses: [...this.statuses],
            color: this.color,
            attacksRemaining: this.attacksRemaining
        }
    }
}
