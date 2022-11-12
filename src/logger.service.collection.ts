import {
    assign,
    createMachine,
    interpret,
    ServiceFrom,
    StateMachine,
    Typestate
} from "@xstate/fsm";

import { notificationMachine, NotificationsService} from "./notifications.machine";
import {CreateServiceListenerMachine, ServiceListenerMachine, ServiceMapper} from "./logger.service";


export interface ServiceCollectionLoggerContext {
    services: Array<ServiceFrom<ServiceListenerMachine>>
    logger: NotificationsService
    map?: ServiceMapper<any>
}

export interface ServiceCollectionLoggerState extends Typestate<ServiceCollectionLoggerContext> {

}

type DisableEvent = { type: "DISABLE" }
type SpyEvent = { type: "SPY", service: StateMachine.AnyService, map?: ServiceMapper<any> }
type DisconnectEvent = { type: "DISCONNECT", service: StateMachine.AnyService }
type EnableEvent = { type: "ENABLE", logger: NotificationsService }
export type erviceCollectionLoggerEvents = SpyEvent | DisconnectEvent | EnableEvent | DisableEvent;


export const ServiceCollectionLoggerConfig: StateMachine.Config<ServiceCollectionLoggerContext, erviceCollectionLoggerEvents, ServiceCollectionLoggerState> = {
    context: {
        services: Array.of<ServiceFrom<ServiceListenerMachine>>(),
        logger: interpret(notificationMachine).start(),
        map: undefined
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
                    actions: ['unsubscribeService', "remove"]
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
const createServiceCollectionLogger =(notificationsService?: NotificationsService) => createMachine(ServiceCollectionLoggerConfig, {
    actions: {
        init: assign( {
            logger:(context, event: EnableEvent) => event.logger || notificationsService|| context.logger
        }) ,

        add: assign({
                 services: (context, event: SpyEvent) => [...context.services, interpret(CreateServiceListenerMachine(event.service,context.logger,event.map || context.map)).start() ]
            })
      ,
        unsubscribeService: (context, event: DisconnectEvent) => {
           context.services.filter(e=>e.state.context.service === event.service).forEach(e=>e.send('UNSUBSCRIBE'))
         }  ,
     
        remove: assign((context, event: DisconnectEvent) => {
            return {
                services: context.services.filter(e=>e.state.context.service != event.service)
            }
        }),
        // subscribe:assign((context, _: EnableEvent) => {
        //     return {
        //         services: context.services.map(e=> ServiceLoggerListener(e.service, e.map , context))
        //     }
        // }),
        unsubscribe: (context, _: DisableEvent) => {
            context.services.forEach(e=> e.send('UNSUBSCRIBE'));
        } ,
        subscribe: (context, _: EnableEvent) => {
            context.services.forEach(e=> e.send('SUBSCRIBE'));
        },
        log: (context, event) => {
            console.log(context);
            console.log(event);

        }

    }
});

export const serviceCollectionLogger = createServiceCollectionLogger();



