var Todoist = require('./lib/todoist');

var token = process.env.TODOIST_TOKEN;

var SUCCESS = 0;
var ERROR = 1;

new Todoist(token).timeBlankedItems().then(function(items) {

    if (items.length === 0) {
        console.log('-> ✔期限が設定されていないタスクは見つかりませんでした:)');
        process.exit(SUCCESS);
    }

    console.log('-> ✘期限が設定されていないタスクが ' + items.length + '件 みつかりました:(');

    items.forEach(function(item, index) {
        console.log('(' + (index + 1) + ') [' + item.project.name + '] ' + item.date_string + '\t' + item.content);
    });
    process.exit(ERROR);
});
