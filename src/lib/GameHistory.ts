import { IGameState } from "./IGameState";

export const clone = (obj: any) => JSON.parse(JSON.stringify(obj))

export class GameHistory {
    frames: IGameState[]

    constructor(frames: IGameState[]) {
        this.frames = frames.map( (frame) => clone(frame) )
    }

    push(frame: IGameState) {
        this.frames.push(clone(frame))
        return {
            id: this.frames.length - 1,
            state: this.frames[this.frames.length - 1]
        }
    }

    frame(id: number) {
        if (this.frames[id]) {
            return {
                id: id,
                state: this.frames[id]
            }
        } else {
            return undefined
        }
    }

    latest() {
        const latestIdx = this.frames.length - 1
        return {
            id: latestIdx,
            state: this.frames[latestIdx]
        }
    }
}