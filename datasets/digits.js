var _ = require('lodash');
var fs = require('fs');
var csv = require('csv');
var Q = require('q');

module.exports = function (trainingSize, validationSize) {

    var data = {
        train: [],
        validation: []
    };

    var deferred = Q.defer();
 
    csv()
        .from.path(__dirname+'/digits/train.csv', { delimiter: ',', escape: '"' })
        .on('record', function (row,index){
            var features = _.map(row.slice(1), function (xi) {
                return xi>0?1:0;
            });
            data.train.push({y: row[0], x: features});
        })
        .on('end', function (count) {            
            data.train = _.shuffle(data.train);
            data.validation = data.train.splice(trainingSize, validationSize);
            data.train = data.train.splice(0, trainingSize);

            console.log('Training Data Size: ' + data.train.length + ' records and ' + data.train[0].x.length + ' features');
            console.log('Validation Data Size: ' + data.validation.length + ' records and ' + data.validation[0].x.length + ' features');
            deferred.resolve(data); 
        })
        .on('error', function (error) {
            deferred.reject(error);
        });
 
    return deferred.promise;
};