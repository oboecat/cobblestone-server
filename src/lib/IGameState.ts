import { PlayerColor, Player } from './Player'
import { Board } from './Board'

export interface IGameState {
    players: [Player, Player]
    board: Board
    turn: number
    activePlayerColor: PlayerColor
}