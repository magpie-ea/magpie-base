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

<style scoped>
.option {
  background-color: #5187ba;
  border: none;
  border-radius: 2px;
  color: white;
  cursor: pointer;
  display: inline-block;
  font-family: 'Lato', 'Noto Sans', sans-serif;
  font-size: 12px;
  line-height: 20px;
  font-weight: 700;
  letter-spacing: 0.9px;
  margin: 0 5px 20px 5px;
  outline: none;
  padding: 5px 10px;
  text-transform: uppercase;
}

.option:hover {
  background-color: #324d93;
}
</style>
