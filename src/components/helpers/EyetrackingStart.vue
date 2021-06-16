<docs>
This component (re)starts capturing the eye gaze track.
You can retrieve the current eye track with `$magpie.eyetracking.getEyeTrack()`.
</docs>
<template><span /></template>
<script>
export default {
  name: 'EyetrackingStart',
  mounted() {
    this.$magpie.eyetracking.start();
  }
};
</script>

<style scoped></style>
