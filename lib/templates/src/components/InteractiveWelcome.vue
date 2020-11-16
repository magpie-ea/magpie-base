<template>
  <div>
    This screen sets up the socket connection for the interactive experiment.
    Previously, the participant would need to agree to the terms of the
    interactive experiment before continuing to the lobby. However, if the terms
    are already agreed to in the previous welcome screen, you may want to
    advance this screen automatically.
  </div>
</template>

<script>
import { initializeExperiment } from '@/socket.js';

export default {
  name: 'InteractiveWelcome',
  inject: {
    $exp: {
      from: 'experiment',
      default: () => ({})
    }
  },
  watch: {
    '$store.state.interactiveExperiment.experimentAvailable': function (value) {
      if (value === true) {
        $exp.nextScreen();
      }
    }
  },
  mounted() {
    initializeExperiment();
  },
  methods: {}
};
</script>
