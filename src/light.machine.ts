import { createMachine, assign} from '@xstate/fsm';

export const lightMachine = createMachine({
    id: 'light',
    initial: 'green',
    context: { redLights: 0 },
    states: {
        green: {
            on: {
                TIMER: 'yellow'
            }
        },
        yellow: {
            on: {
                TIMER: {
                    target: 'red',
                    actions: () => console.log('Going to red!')
                }
            }
        },
        red: {
            entry: assign({ redLights: (ctx:any) => ctx.redLights + 1 }),
            on: {
                TIMER: 'green'
            }
        }
    }
});