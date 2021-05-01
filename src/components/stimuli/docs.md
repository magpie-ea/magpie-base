## Text
As with normal HTML you can use normal `P` tags for paragraphs as well as `strong`, `em` etc. to mark them up.

```vue
<Experiment>
  <template #screens>
    <Screen>
      <template #0>
        <p><em>This</em> is a <strong>bold</strong> text.</p>
      </template>
    </Screen>
  </template>
</Experiment>
```
