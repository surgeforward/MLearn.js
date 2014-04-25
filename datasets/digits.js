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
        .from.path(__dirname+'/digits-train.csv', { delimiter: ',', escape: '"' })
        .on('record', function (row,index){
            if (index > 41990) dSet = 'validation';
            dataSet[dSet].features.push(row.slice(1));
            dataSet[dSet].targets.push(row[0]);
        })
        .on('end', function (count) {
            deferred.resolve(dataSet); 
        })
        .on('error', function (error) {
            deferred.reject(error);
        });
 
    return deferred.promise;
};