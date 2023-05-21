import { mount } from '@vue/test-utils'
import Vue from 'vue'
import Experiment from "@/components/Experiment";

test('RatingInput', async () => {
    const experiment = mount(Experiment, {
        slots: {
            default: [
                '<Screen>' +
                '<RatingInput\n' +
                '          left="No"\n' +
                '          :response.sync= "$magpie.measurements.input"\n' +
                '          right="Yes" />' +
                '</Screen>',
                '<Screen>Bye world</Screen>',
            ]
        }
    })

    const inputs = experiment.findAll('input')

    expect(inputs).toHaveLength(7)

    await inputs.at(0).trigger('input')
    expect(experiment.vm.$magpie.measurements.input).toBe(1)
    await inputs.at(1).trigger('input')
    expect(experiment.vm.$magpie.measurements.input).toBe(2)

    experiment.vm.$magpie.saveAndNextScreen()
    await Vue.nextTick()
    expect(experiment.text()).toBe('Bye world')
    const results = experiment.vm.$magpie.getAllData()
    expect(results).toBeInstanceOf(Array)
    expect(results).toHaveLength(1)
    expect(results[0].input).toBe(2)
})

