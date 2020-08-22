<docs>

### Populating trial data with an array

```vue
<Experiment :trials="{ color: ['blue', 'green', 'yellow'] }">
  <template #screens>
    <Screen>
      {{ $exp.trial.color }}
      <button @click="$exp.nextScreen()">next</button>
    </Screen>
    <Screen>
      {{ $exp.trial.color }}
      <button @click="$exp.nextScreen()">next</button>
    </Screen>
    <Screen>
      {{ $exp.trial.color }}
    </Screen>
  </template>
</Experiment>
```

### Populating trial data with a function

```vue
<Experiment :trials="{number: () => Math.random()}">
  <template #screens>
    <Screen>
      {{ $exp.trial.number }}
      <button @click="$exp.nextScreen()">next</button>
    </Screen>
    <Screen>
      {{ $exp.trial.number }}
      <button @click="$exp.nextScreen()">next</button>
    </Screen>
    <Screen>
      {{ $exp.trial.number }}
    </Screen>
  </template>
</Experiment>
```


</docs>

<script>
/**
 * This is the main component for your online experiment. Put it at the root of your application.
 * The experiment is available in all subcomponents and in the parent as `$exp`
 * @property trial Per trial data supplied via the trials prop
 */
export default {
  name: 'Experiment',
  props: {
    /**
     * Any data that you want to use in your trials you can pass in via this prop.
     * You can either provide an array of data or a function that returns one sample at a time.
     * This data will be available at run time via `$exp.trial`
     */
    trials: {
      type: Object,
      default: () => ({})
    }
  },
  provide() {
    return {
      experiment: this
    };
  },
  data() {
    // Setup magic "trial" slot property
    const trial = {};
    for (const type of Object.keys(this.trials)) {
      if (Array.isArray(this.trials[type])) {
        trial.__defineGetter__(type, () => {
          if (this.currentTrial[type]) {
            return this.currentTrial[type];
          }
          this.currentTrial[type] = this.trials[type].shift();
          return this.currentTrial[type];
        });
      } else if ('function' === typeof this.trials[type]) {
        trial.__defineGetter__(type, () => {
          if (this.currentTrial[type]) {
            return this.currentTrial[type];
          }
          this.currentTrial[type] = this.trials[type](this.currentScreen);
          return this.currentTrial[type];
        });
      } else {
        throw new Error(
          'Unsupported type of trial type definition for trial type ' +
            type +
            '. Expected either Array or Function'
        );
      }
    }

    return {
      currentScreen: 0,
      results: {},
      currentTrial: {},
      trial
    };
  },
  methods: {
    /**
     * Go to the next screen.
     * @public
     * @param index{int} the index of the screen to go to (optional; default is next screen)
     */
    nextScreen(index) {
      this.currentTrial = {};
      if (typeof index === 'number') {
        this.currentScreen = index;
        return;
      }
      this.currentScreen += 1;
    },
    /**
     * Add a result set
     * @public
     * @param data{Object} a flat object whose data you want to add to the results
     */
    addResult(data) {
      if (!this.results[this.currentScreen]) {
        this.results[this.currentScreen] = [];
      }
      this.results[this.currentScreen].push(data);
    }
  },
  /**
   * The contents of this slot will be visible during the entire experiment
   * @slot title
   */
  /**
   * Place your screens inside this slot. They will be visible one after the other, like a slide show.
   * @slot screens
   */
  render(h) {
    // HACKY-O
    this.$parent.$exp = this;
    const children = this.$slots.screens;
    const screens = children.filter((c) => !!c.componentOptions);
    return h('div', { class: 'experiment' }, [
      h('div', { class: 'header' }, [
        h('div', { class: 'col title' }, this.$slots.title),
        h(
          'div',
          { class: 'col' },
          '' + (this.currentScreen + 1) + '/' + Math.round(screens.length)
        )
      ]),
      screens[this.currentScreen]
    ]);
  }
};
</script>

<style>
.experiment {
  margin: 100px auto;
  width: 800px;
  height: 600px;
  border-radius: 10px;
  border: 1px solid #ababab;
  padding: 20px;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  position: relative;
  display: flex;
  flex-direction: column;
}

.header {
  text-align: left;
  display: flex;
  flex-direction: row;
  flex-grow: 0;
}

.header .col {
  flex-shrink: 0;
  flex-grow: 1;
}
.header .col:last-child {
  text-align: right;
}

/**
 Default styles
 */

h1,
h2,
h3,
h4 {
  color: rgba(0, 0, 0, 0.87);
  font-family: 'Playfair Display', 'Noto Serif', serif;
  text-align: center;
}

h1 {
  font-size: 34px;
}

.experiment {
  color: rgba(0, 0, 0, 0.87);
  font-size: 17px;
  line-height: 27px;
  font-family: 'Lato', 'Noto Sans', sans-serif;
}

button {
  background-color: #5187ba;
  border: none;
  border-radius: 2px;
  color: white;
  display: block;
  font-family: 'Lato', 'Noto Sans', sans-serif;
  font-size: 12px;
  line-height: 20px;
  font-weight: 700;
  letter-spacing: 0.9px;
  margin: 40px auto 20px auto;
  outline: none;
  padding: 5px 10px;
  text-transform: uppercase;
}
button:hover,
button:focus {
  background-color: #324d93;
}
</style>
