<template>
  <Experiment id="app" :trials="{ audio, options }">
    <div>Mouse tracking experiment</div>

    <template #0="{ nextScreen }">
      <Screen :title="'Welcome'">
        <template #0>
          Hello!
          <button @click="nextScreen">Start</button>
        </template>
      </Screen>
    </template>

    <template #[screen]="{ trial }" v-for="screen in 2">
      <AudioDiscriminationWithPriming
        :priming-audio="trial.audio.primingAudio"
        :trial-audio="trial.audio.trialAudio"
        :option1="trial.options.option1"
        :option2="trial.options.option2"
        :key="screen"
      >
      </AudioDiscriminationWithPriming>
    </template>

    <template #3>
      <Screen :title="'Thanks!'">
        <template #0>
          Goodbye
        </template>
      </Screen>
    </template>
  </Experiment>
</template>

<script>
import {
  AudioDiscriminationWithPriming,
  Experiment,
  Screen
} from 'magpie-base';

export default {
  name: 'App',
  components: {
    AudioDiscriminationWithPriming,
    Screen,
    Experiment
  },
  data() {
    return {
      audioTrials: readAudioCsv(),
      options: readOptionsCsv()
    };
  },
  methods: {
    audio() {
      return this.audioTrials.pop();
    }
  }
};

// Just a stub to take the place of a real magpie-supplied function
function readAudioCsv() {
  return [
    {
      primingAudio: 'audio/seashore.ogg',
      trialAudio: 'audio/sealion.ogg'
    },
    {
      primingAudio: 'audio/seashore.ogg',
      trialAudio: 'audio/sealion.ogg'
    }
  ];
}
function readOptionsCsv() {
  return [
    {
      option1: 'Fish',
      option2: 'Mammal'
    },
    {
      option1: 'Mammal',
      option2: 'Bird'
    }
  ];
}
</script>

<style></style>
