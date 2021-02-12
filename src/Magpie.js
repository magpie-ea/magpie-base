import EventEmitter from 'events';
import Vue from 'vue';
import Socket from './Socket';
import _ from 'lodash';
import Mousetracking from './Mousetracking';

export default class Magpie extends EventEmitter {
  get $el() {
    return this.experiment.$el;
  }

  constructor(experiment, trials, options) {
    super();

    this.experiment = experiment;

    // options
    this.id = options.magpie.experimentId;
    this.submissionUrl = options.magpie.submissionUrl;
    this.completionUrl = options.magpie.completionUrl;
    this.contactEmail = options.magpie.contactEmail;
    this.socket = options.magpie.socketUrl
      ? new Socket(
          options.magpie.experimentId,
          options.magpie.socketUrl,
          this.onSocketError
        )
      : false;

    this.results = {};
    this.progress = -1;
    this.mousetracking = new Mousetracking();

    Vue.observable(this);

    // Setup magic "trial" slot property
    const currentTrial = {};
    this.trials = trials;
    this.currentTrialData = {};
    this.currentTrial = currentTrial;
    for (const type of Object.keys(this.trials)) {
      if (Array.isArray(this.trials[type])) {
        currentTrial.__defineGetter__(type, () => {
          if (this.currentTrialData[type]) {
            return this.currentTrialData[type];
          }
          this.currentTrialData[type] = this.trials[type].shift();
          return this.currentTrialData[type];
        });
      } else if ('function' === typeof this.trials[type]) {
        currentTrial.__defineGetter__(type, () => {
          if (this.currentTrialData[type]) {
            return this.currentTrialData[type];
          }
          this.currentTrialData[type] = this.trials[type](this.currentScreen);
          return this.currentTrialData[type];
        });
      } else {
        throw new Error(
          'Unsupported type of trial type definition for trial type ' +
            type +
            '. Expected either Array or Function'
        );
      }
    }
  }

  /**
   * Go to the next screen. (Will also reset scroll position.)
   * @public
   * @param index{int} the index of the screen to go to (optional; default is next screen)
   */
  nextScreen(...params) {
    this.experiment.nextScreen(...params);
  }

  /**
   * Add a result set
   * This method will automatically add a response_time key to your data with time measured from the start of the current screen
   *
   * @public
   * @param data{Object} a flat object whose data you want to add to the results
   */
  addResult(data) {
    if (!this.results[this.experiment.currentScreen]) {
      this.results[this.experiment.currentScreen] = [];
    }
    this.results[this.experiment.currentScreen].push({
      ...data,
      response_time: Date.now() - this.experiment.responseTimeStart
    });
  }

  onSocketError(er) {
    console.error(er);
  }

  getResults() {
    return flattenData({
      trials: addEmptyColumns(
        _.flatten(Object.values(this.results)).map((o) => Object.assign({}, o))
      ) // clone the data
    });
  }

  submit() {
    if (!this.submissionUrl) {
      throw new Error('No submission URL set');
    }
    return this.submitResults(this.submissionUrl, this.getResults());
  }

  submitIntermediateResults() {
    if (!this.submissionUrl) {
      throw new Error('No submission URL set');
    }
    return this.submitResults(this.submissionUrl, this.getResults(), true);
  }

  async submitResults(submissionURL, data, intermediate) {
    if (this.socket) {
      const submissionType = intermediate
        ? 'save_intermediate_results'
        : 'submit_results';

      return new Promise((resolve, reject) =>
        this.socket.participantChannel
          .push(submissionType, {
            results: data
          })
          .receive('ok', resolve)
          .receive('error', reject)
      );
    }
    const resp = await fetch(submissionURL, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (!resp.ok) {
      throw new Error('The server says: ' + (await resp.text()));
    }
  }

  /**
   * Set progress bar percentage
   * Will display a progress bar if it's not visible, yet.
   * @public
   * @param percentage{float} the percentage to display as a number between 0 and 1
   */
  setProgress(percentage) {
    this.progress = percentage;
  }
}

// adds columns with NA values
const addEmptyColumns = function (trialData) {
  var columns = [];

  for (var i = 0; i < trialData.length; i++) {
    for (var prop in trialData[i]) {
      if (trialData[i].hasOwnProperty(prop) && columns.indexOf(prop) === -1) {
        columns.push(prop);
      }
    }
  }

  for (var j = 0; j < trialData.length; j++) {
    for (var k = 0; k < columns.length; k++) {
      if (!trialData[j].hasOwnProperty(columns[k])) {
        trialData[j][columns[k]] = 'NA';
      }
    }
  }

  return trialData;
};

const flattenData = function (data) {
  var trials = data.trials;
  delete data.trials;

  // The easiest way to avoid name clash is just to check the keys one by one and rename them if necessary.
  // Though I think it's also the user's responsibility to avoid such scenarios...
  var sample_trial = trials[0];
  for (var trial_key in sample_trial) {
    if (sample_trial.hasOwnProperty(trial_key)) {
      if (data.hasOwnProperty(trial_key)) {
        // Much easier to just operate it once on the data, since if we also want to operate on the trials we'd need to loop through each one of them.
        var new_data_key = 'glb_' + trial_key;
        data[new_data_key] = data[trial_key];
        delete data[trial_key];
      }
    }
  }

  return _.map(trials, function (t) {
    for (const key in t) {
      if (Array.isArray(t[key])) {
        // Turn arrays into strings
        t[key] = t[key].join('|');
      }
    }
    // Here the data is the general informatoin besides the trials.
    return _.merge(t, data);
  });
};
