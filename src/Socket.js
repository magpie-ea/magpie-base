import { Socket as PhoenixSocket } from 'phoenix';
import EventEmitter from 'events';
import Vue from 'vue';
import ANIMALS from 'cute-animals/corpus/animals.json';

const PRESENCE_INTERVAL = 3000;
const PRESENCE_TIMEOUT = 10000;

export const EVENT_SCREEN_PRESENCE = 'screen_presence';

export const states = {
  CONNECTING: 'CONNECTING',
  CONNECTED: 'CONNECTED',
  WAITING: 'WAITING',
  READY: 'READY',
  ERROR: 'ERROR'
};

/**
 * @class Socket
 */
export default class Socket extends EventEmitter {
  constructor(experimentId, socketURL, errorhandler) {
    super();
    this.errorHandler = (er) => {
      this.state = states.ERROR;
      errorhandler(er);
    };

    /**
     * @instance
     * @member participantId
     * @memberOf Socket
     * @type {string}
     */
    this.participantId = generateId(40);

    /**
     * @instance
     * @member experimentId
     * @memberOf Socket
     * @type {string}
     */
    this.experimentId = experimentId;
    this.phoenix = new PhoenixSocket(socketURL, {
      params: {
        participant_id: this.participantId,
        experiment_id: experimentId
      }
    });
    this.phoenix.onError(this.errorHandler);
    this.phoenix.connect();

    /**
     * A reactive property with the state of the socket
     * @instance
     * @member participantId
     * @memberOf Socket
     * @type {'CONNECTING'|'CONNECTED'|'WAITING'|'READY'|'ERROR'}
     */
    this.state = states.CONNECTING;

    /**
     * A reactive list of online participants
     * @instance
     * @member participants
     * @memberOf Socket
     * @type {string[]}
     */
    this.participants = [];

    /**
     * A reactive list of participants currently active in the current screen
     * @instance
     * @member active
     * @memberOf Socket
     * @type {string[]}
     */
    this.active = [];

    Vue.observable(this);

    this.currentScreen = null;
    this.participantsPerScreen = {};
    this.timeoutsPerParticipant = {};
  }

  /**
   * @instance
   * @memberOf Socket
   * @param id{String}
   * @returns {String}
   */
  getParticipantName(id) {
    return hashIdToArray(id, ANIMALS);
  }

  /**
   * @instance
   * @memberOf Socket
   * @param id{String}
   * @returns {String}
   */
  getParticipantColor(id) {
    return hashIdToArray(id, COLORS);
  }

  /**
   * Initialize the socket
   * @instance
   * @memberOf Socket
   */
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
      // Note that `receive` functions are for receiving a *reply* from; the server after you try to send it something, e.g. `join()` or `push()`.
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
      `interactive_room:${this.experimentId}:${this.chain}:${this.realization}`,
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

    this.roomChannel.on('presence_diff', (diff) => {
      Object.keys(diff.joins).forEach((id) => this.participants.push(id));
      Object.keys(diff.leaves).forEach((id) =>
        this.participants.splice(this.participants.indexOf(id), 1)
      );
    });

    setInterval(() => {
      this.broadcast(EVENT_SCREEN_PRESENCE, {
        [this.participantId]: this.currentScreen
      });
    }, PRESENCE_INTERVAL);

    this.on(EVENT_SCREEN_PRESENCE, (data) => {
      Object.assign(this.participantsPerScreen, data);
      this.updateActiveParticipants();
      const participant = Object.keys(data)[0];
      if (!participant) {
        return;
      }
      clearTimeout(this.timeoutsPerParticipant[participant]);

      this.timeoutsPerParticipant[participant] = setTimeout(() => {
        delete this.participantsPerScreen[participant];
        this.updateActiveParticipants();
      }, PRESENCE_TIMEOUT);
    });
  }

  setCurrentScreen(index) {
    this.currentScreen = index;
    this.updateActiveParticipants();
  }

  updateActiveParticipants() {
    this.active = Object.entries(this.participantsPerScreen)
      .filter(([, value]) => value === this.currentScreen)
      .map(([key]) => key);
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

  /**
   * @instance
   * @memberOf Socket
   * @param event{string}
   * @param payload
   */
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

function hash(str) {
  var hash = 0,
    i,
    chr;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

function hashIdToArray(id, array) {
  var h = hash(id);
  let animal = array[Math.abs(h % array.length)];
  return animal;
}

const COLORS = [
  '#ffadad',
  '#ffd6a5',
  '#fdffb6',
  '#caffbf',
  '#9bf6ff',
  '#a0c4ff',
  '#bdb2ff',
  '#ffc6ff'
];
