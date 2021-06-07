<docs>
This interactive component provides participants the opportunity to chat with each other, if they are in the same room.

```vue
<Experiment>
  <template #screens>

    <Screen>
      <button @click="$magpie.nextScreen()">Start</button>
    </Screen>

    <ConnectInteractiveScreen />

    <Screen>
      <p>You're on screen 1.</p>
      <button @click="$magpie.nextScreen()">Next</button>
    </Screen>

    <Screen>

      <template #0="{nextSlide}">
        <p>You're on the second screen.</p>
        <WaitForParticipants @done="nextSlide" />
      </template>

      <template #0="{measurements}">
        <p>All participants are on the second screen now.</p>
      </template>

    </Screen>

  </template>
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
