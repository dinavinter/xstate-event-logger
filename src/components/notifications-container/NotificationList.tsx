import { h,  FunctionalComponent } from "@stencil/core";

import NotificationListItem from "./NotificationListItem";
import { NotificationItem } from "./notifications.machine";

export interface NotificationsListProps {
  notifications: NotificationItem[];
}

const NotificationsList: FunctionalComponent<NotificationsListProps> = ({
  notifications
}) => {
  return (
    <div style={{background: "red", height:"600"}} >
      sdsd
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

export default NotificationsList;
