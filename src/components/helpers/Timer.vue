<docs>
```vue
<Experiment>
    <Screen>

      <Slide>
        Slide 1<br />
        <Timer v-model="$magpie.measurements.timer"></Timer>
        <button @click="$magpie.nextSlide()">Next slide</button>
      </Slide>

      <Slide>
        Slide 2<br />
        Time until click: {{$magpie.measurements.timer()/1000}} seconds
      </Slide>

    </Screen>
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
