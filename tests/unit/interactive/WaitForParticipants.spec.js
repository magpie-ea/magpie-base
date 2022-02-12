import { mount } from '@vue/test-utils'
import Vue from 'vue'
import Experiment from "@/components/Experiment";
import {EVENT_SCREEN_PRESENCE, states} from '../../../src/Socket'
import {createInteractiveExperiment, magpieConfig} from "../../helpers";
import {EVENT_CHAT_MESSAGE} from "@/components/interactive/Chat";

test = process.env.MAGPIE_INTEGRATION_TESTS === 'true'? test : test.skip

test('WaitForParticipants', async () => {
    const experimentId = await createInteractiveExperiment(2)
    const experiment1 = mount(Experiment, {
        slots: {
            default: [
                '<ConnectInteractiveScreen>Connecting</ConnectInteractiveScreen>' +
                '<Screen>' +
                'Connected' +
                '</Screen>' +
                '<Screen>' +
                '<Slide>' +
                'All alone' +
                '<WaitForParticipants :number="2" @done="$magpie.nextSlide()" />'+
                '</Slide>'+
                '<Slide>All here</Slide>'+
                '</Screen>'
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
                '</Screen>'+
                '<Screen>' +
                'Second screen' +
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

    while(experiment1.vm.$magpie.socket.state !== states.READY ||
        experiment2.vm.$magpie.socket.state !== states.READY) {
        await new Promise(resolve => setTimeout(resolve, 200))
    }

    expect(experiment1.text()).toContain('Connected')
    expect(experiment2.text()).toContain('Connected')

    experiment1.vm.$magpie.nextScreen()
    await Vue.nextTick()

    expect(experiment1.text()).toContain('All alone')

    experiment2.vm.$magpie.nextScreen()
    await Vue.nextTick()

    expect(experiment2.text()).toContain('Second screen')

    while (experiment1.vm.$magpie.socket.active.length !== 2) {
        await new Promise(resolve => setTimeout(resolve, 200))
    }

    await Vue.nextTick()

    expect(experiment1.text()).toContain('All here')
})
