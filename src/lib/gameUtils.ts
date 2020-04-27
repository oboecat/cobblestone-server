import { PlayerColor } from "./Player"
import { IGameState } from "./IGameState"
import { IGameStateFOW } from "./IGameStateFOW"

export function gameStateWithFOW(color: PlayerColor, frame: { id: number, state: IGameState }): IGameStateFOW {
    const player = frame.state.players[color]
    const opponent = frame.state.players[+!color]
    return {
        frameId: frame.id,
        player: player,
        opponent: { 
            color: +!color,
            handCount: opponent.hand.length,
            deckCount: opponent.deck.length,
            maxMana: opponent.maxMana,
            mana: opponent.mana
        },
        board: frame.state.board,
        turn: frame.state.turn,
        activePlayerColor: frame.state.activePlayerColor
    }
}