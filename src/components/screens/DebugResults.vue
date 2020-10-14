<template>
  <Screen title="Results">
    <template #0>
      <table id="magpie-debug-table">
        <thead>
          <tr>
            <th v-for="key in Object.keys(results[0])">{{ key }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in results">
            <td v-for="entry in row">{{ String(entry) }}</td>
          </tr>
        </tbody>
      </table>
    </template>
  </Screen>
</template>

<script>
import Screen from '../Screen';
export default {
  name: 'DebugResults',
  components: { Screen },
  props: {},
  data() {
    return {
      results: this.$exp.getResults()
    };
  }
};
</script>
