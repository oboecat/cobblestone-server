import { PlayerColor } from './Player'

export interface IEnemyPlayer {
    color: PlayerColor
    handCount: number
    deckCount: number
    maxMana: number
    mana: number
}