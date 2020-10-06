<docs>
```vue
<Experiment :trials="{ color: ['blue', 'green', 'yellow'] }">
  <template #screens>
    <Screen>
      <template #0="{nextSlide}">
      Slide 1
      <button @click="nextSlide">Next slide</button>
      </template>
      <template #1="{nextSlide}">
        Slide 2
        <Wait :time="500" @done="nextSlide" />
      </template>
      <template #2="{nextSlide}">
        Slide 3
        <Wait :time="500" @done="nextSlide" />
      </template>
      <template #3="{nextSlide}">
        Slide 4
      </template>
    </Screen>
  </template>
</Experiment>
```
</docs>
<template> </template>
<script>
export default {
  name: 'Wait',
  props: {
    time: {
      required: true,
      type: Number
    }
  },
  mounted() {
    this.set();
  },
  watch: {
    time() {
      this.set();
    }
  },
  methods: {
    set() {
      setTimeout(() => this.$emit('done'), this.time);
    }
  }
};
</script>

<style scoped></style>
