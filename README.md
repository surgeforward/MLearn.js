About
=====

The Surge MLearn.JS package provided by the Surge Consulting Group is a set of open sourced tools for building machine learning applications. The package is aimed to run as NodeJS package that can be installed via NPM, as well as a browser based implemenation.

Installation
============

Dependencies
============

Refer to package.json from NodeJS dependendies.

Usage
============

    var data = require('../../datasets/iris.js');
    var mlearn = require('../../index.js')();
    var knn = mlearn.classifier('knn', { neighbors: 5 });
    
    knn.train(data.train.features, data.train.targets);
    var score = knn.score(data.validation.features, data.validation.targets);
    var predictions = knn.predict( data.validation.features );

References
==========
 * [Surge Consulting Group](http://www.surgeforward.com/)

License
=====
The MIT License (MIT)

Copyright (c) 2014 Surge, LLC

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
