import {StateFromService} from "./types";
import {
    StateMachine,
    interpret,
    ContextFrom,
    EventFrom,
    createMachine,
    Typestate,
    assign
} from "@xstate/fsm";
import {omit} from "lodash/fp";

import {
    NotificationItem,
    notificationMachine,
    NotificationsService
} from "./notifications.machine";


export interface ServiceLoggerContext {
    services: Array<Listener>
    logger: NotificationsService
    map: ServiceMapper<any>
}

export interface ServiceLoggerState extends Typestate<ServiceLoggerContext> {

}

type DisableEvent = { type: "DISABLE" }
type SpyEvent = { type: "SPY", service: StateMachine.AnyService, map?: ServiceMapper<any> }
type DisconnectEvent = { type: "DISCONNECT", service: StateMachine.AnyService }
type EnableEvent = { type: "ENABLE", logger: NotificationsService }
export type ServiceLoggerEvents = SpyEvent | DisconnectEvent | EnableEvent | DisableEvent;


export const ServiceLoggerConfig: StateMachine.Config<ServiceLoggerContext, ServiceLoggerEvents, ServiceLoggerState> = {
    context: {
        services: Array.of<Listener>(),
        logger: interpret(notificationMachine).start(),
        map: DefaultMap
    },
    initial: "enabled",

    states: {
        enabled: {
            entry: ['log','init', 'subscribe'],
            on: {
                'ENABLE': {
                    target: 'enabled'
                },
                'SPY': {
                    actions: "add",

                },
                'DISCONNECT': {
                    actions: "remove"
                },

                'DISABLE': {
                    actions: "disable",
                    target: 'disabled'
                }
            }
        },
        disabled: {
            entry: ['log','disable', 'unsubscribe'],

            on: {
                'ENABLE': {
                    target: 'enabled'
                }
            }
        }
    }
}
const createServiceLoggerMachine =(notificationsService?: NotificationsService) => createMachine(ServiceLoggerConfig, {
    actions: {
        init: assign( {
            logger:(context, event: EnableEvent) => event.logger || notificationsService|| context.logger
        }) ,

        add: assign((context, event: SpyEvent) => {
            return {
                services: [...context.services, ServiceLoggerListener(event.service, event.map || context.map,context) ]
            }
        }),
        unsubscribe: (context, _: DisableEvent) => {
            console.log('unsubscribing',context.services );
            context.services.forEach(e=> e.unsubscribe());
                        console.log('unsubscribed');

        } ,
        subscribe: (context, _: EnableEvent) => {
            context.services.forEach(e=> e.subscribe(context));
        },
        log: (context, event) => {
            console.log(context);
            console.log(event);

        }

    }
});
export const serviceLoggerMachine = createServiceLoggerMachine();

export const ServiceLogger=(notificationsService?: NotificationsService)=>{
    const serviceLogger=  interpret(createServiceLoggerMachine(notificationsService)).start();

    return serviceLogger;
}


export function ServiceLoggerListener<TService extends StateMachine.AnyService= StateMachine.AnyService>(
    service: TService,
    map: ServiceMapper<TService>  ,
    context: ServiceLoggerContext):Listener<TService>
{

    return {
        service: service,

        ...service.subscribe(state => {
            return context.logger.send({
                type: "NOTIFY", notification: map(state)
            })

        }),
        subscribe: (context: ServiceLoggerContext) => service.subscribe(state => {
            return context.logger.send({
                type: "NOTIFY", notification: map(state)
            })
        })
    }
}

declare type Listener<TService extends StateMachine.AnyService = StateMachine.AnyService> ={
    service: TService,
    unsubscribe: ()=> void,
    subscribe: (context: ServiceLoggerContext)=> void
}






declare type ServiceMapper<TService extends StateMachine.Service<any, any, any>,
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

/*

export class ServiceLogger<TService extends StateMachine.Service<any, any, any>> {
    service: TService;
    unsubscribe: ()=>void;
    options: ServiceOptions<TService> = new ServiceDefaultOptions<TService>();

    constructor(service: TService, options: ServiceOptions<TService> = new ServiceDefaultOptions<TService>()) {
        this.service= service;
        this.options= options;
       
         this.unsubscribe= this.service.subscribe(state => {
             
            return this.Service.send({
                type: "NOTIFY", notification: this.options.map(state)
            })
        }).unsubscribe;
    } 

}

export function createServiceLogger(machine: StateMachine.Machine<ServiceLoggerContext, ServiceLoggerEvents, ServiceLoggerState>) {
    var service = interpret(ServiceLoggerMachine).start();
    service.subscribe(event => {

    });
}


export class MachinedNotificationsInspector {
    public Service: NotificationsService;

    constructor(notification: NotificationMachine = notificationMachine) {
        this.Service = interpret(notification);
    }


    public addService<TService extends StateMachine.Service<any, any, any>>(
        service: TService,
        options: ServiceOptions<TService> = new ServiceDefaultOptions<TService>()) {

        return service.subscribe(state => {
            return this.Service.send({
                type: "NOTIFY", notification: options.map(state)
            });
        })
    }

}
export declare interface ServiceOptions<TService extends StateMachine.Service<any, any, any> = StateMachine.Service<any, any, any>, TMapper extends ServiceMapper<TService> = ServiceMapper<TService>> {
    map: TMapper
}

export class ServiceDefaultOptions<TService extends StateMachine.Service<any, any, any>> implements ServiceOptions<TService> {
    map(state) {
        return {
            id: generateUniqueID(),
            title: state.value,
            severity: 'info',
            payload: omit("log", state.context),
            ...(state.context.log || {})
        }
    }


}*/




