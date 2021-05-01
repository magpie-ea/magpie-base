<docs>
This component allows you to display textual or other content in a rapid serial manner, commonly known as Rapid Serial Visual Presentation (RSVP).

### Text
```vue
<Experiment>
  <template #screens>

    <Screen>

      <template #0="{nextSlide}">
        <button @click="nextSlide">Start</button>
      </template>

      <template #1="{nextSlide}">
        <Rsvp :chunks="'I wonder if you can read this, as it is a rapid serial visual presentation of a long text.'.split(' ')"
              @end="nextSlide" />
      </template>

      <template #2>
        That's what I thought.
      </template>

    </Screen>

  </template>
</Experiment>
```

### Images
The Rsvp component allows you to define the presentation of the chunks you provide. E.g. we could also use this component to display images.
```vue
<Experiment>
  <template #screens>
    <Screen>
      <template #0="{nextSlide}">
        <button @click="nextSlide">Start</button>
      </template>
      <template #1="{nextSlide}">
        <Rsvp :chunks="[
            'public/images/rsvp1.jpg',
            'public/images/rsvp2.jpg',
            'public/images/rsvp3.jpg',
            'public/images/rsvp4.jpg',
            ]" @end="nextSlide">
          <template #presentation="{chunk}">
            <img :src="chunk" />
          </template>
        </Rsvp>
      </template>
      <template #2>
        Done.
      </template>
    </Screen>
  </template>
</Experiment>
```


</docs>

<template>
  <div>
    <slot name="presentation" :chunk="chunks[position]">
      <p>{{ chunks[position] }}</p>
    </slot>
    <Wait
      v-if="position < chunks.length"
      :key="position"
      :time="interval"
      @done="nextChunk"
    />
  </div>
</template>

<script>
import Wait from '../helpers/Wait';

export default {
  name: 'Rsvp',
  components: { Wait },
  props: {
    /**
     * The chunks
     */
    chunks: {
      type: Array,
      required: true
    },
    /**
     * Interval between chunks in miliseconds
     */
    interval: {
      type: Number,
      default: 300
    }
  },
  data() {
    return {
      position: 0
    };
  },
  methods: {
    nextChunk() {
      this.position++;
      if (this.position >= this.chunks.length) {
        this.$emit('end');
      }
    }
  }
};
</script>
