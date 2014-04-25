var data = require('../../datasets/iris.js')();
var mlearn = require('../../index.js')();
var knn = mlearn.classifier('knn', { neighbors: 5 });

console.log('Training Model');
knn.train(data.train.features, data.train.targets);

console.log('Scoring Model With Validation Data');
var score = knn.score(data.validation.features, data.validation.targets);
console.log(score);

console.log('Making Predictions With Model');
var predictions = knn.predict( data.validation.features );
console.log(predictions);
