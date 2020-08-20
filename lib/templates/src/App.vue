<template>
  <Experiment id="app" :trials="{ audio, options }">
    <template #title>
      <div>Mouse tracking experiment</div>
    </template>

    <template #screens>
      <Screen :title="'Welcome'">
        Hello!
        <button @click="$exp.nextScreen">Start</button>
      </Screen>

      <Screen>
        <ForcedChoiceInput
          question="How did you like this?"
          :options="[$exp.trial.options.option1, $exp.trial.options.option2]"
          :answer.sync="answer"
          @change:answer="
            $exp.addResult({ answer, options: $exp.trial.options });
            $exp.nextScreen();
          "
        />
      </Screen>

      <Screen>
        <ImageSelectionInput
          question="How did you like this?"
          :options="[
            { label: $exp.trial.options.option1, src: 'img/1.jpg' },
            { label: $exp.trial.options.option2, src: 'img/2.jpg' }
          ]"
          :answer.sync="answer"
          @change:answer="
            $exp.addResult({ answer, options: $exp.trial.options });
            $exp.nextScreen();
          "
        />
      </Screen>

      <Screen>
        <TextareaInput
          question="How did you like this?"
          :answer.sync="answer"
          @change:answer="
            $exp.addResult({ answer });
            $exp.nextScreen();
          "
        />
      </Screen>

      <Screen>
        <SliderInput
          question="How did you like this?"
          left="bad"
          right="good"
          :answer.sync="answer"
        />
        <button
          @click="
            $exp.addResult({ answer });
            $exp.nextScreen();
          "
        >
          Next
        </button>
      </Screen>

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
            $exp.addResult({ answer });
            $exp.nextScreen();
          "
        >
          Next
        </button>
      </Screen>

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
            $exp.addResult({ answer });
            $exp.nextScreen();
          "
        >
          Next
        </button>
      </Screen>

      <Screen>
        <KeypressInput
          question="How's the weather?"
          :keys="{ a: 'bar', b: 'foo' }"
          :answer.sync="answer"
        />
        <button
          @click="
            $exp.addResult({ answer });
            $exp.nextScreen();
          "
        >
          Next
        </button>
      </Screen>

      <Screen :title="'Thanks!'">
        <template #0>
          Goodbye
        </template>
      </Screen>
    </template>
  </Experiment>
</template>

<script>
export default {
  name: 'App',
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
    },
    {
      option1: 'Fish',
      option2: 'Mammal'
    },
    {
      option1: 'Mammal',
      option2: 'Bird'
    },
    {
      option1: 'Mammal',
      option2: 'Bird'
    },
    {
      option1: 'Mammal',
      option2: 'Bird'
    },
    {
      option1: 'Mammal',
      option2: 'Bird'
    },
    {
      option1: 'Mammal',
      option2: 'Bird'
    },
    {
      option1: 'Mammal',
      option2: 'Bird'
    },
    {
      option1: 'Mammal',
      option2: 'Bird'
    },
    {
      option1: 'Mammal',
      option2: 'Bird'
    },
    {
      option1: 'Mammal',
      option2: 'Bird'
    }
  ];
}
</script>

<style></style>
