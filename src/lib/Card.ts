import { v4 as uuid } from 'uuid'
import { Minion } from './Minion'

export class Card {
    id: string
    name: string
    cost: number
    description: string
    minion: Minion
    
    static defaultA = () => new Card(Minion.default(), 0, "", "c8e39710-5d45-4ebb-b791-203da275f6ee")
    static defaultB = () => new Card(Minion.default(), 0, "", "6f8dd026-1033-4144-b0b9-24d77f31777b")

    constructor(minion: Minion, cost: number, description: string = "", id: string = uuid()) {
        this.id = id
        this.name = minion.name
        this.cost = cost
        this.description = description
        this.minion = minion
    }
}