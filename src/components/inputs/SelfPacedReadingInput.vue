<docs>

```vue
<Experiment>
    <Screen>
        <SelfPacedReadingInput
            :chunks="['This', 'is', 'a', 'nice', 'and', 'very', 'long', 'text.']"
            word-pos="next"
            underline="sentence"
            trigger="$"
            instructions="Press $ to reveal the next word."
            :response-times.sync="$magpie.measurements.times"
            @end="$magpie.saveAndNextScreen()" />
    </Screen>

    <DebugResultsScreen />
</Experiment>
```

</docs>

<template>
  <div>
    <SerialInput
      :iterations="chunks.length + 1"
      @end="
        $emit('update:response-times', responseTimes);
        $emit('end');
      "
    >
      <template #default="{ i, next }">
        <TimerStop
          v-if="i > 0"
          id="responseTime"
          @update:time="
            responseTimes.push($event);
            i === chunks.length ? next() : null;
          "
        />
        <TimerStart id="responseTime" />
        <KeypressInput
          :keys="{ [trigger]: instructions }"
          :show-options="showKeypressOptions"
          @update:response="next"
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
            v-for="(chunk, j) in chunks"
            :key="j"
            :class="{ current: i === j }"
            v-text="chunk"
          ></span>
        </div>
      </template>
    </SerialInput>
  </div>
</template>

<script>
import KeypressInput from '../inputs/KeypressInput';
import SerialInput from '@/components/inputs/SerialInput';
import TimerStop from '@/components/helpers/TimerStop';
import TimerStart from '@/components/helpers/TimerStart';

export default {
  name: 'SelfPacedReadingInput',
  components: { TimerStart, TimerStop, SerialInput, KeypressInput },
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
    },
    /**
     * Whether to show the options for the KeypressInput
     */
    showKeypressOptions: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      responseTimes: []
    };
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
