<template>
  <div class="screen">
    <h2 v-if="title">{{ title }}</h2>
    <slot name="default">
      <slot :name="currentSlide" :nextSlide="nextSlide">
        Slide #{{ currentSlide }} could not be found
      </slot>
    </slot>
  </div>
</template>

<script>
export default {
  name: 'Screen',
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
    this.$exp.$el.addEventListener('mousemove', this.onMouseMove);
  },
  beforeDestroy() {
    this.$exp.$el.removeEventListener('mousemove', this.onMouseMove);
  }
};
</script>

<style scoped>
.screen {
  flex-grow: 1;
  position: relative;
}
</style>
