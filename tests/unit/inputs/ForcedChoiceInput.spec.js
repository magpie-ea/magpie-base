import { mount } from '@vue/test-utils'
import Vue from 'vue'
import Experiment from "@/components/Experiment";

test('ForcedChoiceInput', async () => {
    const experiment = mount(Experiment, {
        slots: {
            default: [
                '<Screen>' +
                '<ForcedChoiceInput\n' +
                '            :response.sync= "$magpie.measurements.bread"\n' +
                '            :options="[\'ham\', \'jam\', \'spam\']" />' +
                '</Screen>',
                '<Screen>Bye world</Screen>',
            ]
        }
    })

    const options = experiment.findAll('.option')

    expect(options).toHaveLength(3)

    await options.at(0).trigger('click')
    expect(experiment.vm.$magpie.measurements.bread).toBe('ham')
    await options.at(1).trigger('click')
    expect(experiment.vm.$magpie.measurements.bread).toBe('jam')
    await options.at(2).trigger('click')
    expect(experiment.vm.$magpie.measurements.bread).toBe('spam')

    experiment.vm.$magpie.saveAndNextScreen()
    await Vue.nextTick()
    expect(experiment.text()).toBe('Bye world')
    const results = experiment.vm.$magpie.getAllData()
    expect(results).toBeInstanceOf(Array)
    expect(results).toHaveLength(1)
    expect(results[0].bread).toBe('spam')
})
