import { mount } from '@vue/test-utils'
import Vue from 'vue'
import Experiment from "@/components/Experiment";

jest.useFakeTimers()

test('SelfPacedReading', async () => {
    const experiment = mount(Experiment, {
        slots: {
            default: [
                '<Screen>\n' +
                '        <SelfPacedReading\n' +
                '            :chunks="[\'This\', \'is\', \'a\', \'nice\', \'text.\']"\n' +
                '            word-pos="same"\n' +
                '            trigger=" "\n' +
                '            instructions="Press space"' +
                '            :response-times.sync="$magpie.measurements.times"' +
                '            @end="$magpie.nextScreen()" />\n' +
                '    </Screen>',
                '<Screen>Bye world</Screen>',
            ]
        },
        attachTo: document.body // in order for keydown listener to work
    })

    await Vue.nextTick()
    jest.runOnlyPendingTimers()
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
    jest.runAllTimers()
    await Vue.nextTick()
    expect(experiment.text()).toBe('Bye world')
})

test('SelfPacedReading with stimulus', async () => {
    const experiment = mount(Experiment, {
        slots: {
            default: [
                '<Screen>\n' +
                '        <SelfPacedReading\n' +
                '            :chunks="[\'This\', \'is\', \'a\', \'nice\', \'text.\']"\n' +
                '            word-pos="same"\n' +
                '            trigger=" "\n' +
                '            instructions="Press space"' +
                '            :response-times.sync="$magpie.measurements.times"' +
                '            @end="$magpie.nextScreen()">' +
                '               <template #stimulus>Stimulus</template>' +
                '        </SelfPacedReading>\n' +
                '    </Screen>',
                '<Screen>Bye world</Screen>',
            ]
        },
        attachTo: document.body // in order for keydown listener to work
    })

    await Vue.nextTick()
    jest.runOnlyPendingTimers()
    await Vue.nextTick()

    expect(experiment.text()).toContain('Press space')
    expect(experiment.text()).toContain('Stimulus')

    await Vue.nextTick()

    await experiment.trigger('keydown.space')
    await Vue.nextTick()
    expect(experiment.text()).toContain('This')
    expect(experiment.text()).toContain('Stimulus')

    await experiment.trigger('keydown.space')
    await Vue.nextTick()
    expect(experiment.text()).toContain('is')
    expect(experiment.text()).toContain('Stimulus')

    await experiment.trigger('keydown.space')
    await Vue.nextTick()
    expect(experiment.text()).toContain('a')
    expect(experiment.text()).toContain('Stimulus')

    await experiment.trigger('keydown.space')
    await Vue.nextTick()
    expect(experiment.text()).toContain('nice')
    expect(experiment.text()).toContain('Stimulus')

    await experiment.trigger('keydown.space')
    await Vue.nextTick()
    expect(experiment.text()).toContain('text.')
    expect(experiment.text()).toContain('Stimulus')

    await experiment.trigger('keydown.space')
    await Vue.nextTick()
    jest.runAllTimers()
    await Vue.nextTick()
    expect(experiment.text()).toBe('Bye world')
})

test('SelfPacedReading with prep', async () => {
    const experiment = mount(Experiment, {
        slots: {
            default: [
                '<Screen>\n' +
                '        <SelfPacedReading\n' +
                '            :chunks="[\'This\', \'is\', \'a\', \'nice\', \'text.\']"\n' +
                '            word-pos="same"\n' +
                '            trigger=" "\n' +
                '            instructions="Press space"' +
                '            :response-times.sync="$magpie.measurements.times"' +
                '            @end="$magpie.nextScreen()">' +
                '               <template #prep="{done}">Prep' +
                '                   <Wait :time="200" @done="done" />' +
                '               </template>' +
                '        </SelfPacedReading>\n' +
                '    </Screen>',
                '<Screen>Bye world</Screen>',
            ]
        },
        attachTo: document.body // in order for keydown listener to work
    })

    expect(experiment.text()).toBe('Prep')
    jest.advanceTimersByTime(200) // prep
    await Vue.nextTick()
    jest.advanceTimersByTime(500) // wait
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
    jest.runAllTimers()
    await Vue.nextTick()
    expect(experiment.text()).toBe('Bye world')
})
