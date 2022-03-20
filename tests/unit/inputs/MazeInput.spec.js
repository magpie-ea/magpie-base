import { mount } from '@vue/test-utils'
import Vue from 'vue'
import Experiment from "@/components/Experiment";

jest.useFakeTimers()

test('MazeInput', async () => {
    const experiment = mount(Experiment, {
        slots: {
            default: [
                '<Screen>\n' +
                '        <MazeInput\n' +
                '            :targets="[\'This\', \'is\', \'a\', \'nice\', \'text\']"\n' +
                '            :competitors="[\'Camels\', \'are\', \'in\', \'a\', \'way\']"\n' +
                '            :response-times.sync="$magpie.measurements.times"\n' +
                '            :target-positions.sync="$magpie.measurements.target_positions"\n' +
                '            :responses.sync="$magpie.measurements.responses"\n' +
                '            :showKeypressOptions="false"\n' +
                '            :timeout.sync="$magpie.measurements.timeout"\n' +
                '            :correct.sync="$magpie.measurements.correct"\n' +
                '            @end="$magpie.saveAndNextScreen()" />' +
                '    </Screen>',
                '<Screen>Bye world</Screen>',
            ]
        },
        attachTo: document.body // in order for keydown listener to work
    })

    await Vue.nextTick()
    expect(experiment.text()).toContain('This')
    expect(experiment.text()).toContain('Camels')

    await experiment.trigger('keydown', {key: (experiment.text().startsWith('This')? 'f' : 'j')})
    await Vue.nextTick()
    expect(experiment.text()).toContain('is')
    expect(experiment.text()).toContain('are')

    await experiment.trigger('keydown', {key: (experiment.text().startsWith('is')? 'f' : 'j')})
    await Vue.nextTick()
    expect(experiment.text()).toContain('a')
    expect(experiment.text()).toContain('in')

    await experiment.trigger('keydown', {key:(experiment.text().startsWith('a')? 'f' : 'j')})
    await Vue.nextTick()
    expect(experiment.text()).toContain('nice')
    expect(experiment.text()).toContain('a')

    await experiment.trigger('keydown', {key: (experiment.text().startsWith('nice')? 'f' : 'j')})
    await Vue.nextTick()
    expect(experiment.text()).toContain('text')
    expect(experiment.text()).toContain('way')

    await experiment.trigger('keydown', {key: (experiment.text().startsWith('text')? 'f' : 'j')})
    await Vue.nextTick()
    expect(experiment.text()).toBe('Bye world')

    const results = experiment.vm.$magpie.getAllData()
    expect(results).toBeInstanceOf(Array)
    expect(results).toHaveLength(1)
    expect(results[0].experiment_end_time).toBeLessThanOrEqual(Date.now())
    expect(results[0].experiment_start_time).toBeLessThanOrEqual(results[0].experiment_end_time)
    expect(results[0].experiment_duration).toBe(results[0].experiment_end_time - results[0].experiment_start_time)
    expect(results[0].experiment_duration).toBe(results[0].experiment_end_time - results[0].experiment_start_time)
    expect(results[0].times.split('|')).toHaveLength(5)
    expect(results[0].responses.split('|')).toHaveLength(5)
    expect(results[0].target_positions.split('|')).toHaveLength(5)
    expect(results[0].correct).toBe(true)
    expect(results[0].timeout).toBe(false)
})

