<docs>
This will display all data that has been entered into the experiment up to this point in a table.
This is useful for debugging.
Once you are going live with your experiment, you can use the SubmitResultsScreen instead of this one to submit the data to the server and say thank you to the user.
</docs>

<template>
  <Screen title="Results" class="debugResults">
    <Slide>
      <button @click="downloadCsv">Download all data as csv</button>
      <table v-if="results.length">
        <thead>
          <tr>
            <th v-for="key in Object.keys(results[0])" :key="key">{{ key }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in results" :key="i">
            <td v-for="(key, j) in Object.keys(results[0])" :key="j">
              {{ String(row[key]) }}
            </td>
          </tr>
        </tbody>
      </table>
    </Slide>
  </Screen>
</template>

<script>
import Screen from '../Screen.vue';
import Slide from '../Slide.vue';

export default {
  name: 'DebugResultsScreen',
  components: { Slide, Screen },
  props: {},
  data() {
    return {
      results: [],
      csv: ''
    };
  },
  mounted() {
    this.results = this.$magpie.getAllData();
    const columns = Object.keys(this.results[0]);
    this.csv = [columns.join('; ')]
      .concat(
        this.results.map((entry) =>
          columns
            .map((col) => {
              const val = String(entry[col]).replace(/"/g, '""');
              return val.includes(';') || val.includes('"') ? `"${val}"` : val;
            })
            .join('; ')
        )
      )
      .join('\n');
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

.debugResults {
  overflow-x: scroll;
}
</style>
