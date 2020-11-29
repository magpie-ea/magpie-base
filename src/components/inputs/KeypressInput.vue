<docs>
```vue
<Experiment>
  <template #screens>
    <Screen>
      <template #0="{responses}">
      <KeypressInput
          question="Fries or soup?"
          :response.sync="responses.lunch"
          :keys="{
            f: 'fries',
            j: 'soup'
          }" />
        <p v-if="responses.lunch === 'fries'">Don't forget the ketchup!</p>
      </template>
    </Screen>
  </template>
</Experiment>
```
</docs>

<template>
  <div class="keypress">
    <div class="question">{{ question }}</div>
    <div class="options">
      <span v-for="(option, key) in keys" :key="key"
        ><strong v-text="key"></strong> = {{ option }}
      </span>
    </div>
  </div>
</template>

<script>
/**
 * Have your participants react
 */
export default {
  name: 'KeypressInput',
  props: {
    /**
     * The question
     */
    question: {
      type: String,
      default: ''
    },
    /**
     * An object with keys mapped to option labels
     */
    keys: {
      type: Object,
      required: true
    }
  },
  mounted() {
    window.document.addEventListener('keydown', this.onKeyDown);
  },
  destroyed() {
    window.document.removeEventListener('keydown', this.onKeyDown);
  },
  methods: {
    onKeyDown(e) {
      if ('undefined' !== typeof this.keys[e.key]) {
        e.preventDefault();
        this.$emit('update:response', this.keys[e.key]);
      }
    }
  }
};
</script>

<style scoped></style>
