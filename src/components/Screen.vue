<docs>
### Simple screen

```vue
<Experiment>
    <Screen>
      Hello World.
    </Screen>
</Experiment>
```

### Show progress

```vue
<Experiment>
    <Screen v-for="i in 10" :key="i" :progress="i/10">
      Hello World.
      <button @click="$magpie.nextScreen()">Next</button>
    </Screen>
</Experiment>
```

### Multiple slides
One screen may consist of multiple slides that are numbered incrementally and displayed one after another.
You can go to the next slide with the `nextSlide` function that is exposed by the Screen component.

```vue
<Experiment>
    <Screen title="Wow.">

      <Slide>
        Hello <button @click="$magpie.nextSlide()">World</button>.
      </Slide>

      <Slide>
        Hello you.
      </Slide>

    </Screen>
</Experiment>
```

### Store measurements
The screen component also conveniently exposes an object for you to store in the measurements of the current screen, so you can later save them.

```vue
<Experiment>
    <Screen title="Wow.">
      <Slide>
        Hello
        <TextareaInput :response.sync="$magpie.measurements.text" />
        {{ $magpie.measurements.text }}?
        <button v-if="$magpie.measurements.text" @click="$magpie.saveAndNextScreen()">Done</button>
      </Slide>
    </Screen>

    <DebugResultsScreen />

</Experiment>
```

### Validate measurements
The screen can also be used to validate observations.

```vue
<Experiment>
    <Screen :validations="{
      text: {
        minLength: $magpie.v.minLength(4),
        alpha: $magpie.v.alpha
      }
    }">

      <Slide>
        Hello
        <TextareaInput :response.sync="$magpie.measurements.text" />

        {{ $magpie.measurements.text }}?

        <button v-if="!$magpie.validateMeasurements.$invalid" @click="$magpie.saveAndNextScreen()">Done</button>

        <p v-else>At least 4 characters required and only alphabetic characters, please.</p>

      </Slide>

    </Screen>

    <DebugResults />
</Experiment>
```

</docs>

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
      measurements: {}
    };
  },
  watch: {
    '$magpie.measurements': {
      handler() {
        this.measurements = this.$magpie.measurements;
        this.$v.measurements.$touch();
      },
      deep: true
    }
  },
  beforeMount() {
    this.$magpie.setProgress(this.progress);
  },
  mounted() {
    this.$magpie.validateMeasurements = this.$v.measurements;
    this.$magpie.mousetracking.start();
  },
  validations() {
    return {
      measurements: this.validations
    };
  },
  /**
   * Place your slides inside this slot. They will be visible one after the other, like a slide show.
   * @slot default
   */
  render(h) {
    const children = this.$slots.default;
    if (!children) {
      return h('div', { class: 'screen' }, [
        this.title ? h('h2', this.title) : null
      ]);
    }
    let slide;
    const slides = children.filter((c) => !!c.componentOptions);
    if (
      slides.length &&
      slides.every((c) => c.componentOptions.tag === 'Slide')
    ) {
      slide = slides[this.$magpie.currentSlideIndex];
    } else {
      slide = this.$slots.default;
    }
    return h('div', { class: 'screen' }, [
      this.title ? h('h2', this.title) : null,
      slide
    ]);
  }
};
</script>

<style scoped>
.screen {
  flex-grow: 1;
  position: relative;
}
</style>
