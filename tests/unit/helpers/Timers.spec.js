import { mount } from '@vue/test-utils'
import Vue from 'vue'
import Experiment from "@/components/Experiment";

test('TimerStart and TimerStop', async () => {
    const experiment = mount(Experiment, {
        slots: {
            default: [
                '<Screen>' +
                    '<Slide>Hello World' +
                    '<TimerStart id="timer1" />' +
                    '</Slide>' +
                    '<Slide>Hello you' +
                    '<TimerStop id="timer1" :time.sync="$magpie.measurements.time" />' +
                    '</Slide>' +
                '</Screen>',
                '<Screen>Bye world</Screen>',
            ]
        }
    })

    expect(experiment.text()).toBe('Hello World')
    await new Promise(resolve => setTimeout(resolve, 200))
    experiment.vm.$magpie.nextSlide()
    await Vue.nextTick()
    expect(experiment.text()).toBe('Hello you')
    experiment.vm.$magpie.saveAndNextScreen()
    await Vue.nextTick()
    expect(experiment.text()).toBe('Bye world')

    const results = experiment.vm.$magpie.getAllData()
    expect(results).toBeInstanceOf(Array)
    expect(results).toHaveLength(1)
    expect(results[0].time/1000).toBeCloseTo(200 / 1000, 1)
})
