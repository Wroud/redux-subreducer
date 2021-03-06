import { Reducer } from "redux";
import { IExtendAction } from "./action";
export declare type ActionReducer<TState, TPayload> = (state: TState, payload: TPayload) => Partial<TState>;
export declare type ActionsHandler<TState> = (state: TState, action: any) => void;
export interface INamedReducer<TState> {
    name: string;
    initState: Partial<TState>;
    reducer: Reducer<TState>;
}
export interface INamedSubscriber<TState> {
    name: string;
    handler: ActionsHandler<TState>;
}
export interface IRootReducer<TState, TReducerState> extends INamedReducer<TReducerState> {
    path: string;
    on<TPayload>(action: IExtendAction<TPayload>, reducer: ActionReducer<TReducerState, TPayload>): this;
    on<TPayload>(actions: Array<IExtendAction<TPayload>>, reducer: ActionReducer<TReducerState, TPayload>): this;
    on<TPayload>(actions: IExtendAction<TPayload> | Array<IExtendAction<TPayload>>, reducer: ActionReducer<TReducerState, TPayload>): this;
    join<T extends TReducerState[keyof TReducerState]>(reducer: ISubReducer<TReducerState, T>): this;
    joinReducer<T extends TReducerState[keyof TReducerState]>(name: keyof TReducerState, reducer: (state: T, action: any) => T): this;
    joinListener(name: string, handler: ActionsHandler<TState>): this;
}
export interface ISubReducer<TState, TReducerState> extends IRootReducer<TState, TReducerState> {
    setParent(reducer: ISubReducer<any, TState>): void;
    stateSelector(state: any): TReducerState;
}
export declare class SubReducer<TState, TReducerState> implements ISubReducer<TState, TReducerState> {
    initState: Partial<TReducerState>;
    protected _name: string;
    private actionReducerList;
    private reducers;
    private subscribers;
    private parent;
    constructor(name: string, initState?: Partial<TReducerState>);
    readonly name: string;
    readonly path: string;
    stateSelector: (state: any) => any;
    setParent: (reducer: ISubReducer<any, TState>) => void;
    reducer: Reducer<TReducerState>;
    on<TPayload>(actions: IExtendAction<TPayload> | Array<IExtendAction<TPayload>>, reducer: ActionReducer<TReducerState, TPayload>): this;
    join<T extends TReducerState[keyof TReducerState]>(reducer: ISubReducer<TReducerState, T>): this;
    joinReducer<T extends TReducerState[keyof TReducerState]>(name: keyof TReducerState, reducer: (state: T, action: any) => T): this;
    joinListener(name: string, handler: (state: TState, action: any) => void): this;
    private logActionInfo(action);
}
export declare class RootReducer<TState> extends SubReducer<TState, TState> {
    constructor(initState?: Partial<TState>);
    readonly path: string;
    stateSelector: (state: any) => any;
}
export declare type TransformSubReducerMap<T extends ISubReducerMap> = {
    [P in keyof T]: Required<Readonly<T[P]["initState"]>>;
};
export interface ISubReducerMap {
    [key: string]: ISubReducer<any, any>;
}
export declare function getState<T extends ISubReducerMap, TMap>(reducers: T, map: (state: TransformSubReducerMap<T>) => TMap): (state: any) => TMap;
export declare function createRootReducer<TState>(initState?: Partial<TState>): IRootReducer<TState, TState>;
export declare function createSubReducer<TParentState, TState>(name: keyof TParentState, initState?: Partial<TState>): ISubReducer<TParentState, TState>;
