<docs>

```vue
<Experiment :trials="{categories: [
    {o1: 'Mammal', o2: 'Bird', s: 'Bat'},
    {o1: 'Bird', o2: 'Insect', s: 'Kolibri'},
    {o1: 'Fish', o2: 'Mammal', s: 'Whale'},
    {o1: 'Fish', o2: 'Bird', s: 'Penguin'}
    ]}">
  <template #screens>
    <CategorizationMousetracking :key="i" v-for="i in 4">
      <template #option1>
        {{ $magpie.trial.categories.o1 }}
      </template>
      <template #option2>
        {{ $magpie.trial.categories.o2 }}
      </template>
      <template #stimulus>
        <span>{{ $magpie.trial.categories.s }}</span>
      </template>
    </CategorizationMousetracking>
    <DebugResults />
  </template>
</Experiment>
```

</docs>

<template>
  <Screen :title="title">
    <template #0="{ nextSlide }">
      <!-- @slot provide a preparation stimulus, i.e. a text or an audio explanation-->
      <slot name="prep" :done="nextSlide">
        <Wait :time="1" @done="nextSlide" />
      </slot>
    </template>

    <template #1="{ nextSlide }">
      <Wait key="pause" :time="500" @done="nextSlide" />
    </template>

    <template #2="{ nextSlide }">
      <Wait key="wait a bit" :time="500" @done="nextSlide" />
      <div class="options">
        <!-- @slot provide content for categorization option one -->
        <div class="option1"><slot name="option1" /></div>
        <div class="space"></div>
        <!-- @slot provide content for categorization option two -->
        <div class="option2"><slot name="option2" /></div>
      </div>
    </template>

    <template #3="{ nextSlide }">
      <div class="options">
        <div class="option1" @mouseover="onOption1(nextSlide)">
          <slot name="option1" />
        </div>
        <div class="space"></div>
        <div class="option2" @mouseover="onOption2(nextSlide)">
          <slot name="option2" />
        </div>
      </div>
      <div class="stimulus">
        <button v-if="!playing" @click="onPressPlay">Go</button>
        <!-- @slot provide content for the main stimulus -->
        <slot v-if="playing" name="stimulus" />
      </div>
    </template>

    <template #4>
      <Wait :time="3000" @done="$magpie.nextScreen" />
    </template>
  </Screen>
</template>

<script>
import Screen from '../Screen';
import Wait from '../helpers/Wait';

export default {
  name: 'CategorizationMousetracking',
  components: { Screen, Wait },
  props: {
    /**
     * Title of the screen
     */
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      playing: false
    };
  },
  methods: {
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
      // todo: flatten these and interpolate as in old magpie!
      this.$magpie.addResult({
        endLabel: label,
        ...this.$magpie.getMouseTrack()
      });
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
  padding: 70px;
  width: 100px;
  background: lightyellow;
}

.stimulus {
  bottom: 20px;
  position: absolute;
  width: 100%;
}
</style>
