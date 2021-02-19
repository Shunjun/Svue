export default class Store {
    _data: DataType
    _mutations: { [K: string]: () => void }
    _actions: { [K: string]: () => void }
    constructor(options: any) {
        this._data = options.state
        this._mutations = options.mutations
        this._actions = options.actions

        this._vue = null
    }

    commit(name: string, ...args: any[]) {
        let mutation = this._mutations[name]

        mutation(this._data, ...args)

        // 通知vue
    }
    dispatch(name: string, ...args: any[]) {
        let action = this._actions[name]

        action(this, ...args)
    }
}