import { mount } from '@vue/test-utils'
import Vue from 'vue'
import Experiment from "@/components/Experiment";
import FixationCross from "@/components/stimuli/FixationCross";

test('TextareaScreen', async () => {
    const experiment = mount(Experiment, {
        slots: {
            default: [
                '<TextareaScreen\n' +
                '        question="What do you usually eat?"\n' +
                '    />',
                '<Screen>Bye world</Screen>',
            ]
        }
    })

    expect(experiment.text()).toContain('What do you usually eat?')

    const textarea = experiment.find('textarea')
    expect(textarea.exists()).toBe(true)

    expect(experiment.find('button').exists()).toBe(false)

    textarea.setValue('Cabbage')

    await Vue.nextTick()

    expect(experiment.find('button').exists()).toBe(true)

    experiment.find('button').trigger('click')

    await Vue.nextTick()

    expect(experiment.text()).toContain('Bye world')

    const results = experiment.vm.$magpie.getAllData()
    expect(results).toBeInstanceOf(Array)
    expect(results).toHaveLength(1)
    expect(results[0].response).toBe('Cabbage')
})
