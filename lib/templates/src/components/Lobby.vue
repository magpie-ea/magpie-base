<template>
  <div>
    This is a lobby where participants wait for other participants to join so
    that the number of required participants to start an interactive experiment
    is met.
  </div>
</template>

<script>
import { joinLobby } from '@/socket.js';

export default {
  name: 'Lobby',
  data() {
    return {
      title: 'Connecting to the Server...'
    };
  },
  watch: {
    '$store.state.interactiveExperiment.waitingInLobby': function (value) {
      if (value === true) {
        this.title =
          'Successfully joined the lobby. Waiting for other participants...';
      }
    },
    '$store.state.interactiveExperiment.gameStarted': function (value) {
      if (value === true) {
        $exp.nextScreen();
      }
    }
  },
  mounted() {
    joinLobby();
  },
  methods: {}
};
</script>

<style scoped></style>
