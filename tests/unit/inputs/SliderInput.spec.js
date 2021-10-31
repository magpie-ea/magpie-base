import { mount } from '@vue/test-utils'
import Vue from 'vue'
import Experiment from "@/components/Experiment";
import Slider from "vue-slider-component";

for (const initial of [null, 5]) {

    test('RatingInput', async () => {
        const experiment = mount(Experiment, {
            slots: {
                default: [
                    '<Screen>' +
                    '<SliderInput\n' +
                    '            left="Yes"\n' +
                    '            right="No"\n' +
                    (initial !== null? ':initial='+initial : '') +
                    '            :response.sync= "$magpie.measurements.input" />' +
                    '</Screen>',
                    '<Screen>Bye world</Screen>',
                ]
            }
        })

        const slider = experiment.getComponent(Slider)

        if (initial) {
            expect(slider.vm.value).toBe(5)
        }

        slider.vm.setValue(1)
        await Vue.nextTick()
        expect(experiment.vm.$magpie.measurements.input).toBe(1)

        slider.vm.setValue(2)
        await Vue.nextTick()
        expect(experiment.vm.$magpie.measurements.input).toBe(2)

        experiment.vm.$magpie.saveAndNextScreen()
        await Vue.nextTick()
        expect(experiment.text()).toBe('Bye world')
        const results = experiment.vm.$magpie.getAllData()
        expect(results).toBeInstanceOf(Array)
        expect(results).toHaveLength(1)
        expect(results[0].input).toBe(2)
    })

}
