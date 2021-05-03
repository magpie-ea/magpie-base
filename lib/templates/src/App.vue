<template>
  <!--
  Define your data sources with the trials attribute -->
  <Experiment
    :variables="{
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
      <template v-for="i in forced_choice_length">
        <Screen :key="'forcedchoice-' + i">
          <template
            #0="{
              measurements,
              variables: { forced_choice },
              saveAndNextScreen
            }"
          >
            <!-- We automatically retrieve trial data from our data sources using $magpie.currentTrial.<data-source>
            Once the participant has made a choice, the update:response event fires and we save the answer and progress to the next screeen.
            -->
            <img :src="forced_choice.picture" alt="" />
            <p v-text="forced_choice.question"></p>
            <ForcedChoiceInput
              :options="[forced_choice.option1, forced_choice.option2]"
              :response.sync="measurements.response"
              @update:response="saveAndNextScreen()"
            />
          </template>
        </Screen>
      </template>

      <template v-for="i in multi_dropdown_length">
        <Screen :key="'multidropdown-' + i">
          <template
            #0="{
              measurements,
              variables: { multi_dropdown },
              saveAndNextScreen
            }"
          >
            <!-- Use $set for setting new properties to existing objects -->
            <CompletionInput
              :text="
                multi_dropdown.sentence_chunk_1 +
                ' %s ' +
                multi_dropdown.sentence_chunk_2 +
                ' %s ' +
                multi_dropdown.sentence_chunk_3
              "
              :options="[
                multi_dropdown.choice_options_1.split('|'),
                multi_dropdown.choice_options_2.split('|')
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

      <template v-for="i in sentenceChoice_length / 2">
        <template v-for="j in 2">
          <Screen :key="'sentenceChoice-' + i + '' + j">
            <template
              #0="{
                variables: { sentenceChoice },
                measurements,
                saveAndNextScreen
              }"
            >
              <img :src="sentenceChoice.picture" alt="" />
              <p v-text="sentenceChoice.question"></p>
              <ForcedChoiceInput
                :options="[sentenceChoice.option1, sentenceChoice.option2]"
                :response.sync="measurements.response"
                @update:response="saveAndNextScreen()"
              />
            </template>
          </Screen>
        </template>
        <template v-for="j in 2">
          <Screen :key="'sentenceChoice-' + i + '' + j">
            <template
              #0="{
                measurements,
                variables: { imageSelection },
                saveAndNextScreen
              }"
            >
              <p>{{ imageSelection.question }}</p>
              <ImageSelectionInput
                :options="[
                  {
                    label: imageSelection.option1,
                    src: imageSelection.picture1
                  },
                  {
                    label: imageSelection.option2,
                    src: imageSelection.picture2
                  }
                ]"
                :response.sync="measurements.response"
                @update:response="saveAndNextScreen()"
              />
            </template>
          </Screen>
        </template>
      </template>

      <template v-for="i in sliderRating_length">
        <Screen :key="'sliderRating-' + i">
          <template #0="{ nextSlide }">
            <Wait :time="500" @done="nextSlide" />
          </template>

          <template #1="{ nextSlide, variables: { sliderRating } }">
            <Wait :time="1500" @done="nextSlide" />
            <img :src="sliderRating.picture" alt="" />
          </template>

          <template
            #2="{
              measurements,
              variables: { sliderRating },
              saveAndNextScreen
            }"
          >
            <p>{{ sliderRating.question }}</p>
            <SliderInput
              :left="sliderRating.optionLeft"
              :right="sliderRating.optionRight"
              :response.sync="measurements.slider"
            />
            <button @click="saveAndNextScreen()">Done</button>
          </template>
        </Screen>
      </template>

      <ConnectInteractive />

      <Screen>
        <template #0="{ measurements, saveAndNextScreen }">
          <Chat :messages.sync="measurements.messages"></Chat>
          <button @click="saveAndNextScreen()">Next</button>
        </template>
      </Screen>

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
