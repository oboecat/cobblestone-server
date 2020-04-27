import { PlayerColor, Player } from './Player'
import { Board } from './Board'
import { MinionInPlay } from './MinionInPlay'
import { MinionStatus } from './Minion'
import { IGameState } from './IGameState'

export class Game implements IGameState {
    players: [Player, Player]
    board: Board
    turn: number = 1
    activePlayerColor: PlayerColor

    constructor(startingTurn: number,
        players: [Player, Player] = [Player.red, Player.blue],
        board: Board = Board.empty) {
        this.players = players
        this.board = board
        this.turn = startingTurn
        this.activePlayerColor = PlayerColor.RED
    }

    nextTurn() {
        this.turn += 1

        if (this.activePlayerColor == PlayerColor.RED) {
            this.prepareNextTurn(PlayerColor.BLUE)
        } else {
            this.prepareNextTurn(PlayerColor.RED)
        }
    }

    private prepareNextTurn(nextColor: PlayerColor) {
        let player = this.players[nextColor]

        if (player.maxMana < 10) {
            player.maxMana += 1
        }
        player.mana = player.maxMana

        for (let minion of this.board.minions[player.color]) {
            minion.attacksRemaining = 1
        }

        if (player.deck.length > 0) {
            let drawnCard = player.deck.shift()!
            player.hand.push(drawnCard)
        }

        this.activePlayerColor = nextColor
    }

    //    playCard(_ card: Card) {
    //        tryPlayMinion(card, position: nil)
    //    }

    playMinion(cardId: string, position?: number) {
        this.playMinionForPlayer(this.players[this.activePlayerColor], cardId, position)
    }

    private playMinionForPlayer(player: Player, cardId: string, position?: number) {
        const cardIndex = player.hand.findIndex(({id}) => id == cardId)
        if (cardIndex < 0) {
            return
        }
        const card = player.hand[cardIndex]
        if (card.cost > player.mana) {
            return
        }

        player.mana -= card.cost
        const minion = MinionInPlay.fromCard(card, player.color)
        const pos = position ?? this.board.minions[player.color].length

        player.hand.splice(cardIndex, 1)
        this.board.minions[player.color].splice(pos, 0, minion)
    }

    tryCombat(attacker: MinionInPlay, defender: MinionInPlay) {
        if (attacker.color != this.activePlayerColor) {
            return
        }

        if ( !(attacker.health.isAlive() && defender.health.isAlive()) ) {
            return
        }

        if (attacker.color == defender.color) {
            console.log("Allied minions cannot fight")
            return
        }

        if (!attacker.canAttack()) {
            console.log("This minion needs a turn to get ready.")
            return
        }

        if (defender.statuses.has(MinionStatus.STEALTH)) {
            console.log("That minion is Stealthed.")
            return
        }

        const opponentBoardHasTaunts = this.board.minions[defender.color].some( 
            ({statuses}) => statuses.has(MinionStatus.TAUNT))
        if (!defender.statuses.has(MinionStatus.TAUNT) && opponentBoardHasTaunts) {
            console.log("That minion is protected by a Taunt minion.")
            return
        }

        this.combat(attacker, defender)
    }

    private combat(attacker: MinionInPlay, defender: MinionInPlay) {
        attacker.attacksRemaining -= 1

        if (attacker.statuses.has(MinionStatus.STEALTH)) {
            attacker.statuses.delete(MinionStatus.STEALTH)
        }

        if (!attacker.statuses.delete(MinionStatus.DIVINE_SHIELD)) {
            console.log("no divine shield from attacker")
            attacker.health.damage(defender.attack)
        }

        if (!defender.statuses.delete(MinionStatus.DIVINE_SHIELD)) {
            console.log("no divine shield from defender")
            defender.health.damage(attacker.attack)
        }

        this.updateMinionOnBoard(defender)
        this.updateMinionOnBoard(attacker)
    }

    private updateMinionOnBoard(minion: MinionInPlay) {
        let board = this.board.minions[minion.color]
        const index = board.findIndex( ({id}) => id == minion.id )

        if (index < 0) {
            return
        }

        console.log(`${minion.name} has ${minion.health.current} health left`)
        if (!minion.health.isAlive()) {
            console.log(`${minion.name} died`)
            board.splice(index, 1)
        }
    }
}