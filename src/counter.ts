import { interpret, createMachine, assign } from "@xstate/fsm";

const increment = (context) => context.count + 1;
const decrement = (context) => context.count - 1;

const counterMachine = createMachine({
  initial: 'active',
  id: 'counter',
  context: {
    count: 0
  },
  states: {
    active: {
      on: {
        INC: { actions: assign({ count: increment }) },
        DEC: { actions: assign({ count: decrement }) }
      }
    }
  }
});

export const counterService = interpret(counterMachine)
  
  .start();
