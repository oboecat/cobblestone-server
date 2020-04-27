import express = require('express')

export interface AuthenticatedRequest extends express.Request {
    user: any
}

export function isAuthenticatedRequest(req: express.Request): req is AuthenticatedRequest {
    return !!(req as any)['user'];
}

export function checkGameAccess(req: express.Request, _: express.Response, next: express.NextFunction) {
    if (!isAuthenticatedRequest(req)) {
        console.log("Not an authenticated request")
        next(new Error("UNAUTHORIZED"))
        return
    }
    const gameId = req.user['https://game.example.com/gameId']
    if (gameId != req.params.id) {
        console.log("Invalid game id")
        next(new Error("UNAUTHORIZED"))
        return
    }
    next()
}