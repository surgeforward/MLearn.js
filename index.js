var _ = require('lodash');

/**
 * MLearn.js
 *
 *
 */

module.exports = function () {

	var mlearn = {};
    
    /**
     *
     */
    mlearn.classifier = function (type, properties) {
        var classifier = require('./lib/classifier.js');
        return classifier( type, properties );
    };

    /**
     *
     */
    mlearn.regressor = function (type, properties) {
        var regressor = require('./lib/regressor.js');
        return regressor( type, properties );
    };

    return mlearn;

};
