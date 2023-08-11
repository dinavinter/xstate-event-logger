import {
    assign,
    createMachine,
    interpret,
    ServiceFrom,
    StateMachine,
    Typestate
} from "@xstate/fsm";

import {notificationMachine, NotificationsService} from "./notifications.machine";
import {CreateServiceListenerMachine, ServiceListenerMachine, ServiceMapper} from "./logger.service";


export interface ServiceCollectionLoggerContext {
    services: Map<StateMachine.AnyService, ServiceFrom<ServiceListenerMachine>>
    logger: NotificationsService
}

export interface ServiceCollectionLoggerState extends Typestate<ServiceCollectionLoggerContext> {

}

type DisableEvent = { type: "DISABLE" }
type SpyEvent = { type: "SPY", service: StateMachine.AnyService, map?: ServiceMapper<any> }
type DisconnectEvent = { type: "DISCONNECT", service: StateMachine.AnyService }
type ConnectEvent = { type: "CONNECT", service: StateMachine.AnyService }

type EnableEvent = { type: "ENABLE", logger: NotificationsService }
export type ServiceCollectionLoggerEvents = SpyEvent | DisconnectEvent | ConnectEvent | EnableEvent | DisableEvent;


export const ServiceCollectionLoggerConfig: StateMachine.Config<ServiceCollectionLoggerContext, ServiceCollectionLoggerEvents, ServiceCollectionLoggerState> = {
    context: {
        services: new Map<StateMachine.AnyService, ServiceFrom<ServiceListenerMachine>>(),
        logger: interpret(notificationMachine).start(),
    },
    initial: "enabled",

    states: {
        enabled: {
            entry: ['log', 'init', 'subscribe'],
            on: {
                'ENABLE': {
                    target: 'enabled'
                },
                'SPY': [{
                    actions: "add",
                    cond: (context, event) => context.services.has(event.service),
                }, {
                    actions: "connect",
                    cond: (context, event) => !context.services.has(event.service)
                }],
                'DISCONNECT': {
                    actions: ['log', 'disconnect']
                },

                'CONNECT': {
                    actions: ['log', 'connect']
                },

                'DISABLE': {
                    actions: "disable",
                    target: 'disabled'
                }
            }
        },

        disabled: {
            entry: ['log', 'disable', 'unsubscribe'],

            on: {
                'ENABLE': {
                    target: 'enabled'
                }
            }
        }
    }
}
const createServiceCollectionLogger = (notificationsService?: NotificationsService) => createMachine(ServiceCollectionLoggerConfig, {
    actions: {
        init: assign({
            logger: (context, event: EnableEvent) => event.logger || notificationsService || context.logger
        }),

        add: assign({
            services: (context, event: SpyEvent) => context.services.set(event.service, interpret(CreateServiceListenerMachine(event.service, context.logger, event.map )).start())
        }),

        connect: (context, event: SpyEvent) => {
            context.services.get(event.service)?.send('SUBSCRIBE');
        },
        disconnect: (context, event: DisconnectEvent) => {
            context.services.get(event.service)?.send('UNSUBSCRIBE');
            context.services.delete(event.service);
        },
        unsubscribe: (context, _: DisableEvent) => {
            context.services.forEach(e => e.send('UNSUBSCRIBE'));
        },
        subscribe: (context, _: EnableEvent) => {
            context.services.forEach(e => e.send('SUBSCRIBE'));
        },
        log: (context, event) => {
            console.log(event.type); 
            
            console.log(context);
            console.log(event);

        }

    }
});

export const serviceCollectionLogger = createServiceCollectionLogger();



