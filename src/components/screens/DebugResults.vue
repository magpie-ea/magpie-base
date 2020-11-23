<docs>
This will display all data that has been entered into the experiment up to this point in a table.
This is useful for debugging.
Once you are gaoing live with your experiment, you can use the SubmitResults screen instead of this one to submit the data to the server and say thank you to the user.
</docs>

<template>
  <Screen title="Results">
    <template #0>
      <button @click="downloadCsv">Download all data as csv</button>
      <table>
        <thead>
          <tr>
            <th v-for="key in Object.keys(results[0])" :key="key">{{ key }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in results" :key="row">
            <td v-for="entry in row" :key="entry">{{ String(entry) }}</td>
          </tr>
        </tbody>
      </table>
    </template>
  </Screen>
</template>

<script>
import Screen from '../Screen';
import stringify from 'csv-stringify/lib/sync';

export default {
  name: 'DebugResults',
  components: { Screen },
  props: {},
  data() {
    const results = this.$magpie.getResults();
    return {
      results,
      csv: stringify(results, { columns: Object.keys(results[0]) })
    };
  },
  methods: {
    downloadCsv() {
      let blob = new Blob([this.csv], {
        type: 'text/plain',
        endings: 'native'
      });
      this.download(
        'magpie-' +
          this.$magpie.id +
          '-' +
          new Date().toISOString().slice(0, 10) +
          '.csv',
        blob
      );
    },

    download(filename, blob) {
      const element = document.createElement('a');

      let objectUrl = URL.createObjectURL(blob);
      element.setAttribute('href', objectUrl);
      element.setAttribute('download', filename);

      element.style.display = 'none';
      document.body.appendChild(element);

      element.click();

      URL.revokeObjectURL(objectUrl);
      document.body.removeChild(element);
    }
  }
};
</script>
<style scoped>
td {
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
