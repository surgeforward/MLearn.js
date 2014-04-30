var _ = require('lodash');
var fs = require('fs');
var csv = require('csv');
var Q = require('q');

module.exports = function () {

    var dataSet = {
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

    var dSet = 'train';
    var deferred = Q.defer();
 
    csv()
        .from.path(__dirname+'/houses/train.csv', { delimiter: ',', escape: '"' })
        .on('record', function (row,index){
            dSet = (index <= 25) ? 'train' : 'validation' ;
            
            var features = row.slice(1, 13);
            dataSet[dSet].features.push(features);
            dataSet[dSet].targets.push(row[13]*100);
        })
        .on('end', function (count) {
            console.log('Traing Data Size: ' + dataSet.train.features.length + ' records and ' + dataSet.train.features[0].length + ' features');
            console.log('Validation Data Size: ' + dataSet.validation.features.length + ' records and ' + dataSet.validation.features[0].length + ' features');
            deferred.resolve(dataSet); 
        })
        .on('error', function (error) {
            deferred.reject(error);
        });
 
    return deferred.promise;
};