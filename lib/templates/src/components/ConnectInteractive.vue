<template>
  <Screen :title="title">
    <slot>
      This screen sets up the socket connection for the interactive experiment
      and waits for other participants to join so that the number of required
      participants to start an interactive experiment is met.
    </slot>
  </Screen>
</template>

<script>
import states from '@/Socket';
export default {
  name: 'ConnectInteractive',
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  watch: {
    '$exp.socket.state': function (state) {
      if (state === states.JOINED) {
        this.$exp.nextScreen();
      }
    }
  },
  mounted() {
    this.$exp.socket.join();
  }
};
</script>
