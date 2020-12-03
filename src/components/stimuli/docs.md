Magpie seamlessly integrates with HTML5 elements to display stimuli.

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

## Audio
You can use HTML's `<audio>` tag to play audio.

It has the following attributes (among others):

 * `autoplay` (optional) A Boolean attribute: if specified, the audio will automatically begin playback as soon as it can do so, without waiting for the entire audio file to finish downloading.
 * `controls` (optional) If this attribute is present, the browser will offer controls to allow the user to control audio playback, including volume, seeking, and pause/resume playback.
 * `currentTime` (optional) Reading currentTime returns a double-precision floating-point value indicating the current playback position, in seconds, of the audio. Setting currentTime sets the current playback position to the given time and seeks the media to that position if the media is currently loaded.
 * `loop` (optional) A Boolean attribute: if specified, the audio player will automatically seek back to the start upon reaching the end of the audio.
 * `muted` (optional) A Boolean attribute that indicates whether the audio will be initially silenced. Its default value is false.
 * `src` (optional) The URL of the audio to embed.

It has the following events (among others):

 * `ended` Playback has stopped because the end of the media was reached.
 * `pause` Playback has been paused.
 * `play` Playback has begun.

If you have a ref of the element, you can call methods like:

 * `pause()` Pauses the media playback.
 * `play()` Begins playback of the media.

For more details see [HTML Audio Element docs on MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio).

```vue
<Experiment>
  <template #screens>
    <Screen>
      <template #0>
        This is a sealion.<br/>
        <button @click="$refs.audio.play()">Start</button>
        <button @click="$refs.audio.pause()">Stop</button>
        <audio ref="audio" src="public/audio/sealion.ogg" loop />
      </template>
    </Screen>
  </template>
</Experiment>
```