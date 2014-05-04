var Benchmark = require('benchmark');
var util = require('util');
var Q = require('q');
var _ = require('lodash');
Q.longStackSupport = true;

var getDataSet = require(__dirname + '/../../datasets/digits.js');
var knn, mlearn = require(__dirname + '/../../mlearn.js')();

getDataSet(1, 1).then(function (dataSet, getTestData) {
    knn = mlearn.classifier('knn', { neighbors: 5 });
    return knn.training(dataSet.train.features, dataSet.train.targets).then(function () {
        return dataSet;
    });
}).then(function (dataSet) {
    
    var suite = new Benchmark.Suite();

    suite.add('euclidian', function () {
        knn.metric = 'euclidian';
        knn.predicting(dataSet.validation.features).then(function (prediction) {
            return prediction;
        });
    });

    suite.add('lazyManhattan', function () {
        knn.metric = 'lazyManhattan';
        knn.predicting(dataSet.validation.features).then(function (prediction) {
            return prediction;
        });
    });

    suite.add('manhattan', function () {
        knn.metric = 'manhattan';
        knn.predicting(dataSet.validation.features).then(function (prediction) {
            return prediction;
        });
    });

    suite.on('complete', function () {
        var fastest = this.filter('fastest');
        console.log('Fastest: ', _.map(fastest, function (s) { return {name: s.name, mean: s.stats.mean}; }));
        var slowest = this.filter('slowest');
        console.log('Slowest: ', _.map(slowest, function (s) { return { name: s.name, mean: s.stats.mean}; }));

        getDataSet(100, 1).then(function (dataSet, getTestData) {
            knn = mlearn.classifier('knn', { neighbors: 5 });
            return knn.training(dataSet.train.features, dataSet.train.targets).then(function () {
                return dataSet;
            });
        }).then(function (dataSet) {
            
            var suite = new Benchmark.Suite();

            suite.add('euclidian', function () {
                knn.metric = 'euclidian';
                knn.predicting(dataSet.validation.features).then(function (prediction) {
                    return prediction;
                });
            });

            suite.add('lazyManhattan', function () {
                knn.metric = 'lazyManhattan';
                knn.predicting(dataSet.validation.features).then(function (prediction) {
                    return prediction;
                });
            });

            suite.add('manhattan', function () {
                knn.metric = 'manhattan';
                knn.predicting(dataSet.validation.features).then(function (prediction) {
                    return prediction;
                });
            });

            suite.on('complete', function () {
                var fastest = this.filter('fastest');
                console.log('Fastest: ', _.map(fastest, function (s) { return {name: s.name, mean: s.stats.mean}; }));
                var slowest = this.filter('slowest');
                console.log('Slowest: ', _.map(slowest, function (s) { return { name: s.name, mean: s.stats.mean}; }));

                getDataSet(27000, 1).then(function (dataSet, getTestData) {
                    knn = mlearn.classifier('knn', { neighbors: 5 });
                    return knn.training(dataSet.train.features, dataSet.train.targets).then(function () {
                        return dataSet;
                    });
                }).then(function (dataSet) {
                    
                    var suite = new Benchmark.Suite({initCount: 25});

                    suite.add('euclidian', function () {
                        knn.metric = 'euclidian';
                        knn.predicting(dataSet.validation.features).then(function (prediction) {
                            return prediction;
                        });
                    });

                    suite.add('lazyManhattan', function () {
                        knn.metric = 'lazyManhattan';
                        knn.predicting(dataSet.validation.features).then(function (prediction) {
                            return prediction;
                        });
                    });

                    suite.add('manhattan', function () {
                        knn.metric = 'manhattan';
                        knn.predicting(dataSet.validation.features).then(function (prediction) {
                            return prediction;
                        });
                    });

                    suite.on('complete', function () {
                        var fastest = this.filter('fastest');
                        console.log('Fastest: ', _.map(fastest, function (s) { return {name: s.name, mean: s.stats.mean}; }));
                        var slowest = this.filter('slowest');
                        console.log('Slowest: ', _.map(slowest, function (s) { return { name: s.name, mean: s.stats.mean}; }));

                        getDataSet(27000, 500).then(function (dataSet, getTestData) {
                            knn = mlearn.classifier('knn', { neighbors: 5 });
                            return knn.training(dataSet.train.features, dataSet.train.targets).then(function () {
                                return dataSet;
                            });
                        }).then(function (dataSet) {
                            
                            var suite = new Benchmark.Suite({initCount: 10});

                            suite.add('euclidian', function () {
                                knn.metric = 'euclidian';
                                knn.predicting(dataSet.validation.features).then(function (prediction) {
                                    return prediction;
                                });
                            });

                            suite.add('lazyManhattan', function () {
                                knn.metric = 'lazyManhattan';
                                knn.predicting(dataSet.validation.features).then(function (prediction) {
                                    return prediction;
                                });
                            });

                            suite.add('manhattan', function () {
                                knn.metric = 'manhattan';
                                knn.predicting(dataSet.validation.features).then(function (prediction) {
                                    return prediction;
                                });
                            });

                            suite.on('complete', function () {
                                var fastest = this.filter('fastest');
                                console.log('Fastest: ', _.map(fastest, function (s) { return {name: s.name, mean: s.stats.mean}; }));
                                var slowest = this.filter('slowest');
                                console.log('Slowest: ', _.map(slowest, function (s) { return { name: s.name, mean: s.stats.mean}; }));
                            })
                            .run({async: false});

                        });
                    })
                    .run({async: false});

                });
            })
            .run({async: false});

        });
    })
    .run({async: false});

}).catch(function (error) {
    util.error('Error at classifier.js promise chain:');
    util.error(error.stack);
});