<docs>
Use this screen to initiate the interactive socket connection. Once the connection is set up and
enough users have joined, this screen will automatically go to the next screen.

You can customize the content of this screen by adding new content inside it.
By default it looks like this:

```vue
<Experiment>

    <Screen>
       <button @click="$magpie.nextScreen()">Connect</button>
    </Screen>

    <ConnectInteractiveScreen :title="'Connecting...'"></ConnectInteractiveScreen>

    <Screen>Connected.</Screen>

</Experiment>
```

</docs>
<template>
  <Screen v-bind="$attrs">
    <slot>
      This screen sets up the socket connection for the interactive experiment
      and waits for other participants to join so that the number of required
      participants to start an interactive experiment is met.
    </slot>
  </Screen>
</template>

<script>
import { states } from '../../Socket';
import Screen from '../Screen';
export default {
  name: 'ConnectInteractiveScreen',
  components: { Screen },
  props: {},
  watch: {
    '$magpie.socket.state': function (state) {
      if (state === states.READY) {
        this.$magpie.nextScreen();
      }
    }
  },
  mounted() {
    this.$magpie.socket.initialize();
    if (this.$magpie.socket.state === states.READY) {
      this.$magpie.nextScreen();
    }
  }
};
</script>
