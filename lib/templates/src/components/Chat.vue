<template>
  <div class="magpie-view">
    <section class="magpie-text-container">
      <p id="game-instructions" class="magpie-view-text"></p>
    </section>
    <br />
    <br />
    <div id="chat-box"></div>

    <div class="magpie-view-answer-container">
      <textarea
        cols="50"
        class="magpie-response-text"
        placeholder="Type your message to the other participant here."
        id="participant-msg"
      ></textarea>
      <button class="magpie-view-button" @click.stop="broadcastMsg()">
        Send
      </button>
    </div>
  </div>
</template>

<script>
import {
  // variant,
  // broadcastInitializeGameEvent,
  broadcastNewMessageEvent
  // broadcastNextRoundEvent
  // broadcastEndGameEvent
} from '@/socket.js';

export default {
  name: 'Chat',
  data() {
    return {
      title: 'Chat'
    };
  },
  watch: {
    '$store.state.interactiveExperiment.newMessagePayload': function (payload) {
      let chatBox = document.querySelector('#chat-box');
      let msgBlock = document.createElement('p');
      msgBlock.classList.add('magpie-view-text');
      msgBlock.insertAdjacentHTML('beforeend', `${payload.message}`);
      chatBox.appendChild(msgBlock);
    }
  },
  methods: {
    broadcastMsg() {
      const msg = document.querySelector('#participant-msg').value;
      broadcastNewMessageEvent({ message: msg });
    }
  }
};
</script>
