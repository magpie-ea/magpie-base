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
        <!-- The $magpie field gives you access to magpie-specific functionality -->
        <button @click="$magpie.nextScreen">Begin the experiment</button>
      </Screen>

      <Screen :title="'General Instructions'">
        This is a sample instructions view.
        <br />
        <br />
        First you will go through two practice trials. The practice trial view
        uses magpie's forced choice trial input.
        <button @click="$magpie.nextScreen">to the practice trial</button>
      </Screen>

      <!-- Practice trials -->
      <!-- Here we create screens in a loop for every entry in forced_choice -->
      <template v-for="i in forced_choice_length">
        <Screen :key="'forcedchoice-' + i">
          <template #0>
            <!-- We automatically retrieve trial data from our data sources using $magpie.currentTrial.<data-source>
            Once the participant has made a choice, the update:response event fires and we save the answer and progress to the next screeen.
            -->
            <img :src="$magpie.currentTrial.forced_choice.picture" alt="" />
            <ForcedChoiceInput
              :question="$magpie.currentTrial.forced_choice.question"
              :options="[
                $magpie.currentTrial.forced_choice.option1,
                $magpie.currentTrial.forced_choice.option2
              ]"
              @update:response="
                $magpie.addResult({
                  question: $magpie.currentTrial.forced_choice.question,
                  answer: $event
                });
                $magpie.nextScreen();
              "
            />
          </template>
        </Screen>
      </template>

      <template v-for="i in multi_dropdown_length">
        <Screen :key="'multidropdown-' + i">
          <template #0="{responses}">
            <!-- Use $set for setting new properties to existing objects -->
            <CompletionInput
              :text="
                $magpie.currentTrial.multi_dropdown.sentence_chunk_1 +
                ' %s ' +
                $magpie.currentTrial.multi_dropdown.sentence_chunk_2 +
                ' %s ' +
                $magpie.currentTrial.multi_dropdown.sentence_chunk_3
              "
              :options="[
                $magpie.currentTrial.multi_dropdown.choice_options_1.split('|'),
                $magpie.currentTrial.multi_dropdown.choice_options_2.split('|')
              ]"
              :responses.sync="responses.completion"
            />
            <!-- Only show button when both responses are given -->
            <button
              v-if="
                responses.completion &&
                responses.completion.filter(Boolean).length === 2
              "
              @click="
                $magpie.addResult({ response: responses.completion });
                $magpie.nextScreen();
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
              <img :src="$magpie.currentTrial.sentenceChoice.picture" alt="" />
              <ForcedChoiceInput
                :question="$magpie.currentTrial.sentenceChoice.question"
                :options="[
                  $magpie.currentTrial.sentenceChoice.option1,
                  $magpie.currentTrial.sentenceChoice.option2
                ]"
                @update:response="
                  $magpie.addResult({
                    question: $magpie.currentTrial.sentenceChoice.question,
                    answer: $event
                  });
                  $magpie.nextScreen();
                "
              />
            </template>
          </Screen>
        </template>
        <template v-for="j in 2">
          <Screen :key="'sentenceChoice-' + i + '' + j">
            <template #0>
              <ImageSelectionInput
                :question="$magpie.currentTrial.imageSelection.question || ''"
                :options="[
                  {
                    label: $magpie.currentTrial.imageSelection.option1,
                    src: $magpie.currentTrial.imageSelection.picture1
                  },
                  {
                    label: $magpie.currentTrial.imageSelection.option2,
                    src: $magpie.currentTrial.imageSelection.picture2
                  }
                ]"
                @update:response="
                  $magpie.addResult({
                    question:
                      $magpie.currentTrial.imageSelection.question || '',
                    answer: $event
                  });
                  $magpie.nextScreen();
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
            <img :src="$magpie.currentTrial.sliderRating.picture" alt="" />
          </template>
          <template #2="{responses}">
            <SliderInput
              :question="$magpie.currentTrial.sliderRating.question"
              :left="$magpie.currentTrial.sliderRating.optionLeft"
              :right="$magpie.currentTrial.sliderRating.optionRight"
              :response.sync="responses.slider"
            />
            <button
              @click="
                $magpie.addResult({
                  question: $magpie.currentTrial.sliderRating.question || '',
                  answer: responses.slider
                });
                $magpie.nextScreen();
              "
            >
              Done
            </button>
          </template>
        </Screen>
      </template>

      <ConnectInteractive />

      <Screen>
        <Chat></Chat>
        <button @click="$magpie.nextScreen">Next</button>
      </Screen>

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
