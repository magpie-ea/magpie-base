import { mount } from '@vue/test-utils'
import Vue from 'vue'
import Experiment from "@/components/Experiment";
import {states } from '../../../src/Socket'
import {createInteractiveExperiment, magpieConfig} from "../../helpers";
import {EVENT_CHAT_MESSAGE} from "@/components/interactive/Chat";

test = process.env.MAGPIE_INTEGRATION_TESTS === 'true'? test : test.skip

test('Chat', async () => {
    const experimentId = await createInteractiveExperiment(2)
    const experiment1 = mount(Experiment, {
        slots: {
            default: [
                '<ConnectInteractiveScreen>Connecting</ConnectInteractiveScreen>' +
                '<Screen>' +
                'Connected' +
                '<Chat :messages.sync="$magpie.measurements.messages" />' +
                '</Screen>',
            ]
        },
        magpie: {
            ...magpieConfig,
            experimentId,
        }
    })

    const experiment2 = mount(Experiment, {
        slots: {
            default: [
                '<ConnectInteractiveScreen>Connecting</ConnectInteractiveScreen>' +
                '<Screen>' +
                'Connected' +
                '<Chat :messages.sync="$magpie.measurements.messages" />' +
                '</Screen>',
            ]
        },
        magpie: {
            ...magpieConfig,
            experimentId,
        }
    })

    expect(experiment1.text()).toBe('Connecting')
    expect(experiment2.text()).toBe('Connecting')

    while(experiment1.vm.$magpie.socket.state !== states.READY) {
        await new Promise(resolve => setTimeout(resolve, 200))
    }

    expect(experiment1.text()).toContain('Connected')
    expect(experiment2.text()).toContain('Connected')

    experiment1.find('textarea').setValue('My first message')
    experiment1.find('button').trigger('click')

    await new Promise(resolve => experiment2.vm.$magpie.socket.once(EVENT_CHAT_MESSAGE, resolve))
    await Vue.nextTick()

    const messages = experiment2.vm.$magpie.measurements.messages
    expect(messages).not.toHaveLength(0)
    expect(messages[messages.length - 1].event).toBe('message')
    expect(messages[messages.length - 1].message).toBe('My first message')
})
