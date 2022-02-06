import { mount } from '@vue/test-utils'
import Vue from 'vue'
import Experiment from "@/components/Experiment";
import FixationCross from "@/components/stimuli/FixationCross";

jest.useFakeTimers();

test('LifecycleScreen', async () => {
    const experiment = mount(Experiment, {
        slots: {
            default: [
                '<LifecycleScreen>' +
                '<template #task>' +
                '<button @click="$magpie.saveAndNextScreen()">Click here</button>' +
                '</template>' +
                '</LifecycleScreen>',
                '<Screen>Bye world</Screen>',
            ]
        }
    })

    expect(experiment.text()).toBe('Click here')

    await experiment.find('button').trigger('click')

    expect(experiment.text()).toBe('Bye world')
    const results = experiment.vm.$magpie.getAllData()
    expect(results).toBeInstanceOf(Array)
    expect(results).toHaveLength(1)
    expect(results[0].response_timeout).toBeUndefined()
})

test('LifecycleScreen with response time', async () => {
    const experiment = mount(Experiment, {
        slots: {
            default: [
                '<LifecycleScreen :responseTime="500">' +
                '<template #task>' +
                '<button @click="$magpie.saveAndNextScreen()">Click here</button>' +
                '</template>' +
                '</LifecycleScreen>',
                '<Screen>Bye world</Screen>',
            ]
        }
    })

    expect(experiment.text()).toBe('Click here')

    await experiment.find('button').trigger('click')

    expect(experiment.text()).toBe('Bye world')
    const results = experiment.vm.$magpie.getAllData()
    expect(results).toBeInstanceOf(Array)
    expect(results).toHaveLength(1)
    expect(results[0].response_timeout).toEqual(false)
})

test('LifecycleScreen with response time', async () => {
    const experiment = mount(Experiment, {
        slots: {
            default: [
                '<LifecycleScreen :responseTime="500">' +
                '<template #task>' +
                '<button @click="$magpie.saveAndNextScreen()">Click here</button>' +
                '</template>' +
                '</LifecycleScreen>',
                '<Screen>Bye world</Screen>',
            ]
        }
    })

    expect(experiment.text()).toBe('Click here')

    jest.advanceTimersByTime(600);
    await Vue.nextTick()

    expect(experiment.text()).toBe('Bye world')
    const results = experiment.vm.$magpie.getAllData()
    expect(results).toBeInstanceOf(Array)
    expect(results).toHaveLength(1)
    expect(results[0].response_timeout).toEqual(true)
})

test('LifecycleScreen with pause', async () => {
    const experiment = mount(Experiment, {
        slots: {
            default: [
                '<LifecycleScreen :pauseTime="500">' +
                '<template #task>' +
                '<button @click="$magpie.saveAndNextScreen()">Click here</button>' +
                '</template>' +
                '</LifecycleScreen>',
                '<Screen>Bye world</Screen>',
            ]
        }
    })

    expect(experiment.text()).toBe('')

    jest.advanceTimersByTime(600);
    await Vue.nextTick()

    expect(experiment.text()).toBe('Click here')

    await experiment.find('button').trigger('click')

    expect(experiment.text()).toBe('Bye world')
    const results = experiment.vm.$magpie.getAllData()
    expect(results).toBeInstanceOf(Array)
    expect(results).toHaveLength(1)
})

test('LifecycleScreen with fixation', async () => {
    const experiment = mount(Experiment, {
        slots: {
            default: [
                '<LifecycleScreen :fixationTime="-1">' +
                '<template #fixation>' +
                '<button @click="$magpie.nextSlide()">Fixation</button>' +
                '</template>' +
                '<template #task>' +
                '<button @click="$magpie.saveAndNextScreen()">Click here</button>' +
                '</template>' +
                '</LifecycleScreen>',
                '<Screen>Bye world</Screen>',
            ]
        }
    })

    expect(experiment.text()).toBe('Fixation')

    await experiment.find('button').trigger('click')

    expect(experiment.text()).toBe('Click here')

    await experiment.find('button').trigger('click')

    expect(experiment.text()).toBe('Bye world')
    const results = experiment.vm.$magpie.getAllData()
    expect(results).toBeInstanceOf(Array)
    expect(results).toHaveLength(1)
})

test('LifecycleScreen with fixation time', async () => {
    const experiment = mount(Experiment, {
        slots: {
            default: [
                '<LifecycleScreen :fixationTime="500">' +
                '<template #fixation>' +
                'Fixation' +
                '</template>' +
                '<template #task>' +
                '<button @click="$magpie.saveAndNextScreen()">Click here</button>' +
                '</template>' +
                '</LifecycleScreen>',
                '<Screen>Bye world</Screen>',
            ]
        }
    })

    expect(experiment.text()).toBe('Fixation')

    jest.advanceTimersByTime(600);
    await Vue.nextTick()

    expect(experiment.text()).toBe('Click here')

    await experiment.find('button').trigger('click')

    expect(experiment.text()).toBe('Bye world')
    const results = experiment.vm.$magpie.getAllData()
    expect(results).toBeInstanceOf(Array)
    expect(results).toHaveLength(1)
})

