import { mount } from '@vue/test-utils'
import Vue from 'vue'
import Experiment from "@/components/Experiment";
import {states } from '../../../src/Socket'
import {createInteractiveExperiment, magpieConfig} from "../../helpers";

test = process.env.MAGPIE_INTEGRATION_TESTS === 'true'? test : test.skip

test('ConnectInteractiveScreen', async () => {
    const experimentId = await createInteractiveExperiment(1)
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

test('ConnectInteractiveScreen with two clients', async () => {
    const experimentId = await createInteractiveExperiment(2)

    const experiment1 = mount(Experiment, {
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

    expect(experiment1.text()).toBe('Connecting')

    const experiment2 = mount(Experiment, {
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

    expect(experiment2.text()).toBe('Connecting')

    while(
        experiment1.vm.$magpie.socket.state !== states.READY ||
        experiment2.vm.$magpie.socket.state !== states.READY
        ) {
        await new Promise(resolve => setTimeout(resolve, 200))
    }

    expect(experiment1.text()).toBe('Connected')
    expect(experiment2.text()).toBe('Connected')
})
