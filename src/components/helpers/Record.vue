<docs>
Record allows you to easily add arbitrary data to your measurements:
```vue
<Experiment>
  <template #screens>

    <Screen v-for="(task, i) in [{foo: 'bar'}, {foo: 'baz'}]">

      <template #0="{nextSlide, measurements}">
        Slide 1<br />
        <Record :data="task" />
        <Timer v-model="measurements.timer"></Timer>
        <button @click="nextSlide">Next slide</button>
      </template>

      <template #1="{saveAndNextScreen, measurements}">
        Slide 2<br />
        Time until click: {{measurements.timer()/1000}} seconds
        <button @click="saveAndNextScreen">next</button>
      </template>

    </Screen>

    <DebugResults />

  </template>
</Experiment>
```
</docs>
<template><span /></template>
<script>
export default {
  name: 'Record',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  mounted() {
    if ('measurements' in this.$parent) {
      Object.assign(this.$parent.measurements, this.data);
    }
  }
};
</script>

<style scoped></style>
