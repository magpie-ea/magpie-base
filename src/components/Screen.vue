<docs>
### Simple screen

```vue
<Experiment>
  <template #screens>
    <Screen>
      Hello World.
    </Screen>
  </template>
</Experiment>
```

### Show progress

```vue
<Experiment>
  <template #screens>
    <Screen v-for="i in 10" :key="i" :progress="i/10">
      Hello World.
      <button @click="$magpie.nextScreen()">Next</button>
    </Screen>
  </template>
</Experiment>
```

### Multiple slides
One screen may consist of multiple slides that are numbered incrementally and displayed one after another.
You can go to the next slide with the `nextSlide` function that is exposed by the Screen component.

```vue
<Experiment>
  <template #screens>
    <Screen title="Wow.">

      <template #0="{nextSlide}">
        Hello <button @click="nextSlide">World</button>.
      </template>

      <template #1>
        Hello you.
      </template>

    </Screen>

  </template>
</Experiment>
```

### Store measurements
The screen component also conveniently exposes an object for you to store in the measurements of the current screen, so you can later save them.

```vue
<Experiment>
  <template #screens>

    <Screen title="Wow.">
      <template #0="{measurements, saveAndNextScreen}">
        Hello
        <TextareaInput :response.sync="measurements.text" />
        {{ measurements.text }}?
        <button v-if="measurements.text" @click="saveAndNextScreen()">Done</button>
      </template>
    </Screen>

    <DebugResults />

  </template>
</Experiment>
```
</docs>

<template>
  <div class="screen">
    <h2 v-if="title">{{ title }}</h2>
    <slot name="default">
      <!-- @slot Multi-slot with slide number as name to maintain different slides
           @binding {function} nextSlide Jump to the next slide
           @binding {object} measurements a temporary object to store your responses before adding them to the results
           @binding {function} nextScreen Jump to the next screen
           @binding {function} saveAndNextScreen Jump to the next screen, saving currently recorded measurements
           @binding {function} save save currently recorded measurements
      -->
      <slot
        :name="currentSlide"
        :nextSlide="nextSlide"
        :measurements="measurements"
        :nextScreen="$magpie.nextScreen"
        :saveAndNextScreen="saveAndNextScreen"
        :save="save"
        :variables="$magpie.currentVars"
      >
        Slide #{{ currentSlide }} could not be found
      </slot>
    </slot>
  </div>
</template>

<script>
/**
 * This component lets you create experiment sections that appear one after the other like a slideshow.
 * Trial data
 */
export default {
  name: 'Screen',
  props: {
    /**
     * The title of this screen
     */
    title: {
      type: String,
      required: false,
      default: ''
    },
    /**
     * If you want to show a progress bar, set this to a value between 0 and 1
     */
    progress: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      currentSlide: 0,
      measurements: {}
    };
  },
  mounted() {
    this.$magpie.mousetracking.start();
    this.$magpie.$el.addEventListener('mousemove', this.onMouseMove);
    this.$magpie.setProgress(this.progress);
  },
  beforeDestroy() {
    this.$magpie.$el.removeEventListener('mousemove', this.onMouseMove);
  },
  methods: {
    nextSlide(index) {
      if (typeof index === 'number') {
        this.currentSlide = index;
        return;
      }
      this.currentSlide++;
    },
    onMouseMove(e) {
      /**
       * @property x{int} X coordinate
       * @property y{int} Y coordinate
       */
      this.$emit('mousemove', { x: e.layerX, y: e.layerY });
      this.$magpie.mousetracking.onMouseMove(e);
    },
    save() {
      const variables = Object.assign(
        {},
        ...Object.values(this.$magpie.currentVarsData)
      );
      this.$magpie.addTrialData({ ...variables, ...this.measurements });
    },
    saveAndNextScreen(index) {
      this.save();
      this.$magpie.nextScreen(index);
    }
  }
};
</script>

<style scoped>
.screen {
  flex-grow: 1;
  position: relative;
}
</style>