test('MazeInput with timeout', async () => {
    const experiment = mount(Experiment, {
        slots: {
            default: [
                '<Screen>\n' +
                '        <MazeInput\n' +
                '            :targets="[\'This\', \'is\', \'a\', \'nice\', \'text\']"\n' +
                '            :competitors="[\'Camels\', \'are\', \'in\', \'a\', \'way\']"\n' +
                '            :response-times.sync="$magpie.measurements.times"\n' +
                '            :target-positions.sync="$magpie.measurements.target_positions"\n' +
                '            :responses.sync="$magpie.measurements.responses"\n'+
                '            :showKeypressOptions="false"\n' +
                '            :timeout.sync="$magpie.measurements.timeout"\n' +
                '            :correct.sync="$magpie.measurements.correct"\n' +
                '            :response-time="5000"' +
                '            @end="$magpie.saveAndNextScreen()" />' +
                '    </Screen>',
                '<Screen>Bye world</Screen>',
            ]
        },
        attachTo: document.body // in order for keydown listener to work
    })

    await Vue.nextTick()
    expect(experiment.text()).toContain('This')

    await experiment.trigger('keydown', {key: (experiment.text().startsWith('This')? 'f' : 'j')})
    await Vue.nextTick()
    expect(experiment.text()).toContain('is')
    expect(experiment.text()).toContain('are')

    await experiment.trigger('keydown', {key: (experiment.text().startsWith('is')? 'f' : 'j')})
    await Vue.nextTick()
    expect(experiment.text()).toContain('a')
    expect(experiment.text()).toContain('in')

    await experiment.trigger('keydown', {key:(experiment.text().startsWith('a')? 'f' : 'j')})
    await Vue.nextTick()
    expect(experiment.text()).toContain('nice')
    expect(experiment.text()).toContain('a')

    jest.advanceTimersByTime(5000)
    await Vue.nextTick()
    jest.runOnlyPendingTimers()
    await Vue.nextTick()
    expect(experiment.text()).toBe('Bye world')

    const results = experiment.vm.$magpie.getAllData()
    expect(results).toBeInstanceOf(Array)
    expect(results).toHaveLength(1)
    expect(results[0].experiment_end_time).toBeLessThanOrEqual(Date.now())
    expect(results[0].experiment_start_time).toBeLessThanOrEqual(results[0].experiment_end_time)
    expect(results[0].experiment_duration).toBe(results[0].experiment_end_time - results[0].experiment_start_time)
    expect(results[0].experiment_duration).toBe(results[0].experiment_end_time - results[0].experiment_start_time)
    expect(results[0].times.split('|')).toHaveLength(3)
    expect(results[0].responses.split('|')).toHaveLength(3)
    expect(results[0].target_positions.split('|')).toHaveLength(5)
    expect(results[0].correct).toBe(true)
    expect(results[0].timeout).toBe(true)
})

test('MazeInput with incorrect response', async () => {
    const experiment = mount(Experiment, {
        slots: {
            default: [
                '<Screen>\n' +
                '        <MazeInput\n' +
                '            :targets="[\'This\', \'is\', \'a\', \'nice\', \'text\']"\n' +
                '            :competitors="[\'Camels\', \'are\', \'in\', \'a\', \'way\']"\n' +
                '            :response-times.sync="$magpie.measurements.times"\n' +
                '            :showKeypressOptions="false"\n' +
                '            :target-positions.sync="$magpie.measurements.target_positions"\n' +
                '            :responses.sync="$magpie.measurements.responses"\n' +
                '            :timeout.sync="$magpie.measurements.timeout"\n' +
                '            :correct.sync="$magpie.measurements.correct"\n' +
                '            @end="$magpie.saveAndNextScreen()" />' +
                '    </Screen>',
                '<Screen>Bye world</Screen>',
            ]
        },
        attachTo: document.body // in order for keydown listener to work
    })

    await Vue.nextTick()
    expect(experiment.text()).toContain('This')

    await experiment.trigger('keydown', {key: (experiment.text().startsWith('This')? 'f' : 'j')})
    await Vue.nextTick()
    expect(experiment.text()).toContain('is')
    expect(experiment.text()).toContain('are')

    await experiment.trigger('keydown', {key: (experiment.text().startsWith('is')? 'f' : 'j')})
    await Vue.nextTick()
    expect(experiment.text()).toContain('a')
    expect(experiment.text()).toContain('in')

    await experiment.trigger('keydown', {key:(experiment.text().startsWith('a')? 'j' : 'f')})
    await Vue.nextTick()
    jest.runOnlyPendingTimers()
    await Vue.nextTick()
    expect(experiment.text()).toBe('Bye world')

    const results = experiment.vm.$magpie.getAllData()
    expect(results).toBeInstanceOf(Array)
    expect(results).toHaveLength(1)
    expect(results[0].experiment_end_time).toBeLessThanOrEqual(Date.now())
    expect(results[0].experiment_start_time).toBeLessThanOrEqual(results[0].experiment_end_time)
    expect(results[0].experiment_duration).toBe(results[0].experiment_end_time - results[0].experiment_start_time)
    expect(results[0].experiment_duration).toBe(results[0].experiment_end_time - results[0].experiment_start_time)
    expect(results[0].times.split('|')).toHaveLength(3)
    expect(results[0].responses.split('|')).toHaveLength(3)
    expect(results[0].target_positions.split('|')).toHaveLength(5)
    expect(results[0].correct).toBe(false)
    expect(results[0].timeout).toBe(false)
})
