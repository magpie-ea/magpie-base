import { mount } from '@vue/test-utils'
import Vue from 'vue'
import Experiment from "@/components/Experiment";

test('TextareaInput', async () => {
    const experiment = mount(Experiment, {
        slots: {
            default: [
                '<Screen>' +
                    '<KeypressInput :response.sync= "$magpie.measurements.input" :keys="{\'~\': \'fries\', \'^\': \'soup\' }" />' +
                '</Screen>',
                '<Screen>Bye world</Screen>',
            ]
        },
        attachTo: document.body // in order for keydown listener to work
    })

    await experiment.trigger('keydown', {key: '~'})
    const expectedValue = 'fries'
    expect(experiment.vm.$magpie.measurements.input).toBe(expectedValue)
    experiment.vm.$magpie.saveAndNextScreen()
    await Vue.nextTick()
    expect(experiment.text()).toBe('Bye world')
    const results = experiment.vm.$magpie.getAllData()
    expect(results).toBeInstanceOf(Array)
    expect(results).toHaveLength(1)
    expect(results[0].input).toBe(expectedValue)

    experiment.destroy()
})
