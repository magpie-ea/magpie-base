<template>
  <!--
  Set your experiment id here and
  Define your data sources with the trials attribute -->
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
    <!-- The contents of the #title template slot will be displayed in the upper left corner of the experiment -->
    <template #title>
      <div>The experiment</div>
    </template>

    <!-- The contents of the #screens template slot define your experiment -->
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
        <!-- The $exp field gives you access to magpie-specific functionality -->
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
      <!-- Here we create screens in a loop for every entry in forced_choice -->
      <template v-for="i in forced_choice_length">
        <Screen :key="'forcedchoice-' + i">
          <template #0>
            <!-- We automatically retrieve trial data from our data sources using $exp.trial.<data-source>
            Once the participant has made a choice, the change:answer event fires and we save the answer and progress to the next screeen.
            -->
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
                $exp.trial.multi_dropdown.choice_options_1.split('|'),
                $exp.trial.multi_dropdown.choice_options_2.split('|')
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
// Load data from csv files as javascript arrays with objects
import forced_choice from '../trials/forced_choice.csv';
import multi_dropdown from '../trials/multi_dropdown.csv';
import sentenceChoice from '../trials/sentence_choice.csv';
import _ from 'lodash';

export default {
  name: 'App',
  data() {
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
      imageSelection: _.shuffle(imageSelection),
      imageSelection_length: imageSelection.length,
      sliderRating,
      sliderRating_length: sliderRating.length,

      // this field is used to temporarily store answers
      answer: ''
    };
  }
};
</script>
