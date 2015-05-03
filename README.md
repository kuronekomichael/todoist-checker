node-todoist-promise
======================

[![NPM version][npm-badge]](http://badge.fury.io/js/node-todoist-promise)
[![Build status][travis-badge]](https://travis-ci.org/kuronekomichael/node-todoist-promise)
[npm-badge]: https://badge.fury.io/js/node-todoist-promise.png
[travis-badge]: https://travis-ci.org/kuronekomichael/node-todoist-promise.svg?branch=master

UNOFFICIAL todoist api for nodejs

## Features

- get all projects
- get uncompleted items by project
- get uncompleted items with no limit-clock

## install

```
npm install --save node-todoist-promise
```

## API

### new Todoist(token)

- constructor
- @param **(require)** todoist token
- @return todoist instance

### todoist.projects()

- get all projects
- @return [project1, project2,..]

### todoist.uncompletedItems(project)

- get uncompleted items by project
- @param **(require)** project object. see `todoist.projects()`
- @return [item1, item2,..]

### todoist.timeBlankedItems(project)

- get uncompleted items with no limit-clock
- @return [item1, item2,..]

## Sample

see `./example/check-date.js`

```
export TODOIST_TOKEN=29idlfkaj839oigfsadkajsd9832rj3
node ./check-date.js
```

```
var Todoist = require('todoist');

new Todoist(process.env.TODOIST_TOKEN)
    .timeBlankedItems()
    .then(function(items) {
        if (items.length === 0) {
            console.log('Clear');
            return;
        }

        console.log('timeBlankedItems:');
        items.forEach(function(item) {
            console.log(item.project.name, item.date_string, item.content);
        });
});
```
