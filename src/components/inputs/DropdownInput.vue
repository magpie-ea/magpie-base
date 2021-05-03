<docs>
```vue
<Experiment>
  <template #screens>

    <Screen>

      <template #0="{measurements, saveAndNextScreen}">
        <p>Fries or soup?</p>
        <DropdownInput
            :options="['fries', 'soup']"
            :response.sync="measurements.lunch"
          />
        <p v-if="measurements.lunch === 'soup'">I disagree!</p>
        <button @click="saveAndNextScreen">Submit</button>
      </template>

    </Screen>

    <DebugResults />

  </template>
</Experiment>
```
</docs>

<template>
  <div class="dropdown-input">
    <select ref="input" @input="$emit('update:response', $refs.input.value)">
      <option
        v-for="option of options"
        :key="option"
        :value="option"
        v-text="option"
      ></option>
    </select>
  </div>
</template>

<script>
/**
 * Have your participants provide a text answer
 */
export default {
  name: 'DropdownInput',
  props: {
    options: {
      type: Array,
      required: true
    }
  }
};
</script>

<style scoped></style>
