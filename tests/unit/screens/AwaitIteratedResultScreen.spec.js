import { mount } from '@vue/test-utils'
import Vue from 'vue'
import Experiment from "@/components/Experiment";
import {states } from '../../../src/Socket'
import {createDynamicExperiment, createInteractiveExperiment, magpieConfig} from "../../helpers";

jest.setTimeout(25000)

test = process.env.MAGPIE_INTEGRATION_TESTS === 'true'? test : test.skip

test('AwaitIteratedResultScreen with two clients', async () => {
    const experimentId = await createDynamicExperiment(1,1, 2, 1)

    const experiment1 = mount(Experiment, {
        slots: {
            default: [
                '<AwaitIteratedResultScreen>Connecting</AwaitIteratedResultScreen>' +
                '<Screen>Connected</Screen>',
                '<SubmitResultsScreen />',
            ]
        },
        magpie: {
            ...magpieConfig,
            experimentId,
        }
    })

    expect(experiment1.text()).toBe('Connecting')

    while(experiment1.vm.$magpie.socket.iteratedState !== states.READY) {
        await new Promise(resolve => setTimeout(resolve, 200))
    }

    expect(experiment1.text()).toBe('Connected')

    const experiment2 = mount(Experiment, {
        slots: {
            default: [
                '<AwaitIteratedResultScreen>Connecting</AwaitIteratedResultScreen>' +
                '<Screen>Connected</Screen>',
            ]
        },
        magpie: {
            ...magpieConfig,
            experimentId,
        }
    })

    expect(experiment2.text()).toBe('Connecting')

    while(experiment2.vm.$magpie.socket.state !== states.READY) {
        await new Promise(resolve => setTimeout(resolve, 200))
    }

    expect(experiment1.vm.$magpie.socket.generation).not.toBe(experiment2.vm.$magpie.socket.generation)

    expect(experiment1.text()).toBe('Connected')
    expect(experiment2.text()).toBe('Connecting')

    experiment1.vm.$magpie.measurements.response = 'foobar'
    experiment1.vm.$magpie.saveAndNextScreen()

    while(experiment1.vm.$magpie.currentSlideIndex !== 1) {
        await new Promise(resolve => setTimeout(resolve, 200))
    }

    expect(experiment1.text()).toContain('All done')

    while(experiment2.vm.$magpie.socket.iteratedState !== states.READY) {
        await new Promise(resolve => setTimeout(resolve, 200))
    }

    await Vue.nextTick()

    expect(experiment2.text()).toBe('Connected')
    expect(experiment2.vm.$magpie.socket.lastIterationResults).not.toHaveLength(0)
    expect(experiment2.vm.$magpie.socket.lastIterationResults[0].response).toBe('foobar')
})

test('AwaitIteratedResultScreen with two clients and race condition', async () => {
    const experimentId = await createDynamicExperiment(1, 1, 2)

    const experiment1 = mount(Experiment, {
        slots: {
            default: [
                '<AwaitIteratedResultScreen>Connecting</AwaitIteratedResultScreen>' +
                '<Screen>Connected</Screen>',
                '<SubmitResultsScreen />',
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
                '<AwaitIteratedResultScreen>Connecting</AwaitIteratedResultScreen>' +
                '<Screen>Connected</Screen>',
                '<SubmitResultsScreen />',
            ]
        },
        magpie: {
            ...magpieConfig,
            experimentId,
        }
    })

    expect(experiment2.text()).toBe('Connecting')

    while (experiment1.vm.$magpie.socket.iteratedState !== states.READY && experiment2.vm.$magpie.socket.state !== states.READY) {
        await new Promise(resolve => setTimeout(resolve, 200))
    }

    let firstExp, secondExp

    if (experiment1.vm.$magpie.socket.iteratedState === states.READY) {
        firstExp = experiment1
        secondExp = experiment2
    }else{
        firstExp = experiment2
        secondExp = experiment1
    }

    firstExp.vm.$magpie.saveAndNextScreen()

    while (secondExp.vm.$magpie.socket.iteratedState !== states.READY) {
        await new Promise(resolve => setTimeout(resolve, 200))
    }

    expect(experiment1.vm.$magpie.socket.generation).not.toBe(experiment2.vm.$magpie.socket.generation)

    await experiment1.vm.$nextTick()
    await experiment2.vm.$nextTick()

    expect(firstExp.text()).toContain('All done.')
    expect(secondExp.text()).toBe('Connected')
})
