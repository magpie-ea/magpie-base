import { mount } from '@vue/test-utils'
import Vue from 'vue'
import Experiment from "@/components/Experiment";

test('Screen with title', async () => {
    const experiment = mount(Experiment, {
        slots: {
            default: [
                '<Screen title="Hello world"></Screen>'
            ]
        }
    })

    expect(experiment.text()).toBe('Hello world')
})


test('Screen with slides', async () => {
    const experiment = mount(Experiment, {
        slots: {
            default: [
                '<Screen>' +
                    '<Slide>Hello world</Slide>' +
                    '<Slide>Hello you</Slide>' +
                '</Screen>',
                '<Screen>Bye world</Screen>',
            ]
        }
    })

    expect(experiment.text()).toBe('Hello world')
    experiment.vm.$magpie.nextSlide()
    await Vue.nextTick()
    expect(experiment.text()).toBe('Hello you')
    experiment.vm.$magpie.nextScreen()
    await Vue.nextTick()
    expect(experiment.text()).toBe('Bye world')
})

