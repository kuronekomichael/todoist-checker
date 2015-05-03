'use strict';
var _ = require('lodash'),
    Promise = require('bluebird'),
    request = Promise.promisify(require("request"));

function Todoist(token) {
    if (!token) {
        throw new Error('Argument not found. (Must set a token)');
    }
    this.token = token;
};

// 全てのプロジェクトを取得
Todoist.prototype.projects = function() {
    return request({
        url: 'https://todoist.com/API/getProjects',
        qs: {
            token: this.token
        },
        json: true
    }).then(function(ret) {
        var res = ret.shift();
        if (res.statusCode !== 200) {
            throw new Error('Could not access Todoist. Please check your token.');
        }
        return ret.shift();
    });
};

var flag = false;

// 指定したプロジェクト内の未完了のタスクを取得
// @param project. see Todoist#projects()
Todoist.prototype.uncompletedItems = function(project) {
    var project_id = project.id;
    return request({
        url: 'https://todoist.com/API/getUncompletedItems',
        qs: {
            token: this.token,
            project_id: project_id
        },
        json:true
    }).then(function(ret) {
        var res = ret.shift();
        if (res.statusCode !== 200) {
            throw new Error('Could not access Todoist. Please check your token.');
        }
        var items = ret.shift();
        return items.filter(function(item) {
            item.project = project;
            return !item.date_string || !/\d{1,2}:\d{2}/.test(item.date_string);
        });
    });
};

// 期限時刻が設定されていない未完了のタスクをすべて取得
Todoist.prototype.timeBlankedItems = function() {
    var that = this;
    return that.projects().then(function(projects) {
        return Promise.all(projects.map(function(project) {
            return that.uncompletedItems(project);
        }));
    }).then(_.flatten);
};

module.exports = Todoist;
