import { MinionInPlay } from './MinionInPlay'

export class Board {
    private _minions: [MinionInPlay[], MinionInPlay[]]

    static empty = new Board([], [])

    constructor(red: MinionInPlay[], blue: MinionInPlay[]) {
        this._minions = [red, blue]
    }

    get minions() {
        return this._minions
    }

    set minions(newMinions: [MinionInPlay[], MinionInPlay[]]) {
        if (newMinions.length != 2) {
            return
        }
        this._minions = newMinions
    }

    toJSON() {
        return {
            minions: this._minions
        }
    }
}