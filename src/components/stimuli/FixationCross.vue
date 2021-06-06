<docs>
This component allows you to display a fixation cross.

```vue
<Experiment>
  <template #screens>

    <Screen>

      <template #0="{nextSlide}">
        <FixationCross />
      </template>

    </Screen>

  </template>
</Experiment>
```
</docs>

<template>
  <CanvasStage :config="{ width: 800, height: 400 }">
    <CanvasLayer>
      <CanvasShape
        :config="{
          sceneFunc: function (context, shape) {
            context.beginPath();
            context.moveTo(x - 25, y - 25);
            context.lineTo(x + 25, y + 25);
            context.moveTo(x + 25, y - 25);
            context.lineTo(x - 25, y + 25);
            context.closePath();

            context.strokeShape(shape);
          },
          strokeWidth: 1,
          stroke: 'black'
        }"
      />
    </CanvasLayer>
  </CanvasStage>
</template>

<script>
export default {
  name: 'FixationCross',
  props: {
    /**
     * X-coordinate of cross center
     */
    x: {
      type: Number,
      default: 425
    },
    /**
     * Y-coordinate of cross center
     */
    y: {
      type: Number,
      default: 200
    }
  }
};
</script>
