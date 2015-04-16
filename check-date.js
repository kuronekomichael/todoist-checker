var Promise = require('bluebird');
var request = Promise.promisify(require("request"));

var token = process.env.TODOIST_TOKEN;

function getProjects() {
    return request({
        url: 'https://todoist.com/API/getProjects',
        qs: {
            token: token
        },
        json:true
    }).then(function(ret) {
        var res = ret.shift();
        if (res.statusCode !== 200) {
            console.error("Could not access Todoist. Please check your ${TODOIST_TOKEN}.");
            process.exit(-1);
        }
        return ret.shift();
    });
}

function getUncompletedItems(project) {
    var project_id = project.id;
    return request({
        url: 'https://todoist.com/API/getUncompletedItems',
        qs: {
            token: token,
            project_id: project_id
        },
        json:true
    }).then(function(ret) {
        var items = ret[1];
        return items.filter(function(item) {
            item.project = project;
            return !item.date_string;
        });
    });
}

getProjects().then(function(projects) {
    console.log('Todistで期限が設定されていないタスクを探します:');

    return Promise.all(projects.map(function(project) {
        return getUncompletedItems(project);
    }));
}).then(function(retList) {
    var items = [];
    retList.forEach(function(ret) {
        ret.forEach(function(item) {
            items.push(item);
        });
    });
    if (items.length === 0) {
        console.log('\t期限が設定されていないタスクは見つかりませんでした:)');
        process.exit(0/* SUCCESS */);
    } else {
        console.log('-> 期限が設定されていないタスクが' + items.length + '件みつかりました:(');
        var count = 1;
        items.forEach(function(item) {
            console.log('(' + count++ + ') [' + item.project.name + '] ' + item.content);
        });
        process.exit(1/* ERROR */);
    }
});
