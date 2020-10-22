<docs>
```vue
<Experiment>
  <template #screens>
    <Screen>
      <template #0="{nextSlide}">
        Slide 1<br />
        <Timer v-model="timer"></Timer>
        <button @click="nextSlide">Next slide</button>
      </template>
      <template #1="{nextSlide}">
        Slide 2<br />
        Time until click: {{timer()/1000}} seconds
      </template>
    </Screen>
  </template>
</Experiment>
```
</docs>
<template><span /></template>
<script>
export default {
  name: 'Timer',
  data() {
    return {
      startTime: null
    };
  },
  mounted() {
    this.start();
  },
  updated() {
    this.start();
  },
  activated() {
    this.start();
  },
  methods: {
    time() {
      return Date.now() - this.startTime;
    },
    start() {
      this.startTime = Date.now();
      this.$emit('input', this.time);
    }
  }
};
</script>

<style scoped></style>
