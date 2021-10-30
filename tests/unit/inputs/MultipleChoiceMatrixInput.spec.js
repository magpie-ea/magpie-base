import { mount } from '@vue/test-utils'
import Vue from 'vue'
import Experiment from "@/components/Experiment";

test('MultipleChoiceMatrixInput', async () => {
    const experiment = mount(Experiment, {
        slots: {
            default: [
                '<Screen>' +
                '<MultipleChoiceMatrixInput\n' +
                '            :options="[\'Not enjoyable\', \'Rather not enjoyable\', \'OK\', \'Rather enjoyable\', \'Really enjoyable\']"\n' +
                '            :questions="[\n' +
                '              \'How is the weather today?\',\n' +
                '              \'How was your breakfast today?\',\n' +
                '              \'How do you like your job?\',\n' +
                '              \'What is your opinion of television?\',\n' +
                '              \'What is your opinion of folk music?\'\n' +
                '            ]"\n' +
                '            :responses.sync= "$magpie.measurements.responses"\n' +
                '        />' +
                '</Screen>',
                '<Screen>Bye world</Screen>',
            ]
        }
    })

    const inputs = experiment.findAll('input')

    expect(inputs).toHaveLength(5*5)

    await inputs.at(0).trigger('click')
    expect(experiment.vm.$magpie.measurements.responses).toStrictEqual(['Not enjoyable'])
    await inputs.at(5*1+1).trigger('click')
    expect(experiment.vm.$magpie.measurements.responses).toStrictEqual(['Not enjoyable', 'Rather not enjoyable'])
    await inputs.at(5*2+2).trigger('click')
    expect(experiment.vm.$magpie.measurements.responses).toStrictEqual(['Not enjoyable', 'Rather not enjoyable', 'OK'])
    await inputs.at(5*3+3).trigger('click')
    expect(experiment.vm.$magpie.measurements.responses).toStrictEqual(['Not enjoyable', 'Rather not enjoyable', 'OK', 'Rather enjoyable'])
    await inputs.at(5*4+4).trigger('click')
    expect(experiment.vm.$magpie.measurements.responses).toStrictEqual(['Not enjoyable', 'Rather not enjoyable', 'OK', 'Rather enjoyable', 'Really enjoyable'])


    experiment.vm.$magpie.saveAndNextScreen()
    await Vue.nextTick()
    expect(experiment.text()).toBe('Bye world')
    const results = experiment.vm.$magpie.getAllData()
    expect(results).toBeInstanceOf(Array)
    expect(results).toHaveLength(1)
    expect(results[0].responses).toBe('Not enjoyable|Rather not enjoyable|OK|Rather enjoyable|Really enjoyable')
})
