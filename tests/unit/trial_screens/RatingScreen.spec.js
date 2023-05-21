import { mount } from '@vue/test-utils'
import Vue from 'vue'
import Experiment from "@/components/Experiment";
import FixationCross from "@/components/stimuli/FixationCross";

test('RatingScreen', async () => {
    const experiment = mount(Experiment, {
        slots: {
            default: [
                '<RatingScreen\n' +
                '       question="How healthy do you usually eat?"\n' +
                '        option-left="Very healthy"\n' +
                '        option-right="Very unhealthy"' +
                '    />',
                '<Screen>Bye world</Screen>',
            ]
        }
    })

    expect(experiment.text()).toContain('How healthy do you usually eat?')
    expect(experiment.text()).toContain('Very healthy')
    expect(experiment.text()).toContain('Very unhealthy')

    const inputs = experiment.findAll('input')
    expect(inputs).toHaveLength(7)

    expect(experiment.find('button').exists()).toBe(false)

    inputs.at(2).trigger('input')

    await Vue.nextTick()

    expect(experiment.find('button').exists()).toBe(true)

    experiment.find('button').trigger('click')

    await Vue.nextTick()

    expect(experiment.text()).toContain('Bye world')

    const results = experiment.vm.$magpie.getAllData()
    expect(results).toBeInstanceOf(Array)
    expect(results).toHaveLength(1)
    expect(results[0].response).toBe(3)
})
