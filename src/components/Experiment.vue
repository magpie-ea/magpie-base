<docs>
### Instance properties ($magpie)
The Experiment component, and thus the following properties of it, are also available in all components as the special $magpie property.

* `id`
  * The ID of the experiment
* `currentTrial`
  * an object with a single data point of each array in the trial data supplied to the experiment
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
import _ from 'lodash';
import Socket from '../Socket';
import kProgress from 'k-progress';

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
      experiment: this
    };
  },
  data() {
    // Setup magic "trial" slot property
    const currentTrial = {};
    for (const type of Object.keys(this.trials)) {
      if (Array.isArray(this.trials[type])) {
        currentTrial.__defineGetter__(type, () => {
          if (this.currentTrialData[type]) {
            return this.currentTrialData[type];
          }
          this.currentTrialData[type] = this.trials[type].shift();
          return this.currentTrialData[type];
        });
      } else if ('function' === typeof this.trials[type]) {
        currentTrial.__defineGetter__(type, () => {
          if (this.currentTrialData[type]) {
            return this.currentTrialData[type];
          }
          this.currentTrialData[type] = this.trials[type](this.currentScreen);
          return this.currentTrialData[type];
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
      // config
      id: this.$options.magpie.experimentId,
      socket: !!this.$options.magpie.socketUrl,
      submissionUrl: this.$options.magpie.submissionUrl,
      contactEmail: this.$options.magpie.contactEmail,
      currentScreen: 0,
      results: {},
      currentTrialData: {},
      currentTrial,
      mousetrackingTime: [0],
      mousetrackingX: [0],
      mousetrackingY: [0],
      mousetrackingStartTime: 0,
      responseTimeStart: 0,
      progress: -1
    };
  },
  beforeMount() {
    if (this.socket) {
      this.socket = new Socket(
        this.$options.magpie.experimentId,
        this.$options.magpie.socketUrl,
        this.onSocketError
      );
    }
  },
  mounted() {
    if (this.socket) {
      this.socket.initialize();
    }
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
      this.currentTrialData = {};
      this.responseTimeStart = Date.now();

      // Scroll to top of experiment element
      const expPos = this.$el.getBoundingClientRect();
      window.scrollTo(0, window.scrollY + expPos.top);
    },
    /**
     * Add a result set
     * This method will automatically add a response_time key to your data with time measured from the start of the current screen
     *
     * @public
     * @param data{Object} a flat object whose data you want to add to the results
     */
    addResult(data) {
      if (!this.results[this.currentScreen]) {
        this.results[this.currentScreen] = [];
      }
      this.results[this.currentScreen].push({
        ...data,
        response_time: Date.now() - this.responseTimeStart
      });
    },
    onMouseMove(e) {
      this.mousetrackingTime.push(Date.now() - this.mousetrackingStartTime);
      this.mousetrackingX.push(e.layerX);
      this.mousetrackingY.push(e.layerY);
    },
    /**
     * (re)start mouse tracking for the current screen
     * @public
     */
    startMouseTracking() {
      this.mousetrackingTime = [0];
      this.mousetrackingX = [0];
      this.mousetrackingY = [0];
      this.mousetrackingStartTime = Date.now();
    },
    /**
     * Get the mouse track since the appearance of the current screen
     * @public
     * @param rate{int} Time resolution in ms (optional; defaults to 15ms)
     * @returns {{x: [], y: [], time: []}}
     */
    getMouseTrack(rate) {
      const interpolated = { time: [], x: [], y: [] };
      for (let i = 0; i < this.mousetrackingTime.length; i++) {
        interpolated.time.push(this.mousetrackingTime[i]);
        interpolated.x.push(this.mousetrackingX[i]);
        interpolated.y.push(this.mousetrackingY[i]);
        if (
          i < this.mousetrackingTime.length - 1 &&
          this.mousetrackingTime[i + 1] - this.mousetrackingTime[i] > rate
        ) {
          const steps =
            (this.mousetrackingTime[i + 1] - this.mousetrackingTime[i]) / rate -
            1;
          const xDelta =
            (this.mousetrackingX[i + 1] - this.mousetrackingX[i]) / (steps + 1);
          const yDelta =
            (this.mousetrackingY[i + 1] - this.mousetrackingY[i]) / (steps + 1);
          const index = interpolated.time.length - 1;
          for (let j = 0; j < steps; j++) {
            interpolated.time.push(interpolated.time[index + j] + this);
            interpolated.x.push(Math.round(interpolated.x[index + j] + xDelta));
            interpolated.y.push(Math.round(interpolated.y[index + j] + yDelta));
          }
        }
      }
      return interpolated;
    },
    onSocketError(er) {
      console.error(er);
    },
    getResults() {
      return flattenData({
        trials: addEmptyColumns(
          _.flatten(Object.values(this.results)).map((o) =>
            Object.assign({}, o)
          )
        ) // clone the data
      });
    },
    submit() {
      if (!this.submissionUrl) {
        throw new Error('No submission URL set');
      }
      return this.submitResults(this.submissionUrl, this.getResults());
    },
    submitIntermediateResults() {
      if (!this.submissionUrl) {
        throw new Error('No submission URL set');
      }
      return this.submitResults(this.submissionUrl, this.getResults(), true);
    },
    async submitResults(submissionURL, data, intermediate) {
      if (this.socket) {
        const submissionType = intermediate
          ? 'save_intermediate_results'
          : 'submit_results';

        return new Promise((resolve, reject) =>
          this.socket.participantChannel
            .push(submissionType, {
              results: data
            })
            .receive('ok', resolve)
            .receive('error', reject)
        );
      }
      const resp = await fetch(submissionURL, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (!resp.ok) {
        throw new Error('The server says: ' + (await resp.text()));
      }
    },
    /**
     * Set progress bar percentage
     * Will display a progress bar if it's not visible, yet.
     * @public
     * @param percentage{float} the percentage to display as a number between 0 and 1
     */
    setProgress(progress) {
      this.progress = progress;
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
    this.$parent.$magpie = this;
    const children = this.$slots.screens;
    const screens = children.filter((c) => !!c.componentOptions);
    return h('div', { class: 'experiment' + (this.wide ? ' wide' : '') }, [
      h('div', { class: 'header' }, [
        h('div', { class: 'col title' }, this.$slots.title),
        h('div', { class: 'col status' }, [
          this.progress !== -1
            ? h(kProgress, {
                props: {
                  percent: this.progress * 100,
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

// adds columns with NA values
const addEmptyColumns = function (trialData) {
  var columns = [];

  for (var i = 0; i < trialData.length; i++) {
    for (var prop in trialData[i]) {
      if (trialData[i].hasOwnProperty(prop) && columns.indexOf(prop) === -1) {
        columns.push(prop);
      }
    }
  }

  for (var j = 0; j < trialData.length; j++) {
    for (var k = 0; k < columns.length; k++) {
      if (!trialData[j].hasOwnProperty(columns[k])) {
        trialData[j][columns[k]] = 'NA';
      }
    }
  }

  return trialData;
};

const flattenData = function (data) {
  var trials = data.trials;
  delete data.trials;

  // The easiest way to avoid name clash is just to check the keys one by one and rename them if necessary.
  // Though I think it's also the user's responsibility to avoid such scenarios...
  var sample_trial = trials[0];
  for (var trial_key in sample_trial) {
    if (sample_trial.hasOwnProperty(trial_key)) {
      if (data.hasOwnProperty(trial_key)) {
        // Much easier to just operate it once on the data, since if we also want to operate on the trials we'd need to loop through each one of them.
        var new_data_key = 'glb_' + trial_key;
        data[new_data_key] = data[trial_key];
        delete data[trial_key];
      }
    }
  }

  var out = _.map(trials, function (t) {
    for (const key in t) {
      if (Array.isArray(t[key])) {
        // Turn arrays into strings
        t[key] = t[key].join('|');
      }
    }
    // Here the data is the general informatoin besides the trials.
    return _.merge(t, data);
  });
  return out;
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
