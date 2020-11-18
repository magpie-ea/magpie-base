import { Socket as PhoenixSocket } from 'phoenix';

export const states = {
  CONNECTING: 'CONNECTING',
  CONNECTED: 'CONNECTED',
  JOINING: 'JOINING',
  JOINED: 'JOINED',
  ERROR: 'ERROR'
};

export default class Socket {
  constructor($exp, socketURL, errorhandler) {
    this.$exp = $exp;
    this.errorHandler = (er) => {
      this.state = states.ERROR;
      errorhandler(er);
    };

    this.participantId = generateId(40);
    this.phoenix = new PhoenixSocket(socketURL, {
      params: {
        participant_id: this.participantId,
        experiment_id: this.$exp.id
      }
    });
    this.phoenix.onError(this.errorHandler);
    this.state = states.CONNECTING;
  }

  initialize() {
    this.participantChannel = this.phoenix.channel(
      `participant:${this.participantId}`,
      {}
    );

    this.participantChannel.on('experiment_available', (payload) => {
      // Need to use a commit to perform a mutation since we're modifying the state
      this.variant = payload.variant;
      this.chain = payload.chain;
      this.realization = payload.realization;
      console.log({
        variant: payload.variant,
        chain: payload.chain,
        realization: payload.realization
      });
      this.state = states.CONNECTED;
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
    this.roomChannel = this.phoenix.channel(
      `interactive_room:${this.$exp.id}:${this.chain}:${this.realization}`,
      { participant_id: this.participantId }
    );

    this.roomChannel
      .join()
      .receive('ok', () => {
        this.state = states.JOINING;
      })
      .receive('error', this.errorHandler)
      .receive('timeout', this.errorHandler);

    this.roomChannel.on('start_game', () => {
      this.state = states.JOINED;
    });

    this.setUpSubscriptions();
  }

  setUpSubscriptions(subscriptions) {
    for (const event of Object.keys(subscriptions)) {
      this.roomChannel.on(event, subscriptions[event]);
    }
  }

  tearDownSubscriptions(subscriptions) {
    for (const event of Object.keys(subscriptions)) {
      this.roomChannel.off(event, subscriptions[event]);
    }
  }

  broadcast(event, payload) {
    this.roomChannel.push(event, payload);
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
