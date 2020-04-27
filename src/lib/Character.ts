export class Health {
    private _base: number
    private _max: number
    private _current: number

    constructor(value: number) {
        this._current = value
        this._max = value
        this._base = value
    }

    isAlive() {
        return this._current > 0
    }
    
    damage(value: number) {
        this._current -= value
    }
    
    heal(value: number) {
        this._current = Math.min(this._max, this._current + value)
    }
    
    set(value: number) {
        this._max = value
        this._current = value
    }
    
    buff(value: number) {
        this._max += value
        this._current += value
    }
    
    debuff(value: number) {
        this._max -= value
        this._current = Math.min(this._current, this._max)
    }

    get base() {
        return this._base
    }

    get max() {
        return this._max
    }

    get current() {
        return this._current
    }
}

export class Attack {
    current: number
    base: number
    
    constructor(value: number) {
        this.current = value
        this.base = value
    }
    
    set(value: number) {
        this.current = value
    }
    
    change(value: number) {
        this.current += value
    }
}
