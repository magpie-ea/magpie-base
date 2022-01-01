import { mount } from '@vue/test-utils'
import Vue from 'vue'
import Experiment from "@/components/Experiment";


for (const showOptions of [null, true, false]) {

    test('KeypressInput', async () => {
        const experiment = mount(Experiment, {
            slots: {
                default: [
                    '<Screen>' +
                        '<KeypressInput\n' +
                        (showOptions !== null? `:show-options="${showOptions}"\n` : '')+
                        ':response.sync= "$magpie.measurements.input"\n' +
                        ':keys="{\'~\': \'fries\', \'^\': \'soup\' }" />' +
                    '</Screen>',
                    '<Screen>Bye world</Screen>',
                ]
            },
            attachTo: document.body // in order for keydown listener to work
        })

        if (showOptions === false) {
            expect(experiment.find('.options').exists()).toBeFalsy()
        }else if (showOptions === true || showOptions === null) {
            expect(experiment.find('.options').exists()).toBeTruthy()
        }

        await experiment.trigger('keydown', {key: '~'})
        const expectedValue = 'fries'
        expect(experiment.vm.$magpie.measurements.input).toBe(expectedValue)
        experiment.vm.$magpie.saveAndNextScreen()
        await Vue.nextTick()
        expect(experiment.text()).toBe('Bye world')
        const results = experiment.vm.$magpie.getAllData()
        expect(results).toBeInstanceOf(Array)
        expect(results).toHaveLength(1)
        expect(results[0].input).toBe(expectedValue)

        experiment.destroy()
    })

}
