import { mount } from '@vue/test-utils'
import Vue from 'vue'
import Experiment from "@/components/Experiment";

test('CompletionInput', async () => {
    const experiment = mount(Experiment, {
        slots: {
            default: [
                '<Screen>' +
                    '<CompletionInput\n' +
                '          text="One %s fell over three %s."\n' +
                '          :response.sync= "$magpie.measurements.sentence"\n' +
                '          :responses.sync= "$magpie.measurements.words"\n' +
                '          :options="[\n' +
                '              [\'horse\', \'penguin\', \'bird\'],\n' +
                '              [\'icicles\', \'trees\', \'bushes\']\n' +
                '              ]"\n' +
                '          />' +
                '</Screen>',
                '<Screen>Bye world</Screen>',
            ]
        }
    })

    const selects = experiment.findAll('select')

    expect(selects).toHaveLength(2)

    await selects.at(0).setValue('horse')
    expect(experiment.vm.$magpie.measurements.sentence).toBe('One horse fell over three .')
    expect(experiment.vm.$magpie.measurements.words).toStrictEqual(['horse'])

    await selects.at(1).setValue('trees')
    expect(experiment.vm.$magpie.measurements.sentence).toBe('One horse fell over three trees.')
    expect(experiment.vm.$magpie.measurements.words).toStrictEqual(['horse', 'trees'])

    await selects.at(0).setValue('penguin')
    expect(experiment.vm.$magpie.measurements.sentence).toBe('One penguin fell over three trees.')
    expect(experiment.vm.$magpie.measurements.words).toStrictEqual(['penguin', 'trees'])

    experiment.vm.$magpie.saveAndNextScreen()
    await Vue.nextTick()
    expect(experiment.text()).toBe('Bye world')
    const results = experiment.vm.$magpie.getAllData()
    expect(results).toBeInstanceOf(Array)
    expect(results).toHaveLength(1)
    expect(results[0].sentence).toBe('One penguin fell over three trees.')
    expect(results[0].words).toBe('penguin|trees')
})
