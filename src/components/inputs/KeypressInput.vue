<template>
  <div class="keypress">
    <div class="question">{{ question }}</div>
    <div class="options">
      <span v-for="(option, key) in keys"
        ><strong v-text="key"></strong> = {{ option }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'KeypressInput',
  props: {
    question: {
      type: String,
      required: true
    },
    keys: {
      type: Object,
      required: true
    },
    expected: {
      type: String,
      optional: true
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
        this.$emit('change:answer', this.keys[e.key]);
      }
    }
  }
};
</script>

<style scoped></style>
