<docs>
### Instance properties ($magpie)
The Experiment component, and thus the following properties of it, are also available in all components as the special $magpie property.

* `id`
  * The ID of the experiment
* `currentTrial`
  * an object with a single data point of each array in the trial data supplied to the experiment component
* `addResult(data:object)`
  * add a result for the current screen
* `getResults()`
  * returns all results that have been added thus far
* `submit()`
  * submit all results that have been added thus far to the magpie server
* `submitIntermediateResults()`
  * submit all results that have been added thus far as intermediate results to the magpie server
* `setProgress(percentage:float)`
  * set the progress that will be displayed in the progress bar, pass `-1` for no progress bar
* `mousetracking` object
  * `start(x:int, y:int)`
    * (Re)start mouse tracking with origin set to the given coordinates
  * `getMouseTrack(rate:int = 15)`
    * returns an object with mouse tacking data `{mt_x, mt_y, mt_time, mt_start_time}` at the resolution of `rate`
* `socket` object, only defined when socketURL is set in the config
  * `participantId`
    * the random ID of the current participant
  * `state`
    * string, reactive, one of `CONNECTING`, `CONNECTED`, `WAITING`, `JOINED`, `ERROR`
  * `broadcast(event:string, payload:any)`
    * sends an event to all participants in the current room
  * `on(event:string, listener:function)`
    * listen to socket events
  * `off(event:string, listener:function)`
    * remove a listener
  * `once(event:string, listener:function)`
    * listen to a socket event once

### Populating trial data with an array

The Experiment component allows you to define trial data to make it conveniently accessible during your experiment.
For every source of trial data you can provide a label and an array. Later you will be able to automatically iterate over that array by accessing the label as a subproperty of `$magpie.currentTrial`.

```vue
<Experiment :trials="{ color: ['blue', 'green', 'yellow'] }">
  <template #screens>
    <Screen>
      {{ $magpie.currentTrial.color }}
      <button @click="$magpie.nextScreen()">next</button>
    </Screen>
    <Screen>
      {{ $magpie.currentTrial.color }}
      <button @click="$magpie.nextScreen()">next</button>
    </Screen>
    <Screen>
      {{ $magpie.currentTrial.color }}
    </Screen>
  </template>
</Experiment>
```

### Populating trial data with a function
In case you want to generate data on the fly or have a more sophisticated data selection mechanism in mind, you can also specify a getter function which will return the next item.

```vue
<Experiment :trials="{number: () => Math.random()}">
  <template #screens>
    <Screen>
      {{ $magpie.currentTrial.number }}
      <button @click="$magpie.nextScreen()">next</button>
    </Screen>
    <Screen>
      {{ $magpie.currentTrial.number }}
      <button @click="$magpie.nextScreen()">next</button>
    </Screen>
    <Screen>
      {{ $magpie.currentTrial.number }}
    </Screen>
  </template>
</Experiment>
```


### Providing a title
Besides the `screens` slot, the Experiment component also provides an optional `title` slot that allows you to display header information on all screens of your experiment.

```vue
<Experiment :trials="{number: () => Math.random()}">
  <template #title>
    My experiment
  </template>
  <template #screens>
    <Screen>
      {{ $magpie.currentTrial.number }}
      <button @click="$magpie.nextScreen()">next</button>
    </Screen>
    <Screen>
      {{ $magpie.currentTrial.number }}
      <button @click="$magpie.nextScreen()">next</button>
    </Screen>
    <Screen>
      {{ $magpie.currentTrial.number }}
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
    trials: {
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
      magpie: new Magpie(this, this.trials, this.$options)
    };
  },
  mounted() {
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
      this.magpie.currentTrialData = {};

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
