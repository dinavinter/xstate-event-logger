import {NotificationItem, NotificationsService} from "./notifications.machine";
import {StateFromService} from "./types";

import {
    assign,
    ContextFrom,
    createMachine,
    EventFrom,
    StateMachine,
    Typestate
} from "@xstate/fsm";
import {omit} from "lodash/fp";


export type ServiceListenerContext <TService extends StateMachine.AnyService= StateMachine.AnyService>={
    service: TService,
    map: ServiceMapper<TService>  ,
    logger: NotificationsService,
    unsubscribe: ()=>void
}
export type ServiceListenerState <TService extends StateMachine.AnyService= StateMachine.AnyService>= Typestate<ServiceListenerContext<TService>>;

export type  ServiceListenerEvents =  { type: "SUBSCRIBE" } |  { type: "UNSUBSCRIBE" }
export type ServiceListenerMachine<TService extends StateMachine.AnyService= StateMachine.AnyService>=StateMachine.Machine<ServiceListenerContext<TService>, ServiceListenerEvents,ServiceListenerState<TService>>;

export interface ServiceListenerConfig <TService extends StateMachine.AnyService= StateMachine.AnyService
    > extends StateMachine.Config<ServiceListenerContext<TService>, ServiceListenerEvents,ServiceListenerState<TService>>
{

    context: ServiceListenerContext<TService>,
    initial: "subscribe",

    states: {
        subscribe: {
            entry: ['log', 'subscribe'],
            on: {
                'UNSUBSCRIBE': {
                    target: "unsubscribe",

                },
            }
        },
        unsubscribe: {
            entry: ['log', 'unsubscribe'],

            on: {
                'SUBSCRIBE': {
                    target: 'subscribe'
                }
            }
        }
    }
};

export function CreateServiceListenerMachine<TService extends StateMachine.AnyService= StateMachine.AnyService>(
    service: TService,
    logger: NotificationsService,
    map: ServiceMapper<TService>  = DefaultMap ,
 ): ServiceListenerMachine<TService>{


    const listenerConfig: ServiceListenerConfig<TService> ={
        initial: "subscribe",
        states: {
            subscribe: {entry: ["log", "subscribe"], on: {UNSUBSCRIBE: {target: "unsubscribe"}}},
            unsubscribe: {entry: ["log", "unsubscribe"], on: {SUBSCRIBE: {target: "subscribe"}}}
        },

        context: {
            service:service,
            logger: logger,
            map: map,
            unsubscribe: () => {}

        }
    }

    return createMachine(listenerConfig, {
        actions:{
            unsubscribe: (context, _) => {
                context.unsubscribe();
            } ,
            subscribe: assign( {
                unsubscribe:(context, _) => context.service.subscribe(state => {
                    return context.logger.send({
                        type: "NOTIFY", notification: context.map(state)
                    })}).unsubscribe
            }) ,
            log: (context, event) => {
                console.log(context);
                console.log(event);

            }

        }})

}








export declare type ServiceMapper<TService extends StateMachine.Service<any, any, any>,
    TContext extends ContextFrom<TService> = ContextFrom<TService>,
    TEvent extends EventFrom<TService> = EventFrom<TService>,
    TState extends StateFromService<TService> = StateFromService<TService>> = {
    (state: StateMachine.State<TContext, TEvent, TState>): NotificationItem
}

function DefaultMap (state) {
    return {
        id: generateUniqueID(),
        title: state.value,
        severity: 'info',
        payload: omit("log", state.context),
        ...(state.context.log || {})
    }

    function generateUniqueID() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }
}
