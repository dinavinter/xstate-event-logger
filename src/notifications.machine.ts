import {
    createMachine,
    StateMachine,
    assign,
    ServiceFrom
} from "@xstate/fsm";


export type NotificationItem = any;
export type NotificationsEvents = NotificationsAddEvent | { type: "HIDE" } | { type: "ENABLE" } | { type: "DISABLE" };
export type NotificationsAddEvent = { type: "NOTIFY", notification: NotificationItem }


export interface NotificationsContext {
    notifications: Array<NotificationItem>

}


export const notificationsMachineConfig: StateMachine.Config<NotificationsContext, NotificationsEvents> = {
    context: {
        notifications: Array.of<NotificationItem>()
    },
    initial: "enabled",
    states: {
        enabled: {
            on: {
                'NOTIFY': {
                    actions: "addNotification"
                },
                'DISABLE': {
                    target: 'disabled'
                }
            }
        },
        disabled: {
            on: {
                'ENABLE': {
                    target: 'enabled'
                }
            }
        }
    }
}


export declare type NotificationMachine = StateMachine.Machine<NotificationsContext, NotificationsEvents, { value: any, context: NotificationsContext }>;
export declare type NotificationsState = StateMachine.State<NotificationsContext, NotificationsEvents, { value: any, context: NotificationsContext }>;


export const notificationMachine = createMachine(notificationsMachineConfig, {
    actions: {
        addNotification: assign((context, event: NotificationsAddEvent) => {
            return {
                notifications: [...context.notifications, event.notification]
            }
        })
    }
});

export type NotificationsService = ServiceFrom<NotificationMachine>

