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
</docs>

<template>
  <div class="screen">
    <h2 v-if="title">{{ title }}</h2>
    <!--
    @slot the screen content
    -->
    <slot name="default">
      <!-- @ignore -->
      <slot :name="currentSlide" :nextSlide="nextSlide">
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
      currentSlide: 0
    };
  },
  mounted() {
    this.$exp.startMouseTracking();
    this.$exp.$el.addEventListener('mousemove', this.onMouseMove);
  },
  beforeDestroy() {
    this.$exp.$el.removeEventListener('mousemove', this.onMouseMove);
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
      this.$exp.onMouseMove(e);
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
