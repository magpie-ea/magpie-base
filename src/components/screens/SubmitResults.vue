<docs>
Use this screen at the end of your experiment to submit the data to the server.
You can provide the submission URL to the Experiment component.
</docs>

<template>
  <Screen title="Submitting">
    <template #0="{ nextSlide }">
      <p>Hold on, while we submit your data.</p>
      <Wait :time="0" @done="$exp.submit().then(nextSlide)" />
    </template>
    <template #1>
      <p>All done. Thank you!</p>
    </template>
  </Screen>
</template>

<script>
import Screen from '../Screen';
import Wait from '@/components/helpers/Wait';
export default {
  name: 'SubmitResults',
  components: { Wait, Screen },
  props: {},
  data() {
    return {
      results: this.$exp.getResults()
    };
  }
};
</script>
