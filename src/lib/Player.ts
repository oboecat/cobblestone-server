import { Card } from './Card'

export enum PlayerColor {
    RED, BLUE
}

export class Player {
    id: string
    color: PlayerColor
    hand: Card[]
    deck: Card[]
    maxMana: number
    mana: number

    static red = new Player('apple|000768.9902e6ff61f1415c884b91bf055cb444.2129', PlayerColor.RED, [Card.defaultA()], [], 1)
    static blue = new Player('1', PlayerColor.BLUE, [Card.defaultB()], [], 1)

    constructor(
        id: string,
        color: PlayerColor,
        hand: Card[] = [Card.defaultA()],
        deck: Card[] = [],
        mana: number = 1
    ) {
        this.id = id
        this.color = color
        this.hand = hand
        this.deck = deck
        this.maxMana = mana
        this.mana = mana
    }
}