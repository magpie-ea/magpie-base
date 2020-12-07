<docs>
This interactive component provides participants the opportunity to chat with each other, if they are in the same room.

```vue
<Experiment>
  <template #screens>
    <ConnectInteractive />
    <Screen>
      <Chat />
    </Screen>
  </template>
</Experiment>
```


</docs>
<template>
  <div class="chat">
    <div ref="box" class="chat-box">
      <p
        v-for="(message, i) in messages"
        :key="i"
        :class="{
          message: true,
          me: message.participantId === $magpie.socket.participantId
        }"
        v-text="message.message"
      ></p>
    </div>
    <div class="chat-input">
      <textarea
        ref="text"
        cols="50"
        placeholder="Type your message to the other participant here."
        @keydown.enter="send"
      ></textarea>
      <button @click.stop="send()">
        Send
      </button>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
const EVENT_CHAT_MESSAGE = 'chat_message';

export default {
  name: 'Chat',
  data() {
    return {
      messages: []
    };
  },
  socket: {
    [EVENT_CHAT_MESSAGE](payload) {
      this.messages.push(payload);
      Vue.nextTick(() => {
        this.$refs.box.scrollTop = this.$refs.box.scrollHeight;
      });
    }
  },
  EVENT_CHAT_MESSAGE,
  methods: {
    send() {
      const message = this.$refs.text.value;
      if (!message) {
        return;
      }
      this.$magpie.socket.broadcast(EVENT_CHAT_MESSAGE, {
        message,
        participantId: this.$magpie.socket.participantId
      });
      this.$refs.text.value = '';
      this.$refs.text.focus();
    }
  }
};
</script>
<style>
.chat {
  width: 450px;
}

.chat-box {
  overflow: auto;
  height: 400px;
}

.message {
  width: 55%;
  float: left;
  text-align: left;
  background: #5187ba7a;
  border-radius: 4px;
  padding: 4px;
  margin: 5px 0;
}

.message.me {
  float: right;
  background: #70ba517a;
}

.chat-input {
  display: flex;
}

.chat-input textarea {
  flex-grow: 1;
  height: 32px;
}

.chat-input button {
  margin: 0;
}
</style>
