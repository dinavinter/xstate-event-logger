import { h, Component, State, Host } from "@stencil/core";
import {notificationMachine} from "./notifications.machine";
import {interpret} from "@xstate/fsm";
import NotificationList from "./NotificationList";

@Component({
  tag: 'notifications-container',
  styleUrl: 'notifications-container.css',
  shadow: true,
})




export class NotificationsContainer {

  private _service = interpret(notificationMachine);

  @State() state = notificationMachine.initialState;

  componentWillLoad() {
    this._service.subscribe(state => {
      this.state = state;
    });

    this._service.start();
  }

  disconnectedCallback() {
    this._service.stop();
  }



  render() {
    const { send } = this._service;

    return (
      <Host>
        <button  onClick={() => send({type:"ADD", notification:{title:"abc"}})}>
          Send
        </button>
       <div>Hello, World! I'm container</div>
        <NotificationList
          notifications={this.state?.context?.notifications!}
        />,


      </Host>
    );
  }
}
