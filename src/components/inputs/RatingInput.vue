<docs>
```vue
<Experiment>
  <template #screens>
    <Screen>
      <template #0="{responses}">
        <p>Fries or soup?</p>
      <RatingInput
          left="Fries"
          :response.sync="responses.lunch"
          right="Soup" />
        <p v-if="responses.lunch > 4">I concur!</p>
      </template>
    </Screen>
  </template>
</Experiment>
```

```vue
<Experiment>
  <template #screens>
    <Screen>
      <p>Fries or soup?</p>
      <RatingInput
          left="Fries"
          right="Soup"
          :count="11"/>
    </Screen>
  </template>
</Experiment>
```
</docs>

<template>
  <div class="rating">
    <form>
      <div class="options">
        <div class="left">{{ left }}</div>
        <label v-for="i in count" :key="i"
          ><input
            v-model="answers[i]"
            type="radio"
            name="rating"
            @change="$emit('update:response', i)"
          />
          {{ i }}</label
        >
        <div class="right">{{ right }}</div>
      </div>
    </form>
  </div>
</template>

<script>
/**
 * Have your participants rate their answer on a rating scale
 */
export default {
  name: 'RatingInput',
  props: {
    /**
     * The langth of the rating scale
     */
    count: {
      type: Number,
      default: 7
    },
    /**
     * Text left of the rating scale
     */
    left: {
      type: String,
      optional: true,
      default: ''
    },
    /**
     * Text right of the rating scale
     */
    right: {
      type: String,
      optional: true,
      default: ''
    }
  },
  data() {
    return {
      answers: {}
    };
  }
};
</script>

<style scoped>
.options {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin: 20px 0;
}

.options .left,
.options .right {
  flex-grow: 0;
  padding: 0 15px;
}

.options label {
  flex-grow: 0;
}
</style>
