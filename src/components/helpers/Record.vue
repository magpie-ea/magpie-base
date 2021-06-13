<docs>
Record allows you to easily add arbitrary data to your measurements:
```vue
<Experiment>

    <template v-for="(task, i) in [{foo: 'bar'}, {foo: 'baz'}]">
      <Screen :key="i">

        <Slide>
          Slide 1<br />
          <Record :data="task" />
          <button @click="$magpie.nextSlide()">Next slide</button>
        </Slide>

        <Slide>
          Slide 2<br />
          <button @click="$magpie.saveAndNextScreen()">next</button>
        </Slide>

      </Screen>
    </template>

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
      if (typeof this.data[key] !== 'undefined') {
        Vue.set(this.$magpie.measurements, key, this.data[key]);
      }
    });
  }
};
</script>

<style scoped></style>
