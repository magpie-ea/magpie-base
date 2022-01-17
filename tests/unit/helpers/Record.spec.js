import { mount } from '@vue/test-utils'
import Vue from 'vue'
import Experiment from "@/components/Experiment";

test('Manually record data', async () => {
    const experiment = mount(Experiment, {
        slots: {
            default: [
                '<Screen>Hello World<Record :data="{foo: \'bar\'}" /></Screen>',
                '<Screen>Bye World</Screen>',
            ]
        }
    })

    expect(experiment.text()).toBe('Hello World')
    experiment.vm.$magpie.saveAndNextScreen()
    const results = experiment.vm.$magpie.getAllData()
    expect(results).toHaveLength(1)
    expect(results[0].foo).toEqual('bar')
})


test('Manually record global data', async () => {
    const experiment = mount(Experiment, {
        slots: {
            default: [
                '<Screen>Hello World<Record global :data="{foo: \'bar\'}" /></Screen>',
                '<Screen>Bye World</Screen>',
                '<Screen>Good bye</Screen>',
            ]
        }
    })

    expect(experiment.text()).toBe('Hello World')
    experiment.vm.$magpie.saveAndNextScreen()
    await Vue.nextTick()
    expect(experiment.text()).toBe('Bye World')
    experiment.vm.$magpie.saveAndNextScreen()
    await Vue.nextTick()
    const results = experiment.vm.$magpie.getAllData()
    expect(results).toHaveLength(2)
    expect(results[0].foo).toEqual('bar')
    expect(results[1].foo).toEqual('bar')
})
