<template>
  <div class="experiment">
    <div class="header">
      <div class="col">
        <slot name="default"></slot>
      </div>
      <div class="col">{{ currentScreen + 1 }}/{{ numScreens }}</div>
    </div>
    <slot
      :name="currentScreen"
      :nextScreen="nextScreen"
      :addResult="addResult"
      :trial="trial"
    >
      Screen #{{ currentScreen }} not found
    </slot>
  </div>
</template>

<script>
export default {
  name: 'Experiment',
  props: {
    trials: {
      type: Object,
      required: true
    }
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
  provide() {
    return {
      nextScreen: this.nextScreen,
      addResult: this.addResult,
      getRootElement: this.getRootElement
    };
  },
  computed: {
    numScreens() {
      return Object.keys(this.$slots).length;
    }
  },
  methods: {
    nextScreen(index) {
      this.currentTrial = {};
      if (typeof index === 'number') {
        this.currentScreen = index;
        return;
      }
      this.currentScreen += 1;
    },
    addResult(data) {
      if (!this.results[this.currentScreen]) {
        this.results[this.currentScreen] = [];
      }
      this.results[this.currentScreen].push(data);
    },
    getRootElement() {
      return this.$el;
    }
  }
};
</script>

<style scoped>
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
</style>
