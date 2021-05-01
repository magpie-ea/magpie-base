<docs>
### Using a arrays for specifying independent variables

The Experiment component allows you to define trial data to make it conveniently accessible during your experiment.
For every source of trial data you can provide a label and an array. Later you will be able to automatically iterate over that array by accessing the label as a subproperty of `$magpie.currentTrial`.

```vue
<Experiment variables="{ color: ['blue', 'green', 'yellow'] }">
  <template #screens>
    <Screen>
      {{ $magpie.currentVars.color }}
      <button @click="$magpie.nextScreen()">next</button>
    </Screen>
    <Screen>
      {{ $magpie.currentVars.color }}
      <button @click="$magpie.nextScreen()">next</button>
    </Screen>
    <Screen>
      {{ $magpie.currentVars.color }}
    </Screen>
  </template>
</Experiment>
```

### Using a function as a variable source
In case you want to generate data on the fly or have a more sophisticated data selection mechanism in mind, you can also specify a getter function which will return the next item.

```vue
<Experiment variables="{number: () => Math.random()}">
  <template #screens>
    <Screen>
      {{ $magpie.currentVars.number }}
      <button @click="$magpie.nextScreen()">next</button>
    </Screen>
    <Screen>
      {{ $magpie.currentVars.number }}
      <button @click="$magpie.nextScreen()">next</button>
    </Screen>
    <Screen>
      {{ $magpie.currentVars.number }}
    </Screen>
  </template>
</Experiment>
```

### Variables shorthand
There's also a shorthand for fetching variables in a screen.

```vue
<Experiment variables="{ color: ['blue', 'green', 'yellow'] }">
  <template #screens>
    <Screen>
      <template #0="{variables: {color}, nextScreen}">
        {{ color }}
        <button @click="nextScreen()">next</button>
      </template>
    </Screen>
    <Screen>
      <template #0="{variables: {color}, nextScreen}">
        {{ color }}
        <button @click="nextScreen()">next</button>
      </template>
    </Screen>
    <Screen>
      <template #0="{variables: {color}}">
        {{ color }}
      </template>
    </Screen>
  </template>
</Experiment>
```


### Providing a title
Besides the `screens` slot, the Experiment component also provides an optional `title` slot that allows you to display header information on all screens of your experiment.

```vue
<Experiment variables="{number: () => Math.random()}">
  <template #title>
    My experiment
  </template>
  <template #screens>
    <Screen>
      {{ $magpie.currentVars.number }}
      <button @click="$magpie.nextScreen()">next</button>
    </Screen>
    <Screen>
      {{ $magpie.currentVars.number }}
      <button @click="$magpie.nextScreen()">next</button>
    </Screen>
    <Screen>
      {{ $magpie.currentVars.number }}
    </Screen>
  </template>
</Experiment>
```
</docs>

<script>
import kProgress from 'k-progress';
import Magpie from '../Magpie';

/**
 * This is the main component for your online experiment. Put it at the root of your application.
 * The experiment is available in all subcomponents and in the parent as `$magpie`
 * @property trial Per trial data supplied via the trials prop
 */
export default {
  name: 'Experiment',
  props: {
    /**
     * Any data that you want to use in your trials you can pass in via this prop.
     * You can either provide an array of data or a function that returns one sample at a time.
     * This data will be available at run time via `$magpie.currentTrial`
     */
    variables: {
      type: Object,
      default: () => ({})
    },
    /**
     * Whether to display the experiment in wide format-filling mode
     */
    wide: {
      type: Boolean,
      default: false
    },
    /**
     * Optionally specify a title for your experiment which will be displayed in the browser title bar (or in the browser tab)
     */
    title: {
      type: String,
      default: ''
    }
  },
  provide() {
    return {
      experiment: this.magpie
    };
  },
  data() {
    return {
      currentScreen: 0,
      responseTimeStart: 0,
      magpie: new Magpie(this, this.variables, this.$options)
    };
  },
  mounted() {
    if (this.magpie.socket) {
      this.magpie.socket.initialize();
    }
    this.magpie.addExpData({ experiment_start_time: Date.now() });
    this.responseTimeStart = Date.now();
    if (this.title) {
      document.title = this.title;
    }
  },
  methods: {
    /**
     * Go to the next screen. (Will also reset scroll position.)
     * @public
     * @param index{int} the index of the screen to go to (optional; default is next screen)
     */
    nextScreen(index) {
      if (typeof index === 'number') {
        this.currentScreen = index;
      } else {
        this.currentScreen += 1;
      }
      // Start new trial data and restart response timer
      this.responseTimeStart = Date.now();
      this.magpie.currentVarsData = {};

      // Scroll to top of experiment element
      const expPos = this.$el.getBoundingClientRect();
      window.scrollTo(0, window.scrollY + expPos.top);
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
    this.$parent.$magpie = this.magpie;
    const children = this.$slots.screens;
    const screens = children.filter((c) => !!c.componentOptions);
    return h('div', { class: 'experiment' + (this.wide ? ' wide' : '') }, [
      h('div', { class: 'header' }, [
        h('div', { class: 'col title' }, this.$slots.title),
        h('div', { class: 'col status' }, [
          this.magpie.progress !== -1
            ? h(kProgress, {
                props: {
                  percent: this.magpie.progress * 100,
                  showText: false,
                  lineHeight: 10
                },
                style: { width: '150px' }
              })
            : null
        ])
      ]),
      screens[this.currentScreen]
    ]);
  }
};
</script>

<style>
.experiment {
  box-sizing: border-box;
  margin: 3% auto;
  width: 900px;
  min-height: 600px;
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

.experiment.wide {
  width: 100%;
  margin: 0;
  min-height: 98vh; /* 98% of viewport height */
  border: none;
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
  display: flex;
  flex-direction: row-reverse;
}

.experiment.wide .header .col:last-child {
  flex-direction: row;
}

.header .k-progress-outer {
  padding-right: 0; /* hacky stylefix for progress bar */
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

img {
  max-width: 100%;
  height: auto;
  max-height: 400px;
  width: auto;
}
</style>
