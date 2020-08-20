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

    <template #1="{ nextScreen, addResult, trial }">
      <Screen>
        <ForcedChoiceInput
          question="How did you like this?"
          :options="[trial.options.option1, trial.options.option2]"
          :answer.sync="answer"
          @change:answer="
            addResult({ answer, options: trial.options });
            nextScreen();
          "
        />
      </Screen>
    </template>

    <template #2="{ nextScreen, addResult, trial }">
      <Screen>
        <ImageSelectionInput
          question="How did you like this?"
          :options="[
            { label: trial.options.option1, src: 'img/1.jpg' },
            { label: trial.options.option2, src: 'img/2.jpg' }
          ]"
          :answer.sync="answer"
          @change:answer="
            addResult({ answer, options: trial.options });
            nextScreen();
          "
        />
      </Screen>
    </template>

    <template #3="{ nextScreen, addResult, trial }">
      <Screen>
        <TextareaInput
          question="How did you like this?"
          :answer.sync="answer"
          @change:answer="
            addResult({ answer });
            nextScreen();
          "
        />
      </Screen>
    </template>

    <template #4="{ nextScreen, addResult, trial }">
      <Screen>
        <SliderInput
          question="How did you like this?"
          left="bad"
          right="good"
          :answer.sync="answer"
        />
        <button
          @click="
            addResult({ answer });
            nextScreen();
          "
        >
          Next
        </button>
      </Screen>
    </template>

    <template #5="{ nextScreen, addResult, trial }">
      <Screen>
        <CompletionInput
          text="One %s fell over a %s."
          :options="[
            ['horse', 'penguin'],
            ['tree', 'icicle']
          ]"
          :answer.sync="answer"
        />
        <button
          @click="
            addResult({ answer });
            nextScreen();
          "
        >
          Next
        </button>
      </Screen>
    </template>

    <template #6="{ nextScreen, addResult, trial }">
      <Screen>
        <RatingInput
          question="How's the weather?"
          :count="7"
          left="bad"
          right="good"
          :answer.sync="answer"
        />
        <button
          @click="
            addResult({ answer });
            nextScreen();
          "
        >
          Next
        </button>
      </Screen>
    </template>

    <template #7>
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
import ForcedChoiceInput from 'magpie-base/src/components/inputs/ForcedChoiceInput';
import ImageSelectionInput from 'magpie-base/src/components/inputs/ImageSelectionInput';
import TextareaInput from 'magpie-base/src/components/inputs/TextareaInput';
import SliderInput from 'magpie-base/src/components/inputs/SliderInput';
import CompletionInput from 'magpie-base/src/components/inputs/CompletionInput';
import RatingInput from 'magpie-base/src/components/inputs/RatingInput';

export default {
  name: 'App',
  components: {
    ImageSelectionInput,
    ForcedChoiceInput,
    TextareaInput,
    SliderInput,
    CompletionInput,
    RatingInput,
    AudioDiscriminationWithPriming,
    Screen,
    Experiment
  },
  data() {
    return {
      audioTrials: readAudioCsv(),
      options: readOptionsCsv(),
      answer: ''
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
