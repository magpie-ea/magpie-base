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
        {{ $exp.trial.categories.o1 }}
      </template>
      <template #option2>
        {{ $exp.trial.categories.o2 }}
      </template>
      <template #stimulus>
        <span>{{ $exp.trial.categories.s }}</span>
      </template>
    </CategorizationMousetracking>
  </template>
</Experiment>

```

</docs>

<template>
  <Screen :title="title" @mousemove="onMouseMove">
    <template #0="{ nextSlide }">
      <!-- @slot provide a preparation stimulus, i.e. a text or an audio explanation-->
      <slot name="prep" :done="nextSlide">
        <div v-wait:1="nextSlide" />
      </slot>
    </template>

    <template #1="{ nextSlide }">
      <div v-wait:500="nextSlide"></div>
    </template>

    <template #2="{ nextSlide }">
      <div class="options" v-wait:500="nextSlide">
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
        <button @click="onPressPlay" v-if="!playing">Go</button>
        <!-- @slot provide content for the main stimulus -->
        <slot name="stimulus" v-if="playing" />
      </div>
    </template>

    <template #4>
      <div v-wait:3000="$exp.nextScreen"></div>
    </template>
  </Screen>
</template>

<script>
import Screen from '../Screen';

export default {
  name: 'CategorizationMousetracking',
  components: { Screen },
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
      playing: false,
      mouseMovements: []
    };
  },
  methods: {
    onPressPlay() {
      this.playing = true;
    },
    onMouseMove(coordinates) {
      if (!this.playing) return;
      this.mouseMovements.push(coordinates);
    },
    onOption1(cb) {
      if (!this.playing) return;
      this.submit(this.option1, cb);
    },
    onOption2(cb) {
      if (!this.playing) return;
      this.submit(this.option2, cb);
    },
    submit(label, cb) {
      // todo: flatten these and interpolate as in old magpie!
      this.$exp.addResult({
        endLabel: label,
        mouseMovements: this.mouseMovements
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
