import { mount } from '@vue/test-utils'
import Vue from 'vue'
import Experiment from "@/components/Experiment";
import {states } from '../../../src/Socket'
import {createInteractiveExperiment, magpieConfig} from "../../helpers";

test = process.env.MAGPIE_INTEGRATION_TESTS === 'true'? test : test.skip
let experimentId
if (process.env.MAGPIE_INTEGRATION_TESTS === 'true') {
    beforeEach(async () => {
        experimentId = await createInteractiveExperiment(1)
    })
}
test('ConnectInteractiveScreen', async () => {
    const experiment = mount(Experiment, {
        slots: {
            default: [
                '<ConnectInteractiveScreen>Connecting</ConnectInteractiveScreen>' +
                '<Screen>Connected</Screen>',
            ]
        },
        magpie: {
            ...magpieConfig,
            experimentId,
        }
    })

    expect(experiment.text()).toBe('Connecting')

    while(experiment.vm.$magpie.socket.state !== states.READY) {
        await new Promise(resolve => setTimeout(resolve, 200))
    }

    expect(experiment.text()).toBe('Connected')
})
