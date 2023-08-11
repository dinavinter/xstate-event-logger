import { h, Component, State ,FunctionalComponent, Prop} from "@stencil/core";
import {
    NotificationItem, NotificationsService,
    NotificationsState
} from "./notifications.machine";
 


@Component({
    tag: "machine-logger",
    shadow: true
})
export class NotificationsContainer {
    
    @Prop() service : NotificationsService;

    @State() state : NotificationsState;

    componentWillLoad() {
        this.service.subscribe(state => {
            this.state = state;
        });

    }

    render() { 
        return (<NotificationList
            notifications={this.state?.context?.notifications!}
        /> );
     }
}

export interface NotificationsListProps {
    notifications: NotificationItem[];
}

const NotificationList: FunctionalComponent<NotificationsListProps> = ({
                                                                            notifications
                                                                        }) => {
    return h(
        <div>
            {notifications?.length > 0 ? (
                <ion-list data-test="notifications-list">

                    {notifications.map((notification: NotificationItem) => (
                        <ion-item id={notification.id}>
                            <NotificationListItem
                                notification={notification}
                            />
                        </ion-item>


                    ))}
                </ion-list>
            ) : (
                <div></div>
            )}
        </div>
    );
};

export interface NotificationListItemProps {
    notification: NotificationItem;
}


const NotificationListItem: FunctionalComponent<NotificationListItemProps> = ({
                                                                                  notification
                                                                              }) => {


    const changeExpand = () => {
    }
    return (
        <ion-item button onClick={() => changeExpand()} data-test={`notification-list-item-${notification.id}`}>
            <ion-label>
                <h3>{notification.title}</h3>
                <p>{notification.text || "..."}</p>
            </ion-label>
            <ion-avatar slot="start">
                <ion-icon name="albums-outline"/>
            </ion-avatar>
        </ion-item>);
};

