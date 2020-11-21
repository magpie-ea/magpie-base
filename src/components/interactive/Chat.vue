<template>
  <div>
    <div id="chat-box">
      <p v-for="(message, i) in messages" :key="i" v-text="message"></p>
    </div>
    <div class="magpie-view-answer-container">
      <textarea
        ref="text"
        cols="50"
        placeholder="Type your message to the other participant here."
      ></textarea>
      <button @click.stop="send()">
        Send
      </button>
    </div>
  </div>
</template>

<script>
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
    }
  },
  EVENT_CHAT_MESSAGE,
  methods: {
    send() {
      const msg = this.$refs.text.value;
      this.$exp.socket.broadcast(EVENT_CHAT_MESSAGE, msg);
    }
  }
};
</script>
