var Q = require('q');
var _ = require('lodash');
var timing = require('timing')();
var Parallel = require('paralleljs');
var Worker = require('webworker-threads').Worker;

var testArray = [42, 43, 44];

////////////////////////////////////////////

// testQ().then(testParallel);
testWorkers();

////////////////////////////////////////////

function testQ() {
    timing.time('Q');
    return _.reduce(testArray, function (sum, x) {
        return promisify(fib, x).then(function (result) {
            return sum + result;
        });
    }, 0).then(function (result) {
        console.log('Q:', timing.timeEnd('Q').duration);
        console.log(result); 
        console.log('--');
    });
}

////////////////////////////////////////////

function testParallel() {
    timing.time('Parallel');
    var p = new Parallel(testArray);
    return p.reduce(function (sum, num) {
        var f = fib(num);
        return f + sum;
    }, 0).then(function (sum, result) {
        console.log('Parallel:', timing.timeEnd('Parallel').duration);
        console.log(result); 
        console.log('--');
    });
}

////////////////////////////////////////////

function testWorkers() {
    timing.time('Worker');

    var responses = [], completedWorkers = 0;

    var workers = _.map(_.range(testArray.length), function (i) {
        var W = new Worker(__dirname+'/worker.js');
        W.onmessage = function (event) {
            responses.push(event.data.result);
            if (event.data.closing) {
                completedWorkers++;
                if (completedWorkers == testArray.length) {
                    console.log(testArray);
                }
            }
        }
        return W;
    });

    _.each(workers, function (W, key) {
        W.postMessage(testArray[key]);
    });
}

////////////////////////////////////////////

function promisify (fn) {
    var deferred = Q.defer();
    var args = _.toArray(arguments).slice(1);
    _.defer(function () {
        var result = fn.apply(null, args);
        deferred.resolve(result);
    });
    return deferred.promise;
}

function fib(n) {
    return n < 2 ? 1 : fib(n - 1) + fib(n - 2);
}
