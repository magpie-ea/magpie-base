<docs>

```vue
<Experiment>
    <Screen>
        <SelfPacedReading
            :chunks="['This', 'is', 'a', 'nice', 'text.']"
            word-pos="next"
            underline="sentence"
            trigger="~"
            :response-times.sync="$magpie.measurements.times" />
    </Screen>

    <DebugResultsScreen />
</Experiment>
```

</docs>

<template>
  <div>
    <div v-if="slide === 0">
      <!-- @slot provide a preparation stimulus, i.e. a text or an audio explanation-->
      <slot name="prep" :done="nextSlide()">
        <Wait :time="1" @done="nextSlide()" />
      </slot>
    </div>

    <div v-if="slide === 1">
      <Wait :time="500" @done="nextSlide()" />
    </div>

    <div v-if="slide === 2">
      <!-- @slot optional stimulus content -->
      <slot name="stimulus"></slot>
      <KeypressInput
        :keys="{ [trigger]: instructions }"
        @update:response="nextWord"
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
          v-for="(chunk, i) in chunks"
          :key="i"
          :class="{ current: i === word }"
          v-text="chunk"
        ></span>
      </div>
      <!-- @slot task content, displayed after the whole text was read -->
      <template v-if="word >= chunks.length">
        <Wait :time="0" @done="$emit('end')" />
      </template>
    </div>
  </div>
</template>

<script>
import KeypressInput from '../inputs/KeypressInput';
import Wait from '../helpers/Wait';

export default {
  name: 'SelfPacedReading',
  components: { KeypressInput, Wait },
  props: {
    /**
     * Self-paced reading text chunks
     */
    chunks: {
      type: Array,
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
      startTime: null,
      slide: 0
    };
  },
  methods: {
    nextSlide() {
      this.slide++;
    },
    nextWord() {
      if (this.word > -1) {
        this.responseTimes.push(Date.now() - this.startTime);
      }
      this.word++;
      this.startTime = Date.now();
      if (this.word === this.chunks.length) {
        this.$emit('update:response-times', this.responseTimes);
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
