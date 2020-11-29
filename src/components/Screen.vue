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

### Store responses
The screen component also conveniently exposes an object for you to store in the responses of the current screen, so you can later submit them using `$magpie.addResult`.

```vue
<Experiment>
  <template #screens>
    <Screen title="Wow.">
      <template #0="{nextSlide, responses}">
        Hello
        <TextareaInput :response.sync="responses.text" />
        {{ responses.text }}?
        <button v-if="responses.text" @click="nextSlide">Done</button>
      </template>
      <template #1="{responses}">
        {{ responses.text }}!
      </template>
    </Screen>
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
           @binding {object} responses a temporary object to store your responses before adding them to the results
      -->
      <slot :name="currentSlide" :nextSlide="nextSlide" :responses="responses">
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
    }
  },
  data() {
    return {
      currentSlide: 0,
      responses: {}
    };
  },
  mounted() {
    this.$magpie.startMouseTracking();
    this.$magpie.$el.addEventListener('mousemove', this.onMouseMove);
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
      this.$magpie.onMouseMove(e);
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
