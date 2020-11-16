import { Socket } from 'phoenix';
import store from './store/index';
import config from './config';

/* Helper functions */
const showErrorMessageOnSocketError = function(reasons) {
  window.alert(
    `Sorry, a connection to our server couldn't be established. You may want to wait and try again. If the error persists, do not proceed with the HIT. Thank you for your understanding. Error: ${JSON.stringify(
      reasons
    )}`
  );
};

const showErrorMessageOnSocketTimeout = function() {
  window.alert(
    `Sorry, the connection to our server timed out. You may want to wait and try again. If the error persists, do not proceed with the HIT. Thank you for your understanding. `
  );
};

/* For generating random participant IDs */
// https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
// generateId :: Integer -> String
const generateId = function(len) {
  // dec2hex :: Integer -> String
  const dec2hex = function(dec) {
    return ('0' + dec.toString(16)).substr(-2);
  };

  let arr = new Uint8Array((len || 40) / 2);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, dec2hex).join('');
};

export let variant = null;
export let chain = null;
export let realization = null;
let participantChannel = null;
let gameChannel = null;
const socketURL = config.socketURL;
// const socketURL = 'ws://localhost:4000/socket';
const participantID = generateId(40);
const experimentID = config.experimentID;
// const experimentID = '2';
const experimentSocket = new Socket(socketURL, {
  params: {
    participant_id: participantID,
    experiment_id: experimentID
  }
});
experimentSocket.onError(() =>
  showErrorMessageOnSocketError('The connection to the server was dropped.')
);

export function initializeExperiment() {
  experimentSocket.connect();
  participantChannel = experimentSocket.channel(
    `participant:${participantID}`,
    {}
  );

  participantChannel.on('experiment_available', payload => {
    // Need to use a commit to perform a mutation since we're modifying the state
    variant = payload.variant;
    chain = payload.chain;
    realization = payload.realization;
    console.log(variant);
    console.log(chain);
    console.log(realization);
    store.commit('interactiveExperiment/SET_EXPERIMENT_AVAILABLE', null, {
      root: true
    });
  });

  participantChannel
    .join()
    // Note that `receive` functions are for receiving a *reply* from the server after you try to send it something, e.g. `join()` or `push()`.
    // While `on` function is for passively listening for new messages initiated by the server.
    // We still need to wait for the actual confirmation message of "experiment_available". So we do nothing here.
    .receive('ok', () => {})
    .receive('error', reasons => {
      showErrorMessageOnSocketError(reasons);
    })
    .receive('timeout', () => {
      showErrorMessageOnSocketTimeout();
    });
}

export function joinLobby() {
  gameChannel = experimentSocket.channel(
    `interactive_room:${experimentID}:${chain}:${realization}`,
    { participant_id: participantID }
  );

  gameChannel
    .join()
    .receive('ok', () => {
      store.commit('interactiveExperiment/SET_WAITING_IN_LOBBY', null, {
        root: true
      });
    })
    .receive('error', reasons => {
      showErrorMessageOnSocketError(reasons);
    })
    .receive('timeout', () => {
      showErrorMessageOnSocketTimeout();
    });

  gameChannel.on('start_game', () => {
    store.commit('interactiveExperiment/SET_GAME_START', null, {
      root: true
    });
  });

  setUpSubscriptionsToPayloads();
}

// export function broadcastEventToChannel(event, payload) {
//   gameChannel.push(event, payload);
// }

function setUpSubscriptionsToPayloads() {
  gameChannel.on('initialize_game', payload => {
    store.commit('interactiveExperiment/SET_INITIALIZE_GAME_PAYLOAD', payload, {
      root: true
    });
  });
  gameChannel.on('new_msg', payload => {
    store.commit('interactiveExperiment/SET_NEW_MESSAGE_PAYLOAD', payload, {
      root: true
    });
  });
  gameChannel.on('next_round', payload => {
    store.commit('interactiveExperiment/SET_NEXT_ROUND_PAYLOAD', payload, {
      root: true
    });
  });
  gameChannel.on('end_game', payload => {
    store.commit('interactiveExperiment/SET_END_GAME_PAYLOAD', payload, {
      root: true
    });
  });
}

export function broadcastInitializeGameEvent(payload) {
  gameChannel.push('initialize_game', payload);
}

export function broadcastNewMessageEvent(payload) {
  gameChannel.push('new_msg', payload);
}

export function broadcastNextRoundEvent(payload) {
  gameChannel.push('next_round', payload);
}

export function broadcastEndGameEvent(payload) {
  gameChannel.push('end_game', payload);
}
