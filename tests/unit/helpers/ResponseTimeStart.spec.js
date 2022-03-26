import { mount } from '@vue/test-utils'
import Vue from 'vue'
import Experiment from "@/components/Experiment";

test('ResponseTimeStart', async () => {
    const experiment = mount(Experiment, {
        slots: {
            default: [
                '<Screen>' +
                '<Slide>Hello World</Slide>' +
                '<Slide><ResponseTimeStart /></Slide>' +
                '</Screen>',
                '<Screen>Bye World</Screen>',
            ]
        }
    })

    expect(experiment.text()).toBe('Hello World')
    await new Promise(resolve => setTimeout(resolve, 200))
    experiment.vm.$magpie.nextSlide()
    await new Promise(resolve => setTimeout(resolve, 200))
    experiment.vm.$magpie.saveAndNextScreen()
    const results = experiment.vm.$magpie.getAllData()
    expect(results).toHaveLength(1)
    expect(results[0].responseTime / 1000).toBeCloseTo(200 / 1000, 1)
})
