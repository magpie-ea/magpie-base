<template>
  <Experiment
    id="test1234"
    :trials="{
      forced_choice,
      multi_dropdown,
      sentenceChoice,
      imageSelection,
      sliderRating
    }"
  >
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
                $exp.addResult({
                  question: $exp.trial.forced_choice.question,
                  answer: $event
                });
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

      <!-- Main trials -->

      <template v-for="i in sentenceChoice_length / 2">
        <template v-for="j in 2">
          <Screen :key="'sentenceChoice-' + i + '' + j">
            <template #0>
              <img :src="$exp.trial.sentenceChoice.picture" alt="" />
              <ForcedChoiceInput
                :question="$exp.trial.sentenceChoice.question"
                :options="[
                  $exp.trial.sentenceChoice.option1,
                  $exp.trial.sentenceChoice.option2
                ]"
                @change:answer="
                  $exp.addResult({
                    question: $exp.trial.sentenceChoice.question,
                    answer: $event
                  });
                  $exp.nextScreen();
                "
              />
            </template>
          </Screen>
        </template>
        <template v-for="j in 2">
          <Screen :key="'sentenceChoice-' + i + '' + j">
            <template #0>
              <ImageSelectionInput
                :question="$exp.trial.imageSelection.question || ''"
                :options="[
                  {
                    label: $exp.trial.imageSelection.option1,
                    src: $exp.trial.imageSelection.picture1
                  },
                  {
                    label: $exp.trial.imageSelection.option2,
                    src: $exp.trial.imageSelection.picture2
                  }
                ]"
                @change:answer="
                  $exp.addResult({
                    question: $exp.trial.imageSelection.question || '',
                    answer: $event
                  });
                  $exp.nextScreen();
                "
              />
            </template>
          </Screen>
        </template>
      </template>

      <template v-for="i in sliderRating_length">
        <Screen :key="'sliderRating-' + i">
          <template #0="{nextSlide}">
            <Wait :time="500" @done="nextSlide" />
          </template>
          <template #1="{nextSlide}">
            <Wait :time="1500" @done="nextSlide" />
            <img :src="$exp.trial.sliderRating.picture" alt="" />
          </template>
          <template #2>
            <SliderInput
              :question="$exp.trial.sliderRating.question"
              :left="$exp.trial.sliderRating.optionLeft"
              :right="$exp.trial.sliderRating.optionRight"
              @change:answer="answer = $event"
            />
            <button
              @click="
                $exp.addResult({
                  question: $exp.trial.sliderRating.question || '',
                  answer: answer
                });
                $exp.nextScreen();
              "
            >
              Done
            </button>
          </template>
        </Screen>
      </template>

      <DebugResults />

      <!-- While developing your experiment, using the DebugResults screen is fine,
      once you're going live, you can use the <SubmitResults> screen to automatically send your experimental data to the server. -->

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

    const sentenceChoice = [
      {
        QUD: 'sentence selection - loop: 1, trial: 1',
        picture: 'images/question_mark_02.png',
        question: "What's on the bread?",
        option1: 'ham',
        option2: 'jam'
      },
      {
        QUD: 'sentence selection - loop: 1, trial: 2',
        question: "What's the weather like?",
        option1: 'rainbow',
        option2: 'shiny'
      },
      {
        QUD: 'sentence selection - loop: 2, trial: 1',
        picture: 'images/question_mark_01.png',
        question: 'How are you today?',
        option1: 'fine',
        option2: 'great'
      },
      {
        QUD: 'sentence selection - loop: 2, trial: 2',
        question: 'Jam or Ham?',
        option1: 'ham',
        option2: 'jam'
      }
    ];

    const imageSelection = [
      {
        QUD: 'image selection - loop: 1, trial: 1',
        question: 'How are you today?',
        option1: 'fine',
        picture1: 'images/question_mark_02.png',
        option2: 'great',
        picture2: 'images/question_mark_01.png'
      },
      {
        QUD: 'image selection - loop: 1, trial: 2',
        option1: 'shiny',
        picture1: 'images/question_mark_03.jpg',
        option2: 'rainbow',
        picture2: 'images/question_mark_04.png'
      },
      {
        QUD: 'image selection - loop: 2, trial: 1',
        question: 'How are you today?',
        option1: 'fine',
        picture1: 'images/question_mark_03.jpg',
        option2: 'great',
        picture2: 'images/question_mark_01.png'
      },
      {
        QUD: 'image selection - loop: 2, trial: 2',
        option1: 'shiny',
        picture1: 'images/question_mark_02.png',
        option2: 'rainbow',
        picture2: 'images/question_mark_04.png'
      }
    ];

    const sliderRating = [
      {
        picture: 'images/question_mark_02.png',
        question: 'How are you today?',
        optionLeft: 'fine',
        optionRight: 'great'
      },
      {
        picture: 'images/question_mark_01.png',
        question: "What's the weather like?",
        optionLeft: 'shiny',
        optionRight: 'rainbow'
      },
      {
        QUD:
          'Here is a sentence that stays on the screen from the very beginning',
        picture: 'images/question_mark_03.jpg',
        question: "What's on the bread?",
        optionLeft: 'ham',
        optionRight: 'jam'
      }
    ];

    return {
      forced_choice,
      forced_choice_length: forced_choice.length,
      multi_dropdown,
      multi_dropdown_length: multi_dropdown.length,
      sentenceChoice,
      sentenceChoice_length: sentenceChoice.length,
      imageSelection: imageSelection,
      imageSelection_length: imageSelection.length,
      sliderRating,
      sliderRating_length: sliderRating.length,
      answer: ''
    };
  }
};
</script>
