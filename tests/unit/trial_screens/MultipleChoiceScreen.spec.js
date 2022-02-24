import { mount } from '@vue/test-utils'
import Vue from 'vue'
import Experiment from "@/components/Experiment";
import FixationCross from "@/components/stimuli/FixationCross";

test('MultipleChoiceScreen', async () => {
    const experiment = mount(Experiment, {
        slots: {
            default: [
                '<MultipleChoiceScreen\n' +
                '        question="How was your breakfast?"\n' +
                '        :options="[\'Not enjoyable\', \'Rather not enjoyable\', \'OK\', \'Rather enjoyable\', \'Really enjoyable\']"\n' +
                '    />',
                '<Screen>Bye world</Screen>',
            ]
        }
    })

    expect(experiment.text()).toContain('How was your breakfast?')
    expect(experiment.text()).toContain('Not enjoyable')
    expect(experiment.text()).toContain('Really enjoyable')

    const inputs = experiment.findAll('input')
    expect(inputs).toHaveLength(5)

    expect(experiment.find('button').exists()).toBe(false)

    inputs.at(2).trigger('click')

    await Vue.nextTick()

    expect(experiment.find('button').exists()).toBe(true)

    experiment.find('button').trigger('click')

    await Vue.nextTick()

    expect(experiment.text()).toContain('Bye world')

    const results = experiment.vm.$magpie.getAllData()
    expect(results).toBeInstanceOf(Array)
    expect(results).toHaveLength(1)
    expect(results[0].response).toBe('OK')
})
