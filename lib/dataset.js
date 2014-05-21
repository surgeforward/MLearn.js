var _ = require('lodash');
var Q = require('q');
var request = require('request');
var numeric = require('numeric');

/**
 * Dataset
 */
module.exports = function (config) {
    var dataset = { features: [] };

    /**
     * 
     */
    dataset.shuffle = function () {
        _.shuffle(dataset.features);
        return dataset;
    };

    /**
     * 
     */
    dataset.pca = function (m) {
        var X = _.pluck(dataset.features, 'x');
        var sigma = numeric.div(numeric.dot(numeric.transpose(X), X), dataset.features.length);
        var svd = numeric.svd(sigma);
        console.log(sigma.length, svd.U.length, svd.U[0].length);
        process.exit();
        dataset.features = _.map(X, function (x, i) {
            var u = svd.U[i].slice(0, m);
            return numeric.dot(numeric.transpose(u), x);
        });
        console.log(dataset.features.length, dataset.features[0].length);
        return dataset;
    }

    /**
     * 
     */
    dataset.limit = function (limit) {
        dataset.features = dataset.features.splice(0, limit);
        return dataset;
    };

    /**
     * 
     */
    dataset.total = function () {
        return dataset.features.length;
    };

    /**
     * 
     */
    dataset.pop = function () {
        if (dataset.features.length<=0)
            return false;
        return dataset.features.pop();
    };

    /**
     * 
     */
    dataset.normalize = function () {
        dataset.features = _.map(dataset.features, function (f) {
            return {
                index: f.index,
                x: _.map(f.x, function (xi) {
                    return xi>0?1:0;
                }),
                y: f.y
            };
        });
        return dataset;
    }

    /**
     * 
     */
    dataset.split = function (size, offset) {
        var totalRecords = size;
        if (offset < 1 && offset > 0) {
            var totalOffset = dataset.total()*offset;
        } else {
            var totalOffset = offset || 0;
        }
        if (size < 1 && size > 0) {
            var totalRecords = dataset.total()*size;
        } else {
            var totalRecords = size;
        }
        return dataset.features.slice(totalOffset, totalOffset+totalRecords);
    };

    /**
     * 
     */
    dataset.from = {
        /**
         * 
         */
        csv: function (urlToCSV, targetkey) {
            var csv = require('csv');
            var deferred = Q.defer();
            request(urlToCSV, function(error, response, body) {
                csv().from.string(body, { delimiter: ',', escape: '"' })
                .on('record', function (row,index){
                    var target = row.splice(targetkey, 1)[0];
                    dataset.features.push({y: target, x: row, index: index});
                })
                .on('end', function (count) {
                    deferred.resolve(dataset); 
                })
                .on('error', function (error) {
                    deferred.reject(error);
                });
            }).on('error', function(e) {
                console.log("Got error: " + e.message);
            });
            return deferred.promise;
        },
        /**
         * 
         */
        json: function (results, targetkey) {

        },
        /**
         * 
         */
        mongo: function (results, targetkey) {

        }
    };

    return dataset;
}