var proxyquire = require("proxyquire");
    Promise = require('bluebird');

describe('Create instance', function() {
    var Todoist = require("../lib/todoist");

    it('create instance', function() {
        expect(function () {
            var todoist = new Todoist('pretty-good-token');
        }).to.not.throw(Error);
    });
    it('error at create instance', function() {
        expect(function () {
            var todoist = new Todoist();
        }).to.throw(Error);
    });
});

// require Todoist with stubbed "request"
function requireTodoistWithProxy(res, json) {
    var PromiseStub = {
        promisify: function() {
            return function(){
                return Promise.resolve([
                    res,
                    json
                ]);
            };
        }
    };
    return Todoist = proxyquire('../lib/todoist', { 'bluebird': PromiseStub });
}

describe('Get projects', function() {
    var Todoist;

    it('get projects', function() {
        var Todoist = requireTodoistWithProxy({statusCode:200}, require('./fixtures/projects'));

        return new Todoist('very-nice-token').projects().then(function(projects) {
             expect(projects.length).to.be.equals(3);
        });
    });
    it('http error at get projects', function() {
        var Todoist = requireTodoistWithProxy({statusCode:404}, {});

        return new Todoist('very-nice-token').projects().then(function(projects) {
            throw new Error("no error, no life!");
        }, function(err) {
            expect(err).to.be.an.instanceof(Error);
            expect(err).to.be.match(/Could not access Todoist/);
        });
    });
});

describe('Get uncompleted items', function() {

    it('get uncompleted items', function() {
        var Todoist = requireTodoistWithProxy({statusCode:200}, require('./fixtures/uncompletedItems'));

        return new Todoist('very-nice-token').uncompletedItems({id:123}).then(function(items) {
             expect(items.length).to.be.equals(2);
        });
    });
    it('http error at uncompleted items', function() {
        var Todoist = requireTodoistWithProxy({statusCode:501}, require('./fixtures/uncompletedItems'));

        return new Todoist('very-nice-token').uncompletedItems({id:123}).then(function(items) {
            throw new Error("no error, no life!");
        }, function(err) {
            expect(err).to.be.an.instanceof(Error);
            expect(err).to.be.match(/Could not access Todoist/);
        });
    });
});

describe('Get uncompleted items that don\'t have a limit-time', function() {
    var Todoist = require("../lib/todoist");
    it('get uncompleted items with limit time blanked', function() {
        var todoist = new Todoist('very-nice-token');

        sinon.stub(todoist, 'projects', function() {
            return Promise.resolve([{id:1}, {id:11}]);
        });

        sinon.stub(todoist, 'uncompletedItems', function(project) {
            return Promise.resolve([{id:project.id + 1}, {id:project.id + 2}, {id:project.id + 3}]);
        });

        return todoist.timeBlankedItems().then(function(items) {
            var actual = [
                {id: 2}, {id: 3}, {id: 4},
                {id: 12}, {id: 13}, {id: 14}
            ];
            expect(items.length).to.be.equals(6);
            expect(items).is.deep.equals(actual);
        });
    });
    it('error at projects()', function() {
        var todoist = new Todoist('very-nice-token');

        sinon.stub(todoist, 'projects', function() {
            return Promise.reject(new Error('something error at projects'));
        });

        sinon.stub(todoist, 'uncompletedItems', function(project) {
            return Promise.resolve([{id:project.id + 1}, {id:project.id + 2}, {id:project.id + 3}]);
        });

        return todoist.timeBlankedItems().then(function() {
            throw new Error("no error, no life!");
        }, function(err) {
            expect(err).to.be.an.instanceof(Error);
            expect(err).to.be.match(/something error at projects$/);
        });

    });
    it('error at uncompletedItems()', function() {
        var todoist = new Todoist('very-nice-token');

        sinon.stub(todoist, 'projects', function() {
            return Promise.resolve([{id:1}, {id:11}]);
        });

        sinon.stub(todoist, 'uncompletedItems', function(project) {
            return Promise.reject(new Error('something error at uncompletedItems'));
        });

        return todoist.timeBlankedItems().then(function() {
            throw new Error("no error, no life!");
        }, function(err) {
            expect(err).to.be.an.instanceof(Error);
            expect(err).to.be.match(/something error at uncompletedItems$/);
        });
    });
});
