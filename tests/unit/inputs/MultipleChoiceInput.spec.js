import { mount } from '@vue/test-utils'
import Vue from 'vue'
import Experiment from "@/components/Experiment";

for (const labels of [null, true, false]) {
    for (const orientation of [null, 'vertical', 'horizontal']) {

        test('MultipleChoiceInput orientation='+orientation+', labels='+labels, async () => {
            const experiment = mount(Experiment, {
                slots: {
                    default: [
                        '<Screen>' +
                        '<MultipleChoiceInput\n' +
                        (orientation !== null? 'orientation="'+orientation+'"' : '') +
                        (labels !== null? ':labels="'+labels+'"' : '') +
                        '            :response.sync= "$magpie.measurements.breakfast"\n' +
                        '            :options="[\'Not enjoyable\', \'Rather not enjoyable\', \'OK\', \'Rather enjoyable\', \'Really enjoyable\']" />' +
                        '</Screen>',
                        '<Screen>Bye world</Screen>',
                    ]
                }
            })

            const inputs = experiment.findAll('input')

            expect(inputs).toHaveLength(5)

            await inputs.at(0).trigger('click')
            expect(experiment.vm.$magpie.measurements.breakfast).toBe('Not enjoyable')
            await inputs.at(1).trigger('click')
            expect(experiment.vm.$magpie.measurements.breakfast).toBe('Rather not enjoyable')

            experiment.vm.$magpie.saveAndNextScreen()
            await Vue.nextTick()
            expect(experiment.text()).toBe('Bye world')
            const results = experiment.vm.$magpie.getAllData()
            expect(results).toBeInstanceOf(Array)
            expect(results).toHaveLength(1)
            expect(results[0].breakfast).toBe('Rather not enjoyable')
        })

        test('MultipleChoiceInput with HTML, orientation='+orientation+', labels='+labels, async () => {
            const experiment = mount(Experiment, {
                slots: {
                    default: [
                        '<Screen>' +
                        '<MultipleChoiceInput\n' +
                        (orientation !== null? 'orientation="'+orientation+'"' : '') +
                        (labels !== null? ':labels="'+labels+'"' : '') +
                        '            :response.sync= "$magpie.measurements.breakfast"\n' +
                        '            :options="[\'Not enjoyable\', \'Rather not enjoyable\', \'OK\', \'Rather enjoyable\', \'Really enjoyable\']"' +
                        '            :options-html="[\'Not <strong>enjoyable</strong>\', \'Rather not <strong>enjoyable</strong>\', \'OK\', \'<strong>Rather</strong> enjoyable\', \'<strong>Really</strong> enjoyable\']" />' +
                        '</Screen>',
                        '<Screen>Bye world</Screen>',
                    ]
                }
            })

            const inputs = experiment.findAll('input')

            if (labels) {
                expect(experiment.text()).toContain('Not enjoyable')
                expect(experiment.text()).toContain('Rather not enjoyable')
                expect(experiment.text()).toContain('OK')
                expect(experiment.text()).toContain('Rather enjoyable')
                expect(experiment.text()).toContain('Really enjoyable')
                expect(experiment.findAll('strong')).toHaveLength(4)
            }

            expect(inputs).toHaveLength(5)

            await inputs.at(0).trigger('click')
            expect(experiment.vm.$magpie.measurements.breakfast).toBe('Not enjoyable')
            await inputs.at(1).trigger('click')
            expect(experiment.vm.$magpie.measurements.breakfast).toBe('Rather not enjoyable')

            experiment.vm.$magpie.saveAndNextScreen()
            await Vue.nextTick()
            expect(experiment.text()).toBe('Bye world')
            const results = experiment.vm.$magpie.getAllData()
            expect(results).toBeInstanceOf(Array)
            expect(results).toHaveLength(1)
            expect(results[0].breakfast).toBe('Rather not enjoyable')
        })

    }
}
