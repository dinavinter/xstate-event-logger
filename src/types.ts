import {  StateMachine, EventObject} from "@xstate/fsm";

export declare type StateFromService<TService extends StateMachine.AnyService = StateMachine.AnyService> =  
    TService extends StateMachine.Service<infer TContext, infer TEvent, infer TState> ?
        StateMachine.State<TContext, TEvent, TState> : StateMachine.AnyState;
