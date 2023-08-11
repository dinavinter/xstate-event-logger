import {  StateMachine, EventObject} from "@xstate/fsm";

export type AnyEvent= EventObject;
export declare type FunctionOrValue<TIn, TOut> = (arg:TIn) => TOut | TOut;

export declare type ReturnTypeOrInput<TInput, TOutput = TInput> = TOutput extends InputFunction<TInput> ? ReturnType<TOutput> : TOutput;
export declare type InputFunctionOrInput<T> =  InputFunction<T> | T;
export declare type InputFunction<T> = (arg:T) => any;

export declare type AnyFunction = (...args: any[]) => any;
declare type ReturnTypeOrValue<T> = T extends AnyFunction ? ReturnType<T> : T;
export declare type IsNever<T> = [T] extends [never] ? true : false;
export declare type Compute<A extends any> = {
    [K in keyof A]: A[K];
} & unknown;
export declare type Prop<T, K> = K extends keyof T ? T[K] : never;
export declare type Values<T> = T[keyof T];
export declare type Merge<M, N> = Omit<M, keyof N> & N;
export declare type IndexByType<T extends {
    type: string;
}> = {
    [K in T['type']]: T extends any ? (K extends T['type'] ? T : never) : never;
};
export declare type Equals<A1 extends any, A2 extends any> = (<A>() => A extends A2 ? true : false) extends <A>() => A extends A1 ? true : false ? true : false;
export declare type IsAny<T> = Equals<T, any>;
export declare type Cast<A, B> = A extends B ? A : B;
export declare type NoInfer<T> = [T][T extends any ? 0 : any];
export declare type LowInfer<T> = T & {};
export declare type EventType = string;
export declare type ActionType = string;
export declare type MetaObject = Record<string, any>;



declare type InferSeverity<TState extends StateMachine.AnyState> =
    TState extends { context: { log: { severity: infer TSeverity } } } ? TSeverity : 'info';

declare type InferPayload<TState extends StateMachine.AnyState> =
    TState extends { context: { log: { payload: infer TPayload } } } ? TPayload :
        TState extends { context: infer TPayload } ? TPayload :
            TState;

declare type InferTittle<TState extends StateMachine.AnyState> =
    TState extends { context: { log: { title: infer Title } } } ? Title :
        TState extends { value: infer Title } ? Title : never;



declare function toNotification< TState extends StateMachine.AnyState = StateMachine.AnyState>(state):
    {
        id: string
        title: InferTittle<TState>,
        severity: InferSeverity<TState>
        payload: InferPayload<TState>
    }

export declare type Mapper<TIn, TOut> = (arg:TIn) => TOut ;
export declare type StateFromService<TService extends StateMachine.AnyService = StateMachine.AnyService> =  
    TService extends StateMachine.Service<infer TContext, infer TEvent, infer TState> ?
        StateMachine.State<TContext, TEvent, TState> : StateMachine.AnyState;

export declare type MapperFromService<TService extends StateMachine.AnyService = StateMachine.AnyService, TOut =StateFromService<TService> >=
    Mapper<StateFromService<TService>, TOut>;

declare type NotificationFromService<TService extends StateMachine.AnyService = StateMachine.AnyService>={

   (state: TService extends StateMachine.Service<infer TContext, infer TEvent, infer TState> ? TState: never):
       TService extends StateMachine.Service<infer TContext, infer TEvent, infer TState>? Mapper<TState, any>: any;
   
}


declare function inspect<
    TService extends StateMachine.AnyService = StateMachine.AnyService,
    TNotification extends typeof toNotification = typeof toNotification>(
    state: TService extends StateMachine.Service<infer TContext, infer TEvent, infer TState> ? TState: never
): TService extends StateMachine.Service<infer TContext, infer TEvent, infer TState>? ReturnTypeOrInput<TState ,TNotification>: never

