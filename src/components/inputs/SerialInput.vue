<docs>
This is a simple implementation of a Self-paced reading task.

```vue
<Experiment>
    <Screen>

      <Slide>
        <img src="img/fries.jpg" />
        <SerialInput
            :iterations="'Hello world, how are you?'.split(' ').length"
            @end="$magpie.saveAndNextScreen()">
          <template #default="{i, record, next}">
            <TimerStop
                v-if="i > 0"
                id="responseTime"
                @update:time="record('responseTimes', $event)"
            />
            <TimerStart id="responseTime" />
            <KeypressInput :keys="{'f': 'Continue Left', 'j': 'Continue Right'}" @update:response="record('pressedKey', $event); next()" />
            <p>{{ 'Hello world, how are you?'.split(' ')[i] }}</p>
          </template>
        </SerialInput>
      </Slide>

    </Screen>

  <DebugResultsScreen />
</Experiment>
```

</docs>

<template>
  <div class="serial_input">
    <div :key="i" class="slice">
      <slot
        name="default"
        :i="i"
        :iterations="iterations"
        :record="
          (variable, value) =>
            $magpie.measurements[variable] &&
            $magpie.measurements[variable].length
              ? $magpie.measurements[variable].push(value)
              : ($magpie.measurements[variable] = [value])
        "
        :next="() => i++"
      >
        No template defined.
      </slot>
    </div>
  </div>
</template>

<script>
/**
 * SerialInputs allow you to record inputs on a series of items that are interrelated and belong to the same trial
 */
export default {
  name: 'SerialInput',
  props: {
    /**
     * The number of iterations
     */
    iterations: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      i: 0
    };
  },
  watch: {
    i() {
      if (this.i >= this.iterations) {
        this.$emit('end');
      }
    }
  }
};
</script>
