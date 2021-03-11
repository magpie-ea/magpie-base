<docs>
This interactive component provides participants the opportunity to chat with each other, if they are in the same room.

```vue
<Experiment>
  <template #screens>
    <Screen>
      <button @click="$magpie.nextScreen()">Start</button>
    </Screen>
    <ConnectInteractive />
    <Screen>
      <template #0="{responses}">
      <Chat :data.sync="responses.data" :participants.sync="responses.participants" />
      <p>{{responses.data? responses.data.chatMessage.length : 0}} messages sent so far.</p>
      <p>{{ responses.participants? responses.participants.length : 0 }} participants chatting.</p>
      </template>
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
const EVENT_CHAT_PRESENCE = 'chat_presence';
const PRESENCE_TIMEOUT = 10000;
const PRESENCE_INTERVAL = 3000;

export default {
  name: 'Chat',
  data() {
    return {
      messages: [],
      presence: {
        // Add the current participant already to not show 0 participants
        [this.$magpie.socket.participantId]: true
      },
      interval: null
    };
  },
  socket: {
    [EVENT_CHAT_MESSAGE](payload) {
      this.messages.push(payload);
      Vue.nextTick(() => {
        this.$refs.box.scrollTop = this.$refs.box.scrollHeight;
      });
      /**
       * Messages contains all chat messages as objects: `[{message: '', participantId: '', time: 2345678765}, ...]`
       */
      this.$emit('update:messages', this.messages);
      /**
       * Data contains all chat messages in tabular form: `{chatMessage: [], chatParticipantId: [], chatTime: []}`
       */
      this.$emit('update:data', this.flattenData(this.messages));
    },
    [EVENT_CHAT_PRESENCE](participantId) {
      clearTimeout(this.presence[participantId]);
      Vue.set(
        this.presence,
        participantId,
        setTimeout(() => {
          Vue.delete(this.presence, participantId);
        }, PRESENCE_TIMEOUT)
      );
    }
  },
  watch: {
    presence() {
      /**
       * Participants contains an array of participant IDs currently viewing the chat in the current room
       */
      this.$emit('update:participants', Object.keys(this.presence));
    }
  },
  mounted() {
    setInterval(() => {
      this.$magpie.socket.broadcast(
        EVENT_CHAT_PRESENCE,
        this.$magpie.socket.participantId
      );
    }, PRESENCE_INTERVAL);
    this.$emit('update:participants', Object.keys(this.presence));
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
        participantId: this.$magpie.socket.participantId,
        time: Date.now()
      });
      this.$refs.text.value = '';
      this.$refs.text.focus();
    },
    flattenData(messages) {
      return {
        chatMessage: messages.map((m) => m.message),
        chatParticipantId: messages.map((m) => m.participantId),
        chatTime: messages.map((m) => m.time)
      };
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
