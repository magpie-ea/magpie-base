<doc>
This will display all data that has been entered into the experiment up to this point in a table.
This is useful for debugging.
Once you are gaoing live with your experiment, you can use the SubmitResults screen instead of this one to submit the data to the server and say thank you to the user.
</doc>

<template>
  <Screen title="Results">
    <template #0>
      <table>
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
