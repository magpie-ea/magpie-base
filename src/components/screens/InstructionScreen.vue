<docs>
This is a pre-built instruction screen, with limited functionality, but simpler to use.

```vue
<Experiment>
  <template #screens>

    <InstructionScreen>
      These are instructions for the participant.<br />
      Below the instructions is a button to continue.
    </InstructionScreen>

    <InstructionScreen>
      This is another instruction screen.<br />
      Below the instructions is a button to continue.
    </InstructionScreen>

  </template>
</Experiment>
```
</docs>

<template>
  <Screen v-bind="$attrs">
    <template #0="{ nextScreen }">
      <div class="instructions">
        <slot name="default" />
      </div>
      <button @click="nextScreen">Next</button>
    </template>
  </Screen>
</template>

<script>
import Screen from '../Screen';

export default {
  name: 'InstructionScreen',
  components: {
    Screen
  },
  props: {}
};
</script>
<style scoped>
.instructions {
  width: 600px;
  margin: 0 auto;
  text-align: justify;
}
</style>
