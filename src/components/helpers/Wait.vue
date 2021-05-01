<docs>
```vue
<Experiment>
  <template #screens>

    <Screen>

      <template #0="{nextSlide}">
        Slide 1
        <button @click="nextSlide">Next slide</button>
      </template>

      <template #1="{nextSlide}">
        Slide 2
        <Wait key="wait for slide 2" :time="500" @done="nextSlide" />
      </template>

      <template #2="{nextSlide}">
        Slide 3
        <Wait key="wait for slide 3" :time="500" @done="nextSlide" />
      </template>

      <template #3="{nextSlide}">
        Slide 4
        <Wait key="wait for slide 4" :time="500" @done="nextSlide" />
      </template>

      <template #4="{nextSlide}">
        Slide 5
      </template>

    </Screen>

  </template>
</Experiment>
```
</docs>
<template><span /></template>
<script>
export default {
  name: 'Wait',
  props: {
    time: {
      required: true,
      type: Number
    }
  },
  watch: {
    time() {
      this.set();
    }
  },
  mounted() {
    this.set();
  },
  updated() {
    this.set();
  },
  activated() {
    this.set();
  },
  methods: {
    set() {
      setTimeout(() => this.$emit('done'), this.time);
    }
  }
};
</script>

<style scoped></style>
