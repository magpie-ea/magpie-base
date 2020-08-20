<template>
  <div class="textarea">
    <div class="question">
      <span v-for="(slice, i) in slices"
        >{{ slice }}
        <select
          v-if="i !== slices.length - 1"
          v-model="answers[i]"
          @change="
            $emit('change:answer', fullAnswer);
            $emit('change:answers', answers);
          "
          ><option
            v-for="option in options[i]"
            v-text="option"
          ></option></select
      ></span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CompletionInput',
  props: {
    text: {
      type: String,
      required: true
    },
    options: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      answers: []
    };
  },
  computed: {
    slices() {
      return this.text.split('%s');
    },
    fullAnswer() {
      const answers = this.answers.slice();
      return this.text
        .split('%s')
        .map((s) => s + (answers.shift() || ''))
        .join('');
    }
  }
};
</script>

<style scoped>
textarea {
  border: 2px solid #5187ba;
  border-radius: 10px;
  display: block;
  font-size: 16px;
  margin: 0 auto;
  outline: none;
  padding: 10px 20px;
}
</style>
