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

### Validate measurements
The screen can also be used to validate observations.

```vue
<Experiment>
  <template #screens>

    <Screen :validations="{
      text: {
        minLength: $magpie.v.minLength(4),
        alpha: $magpie.v.alpha
      }
    }">

      <template #0="{measurements, saveAndNextScreen, validations}">
        Hello
        <TextareaInput :response.sync="measurements.text" />

        {{ measurements.text }}?

        <button v-if="!validations.text.$error" @click="saveAndNextScreen()">Done</button>

        <p v-else>At least 4 characters required and only alphabetic characters, please.</p>

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
           @binding {object} variables An object that exposes the same variables as $magpie.currentVars
           @binding {object} measurements a temporary object to store your responses before adding them to the results
           @binding {object} validations an object that exposes validation results as defined by Screen's validation property
           @binding {function} nextScreen Jump to the next screen
           @binding {function} saveAndNextScreen Jump to the next screen, saving currently recorded measurements
           @binding {function} save save currently recorded measurements
           @binding {function} nextSlide Jump to the next slide
      -->
      <slot
        :name="currentSlide"
        :nextSlide="nextSlide"
        :measurements="measurements"
        :nextScreen="(...args) => $magpie.nextScreen(...args)"
        :saveAndNextScreen="saveAndNextScreen"
        :save="save"
        :variables="$magpie.currentVars"
        :validations="$v.measurements"
      >
        Slide #{{ currentSlide }} could not be found
      </slot>
    </slot>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate';

/**
 * This component lets you create experiment sections that appear one after the other like a slideshow.
 * Trial data
 */
export default {
  name: 'Screen',
  mixins: [validationMixin],
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
    },
    /**
     * Define validators for measurements
     */
    validations: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      currentSlide: -1,
      measurements: Object.fromEntries(
        Object.entries(this.validations).map(([field]) => [field, null])
      )
    };
  },
  watch: {
    measurements: {
      handler() {
        this.$v.measurements.$touch();
      },
      deep: true
    }
  },
  mounted() {
    this.currentSlide = 0;
    this.$magpie.mousetracking.start();
    this.$magpie.$el.addEventListener('mousemove', this.onMouseMove);
    this.$magpie.setProgress(this.progress);
  },
  beforeDestroy() {
    this.$magpie.$el.removeEventListener('mousemove', this.onMouseMove);
  },
  validations() {
    return {
      measurements: this.validations
    };
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
