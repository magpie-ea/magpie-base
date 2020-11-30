Magpie is a framework for easily and flexibly building psychological online experiments.

## Getting started

### Installing
To create an experiment you will need Node.js and npm and the magpie binary. You can install the magpie binary using npm as follows:

```bash
npm install -g magpie-base
```

### Creating a project
To create a new project, simply run

```bash
magpie new "project-name"
```

and magpie will create a new directory for you with a sample project.

Next, you will need to install the dependencies for your project using

```bash
npm install
```

### Running a development instance
To try out your project on your local machine, run

```bash
npm run serve
```

and click on the link it provides, to open the project in your browser.

### Building your project
To create a final build of your project that you can upload to a hoster like netlify, run

```bash
npm run build
```

### Vue.js
Magpie is based on [Vue.js](https://vuejs.org). Vue.js is a JavaScript framework that allows you to compose a web application out of components. A Vue component is a package of HTML, JavaScript and Optionally CSS bundled together, usually in a file with the extension `.vue`.

#### Components
A Vue component could look like this:

```html
<template>
<div>
  <h1>hello</h1>
</div>
</template>
<script>
export default {
  name: 'MyComponent',
}
</script>
```

Somewhere else, we could now use that component like a normal HTML element and Vue will render the components contents instead.

```html
<div>
  <MyComponent />
</div>
```

#### Data
To make components more flexible the `<template>` part actually accepts a superset of HTML, namely the Vue template language. It allows us to interpolate variables into our HTML.

```html
<template>
<div>
  <h1>hello {{ name }}</h1>
</div>
</template>
<script>
export default {
  name: 'MyComponent',
  data() {
    return {
      name: 'Donald'
    }
  }
}
</script>
```

Any property we define in `data` is available in the template as a variable. Technically this is just normal JavaScript, too, so you could do something like this:

```html
<template>
<div>
  <h1>hello {{ name.toUpperCase() }}</h1>
</div>
</template>
<script>
export default {
  name: 'MyComponent',
  data() {
    return {
      name: 'Donald'
    }
  }
}
</script>
```

#### If and for
To make things even more interesting, Vue introduces two special attributes: `v-if` and `v-for`, which allow you to render elements conditionally and iterate over them, respectively.

The following will only render the image if `name` equals `"Donald"`. As you might have guessed, `v-if` also allows arbitrary JavaScript expressions.

```html
<template>
<div>
  <h1>hello {{ name }}</h1>
  <img v-if="name === 'Donald'" src="donald.jpg" />
</div>
</template>
<script>
export default {
  name: 'MyComponent',
  data() {
    return {
      name: 'Donald'
    }
  }
}
</script>
```

The following renders multiple headings, with the different names that we defined in `data`. In addition to v-for we also have to provide a :key attribute, so that Vue can differentiate between the elements.

```html
<template>
<div>
  <h1 v-for="name in names" :key="name">hello {{ name }}</h1>
</div>
</template>
<script>
export default {
  name: 'MyComponent',
  data() {
    return {
      names: ['Donald', 'Hillary', 'Joe', 'Barack']
    }
  }
}
</script>
```

#### Component props
To make components even more useful, we usually want to generalize them. So, we don't want a component for each person that can be greeted, but we want a general greeter component.
For this we need to pass options to our components, called props in Vue.

```html
<template>
<div>
  <h1>hello {{ name }}</h1>
  <img v-if="name === 'Donald'" src="donald.jpg" />
</div>
</template>
<script>
export default {
  name: 'Greeter',
  props: {
    name: {
      type: String,
      required: true,
    }
  }
}
</script>
```

We can then use the component as follows:

```html
<template>
<div>
  <Greeter :name="'Donald'" />
</div>
</template>
<script>
export default {
  name: 'MyComponent',
}
</script>
```

Again, props allow passing arbitrary JavaScript expressions.

#### Component slots
Props allos passing JavaScript values to Components. If we want to pass full HTML, we need to use slots.

```html
<template>
<div>
  <h1>hello <slot name="person" /></h1>
</div>
</template>
<script>
export default {
  name: 'Greeter',
}
</script>
```

We can now pass in the HTML to replace the slot as follows:

```html
<template>
<div>
    <Greeter>
      <template #person>
        <b>Donald</b>
        <img src="donald.jpg" />
      </template>
    </Greeter>
</div>
</template>
<script>
export default {
  name: 'MyComponent',
}
</script>
```

#### Events
You can listen to normal DOM events using the @-shorthand. E.g. @click. The listener attribute accepts either a JavaScript statement, like a function call, or a function value.
The event object is available as $event.

Additionally, you can also emit events in your components using $emit.

You could for example pass up a DOM event as follows:
```html
<template>
<div>
  <h1 @click="$emit('click', $event)">hello {{name}}</h1>
</div>
</template>
<script>
export default {
  name: 'Greeter',
  props: {
    name: {
      type: String,
      required: true,
    }
  }
}
</script>
```

We can now listen for this event similarly, this time using a custom method:

```html
<template>
<div>
    <Greeter :name="'Donald'" @click="onClick"/>
</div>
</template>
<script>
export default {
  name: 'MyComponent',
  methods: {
    onClick(event) {
      window.alert('Hello you!')
    }
  }
}
</script>
```

#### More
There's much more to learn about Vue.js. If you are curious, head over to [the official guide](https://vuejs.org/v2/guide/syntax.html).

### Getting started with Magpie

#### Structure
The bulk of your experiment will reside in `App.vue`.

The root component of your experiment will always be `<Experiment>`.
Each experiment is composed of a series of screens, represented by the `<Screen>` component.
Each screen in turn is composed of multiple slides. Often you will probably only use one slide per screen, however.

#### Interface
Magpie adds a special magic property to all vue components that are descendants of `<Experiment>`: `$magpie`
`$magpie` allows you to access data you want to use in your trials, allows you to add results for submission, and gives you access to mouse tracking as well as control over which screen is displayed.
