import { mount } from '@vue/test-utils'
import Vue from 'vue'
import Experiment from "@/components/Experiment";

test('TextareaInput', async () => {
    const experiment = mount(Experiment, {
        slots: {
            default: [
                '<Screen>' +
                    '<TextareaInput :response.sync= "$magpie.measurements.input" />' +
                '</Screen>',
                '<Screen>Bye world</Screen>',
            ]
        }
    })

    const textarea = experiment.find('textarea')
    const value = 'new text value'
    await textarea.setValue(value)
    expect(experiment.vm.$magpie.measurements.input).toBe(value)
    experiment.vm.$magpie.saveAndNextScreen()
    await Vue.nextTick()
    expect(experiment.text()).toBe('Bye world')
    const results = experiment.vm.$magpie.getAllData()
    expect(results).toBeInstanceOf(Array)
    expect(results).toHaveLength(1)
    expect(results[0].experiment_end_time).toBeLessThanOrEqual(Date.now())
    expect(results[0].experiment_start_time).toBeLessThanOrEqual(results[0].experiment_end_time)
    expect(results[0].experiment_duration).toBe(results[0].experiment_end_time - results[0].experiment_start_time)
    expect(results[0].experiment_duration).toBe(results[0].experiment_end_time - results[0].experiment_start_time)
    expect(results[0].input).toBe(value)
})
