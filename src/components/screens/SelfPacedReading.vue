<docs>

```vue
<Experiment>
  <template #screens>
    <SelfPacedReading text="This|is|a|nice|text." word-pos="next" underline="sentence">
      <template #task>
        <RatingInput question="Is it?" left="No" right="Yes" />
      </template>
    </SelfPacedReading>
  </template>
</Experiment>
```

</docs>

<template>
  <Screen :title="title">
    <template #0="{ nextSlide }">
      <!-- @slot provide a preparation stimulus, i.e. a text or an audio explanation-->
      <slot name="prep" :done="nextSlide">
        <Wait :time="1" @done="nextSlide" />
      </slot>
    </template>

    <template #1="{ nextSlide }">
      <Wait :time="500" @done="nextSlide" />
    </template>

    <template #2="{ nextSlide }">
      <!-- @slot optional stimulus content -->
      <slot name="stimulus"></slot>
      <KeypressInput
        :keys="{ [trigger]: instructions }"
        @change:answer="nextWord"
      />
      <div
        :class="{
          text: true,
          'underline-words': underline === 'words',
          'underline-sentence': underline === 'sentence',
          'show-all': wordPos === 'next'
        }"
      >
        <span
          v-for="(splitter, i) in splitters"
          :key="i"
          :class="{ current: i === word }"
          v-text="splitter"
        ></span>
      </div>
      <!-- @slot task content, displayed after the whole text was read -->
      <slot v-if="word >= splitters.length" name="task">
        <Wait :time="100" @done="$exp.nextScreen()" />
      </slot>
    </template>
  </Screen>
</template>

<script>
import Screen from '../Screen';
import KeypressInput from '../inputs/KeypressInput';
import Wait from '../helpers/Wait';

export default {
  name: 'SelfPacedReading',
  components: { KeypressInput, Screen, Wait },
  props: {
    /**
     * Title of the screen
     */
    title: {
      type: String,
      default: ''
    },
    /**
     * Self-paced reading text
     */
    text: {
      type: String,
      required: true
    },
    /**
     * Give instructions on what the participant is supposed to do
     */
    instructions: {
      type: String,
      default: 'Press SPACE to reveal the words.'
    },
    /**
     * The key to press to reveal the next word
     */
    trigger: {
      type: String,
      default: ' '
    },
    /**
     * Underline type
     *
     * @values words, sentence or none
     */
    underline: {
      type: String,
      default: 'none'
    },
    /**
     * Whether to show the next word at the same position or at the next
     *
     * @values same or next
     */
    wordPos: {
      type: String,
      default: 'same'
    }
  },
  data() {
    return {
      word: -1,
      responseTimes: [],
      startTime: null
    };
  },
  computed: {
    splitters() {
      return this.text.split('|');
    }
  },
  methods: {
    nextWord() {
      if (this.word > -1) {
        this.responseTimes.push(Date.now() - this.startTime);
      }
      this.word++;
      this.startTime = Date.now();
      if (this.word === this.splitters.length) {
        this.$emit('change:response-times', this.responseTimes);
      }
    }
  }
};
</script>

<style scoped>
.text {
  margin: 30px auto;
}

.text * {
  margin-right: 5px;
}

.text.underline-sentence * {
  margin-right: 0;
  padding-right: 5px;
  border-bottom: 1px solid black;
}

.text.underline-words * {
  border-bottom: 1px solid black;
}

.text :not(.current) {
  display: none;
}

.text.show-all :not(.current) {
  color: transparent;
  display: inline;
}

.text .current {
  color: black;
  display: inline;
}
</style>
