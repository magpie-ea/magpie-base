<docs>
This interactive component provides participants the opportunity to chat with each other, if they are in the same room.

```vue
<Experiment>
    <Screen>
      <button @click="$magpie.nextScreen()">Start</button>
    </Screen>

    <ConnectInteractiveScreen />

    <Screen>
      <p>You're on screen 1.</p>
      <button @click="$magpie.nextScreen()">Next</button>
    </Screen>

    <Screen>
      <Slide>
        <p>You're on the second screen.</p>
        <WaitForParticipants @done= "$magpie.nextSlide()" />
      </Slide>

      <Slide>
        <p>All participants are on the second screen now.</p>
      </Slide>

    </Screen>
</Experiment>
```


</docs>
<template>
  <span></span>
</template>

<script>
export default {
  name: 'WaitForParticipants',
  watch: {
    ['$magpie.socket.active'](newParticipants) {
      if (newParticipants.length === this.$magpie.socket.chain) {
        this.$emit('done');
      }
    }
  },
  mounted() {
    if (this.$magpie.socket.active.length === this.$magpie.socket.chain) {
      this.$emit('done');
    }
  }
};
</script>
