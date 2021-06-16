<docs>
This component asks the user to enable full screen.
</docs>
<template><span /></template>
<script>
export default {
  name: 'FullScreenStart',
  mounted() {
    document.documentElement.requestFullscreen();
  }
};
</script>

<style scoped></style>
