import express = require('express')
import * as jwt from 'express-jwt'
// import * as jwtAuthz from 'express-jwt-authz'
import * as jwksRsa from 'jwks-rsa'
import * as jsonpatch from 'fast-json-patch'
import { Game } from './lib/Game'
import { Action, PlayerAction } from './lib/Action'
import { isAuthenticatedRequest, checkGameAccess } from './middleware/checkGameAccess'
import * as gameUtils from './lib/gameUtils'
import { GameHistory } from './lib/GameHistory'

const app = express()

// Authentication middleware. When used, the
// Access Token must exist and be verified against
// the Auth0 JSON Web Key Set
const checkJwt = jwt({
    // Dynamically provide a signing key
    // based on the kid in the header and 
    // the signing keys provided by the JWKS endpoint.
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://auth-test-pro.auth0.com/.well-known/jwks.json`
    }),
  
    // Validate the audience and the issuer.
    audience: 'https://game.example.com',
    issuer: `https://auth-test-pro.auth0.com/`,
    algorithms: ['RS256']
});

app.use(checkJwt)

const game = new Game(1)
const history = new GameHistory([game])

app.get('/combat/:attacker/:defender', function (req: express.Request, res: express.Response) {
    const { params } = req
    const { attacker, defender } = params
    const activeColor = game.activePlayerColor
    game.tryCombat(game.board.minions[activeColor][+attacker], game.board.minions[+!activeColor][+defender])
    game.nextTurn()
    res.json(game)
})

app.get('/game/:id', checkGameAccess, function (req: express.Request, res: express.Response) {
    if (!isAuthenticatedRequest(req)) {
        res.status(401).end()
        return
    }
    const userId = req.user.sub
    const playerColor = game.players.find( ({id}) => id == userId )?.color
    if (playerColor == undefined) {
        res.status(401).end()
        return
    }

    const { since } = req.query
    if (since == undefined) {
        res.json(gameUtils.gameStateWithFOW(playerColor, history.latest()))
    } else {
        console.log("Requested state change since frame", +since)

        const oldState = history.frame(+since)
        if (!oldState) {
            console.log('uh oh')
            res.status(404).end()
            return
        }
        const currentState = history.latest()
        const currentStateFOW = gameUtils.gameStateWithFOW(playerColor, currentState)
        const oldStateFOW = gameUtils.gameStateWithFOW(playerColor, oldState)
        const diff = jsonpatch.compare(oldStateFOW, currentStateFOW)
        console.log(JSON.stringify(diff))
        res.json(diff)
    }
})

app.post('/game/:id', express.json(), checkGameAccess, function (req: express.Request, res: express.Response) {
    if (!isAuthenticatedRequest(req)) {
        res.status(401).end()
        return
    }
    const userId = req.user.sub
    const playerColor = game.players.find( ({id}) => id == userId )?.color
    if (playerColor == undefined || playerColor != game.activePlayerColor) {
        res.status(401).end()
        return
    }
    // console.log(userId)

    const action: Action = req.body

    console.log('Received action', req.body)

    switch (action.name) {
        case PlayerAction.PLAY_MINION:
            const [ cardId, position ] = action.params!
            console.log('playing minion', cardId, 'to position', +position)
            game.playMinion(cardId, +position)
            break
        case PlayerAction.COMBAT:
            const [ attackerId, defenderId ] = action.params!
            const attacker = game.board.minions[playerColor].find(({id}) => id == attackerId)!
            const defender = game.board.minions[+!playerColor].find(({id}) => id == defenderId)!
            game.tryCombat(attacker, defender)
            break
        case PlayerAction.END_TURN:
            game.nextTurn()
            break
        case PlayerAction.CONCEDE:
            return
    }
    const oldState = history.latest()
    const newState = history.push(game)
    const oldStateFOW = gameUtils.gameStateWithFOW(playerColor, oldState)
    const newStateFOW = gameUtils.gameStateWithFOW(playerColor, newState)
    const diff = jsonpatch.compare(oldStateFOW, newStateFOW)
    
    res.json(diff)
})

app.get('/history/:id/:turn', function (req: express.Request, res: express.Response) {
    const { params } = req
    const { turn } = params

    const oldState = history.frames[+turn - 1]
    if (!oldState) {
        res.status(404).send()
        return
    }
    const latestState = history.frames[history.frames.length - 1]
    const diff = jsonpatch.compare(oldState, latestState)

    res.json(diff)
})

app.listen(3000)