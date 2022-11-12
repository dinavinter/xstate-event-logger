/* @jsx h */
import { h, Component, State, Host } from "@stencil/core";
import {interpret} from "@xstate/fsm";
import {serviceCollectionLogger} from "./logger.service.collection";
import {lightMachine} from "./light.machine";
import {notificationMachine} from "./notifications.machine";
import { counterService } from "./counter";
 
@Component({
  tag: "my-counter",
  styleUrl: "index.scss",
  shadow: true,
})
export class MyCounter {
  private lightService = interpret(lightMachine);
  private counterService = counterService;

  @State() notificationService = interpret(notificationMachine);
  @State() serviceLogger = interpret(serviceCollectionLogger);

  @State() state = this.notificationService.state;

  @State() count: number = 0;

  disable() {
    this.serviceLogger.send({type:'DISABLE'});

  }
  enable() {
    this.serviceLogger.send({type:'ENABLE', logger: this.notificationService});
 
  }

  send() {
    this.lightService.send("TIMER" ) 

  }

 spyConunter() {
    this.serviceLogger.send({type:'SPY', service: this.counterService});

  }

 disconnetConunter() {
    this.serviceLogger.send({type:'DISCONNECT', service: this.counterService});

  }
  inc() {
    this.counterService.send("INC" ) 

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
    this.serviceLogger.send({type:'ENABLE', logger: this.notificationService});
    this.serviceLogger.send({type:'SPY', service: this.lightService});
  }

  disconnectedCallback() {
    this.lightService.stop();
  }


  render() {
    return (
        <Host>
           
         <div>
          <button onClick={this.disable.bind(this)}>disable</button>
          <button onClick={this.enable.bind(this)}>enable</button>

          <button onClick={this.send.bind(this)}> light</button>

          </div>

  

           <span>{JSON.stringify(this.state.context.notifications)}</span>

          <div>
             
             <button onClick={this.inc.bind(this)}> inc</button>
             <button onClick={this.spyConunter.bind(this)}> spy</button>
             <button onClick={this.disconnetConunter.bind(this)}> disconnect</button>


           </div>
        </Host>
    );
  }
}
