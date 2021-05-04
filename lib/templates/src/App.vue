<template>
  <!--
  Define your data sources with the trials attribute -->
  <Experiment title="_magpie demo">
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
        <button @click="$magpie.nextScreen()">Begin the experiment</button>
      </Screen>

      <Screen :title="'General Instructions'">
        This is a sample instructions view.
        <br />
        <br />
        First you will go through two practice trials. The practice trial view
        uses magpie's forced choice trial input.
        <button @click="$magpie.nextScreen()">to the practice trial</button>
      </Screen>

      <!-- Practice trials -->
      <!-- Here we create screens in a loop for every entry in forced_choice -->
      <template v-for="(forced_choice_task, i) of forced_choice">
        <Screen :key="'forcedchoice-' + i" :progress="i / forced_choice.length">
          <template #0="{ measurements, saveAndNextScreen }">
            <!-- We automatically retrieve trial data from our data sources using $magpie.currentTrial.<data-source>
            Once the participant has made a choice, the update:response event fires and we save the answer and progress to the next screeen.
            -->
            <img :src="forced_choice_task.picture" alt="" />
            <p v-text="forced_choice_task.question"></p>
            <ForcedChoiceInput
              :options="[
                forced_choice_task.option1,
                forced_choice_task.option2
              ]"
              :response.sync="measurements.response"
              @update:response="saveAndNextScreen()"
            />
          </template>
        </Screen>
      </template>

      <template v-for="(dropdown_task, i) in multi_dropdown">
        <Screen
          :key="'multidropdown-' + i"
          :progress="i / multi_dropdown.length"
        >
          <template #0="{ measurements, saveAndNextScreen }">
            <!-- Use $set for setting new properties to existing objects -->
            <CompletionInput
              :text="
                dropdown_task.sentence_chunk_1 +
                ' %s ' +
                dropdown_task.sentence_chunk_2 +
                ' %s ' +
                dropdown_task.sentence_chunk_3
              "
              :options="[
                dropdown_task.choice_options_1.split('|'),
                dropdown_task.choice_options_2.split('|')
              ]"
              :responses.sync="measurements.completion"
            />
            <!-- Only show button when both responses are given -->
            <button
              v-if="
                measurements.completion &&
                measurements.completion.filter(Boolean).length === 2
              "
              @click="saveAndNextScreen()"
            >
              Done
            </button>
          </template>
        </Screen>
      </template>

      <!-- Main trials -->

      <template v-for="i in range(0, sentenceChoice.length, 2)">
        <template
          v-for="(sentenceChoice_task, j) in sentenceChoice.slice(i, 2)"
        >
          <Screen :key="'sentenceChoice-' + i + '' + j">
            <template #0="{ measurements, saveAndNextScreen }">
              <img :src="sentenceChoice_task.picture" alt="" />
              <p v-text="sentenceChoice_task.question"></p>
              <ForcedChoiceInput
                :options="[
                  sentenceChoice_task.option1,
                  sentenceChoice_task.option2
                ]"
                :response.sync="measurements.response"
                @update:response="saveAndNextScreen()"
              />
            </template>
          </Screen>
        </template>
        <template
          v-for="(imageSelection_task, j) in imageSelection.slice(i, 2)"
        >
          <Screen :key="'sentenceChoice-' + i + '' + j">
            <template #0="{ measurements, saveAndNextScreen }">
              <p>{{ imageSelection_task.question }}</p>
              <ImageSelectionInput
                :options="[
                  {
                    label: imageSelection_task.option1,
                    src: imageSelection_task.picture1
                  },
                  {
                    label: imageSelection_task.option2,
                    src: imageSelection_task.picture2
                  }
                ]"
                :response.sync="measurements.response"
                @update:response="saveAndNextScreen()"
              />
            </template>
          </Screen>
        </template>
      </template>

      <template v-for="(rating_task, i) in sliderRating">
        <Screen :key="'sliderRating-' + i">
          <template #0="{ nextSlide }">
            <Wait :time="500" @done="nextSlide" />
          </template>

          <template #1="{ nextSlide }">
            <Wait :time="1500" @done="nextSlide" />
            <img :src="rating_task.picture" alt="" />
          </template>

          <template #2="{ measurements, saveAndNextScreen }">
            <p>{{ rating_task.question }}</p>
            <SliderInput
              :left="rating_task.optionLeft"
              :right="rating_task.optionRight"
              :response.sync="measurements.slider"
            />
            <button @click="saveAndNextScreen()">Done</button>
          </template>
        </Screen>
      </template>

      <!--

      Comment this in, to try out interactive components like the Chat component.

      <ConnectInteractiveScreen />

      <Screen>
        <template #0="{ measurements, saveAndNextScreen }">
          <Chat :messages.sync="measurements.messages"></Chat>
          <button @click="saveAndNextScreen()">Next</button>
        </template>
      </Screen>

      -->

      <Screen key="additional-information" title="Additional information">
        <template #0="{ measurements, saveAndNextScreen }">
          <p>
            Answering the following questions is optional, but your answers will
            help us analyze our results.
          </p>
          <div style="text-align: left; width: 200px; margin: 0 auto">
            <p>
              <label
                >Age
                <input
                  v-model="measurements.age"
                  type="number"
                  max="110"
                  min="18"
              /></label>
            </p>
            <p>
              <label
                >Gender
                <DropdownInput
                  :options="['male', 'female', 'other']"
                  :response.sync="measurements.education"
                />
              </label>
            </p>
            <p>
              <label
                >Level of Eduction
                <DropdownInput
                  :options="[
                    'Graduated Highschool',
                    'Graduated Collage',
                    'Higher degree'
                  ]"
                  :response.sync="measurements.education"
                />
              </label>
            </p>
            <p>
              <label
                >Native langauges
                <input
                  v-model="measurements.languages"
                  type="text"
                  placeholder="the langauge(s) spoken at home when you were a child"
              /></label>
            </p>
            Further comments
            <TextareaInput
              :response.sync="measurements.education"
            ></TextareaInput>
          </div>

          <button @click="saveAndNextScreen()">Next</button>
        </template>
      </Screen>

      <DebugResults />

      <!-- While developing your experiment, using the DebugResults screen is fine,
      once you're going live, you can use the <SubmitResults> screen to automatically send your experimental data to the server. -->

      <Screen :title="'Thanks!'"> Goodbye </Screen>
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
    return {
      forced_choice,
      multi_dropdown,
      sentenceChoice,
      imageSelection: _.shuffle(imageSelection),
      sliderRating,

      // Expose lodash.range to template above
      range: _.range
    };
  }
};

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
    QUD: 'Here is a sentence that stays on the screen from the very beginning',
    picture: 'images/question_mark_03.jpg',
    question: "What's on the bread?",
    optionLeft: 'ham',
    optionRight: 'jam'
  }
];
</script>
