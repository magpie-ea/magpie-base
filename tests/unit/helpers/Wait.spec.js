import { mount } from '@vue/test-utils'
import Vue from 'vue'
import Experiment from "@/components/Experiment";

test('Slide with Wait', async () => {
    const experiment = mount(Experiment, {
        slots: {
            default: [
                '<Screen>' +
                    '<Slide>Hello world<Wait :time="500" @done="$magpie.nextSlide()" /></Slide>' +
                    '<Slide>Hello you<Wait :time="500" @done="$magpie.nextScreen()" /></Slide>' +
                '</Screen>',
                '<Screen>Bye world</Screen>',
            ]
        }
    })

    expect(experiment.text()).toBe('Hello world')
    await new Promise(resolve => setTimeout(resolve, 600))
    expect(experiment.text()).toBe('Hello you')
    await new Promise(resolve => setTimeout(resolve, 600))
    expect(experiment.text()).toBe('Bye world')
})

test('Slide with Wait with key', async () => {
    const experiment = mount(Experiment, {
        slots: {
            default: [
                '<Screen>' +
                '<Slide>Hello world<Wait key="wait1" :time="500" @done="$magpie.nextSlide()" /></Slide>' +
                '<Slide>Hello you<Wait key="wait2" :time="500" @done="$magpie.nextScreen()" /></Slide>' +
                '</Screen>',
                '<Screen>Bye world</Screen>',
            ]
        }
    })

    expect(experiment.text()).toBe('Hello world')
    await new Promise(resolve => setTimeout(resolve, 600))
    expect(experiment.text()).toBe('Hello you')
    await new Promise(resolve => setTimeout(resolve, 600))
    expect(experiment.text()).toBe('Bye world')
})
