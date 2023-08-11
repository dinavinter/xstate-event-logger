import {h, FunctionalComponent} from "@stencil/core";

import {NotificationItem} from "./notifications.machine";

export interface NotificationListItemProps {
    notification: NotificationItem;
    dismiss?: Function;
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


export default NotificationListItem;
