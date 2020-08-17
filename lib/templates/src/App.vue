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

    <template #3="{ nextScreen, addResults, trial }">
      <Screen>
        <ForcedChoiceInput
          question="How did you like this?"
          :options="[trial.options.option1, trial.options.option2]"
          :answer.sync="answer"
          @change:answer="
            addResults({ answer, options: trial.options });
            nextScreen();
          "
        />
      </Screen>
    </template>

    <template #4="{ nextScreen, addResults, trial }">
      <Screen>
        <ImageSelectionInput
          question="How did you like this?"
          :options="[
            { label: trial.options.option1, src: 'img/test.png' },
            { label: trial.options.option2, src: 'img/test.png' }
          ]"
          :answer.sync="answer"
          @change:answer="
            addResults({ answer, options: trial.options });
            nextScreen();
          "
        />
      </Screen>
    </template>

    <template #5="{ nextScreen, addResults, trial }">
      <Screen>
        <TextareaInput
          question="How did you like this?"
          :answer.sync="answer"
          @change:answer="
            addResults({ answer });
            nextScreen();
          "
        />
      </Screen>
    </template>

    <template #5>
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
import ForcedChoiceInput from '../../../src/components/inputs/ForcedChoiceInput';
import ImageSelectionInput from '../../../src/components/inputs/ImageSelectionInput';
import TextareaInput from '../../../src/components/inputs/TextareaInput';

export default {
  name: 'App',
  components: {
    ImageSelectionInput,
    ForcedChoiceInput,
    TextareaInput,
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
