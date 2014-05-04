var _ = require('lodash');
var fs = require('fs');
var csv = require('csv');
var Q = require('q');

module.exports = function (trainingSize, validationSize) {

    var data = {
        train: {
            features: [],
            targets: []
        },
        validation: {
            features: [],
            targets: []
        },
        test: {
            features: []
        }
    };

    var deferred = Q.defer();
 
    csv()
        .from.path(__dirname+'/digits/train.csv', { delimiter: ',', escape: '"' })
        .on('record', function (row,index){
            var features = _.map(row.slice(1), function (feature) {
                return feature>0?1:0;
            });
            data.train.features.push(features);
            data.train.targets.push(row[0]);
        })
        .on('end', function (count) {
            data.validation.features = data.train.features.splice(trainingSize, validationSize);
            data.validation.targets = data.train.targets.splice(trainingSize, validationSize);
            data.train.features = data.train.features.splice(0, trainingSize);
            data.train.targets = data.train.targets.splice(0, trainingSize);
            console.log('Training Data Size: ' + data.train.features.length + ' records and ' + data.train.features[0].length + ' features');
            console.log('Validation Data Size: ' + data.validation.features.length + ' records and ' + data.validation.features[0].length + ' features');
            deferred.resolve(data); 
        })
        .on('error', function (error) {
            deferred.reject(error);
        });
 
    return deferred.promise;
};