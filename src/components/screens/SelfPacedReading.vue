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
        <div v-wait:1="nextSlide" />
      </slot>
    </template>

    <template #1="{ nextSlide }">
      <div v-wait:500="nextSlide"></div>
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
          v-text="splitter"
          :class="{ current: i === word }"
        ></span>
      </div>
      <!-- @slot task content, displayed after the whole text was read -->
      <slot name="task" v-if="word >= splitters.length"></slot>
    </template>
  </Screen>
</template>

<script>
import Screen from '../Screen';
import KeypressInput from '@/components/inputs/KeypressInput';
import RatingInput from '@/components/inputs/RatingInput';

export default {
  name: 'SelfPacedReading',
  components: { RatingInput, KeypressInput, Screen },
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
      word: -1
    };
  },
  computed: {
    splitters() {
      return this.text.split('|');
    }
  },
  methods: {
    nextWord() {
      this.word++;
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
