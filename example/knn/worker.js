self.onmessage = function (event) {
	self.postMessage({'result': fib(event.data), 'closing': true});
	self.close();
};

function fib(n) {
    return n < 2 ? 1 : fib(n - 1) + fib(n - 2);
}