test('LifecycleScreen with stimulus', async () => {
    const experiment = mount(Experiment, {
        slots: {
            default: [
                '<LifecycleScreen :stimulusTime="-1">' +
                '<template #stimulus>' +
                '<button @click="$magpie.nextSlide()">Stimulus</button>' +
                '</template>' +
                '<template #task>' +
                '<button @click="$magpie.saveAndNextScreen()">Click here</button>' +
                '</template>' +
                '</LifecycleScreen>',
                '<Screen>Bye world</Screen>',
            ]
        }
    })

    expect(experiment.text()).toBe('Stimulus')

    await experiment.find('button').trigger('click')

    expect(experiment.text()).toBe('Click here')

    await experiment.find('button').trigger('click')

    expect(experiment.text()).toBe('Bye world')
    const results = experiment.vm.$magpie.getAllData()
    expect(results).toBeInstanceOf(Array)
    expect(results).toHaveLength(1)
})

test('LifecycleScreen without stimulus time', async () => {
    const experiment = mount(Experiment, {
        slots: {
            default: [
                '<LifecycleScreen>' +
                '<template #stimulus>' +
                'Stimulus' +
                '</template>' +
                '<template #task>' +
                '<button @click="$magpie.saveAndNextScreen()">Click here</button>' +
                '</template>' +
                '</LifecycleScreen>',
                '<Screen>Bye world</Screen>',
            ]
        }
    })

    expect(experiment.text()).toContain('Stimulus')
    expect(experiment.text()).toContain('Click here')

    await experiment.find('button').trigger('click')

    expect(experiment.text()).toBe('Bye world')
    const results = experiment.vm.$magpie.getAllData()
    expect(results).toBeInstanceOf(Array)
    expect(results).toHaveLength(1)
})

test('LifecycleScreen with stimulus time', async () => {
    const experiment = mount(Experiment, {
        slots: {
            default: [
                '<LifecycleScreen :stimulusTime="500">' +
                '<template #stimulus>' +
                'Stimulus' +
                '</template>' +
                '<template #task>' +
                '<button @click="$magpie.saveAndNextScreen()">Click here</button>' +
                '</template>' +
                '</LifecycleScreen>',
                '<Screen>Bye world</Screen>',
            ]
        }
    })

    expect(experiment.text()).toBe('Stimulus')

    jest.advanceTimersByTime(600);
    await Vue.nextTick()

    expect(experiment.text()).toBe('Click here')

    await experiment.find('button').trigger('click')

    expect(experiment.text()).toBe('Bye world')
    const results = experiment.vm.$magpie.getAllData()
    expect(results).toBeInstanceOf(Array)
    expect(results).toHaveLength(1)
})

test('LifecycleScreen with feedback time', async () => {
    const experiment = mount(Experiment, {
        slots: {
            default: [
                '<LifecycleScreen :feedbackTime="500">' +
                '<template #feedback>' +
                'Feedback' +
                '</template>' +
                '<template #task>' +
                '<button @click="$magpie.saveMeasurements(); $magpie.nextSlide()">Click here</button>' +
                '</template>' +
                '</LifecycleScreen>',
                '<Screen>Bye world</Screen>',
            ]
        }
    })

    expect(experiment.text()).toBe('Click here')

    await experiment.find('button').trigger('click')


    expect(experiment.text()).toBe('Feedback')

    jest.advanceTimersByTime(600);
    await Vue.nextTick()

    expect(experiment.text()).toBe('Bye world')
    const results = experiment.vm.$magpie.getAllData()
    expect(results).toBeInstanceOf(Array)
    expect(results).toHaveLength(1)
})

test('LifecycleScreen with feedback', async () => {
    const experiment = mount(Experiment, {
        slots: {
            default: [
                '<LifecycleScreen :feedbackTime="-1">' +
                '<template #feedback>' +
                '<button @click="$magpie.nextScreen()">Feedback</button>' +
                '</template>' +
                '<template #task>' +
                '<button @click="$magpie.saveMeasurements(); $magpie.nextSlide()">Click here</button>' +
                '</template>' +
                '</LifecycleScreen>',
                '<Screen>Bye world</Screen>',
            ]
        }
    })

    expect(experiment.text()).toBe('Click here')

    await experiment.find('button').trigger('click')

    expect(experiment.text()).toBe('Feedback')

    await experiment.find('button').trigger('click')

    expect(experiment.text()).toBe('Bye world')
    const results = experiment.vm.$magpie.getAllData()
    expect(results).toBeInstanceOf(Array)
    expect(results).toHaveLength(1)
})

