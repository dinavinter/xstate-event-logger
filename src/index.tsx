/* @jsx h */
import { h, Component, State, Host } from "@stencil/core";
import {interpret} from "@xstate/fsm";
import {lightMachine} from "./light.machine";
import {notificationMachine} from "./notifications.machine";
import {serviceLoggerMachine} from "./logger.service.listener.machine";

@Component({
  tag: "my-counter",
  styleUrl: "index.scss",
  shadow: true,
})
export class MyCounter {
  private lightService = interpret(lightMachine);
  @State() notificationService = interpret(notificationMachine);
  @State() serviceLogger = interpret(serviceLoggerMachine);

  @State() state = this.notificationService.state;

  @State() count: number = 0;

  inc() {

      this.lightService.send("TIMER" )
  }

  dec() {
    this.lightService.send("TIMER" )

  }
  componentWillLoad() {
    // this._service = this._logger.state.context.logger;
    this.state= this.notificationService.state;
   
    this.notificationService.subscribe(state => {
      this.state = state;
    });
    this.notificationService.start();
    this.lightService.start();
    // this.serviceLogger= ServiceLogger(this.notificationService);
    this.serviceLogger.start();
    this.serviceLogger.send({type:'SPY', service: this.lightService});
    this.serviceLogger.send({type:'ENABLE', logger: this.notificationService});
  }

  disconnectedCallback() {
    this.lightService.stop();
  }


  render() {
    return (
        <Host>
          <button onClick={this.inc.bind(this)}>-</button>
          <span>{JSON.stringify(this.state.context.notifications)}</span>
          <button onClick={this.dec.bind(this)}>+</button>
        </Host>
    );
  }
}
