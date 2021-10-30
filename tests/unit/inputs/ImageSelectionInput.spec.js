import { mount } from '@vue/test-utils'
import Vue from 'vue'
import Experiment from "@/components/Experiment";

test('ImageSelectionInput', async () => {
    const experiment = mount(Experiment, {
        slots: {
            default: [
                '<Screen>' +
                '<ImageSelectionInput\n' +
                '            :options="[\n' +
                '                {src: \'img/fries.jpg\', label: \'fries\'},\n' +
                '                {src: \'img/soup.jpg\', label: \'soup\' }]"\n' +
                '            :response.sync="$magpie.measurements.image_choice"\n' +
                '        />' +
                '</Screen>',
                '<Screen>Bye world</Screen>',
            ]
        }
    })

    const options = experiment.findAll('.option')

    expect(options).toHaveLength(2)

    await options.at(0).trigger('click')
    expect(experiment.vm.$magpie.measurements.image_choice).toBe('fries')
    await options.at(1).trigger('click')
    expect(experiment.vm.$magpie.measurements.image_choice).toBe('soup')

    experiment.vm.$magpie.saveAndNextScreen()
    await Vue.nextTick()
    expect(experiment.text()).toBe('Bye world')
    const results = experiment.vm.$magpie.getAllData()
    expect(results).toBeInstanceOf(Array)
    expect(results).toHaveLength(1)
    expect(results[0].image_choice).toBe('soup')
})
