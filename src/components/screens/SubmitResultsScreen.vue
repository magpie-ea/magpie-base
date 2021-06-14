<docs>
Use this screen at the end of your experiment to submit the data to the server.
You can provide the submission URL to the Experiment component.
</docs>

<template>
  <Screen v-if="!$magpie.debug" title="Submitting">
    <Slide>
      <p>Hold on, while we submit your data.</p>
      <Wait :time="0" @done="submit(nextSlide)" />
    </Slide>
    <template #1>
      <p v-if="!error">
        All done. Thank you!
        <Wait :time="3000" @done="redirectToCompletionUrl" />
      </p>
      <div v-else>
        <p>Oh, no. There was a problem submitting your results.</p>
        <p>
          Please contact
          <a :href="'mailto:' + $magpie.contactEmail"
            >the author of this experiment</a
          >.
        </p>
        <p v-text="error" />
      </div>
    </template>
  </Screen>
  <DebugResultsScreen v-else />
</template>

<script>
import Screen from '../Screen';
import Wait from '../helpers/Wait';
import DebugResultsScreen from './DebugResultsScreen';
import Slide from '../Slide';
export default {
  name: 'SubmitResultsScreen',
  components: { Slide, DebugResultsScreen, Wait, Screen },
  props: {},
  data() {
    return {
      results: this.$magpie.getData(),
      error: null
    };
  },
  methods: {
    async submit(cb) {
      try {
        await this.$magpie.submit();
        cb();
      } catch (err) {
        this.error = err.message;
        cb();
      }
    },
    redirectToCompletionUrl() {
      if (this.$magpie.completionUrl && this.$magpie.mode === 'prolific') {
        window.location = this.$magpie.completionUrl;
      }
    }
  }
};
</script>
