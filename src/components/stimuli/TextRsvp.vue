<docs>
This component allows you to display textual content in a rapid serial manner, commonly known as Rapid Serial Visual Presentation (RSVP).
```vue
<Experiment>
  <template #screens>
    <Screen>
      <template #0="{nextSlide}">
        <button @click="nextSlide">Start</button>
      </template>
      <template #1="{nextSlide}">
        <TextRsvp :text="'I wonder if you can read this, as it is a rapid serial visual presentation of a long text.'.split(' ')" @end="nextSlide"/>
      </template>
      <template #2>
        That's what I thought.
      </template>
    </Screen>
  </template>
</Experiment>
```

</docs>

<template>
  <div>
    <p>{{ text[word] }}</p>
    <Wait
      v-if="word < text.length"
      :key="word"
      :time="interval"
      @done="nextWord"
    />
  </div>
</template>

<script>
import Wait from '../helpers/Wait';

export default {
  name: 'TextRsvp',
  components: { Wait },
  props: {
    /**
     * The text chunks
     */
    text: {
      type: Array,
      required: true
    },
    /**
     * Interval between chunks in miliseconds
     */
    interval: {
      type: Number,
      default: 300
    }
  },
  data() {
    return {
      word: 0
    };
  },
  methods: {
    nextWord() {
      this.word++;
      if (this.word >= this.text.length) {
        this.$emit('end');
      }
    }
  }
};
</script>
