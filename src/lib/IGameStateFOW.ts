import { PlayerColor, Player } from './Player'
import { Board } from './Board'
import { IEnemyPlayer } from './IEnemyPlayer'

export interface IGameStateFOW {
    frameId: number
    player: Player
    opponent: IEnemyPlayer
    board: Board
    turn: number
    activePlayerColor: PlayerColor
}