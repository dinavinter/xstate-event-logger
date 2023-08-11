 import {createMachine, StateMachine, assign, ServiceFrom} from "@xstate/fsm";

export type NotificationItem = any

export type NotificationsEvents = NotificationsAddEvent | { type: "HIDE" };
export type NotificationsAddEvent = { type: "ADD", notification: NotificationItem }


export interface NotificationsContext {
    notifications: Array<NotificationItem>

}

export const notificationsMachineConfig: StateMachine.Config<NotificationsContext,NotificationsEvents> = {
    context: {
        notifications: Array.of<NotificationItem>()
    },
    initial: "visible",
    states: {
        visible: {
            on: {
                'ADD': {
                    actions: "addNotification"
                }
            }
        }
    }
};


export const notificationMachine= createMachine(notificationsMachineConfig, {
    actions: {
        addNotification:  assign((context, event:NotificationsAddEvent) =>{return {
            notifications:  [...context.notifications , event.notification]
        }})
    }
})


export type NotificationsService = ServiceFrom<typeof notificationMachine>
