<template>
  <div class="screen">
    <h2 v-if="title">{{ title }}</h2>
    <slot :name="currentSlide" :nextScreen="nextScreen" :nextSlide="nextSlide">
      Slide #{{ currentSlide }} could not be found
    </slot>
  </div>
</template>

<script>
export default {
  name: 'Screen',
  inject: ['nextScreen', 'getRootElement'],
  props: {
    title: {
      type: String,
      required: false,
      default: ''
    }
  },
  data() {
    return {
      currentSlide: 0
    };
  },
  methods: {
    nextSlide(index) {
      if (typeof index === 'number') {
        this.currentSlide = index;
        return;
      }
      this.currentSlide++;
    },
    onMouseMove(e) {
      this.$emit('mousemove', { x: e.layerX, y: e.layerY });
    }
  },
  mounted() {
    this.getRootElement().addEventListener('mousemove', this.onMouseMove);
  },
  beforeDestroy() {
    this.getRootElement().removeEventListener('mousemove', this.onMouseMove);
  }
};
</script>

<style scoped>
.screen {
  flex-grow: 1;
  position: relative;
}
</style>
