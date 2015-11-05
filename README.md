# Scaffold

quick start with [**harp**](http://harpjs.com/), [**bower**](http://bower.io/) and [**gulp**](http://gulpjs.com/)

using **Jade**, **Stylus**, **CoffeeScript** as is

### Install

    npm install -g harp bower gulp

### Serve

localhost:9000

    bower install && harp server

### Build

    npm install && gulp

### Tricks

See *harp.json* and *.bowerrc*

```jade
//- Jade
link(rel="stylesheet"  href=cdn['Noto Sans'])
link(rel="stylesheet"  href=cdn['pure.css'])
link(rel="stylesheet"  href=bower['animate.css'])
```

```jade
//- Jade
script(type="application/javascript" src=bower['jquery'])
script(type="application/javascript" src=bower['jquery-smooth-scroll'])
```
