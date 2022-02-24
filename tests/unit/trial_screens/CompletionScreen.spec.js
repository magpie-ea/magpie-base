import { mount } from '@vue/test-utils'
import Vue from 'vue'
import Experiment from "@/components/Experiment";
import FixationCross from "@/components/stimuli/FixationCross";

test('CompletionScreen', async () => {
    const experiment = mount(Experiment, {
        slots: {
            default: [
                '<CompletionScreen text="One %s fell over three %s."\n' +
                '        :options="[\n' +
                "              ['horse', 'penguin', 'bird'],\n" +
                "              ['icicles', 'trees', 'bushes']\n" +
                '              ]"/>',
                '<Screen>Bye world</Screen>',
            ]
        }
    })

    expect(experiment.text()).toContain('One')
    expect(experiment.text()).toContain('fell over three')

    const selects = experiment.findAll('select')
    expect(selects).toHaveLength(2)

    expect(experiment.find('button').exists()).toBe(false)

    selects.at(0).setValue('horse')
    selects.at(1).setValue('icicles')

    await Vue.nextTick()

    expect(experiment.find('button').exists()).toBe(true)

    experiment.find('button').trigger('click')

    await Vue.nextTick()

    expect(experiment.text()).toContain('Bye world')

    const results = experiment.vm.$magpie.getAllData()
    expect(results).toBeInstanceOf(Array)
    expect(results).toHaveLength(1)
    expect(results[0].response).toBe('One horse fell over three icicles.')
})
