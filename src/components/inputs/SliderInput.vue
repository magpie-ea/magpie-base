<template>
  <div class="slider">
    <div class="question">{{ question }}</div>
    <Slider @change="$emit('change:answer', $event)" />
  </div>
</template>

<script>
import Slider from 'vue-slider-component';
import 'vue-slider-component/theme/default.css';

export default {
  name: 'SliderInput',
  components: { Slider },
  props: {
    question: {
      type: String,
      required: true
    }
  }
};
</script>

<style scoped></style>
