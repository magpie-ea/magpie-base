<template>
  <div class="forced_choice">
    <div class="question">{{ question }}</div>
    <div class="options">
      <div
        class="option"
        v-for="option in options"
        @click="onOptionClick(option)"
      >
        {{ option }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ForcedChoiceInput',
  props: {
    question: {
      type: String,
      required: true
    },
    options: {
      type: Array,
      required: true
    },
    answer: {
      type: String,
      required: true
    }
  },
  methods: {
    onOptionClick(option) {
      this.$emit('change:answer', option);
    }
  }
};
</script>

<style scoped></style>
