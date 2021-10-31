import { mount } from '@vue/test-utils'
import Vue from 'vue'
import Experiment from "@/components/Experiment";

test('Basic Experiment', async () => {
    const experiment = mount(Experiment, {
        slots: {
            default: ['<Screen>Hello World</Screen>']
        }
    })

    expect(experiment.text()).toBe('Hello World')
})

test('Two-screen Experiment', async () => {
    const experiment = mount(Experiment, {
        slots: {
            default: [
                '<Screen>Hello World</Screen>',
                '<Screen>Bye World</Screen>',
            ]
        }
    })

    expect(experiment.text()).toBe('Hello World')
    experiment.vm.$magpie.nextScreen()
    await Vue.nextTick()
    expect(experiment.text()).toBe('Bye World')
})

test('Many-screen Experiment', async () => {
    const experiment = mount(Experiment, {
        slots: {
            default: [
                '<template v-for="i in 3">' +
                '<Screen>Hello World</Screen>'+
                '<Screen>Bye World</Screen>' +
                '</template>',
            ]
        }
    })

    expect(experiment.text()).toBe('Hello World')
    experiment.vm.$magpie.nextScreen()
    await Vue.nextTick()
    expect(experiment.text()).toBe('Bye World')

    experiment.vm.$magpie.nextScreen()
    await Vue.nextTick()

    expect(experiment.text()).toBe('Hello World')
    experiment.vm.$magpie.nextScreen()
    await Vue.nextTick()
    expect(experiment.text()).toBe('Bye World')

    experiment.vm.$magpie.nextScreen()
    await Vue.nextTick()

    expect(experiment.text()).toBe('Hello World')
    experiment.vm.$magpie.nextScreen()
    await Vue.nextTick()
    expect(experiment.text()).toBe('Bye World')
})

test('Screen with next button', async () => {
    const experiment = mount(Experiment, {
        slots: {
            default: [
                '<Screen>Hello World <button @click="$magpie.nextScreen()"></button></Screen>',
                '<Screen>Bye World</Screen>',
            ]
        }
    })

    expect(experiment.text()).toBe('Hello World')
    await experiment.find('button').trigger('click')
    expect(experiment.text()).toBe('Bye World')
})
