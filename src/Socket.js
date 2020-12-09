import { Socket as PhoenixSocket } from 'phoenix';
import EventEmitter from 'events';
import Vue from 'vue';

export const states = {
  CONNECTING: 'CONNECTING',
  CONNECTED: 'CONNECTED',
  WAITING: 'WAITING',
  READY: 'READY',
  ERROR: 'ERROR'
};

export default class Socket extends EventEmitter {
  constructor($magpie, socketURL, errorhandler) {
    super();
    this.$magpie = $magpie;
    this.errorHandler = (er) => {
      this.state = states.ERROR;
      errorhandler(er);
    };

    this.participantId = generateId(40);
    this.phoenix = new PhoenixSocket(socketURL, {
      params: {
        participant_id: this.participantId,
        experiment_id: this.$magpie.experimentId
      }
    });
    this.phoenix.onError(this.errorHandler);
    this.phoenix.connect();
    this.state = states.CONNECTING;

    Vue.observable(this);
  }

  initialize() {
    this.participantChannel = this.phoenix.channel(
      `participant:${this.participantId}`,
      {}
    );

    this.participantChannel.on('experiment_available', (payload) => {
      this.variant = payload.variant;
      this.chain = payload.chain;
      this.realization = payload.realization;
      this.state = states.CONNECTED;
      this.join();
    });

    this.participantChannel
      .join()
      // Note that `receive` functions are for receiving a *reply* from the server after you try to send it something, e.g. `join()` or `push()`.
      // While `on` function is for passively listening for new messages initiated by the server.
      // We still need to wait for the actual confirmation message of "experiment_available". So we do nothing here.
      .receive('ok', () => {})
      .receive('error', this.errorHandler)
      .receive('timeout', this.errorHandler);
  }

  join() {
    if (!this.chain || !this.realization) {
      return;
    }
    this.roomChannel = this.phoenix.channel(
      `interactive_room:${this.$magpie.id}:${this.chain}:${this.realization}`,
      { participant_id: this.participantId }
    );

    this.roomChannel
      .join()
      .receive('ok', () => {
        this.state = states.WAITING;
      })
      .receive('error', this.errorHandler)
      .receive('timeout', this.errorHandler);

    this.roomChannel.on('start_game', () => {
      this.state = states.READY;
    });

    this.roomChannel.on('new_msg', (msg) => {
      this.emit(msg.event, msg.payload);
    });
  }

  setUpSubscriptions(subscriptions, thisArg) {
    for (const event of Object.keys(subscriptions)) {
      subscriptions[event].listener = (payload) =>
        subscriptions[event].call(thisArg, payload);
      this.on(event, subscriptions[event].listener);
    }
  }

  tearDownSubscriptions(subscriptions) {
    for (const event of Object.keys(subscriptions)) {
      this.off(event, subscriptions[event].listener);
    }
  }

  broadcast(event, payload) {
    this.roomChannel.push('new_msg', { event, payload });
  }
}

/* For generating random participant IDs */
// https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
// generateId :: Integer -> String
function generateId(len) {
  // dec2hex :: Integer -> String
  const dec2hex = function (dec) {
    return ('0' + dec.toString(16)).substr(-2);
  };

  let arr = new Uint8Array((len || 40) / 2);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, dec2hex).join('');
}
