---
layout: post
title: 
tags:
- rails
- vue
- frontend
- migration
thumbnail: /media/2017/vue.png
---
{% image_tag src="/media/2017/vue.png" width="572" %}

Sometimes the most consuming part of the tasks is setting it up all together. Then coding is simple once all the puzzles fit it. So in the hope I can help someone having a similar problem I'm publishing a post on gluing Vue, Rails and Slim altogether.

I spent part of Friday setting up Vue in our Rails app. It's yet another framework we want to try out. We already have a homegrown framework, React, and now Vue. We're trying out Vue in the hope of giving us a decent framework that will be easier to integrate with the existing code.

Earlier this week were fun - I was playing with Vue for the first time. Just putting everything into a single slim file coding and trying to make it work (which I did). All the components had templates in one place, not a good approach for the future but I was focused on making it work, not making it clean and well structured.

[Tarmo](https://bearmetal.eu/team/tarmo/) prepared a nice branch with webpacker and Rails 5.1.3 so I decided to move my stuff there, to give it some proper structure (`vue` files) and finally use ES6 (still stuck in this project on CoffeeScript).

It was quite easy to start with `rails webpacker::install::vue`.  I started creating new `vue` files, splitting up my monolith to functional pieces.

But I got stuck with one and quite important thing for me - how to use existing `slim` templates? We use slim and I'm really found of it. Also having support on Vue side would be great - it would help us move existing stuff (and maybe share some parts?).

Finding slim support was quite easy, there's [slim-lang-loader](https://github.com/MaxPleaner/slim-lang-loader) ♥️

But how to use it in the vue file? I know you can add support for additional languages in [vue-loader](https://vue-loader.vuejs.org/en/) and use syntax like (in `vue` file):

```
<template lang="slim">
    div
        p
            This works!
</template>
```

But I don't like this much, would prefer the view to be in a separate file (better IDE support, etc.).

So I tried to look up something on the net. Not much hints, except that simple `template: require('file')` should work provided I have proper loaders configured in the project.

But it didn't work out of the box. Was failing with:

```
Module parse failed: .../node_modules/slim-lang-loader/index.js!.../app/javascript/packs/sky/filter-modal.slim Unexpected token (1:0)
You may need an appropriate loader to handle this file type.
| <modal @close="hideModal"><form class="sf-form sf-form-full sf-below-4 sf-pad-3" slot="body"><div class="sf-grid sf-grid-fluid"><slot name="form-body"></slot><div class="sf-row"><div class="sf-col sf-alignr"><a :class="{ &#39;sf-btn-disabled&#39;: !canSave }" @click.prevent="$emit(&#39;save&#39;)" class="sf-btn sf-btn-success" href="#">Save</a></div></div></div></form></modal>
| 
```

So part of it was working - rendering HTML from Slim! Yay! But I was still missing some loader, but which one?

I tried to come up with search keywords, trying `inline-loader`, `file-loader` and others. None worked. Finally I found the missing one `raw-loader`!!!

So with a simple file `config/webpack/loaders/slim.js`

```js
module.exports = {
  test: /.slim$/,
  loader: ['raw-loader', 'slim-lang-loader'],
}
```

I made it work!

```html
<script>
  import Modal from './modal'

  export default {
    template: require('./filter-modal.slim'),

    props: ['hideModal', 'saveFilter', 'canSave'],

    components: {
      modal: Modal,
    }
  }
</script>
```

Well, there was one change needed as well, in `config/webpack/shared.js` I had to use vue version that supports runtime template compilation with:

```js
resolve: {
    extensions: settings.extensions,
    modules: [
      resolve(settings.source_path),
      'node_modules'
    ],
    // missing piece
    alias: {
      vue: 'vue/dist/vue.common.js'
    }
},
```

Such a small change (in terms of the code) but such a big step forward! Now I can't wait to make something bigger with Vue.