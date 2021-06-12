<docs>
Record allows you to easily add arbitrary data to your measurements:
```vue
<Experiment>

    <Screen v-for="(task, i) in [{foo: 'bar'}, {foo: 'baz'}]">

      <Slide>
        Slide 1<br />
        <Record :data="task" />
        <Timer v-model="$magpie.measurements.timer"></Timer>
        <button @click="$magpie.nextSlide()">Next slide</button>
      </Slide>

      <Slide>
        Slide 2<br />
        Time until click: {{$magpie.measurements.timer()/1000}} seconds
        <button @click="$magpie.saveAndNextScreen()">next</button>
      </Slide>

    </Screen>

    <DebugResultsScreen />
</Experiment>
```
</docs>
<template><span /></template>
<script>
import Vue from 'vue';

export default {
  name: 'Record',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  mounted() {
    Object.keys(this.data).forEach((key) => {
      Vue.set(
        this.$magpie.experiment.currentScreenComponent.measurements,
        key,
        this.data[key]
      );
    });
  }
};
</script>

<style scoped></style>
