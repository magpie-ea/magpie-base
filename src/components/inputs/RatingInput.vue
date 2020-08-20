<template>
  <div class="rating">
    <div class="question">{{ question }}</div>
    <form>
      <div class="options">
        <div class="left">{{ left }}</div>
        <label v-for="i in count"
          ><input
            type="radio"
            v-model="answers[i]"
            name="rating"
            @change="$emit('change:answer', i)"
          />
          {{ i }}</label
        >
        <div class="right">{{ right }}</div>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'RatingInput',
  props: {
    question: {
      type: String,
      required: true
    },
    count: {
      type: Number,
      default: 7
    },
    left: {
      type: String,
      optional: true
    },
    right: {
      type: String,
      optional: true
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
