import { mount } from '@vue/test-utils'
import Vue from 'vue'
import Experiment from "@/components/Experiment";

jest.useFakeTimers()

test('SelfPacedReadingInput', async () => {
    const experiment = mount(Experiment, {
        slots: {
            default: [
                '<Screen>\n' +
                '        <SelfPacedReadingInput\n' +
                '            :chunks="[\'This\', \'is\', \'a\', \'nice\', \'text.\']"\n' +
                '            word-pos="same"\n' +
                '            trigger=" "\n' +
                '            instructions="Press space"' +
                '            :response-times.sync="$magpie.measurements.times"' +
                '            :responseTime="5000"' +
                '            :timeout.sync="$magpie.measurements.timeout"' +
                '            @end="$magpie.saveAndNextScreen()" />\n' +
                '    </Screen>',
                '<Screen>Bye world</Screen>',
            ]
        },
        attachTo: document.body // in order for keydown listener to work
    })

    await Vue.nextTick()

    expect(experiment.text()).toContain('Press space')

    await Vue.nextTick()

    await experiment.trigger('keydown.space')
    await Vue.nextTick()
    expect(experiment.text()).toContain('This')

    await experiment.trigger('keydown.space')
    await Vue.nextTick()
    expect(experiment.text()).toContain('is')

    await experiment.trigger('keydown.space')
    await Vue.nextTick()
    expect(experiment.text()).toContain('a')

    await experiment.trigger('keydown.space')
    await Vue.nextTick()
    expect(experiment.text()).toContain('nice')

    await experiment.trigger('keydown.space')
    await Vue.nextTick()
    expect(experiment.text()).toContain('text.')

    await experiment.trigger('keydown.space')
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
    expect(results[0].timeout).toBe(false)
})


test('SelfPacedReadingInput with timeout', async () => {
    const experiment = mount(Experiment, {
        slots: {
            default: [
                '<Screen>\n' +
                '        <SelfPacedReadingInput\n' +
                '            :chunks="[\'This\', \'is\', \'a\', \'nice\', \'text.\']"\n' +
                '            word-pos="same"\n' +
                '            trigger=" "\n' +
                '            instructions="Press space"' +
                '            :response-times.sync="$magpie.measurements.times"' +
                '            :responseTime="5000"' +
                '            :timeout.sync="$magpie.measurements.timeout"' +
                '            @end="$magpie.saveAndNextScreen()" />\n' +
                '    </Screen>',
                '<Screen>Bye world</Screen>',
            ]
        },
        attachTo: document.body // in order for keydown listener to work
    })

    await Vue.nextTick()

    expect(experiment.text()).toContain('Press space')

    await Vue.nextTick()

    await experiment.trigger('keydown.space')
    await Vue.nextTick()
    expect(experiment.text()).toContain('This')

    await experiment.trigger('keydown.space')
    await Vue.nextTick()
    expect(experiment.text()).toContain('is')

    await experiment.trigger('keydown.space')
    await Vue.nextTick()
    expect(experiment.text()).toContain('a')

    await experiment.trigger('keydown.space')
    await Vue.nextTick()
    expect(experiment.text()).toContain('nice')

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
    expect(results[0].timeout).toBe(true)
})
