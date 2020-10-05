<template>
  <Experiment id="app" :trials="{ forced_choice, multi_dropdown }">
    <template #title>
      <div>The experiment</div>
    </template>

    <template #screens>
      <Screen :title="'Welcome'">
        This is a sample introduction screen.
        <br />
        <br />
        This screen welcomes the participant and gives general information about
        the experiment.
        <br />
        <br />
        This mock up experiment is a showcase of the functionality of magpie.
        <button @click="$exp.nextScreen">Begin the experiment</button>
      </Screen>

      <Screen :title="'General Instructions'">
        This is a sample instructions view.
        <br />
        <br />
        First you will go through two practice trials. The practice trial view
        uses magpie's forced choice trial input.
        <button @click="$exp.nextScreen">to the practice trial</button>
      </Screen>

      <!-- Practice trials -->
      <template v-for="i in forced_choice_length">
        <Screen :key="'forcedchoice-' + i">
          <template #0>
            <img :src="$exp.trial.forced_choice.picture" alt="" />
            <ForcedChoiceInput
              :question="$exp.trial.forced_choice.question"
              :options="[
                $exp.trial.forced_choice.option1,
                $exp.trial.forced_choice.option2
              ]"
              @change:answer="
                $exp.addResult({ answer: $event });
                $exp.nextScreen();
              "
            />
          </template>
        </Screen>
      </template>
      <template v-for="i in multi_dropdown_length">
        <Screen :key="'multidropdown-' + i">
          <template #0>
            <CompletionInput
              :text="
                $exp.trial.multi_dropdown.sentence_chunk_1 +
                ' %s ' +
                $exp.trial.multi_dropdown.sentence_chunk_2 +
                ' %s ' +
                $exp.trial.multi_dropdown.sentence_chunk_3
              "
              :options="[
                $exp.trial.multi_dropdown.choice_options_1,
                $exp.trial.multi_dropdown.choice_options_2
              ]"
              @change:answer="answer = $event"
            />
            <button
              @click="
                $exp.addResult({ answer });
                $exp.nextScreen();
              "
            >
              Done
            </button>
          </template>
        </Screen>
      </template>

      <Screen :title="'Data'">
        This is the data you are submitting:
        <pre>{{ JSON.stringify($exp.results, null, '\t') }}</pre>
      </Screen>

      <Screen :title="'Thanks!'">
        Goodbye
      </Screen>
    </template>
  </Experiment>
</template>

<script>
export default {
  name: 'App',
  data() {
    const forced_choice = [
      {
        question: "What's on the bread?",
        picture: 'images/wide.jpg',
        option1: 'jam',
        option2: 'ham'
      },
      {
        question: "What's the weather like?",
        picture: 'images/small.png',
        option1: 'shiny',
        option2: 'rainbow'
      },
      {
        question: "What's the weather like today?",
        picture: 'images/high.jpg',
        option1: 'shiny',
        option2: 'rainbow'
      }
    ];

    const multi_dropdown = [
      {
        sentence_chunk_1: 'Some of the',
        sentence_chunk_2: 'are',
        sentence_chunk_3: 'today.',
        choice_options_1: ['cats', 'dogs'],
        choice_options_2: ['happy', 'hungry', 'sad']
      },
      {
        sentence_chunk_1: 'All of the',
        sentence_chunk_2: 'will be',
        sentence_chunk_3: 'tomorrow.',
        choice_options_1: ['cats', 'dogs'],
        choice_options_2: ['happy', 'hungry', 'sad']
      }
    ];

    return {
      forced_choice,
      forced_choice_length: forced_choice.length,
      multi_dropdown,
      multi_dropdown_length: multi_dropdown.length,
      answer: ''
    };
  }
};
</script>
