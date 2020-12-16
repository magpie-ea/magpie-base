<docs>

```vue
<Experiment :trials="{categories: [
    {o1: 'Mammal', o2: 'Bird', s: 'Bat'},
    {o1: 'Bird', o2: 'Insect', s: 'Kolibri'},
    {o1: 'Fish', o2: 'Mammal', s: 'Whale'},
    {o1: 'Fish', o2: 'Bird', s: 'Penguin'}
    ]}">
  <template #screens>
    <Screen :key="i" v-for="i in 4">
      <template #0="{ responses }"> 
        <CategorizationMousetracking :response.sync="responses.option" :mouseTrack.sync="responses.mouseTrack">
          <template #option1>
            <div :style="{backgroundColor: 'lightyellow', width: '100px', padding: '70px'}">
            {{ $magpie.currentTrial.categories.o1 }}
            </div>
          </template>
          <template #option2>
            <div :style="{backgroundColor: 'lightyellow', width: '100px', padding: '70px'}">
            {{ $magpie.currentTrial.categories.o2 }}
            </div>
          </template>
          <template #stimulus>
            <span>{{ $magpie.currentTrial.categories.s }}</span>
          </template>
          <template #feedback>
            <Wait :time="1" @done="
              $magpie.addResult({
                response: responses.response,
                ...responses.mouseTrack,
                ...$magpie.currentTrial.categories,
              });
              $magpie.nextScreen()" />
          </template>
        </CategorizationMousetracking>
      </template>
    </Screen>
    <DebugResults />
  </template>
</Experiment>
```

</docs>

<template>
  <div>
    <div v-if="slide === 0">
      <!-- @slot provide a preparation stimulus, i.e. a text or an audio explanation-->
      <slot name="prep" :done="nextSlide">
        <Wait :time="1" @done="nextSlide" />
      </slot>
    </div>

    <div v-if="slide === 1">
      <Wait key="pause" :time="500" @done="nextSlide" />
    </div>

    <div v-if="slide === 2">
      <Wait key="wait a bit" :time="500" @done="nextSlide" />
      <div class="options">
        <!-- @slot provide content for categorization option one -->
        <div class="option1"><slot name="option1" /></div>
        <div class="space"></div>
        <!-- @slot provide content for categorization option two -->
        <div class="option2"><slot name="option2" /></div>
      </div>
    </div>

    <div v-if="slide === 3">
      <div class="options">
        <div class="option1" @[selectEvent]="onOption1(nextSlide)">
          <slot name="option1" />
        </div>
        <div class="space"></div>
        <div class="option2" @[selectEvent]="onOption2(nextSlide)">
          <slot name="option2" />
        </div>
      </div>
      <div class="stimulus">
        <!-- @slot provide content for the main stimulus -->
        <slot v-if="playing" name="stimulus" />
      </div>
      <button v-if="!playing" @click="onPressPlay">Go</button>
    </div>

    <div v-if="slide === 4">
      <div class="stimulus">
        <!-- @slot optionally provide feedback -->
        <slot name="feedback" />
      </div>
    </div>
  </div>
</template>

<script>
import Wait from '../helpers/Wait';

export default {
  name: 'CategorizationMousetracking',
  components: { Wait },
  props: {
    /**
     * Title of the screen
     */
    title: {
      type: String,
      default: ''
    },
    /**
     * The event that causes the response to be selected, e.g. `click`, `mouseover`, etc.
     */
    selectEvent: {
      type: String,
      default: 'mouseover'
    }
  },
  data() {
    return {
      playing: false,
      label: null,
      track: null,
      slide: 0
    };
  },
  methods: {
    nextSlide() {
      this.slide++;
    },
    onPressPlay() {
      this.playing = true;
      this.$magpie.startMouseTracking();
    },
    onOption1(cb) {
      if (!this.playing) return;
      this.submit('left', cb);
    },
    onOption2(cb) {
      if (!this.playing) return;
      this.submit('right', cb);
    },
    submit(label, cb) {
      this.label = label;
      this.track = this.$magpie.getMouseTrack();
      this.$emit('update:response', this.label);
      this.$emit('update:mouseTrack', this.track);
      cb();
    }
  }
};
</script>

<style scoped>
.options {
  display: flex;
  flex-direction: row;
}

.options .space {
  flex: 1;
}

.options .option1,
.options .option2 {
  flex: 0;
}

.stimulus {
  bottom: 200px;
  position: absolute;
  width: 100%;
}

button {
  bottom: 20px;
  left: 50%;
  position: absolute;
}
</style>
