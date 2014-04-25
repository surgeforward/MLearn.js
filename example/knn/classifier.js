var getDataSet = require(__dirname+'/../../datasets/digits.js');

var startTime = Date.now();

console.log('Loading Digits Dataset');
getDataSet().then(function (dataSet, getTestData) {
    
    console.log('Digits Dataset Loaded');
    var mlearn = require(__dirname+'/../../index.js')();
    var knn = mlearn.classifier('knn', { neighbors: 5 });
    console.log('Training Model');

    knn.train(dataSet.train.features, dataSet.train.targets)
        .then(function () {
        
            console.log('Model Trained');
            console.log('Scoring Model With Validation Data');
            var scoreStart = Date.now();

            knn.score(dataSet.validation.features, dataSet.validation.targets)
                .then(function (score) {
                    
                    console.log('Finished Scoring');
                    console.log('Accuracy: ', (score*100)+'%');
                    console.log('Completed Scoring In', (Date.now()-scoreStart)/1000, 'Seconds');
                    console.log('Completed All In', (Date.now()-startTime)/1000, 'Seconds');

                }, function (error) {

                    console.log(error);

                });
        
        }, function (error) {
            
            console.log(error);
        
        });

}, function (error) {
    
    console.log(error);

});