test('LifecycleScreen with pause, and buttons for fixation, stimulus and feedback', async () => {
    const experiment = mount(Experiment, {
        slots: {
            default: [
                '<LifecycleScreen :pauseTime="500" :fixationTime="-1" :stimulusTime="-1" :feedbackTime="-1">' +
                '<template #fixation>' +
                '<button @click="$magpie.nextSlide()">Fixation</button>' +
                '</template>' +
                '<template #stimulus>' +
                '<button @click="$magpie.nextSlide()">Stimulus</button>' +
                '</template>' +
                '<template #feedback>' +
                '<button @click="$magpie.nextScreen()">Feedback</button>' +
                '</template>' +
                '<template #task>' +
                '<button @click="$magpie.saveMeasurements(); $magpie.nextSlide()">Click here</button>' +
                '</template>' +
                '</LifecycleScreen>',
                '<Screen>Bye world</Screen>',
            ]
        }
    })

    expect(experiment.text()).toBe('')

    jest.advanceTimersByTime(600);
    await Vue.nextTick()

    expect(experiment.text()).toBe('Fixation')

    await experiment.find('button').trigger('click')

    expect(experiment.text()).toBe('Stimulus')

    await experiment.find('button').trigger('click')

    expect(experiment.text()).toBe('Click here')

    await experiment.find('button').trigger('click')


    expect(experiment.text()).toBe('Feedback')

    await experiment.find('button').trigger('click')

    expect(experiment.text()).toBe('Bye world')
    const results = experiment.vm.$magpie.getAllData()
    expect(results).toBeInstanceOf(Array)
    expect(results).toHaveLength(1)
})

test('LifecycleScreen with times for pause, fixation, stimulus and feedback', async () => {
    const experiment = mount(Experiment, {
        slots: {
            default: [
                '<LifecycleScreen :pauseTime="500" :fixationTime="500" :stimulusTime="500" :feedbackTime="500">' +
                '<template #fixation>' +
                'Fixation' +
                '</template>' +
                '<template #stimulus>' +
                'Stimulus' +
                '</template>' +
                '<template #feedback>' +
                'Feedback' +
                '</template>' +
                '<template #task>' +
                '<button @click="$magpie.saveMeasurements(); $magpie.nextSlide()">Click here</button>' +
                '</template>' +
                '</LifecycleScreen>',
                '<Screen>Bye world</Screen>',
            ]
        }
    })

    expect(experiment.text()).toBe('')

    jest.advanceTimersByTime(600);
    await Vue.nextTick()

    expect(experiment.text()).toBe('Fixation')

    jest.advanceTimersByTime(600);
    await Vue.nextTick()

    expect(experiment.text()).toBe('Stimulus')

    jest.advanceTimersByTime(600);
    await Vue.nextTick()

    expect(experiment.text()).toBe('Click here')

    await experiment.find('button').trigger('click')

    expect(experiment.text()).toBe('Feedback')

    jest.advanceTimersByTime(600);
    await Vue.nextTick()

    expect(experiment.text()).toBe('Bye world')
    const results = experiment.vm.$magpie.getAllData()
    expect(results).toBeInstanceOf(Array)
    expect(results).toHaveLength(1)
})

test('LifecycleScreen with stimulus, and times for pause, fixation and feedback', async () => {
    const experiment = mount(Experiment, {
        slots: {
            default: [
                '<LifecycleScreen :pauseTime="500" :fixationTime="500" :feedbackTime="500">' +
                '<template #fixation>' +
                'Fixation' +
                '</template>' +
                '<template #stimulus>' +
                'Stimulus' +
                '</template>' +
                '<template #feedback>' +
                'Feedback' +
                '</template>' +
                '<template #task>' +
                '<button @click="$magpie.saveMeasurements(); $magpie.nextSlide()">Click here</button>' +
                '</template>' +
                '</LifecycleScreen>',
                '<Screen>Bye world</Screen>',
            ]
        }
    })

    await Vue.nextTick()

    expect(experiment.text()).toBe('')

    jest.advanceTimersByTime(600);
    await Vue.nextTick()

    expect(experiment.text()).toBe('Fixation')

    jest.advanceTimersByTime(600);
    await Vue.nextTick()

    expect(experiment.text()).toContain('Stimulus')

    expect(experiment.text()).toContain('Click here')

    await experiment.find('button').trigger('click')

    expect(experiment.text()).toBe('Feedback')

    jest.advanceTimersByTime(600);
    await Vue.nextTick()

    expect(experiment.text()).toBe('Bye world')
    const results = experiment.vm.$magpie.getAllData()
    expect(results).toBeInstanceOf(Array)
    expect(results).toHaveLength(1)
})
