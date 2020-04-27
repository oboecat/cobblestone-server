export enum PlayerAction {
    PLAY_MINION = "playMinion",
    COMBAT = "combat",
    END_TURN = "endTurn",
    CONCEDE = "concede"
}

export interface Action {
    name: PlayerAction
    params?: string[]
}