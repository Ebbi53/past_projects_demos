define(function () { return function (a) { function b(a, b, c, d, e, f, g) { try { var h = a[f](g), i = h.value } catch (a) { return void c(a) } h.done ? b(i) : Promise.resolve(i).then(d, e) } return function () { var c = this, d = arguments; return new Promise(function (e, f) { function g(a) { b(i, e, f, g, h, "next", a) } function h(a) { b(i, e, f, g, h, "throw", a) } var i = a.apply(c, d); g(void 0) }) } } });