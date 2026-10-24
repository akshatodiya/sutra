(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}




var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log = F2(function(tag, value)
{
	return value;
});

var _Debug_log_UNUSED = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString(value)
{
	return '<internals>';
}

function _Debug_toString_UNUSED(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash_UNUSED(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.al.ai === region.av.ai)
	{
		return 'on line ' + region.al.ai;
	}
	return 'on lines ' + region.al.ai + ' through ' + region.av.ai;
}



// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**_UNUSED/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**_UNUSED/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**/
	if (typeof x.$ === 'undefined')
	//*/
	/**_UNUSED/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0 = 0;
var _Utils_Tuple0_UNUSED = { $: '#0' };

function _Utils_Tuple2(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2_UNUSED(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3_UNUSED(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr(c) { return c; }
function _Utils_chr_UNUSED(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil = { $: 0 };
var _List_Nil_UNUSED = { $: '[]' };

function _List_Cons(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons_UNUSED(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**_UNUSED/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap_UNUSED(value) { return { $: 0, a: value }; }
function _Json_unwrap_UNUSED(value) { return value.a; }

function _Json_wrap(value) { return value; }
function _Json_unwrap(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.a$,
		impl.bb,
		impl.bl,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**_UNUSED/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**/
	var node = args['node'];
	//*/
	/**_UNUSED/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS
//
// For some reason, tabs can appear in href protocols and it still works.
// So '\tjava\tSCRIPT:alert("!!!")' and 'javascript:alert("!!!")' are the same
// in practice. That is why _VirtualDom_RE_js and _VirtualDom_RE_js_html look
// so freaky.
//
// Pulling the regular expressions out to the top level gives a slight speed
// boost in small benchmarks (4-10%) but hoisting values to reduce allocation
// can be unpredictable in large programs where JIT may have a harder time with
// functions are not fully self-contained. The benefit is more that the js and
// js_html ones are so weird that I prefer to see them near each other.


var _VirtualDom_RE_script = /^script$/i;
var _VirtualDom_RE_on_formAction = /^(on|formAction$)/i;
var _VirtualDom_RE_js = /^\s*j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:/i;
var _VirtualDom_RE_js_html = /^\s*(j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:|d\s*a\s*t\s*a\s*:\s*t\s*e\s*x\s*t\s*\/\s*h\s*t\s*m\s*l\s*(,|;))/i;


function _VirtualDom_noScript(tag)
{
	return _VirtualDom_RE_script.test(tag) ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return _VirtualDom_RE_on_formAction.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'outerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return _VirtualDom_RE_js.test(value)
		? /**/''//*//**_UNUSED/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return _VirtualDom_RE_js_html.test(value)
		? /**/''//*//**_UNUSED/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlJson(value)
{
	return (
		(typeof _Json_unwrap(value) === 'string' && _VirtualDom_RE_js_html.test(_Json_unwrap(value)))
		||
		(Array.isArray(_Json_unwrap(value)) && _VirtualDom_RE_js_html.test(String(_Json_unwrap(value))))
	)
		? _Json_wrap(
			/**/''//*//**_UNUSED/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		) : value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		bd: func(record.bd),
		ar: record.ar,
		aq: record.aq
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.bd;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.ar;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.aq) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}



var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});



function _Time_now(millisToPosix)
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(millisToPosix(Date.now())));
	});
}

var _Time_setInterval = F2(function(interval, task)
{
	return _Scheduler_binding(function(callback)
	{
		var id = setInterval(function() { _Scheduler_rawSpawn(task); }, interval);
		return function() { clearInterval(id); };
	});
});

function _Time_here()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(
			A2($elm$time$Time$customZone, -(new Date().getTimezoneOffset()), _List_Nil)
		));
	});
}


function _Time_getZoneName()
{
	return _Scheduler_binding(function(callback)
	{
		try
		{
			var name = $elm$time$Time$Name(Intl.DateTimeFormat().resolvedOptions().timeZone);
		}
		catch (e)
		{
			var name = $elm$time$Time$Offset(new Date().getTimezoneOffset());
		}
		callback(_Scheduler_succeed(name));
	});
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.a$,
		impl.bb,
		impl.bl,
		function(sendToApp, initialModel) {
			var view = impl.a2;
			/**/
			var domNode = args['node'];
			//*/
			/**_UNUSED/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.a$,
		impl.bb,
		impl.bl,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.ak && impl.ak(sendToApp)
			var view = impl.a2;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.aY);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.a6) && (_VirtualDom_doc.title = title = doc.a6);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.bh;
	var onUrlRequest = impl.bi;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		ak: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.aU === next.aU
							&& curr.ax === next.ax
							&& curr.aG.a === next.aG.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		a$: function(flags)
		{
			return A3(impl.a$, flags, _Browser_getUrl(), key);
		},
		a2: impl.a2,
		bb: impl.bb,
		bl: impl.bl
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { a9: 'hidden', a7: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { a9: 'mozHidden', a7: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { a9: 'msHidden', a7: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { a9: 'webkitHidden', a7: 'webkitvisibilitychange' }
		: { a9: 'hidden', a7: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		aI: _Browser_getScene(),
		aV: {
			as: _Browser_window.pageXOffset,
			at: _Browser_window.pageYOffset,
			aJ: _Browser_doc.documentElement.clientWidth,
			aK: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		aJ: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		aK: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			aI: {
				aJ: node.scrollWidth,
				aK: node.scrollHeight
			},
			aV: {
				as: node.scrollLeft,
				at: node.scrollTop,
				aJ: node.clientWidth,
				aK: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			aI: _Browser_getScene(),
			aV: {
				as: x,
				at: y,
				aJ: _Browser_doc.documentElement.clientWidth,
				aK: _Browser_doc.documentElement.clientHeight
			},
			bc: {
				as: x + rect.left,
				at: y + rect.top,
				aJ: rect.width,
				aK: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === -2) {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (!node.$) {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Basics$EQ = 1;
var $elm$core$Basics$GT = 2;
var $elm$core$Basics$LT = 0;
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $author$project$Main$Tick = function (a) {
	return {$: 9, a: a};
};
var $elm$core$Maybe$Just = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Result$Err = function (a) {
	return {$: 1, a: a};
};
var $elm$core$Basics$False = 1;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Result$Ok = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Result$map = F2(
	function (func, ra) {
		if (!ra.$) {
			var a = ra.a;
			return $elm$core$Result$Ok(
				func(a));
		} else {
			var e = ra.a;
			return $elm$core$Result$Err(e);
		}
	});
var $elm$core$Basics$not = _Basics_not;
var $elm$core$Basics$append = _Utils_append;
var $elm$core$Maybe$Nothing = {$: 1};
var $elm$core$Result$andThen = F2(
	function (callback, result) {
		if (!result.$) {
			var value = result.a;
			return callback(value);
		} else {
			var msg = result.a;
			return $elm$core$Result$Err(msg);
		}
	});
var $elm$core$Basics$True = 0;
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$core$List$all = F2(
	function (isOkay, list) {
		return !A2(
			$elm$core$List$any,
			A2($elm$core$Basics$composeL, $elm$core$Basics$not, isOkay),
			list);
	});
var $author$project$Sutra$Ast$isValue = function (expression) {
	switch (expression.$) {
		case 0:
			return true;
		case 1:
			return true;
		case 4:
			return true;
		case 9:
			return true;
		case 2:
			var values = expression.a;
			return A2($elm$core$List$all, $author$project$Sutra$Ast$isValue, values);
		default:
			return false;
	}
};
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Array$Leaf = function (a) {
	return {$: 1, a: a};
};
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$SubTree = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.c) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.d),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.d);
		} else {
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.e) : builder.e;
			var treeLen = builder.c * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.c);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.d) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.d);
		}
	});
var $elm$core$Array$fromListHelp = F3(
	function (list, nodeList, nodeListSize) {
		fromListHelp:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, list);
			var jsArray = _v0.a;
			var remainingItems = _v0.b;
			if (_Utils_cmp(
				$elm$core$Elm$JsArray$length(jsArray),
				$elm$core$Array$branchFactor) < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					true,
					{d: jsArray, e: nodeList, c: nodeListSize});
			} else {
				var $temp$list = remainingItems,
					$temp$nodeList = A2(
					$elm$core$List$cons,
					$elm$core$Array$Leaf(jsArray),
					nodeList),
					$temp$nodeListSize = nodeListSize + 1;
				list = $temp$list;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue fromListHelp;
			}
		}
	});
var $elm$core$Array$fromList = function (list) {
	if (!list.b) {
		return $elm$core$Array$empty;
	} else {
		return A3($elm$core$Array$fromListHelp, list, _List_Nil, 0);
	}
};
var $elm$core$Result$mapError = F2(
	function (f, result) {
		if (!result.$) {
			var v = result.a;
			return $elm$core$Result$Ok(v);
		} else {
			var e = result.a;
			return $elm$core$Result$Err(
				f(e));
		}
	});
var $elm$core$Dict$RBEmpty_elm_builtin = {$: -2};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$core$Dict$Black = 1;
var $elm$core$Dict$Red = 0;
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: -1, a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === -1) && (!right.a)) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === -1) && (!left.a)) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === -1) && (!left.a)) && (left.d.$ === -1)) && (!left.d.a)) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === -2) {
			return A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1) {
				case 0:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 1:
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$String$trim = _String_trim;
var $elm$core$String$lines = _String_lines;
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$trimRight = _String_trimRight;
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $author$project$Sutra$Parser$layout = function (source) {
	var addLine = F2(
		function (_v1, result) {
			var number = _v1.a;
			var raw = _v1.b;
			return A2(
				$elm$core$Result$andThen,
				function (chunks) {
					var clean = $elm$core$String$trimRight(
						A2(
							$elm$core$Maybe$withDefault,
							'',
							$elm$core$List$head(
								A2($elm$core$String$split, '--', raw))));
					var continuation = A2($elm$core$String$startsWith, ' ', clean) || A2($elm$core$String$startsWith, '\u0009', clean);
					if ($elm$core$String$isEmpty(
						$elm$core$String$trim(clean))) {
						return $elm$core$Result$Ok(chunks);
					} else {
						if (continuation) {
							if (chunks.b) {
								var previous = chunks.a;
								var rest = chunks.b;
								return $elm$core$Result$Ok(
									A2(
										$elm$core$List$cons,
										_Utils_update(
											previous,
											{
												W: previous.W + (' ' + $elm$core$String$trim(clean))
											}),
										rest));
							} else {
								return $elm$core$Result$Err(
									'indented continuation without a definition at line ' + $elm$core$String$fromInt(number));
							}
						} else {
							return $elm$core$Result$Ok(
								A2(
									$elm$core$List$cons,
									{ai: number, W: clean},
									chunks));
						}
					}
				},
				result);
		});
	return A2(
		$elm$core$Result$map,
		$elm$core$List$reverse,
		A3(
			$elm$core$List$foldl,
			addLine,
			$elm$core$Result$Ok(_List_Nil),
			A2(
				$elm$core$List$indexedMap,
				F2(
					function (index, line) {
						return _Utils_Tuple2(index + 1, line);
					}),
				$elm$core$String$lines(source))));
};
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === -2) {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1) {
					case 0:
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 1:
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $elm$core$Dict$member = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$get, key, dict);
		if (!_v0.$) {
			return true;
		} else {
			return false;
		}
	});
var $elm$core$Basics$neq = _Utils_notEqual;
var $elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var $author$project$Sutra$Parser$spanHelp = F3(
	function (predicate, characters, found) {
		spanHelp:
		while (true) {
			if (characters.b) {
				var first = characters.a;
				var rest = characters.b;
				if (predicate(first)) {
					var $temp$predicate = predicate,
						$temp$characters = rest,
						$temp$found = A2($elm$core$List$cons, first, found);
					predicate = $temp$predicate;
					characters = $temp$characters;
					found = $temp$found;
					continue spanHelp;
				} else {
					return _Utils_Tuple2(
						$elm$core$List$reverse(found),
						characters);
				}
			} else {
				return _Utils_Tuple2(
					$elm$core$List$reverse(found),
					_List_Nil);
			}
		}
	});
var $author$project$Sutra$Parser$span = F2(
	function (predicate, characters) {
		return A3($author$project$Sutra$Parser$spanHelp, predicate, characters, _List_Nil);
	});
var $elm$core$List$takeReverse = F3(
	function (n, list, kept) {
		takeReverse:
		while (true) {
			if (n <= 0) {
				return kept;
			} else {
				if (!list.b) {
					return kept;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs,
						$temp$kept = A2($elm$core$List$cons, x, kept);
					n = $temp$n;
					list = $temp$list;
					kept = $temp$kept;
					continue takeReverse;
				}
			}
		}
	});
var $elm$core$List$takeTailRec = F2(
	function (n, list) {
		return $elm$core$List$reverse(
			A3($elm$core$List$takeReverse, n, list, _List_Nil));
	});
var $elm$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (n <= 0) {
			return _List_Nil;
		} else {
			var _v0 = _Utils_Tuple2(n, list);
			_v0$1:
			while (true) {
				_v0$5:
				while (true) {
					if (!_v0.b.b) {
						return list;
					} else {
						if (_v0.b.b.b) {
							switch (_v0.a) {
								case 1:
									break _v0$1;
								case 2:
									var _v2 = _v0.b;
									var x = _v2.a;
									var _v3 = _v2.b;
									var y = _v3.a;
									return _List_fromArray(
										[x, y]);
								case 3:
									if (_v0.b.b.b.b) {
										var _v4 = _v0.b;
										var x = _v4.a;
										var _v5 = _v4.b;
										var y = _v5.a;
										var _v6 = _v5.b;
										var z = _v6.a;
										return _List_fromArray(
											[x, y, z]);
									} else {
										break _v0$5;
									}
								default:
									if (_v0.b.b.b.b && _v0.b.b.b.b.b) {
										var _v7 = _v0.b;
										var x = _v7.a;
										var _v8 = _v7.b;
										var y = _v8.a;
										var _v9 = _v8.b;
										var z = _v9.a;
										var _v10 = _v9.b;
										var w = _v10.a;
										var tl = _v10.b;
										return (ctr > 1000) ? A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A2($elm$core$List$takeTailRec, n - 4, tl))))) : A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A3($elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
									} else {
										break _v0$5;
									}
							}
						} else {
							if (_v0.a === 1) {
								break _v0$1;
							} else {
								break _v0$5;
							}
						}
					}
				}
				return list;
			}
			var _v1 = _v0.b;
			var x = _v1.a;
			return _List_fromArray(
				[x]);
		}
	});
var $elm$core$List$take = F2(
	function (n, list) {
		return A3($elm$core$List$takeFast, 0, n, list);
	});
var $author$project$Sutra$Parser$Token = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $elm$core$List$member = F2(
	function (x, xs) {
		return A2(
			$elm$core$List$any,
			function (a) {
				return _Utils_eq(a, x);
			},
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$String$toFloat = _String_toFloat;
var $elm$core$String$cons = _String_cons;
var $elm$core$String$fromChar = function (_char) {
	return A2($elm$core$String$cons, _char, '');
};
var $elm$core$String$fromList = _String_fromList;
var $author$project$Sutra$Parser$NameToken = function (a) {
	return {$: 1, a: a};
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $author$project$Sutra$Parser$NumberToken = function (a) {
	return {$: 0, a: a};
};
var $author$project$Sutra$Parser$SymbolToken = function (a) {
	return {$: 2, a: a};
};
var $author$project$Sutra$Parser$lex = F4(
	function (row, column, characters, previous) {
		lex:
		while (true) {
			_v0$3:
			while (true) {
				if (!characters.b) {
					return $elm$core$Result$Ok(
						$elm$core$List$reverse(previous));
				} else {
					switch (characters.a) {
						case '\n':
							var rest = characters.b;
							var $temp$row = row + 1,
								$temp$column = 1,
								$temp$characters = rest,
								$temp$previous = previous;
							row = $temp$row;
							column = $temp$column;
							characters = $temp$characters;
							previous = $temp$previous;
							continue lex;
						case '-':
							if (characters.b.b && ('-' === characters.b.a)) {
								var _v1 = characters.b;
								var rest = _v1.b;
								var _v2 = A2(
									$author$project$Sutra$Parser$span,
									function (c) {
										return c !== '\n';
									},
									rest);
								var after = _v2.b;
								var $temp$row = row,
									$temp$column = column,
									$temp$characters = after,
									$temp$previous = previous;
								row = $temp$row;
								column = $temp$column;
								characters = $temp$characters;
								previous = $temp$previous;
								continue lex;
							} else {
								break _v0$3;
							}
						default:
							break _v0$3;
					}
				}
			}
			var first = characters.a;
			var rest = characters.b;
			if (A2(
				$elm$core$List$member,
				first,
				_List_fromArray(
					[' ', '\t', '\r']))) {
				var $temp$row = row,
					$temp$column = column + 1,
					$temp$characters = rest,
					$temp$previous = previous;
				row = $temp$row;
				column = $temp$column;
				characters = $temp$characters;
				previous = $temp$previous;
				continue lex;
			} else {
				if ($elm$core$Char$isDigit(first)) {
					var _v3 = A2($author$project$Sutra$Parser$span, $elm$core$Char$isDigit, characters);
					var digits = _v3.a;
					var after = _v3.b;
					var text = $elm$core$String$fromList(digits);
					var _v4 = $elm$core$String$toFloat(text);
					if (!_v4.$) {
						var number = _v4.a;
						if (number <= 9007199254740991) {
							var $temp$row = row,
								$temp$column = column + $elm$core$List$length(digits),
								$temp$characters = after,
								$temp$previous = A2(
								$elm$core$List$cons,
								A3(
									$author$project$Sutra$Parser$Token,
									$author$project$Sutra$Parser$NumberToken(number),
									row,
									column),
								previous);
							row = $temp$row;
							column = $temp$column;
							characters = $temp$characters;
							previous = $temp$previous;
							continue lex;
						} else {
							return $elm$core$Result$Err(
								'integer outside the safe 53-bit range at ' + ($elm$core$String$fromInt(row) + (':' + $elm$core$String$fromInt(column))));
						}
					} else {
						return $elm$core$Result$Err('invalid integer');
					}
				} else {
					if ($elm$core$Char$isAlpha(first) || (first === '_')) {
						var _v5 = A2(
							$author$project$Sutra$Parser$span,
							function (c) {
								return $elm$core$Char$isAlphaNum(c) || ((c === '_') || (c === '\''));
							},
							characters);
						var name = _v5.a;
						var after = _v5.b;
						var $temp$row = row,
							$temp$column = column + $elm$core$List$length(name),
							$temp$characters = after,
							$temp$previous = A2(
							$elm$core$List$cons,
							A3(
								$author$project$Sutra$Parser$Token,
								$author$project$Sutra$Parser$NameToken(
									$elm$core$String$fromList(name)),
								row,
								column),
							previous);
						row = $temp$row;
						column = $temp$column;
						characters = $temp$characters;
						previous = $temp$previous;
						continue lex;
					} else {
						var pair = $elm$core$String$fromList(
							A2($elm$core$List$take, 2, characters));
						var two = A2(
							$elm$core$List$member,
							pair,
							_List_fromArray(
								['->', '==', '/=', '<=', '>=', '&&', '||']));
						var width = two ? 2 : 1;
						var symbol = two ? pair : $elm$core$String$fromChar(first);
						if (two || A2(
							$elm$core$List$member,
							first,
							_List_fromArray(
								['+', '-', '*', '/', '%', ':', '(', ')', '[', ']', ',', '=', '\\', '<', '>']))) {
							var $temp$row = row,
								$temp$column = column + width,
								$temp$characters = A2($elm$core$List$drop, width, characters),
								$temp$previous = A2(
								$elm$core$List$cons,
								A3(
									$author$project$Sutra$Parser$Token,
									$author$project$Sutra$Parser$SymbolToken(symbol),
									row,
									column),
								previous);
							row = $temp$row;
							column = $temp$column;
							characters = $temp$characters;
							previous = $temp$previous;
							continue lex;
						} else {
							return $elm$core$Result$Err(
								'unexpected character \u0027' + ($elm$core$String$fromChar(first) + ('\u0027 at ' + ($elm$core$String$fromInt(row) + (':' + $elm$core$String$fromInt(column))))));
						}
					}
				}
			}
		}
	});
var $elm$core$String$length = _String_length;
var $elm$core$String$foldr = _String_foldr;
var $elm$core$String$toList = function (string) {
	return A3($elm$core$String$foldr, $elm$core$List$cons, _List_Nil, string);
};
var $author$project$Sutra$Parser$tokenize = function (source) {
	return ($elm$core$String$length(source) > 100000) ? $elm$core$Result$Err('source exceeds 100000 characters') : A4(
		$author$project$Sutra$Parser$lex,
		1,
		1,
		$elm$core$String$toList(source),
		_List_Nil);
};
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $author$project$Sutra$Ast$Lambda = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var $author$project$Sutra$Parser$at = F2(
	function (_v0, message) {
		var row = _v0.b;
		var column = _v0.c;
		return message + (' at ' + ($elm$core$String$fromInt(row) + (':' + $elm$core$String$fromInt(column))));
	});
var $author$project$Sutra$Parser$complete = function (_v0) {
	var value = _v0.a;
	var remaining = _v0.b;
	if (!remaining.b) {
		return $elm$core$Result$Ok(value);
	} else {
		var token = remaining.a;
		return $elm$core$Result$Err(
			A2($author$project$Sutra$Parser$at, token, 'unexpected token after expression'));
	}
};
var $author$project$Sutra$Parser$kindOf = function (_v0) {
	var kind = _v0.a;
	return kind;
};
var $elm$core$Set$member = F2(
	function (key, _v0) {
		var dict = _v0;
		return A2($elm$core$Dict$member, key, dict);
	});
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$core$Set$Set_elm_builtin = $elm$core$Basics$identity;
var $elm$core$Set$empty = $elm$core$Dict$empty;
var $elm$core$Set$insert = F2(
	function (key, _v0) {
		var dict = _v0;
		return A3($elm$core$Dict$insert, key, 0, dict);
	});
var $elm$core$Set$fromList = function (list) {
	return A3($elm$core$List$foldl, $elm$core$Set$insert, $elm$core$Set$empty, list);
};
var $author$project$Sutra$Parser$reserved = $elm$core$Set$fromList(
	_List_fromArray(
		['if', 'then', 'else', 'let', 'in']));
var $author$project$Sutra$Parser$takeName = function (tokens) {
	if (tokens.b) {
		var token = tokens.a;
		var rest = tokens.b;
		var _v1 = $author$project$Sutra$Parser$kindOf(token);
		if (_v1.$ === 1) {
			var name = _v1.a;
			return (A2($elm$core$Set$member, name, $author$project$Sutra$Parser$reserved) || ((name === 'True') || (name === 'False'))) ? $elm$core$Result$Err(
				A2($author$project$Sutra$Parser$at, token, 'expected a binding name')) : $elm$core$Result$Ok(
				_Utils_Tuple2(name, rest));
		} else {
			return $elm$core$Result$Err(
				A2($author$project$Sutra$Parser$at, token, 'expected a binding name'));
		}
	} else {
		return $elm$core$Result$Err('expected a binding name');
	}
};
var $author$project$Sutra$Ast$If = F3(
	function (a, b, c) {
		return {$: 7, a: a, b: b, c: c};
	});
var $author$project$Sutra$Ast$Let = F3(
	function (a, b, c) {
		return {$: 6, a: a, b: b, c: c};
	});
var $author$project$Sutra$Ast$Call = F2(
	function (a, b) {
		return {$: 5, a: a, b: b};
	});
var $author$project$Sutra$Ast$Binary = F3(
	function (a, b, c) {
		return {$: 8, a: a, b: b, c: c};
	});
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $author$project$Sutra$Ast$Boolean = function (a) {
	return {$: 1, a: a};
};
var $author$project$Sutra$Ast$Integer = function (a) {
	return {$: 0, a: a};
};
var $elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var $author$project$Sutra$Ast$Variable = function (a) {
	return {$: 3, a: a};
};
var $author$project$Sutra$Parser$expect = F3(
	function (wanted, label, tokens) {
		if (tokens.b) {
			var token = tokens.a;
			var rest = tokens.b;
			return _Utils_eq(
				$author$project$Sutra$Parser$kindOf(token),
				wanted) ? $elm$core$Result$Ok(rest) : $elm$core$Result$Err(
				A2($author$project$Sutra$Parser$at, token, 'expected \u0027' + (label + '\u0027')));
		} else {
			return $elm$core$Result$Err('expected \u0027' + (label + '\u0027'));
		}
	});
var $author$project$Sutra$Parser$expectName = F2(
	function (name, tokens) {
		return A3(
			$author$project$Sutra$Parser$expect,
			$author$project$Sutra$Parser$NameToken(name),
			name,
			tokens);
	});
var $author$project$Sutra$Parser$collectParameters = F3(
	function (delimiter, found, tokens) {
		if (tokens.b) {
			var token = tokens.a;
			var rest = tokens.b;
			return _Utils_eq(
				$author$project$Sutra$Parser$kindOf(token),
				$author$project$Sutra$Parser$SymbolToken(delimiter)) ? $elm$core$Result$Ok(
				_Utils_Tuple2(
					$elm$core$List$reverse(found),
					rest)) : A2(
				$elm$core$Result$andThen,
				function (_v1) {
					var name = _v1.a;
					var after = _v1.b;
					return A2($elm$core$List$member, name, found) ? $elm$core$Result$Err(
						A2($author$project$Sutra$Parser$at, token, 'duplicate parameter: ' + name)) : A3(
						$author$project$Sutra$Parser$collectParameters,
						delimiter,
						A2($elm$core$List$cons, name, found),
						after);
				},
				$author$project$Sutra$Parser$takeName(tokens));
		} else {
			return $elm$core$Result$Err('expected \u0027' + (delimiter + '\u0027'));
		}
	});
var $author$project$Sutra$Parser$parameters = F2(
	function (delimiter, tokens) {
		return A3($author$project$Sutra$Parser$collectParameters, delimiter, _List_Nil, tokens);
	});
var $author$project$Sutra$Parser$startsAtom = function (tokens) {
	if (tokens.b) {
		var _v1 = tokens.a;
		var kind = _v1.a;
		switch (kind.$) {
			case 0:
				return true;
			case 1:
				var name = kind.a;
				return !A2($elm$core$Set$member, name, $author$project$Sutra$Parser$reserved);
			default:
				var name = kind.a;
				return (name === '(') || (name === '[');
		}
	} else {
		return false;
	}
};
var $author$project$Sutra$Ast$ListLiteral = function (a) {
	return {$: 2, a: a};
};
var $author$project$Sutra$Parser$expectSymbol = F2(
	function (name, tokens) {
		return A3(
			$author$project$Sutra$Parser$expect,
			$author$project$Sutra$Parser$SymbolToken(name),
			name,
			tokens);
	});
var $author$project$Sutra$Parser$operatorInfo = function (kind) {
	if (kind.$ === 2) {
		var name = kind.a;
		return (name === '||') ? $elm$core$Maybe$Just(
			{aj: name, s: false, z: 1, B: false}) : ((name === '&&') ? $elm$core$Maybe$Just(
			{aj: name, s: false, z: 2, B: false}) : (A2(
			$elm$core$List$member,
			name,
			_List_fromArray(
				['==', '/=', '<', '<=', '>', '>='])) ? $elm$core$Maybe$Just(
			{aj: name, s: true, z: 3, B: false}) : ((name === ':') ? $elm$core$Maybe$Just(
			{aj: name, s: false, z: 4, B: true}) : (A2(
			$elm$core$List$member,
			name,
			_List_fromArray(
				['+', '-'])) ? $elm$core$Maybe$Just(
			{aj: name, s: false, z: 5, B: false}) : (A2(
			$elm$core$List$member,
			name,
			_List_fromArray(
				['*', '/', '%'])) ? $elm$core$Maybe$Just(
			{aj: name, s: false, z: 6, B: false}) : $elm$core$Maybe$Nothing)))));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$Sutra$Parser$startsComparison = function (tokens) {
	if (tokens.b) {
		var token = tokens.a;
		return A2(
			$elm$core$Maybe$withDefault,
			false,
			A2(
				$elm$core$Maybe$map,
				function ($) {
					return $.s;
				},
				$author$project$Sutra$Parser$operatorInfo(
					$author$project$Sutra$Parser$kindOf(token))));
	} else {
		return false;
	}
};
var $author$project$Sutra$Parser$atom = F2(
	function (allowNegative, tokens) {
		if (tokens.b) {
			var token = tokens.a;
			var rest = tokens.b;
			var _v26 = $author$project$Sutra$Parser$kindOf(token);
			switch (_v26.$) {
				case 0:
					var number = _v26.a;
					return $elm$core$Result$Ok(
						_Utils_Tuple2(
							$author$project$Sutra$Ast$Integer(number),
							rest));
				case 1:
					switch (_v26.a) {
						case 'True':
							return $elm$core$Result$Ok(
								_Utils_Tuple2(
									$author$project$Sutra$Ast$Boolean(true),
									rest));
						case 'False':
							return $elm$core$Result$Ok(
								_Utils_Tuple2(
									$author$project$Sutra$Ast$Boolean(false),
									rest));
						default:
							var name = _v26.a;
							return A2($elm$core$Set$member, name, $author$project$Sutra$Parser$reserved) ? $elm$core$Result$Err(
								A2($author$project$Sutra$Parser$at, token, 'expected expression, found \u0027' + (name + '\u0027'))) : $elm$core$Result$Ok(
								_Utils_Tuple2(
									$author$project$Sutra$Ast$Variable(name),
									rest));
					}
				default:
					switch (_v26.a) {
						case '-':
							if (rest.b && (!rest.a.a.$)) {
								var _v28 = rest.a;
								var number = _v28.a.a;
								var after = rest.b;
								return allowNegative ? $elm$core$Result$Ok(
									_Utils_Tuple2(
										$author$project$Sutra$Ast$Integer(-number),
										after)) : $elm$core$Result$Err(
									A2($author$project$Sutra$Parser$at, token, 'parenthesize a negative function argument'));
							} else {
								return $elm$core$Result$Err(
									A2($author$project$Sutra$Parser$at, token, 'unary minus is allowed only on an integer literal'));
							}
						case '(':
							return A2(
								$elm$core$Result$andThen,
								function (_v29) {
									var inner = _v29.a;
									var after = _v29.b;
									return A2(
										$elm$core$Result$map,
										function (remaining) {
											return _Utils_Tuple2(inner, remaining);
										},
										A2($author$project$Sutra$Parser$expectSymbol, ')', after));
								},
								$author$project$Sutra$Parser$expression(rest));
						case '[':
							return A2($author$project$Sutra$Parser$listLiteral, _List_Nil, rest);
						default:
							return $elm$core$Result$Err(
								A2($author$project$Sutra$Parser$at, token, 'expected an expression'));
					}
			}
		} else {
			return $elm$core$Result$Err('expected an expression');
		}
	});
var $author$project$Sutra$Parser$binary = F2(
	function (minimum, tokens) {
		return A2(
			$elm$core$Result$andThen,
			function (_v24) {
				var left = _v24.a;
				var remaining = _v24.b;
				return A3($author$project$Sutra$Parser$binaryTail, minimum, left, remaining);
			},
			$author$project$Sutra$Parser$operand(tokens));
	});
var $author$project$Sutra$Parser$operand = function (tokens) {
	if (tokens.b) {
		var _v14 = tokens.a;
		var kind = _v14.a;
		var rest = tokens.b;
		_v15$3:
		while (true) {
			switch (kind.$) {
				case 1:
					switch (kind.a) {
						case 'if':
							return A2(
								$elm$core$Result$andThen,
								function (_v16) {
									var condition = _v16.a;
									var afterCondition = _v16.b;
									return A2(
										$elm$core$Result$andThen,
										function (_v17) {
											var yes = _v17.a;
											var afterYes = _v17.b;
											return A2(
												$elm$core$Result$map,
												function (_v18) {
													var no = _v18.a;
													var afterNo = _v18.b;
													return _Utils_Tuple2(
														A3($author$project$Sutra$Ast$If, condition, yes, no),
														afterNo);
												},
												A2(
													$elm$core$Result$andThen,
													$author$project$Sutra$Parser$expression,
													A2($author$project$Sutra$Parser$expectName, 'else', afterYes)));
										},
										A2(
											$elm$core$Result$andThen,
											$author$project$Sutra$Parser$expression,
											A2($author$project$Sutra$Parser$expectName, 'then', afterCondition)));
								},
								$author$project$Sutra$Parser$expression(rest));
						case 'let':
							return A2(
								$elm$core$Result$andThen,
								function (_v19) {
									var name = _v19.a;
									var afterName = _v19.b;
									return A2(
										$elm$core$Result$andThen,
										function (_v20) {
											var value = _v20.a;
											var afterValue = _v20.b;
											return A2(
												$elm$core$Result$map,
												function (_v21) {
													var body = _v21.a;
													var afterBody = _v21.b;
													return _Utils_Tuple2(
														A3($author$project$Sutra$Ast$Let, name, value, body),
														afterBody);
												},
												A2(
													$elm$core$Result$andThen,
													$author$project$Sutra$Parser$expression,
													A2($author$project$Sutra$Parser$expectName, 'in', afterValue)));
										},
										A2(
											$elm$core$Result$andThen,
											$author$project$Sutra$Parser$expression,
											A2($author$project$Sutra$Parser$expectSymbol, '=', afterName)));
								},
								$author$project$Sutra$Parser$takeName(rest));
						default:
							break _v15$3;
					}
				case 2:
					if (kind.a === '\u005C') {
						return A2(
							$elm$core$Result$andThen,
							function (_v22) {
								var _arguments = _v22.a;
								var bodyTokens = _v22.b;
								return $elm$core$List$isEmpty(_arguments) ? $elm$core$Result$Err('a lambda needs at least one parameter') : A2(
									$elm$core$Result$map,
									function (_v23) {
										var body = _v23.a;
										var remaining = _v23.b;
										return _Utils_Tuple2(
											A3($elm$core$List$foldr, $author$project$Sutra$Ast$Lambda, body, _arguments),
											remaining);
									},
									$author$project$Sutra$Parser$expression(bodyTokens));
							},
							A2($author$project$Sutra$Parser$parameters, '->', rest));
					} else {
						break _v15$3;
					}
				default:
					break _v15$3;
			}
		}
		return $author$project$Sutra$Parser$application(tokens);
	} else {
		return $elm$core$Result$Err('expected an expression');
	}
};
var $author$project$Sutra$Parser$binaryTail = F3(
	function (minimum, left, tokens) {
		if (tokens.b) {
			var token = tokens.a;
			var rest = tokens.b;
			var _v11 = $author$project$Sutra$Parser$operatorInfo(
				$author$project$Sutra$Parser$kindOf(token));
			if (!_v11.$) {
				var info = _v11.a;
				var rightAssociative = info.B;
				var precedence = info.z;
				var comparison = info.s;
				var name = info.aj;
				return (_Utils_cmp(precedence, minimum) < 0) ? $elm$core$Result$Ok(
					_Utils_Tuple2(left, tokens)) : A2(
					$elm$core$Result$andThen,
					function (_v12) {
						var right = _v12.a;
						var after = _v12.b;
						return (comparison && $author$project$Sutra$Parser$startsComparison(after)) ? $elm$core$Result$Err(
							A2($author$project$Sutra$Parser$at, token, 'comparisons are non-associative; use parentheses')) : A3(
							$author$project$Sutra$Parser$binaryTail,
							minimum,
							A3($author$project$Sutra$Ast$Binary, name, left, right),
							after);
					},
					A2(
						$author$project$Sutra$Parser$binary,
						rightAssociative ? precedence : (precedence + 1),
						rest));
			} else {
				return $elm$core$Result$Ok(
					_Utils_Tuple2(left, tokens));
			}
		} else {
			return $elm$core$Result$Ok(
				_Utils_Tuple2(left, _List_Nil));
		}
	});
var $author$project$Sutra$Parser$expression = function (tokens) {
	return A2($author$project$Sutra$Parser$binary, 1, tokens);
};
var $author$project$Sutra$Parser$application = function (tokens) {
	return A2(
		$elm$core$Result$andThen,
		function (_v9) {
			var first = _v9.a;
			var rest = _v9.b;
			return A2($author$project$Sutra$Parser$applicationTail, first, rest);
		},
		A2($author$project$Sutra$Parser$atom, true, tokens));
};
var $author$project$Sutra$Parser$listLiteral = F2(
	function (previous, tokens) {
		if ((tokens.b && (tokens.a.a.$ === 2)) && (tokens.a.a.a === ']')) {
			var _v2 = tokens.a;
			var rest = tokens.b;
			return $elm$core$Result$Ok(
				_Utils_Tuple2(
					$author$project$Sutra$Ast$ListLiteral(
						$elm$core$List$reverse(previous)),
					rest));
		} else {
			return A2(
				$elm$core$Result$andThen,
				function (_v3) {
					var value = _v3.a;
					var remaining = _v3.b;
					_v4$2:
					while (true) {
						if (remaining.b) {
							if (remaining.a.a.$ === 2) {
								switch (remaining.a.a.a) {
									case ']':
										var _v5 = remaining.a;
										var rest = remaining.b;
										return $elm$core$Result$Ok(
											_Utils_Tuple2(
												$author$project$Sutra$Ast$ListLiteral(
													$elm$core$List$reverse(
														A2($elm$core$List$cons, value, previous))),
												rest));
									case ',':
										var _v6 = remaining.a;
										var rest = remaining.b;
										if ((rest.b && (rest.a.a.$ === 2)) && (rest.a.a.a === ']')) {
											var _v8 = rest.a;
											return $elm$core$Result$Err('trailing list comma is not allowed');
										} else {
											return A2(
												$author$project$Sutra$Parser$listLiteral,
												A2($elm$core$List$cons, value, previous),
												rest);
										}
									default:
										break _v4$2;
								}
							} else {
								break _v4$2;
							}
						} else {
							return $elm$core$Result$Err('expected \u0027]\u0027');
						}
					}
					var token = remaining.a;
					return $elm$core$Result$Err(
						A2($author$project$Sutra$Parser$at, token, 'expected \u0027,\u0027 or \u0027]\u0027 in a list'));
				},
				$author$project$Sutra$Parser$expression(tokens));
		}
	});
var $author$project$Sutra$Parser$applicationTail = F2(
	function (_function, tokens) {
		return $author$project$Sutra$Parser$startsAtom(tokens) ? A2(
			$elm$core$Result$andThen,
			function (_v0) {
				var argument = _v0.a;
				var rest = _v0.b;
				return A2(
					$author$project$Sutra$Parser$applicationTail,
					A2($author$project$Sutra$Ast$Call, _function, argument),
					rest);
			},
			A2($author$project$Sutra$Parser$atom, false, tokens)) : $elm$core$Result$Ok(
			_Utils_Tuple2(_function, tokens));
	});
var $author$project$Sutra$Parser$definition = function (tokens) {
	return A2(
		$elm$core$Result$andThen,
		function (_v0) {
			var name = _v0.a;
			var remaining = _v0.b;
			return A2(
				$elm$core$Result$andThen,
				function (_v1) {
					var _arguments = _v1.a;
					var bodyTokens = _v1.b;
					return A2(
						$elm$core$Result$map,
						function (body) {
							return _Utils_Tuple2(
								name,
								A3($elm$core$List$foldr, $author$project$Sutra$Ast$Lambda, body, _arguments));
						},
						A2(
							$elm$core$Result$andThen,
							$author$project$Sutra$Parser$complete,
							$author$project$Sutra$Parser$expression(bodyTokens)));
				},
				A2($author$project$Sutra$Parser$parameters, '=', remaining));
		},
		$author$project$Sutra$Parser$takeName(tokens));
};
var $author$project$Sutra$Parser$parseProgram = function (source) {
	return A2(
		$elm$core$Result$andThen,
		A2(
			$elm$core$List$foldl,
			F2(
				function (chunk, result) {
					return A2(
						$elm$core$Result$andThen,
						function (definitions) {
							return A2(
								$elm$core$Result$mapError,
								function (message) {
									return 'definition at line ' + ($elm$core$String$fromInt(chunk.ai) + (': ' + message));
								},
								A2(
									$elm$core$Result$andThen,
									function (_v0) {
										var name = _v0.a;
										var body = _v0.b;
										return A2($elm$core$Dict$member, name, definitions) ? $elm$core$Result$Err('duplicate definition: ' + name) : $elm$core$Result$Ok(
											A3($elm$core$Dict$insert, name, body, definitions));
									},
									A2(
										$elm$core$Result$andThen,
										$author$project$Sutra$Parser$definition,
										$author$project$Sutra$Parser$tokenize(chunk.W))));
						},
						result);
				}),
			$elm$core$Result$Ok($elm$core$Dict$empty)),
		$author$project$Sutra$Parser$layout(source));
};
var $author$project$Sutra$Parser$parseExpression = function (source) {
	return A2(
		$elm$core$Result$andThen,
		$author$project$Sutra$Parser$complete,
		A2(
			$elm$core$Result$andThen,
			$author$project$Sutra$Parser$expression,
			$author$project$Sutra$Parser$tokenize(source)));
};
var $author$project$Sutra$Session$start = F3(
	function (limit, source, expressionSource) {
		return ((limit < 0) || (limit > 10000)) ? $elm$core$Result$Err('input_error: enter a step limit from 0 to 10000') : A2(
			$elm$core$Result$andThen,
			function (program) {
				return A2(
					$elm$core$Result$map,
					function (expression) {
						return {
							K: limit,
							a8: 0,
							E: $elm$core$Array$fromList(
								_List_fromArray(
									[
										{
										a1: $elm$core$Maybe$Nothing,
										v: ((!limit) && (!$author$project$Sutra$Ast$isValue(expression))) ? $elm$core$Maybe$Just('step_limit') : $elm$core$Maybe$Nothing,
										a4: $elm$core$Maybe$Nothing,
										a5: 0,
										be: $elm$core$Maybe$Nothing,
										h: expression,
										Q: _List_Nil,
										t: _List_Nil,
										R: $elm$core$Maybe$Nothing
									}
									])),
							m: program
						};
					},
					A2(
						$elm$core$Result$mapError,
						$elm$core$Basics$append('parse_error: expression: '),
						$author$project$Sutra$Parser$parseExpression(expressionSource)));
			},
			A2(
				$elm$core$Result$mapError,
				$elm$core$Basics$append('parse_error: program: '),
				$author$project$Sutra$Parser$parseProgram(source)));
	});
var $elm$core$String$toInt = _String_toInt;
var $author$project$Main$load = function (model) {
	var parsed = function () {
		var _v1 = $elm$core$String$toInt(model.K);
		if (!_v1.$) {
			var limit = _v1.a;
			return A3($author$project$Sutra$Session$start, limit, model.m, model.h);
		} else {
			return $elm$core$Result$Err('input_error: enter a step limit from 0 to 10000');
		}
	}();
	if (!parsed.$) {
		var session = parsed.a;
		return _Utils_update(
			model,
			{
				v: $elm$core$Maybe$Nothing,
				a: false,
				f: $elm$core$Maybe$Just(session)
			});
	} else {
		var error = parsed.a;
		return _Utils_update(
			model,
			{
				v: $elm$core$Maybe$Just(error),
				a: false,
				f: $elm$core$Maybe$Nothing
			});
	}
};
var $elm$core$Result$isOk = function (result) {
	if (!result.$) {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 2, a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{d: tail, e: nodeList, c: (len / $elm$core$Array$branchFactor) | 0});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$String$all = _String_all;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\u000A    ',
		A2($elm$core$String$split, '\u000A', str));
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\u000A\u000A(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 0:
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 1) {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\u0027' + (f + '\u0027]'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 1:
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 2:
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\u000A\u000A',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\u000A\u000A';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\u000A\u000A    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\u000A\u000A' + msg));
			}
		}
	});
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $author$project$Sutra$Examples$first = {ab: 'map', aj: 'Map · double each number', m: '-- A small function, applied to every cell.\u000Adouble x = x * 2', h: 'map double [1, 2, 3, 4]', bg: 'Apply a function to each cell, one at a time.'};
var $author$project$Sutra$Showcase$Data = F2(
	function (entries, isSample) {
		return {M: entries, an: isSample};
	});
var $elm$json$Json$Decode$bool = _Json_decodeBool;
var $elm$json$Json$Decode$list = _Json_decodeList;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$decodeValue = _Json_run;
var $elm$json$Json$Decode$map4 = _Json_map4;
var $author$project$Sutra$Showcase$Entry = F4(
	function (task, expr, expect, answers) {
		return {a_: expr, ac: task, L: expect, af: answers};
	});
var $elm$json$Json$Decode$string = _Json_decodeString;
var $elm$json$Json$Decode$fail = _Json_fail;
var $elm$json$Json$Decode$map3 = _Json_map3;
var $author$project$Sutra$Showcase$Answer = F3(
	function (model, program, verdict) {
		return {ae: model, m: program, _: verdict};
	});
var $elm$json$Json$Decode$andThen = _Json_andThen;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $author$project$Sutra$Showcase$answerDecoder = A4(
	$elm$json$Json$Decode$map3,
	$author$project$Sutra$Showcase$Answer,
	A2($elm$json$Json$Decode$field, 'model', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'program', $elm$json$Json$Decode$string),
	A2(
		$elm$json$Json$Decode$field,
		'verdict',
		A2(
			$elm$json$Json$Decode$andThen,
			function (verdict) {
				return A2(
					$elm$core$List$member,
					verdict,
					_List_fromArray(
						['pass', 'parse_error', 'unbound', 'type_error', 'runtime_error', 'step_limit', 'wrong_answer'])) ? $elm$json$Json$Decode$succeed(verdict) : $elm$json$Json$Decode$fail('Unknown verdict: ' + verdict);
			},
			$elm$json$Json$Decode$string)));
var $author$project$Sutra$Showcase$entryDecoder = A5(
	$elm$json$Json$Decode$map4,
	$author$project$Sutra$Showcase$Entry,
	A2($elm$json$Json$Decode$field, 'task', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'expr', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'expect', $elm$json$Json$Decode$string),
	A2(
		$elm$json$Json$Decode$field,
		'answers',
		$elm$json$Json$Decode$list($author$project$Sutra$Showcase$answerDecoder)));
var $author$project$Sutra$Showcase$decode = function (value) {
	return A2(
		$elm$core$Result$mapError,
		$elm$json$Json$Decode$errorToString,
		A2(
			$elm$json$Json$Decode$decodeValue,
			A3(
				$elm$json$Json$Decode$map2,
				$author$project$Sutra$Showcase$Data,
				A2(
					$elm$json$Json$Decode$field,
					'entries',
					$elm$json$Json$Decode$list($author$project$Sutra$Showcase$entryDecoder)),
				A2($elm$json$Json$Decode$field, 'isSample', $elm$json$Json$Decode$bool)),
			value));
};
var $author$project$Sutra$Showcase$empty = {M: _List_Nil, an: false};
var $author$project$Main$Playground = 0;
var $author$project$Main$exampleModel = function (example) {
	return {q: 0, v: $elm$core$Maybe$Nothing, K: '10000', n: example.ab, a: false, m: example.m, f: $elm$core$Maybe$Nothing, x: 220, N: $author$project$Sutra$Showcase$empty, h: example.h, aa: 0, A: $elm$core$Maybe$Nothing, ah: $elm$core$Maybe$Nothing};
};
var $author$project$Main$init = function (flags) {
	var initial = $author$project$Main$exampleModel($author$project$Sutra$Examples$first);
	var loaded = function () {
		var _v0 = $author$project$Sutra$Showcase$decode(flags);
		if (!_v0.$) {
			var data = _v0.a;
			return _Utils_update(
				initial,
				{N: data});
		} else {
			var error = _v0.a;
			return _Utils_update(
				initial,
				{
					ah: $elm$core$Maybe$Just(error)
				});
		}
	}();
	return _Utils_Tuple2(
		$author$project$Main$load(loaded),
		$elm$core$Platform$Cmd$none);
};
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$core$Platform$Sub$none = $elm$core$Platform$Sub$batch(_List_Nil);
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 0:
			return 0;
		case 1:
			return 1;
		case 2:
			return 2;
		default:
			return 3;
	}
};
var $elm$html$Html$p = _VirtualDom_node('p');
var $elm$html$Html$br = _VirtualDom_node('br');
var $elm$html$Html$h1 = _VirtualDom_node('h1');
var $elm$html$Html$h2 = _VirtualDom_node('h2');
var $elm$html$Html$div = _VirtualDom_node('div');
var $elm$html$Html$code = _VirtualDom_node('code');
var $elm$html$Html$span = _VirtualDom_node('span');
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $elm$html$Html$h3 = _VirtualDom_node('h3');
var $elm$json$Json$Encode$string = _Json_wrap;
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$id = $elm$html$Html$Attributes$stringProperty('id');
var $elm$html$Html$Attributes$for = $elm$html$Html$Attributes$stringProperty('htmlFor');
var $elm$html$Html$pre = _VirtualDom_node('pre');
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $elm$html$Html$label = _VirtualDom_node('label');
var $elm$html$Html$Attributes$title = $elm$html$Html$Attributes$stringProperty('title');
var $elm$html$Html$Attributes$type_ = $elm$html$Html$Attributes$stringProperty('type');
var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty('value');
var $elm$html$Html$button = _VirtualDom_node('button');
var $elm$html$Html$option = _VirtualDom_node('option');
var $elm$html$Html$select = _VirtualDom_node('select');
var $author$project$Sutra$Showcase$at = F2(
	function (index, items) {
		return (index < 0) ? $elm$core$Maybe$Nothing : $elm$core$List$head(
			A2($elm$core$List$drop, index, items));
	});
var $author$project$Sutra$Showcase$entryAt = F2(
	function (index, data) {
		return A2($author$project$Sutra$Showcase$at, index, data.M);
	});
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 0, a: a};
};
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $elm$html$Html$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 1, a: a};
};
var $elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			$elm$json$Json$Decode$map,
			$elm$html$Html$Events$alwaysStop,
			A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetValue)));
};
var $elm$html$Html$section = _VirtualDom_node('section');
var $elm$json$Json$Encode$bool = _Json_wrap;
var $elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$bool(bool));
	});
var $elm$html$Html$Attributes$selected = $elm$html$Html$Attributes$boolProperty('selected');
var $elm$virtual_dom$VirtualDom$attribute = F2(
	function (key, value) {
		return A2(
			_VirtualDom_attribute,
			_VirtualDom_noOnOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $elm$html$Html$Attributes$attribute = $elm$virtual_dom$VirtualDom$attribute;
var $author$project$Sutra$Showcase$verdictLabel = function (verdict) {
	switch (verdict) {
		case 'pass':
			return 'Pass';
		case 'parse_error':
			return 'Parse error';
		case 'unbound':
			return 'Unbound name';
		case 'type_error':
			return 'Type error';
		case 'runtime_error':
			return 'Runtime error';
		case 'step_limit':
			return 'Step limit';
		case 'wrong_answer':
			return 'Wrong answer';
		default:
			return verdict;
	}
};
var $author$project$Sutra$Showcase$view = F4(
	function (choose, inspect, selected, data) {
		return A2(
			$elm$html$Html$section,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('panel showcase-panel'),
					A2($elm$html$Html$Attributes$attribute, 'aria-label', 'Model answers')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('panel-heading')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('section-title')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$span,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('03')
										])),
									A2(
									$elm$html$Html$h2,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Model answers')
										]))
								])),
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('language-tag')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(
									$elm$core$String$fromInt(
										$elm$core$List$length(data.M)) + ' TASKS')
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('showcase-body')
						]),
					_List_fromArray(
						[
							data.an ? A2(
							$elm$html$Html$p,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('sample-notice'),
									A2($elm$html$Html$Attributes$attribute, 'data-testid', 'sample-notice')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$span,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Sample data')
										])),
									$elm$html$Html$text(' — illustrative programs, not model results. These two tasks will be replaced with the real showcase.')
								])) : $elm$html$Html$text(''),
							$elm$core$List$isEmpty(data.M) ? A2(
							$elm$html$Html$p,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('showcase-empty')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('No model answers yet. Add tasks to assets/showcase.json and rebuild the showcase.')
								])) : A2(
							$elm$html$Html$div,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$elm$html$Html$label,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$for('showcase-task'),
											$elm$html$Html$Attributes$class('field-label')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('CHOOSE AN EVAL TASK')
										])),
									A2(
									$elm$html$Html$select,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$id('showcase-task'),
											$elm$html$Html$Attributes$class('example-picker'),
											A2($elm$html$Html$Attributes$attribute, 'aria-label', 'Showcase task'),
											$elm$html$Html$Attributes$value(
											$elm$core$String$fromInt(selected)),
											$elm$html$Html$Events$onInput(choose)
										]),
									A2(
										$elm$core$List$indexedMap,
										F2(
											function (index, entry) {
												return A2(
													$elm$html$Html$option,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$value(
															$elm$core$String$fromInt(index)),
															$elm$html$Html$Attributes$selected(
															_Utils_eq(index, selected))
														]),
													_List_fromArray(
														[
															$elm$html$Html$text(entry.ac)
														]));
											}),
										data.M)),
									function () {
									var _v0 = A2($author$project$Sutra$Showcase$entryAt, selected, data);
									if (_v0.$ === 1) {
										return $elm$html$Html$text('');
									} else {
										var entry = _v0.a;
										return A2(
											$elm$html$Html$div,
											_List_Nil,
											_List_fromArray(
												[
													A2(
													$elm$html$Html$div,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('task-detail')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$h3,
															_List_Nil,
															_List_fromArray(
																[
																	$elm$html$Html$text(entry.ac)
																])),
															A2(
															$elm$html$Html$div,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('task-examples')
																]),
															_List_fromArray(
																[
																	A2(
																	$elm$html$Html$div,
																	_List_Nil,
																	_List_fromArray(
																		[
																			A2(
																			$elm$html$Html$span,
																			_List_fromArray(
																				[
																					$elm$html$Html$Attributes$class('field-label')
																				]),
																			_List_fromArray(
																				[
																					$elm$html$Html$text('EXPRESSION')
																				])),
																			A2(
																			$elm$html$Html$code,
																			_List_fromArray(
																				[
																					A2($elm$html$Html$Attributes$attribute, 'data-testid', 'showcase-expression')
																				]),
																			_List_fromArray(
																				[
																					$elm$html$Html$text(entry.a_)
																				]))
																		])),
																	A2(
																	$elm$html$Html$div,
																	_List_Nil,
																	_List_fromArray(
																		[
																			A2(
																			$elm$html$Html$span,
																			_List_fromArray(
																				[
																					$elm$html$Html$Attributes$class('field-label')
																				]),
																			_List_fromArray(
																				[
																					$elm$html$Html$text('EXPECTED VALUE')
																				])),
																			A2(
																			$elm$html$Html$code,
																			_List_fromArray(
																				[
																					A2($elm$html$Html$Attributes$attribute, 'data-testid', 'showcase-expected')
																				]),
																			_List_fromArray(
																				[
																					$elm$html$Html$text(entry.L)
																				]))
																		]))
																]))
														])),
													A2(
													$elm$html$Html$p,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('showcase-copy')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Compare the supplied answers, then inspect any program one reduction at a time. Reported verdicts come from the supplied data; playback evaluates only the expression above.')
														])),
													$elm$core$List$isEmpty(entry.af) ? A2(
													$elm$html$Html$p,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('showcase-empty')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('This task has no model answers yet.')
														])) : A2(
													$elm$html$Html$div,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('model-grid')
														]),
													A2(
														$elm$core$List$indexedMap,
														F2(
															function (index, answer) {
																return A2(
																	$elm$html$Html$section,
																	_List_fromArray(
																		[
																			$elm$html$Html$Attributes$class('model-card'),
																			A2($elm$html$Html$Attributes$attribute, 'aria-label', answer.ae + ' answer'),
																			A2($elm$html$Html$Attributes$attribute, 'data-testid', 'model-card')
																		]),
																	_List_fromArray(
																		[
																			A2(
																			$elm$html$Html$div,
																			_List_fromArray(
																				[
																					$elm$html$Html$Attributes$class('model-card-heading')
																				]),
																			_List_fromArray(
																				[
																					A2(
																					$elm$html$Html$h3,
																					_List_Nil,
																					_List_fromArray(
																						[
																							$elm$html$Html$text(answer.ae)
																						])),
																					A2(
																					$elm$html$Html$span,
																					_List_fromArray(
																						[
																							$elm$html$Html$Attributes$class('verdict-badge verdict-' + answer._),
																							A2($elm$html$Html$Attributes$attribute, 'data-verdict', answer._),
																							$elm$html$Html$Attributes$title('Reported verdict')
																						]),
																					_List_fromArray(
																						[
																							$elm$html$Html$text(
																							$author$project$Sutra$Showcase$verdictLabel(answer._))
																						]))
																				])),
																			A2(
																			$elm$html$Html$p,
																			_List_fromArray(
																				[
																					$elm$html$Html$Attributes$class('field-label verdict-caption')
																				]),
																			_List_fromArray(
																				[
																					$elm$html$Html$text('REPORTED VERDICT')
																				])),
																			A2(
																			$elm$html$Html$pre,
																			_List_fromArray(
																				[
																					$elm$html$Html$Attributes$class('model-source')
																				]),
																			_List_fromArray(
																				[
																					A2(
																					$elm$html$Html$code,
																					_List_Nil,
																					_List_fromArray(
																						[
																							$elm$html$Html$text(answer.m)
																						]))
																				])),
																			$elm$core$String$isEmpty(answer.m) ? A2(
																			$elm$html$Html$p,
																			_List_fromArray(
																				[
																					$elm$html$Html$Attributes$class('empty-program')
																				]),
																			_List_fromArray(
																				[
																					$elm$html$Html$text('Empty program')
																				])) : $elm$html$Html$text(''),
																			A2(
																			$elm$html$Html$button,
																			_List_fromArray(
																				[
																					$elm$html$Html$Attributes$type_('button'),
																					$elm$html$Html$Attributes$class('control-button button-primary inspect-answer'),
																					A2($elm$html$Html$Attributes$attribute, 'aria-label', 'Inspect ' + answer.ae),
																					$elm$html$Html$Events$onClick(
																					A2(inspect, selected, index))
																				]),
																			_List_fromArray(
																				[
																					$elm$html$Html$text('Step through this answer'),
																					A2(
																					$elm$html$Html$span,
																					_List_fromArray(
																						[
																							A2($elm$html$Html$Attributes$attribute, 'aria-hidden', 'true')
																						]),
																					_List_fromArray(
																						[
																							$elm$html$Html$text('→')
																						]))
																				]))
																		]));
															}),
														entry.af))
												]));
									}
								}()
								]))
						]))
				]));
	});
var $elm$html$Html$main_ = _VirtualDom_node('main');
var $elm$html$Html$footer = _VirtualDom_node('footer');
var $elm$html$Html$header = _VirtualDom_node('header');
var $author$project$Main$ChooseTask = function (a) {
	return {$: 11, a: a};
};
var $author$project$Sutra$Examples$all = _List_fromArray(
	[
		$author$project$Sutra$Examples$first,
		{ab: 'filter', aj: 'Filter · keep even numbers', m: 'isEven x = x % 2 == 0', h: 'filter isEven [1, 2, 3, 4, 5, 6]', bg: 'Test each cell and keep the ones that match.'},
		{ab: 'foldl', aj: 'Fold left · build a sum', m: 'add acc x = acc + x', h: 'foldl add 0 [1, 2, 3, 4]', bg: 'Carry an accumulator from the leftmost cell to the right.'},
		{ab: 'foldr', aj: 'Fold right · rebuild a list', m: 'prepend x acc = x : acc', h: 'foldr prepend [] [1, 2, 3, 4]', bg: 'Unfold the list, then combine cells from right to left.'},
		{ab: 'factorial', aj: 'Recursion · factorial', m: 'fact n =\u000A    if n <= 1 then 1\u000A    else n * fact (n - 1)', h: 'fact 5', bg: 'Follow a recursive definition down to its base case and back.'},
		{ab: 'let', aj: 'Let · a local binding', m: '-- This expression needs no top-level definitions.', h: 'let doubled = 3 * 2 in doubled + 1', bg: 'Evaluate a local value, substitute it, and keep reducing.'}
	]);
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$html$Html$Attributes$max = $elm$html$Html$Attributes$stringProperty('max');
var $elm$html$Html$Attributes$min = $elm$html$Html$Attributes$stringProperty('min');
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $author$project$Sutra$Examples$find = function (key) {
	return $elm$core$List$head(
		A2(
			$elm$core$List$filter,
			function (example) {
				return _Utils_eq(example.ab, key);
			},
			$author$project$Sutra$Examples$all));
};
var $elm$html$Html$Attributes$rows = function (n) {
	return A2(
		_VirtualDom_attribute,
		'rows',
		$elm$core$String$fromInt(n));
};
var $elm$html$Html$Attributes$step = function (n) {
	return A2($elm$html$Html$Attributes$stringProperty, 'step', n);
};
var $elm$html$Html$input = _VirtualDom_node('input');
var $elm$html$Html$Attributes$disabled = $elm$html$Html$Attributes$boolProperty('disabled');
var $elm$html$Html$textarea = _VirtualDom_node('textarea');
var $author$project$Main$EditLimit = function (a) {
	return {$: 3, a: a};
};
var $elm$html$Html$Attributes$spellcheck = $elm$html$Html$Attributes$boolProperty('spellcheck');
var $author$project$Main$EditProgram = function (a) {
	return {$: 0, a: a};
};
var $author$project$Main$ChooseExample = function (a) {
	return {$: 2, a: a};
};
var $author$project$Main$EditExpression = function (a) {
	return {$: 1, a: a};
};
var $author$project$Main$viewEditor = function (model) {
	return A2(
		$elm$html$Html$section,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('panel editor-panel'),
				A2($elm$html$Html$Attributes$attribute, 'aria-label', 'Program editor')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('panel-heading')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('section-title')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$span,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('01')
									])),
								A2(
								$elm$html$Html$h2,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('The program')
									]))
							])),
						A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('language-tag')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('SUTRA')
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('editor-body')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$label,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$for('example-picker'),
								$elm$html$Html$Attributes$class('field-label')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('START WITH AN EXAMPLE')
							])),
						A2(
						$elm$html$Html$select,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$id('example-picker'),
								$elm$html$Html$Attributes$class('example-picker'),
								$elm$html$Html$Attributes$value(model.n),
								$elm$html$Html$Events$onInput($author$project$Main$ChooseExample),
								A2($elm$html$Html$Attributes$attribute, 'aria-label', 'Example program')
							]),
						A2(
							$elm$core$List$cons,
							A2(
								$elm$html$Html$option,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$value('custom'),
										$elm$html$Html$Attributes$disabled(true),
										$elm$html$Html$Attributes$selected(model.n === 'custom')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Custom program')
									])),
							A2(
								$elm$core$List$map,
								function (example) {
									return A2(
										$elm$html$Html$option,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value(example.ab),
												$elm$html$Html$Attributes$selected(
												_Utils_eq(model.n, example.ab))
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(example.aj)
											]));
								},
								$author$project$Sutra$Examples$all))),
						A2(
						$elm$html$Html$p,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('example-description')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								A2(
									$elm$core$Maybe$withDefault,
									'Your own definitions and expression. Step or Run to begin.',
									A2(
										$elm$core$Maybe$map,
										function ($) {
											return $.bg;
										},
										$author$project$Sutra$Examples$find(model.n))))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('field-heading')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$label,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$for('program-source'),
										$elm$html$Html$Attributes$class('field-label')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('DEFINITIONS')
									])),
								A2(
								$elm$html$Html$span,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('editable')
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('code-editor')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('editor-gutter'),
										A2($elm$html$Html$Attributes$attribute, 'aria-hidden', 'true')
									]),
								A2(
									$elm$core$List$map,
									function (number) {
										return A2(
											$elm$html$Html$div,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text(
													$elm$core$String$fromInt(number))
												]));
									},
									A2(
										$elm$core$List$range,
										1,
										A2(
											$elm$core$Basics$max,
											8,
											$elm$core$List$length(
												$elm$core$String$lines(model.m)))))),
								A2(
								$elm$html$Html$textarea,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$id('program-source'),
										$elm$html$Html$Attributes$value(model.m),
										$elm$html$Html$Events$onInput($author$project$Main$EditProgram),
										$elm$html$Html$Attributes$rows(8),
										$elm$html$Html$Attributes$spellcheck(false),
										A2($elm$html$Html$Attributes$attribute, 'aria-label', 'Program'),
										A2($elm$html$Html$Attributes$attribute, 'autocapitalize', 'off'),
										A2($elm$html$Html$Attributes$attribute, 'autocomplete', 'off')
									]),
								_List_Nil)
							])),
						A2(
						$elm$html$Html$label,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$for('expression-source'),
								$elm$html$Html$Attributes$class('field-label expression-label')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('EXPRESSION TO EVALUATE')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('expression-input-wrap')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$span,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$attribute, 'aria-hidden', 'true')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('›')
									])),
								A2(
								$elm$html$Html$input,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$id('expression-source'),
										$elm$html$Html$Attributes$value(model.h),
										$elm$html$Html$Events$onInput($author$project$Main$EditExpression),
										$elm$html$Html$Attributes$spellcheck(false),
										A2($elm$html$Html$Attributes$attribute, 'aria-label', 'Expression'),
										A2($elm$html$Html$Attributes$attribute, 'autocapitalize', 'off')
									]),
								_List_Nil)
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('editor-settings')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$label,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$for('step-limit')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Step limit')
									])),
								A2(
								$elm$html$Html$input,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$id('step-limit'),
										$elm$html$Html$Attributes$type_('number'),
										$elm$html$Html$Attributes$min('0'),
										$elm$html$Html$Attributes$max('10000'),
										$elm$html$Html$Attributes$step('1'),
										$elm$html$Html$Attributes$value(model.K),
										$elm$html$Html$Events$onInput($author$project$Main$EditLimit),
										A2($elm$html$Html$Attributes$attribute, 'aria-label', 'Maximum steps')
									]),
								_List_Nil),
								A2(
								$elm$html$Html$span,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('up to 10,000')
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('language-note')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$span,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$attribute, 'aria-hidden', 'true')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('↳')
									])),
								A2(
								$elm$html$Html$p,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Numbers, lists, lambdas, local bindings, and recursion. Small pieces; interesting behavior.')
									]))
							]))
					]))
			]));
};
var $author$project$Main$ShowPage = function (a) {
	return {$: 10, a: a};
};
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $elm$html$Html$Attributes$classList = function (classes) {
	return $elm$html$Html$Attributes$class(
		A2(
			$elm$core$String$join,
			' ',
			A2(
				$elm$core$List$map,
				$elm$core$Tuple$first,
				A2($elm$core$List$filter, $elm$core$Tuple$second, classes))));
};
var $author$project$Main$viewSwitch = F3(
	function (current, target, name) {
		return A2(
			$elm$html$Html$button,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$type_('button'),
					$elm$html$Html$Attributes$classList(
					_List_fromArray(
						[
							_Utils_Tuple2('view-button', true),
							_Utils_Tuple2(
							'is-selected',
							_Utils_eq(current, target))
						])),
					A2(
					$elm$html$Html$Attributes$attribute,
					'aria-pressed',
					_Utils_eq(current, target) ? 'true' : 'false'),
					$elm$html$Html$Events$onClick(
					$author$project$Main$ShowPage(target))
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(name)
				]));
	});
var $author$project$Main$ModelAnswers = 1;
var $author$project$Main$InspectAnswer = F2(
	function (a, b) {
		return {$: 12, a: a, b: b};
	});
var $elm$html$Html$kbd = _VirtualDom_node('kbd');
var $author$project$Main$Next = {$: 5};
var $author$project$Main$Reset = {$: 8};
var $author$project$Main$orElse = F2(
	function (fallback, preferred) {
		if (!preferred.$) {
			return preferred;
		} else {
			return fallback;
		}
	});
var $elm$core$Maybe$andThen = F2(
	function (callback, maybeValue) {
		if (!maybeValue.$) {
			var value = maybeValue.a;
			return callback(value);
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$String$toLower = _String_toLower;
var $author$project$Main$control = F5(
	function (name, icon, className, disabled, message) {
		return A2(
			$elm$html$Html$button,
			_Utils_ap(
				_List_fromArray(
					[
						$elm$html$Html$Attributes$id(
						'control-' + $elm$core$String$toLower(name)),
						$elm$html$Html$Attributes$type_('button'),
						$elm$html$Html$Attributes$class('control-button ' + className),
						$elm$html$Html$Attributes$disabled(disabled),
						$elm$html$Html$Events$onClick(message),
						A2($elm$html$Html$Attributes$attribute, 'aria-label', name),
						$elm$html$Html$Attributes$title(
						_Utils_ap(
							name,
							(name === 'Step') ? ' (→)' : ((name === 'Back') ? ' (←)' : '')))
					]),
				(name === 'Step') ? _List_fromArray(
					[
						A2($elm$html$Html$Attributes$attribute, 'aria-keyshortcuts', 'ArrowRight')
					]) : ((name === 'Back') ? _List_fromArray(
					[
						A2($elm$html$Html$Attributes$attribute, 'aria-keyshortcuts', 'ArrowLeft')
					]) : _List_Nil)),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$attribute, 'aria-hidden', 'true')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(icon)
						])),
					$elm$html$Html$text(name)
				]));
	});
var $elm$core$Basics$ge = _Utils_ge;
var $elm$core$Bitwise$and = _Bitwise_and;
var $elm$core$Bitwise$shiftRightZfBy = _Bitwise_shiftRightZfBy;
var $elm$core$Array$bitMask = 4294967295 >>> (32 - $elm$core$Array$shiftStep);
var $elm$core$Elm$JsArray$unsafeGet = _JsArray_unsafeGet;
var $elm$core$Array$getHelp = F3(
	function (shift, index, tree) {
		getHelp:
		while (true) {
			var pos = $elm$core$Array$bitMask & (index >>> shift);
			var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (!_v0.$) {
				var subTree = _v0.a;
				var $temp$shift = shift - $elm$core$Array$shiftStep,
					$temp$index = index,
					$temp$tree = subTree;
				shift = $temp$shift;
				index = $temp$index;
				tree = $temp$tree;
				continue getHelp;
			} else {
				var values = _v0.a;
				return A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, values);
			}
		}
	});
var $elm$core$Bitwise$shiftLeftBy = _Bitwise_shiftLeftBy;
var $elm$core$Array$tailIndex = function (len) {
	return (len >>> 5) << 5;
};
var $elm$core$Array$get = F2(
	function (index, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? $elm$core$Maybe$Nothing : ((_Utils_cmp(
			index,
			$elm$core$Array$tailIndex(len)) > -1) ? $elm$core$Maybe$Just(
			A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, tail)) : $elm$core$Maybe$Just(
			A3($elm$core$Array$getHelp, startShift, index, tree)));
	});
var $author$project$Sutra$Session$current = function (session) {
	return A2(
		$elm$core$Maybe$withDefault,
		{
			a1: $elm$core$Maybe$Nothing,
			v: $elm$core$Maybe$Just('runtime_error: invalid history cursor'),
			a4: $elm$core$Maybe$Nothing,
			a5: 0,
			be: $elm$core$Maybe$Nothing,
			h: $author$project$Sutra$Ast$ListLiteral(_List_Nil),
			Q: _List_Nil,
			t: _List_Nil,
			R: $elm$core$Maybe$Nothing
		},
		A2($elm$core$Array$get, session.a8, session.E));
};
var $elm$core$Bitwise$shiftRightBy = _Bitwise_shiftRightBy;
var $elm$core$String$repeatHelp = F3(
	function (n, chunk, result) {
		return (n <= 0) ? result : A3(
			$elm$core$String$repeatHelp,
			n >> 1,
			_Utils_ap(chunk, chunk),
			(!(n & 1)) ? result : _Utils_ap(result, chunk));
	});
var $elm$core$String$repeat = F2(
	function (n, chunk) {
		return A3($elm$core$String$repeatHelp, n, chunk, '');
	});
var $elm$core$String$padLeft = F3(
	function (n, _char, string) {
		return _Utils_ap(
			A2(
				$elm$core$String$repeat,
				n - $elm$core$String$length(string),
				$elm$core$String$fromChar(_char)),
			string);
	});
var $author$project$Main$Previous = {$: 6};
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $author$project$Sutra$Session$finished = function (session) {
	var frame = $author$project$Sutra$Session$current(session);
	return (!_Utils_eq(frame.v, $elm$core$Maybe$Nothing)) || $author$project$Sutra$Ast$isValue(frame.h);
};
var $author$project$Main$ToggleRun = {$: 7};
var $elm$core$String$fromFloat = _String_fromNumber;
var $author$project$Sutra$Print$numberText = function (number) {
	return (!number) ? '0' : $elm$core$String$fromFloat(number);
};
var $author$project$Sutra$Print$source = function (expression) {
	switch (expression.$) {
		case 0:
			var number = expression.a;
			return $author$project$Sutra$Print$numberText(number);
		case 1:
			var _boolean = expression.a;
			return _boolean ? 'True' : 'False';
		case 2:
			var items = expression.a;
			return '[' + (A2(
				$elm$core$String$join,
				', ',
				A2($elm$core$List$map, $author$project$Sutra$Print$source, items)) + ']');
		case 3:
			var name = expression.a;
			return name;
		case 4:
			var name = expression.a;
			var body = expression.b;
			return '(\u005C' + (name + (' -> ' + ($author$project$Sutra$Print$source(body) + ')')));
		case 5:
			var _function = expression.a;
			var value = expression.b;
			return '(' + ($author$project$Sutra$Print$source(_function) + (' ' + ($author$project$Sutra$Print$argument(value) + ')')));
		case 6:
			var name = expression.a;
			var value = expression.b;
			var body = expression.c;
			return '(let ' + (name + (' = ' + ($author$project$Sutra$Print$source(value) + (' in ' + ($author$project$Sutra$Print$source(body) + ')')))));
		case 7:
			var condition = expression.a;
			var yes = expression.b;
			var no = expression.c;
			return '(if ' + ($author$project$Sutra$Print$source(condition) + (' then ' + ($author$project$Sutra$Print$source(yes) + (' else ' + ($author$project$Sutra$Print$source(no) + ')')))));
		case 8:
			var operator = expression.a;
			var left = expression.b;
			var right = expression.c;
			return '(' + ($author$project$Sutra$Print$source(left) + (' ' + (operator + (' ' + ($author$project$Sutra$Print$source(right) + ')')))));
		default:
			if (!expression.b.b) {
				var name = expression.a;
				return name;
			} else {
				var name = expression.a;
				var _arguments = expression.b;
				return '(' + (name + (' ' + (A2(
					$elm$core$String$join,
					' ',
					A2($elm$core$List$map, $author$project$Sutra$Print$argument, _arguments)) + ')')));
			}
	}
};
var $author$project$Sutra$Print$argument = function (expression) {
	if (!expression.$) {
		var number = expression.a;
		return (number < 0) ? ('(' + ($author$project$Sutra$Print$source(expression) + ')')) : $author$project$Sutra$Print$source(expression);
	} else {
		return $author$project$Sutra$Print$source(expression);
	}
};
var $author$project$Sutra$Print$canonical = function (expression) {
	switch (expression.$) {
		case 0:
			var number = expression.a;
			return $author$project$Sutra$Print$numberText(number);
		case 1:
			var _boolean = expression.a;
			return _boolean ? 'True' : 'False';
		case 2:
			var items = expression.a;
			return '[' + (A2(
				$elm$core$String$join,
				', ',
				A2($elm$core$List$map, $author$project$Sutra$Print$canonical, items)) + ']');
		case 4:
			return '<function>';
		case 9:
			return '<function>';
		default:
			return $author$project$Sutra$Print$source(expression);
	}
};
var $elm$core$String$replace = F3(
	function (before, after, string) {
		return A2(
			$elm$core$String$join,
			after,
			A2($elm$core$String$split, before, string));
	});
var $author$project$Main$ruleLabel = function (rule) {
	switch (rule) {
		case 'definition':
			return 'Unfold definition';
		case 'builtin_reference':
			return 'Resolve built-in';
		case 'partial_application':
			return 'Apply one argument';
		case 'beta':
			return 'Substitute argument';
		case 'let':
			return 'Substitute local value';
		case 'operator':
			return 'Evaluate operator';
		case 'short_circuit':
			return 'Short-circuit branch';
		case 'boolean_operator':
			return 'Evaluate boolean';
		case 'if_true':
			return 'Choose true branch';
		case 'if_false':
			return 'Choose false branch';
		default:
			return A3(
				$elm$core$String$replace,
				'_empty',
				' · empty list',
				A3($elm$core$String$replace, '_cons', ' · visit cell', rule));
	}
};
var $author$project$Main$viewError = function (message) {
	var title = (message === 'step_limit') ? 'Step limit reached' : (A2($elm$core$String$startsWith, 'parse_error:', message) ? 'Parse error' : (A2($elm$core$String$startsWith, 'type_error:', message) ? 'Type error' : (A2($elm$core$String$startsWith, 'unbound:', message) ? 'Unbound name' : (A2($elm$core$String$startsWith, 'input_error:', message) ? 'Check the step limit' : 'Runtime error'))));
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('error-panel'),
				A2($elm$html$Html$Attributes$attribute, 'role', 'alert'),
				A2($elm$html$Html$Attributes$attribute, 'data-testid', 'error-panel')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h3,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text(title)
					])),
				A2(
				$elm$html$Html$code,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text(message)
					])),
				A2(
				$elm$html$Html$p,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text(
						(message === 'step_limit') ? 'Use Back or Reset to inspect this computation.' : 'Edit your program or expression, then Step or Reset to try again.')
					]))
			]));
};
var $author$project$Main$ChangeSpeed = function (a) {
	return {$: 4, a: a};
};
var $elm$html$Html$mark = _VirtualDom_node('mark');
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $elm$core$List$intersperse = F2(
	function (sep, xs) {
		if (!xs.b) {
			return _List_Nil;
		} else {
			var hd = xs.a;
			var tl = xs.b;
			var step = F2(
				function (x, rest) {
					return A2(
						$elm$core$List$cons,
						sep,
						A2($elm$core$List$cons, x, rest));
				});
			var spersed = A3($elm$core$List$foldr, step, _List_Nil, tl);
			return A2($elm$core$List$cons, hd, spersed);
		}
	});
var $author$project$Sutra$ExpressionView$render = F3(
	function (selected, path, expression) {
		var separated = function (children) {
			return $elm$core$List$concat(
				A2(
					$elm$core$List$intersperse,
					_List_fromArray(
						[
							$elm$html$Html$text(', ')
						]),
					children));
		};
		var token = F2(
			function (className, tokenText) {
				return A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class(className)
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(tokenText)
						]));
			});
		var child = F2(
			function (index, value) {
				return A3(
					$author$project$Sutra$ExpressionView$render,
					selected,
					_Utils_ap(
						path,
						_List_fromArray(
							[index])),
					value);
			});
		var argument = F2(
			function (index, value) {
				if (!value.$) {
					var number = value.a;
					return (number < 0) ? _List_fromArray(
						[
							$elm$html$Html$text('('),
							A2(child, index, value),
							$elm$html$Html$text(')')
						]) : _List_fromArray(
						[
							A2(child, index, value)
						]);
				} else {
					return _List_fromArray(
						[
							A2(child, index, value)
						]);
				}
			});
		var content = function () {
			switch (expression.$) {
				case 0:
					return _List_fromArray(
						[
							A2(
							token,
							'syntax-number',
							$author$project$Sutra$Print$canonical(expression))
						]);
				case 1:
					return _List_fromArray(
						[
							A2(
							token,
							'syntax-boolean',
							$author$project$Sutra$Print$canonical(expression))
						]);
				case 3:
					var name = expression.a;
					return _List_fromArray(
						[
							A2(token, 'syntax-name', name)
						]);
				case 2:
					var values = expression.a;
					return _Utils_ap(
						_List_fromArray(
							[
								$elm$html$Html$text('[')
							]),
						_Utils_ap(
							separated(
								A2(
									$elm$core$List$indexedMap,
									F2(
										function (index, value) {
											return _List_fromArray(
												[
													A2(child, index, value)
												]);
										}),
									values)),
							_List_fromArray(
								[
									$elm$html$Html$text(']')
								])));
				case 4:
					var name = expression.a;
					var body = expression.b;
					return _List_fromArray(
						[
							$elm$html$Html$text('('),
							A2(token, 'syntax-keyword', '\u005C'),
							A2(token, 'syntax-name', name),
							$elm$html$Html$text(' '),
							A2(token, 'syntax-keyword', '->'),
							$elm$html$Html$text(' '),
							A2(child, 0, body),
							$elm$html$Html$text(')')
						]);
				case 5:
					var _function = expression.a;
					var value = expression.b;
					return _Utils_ap(
						_List_fromArray(
							[
								$elm$html$Html$text('('),
								A2(child, 0, _function),
								$elm$html$Html$text(' ')
							]),
						_Utils_ap(
							A2(argument, 1, value),
							_List_fromArray(
								[
									$elm$html$Html$text(')')
								])));
				case 6:
					var name = expression.a;
					var value = expression.b;
					var body = expression.c;
					return _List_fromArray(
						[
							$elm$html$Html$text('('),
							A2(token, 'syntax-keyword', 'let'),
							$elm$html$Html$text(' '),
							A2(token, 'syntax-name', name),
							$elm$html$Html$text(' = '),
							A2(child, 0, value),
							$elm$html$Html$text(' '),
							A2(token, 'syntax-keyword', 'in'),
							$elm$html$Html$text(' '),
							A2(child, 1, body),
							$elm$html$Html$text(')')
						]);
				case 7:
					var condition = expression.a;
					var yes = expression.b;
					var no = expression.c;
					return _List_fromArray(
						[
							$elm$html$Html$text('('),
							A2(token, 'syntax-keyword', 'if'),
							$elm$html$Html$text(' '),
							A2(child, 0, condition),
							$elm$html$Html$text(' '),
							A2(token, 'syntax-keyword', 'then'),
							$elm$html$Html$text(' '),
							A2(child, 1, yes),
							$elm$html$Html$text(' '),
							A2(token, 'syntax-keyword', 'else'),
							$elm$html$Html$text(' '),
							A2(child, 2, no),
							$elm$html$Html$text(')')
						]);
				case 8:
					var operator = expression.a;
					var left = expression.b;
					var right = expression.c;
					return _List_fromArray(
						[
							$elm$html$Html$text('('),
							A2(child, 0, left),
							$elm$html$Html$text(' '),
							A2(token, 'syntax-operator', operator),
							$elm$html$Html$text(' '),
							A2(child, 1, right),
							$elm$html$Html$text(')')
						]);
				default:
					if (!expression.b.b) {
						var name = expression.a;
						return _List_fromArray(
							[
								A2(token, 'syntax-name', name)
							]);
					} else {
						var name = expression.a;
						var values = expression.b;
						return _Utils_ap(
							_List_fromArray(
								[
									$elm$html$Html$text('('),
									A2(token, 'syntax-name', name),
									$elm$html$Html$text(' ')
								]),
							_Utils_ap(
								$elm$core$List$concat(
									A2(
										$elm$core$List$intersperse,
										_List_fromArray(
											[
												$elm$html$Html$text(' ')
											]),
										A2($elm$core$List$indexedMap, argument, values))),
								_List_fromArray(
									[
										$elm$html$Html$text(')')
									])));
					}
			}
		}();
		return _Utils_eq(
			selected,
			$elm$core$Maybe$Just(path)) ? A2(
			$elm$html$Html$mark,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('reduced-expression'),
					A2($elm$html$Html$Attributes$attribute, 'data-testid', 'reduced-expression')
				]),
			content) : A2(
			$elm$html$Html$span,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('expression-node')
				]),
			content);
	});
var $author$project$Sutra$ExpressionView$view = F2(
	function (selected, expression) {
		return A3($author$project$Sutra$ExpressionView$render, selected, _List_Nil, expression);
	});
var $author$project$Sutra$Session$previous = function (session) {
	return A2($elm$core$Array$get, session.a8 - 1, session.E);
};
var $author$project$Main$viewCurrent = F2(
	function (model, frame) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('expression-stage')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('stage-label')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('CURRENT EXPRESSION')
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('current-expression'),
							A2($elm$html$Html$Attributes$attribute, 'data-testid', 'current-expression'),
							A2($elm$html$Html$Attributes$attribute, 'aria-label', 'Current expression')
						]),
					_List_fromArray(
						[
							function () {
							if (!frame.$) {
								var current = frame.a;
								return A2($author$project$Sutra$ExpressionView$view, current.a4, current.h);
							} else {
								return A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('empty-expression')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Your next reduction starts here.')
										]));
							}
						}()
						])),
					function () {
					var _v1 = A2($elm$core$Maybe$andThen, $author$project$Sutra$Session$previous, model.f);
					if (_v1.$ === 1) {
						return $elm$html$Html$text('');
					} else {
						var before = _v1.a;
						return A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('previous-expression')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('stage-label')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('BEFORE THIS STEP')
										])),
									A2(
									$elm$html$Html$code,
									_List_fromArray(
										[
											A2($elm$html$Html$Attributes$attribute, 'aria-label', 'Previous expression')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(
											$author$project$Sutra$Print$source(before.h))
										]))
								]));
					}
				}()
				]));
	});
var $author$project$Main$viewActivity = function (activity) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('activity-panel'),
				A2($elm$html$Html$Attributes$attribute, 'data-testid', 'list-activity')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('activity-heading')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('field-label')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('LIST ACTIVITY')
							])),
						A2(
						$elm$core$Maybe$withDefault,
						A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('activity-empty-tag')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('waiting for a list')
								])),
						A2(
							$elm$core$Maybe$map,
							function (active) {
								return A2(
									$elm$html$Html$code,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('operation-tag'),
											A2($elm$html$Html$Attributes$attribute, 'data-testid', 'active-operation')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(active.aj)
										]));
							},
							activity))
					])),
				function () {
				if (activity.$ === 1) {
					return A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('activity-placeholder')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('placeholder-cells'),
										A2($elm$html$Html$Attributes$attribute, 'aria-hidden', 'true')
									]),
								_List_fromArray(
									[
										A2($elm$html$Html$span, _List_Nil, _List_Nil),
										A2($elm$html$Html$span, _List_Nil, _List_Nil),
										A2($elm$html$Html$span, _List_Nil, _List_Nil),
										A2($elm$html$Html$span, _List_Nil, _List_Nil)
									])),
								A2(
								$elm$html$Html$p,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Map, filter, and fold make their next move here.')
									]))
							]));
				} else {
					var active = activity.a;
					var processed = function (index) {
						var _v2 = active.ad;
						if (_v2.$ === 1) {
							return true;
						} else {
							var current = _v2.a;
							return ((active.aj === 'foldr') && (active.aF !== 'Unfolding')) ? (_Utils_cmp(index, current) > 0) : (_Utils_cmp(index, current) < 0);
						}
					};
					var count = $elm$core$List$length(active.ap);
					var windowStart = (count <= 7) ? 0 : A2(
						$elm$core$Maybe$withDefault,
						0,
						A2(
							$elm$core$Maybe$map,
							function (index) {
								return A2($elm$core$Basics$max, 0, index - 2);
							},
							active.ad));
					var visibleItems = A2(
						$elm$core$List$take,
						7,
						A2($elm$core$List$drop, windowStart, active.ap));
					var windowEnd = windowStart + $elm$core$List$length(visibleItems);
					var cell = F2(
						function (index, value) {
							var current = _Utils_eq(
								active.ad,
								$elm$core$Maybe$Just(index));
							return A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$classList(
										_List_fromArray(
											[
												_Utils_Tuple2('list-cell', true),
												_Utils_Tuple2('is-active', current),
												_Utils_Tuple2(
												'is-processed',
												processed(index))
											])),
										A2($elm$html$Html$Attributes$attribute, 'role', 'listitem'),
										A2(
										$elm$html$Html$Attributes$attribute,
										'data-cell-index',
										$elm$core$String$fromInt(index)),
										A2(
										$elm$html$Html$Attributes$attribute,
										'aria-current',
										current ? 'step' : 'false'),
										$elm$html$Html$Attributes$title(
										'Cell ' + ($elm$core$String$fromInt(index + 1) + (': ' + $author$project$Sutra$Print$canonical(value))))
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$span,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('cell-index')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(
												$elm$core$String$fromInt(index + 1))
											])),
										A2(
										$elm$html$Html$code,
										_List_Nil,
										_List_fromArray(
											[
												$elm$html$Html$text(
												$author$project$Sutra$Print$canonical(value))
											])),
										A2(
										$elm$html$Html$span,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('cell-marker'),
												A2($elm$html$Html$Attributes$attribute, 'aria-hidden', 'true')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(
												current ? '↑' : (processed(index) ? '·' : ''))
											]))
									]));
						});
					return A2(
						$elm$html$Html$div,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('activity-caption')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$span,
										_List_Nil,
										_List_fromArray(
											[
												$elm$html$Html$text(active.aF)
											])),
										A2(
										$elm$html$Html$span,
										_List_Nil,
										_List_fromArray(
											[
												$elm$html$Html$text(
												A2(
													$elm$core$Maybe$withDefault,
													$elm$core$String$fromInt(count) + ' cells',
													A2(
														$elm$core$Maybe$map,
														function (index) {
															return 'cell ' + ($elm$core$String$fromInt(index + 1) + (' / ' + $elm$core$String$fromInt(count)));
														},
														active.ad)))
											]))
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('list-cells'),
										A2($elm$html$Html$Attributes$attribute, 'role', 'list'),
										A2($elm$html$Html$Attributes$attribute, 'aria-label', 'Input list')
									]),
								$elm$core$List$isEmpty(active.ap) ? _List_fromArray(
									[
										A2(
										$elm$html$Html$code,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('empty-list')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('[] · empty list')
											]))
									]) : _Utils_ap(
									(windowStart > 0) ? _List_fromArray(
										[
											A2(
											$elm$html$Html$span,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('more-cells')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text(
													'… ' + ($elm$core$String$fromInt(windowStart) + ' earlier'))
												]))
										]) : _List_Nil,
									_Utils_ap(
										A2(
											$elm$core$List$indexedMap,
											F2(
												function (index, item) {
													return A2(cell, windowStart + index, item);
												}),
											visibleItems),
										(_Utils_cmp(count, windowEnd) > 0) ? _List_fromArray(
											[
												A2(
												$elm$html$Html$span,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('more-cells')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text(
														'+' + ($elm$core$String$fromInt(count - windowEnd) + ' cells'))
													]))
											]) : _List_Nil))),
								function () {
								var _v1 = active.bf;
								if (_v1.$ === 1) {
									return $elm$html$Html$text('');
								} else {
									var accumulator = _v1.a;
									return A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('accumulator')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$span,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('field-label')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('ACCUMULATOR')
													])),
												A2(
												$elm$html$Html$code,
												_List_fromArray(
													[
														A2($elm$html$Html$Attributes$attribute, 'data-testid', 'accumulator')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text(
														$author$project$Sutra$Print$canonical(accumulator))
													]))
											]));
								}
							}()
							]));
				}
			}()
			]));
};
var $author$project$Main$viewExecution = function (model) {
	var terminal = A2(
		$elm$core$Maybe$withDefault,
		false,
		A2($elm$core$Maybe$map, $author$project$Sutra$Session$finished, model.f));
	var canBack = A2(
		$elm$core$Maybe$withDefault,
		false,
		A2(
			$elm$core$Maybe$map,
			function (session) {
				return session.a8 > 0;
			},
			model.f));
	var frame = A2($elm$core$Maybe$map, $author$project$Sutra$Session$current, model.f);
	var error = A2(
		$author$project$Main$orElse,
		A2(
			$elm$core$Maybe$andThen,
			function ($) {
				return $.v;
			},
			frame),
		model.v);
	var count = A2(
		$elm$core$Maybe$withDefault,
		0,
		A2(
			$elm$core$Maybe$map,
			function ($) {
				return $.a5;
			},
			frame));
	var done = A2(
		$elm$core$Maybe$withDefault,
		false,
		A2(
			$elm$core$Maybe$map,
			function (current) {
				return _Utils_eq(current.v, $elm$core$Maybe$Nothing) && $author$project$Sutra$Ast$isValue(current.h);
			},
			frame));
	var status = (!_Utils_eq(error, $elm$core$Maybe$Nothing)) ? 'Stopped' : (done ? 'Complete' : (model.a ? 'Running' : ((count > 0) ? 'Paused' : 'Ready')));
	return A2(
		$elm$html$Html$section,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('panel execution-panel'),
				A2($elm$html$Html$Attributes$attribute, 'aria-label', 'Execution visualizer')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('panel-heading')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('section-title')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$span,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('02')
									])),
								A2(
								$elm$html$Html$h2,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('The reduction')
									]))
							])),
						A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$classList(
								_List_fromArray(
									[
										_Utils_Tuple2('execution-status', true),
										_Utils_Tuple2('is-running', model.a),
										_Utils_Tuple2('is-complete', done),
										_Utils_Tuple2(
										'is-error',
										!_Utils_eq(error, $elm$core$Maybe$Nothing))
									])),
								A2($elm$html$Html$Attributes$attribute, 'role', 'status'),
								A2($elm$html$Html$Attributes$attribute, 'aria-live', 'polite')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$span,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('status-dot')
									]),
								_List_Nil),
								$elm$html$Html$text(status)
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('execution-body')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('control-bar')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('playback-controls')
									]),
								_List_fromArray(
									[
										A5($author$project$Main$control, 'Back', '←', 'button-secondary', !canBack, $author$project$Main$Previous),
										A5($author$project$Main$control, 'Step', '→', 'button-primary', terminal, $author$project$Main$Next),
										A5(
										$author$project$Main$control,
										model.a ? 'Pause' : 'Run',
										model.a ? 'Ⅱ' : '▷',
										'button-secondary',
										terminal && (!model.a),
										$author$project$Main$ToggleRun),
										A5($author$project$Main$control, 'Reset', '↺', 'button-reset', false, $author$project$Main$Reset)
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('speed-setting')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$label,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$for('playback-speed')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Speed')
											])),
										A2(
										$elm$html$Html$select,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$id('playback-speed'),
												$elm$html$Html$Attributes$value(
												$elm$core$String$fromInt(model.x)),
												$elm$html$Html$Events$onInput($author$project$Main$ChangeSpeed),
												A2($elm$html$Html$Attributes$attribute, 'aria-label', 'Playback speed')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$option,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$value('600'),
														$elm$html$Html$Attributes$selected(model.x === 600)
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('Slow')
													])),
												A2(
												$elm$html$Html$option,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$value('220'),
														$elm$html$Html$Attributes$selected(model.x === 220)
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('Normal')
													])),
												A2(
												$elm$html$Html$option,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$value('40'),
														$elm$html$Html$Attributes$selected(model.x === 40)
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('Fast')
													]))
											]))
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('keyboard-hints'),
								A2($elm$html$Html$Attributes$attribute, 'role', 'note'),
								A2($elm$html$Html$Attributes$attribute, 'aria-label', 'Keyboard shortcuts')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$kbd,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('←')
									])),
								$elm$html$Html$text('Back'),
								A2(
								$elm$html$Html$kbd,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('→')
									])),
								$elm$html$Html$text('Step'),
								A2(
								$elm$html$Html$span,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('when not editing')
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('trace-heading')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('step-count')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$span,
										_List_fromArray(
											[
												A2($elm$html$Html$Attributes$attribute, 'data-testid', 'step-counter'),
												A2(
												$elm$html$Html$Attributes$attribute,
												'data-step',
												$elm$core$String$fromInt(count))
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(
												A3(
													$elm$core$String$padLeft,
													2,
													'0',
													$elm$core$String$fromInt(count)))
											])),
										$elm$html$Html$text(' reductions')
									])),
								A2(
								$elm$html$Html$span,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('rule-pill'),
										A2($elm$html$Html$Attributes$attribute, 'data-testid', 'reduction-rule')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(
										A2(
											$elm$core$Maybe$withDefault,
											'Initial expression',
											A2(
												$elm$core$Maybe$map,
												$author$project$Main$ruleLabel,
												A2(
													$elm$core$Maybe$andThen,
													function ($) {
														return $.a1;
													},
													frame))))
									]))
							])),
						A2($author$project$Main$viewCurrent, model, frame),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('highlight-key')
							]),
						_List_fromArray(
							[
								A2($elm$html$Html$span, _List_Nil, _List_Nil),
								$elm$html$Html$text('Highlighted: the term rewritten in the last step')
							])),
						$author$project$Main$viewActivity(
						A2(
							$elm$core$Maybe$andThen,
							function ($) {
								return $.be;
							},
							frame)),
						function () {
						if (!error.$) {
							var message = error.a;
							return $author$project$Main$viewError(message);
						} else {
							return done ? A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('result-panel'),
										A2($elm$html$Html$Attributes$attribute, 'data-testid', 'result-panel'),
										A2($elm$html$Html$Attributes$attribute, 'aria-live', 'polite')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$div,
										_List_Nil,
										_List_fromArray(
											[
												A2(
												$elm$html$Html$span,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('result-icon')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('✓')
													])),
												A2(
												$elm$html$Html$span,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('field-label')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('FINAL VALUE')
													]))
											])),
										A2(
										$elm$html$Html$code,
										_List_fromArray(
											[
												A2($elm$html$Html$Attributes$attribute, 'data-testid', 'final-value')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(
												A2(
													$elm$core$Maybe$withDefault,
													'',
													A2(
														$elm$core$Maybe$map,
														A2(
															$elm$core$Basics$composeR,
															function ($) {
																return $.h;
															},
															$author$project$Sutra$Print$canonical),
														frame)))
											])),
										function () {
										var _v1 = model.A;
										if (_v1.$ === 1) {
											return $elm$html$Html$text('');
										} else {
											var context = _v1.a;
											var value = A2(
												$elm$core$Maybe$withDefault,
												'',
												A2(
													$elm$core$Maybe$map,
													A2(
														$elm$core$Basics$composeR,
														function ($) {
															return $.h;
														},
														$author$project$Sutra$Print$canonical),
													frame));
											return A2(
												$elm$html$Html$p,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('example-outcome'),
														A2($elm$html$Html$Attributes$attribute, 'data-testid', 'example-outcome')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text(
														_Utils_eq(value, context.L) ? 'Matches this example.' : ('Does not match this example. Expected ' + (context.L + '.')))
													]));
										}
									}()
									])) : A2(
								$elm$html$Html$p,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('execution-hint')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(
										_Utils_eq(model.f, $elm$core$Maybe$Nothing) ? 'Your edits are ready. Step or Run to evaluate them.' : 'Step changes one term. Back returns to the exact previous state.')
									]));
						}
					}()
					]))
			]));
};
var $elm$core$String$toUpper = _String_toUpper;
var $author$project$Main$viewAnswerContext = function (model) {
	var _v0 = model.A;
	if (_v0.$ === 1) {
		return $elm$html$Html$text('');
	} else {
		var context = _v0.a;
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('answer-context'),
					A2($elm$html$Html$Attributes$attribute, 'data-testid', 'answer-context')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$elm$html$Html$p,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('field-label')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(
									'INSPECTING ' + $elm$core$String$toUpper(context.ae))
								])),
							A2(
							$elm$html$Html$h2,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text(context.ac)
								])),
							A2(
							$elm$html$Html$p,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text('Reported verdict: '),
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('verdict-badge verdict-' + context._)
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(
											$author$project$Sutra$Showcase$verdictLabel(context._))
										])),
									$elm$html$Html$text(' · Expected example value: '),
									A2(
									$elm$html$Html$code,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text(context.L)
										]))
								]))
						])),
					A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$type_('button'),
							$elm$html$Html$Attributes$class('control-button button-secondary'),
							$elm$html$Html$Events$onClick(
							$author$project$Main$ShowPage(1))
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Back to model answers')
						]))
				]));
	}
};
var $author$project$Main$view = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('app-shell')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$header,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('masthead')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('brand')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$span,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('brand-symbol'),
										A2($elm$html$Html$Attributes$attribute, 'aria-hidden', 'true')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('λ')
									])),
								A2(
								$elm$html$Html$span,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('brand-name')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Sutra')
									])),
								A2(
								$elm$html$Html$span,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('brand-divider')
									]),
								_List_Nil),
								A2(
								$elm$html$Html$span,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('brand-caption')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('A language, made visible.')
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('local-badge')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$span,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('status-dot')
									]),
								_List_Nil),
								$elm$html$Html$text('Runs entirely in your browser')
							]))
					])),
				A2(
				$elm$html$Html$main_,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$section,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('intro')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$p,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('eyebrow')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('THE SMALL-STEP PLAYGROUND')
									])),
								A2(
								$elm$html$Html$h1,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('See how a program'),
										A2($elm$html$Html$br, _List_Nil, _List_Nil),
										A2(
										$elm$html$Html$span,
										_List_Nil,
										_List_fromArray(
											[
												$elm$html$Html$text('becomes a value.')
											]))
									])),
								A2(
								$elm$html$Html$p,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('intro-copy')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('A tiny functional language. Every rewrite in the open. Pick an example, follow a function, and watch the cells move.')
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('intro-note')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$span,
										_List_Nil,
										_List_fromArray(
											[
												$elm$html$Html$text('01')
											])),
										$elm$html$Html$text(' Edit'),
										A2(
										$elm$html$Html$span,
										_List_Nil,
										_List_fromArray(
											[
												$elm$html$Html$text('02')
											])),
										$elm$html$Html$text(' Step'),
										A2(
										$elm$html$Html$span,
										_List_Nil,
										_List_fromArray(
											[
												$elm$html$Html$text('03')
											])),
										$elm$html$Html$text(' Understand')
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('view-switch'),
								A2($elm$html$Html$Attributes$attribute, 'role', 'group'),
								A2($elm$html$Html$Attributes$attribute, 'aria-label', 'Visualizer view')
							]),
						_List_fromArray(
							[
								A3($author$project$Main$viewSwitch, model.q, 0, 'Playground'),
								A3($author$project$Main$viewSwitch, model.q, 1, 'Model answers')
							])),
						function () {
						var _v0 = model.q;
						if (!_v0) {
							return A2(
								$elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										$author$project$Main$viewAnswerContext(model),
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('workspace')
											]),
										_List_fromArray(
											[
												$author$project$Main$viewEditor(model),
												$author$project$Main$viewExecution(model)
											]))
									]));
						} else {
							var _v1 = model.ah;
							if (_v1.$ === 1) {
								return A4($author$project$Sutra$Showcase$view, $author$project$Main$ChooseTask, $author$project$Main$InspectAnswer, model.aa, model.N);
							} else {
								var error = _v1.a;
								return A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('error-panel'),
											A2($elm$html$Html$Attributes$attribute, 'role', 'alert')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$h2,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text('Could not load model answers')
												])),
											A2(
											$elm$html$Html$p,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text('Check assets/showcase.json and run npm run build:showcase. The playground is still available.')
												])),
											A2(
											$elm$html$Html$code,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text(error)
												]))
										]));
							}
						}
					}()
					])),
				A2(
				$elm$html$Html$footer,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('footer')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$span,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('SUTRA'),
								A2(
								$elm$html$Html$span,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('footer-separator')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('/')
									])),
								$elm$html$Html$text('Pure functions. Visible computation.')
							])),
						A2(
						$elm$html$Html$span,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Written in Elm · Syntax Error 2026')
							]))
					]))
			]));
};
var $elm$time$Time$Every = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$time$Time$State = F2(
	function (taggers, processes) {
		return {aR: taggers, aX: processes};
	});
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$time$Time$init = $elm$core$Task$succeed(
	A2($elm$time$Time$State, $elm$core$Dict$empty, $elm$core$Dict$empty));
var $elm$core$Process$kill = _Scheduler_kill;
var $elm$core$Dict$foldl = F3(
	function (func, acc, dict) {
		foldl:
		while (true) {
			if (dict.$ === -2) {
				return acc;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldl, func, acc, left)),
					$temp$dict = right;
				func = $temp$func;
				acc = $temp$acc;
				dict = $temp$dict;
				continue foldl;
			}
		}
	});
var $elm$core$Dict$merge = F6(
	function (leftStep, bothStep, rightStep, leftDict, rightDict, initialResult) {
		var stepState = F3(
			function (rKey, rValue, _v0) {
				stepState:
				while (true) {
					var list = _v0.a;
					var result = _v0.b;
					if (!list.b) {
						return _Utils_Tuple2(
							list,
							A3(rightStep, rKey, rValue, result));
					} else {
						var _v2 = list.a;
						var lKey = _v2.a;
						var lValue = _v2.b;
						var rest = list.b;
						if (_Utils_cmp(lKey, rKey) < 0) {
							var $temp$rKey = rKey,
								$temp$rValue = rValue,
								$temp$_v0 = _Utils_Tuple2(
								rest,
								A3(leftStep, lKey, lValue, result));
							rKey = $temp$rKey;
							rValue = $temp$rValue;
							_v0 = $temp$_v0;
							continue stepState;
						} else {
							if (_Utils_cmp(lKey, rKey) > 0) {
								return _Utils_Tuple2(
									list,
									A3(rightStep, rKey, rValue, result));
							} else {
								return _Utils_Tuple2(
									rest,
									A4(bothStep, lKey, lValue, rValue, result));
							}
						}
					}
				}
			});
		var _v3 = A3(
			$elm$core$Dict$foldl,
			stepState,
			_Utils_Tuple2(
				$elm$core$Dict$toList(leftDict),
				initialResult),
			rightDict);
		var leftovers = _v3.a;
		var intermediateResult = _v3.b;
		return A3(
			$elm$core$List$foldl,
			F2(
				function (_v4, result) {
					var k = _v4.a;
					var v = _v4.b;
					return A3(leftStep, k, v, result);
				}),
			intermediateResult,
			leftovers);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$time$Time$addMySub = F2(
	function (_v0, state) {
		var interval = _v0.a;
		var tagger = _v0.b;
		var _v1 = A2($elm$core$Dict$get, interval, state);
		if (_v1.$ === 1) {
			return A3(
				$elm$core$Dict$insert,
				interval,
				_List_fromArray(
					[tagger]),
				state);
		} else {
			var taggers = _v1.a;
			return A3(
				$elm$core$Dict$insert,
				interval,
				A2($elm$core$List$cons, tagger, taggers),
				state);
		}
	});
var $elm$core$Process$spawn = _Scheduler_spawn;
var $elm$core$Platform$sendToSelf = _Platform_sendToSelf;
var $elm$time$Time$Name = function (a) {
	return {$: 0, a: a};
};
var $elm$time$Time$Offset = function (a) {
	return {$: 1, a: a};
};
var $elm$time$Time$Zone = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$time$Time$customZone = $elm$time$Time$Zone;
var $elm$time$Time$setInterval = _Time_setInterval;
var $elm$time$Time$spawnHelp = F3(
	function (router, intervals, processes) {
		if (!intervals.b) {
			return $elm$core$Task$succeed(processes);
		} else {
			var interval = intervals.a;
			var rest = intervals.b;
			var spawnTimer = $elm$core$Process$spawn(
				A2(
					$elm$time$Time$setInterval,
					interval,
					A2($elm$core$Platform$sendToSelf, router, interval)));
			var spawnRest = function (id) {
				return A3(
					$elm$time$Time$spawnHelp,
					router,
					rest,
					A3($elm$core$Dict$insert, interval, id, processes));
			};
			return A2($elm$core$Task$andThen, spawnRest, spawnTimer);
		}
	});
var $elm$time$Time$onEffects = F3(
	function (router, subs, _v0) {
		var processes = _v0.aX;
		var newTaggers = A3($elm$core$List$foldl, $elm$time$Time$addMySub, $elm$core$Dict$empty, subs);
		var rightStep = F3(
			function (_v6, id, _v7) {
				var spawns = _v7.a;
				var existing = _v7.b;
				var kills = _v7.c;
				return _Utils_Tuple3(
					spawns,
					existing,
					A2(
						$elm$core$Task$andThen,
						function (_v5) {
							return kills;
						},
						$elm$core$Process$kill(id)));
			});
		var leftStep = F3(
			function (interval, taggers, _v4) {
				var spawns = _v4.a;
				var existing = _v4.b;
				var kills = _v4.c;
				return _Utils_Tuple3(
					A2($elm$core$List$cons, interval, spawns),
					existing,
					kills);
			});
		var bothStep = F4(
			function (interval, taggers, id, _v3) {
				var spawns = _v3.a;
				var existing = _v3.b;
				var kills = _v3.c;
				return _Utils_Tuple3(
					spawns,
					A3($elm$core$Dict$insert, interval, id, existing),
					kills);
			});
		var _v1 = A6(
			$elm$core$Dict$merge,
			leftStep,
			bothStep,
			rightStep,
			newTaggers,
			processes,
			_Utils_Tuple3(
				_List_Nil,
				$elm$core$Dict$empty,
				$elm$core$Task$succeed(0)));
		var spawnList = _v1.a;
		var existingDict = _v1.b;
		var killTask = _v1.c;
		return A2(
			$elm$core$Task$andThen,
			function (newProcesses) {
				return $elm$core$Task$succeed(
					A2($elm$time$Time$State, newTaggers, newProcesses));
			},
			A2(
				$elm$core$Task$andThen,
				function (_v2) {
					return A3($elm$time$Time$spawnHelp, router, spawnList, existingDict);
				},
				killTask));
	});
var $elm$time$Time$Posix = $elm$core$Basics$identity;
var $elm$time$Time$millisToPosix = $elm$core$Basics$identity;
var $elm$time$Time$now = _Time_now($elm$time$Time$millisToPosix);
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$time$Time$onSelfMsg = F3(
	function (router, interval, state) {
		var _v0 = A2($elm$core$Dict$get, interval, state.aR);
		if (_v0.$ === 1) {
			return $elm$core$Task$succeed(state);
		} else {
			var taggers = _v0.a;
			var tellTaggers = function (time) {
				return $elm$core$Task$sequence(
					A2(
						$elm$core$List$map,
						function (tagger) {
							return A2(
								$elm$core$Platform$sendToApp,
								router,
								tagger(time));
						},
						taggers));
			};
			return A2(
				$elm$core$Task$andThen,
				function (_v1) {
					return $elm$core$Task$succeed(state);
				},
				A2($elm$core$Task$andThen, tellTaggers, $elm$time$Time$now));
		}
	});
var $elm$time$Time$subMap = F2(
	function (f, _v0) {
		var interval = _v0.a;
		var tagger = _v0.b;
		return A2(
			$elm$time$Time$Every,
			interval,
			A2($elm$core$Basics$composeL, f, tagger));
	});
_Platform_effectManagers['Time'] = _Platform_createManager($elm$time$Time$init, $elm$time$Time$onEffects, $elm$time$Time$onSelfMsg, 0, $elm$time$Time$subMap);
var $elm$time$Time$subscription = _Platform_leaf('Time');
var $elm$time$Time$every = F2(
	function (interval, tagger) {
		return $elm$time$Time$subscription(
			A2($elm$time$Time$Every, interval, tagger));
	});
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$Perform = $elm$core$Basics$identity;
var $elm$core$Task$init = $elm$core$Task$succeed(0);
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return 0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0;
		return A2($elm$core$Task$map, tagger, task);
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			A2($elm$core$Task$map, toMessage, task));
	});
var $elm$browser$Browser$External = function (a) {
	return {$: 1, a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 0, a: a};
};
var $elm$browser$Browser$Dom$NotFound = $elm$core$Basics$identity;
var $elm$url$Url$Http = 0;
var $elm$url$Url$Https = 1;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {ax: host, D: path, aG: port_, aH: query, aS: fragment, aU: protocol};
	});
var $elm$core$String$contains = _String_contains;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 1) {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		0,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		1,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$browser$Browser$Dom$focus = _Browser_call('focus');
var $elm$json$Json$Decode$value = _Json_decodeValue;
var $author$project$Sutra$Session$back = function (session) {
	return _Utils_update(
		session,
		{
			a8: A2($elm$core$Basics$max, 0, session.a8 - 1)
		});
};
var $elm$core$Elm$JsArray$push = _JsArray_push;
var $elm$core$Elm$JsArray$singleton = _JsArray_singleton;
var $elm$core$Elm$JsArray$unsafeSet = _JsArray_unsafeSet;
var $elm$core$Array$insertTailInTree = F4(
	function (shift, index, tail, tree) {
		var pos = $elm$core$Array$bitMask & (index >>> shift);
		if (_Utils_cmp(
			pos,
			$elm$core$Elm$JsArray$length(tree)) > -1) {
			if (shift === 5) {
				return A2(
					$elm$core$Elm$JsArray$push,
					$elm$core$Array$Leaf(tail),
					tree);
			} else {
				var newSub = $elm$core$Array$SubTree(
					A4($elm$core$Array$insertTailInTree, shift - $elm$core$Array$shiftStep, index, tail, $elm$core$Elm$JsArray$empty));
				return A2($elm$core$Elm$JsArray$push, newSub, tree);
			}
		} else {
			var value = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (!value.$) {
				var subTree = value.a;
				var newSub = $elm$core$Array$SubTree(
					A4($elm$core$Array$insertTailInTree, shift - $elm$core$Array$shiftStep, index, tail, subTree));
				return A3($elm$core$Elm$JsArray$unsafeSet, pos, newSub, tree);
			} else {
				var newSub = $elm$core$Array$SubTree(
					A4(
						$elm$core$Array$insertTailInTree,
						shift - $elm$core$Array$shiftStep,
						index,
						tail,
						$elm$core$Elm$JsArray$singleton(value)));
				return A3($elm$core$Elm$JsArray$unsafeSet, pos, newSub, tree);
			}
		}
	});
var $elm$core$Array$unsafeReplaceTail = F2(
	function (newTail, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		var originalTailLen = $elm$core$Elm$JsArray$length(tail);
		var newTailLen = $elm$core$Elm$JsArray$length(newTail);
		var newArrayLen = len + (newTailLen - originalTailLen);
		if (_Utils_eq(newTailLen, $elm$core$Array$branchFactor)) {
			var overflow = _Utils_cmp(newArrayLen >>> $elm$core$Array$shiftStep, 1 << startShift) > 0;
			if (overflow) {
				var newShift = startShift + $elm$core$Array$shiftStep;
				var newTree = A4(
					$elm$core$Array$insertTailInTree,
					newShift,
					len,
					newTail,
					$elm$core$Elm$JsArray$singleton(
						$elm$core$Array$SubTree(tree)));
				return A4($elm$core$Array$Array_elm_builtin, newArrayLen, newShift, newTree, $elm$core$Elm$JsArray$empty);
			} else {
				return A4(
					$elm$core$Array$Array_elm_builtin,
					newArrayLen,
					startShift,
					A4($elm$core$Array$insertTailInTree, startShift, len, newTail, tree),
					$elm$core$Elm$JsArray$empty);
			}
		} else {
			return A4($elm$core$Array$Array_elm_builtin, newArrayLen, startShift, tree, newTail);
		}
	});
var $elm$core$Array$push = F2(
	function (a, array) {
		var tail = array.d;
		return A2(
			$elm$core$Array$unsafeReplaceTail,
			A2($elm$core$Elm$JsArray$push, a, tail),
			array);
	});
var $author$project$Sutra$Eval$arity = function (name) {
	return A2(
		$elm$core$List$member,
		name,
		_List_fromArray(
			['map', 'filter', 'range', 'min', 'max'])) ? $elm$core$Maybe$Just(2) : (A2(
		$elm$core$List$member,
		name,
		_List_fromArray(
			['foldl', 'foldr'])) ? $elm$core$Maybe$Just(3) : (A2(
		$elm$core$List$member,
		name,
		_List_fromArray(
			['length', 'head', 'tail', 'null', 'reverse', 'sum', 'not'])) ? $elm$core$Maybe$Just(1) : $elm$core$Maybe$Nothing));
};
var $author$project$Sutra$Ast$Native = F2(
	function (a, b) {
		return {$: 9, a: a, b: b};
	});
var $elm$core$Basics$min = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) < 0) ? x : y;
	});
var $author$project$Sutra$Eval$unfold = F4(
	function (name, expression, items, accumulator) {
		return $elm$core$Result$Ok(
			$elm$core$Maybe$Just(
				{
					a1: _Utils_ap(
						name,
						$elm$core$List$isEmpty(items) ? '_empty' : '_cons'),
					a4: _List_Nil,
					be: $elm$core$Maybe$Just(
						{
							aj: name,
							ad: $elm$core$List$isEmpty(items) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(0),
							aD: items,
							bf: accumulator
						}),
					h: expression
				}));
	});
var $author$project$Sutra$Eval$reduced = F2(
	function (rule, expression) {
		return $elm$core$Result$Ok(
			$elm$core$Maybe$Just(
				{a1: rule, a4: _List_Nil, be: $elm$core$Maybe$Nothing, h: expression}));
	});
var $author$project$Sutra$Eval$callable = function (expression) {
	switch (expression.$) {
		case 4:
			return true;
		case 9:
			return true;
		default:
			return false;
	}
};
var $author$project$Sutra$Eval$integerNumber = function (expression) {
	if (!expression.$) {
		var number = expression.a;
		return number;
	} else {
		return 0;
	}
};
var $elm$core$Basics$abs = function (n) {
	return (n < 0) ? (-n) : n;
};
var $elm$core$Basics$isNaN = _Basics_isNaN;
var $elm$core$Basics$isInfinite = _Basics_isInfinite;
var $author$project$Sutra$Eval$checkedInteger = function (number) {
	return ($elm$core$Basics$isNaN(number) || ($elm$core$Basics$isInfinite(number) || ($elm$core$Basics$abs(number) > 9007199254740991))) ? $elm$core$Result$Err('runtime_error: integer outside the safe 53-bit range') : $elm$core$Result$Ok(
		$author$project$Sutra$Ast$Integer(number));
};
var $author$project$Sutra$Eval$invoke = F2(
	function (name, _arguments) {
		var _v0 = _Utils_Tuple2(name, _arguments);
		_v0$16:
		while (true) {
			if (_v0.b.b) {
				if (!_v0.b.b.b) {
					switch (_v0.b.a.$) {
						case 1:
							if (_v0.a === 'not') {
								var _v24 = _v0.b;
								var _boolean = _v24.a.a;
								return A2(
									$author$project$Sutra$Eval$reduced,
									'not',
									$author$project$Sutra$Ast$Boolean(!_boolean));
							} else {
								break _v0$16;
							}
						case 2:
							switch (_v0.a) {
								case 'length':
									var _v15 = _v0.b;
									var items = _v15.a.a;
									return A2(
										$author$project$Sutra$Eval$reduced,
										'length',
										$author$project$Sutra$Ast$Integer(
											$elm$core$List$length(items)));
								case 'null':
									var _v16 = _v0.b;
									var items = _v16.a.a;
									return A2(
										$author$project$Sutra$Eval$reduced,
										'null',
										$author$project$Sutra$Ast$Boolean(
											$elm$core$List$isEmpty(items)));
								case 'reverse':
									var _v17 = _v0.b;
									var items = _v17.a.a;
									return A2(
										$author$project$Sutra$Eval$reduced,
										'reverse',
										$author$project$Sutra$Ast$ListLiteral(
											$elm$core$List$reverse(items)));
								case 'head':
									if (_v0.b.a.a.b) {
										var _v18 = _v0.b;
										var _v19 = _v18.a.a;
										var first = _v19.a;
										return A2($author$project$Sutra$Eval$reduced, 'head', first);
									} else {
										var _v20 = _v0.b;
										return $elm$core$Result$Err('runtime_error: head of empty list');
									}
								case 'tail':
									if (_v0.b.a.a.b) {
										var _v21 = _v0.b;
										var _v22 = _v21.a.a;
										var rest = _v22.b;
										return A2(
											$author$project$Sutra$Eval$reduced,
											'tail',
											$author$project$Sutra$Ast$ListLiteral(rest));
									} else {
										var _v23 = _v0.b;
										return $elm$core$Result$Err('runtime_error: tail of empty list');
									}
								case 'sum':
									var _v29 = _v0.b;
									var items = _v29.a.a;
									return A2(
										$elm$core$Result$andThen,
										$author$project$Sutra$Eval$reduced('sum'),
										A2(
											$elm$core$Result$map,
											$author$project$Sutra$Ast$Integer,
											A3(
												$elm$core$List$foldl,
												F2(
													function (item, accumulated) {
														return A2(
															$elm$core$Result$andThen,
															function (total) {
																if (!item.$) {
																	var number = item.a;
																	return A2(
																		$elm$core$Result$map,
																		$author$project$Sutra$Eval$integerNumber,
																		$author$project$Sutra$Eval$checkedInteger(total + number));
																} else {
																	return $elm$core$Result$Err('type_error: sum needs a list of integers');
																}
															},
															accumulated);
													}),
												$elm$core$Result$Ok(0),
												items)));
								default:
									break _v0$16;
							}
						default:
							break _v0$16;
					}
				} else {
					if (_v0.b.b.b.b) {
						if ((_v0.b.b.b.a.$ === 2) && (!_v0.b.b.b.b.b)) {
							switch (_v0.a) {
								case 'foldl':
									var _v7 = _v0.b;
									var _function = _v7.a;
									var _v8 = _v7.b;
									var accumulator = _v8.a;
									var _v9 = _v8.b;
									var items = _v9.a.a;
									if (!$author$project$Sutra$Eval$callable(_function)) {
										return $elm$core$Result$Err('type_error: foldl needs a function');
									} else {
										if (!items.b) {
											return A4(
												$author$project$Sutra$Eval$unfold,
												name,
												accumulator,
												items,
												$elm$core$Maybe$Just(accumulator));
										} else {
											var first = items.a;
											var rest = items.b;
											return A4(
												$author$project$Sutra$Eval$unfold,
												name,
												A2(
													$author$project$Sutra$Ast$Call,
													A2(
														$author$project$Sutra$Ast$Call,
														A2(
															$author$project$Sutra$Ast$Native,
															name,
															_List_fromArray(
																[_function])),
														A2(
															$author$project$Sutra$Ast$Call,
															A2($author$project$Sutra$Ast$Call, _function, accumulator),
															first)),
													$author$project$Sutra$Ast$ListLiteral(rest)),
												items,
												$elm$core$Maybe$Just(accumulator));
										}
									}
								case 'foldr':
									var _v11 = _v0.b;
									var _function = _v11.a;
									var _v12 = _v11.b;
									var accumulator = _v12.a;
									var _v13 = _v12.b;
									var items = _v13.a.a;
									if (!$author$project$Sutra$Eval$callable(_function)) {
										return $elm$core$Result$Err('type_error: foldr needs a function');
									} else {
										if (!items.b) {
											return A4(
												$author$project$Sutra$Eval$unfold,
												name,
												accumulator,
												items,
												$elm$core$Maybe$Just(accumulator));
										} else {
											var first = items.a;
											var rest = items.b;
											return A4(
												$author$project$Sutra$Eval$unfold,
												name,
												A2(
													$author$project$Sutra$Ast$Call,
													A2($author$project$Sutra$Ast$Call, _function, first),
													A2(
														$author$project$Sutra$Ast$Call,
														A2(
															$author$project$Sutra$Ast$Native,
															name,
															_List_fromArray(
																[_function, accumulator])),
														$author$project$Sutra$Ast$ListLiteral(rest))),
												items,
												$elm$core$Maybe$Just(accumulator));
										}
									}
								default:
									break _v0$16;
							}
						} else {
							break _v0$16;
						}
					} else {
						switch (_v0.b.b.a.$) {
							case 2:
								switch (_v0.a) {
									case 'map':
										var _v1 = _v0.b;
										var _function = _v1.a;
										var _v2 = _v1.b;
										var items = _v2.a.a;
										if (!$author$project$Sutra$Eval$callable(_function)) {
											return $elm$core$Result$Err('type_error: map needs a function');
										} else {
											if (!items.b) {
												return A4(
													$author$project$Sutra$Eval$unfold,
													name,
													$author$project$Sutra$Ast$ListLiteral(_List_Nil),
													items,
													$elm$core$Maybe$Nothing);
											} else {
												var first = items.a;
												var rest = items.b;
												return A4(
													$author$project$Sutra$Eval$unfold,
													name,
													A3(
														$author$project$Sutra$Ast$Binary,
														':',
														A2($author$project$Sutra$Ast$Call, _function, first),
														A2(
															$author$project$Sutra$Ast$Call,
															A2(
																$author$project$Sutra$Ast$Native,
																name,
																_List_fromArray(
																	[_function])),
															$author$project$Sutra$Ast$ListLiteral(rest))),
													items,
													$elm$core$Maybe$Nothing);
											}
										}
									case 'filter':
										var _v4 = _v0.b;
										var predicate = _v4.a;
										var _v5 = _v4.b;
										var items = _v5.a.a;
										if (!$author$project$Sutra$Eval$callable(predicate)) {
											return $elm$core$Result$Err('type_error: filter needs a function');
										} else {
											var restExpression = function (rest) {
												return A2(
													$author$project$Sutra$Ast$Call,
													A2(
														$author$project$Sutra$Ast$Native,
														name,
														_List_fromArray(
															[predicate])),
													$author$project$Sutra$Ast$ListLiteral(rest));
											};
											if (!items.b) {
												return A4(
													$author$project$Sutra$Eval$unfold,
													name,
													$author$project$Sutra$Ast$ListLiteral(_List_Nil),
													items,
													$elm$core$Maybe$Nothing);
											} else {
												var first = items.a;
												var rest = items.b;
												return A4(
													$author$project$Sutra$Eval$unfold,
													name,
													A3(
														$author$project$Sutra$Ast$If,
														A2($author$project$Sutra$Ast$Call, predicate, first),
														A3(
															$author$project$Sutra$Ast$Binary,
															':',
															first,
															restExpression(rest)),
														restExpression(rest)),
													items,
													$elm$core$Maybe$Nothing);
											}
										}
									default:
										break _v0$16;
								}
							case 0:
								if (!_v0.b.a.$) {
									switch (_v0.a) {
										case 'min':
											var _v25 = _v0.b;
											var left = _v25.a.a;
											var _v26 = _v25.b;
											var right = _v26.a.a;
											return A2(
												$author$project$Sutra$Eval$reduced,
												'min',
												$author$project$Sutra$Ast$Integer(
													A2($elm$core$Basics$min, left, right)));
										case 'max':
											var _v27 = _v0.b;
											var left = _v27.a.a;
											var _v28 = _v27.b;
											var right = _v28.a.a;
											return A2(
												$author$project$Sutra$Eval$reduced,
												'max',
												$author$project$Sutra$Ast$Integer(
													A2($elm$core$Basics$max, left, right)));
										case 'range':
											var _v31 = _v0.b;
											var first = _v31.a.a;
											var _v32 = _v31.b;
											var last = _v32.a.a;
											var count = A2($elm$core$Basics$max, 0, (last - first) + 1);
											return (count > 10000) ? $elm$core$Result$Err('runtime_error: range exceeds 10000 elements') : A2(
												$author$project$Sutra$Eval$reduced,
												'range',
												$author$project$Sutra$Ast$ListLiteral(
													A2(
														$elm$core$List$map,
														function (offset) {
															return $author$project$Sutra$Ast$Integer(first + offset);
														},
														A2(
															$elm$core$List$range,
															0,
															$elm$core$Basics$floor(count) - 1))));
										default:
											break _v0$16;
									}
								} else {
									break _v0$16;
								}
							default:
								break _v0$16;
						}
					}
				}
			} else {
				break _v0$16;
			}
		}
		return $elm$core$Result$Err('type_error: wrong argument types for ' + name);
	});
var $elm$core$Dict$union = F2(
	function (t1, t2) {
		return A3($elm$core$Dict$foldl, $elm$core$Dict$insert, t2, t1);
	});
var $elm$core$Set$union = F2(
	function (_v0, _v1) {
		var dict1 = _v0;
		var dict2 = _v1;
		return A2($elm$core$Dict$union, dict1, dict2);
	});
var $author$project$Sutra$Ast$children = function (expression) {
	switch (expression.$) {
		case 2:
			var values = expression.a;
			return values;
		case 4:
			var body = expression.b;
			return _List_fromArray(
				[body]);
		case 5:
			var _function = expression.a;
			var argument = expression.b;
			return _List_fromArray(
				[_function, argument]);
		case 6:
			var value = expression.b;
			var body = expression.c;
			return _List_fromArray(
				[value, body]);
		case 7:
			var condition = expression.a;
			var yes = expression.b;
			var no = expression.c;
			return _List_fromArray(
				[condition, yes, no]);
		case 8:
			var left = expression.b;
			var right = expression.c;
			return _List_fromArray(
				[left, right]);
		case 9:
			var _arguments = expression.b;
			return _arguments;
		default:
			return _List_Nil;
	}
};
var $author$project$Sutra$Ast$allNames = function (expression) {
	var below = A3(
		$elm$core$List$foldl,
		$elm$core$Set$union,
		$elm$core$Set$empty,
		A2(
			$elm$core$List$map,
			$author$project$Sutra$Ast$allNames,
			$author$project$Sutra$Ast$children(expression)));
	switch (expression.$) {
		case 3:
			var name = expression.a;
			return A2($elm$core$Set$insert, name, below);
		case 4:
			var name = expression.a;
			return A2($elm$core$Set$insert, name, below);
		case 6:
			var name = expression.a;
			return A2($elm$core$Set$insert, name, below);
		default:
			return below;
	}
};
var $author$project$Sutra$Ast$freshName = F3(
	function (base, taken, number) {
		freshName:
		while (true) {
			var candidate = base + ('_' + $elm$core$String$fromInt(number));
			if (A2($elm$core$Set$member, candidate, taken)) {
				var $temp$base = base,
					$temp$taken = taken,
					$temp$number = number + 1;
				base = $temp$base;
				taken = $temp$taken;
				number = $temp$number;
				continue freshName;
			} else {
				return candidate;
			}
		}
	});
var $elm$core$Dict$getMin = function (dict) {
	getMin:
	while (true) {
		if ((dict.$ === -1) && (dict.d.$ === -1)) {
			var left = dict.d;
			var $temp$dict = left;
			dict = $temp$dict;
			continue getMin;
		} else {
			return dict;
		}
	}
};
var $elm$core$Dict$moveRedLeft = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.e.d.$ === -1) && (!dict.e.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var lLeft = _v1.d;
			var lRight = _v1.e;
			var _v2 = dict.e;
			var rClr = _v2.a;
			var rK = _v2.b;
			var rV = _v2.c;
			var rLeft = _v2.d;
			var _v3 = rLeft.a;
			var rlK = rLeft.b;
			var rlV = rLeft.c;
			var rlL = rLeft.d;
			var rlR = rLeft.e;
			var rRight = _v2.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				0,
				rlK,
				rlV,
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					rlL),
				A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rlR, rRight));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v4 = dict.d;
			var lClr = _v4.a;
			var lK = _v4.b;
			var lV = _v4.c;
			var lLeft = _v4.d;
			var lRight = _v4.e;
			var _v5 = dict.e;
			var rClr = _v5.a;
			var rK = _v5.b;
			var rV = _v5.c;
			var rLeft = _v5.d;
			var rRight = _v5.e;
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$removeMin = function (dict) {
	if ((dict.$ === -1) && (dict.d.$ === -1)) {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var lColor = left.a;
		var lLeft = left.d;
		var right = dict.e;
		if (lColor === 1) {
			if ((lLeft.$ === -1) && (!lLeft.a)) {
				var _v3 = lLeft.a;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					key,
					value,
					$elm$core$Dict$removeMin(left),
					right);
			} else {
				var _v4 = $elm$core$Dict$moveRedLeft(dict);
				if (_v4.$ === -1) {
					var nColor = _v4.a;
					var nKey = _v4.b;
					var nValue = _v4.c;
					var nLeft = _v4.d;
					var nRight = _v4.e;
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						$elm$core$Dict$removeMin(nLeft),
						nRight);
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			}
		} else {
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				value,
				$elm$core$Dict$removeMin(left),
				right);
		}
	} else {
		return $elm$core$Dict$RBEmpty_elm_builtin;
	}
};
var $elm$core$Dict$moveRedRight = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.d.d.$ === -1) && (!dict.d.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var _v2 = _v1.d;
			var _v3 = _v2.a;
			var llK = _v2.b;
			var llV = _v2.c;
			var llLeft = _v2.d;
			var llRight = _v2.e;
			var lRight = _v1.e;
			var _v4 = dict.e;
			var rClr = _v4.a;
			var rK = _v4.b;
			var rV = _v4.c;
			var rLeft = _v4.d;
			var rRight = _v4.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				0,
				lK,
				lV,
				A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					lRight,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight)));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v5 = dict.d;
			var lClr = _v5.a;
			var lK = _v5.b;
			var lV = _v5.c;
			var lLeft = _v5.d;
			var lRight = _v5.e;
			var _v6 = dict.e;
			var rClr = _v6.a;
			var rK = _v6.b;
			var rV = _v6.c;
			var rLeft = _v6.d;
			var rRight = _v6.e;
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$removeHelpPrepEQGT = F7(
	function (targetKey, dict, color, key, value, left, right) {
		if ((left.$ === -1) && (!left.a)) {
			var _v1 = left.a;
			var lK = left.b;
			var lV = left.c;
			var lLeft = left.d;
			var lRight = left.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				lK,
				lV,
				lLeft,
				A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, lRight, right));
		} else {
			_v2$2:
			while (true) {
				if ((right.$ === -1) && (right.a === 1)) {
					if (right.d.$ === -1) {
						if (right.d.a === 1) {
							var _v3 = right.a;
							var _v4 = right.d;
							var _v5 = _v4.a;
							return $elm$core$Dict$moveRedRight(dict);
						} else {
							break _v2$2;
						}
					} else {
						var _v6 = right.a;
						var _v7 = right.d;
						return $elm$core$Dict$moveRedRight(dict);
					}
				} else {
					break _v2$2;
				}
			}
			return dict;
		}
	});
var $elm$core$Dict$removeHelp = F2(
	function (targetKey, dict) {
		if (dict.$ === -2) {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_cmp(targetKey, key) < 0) {
				if ((left.$ === -1) && (left.a === 1)) {
					var _v4 = left.a;
					var lLeft = left.d;
					if ((lLeft.$ === -1) && (!lLeft.a)) {
						var _v6 = lLeft.a;
						return A5(
							$elm$core$Dict$RBNode_elm_builtin,
							color,
							key,
							value,
							A2($elm$core$Dict$removeHelp, targetKey, left),
							right);
					} else {
						var _v7 = $elm$core$Dict$moveRedLeft(dict);
						if (_v7.$ === -1) {
							var nColor = _v7.a;
							var nKey = _v7.b;
							var nValue = _v7.c;
							var nLeft = _v7.d;
							var nRight = _v7.e;
							return A5(
								$elm$core$Dict$balance,
								nColor,
								nKey,
								nValue,
								A2($elm$core$Dict$removeHelp, targetKey, nLeft),
								nRight);
						} else {
							return $elm$core$Dict$RBEmpty_elm_builtin;
						}
					}
				} else {
					return A5(
						$elm$core$Dict$RBNode_elm_builtin,
						color,
						key,
						value,
						A2($elm$core$Dict$removeHelp, targetKey, left),
						right);
				}
			} else {
				return A2(
					$elm$core$Dict$removeHelpEQGT,
					targetKey,
					A7($elm$core$Dict$removeHelpPrepEQGT, targetKey, dict, color, key, value, left, right));
			}
		}
	});
var $elm$core$Dict$removeHelpEQGT = F2(
	function (targetKey, dict) {
		if (dict.$ === -1) {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_eq(targetKey, key)) {
				var _v1 = $elm$core$Dict$getMin(right);
				if (_v1.$ === -1) {
					var minKey = _v1.b;
					var minValue = _v1.c;
					return A5(
						$elm$core$Dict$balance,
						color,
						minKey,
						minValue,
						left,
						$elm$core$Dict$removeMin(right));
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			} else {
				return A5(
					$elm$core$Dict$balance,
					color,
					key,
					value,
					left,
					A2($elm$core$Dict$removeHelp, targetKey, right));
			}
		} else {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		}
	});
var $elm$core$Dict$remove = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$removeHelp, key, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Set$remove = F2(
	function (key, _v0) {
		var dict = _v0;
		return A2($elm$core$Dict$remove, key, dict);
	});
var $elm$core$Dict$singleton = F2(
	function (key, value) {
		return A5($elm$core$Dict$RBNode_elm_builtin, 1, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
	});
var $elm$core$Set$singleton = function (key) {
	return A2($elm$core$Dict$singleton, key, 0);
};
var $author$project$Sutra$Ast$freeVariables = function (expression) {
	switch (expression.$) {
		case 3:
			var name = expression.a;
			return $elm$core$Set$singleton(name);
		case 4:
			var name = expression.a;
			var body = expression.b;
			return A2(
				$elm$core$Set$remove,
				name,
				$author$project$Sutra$Ast$freeVariables(body));
		case 6:
			var name = expression.a;
			var value = expression.b;
			var body = expression.c;
			return A2(
				$elm$core$Set$union,
				$author$project$Sutra$Ast$freeVariables(value),
				A2(
					$elm$core$Set$remove,
					name,
					$author$project$Sutra$Ast$freeVariables(body)));
		default:
			return A3(
				$elm$core$List$foldl,
				$elm$core$Set$union,
				$elm$core$Set$empty,
				A2(
					$elm$core$List$map,
					$author$project$Sutra$Ast$freeVariables,
					$author$project$Sutra$Ast$children(expression)));
	}
};
var $author$project$Sutra$Ast$replace = F4(
	function (target, replacement, replacementFree, expression) {
		var go = A3($author$project$Sutra$Ast$replace, target, replacement, replacementFree);
		var underBinder = F2(
			function (name, body) {
				if (_Utils_eq(name, target) || (!A2(
					$elm$core$Set$member,
					target,
					$author$project$Sutra$Ast$freeVariables(body)))) {
					return _Utils_Tuple2(name, body);
				} else {
					if (A2($elm$core$Set$member, name, replacementFree)) {
						var taken = A2(
							$elm$core$Set$insert,
							target,
							A2(
								$elm$core$Set$union,
								$author$project$Sutra$Ast$allNames(body),
								$author$project$Sutra$Ast$allNames(replacement)));
						var fresh = A3($author$project$Sutra$Ast$freshName, name, taken, 1);
						var renamed = A3(
							$author$project$Sutra$Ast$substitute,
							name,
							$author$project$Sutra$Ast$Variable(fresh),
							body);
						return _Utils_Tuple2(
							fresh,
							go(renamed));
					} else {
						return _Utils_Tuple2(
							name,
							go(body));
					}
				}
			});
		switch (expression.$) {
			case 3:
				var name = expression.a;
				return _Utils_eq(name, target) ? replacement : expression;
			case 4:
				var name = expression.a;
				var body = expression.b;
				var _v1 = A2(underBinder, name, body);
				var safeName = _v1.a;
				var safeBody = _v1.b;
				return A2($author$project$Sutra$Ast$Lambda, safeName, safeBody);
			case 6:
				var name = expression.a;
				var value = expression.b;
				var body = expression.c;
				var _v2 = A2(underBinder, name, body);
				var safeName = _v2.a;
				var safeBody = _v2.b;
				return A3(
					$author$project$Sutra$Ast$Let,
					safeName,
					go(value),
					safeBody);
			case 2:
				var values = expression.a;
				return $author$project$Sutra$Ast$ListLiteral(
					A2($elm$core$List$map, go, values));
			case 5:
				var _function = expression.a;
				var argument = expression.b;
				return A2(
					$author$project$Sutra$Ast$Call,
					go(_function),
					go(argument));
			case 7:
				var condition = expression.a;
				var yes = expression.b;
				var no = expression.c;
				return A3(
					$author$project$Sutra$Ast$If,
					go(condition),
					go(yes),
					go(no));
			case 8:
				var operator = expression.a;
				var left = expression.b;
				var right = expression.c;
				return A3(
					$author$project$Sutra$Ast$Binary,
					operator,
					go(left),
					go(right));
			case 9:
				var name = expression.a;
				var _arguments = expression.b;
				return A2(
					$author$project$Sutra$Ast$Native,
					name,
					A2($elm$core$List$map, go, _arguments));
			default:
				return expression;
		}
	});
var $author$project$Sutra$Ast$substitute = F3(
	function (target, replacement, expression) {
		return A4(
			$author$project$Sutra$Ast$replace,
			target,
			replacement,
			$author$project$Sutra$Ast$freeVariables(replacement),
			expression);
	});
var $author$project$Sutra$Eval$equal = F2(
	function (left, right) {
		var _v3 = _Utils_Tuple2(left, right);
		_v3$3:
		while (true) {
			switch (_v3.a.$) {
				case 0:
					if (!_v3.b.$) {
						var a = _v3.a.a;
						var b = _v3.b.a;
						return $elm$core$Result$Ok(
							_Utils_eq(a, b));
					} else {
						break _v3$3;
					}
				case 1:
					if (_v3.b.$ === 1) {
						var a = _v3.a.a;
						var b = _v3.b.a;
						return $elm$core$Result$Ok(
							_Utils_eq(a, b));
					} else {
						break _v3$3;
					}
				case 2:
					if (_v3.b.$ === 2) {
						var a = _v3.a.a;
						var b = _v3.b.a;
						return A2($author$project$Sutra$Eval$equalLists, a, b);
					} else {
						break _v3$3;
					}
				default:
					break _v3$3;
			}
		}
		return $elm$core$Result$Err('type_error: equality requires matching, non-function values');
	});
var $author$project$Sutra$Eval$equalLists = F2(
	function (left, right) {
		var _v0 = _Utils_Tuple2(left, right);
		if (!_v0.a.b) {
			if (!_v0.b.b) {
				return $elm$core$Result$Ok(true);
			} else {
				return $elm$core$Result$Ok(false);
			}
		} else {
			if (!_v0.b.b) {
				return $elm$core$Result$Ok(false);
			} else {
				var _v1 = _v0.a;
				var a = _v1.a;
				var aa = _v1.b;
				var _v2 = _v0.b;
				var b = _v2.a;
				var bb = _v2.b;
				return A2(
					$elm$core$Result$andThen,
					function (same) {
						return same ? A2($author$project$Sutra$Eval$equalLists, aa, bb) : $elm$core$Result$Ok(false);
					},
					A2($author$project$Sutra$Eval$equal, a, b));
			}
		}
	});
var $author$project$Sutra$Eval$quotient = F2(
	function (numerator, denominator) {
		var b = $elm$core$Basics$abs(denominator);
		var a = $elm$core$Basics$abs(numerator);
		var estimate = $elm$core$Basics$floor(a / b);
		var product = estimate * b;
		var corrected = (_Utils_cmp(product, a) > 0) ? (estimate - 1) : ((_Utils_cmp(a - product, b) > -1) ? (estimate + 1) : estimate);
		return (!_Utils_eq(numerator < 0, denominator < 0)) ? (-corrected) : corrected;
	});
var $author$project$Sutra$Eval$binaryOperator = F3(
	function (operator, left, right) {
		if (operator === ':') {
			if (right.$ === 2) {
				var items = right.a;
				return $elm$core$Result$Ok(
					$author$project$Sutra$Ast$ListLiteral(
						A2($elm$core$List$cons, left, items)));
			} else {
				return $elm$core$Result$Err('type_error: the right operand of \u0027:\u0027 must be a list');
			}
		} else {
			if ((operator === '==') || (operator === '/=')) {
				return A2(
					$elm$core$Result$map,
					function (same) {
						return $author$project$Sutra$Ast$Boolean(
							(operator === '==') ? same : (!same));
					},
					A2($author$project$Sutra$Eval$equal, left, right));
			} else {
				var _v1 = _Utils_Tuple2(left, right);
				if ((!_v1.a.$) && (!_v1.b.$)) {
					var a = _v1.a.a;
					var b = _v1.b.a;
					switch (operator) {
						case '+':
							return $author$project$Sutra$Eval$checkedInteger(a + b);
						case '-':
							return $author$project$Sutra$Eval$checkedInteger(a - b);
						case '*':
							return $author$project$Sutra$Eval$checkedInteger(a * b);
						case '/':
							return (!b) ? $elm$core$Result$Err('runtime_error: division by zero') : $author$project$Sutra$Eval$checkedInteger(
								A2($author$project$Sutra$Eval$quotient, a, b));
						case '%':
							return (!b) ? $elm$core$Result$Err('runtime_error: modulo by zero') : $author$project$Sutra$Eval$checkedInteger(
								a - (A2($author$project$Sutra$Eval$quotient, a, b) * b));
						case '<':
							return $elm$core$Result$Ok(
								$author$project$Sutra$Ast$Boolean(
									_Utils_cmp(a, b) < 0));
						case '<=':
							return $elm$core$Result$Ok(
								$author$project$Sutra$Ast$Boolean(
									_Utils_cmp(a, b) < 1));
						case '>':
							return $elm$core$Result$Ok(
								$author$project$Sutra$Ast$Boolean(
									_Utils_cmp(a, b) > 0));
						case '>=':
							return $elm$core$Result$Ok(
								$author$project$Sutra$Ast$Boolean(
									_Utils_cmp(a, b) > -1));
						default:
							return $elm$core$Result$Err('type_error: unknown operator ' + operator);
					}
				} else {
					return $elm$core$Result$Err('type_error: operator \u0027' + (operator + '\u0027 needs integers'));
				}
			}
		}
	});
var $author$project$Sutra$Eval$stepAt = F3(
	function (depth, program, expression) {
		var descend = F3(
			function (index, rebuild, child) {
				return A2(
					$elm$core$Result$andThen,
					function (result) {
						if (!result.$) {
							var reduction = result.a;
							return $elm$core$Result$Ok(
								$elm$core$Maybe$Just(
									_Utils_update(
										reduction,
										{
											a4: A2($elm$core$List$cons, index, reduction.a4),
											h: rebuild(reduction.h)
										})));
						} else {
							return $elm$core$Result$Err('runtime_error: expected a reducible child');
						}
					},
					A3($author$project$Sutra$Eval$stepAt, depth + 1, program, child));
			});
		var reduceList = F3(
			function (index, previous, remaining) {
				reduceList:
				while (true) {
					if (remaining.b) {
						var first = remaining.a;
						var rest = remaining.b;
						if ($author$project$Sutra$Ast$isValue(first)) {
							var $temp$index = index + 1,
								$temp$previous = A2($elm$core$List$cons, first, previous),
								$temp$remaining = rest;
							index = $temp$index;
							previous = $temp$previous;
							remaining = $temp$remaining;
							continue reduceList;
						} else {
							return A3(
								descend,
								index,
								function (next) {
									return $author$project$Sutra$Ast$ListLiteral(
										_Utils_ap(
											$elm$core$List$reverse(previous),
											A2($elm$core$List$cons, next, rest)));
								},
								first);
						}
					} else {
						return $elm$core$Result$Ok($elm$core$Maybe$Nothing);
					}
				}
			});
		if (depth > 512) {
			return $elm$core$Result$Err('runtime_error: expression nesting exceeds 512');
		} else {
			switch (expression.$) {
				case 3:
					var name = expression.a;
					var _v2 = A2($elm$core$Dict$get, name, program);
					if (!_v2.$) {
						var body = _v2.a;
						return A2($author$project$Sutra$Eval$reduced, 'definition', body);
					} else {
						var _v3 = $author$project$Sutra$Eval$arity(name);
						if (!_v3.$) {
							return A2(
								$author$project$Sutra$Eval$reduced,
								'builtin_reference',
								A2($author$project$Sutra$Ast$Native, name, _List_Nil));
						} else {
							return $elm$core$Result$Err('unbound: ' + name);
						}
					}
				case 5:
					var _function = expression.a;
					var argument = expression.b;
					if (!$author$project$Sutra$Ast$isValue(_function)) {
						return A3(
							descend,
							0,
							function (next) {
								return A2($author$project$Sutra$Ast$Call, next, argument);
							},
							_function);
					} else {
						if (!$author$project$Sutra$Ast$isValue(argument)) {
							return A3(
								descend,
								1,
								$author$project$Sutra$Ast$Call(_function),
								argument);
						} else {
							switch (_function.$) {
								case 4:
									var name = _function.a;
									var body = _function.b;
									return A2(
										$author$project$Sutra$Eval$reduced,
										'beta',
										A3($author$project$Sutra$Ast$substitute, name, argument, body));
								case 9:
									var name = _function.a;
									var previous = _function.b;
									var _arguments = _Utils_ap(
										previous,
										_List_fromArray(
											[argument]));
									var _v5 = $author$project$Sutra$Eval$arity(name);
									if (!_v5.$) {
										var count = _v5.a;
										return (_Utils_cmp(
											$elm$core$List$length(_arguments),
											count) < 0) ? A2(
											$author$project$Sutra$Eval$reduced,
											'partial_application',
											A2($author$project$Sutra$Ast$Native, name, _arguments)) : A2($author$project$Sutra$Eval$invoke, name, _arguments);
									} else {
										return $elm$core$Result$Err('unbound: ' + name);
									}
								default:
									return $elm$core$Result$Err('type_error: application requires a function');
							}
						}
					}
				case 6:
					var name = expression.a;
					var value = expression.b;
					var body = expression.c;
					return $author$project$Sutra$Ast$isValue(value) ? A2(
						$author$project$Sutra$Eval$reduced,
						'let',
						A3($author$project$Sutra$Ast$substitute, name, value, body)) : A3(
						descend,
						0,
						function (next) {
							return A3($author$project$Sutra$Ast$Let, name, next, body);
						},
						value);
				case 7:
					var condition = expression.a;
					var yes = expression.b;
					var no = expression.c;
					if (!$author$project$Sutra$Ast$isValue(condition)) {
						return A3(
							descend,
							0,
							function (next) {
								return A3($author$project$Sutra$Ast$If, next, yes, no);
							},
							condition);
					} else {
						if (condition.$ === 1) {
							if (condition.a) {
								return A2($author$project$Sutra$Eval$reduced, 'if_true', yes);
							} else {
								return A2($author$project$Sutra$Eval$reduced, 'if_false', no);
							}
						} else {
							return $elm$core$Result$Err('type_error: if condition must be a boolean');
						}
					}
				case 2:
					var values = expression.a;
					return A3(reduceList, 0, _List_Nil, values);
				case 8:
					var operator = expression.a;
					var left = expression.b;
					var right = expression.c;
					if (!$author$project$Sutra$Ast$isValue(left)) {
						return A3(
							descend,
							0,
							function (next) {
								return A3($author$project$Sutra$Ast$Binary, operator, next, right);
							},
							left);
					} else {
						if ((operator === '&&') || (operator === '||')) {
							if (left.$ === 1) {
								var _boolean = left.a;
								if (((operator === '&&') && (!_boolean)) || ((operator === '||') && _boolean)) {
									return A2($author$project$Sutra$Eval$reduced, 'short_circuit', left);
								} else {
									if (!$author$project$Sutra$Ast$isValue(right)) {
										return A3(
											descend,
											1,
											A2($author$project$Sutra$Ast$Binary, operator, left),
											right);
									} else {
										if (right.$ === 1) {
											return A2($author$project$Sutra$Eval$reduced, 'boolean_operator', right);
										} else {
											return $elm$core$Result$Err('type_error: boolean operator needs booleans');
										}
									}
								}
							} else {
								return $elm$core$Result$Err('type_error: boolean operator needs booleans');
							}
						} else {
							if (!$author$project$Sutra$Ast$isValue(right)) {
								return A3(
									descend,
									1,
									A2($author$project$Sutra$Ast$Binary, operator, left),
									right);
							} else {
								return A2(
									$elm$core$Result$andThen,
									$author$project$Sutra$Eval$reduced('operator'),
									A3($author$project$Sutra$Eval$binaryOperator, operator, left, right));
							}
						}
					}
				default:
					return $elm$core$Result$Ok($elm$core$Maybe$Nothing);
			}
		}
	});
var $author$project$Sutra$Eval$step = F2(
	function (program, expression) {
		return A3($author$project$Sutra$Eval$stepAt, 0, program, expression);
	});
var $elm$core$Array$length = function (_v0) {
	var len = _v0.a;
	return len;
};
var $author$project$Sutra$Session$atPath = F2(
	function (path, expression) {
		if (!path.b) {
			return $elm$core$Maybe$Just(expression);
		} else {
			var index = path.a;
			var rest = path.b;
			var children = function () {
				switch (expression.$) {
					case 5:
						var a = expression.a;
						var b = expression.b;
						return _List_fromArray(
							[a, b]);
					case 8:
						var a = expression.b;
						var b = expression.c;
						return _List_fromArray(
							[a, b]);
					case 6:
						var a = expression.b;
						var b = expression.c;
						return _List_fromArray(
							[a, b]);
					case 7:
						var a = expression.a;
						var b = expression.b;
						var c = expression.c;
						return _List_fromArray(
							[a, b, c]);
					case 2:
						var values = expression.a;
						return values;
					case 4:
						var body = expression.b;
						return _List_fromArray(
							[body]);
					case 9:
						var values = expression.b;
						return values;
					default:
						return _List_Nil;
				}
			}();
			return A2(
				$elm$core$Maybe$andThen,
				$author$project$Sutra$Session$atPath(rest),
				$elm$core$List$head(
					A2($elm$core$List$drop, index, children)));
		}
	});
var $author$project$Sutra$Session$foldlAccumulator = function (expression) {
	_v0$2:
	while (true) {
		if (expression.$ === 5) {
			switch (expression.a.$) {
				case 9:
					if ((((expression.a.a === 'foldl') && expression.a.b.b) && expression.a.b.b.b) && (!expression.a.b.b.b.b)) {
						var _v1 = expression.a;
						var _v2 = _v1.b;
						var _v3 = _v2.b;
						var accumulator = _v3.a;
						return $elm$core$Maybe$Just(accumulator);
					} else {
						break _v0$2;
					}
				case 5:
					if ((((expression.a.a.$ === 9) && (expression.a.a.a === 'foldl')) && expression.a.a.b.b) && (!expression.a.a.b.b.b)) {
						var _v4 = expression.a;
						var _v5 = _v4.a;
						var _v6 = _v5.b;
						var accumulator = _v4.b;
						return $author$project$Sutra$Ast$isValue(accumulator) ? $elm$core$Maybe$Just(accumulator) : $elm$core$Maybe$Nothing;
					} else {
						break _v0$2;
					}
				default:
					break _v0$2;
			}
		} else {
			break _v0$2;
		}
	}
	return $elm$core$Maybe$Nothing;
};
var $author$project$Sutra$Session$updateActivity = F2(
	function (frame, reduction) {
		var withUnfold = function () {
			var _v8 = reduction.be;
			if (_v8.$ === 1) {
				return frame;
			} else {
				var active = _v8.a;
				var matches = function (old) {
					return _Utils_eq(old.aj, active.aj) && (_Utils_eq(
						$elm$core$List$length(old.ag),
						$elm$core$List$length(active.aD) + 1) && (_Utils_eq(
						A2($elm$core$List$drop, 1, old.ag),
						active.aD) && (_Utils_eq(reduction.a4, old.U) || _Utils_eq(
						reduction.a4,
						_Utils_ap(
							old.U,
							_List_fromArray(
								[1]))))));
				};
				var prior = $elm$core$List$head(
					A2($elm$core$List$filter, matches, frame.Q));
				var original = A2(
					$elm$core$Maybe$withDefault,
					active.aD,
					A2(
						$elm$core$Maybe$map,
						function ($) {
							return $.ap;
						},
						prior));
				var base = A2(
					$elm$core$Maybe$withDefault,
					reduction.a4,
					A2(
						$elm$core$Maybe$map,
						function ($) {
							return $.J;
						},
						prior));
				var visual = {
					J: base,
					aj: active.aj,
					ad: $elm$core$List$isEmpty(active.aD) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(
						$elm$core$List$length(original) - $elm$core$List$length(active.aD)),
					aF: ((active.aj === 'foldr') && (!$elm$core$List$isEmpty(active.aD))) ? 'Unfolding' : ($elm$core$List$isEmpty(active.aD) ? 'Complete' : 'Processing'),
					U: reduction.a4,
					ap: original,
					ag: active.aD,
					bf: active.bf
				};
				var pending = ((active.aj === 'foldr') && (!$elm$core$List$isEmpty(active.aD))) ? A2(
					$elm$core$List$cons,
					{D: reduction.a4, Y: visual},
					frame.t) : frame.t;
				var operations = A2(
					$elm$core$List$cons,
					visual,
					A2(
						$elm$core$List$filter,
						function (old) {
							return (!_Utils_eq(old.aj, visual.aj)) || (!_Utils_eq(old.J, visual.J));
						},
						frame.Q));
				return _Utils_update(
					frame,
					{
						be: $elm$core$Maybe$Just(visual),
						Q: operations,
						t: pending
					});
			}
		}();
		var readyFold = (!_Utils_eq(reduction.be, $elm$core$Maybe$Nothing)) ? $elm$core$Maybe$Nothing : A2(
			$elm$core$Maybe$andThen,
			function (pending) {
				var _v6 = A2($author$project$Sutra$Session$atPath, pending.D, frame.h);
				if ((!_v6.$) && (_v6.a.$ === 5)) {
					var _v7 = _v6.a;
					var _function = _v7.a;
					var argument = _v7.b;
					return ($author$project$Sutra$Ast$isValue(_function) && $author$project$Sutra$Ast$isValue(argument)) ? $elm$core$Maybe$Just(
						_Utils_Tuple2(pending, argument)) : $elm$core$Maybe$Nothing;
				} else {
					return $elm$core$Maybe$Nothing;
				}
			},
			$elm$core$List$head(
				A2(
					$elm$core$List$filter,
					function (pending) {
						return _Utils_eq(pending.D, reduction.a4);
					},
					frame.t)));
		var withCombine = function () {
			if (readyFold.$ === 1) {
				return withUnfold;
			} else {
				var _v5 = readyFold.a;
				var pending = _v5.a;
				var argument = _v5.b;
				var old = pending.Y;
				var visual = _Utils_update(
					old,
					{
						aF: 'Combining from the right',
						bf: $elm$core$Maybe$Just(argument)
					});
				return _Utils_update(
					withUnfold,
					{
						be: $elm$core$Maybe$Just(visual),
						t: A2(
							$elm$core$List$filter,
							function (item) {
								return !_Utils_eq(item.D, pending.D);
							},
							withUnfold.t),
						R: $elm$core$Maybe$Just(
							_Utils_update(
								pending,
								{Y: visual}))
					});
			}
		}();
		var withResult = function () {
			var _v2 = withCombine.R;
			if (_v2.$ === 1) {
				return withCombine;
			} else {
				var pending = _v2.a;
				var _v3 = A2($author$project$Sutra$Session$atPath, pending.D, reduction.h);
				if (!_v3.$) {
					var value = _v3.a;
					if ($author$project$Sutra$Ast$isValue(value)) {
						var old = pending.Y;
						return _Utils_update(
							withCombine,
							{
								be: $elm$core$Maybe$Just(
									_Utils_update(
										old,
										{
											aF: 'Accumulated',
											bf: $elm$core$Maybe$Just(value)
										})),
								R: $elm$core$Maybe$Nothing
							});
					} else {
						return withCombine;
					}
				} else {
					return withCombine;
				}
			}
		}();
		var _v0 = withResult.be;
		if (!_v0.$) {
			var active = _v0.a;
			if (active.aj === 'foldl') {
				var _v1 = A2(
					$elm$core$Maybe$andThen,
					$author$project$Sutra$Session$foldlAccumulator,
					A2($author$project$Sutra$Session$atPath, active.U, reduction.h));
				if (!_v1.$) {
					var accumulator = _v1.a;
					return _Utils_update(
						withResult,
						{
							be: $elm$core$Maybe$Just(
								_Utils_update(
									active,
									{
										bf: $elm$core$Maybe$Just(accumulator)
									}))
						});
				} else {
					return withResult;
				}
			} else {
				return withResult;
			}
		} else {
			return withResult;
		}
	});
var $author$project$Sutra$Session$advance = function (session) {
	if (_Utils_cmp(
		session.a8 + 1,
		$elm$core$Array$length(session.E)) < 0) {
		return _Utils_update(
			session,
			{a8: session.a8 + 1});
	} else {
		if ($author$project$Sutra$Session$finished(session)) {
			return session;
		} else {
			var append = function (next) {
				return _Utils_update(
					session,
					{
						a8: session.a8 + 1,
						E: A2($elm$core$Array$push, next, session.E)
					});
			};
			var frame = $author$project$Sutra$Session$current(session);
			var _v0 = A2($author$project$Sutra$Eval$step, session.m, frame.h);
			if (_v0.$ === 1) {
				var message = _v0.a;
				return append(
					_Utils_update(
						frame,
						{
							a1: $elm$core$Maybe$Nothing,
							v: $elm$core$Maybe$Just(message),
							a4: $elm$core$Maybe$Nothing
						}));
			} else {
				if (_v0.a.$ === 1) {
					var _v1 = _v0.a;
					return append(
						_Utils_update(
							frame,
							{
								a1: $elm$core$Maybe$Nothing,
								v: $elm$core$Maybe$Just('runtime_error: stuck expression'),
								a4: $elm$core$Maybe$Nothing
							}));
				} else {
					var reduction = _v0.a.a;
					var count = frame.a5 + 1;
					var next = A2($author$project$Sutra$Session$updateActivity, frame, reduction);
					var result = _Utils_update(
						next,
						{
							a1: $elm$core$Maybe$Just(reduction.a1),
							v: ((_Utils_cmp(count, session.K) > -1) && (!$author$project$Sutra$Ast$isValue(reduction.h))) ? $elm$core$Maybe$Just('step_limit') : $elm$core$Maybe$Nothing,
							a4: $elm$core$Maybe$Just(reduction.a4),
							a5: count,
							h: reduction.h
						});
					var terminalActivity = $author$project$Sutra$Ast$isValue(result.h) ? A2(
						$elm$core$Maybe$map,
						function (active) {
							return _Utils_update(
								active,
								{
									ad: $elm$core$Maybe$Nothing,
									aF: 'Complete',
									bf: (A2(
										$elm$core$List$member,
										active.aj,
										_List_fromArray(
											['foldl', 'foldr'])) && _Utils_eq(active.J, _List_Nil)) ? $elm$core$Maybe$Just(result.h) : active.bf
								});
						},
						result.be) : result.be;
					return append(
						_Utils_update(
							result,
							{be: terminalActivity}));
				}
			}
		}
	}
};
var $author$project$Main$prepared = function (model) {
	return _Utils_eq(model.f, $elm$core$Maybe$Nothing) ? $author$project$Main$load(model) : model;
};
var $author$project$Main$next = function (model) {
	var ready = $author$project$Main$prepared(model);
	var _v0 = ready.f;
	if (_v0.$ === 1) {
		return ready;
	} else {
		var session = _v0.a;
		var advanced = $author$project$Sutra$Session$advance(session);
		return _Utils_update(
			ready,
			{
				a: model.a && (!$author$project$Sutra$Session$finished(advanced)),
				f: $elm$core$Maybe$Just(advanced)
			});
	}
};
var $author$project$Sutra$Showcase$answerAt = F2(
	function (index, entry) {
		return A2($author$project$Sutra$Showcase$at, index, entry.af);
	});
var $author$project$Main$invalidate = function (model) {
	return _Utils_update(
		model,
		{v: $elm$core$Maybe$Nothing, a: false, f: $elm$core$Maybe$Nothing});
};
var $author$project$Main$update = F2(
	function (message, model) {
		switch (message.$) {
			case 0:
				var source = message.a;
				return $author$project$Main$invalidate(
					_Utils_update(
						model,
						{n: 'custom', m: source, A: $elm$core$Maybe$Nothing}));
			case 1:
				var source = message.a;
				return $author$project$Main$invalidate(
					_Utils_update(
						model,
						{n: 'custom', h: source, A: $elm$core$Maybe$Nothing}));
			case 3:
				var source = message.a;
				return $author$project$Main$invalidate(
					_Utils_update(
						model,
						{K: source}));
			case 4:
				var source = message.a;
				return _Utils_update(
					model,
					{
						x: A2(
							$elm$core$Maybe$withDefault,
							220,
							$elm$core$String$toInt(source))
					});
			case 2:
				var key = message.a;
				var _v1 = $author$project$Sutra$Examples$find(key);
				if (!_v1.$) {
					var example = _v1.a;
					return $author$project$Main$load(
						_Utils_update(
							model,
							{n: example.ab, m: example.m, h: example.h, A: $elm$core$Maybe$Nothing}));
				} else {
					return model;
				}
			case 5:
				return $author$project$Main$next(
					_Utils_update(
						model,
						{a: false}));
			case 6:
				return _Utils_update(
					model,
					{
						a: false,
						f: A2($elm$core$Maybe$map, $author$project$Sutra$Session$back, model.f)
					});
			case 8:
				return $author$project$Main$load(model);
			case 7:
				if (model.a) {
					return _Utils_update(
						model,
						{a: false});
				} else {
					var ready = $author$project$Main$prepared(model);
					return _Utils_update(
						ready,
						{
							a: A2(
								$elm$core$Maybe$withDefault,
								false,
								A2(
									$elm$core$Maybe$map,
									A2($elm$core$Basics$composeL, $elm$core$Basics$not, $author$project$Sutra$Session$finished),
									ready.f))
						});
				}
			case 9:
				return (model.a && (!model.q)) ? $author$project$Main$next(model) : model;
			case 10:
				var page = message.a;
				return _Utils_update(
					model,
					{q: page, a: false});
			case 11:
				var source = message.a;
				var _v2 = $elm$core$String$toInt(source);
				if (!_v2.$) {
					var index = _v2.a;
					var _v3 = A2($author$project$Sutra$Showcase$entryAt, index, model.N);
					if (!_v3.$) {
						return _Utils_update(
							model,
							{aa: index});
					} else {
						return model;
					}
				} else {
					return model;
				}
			case 12:
				var taskIndex = message.a;
				var answerIndex = message.b;
				var _v4 = A2($author$project$Sutra$Showcase$entryAt, taskIndex, model.N);
				if (_v4.$ === 1) {
					return model;
				} else {
					var entry = _v4.a;
					var _v5 = A2($author$project$Sutra$Showcase$answerAt, answerIndex, entry);
					if (_v5.$ === 1) {
						return model;
					} else {
						var answer = _v5.a;
						return $author$project$Main$load(
							_Utils_update(
								model,
								{
									q: 0,
									K: '10000',
									n: 'custom',
									m: answer.m,
									h: entry.a_,
									aa: taskIndex,
									A: $elm$core$Maybe$Just(
										{ac: entry.ac, ae: answer.ae, L: entry.L, _: answer._})
								}));
					}
				}
			default:
				return model;
		}
	});
var $elm$core$Task$onError = _Scheduler_onError;
var $elm$core$Task$attempt = F2(
	function (resultToMessage, task) {
		return $elm$core$Task$command(
			A2(
				$elm$core$Task$onError,
				A2(
					$elm$core$Basics$composeL,
					A2($elm$core$Basics$composeL, $elm$core$Task$succeed, resultToMessage),
					$elm$core$Result$Err),
				A2(
					$elm$core$Task$andThen,
					A2(
						$elm$core$Basics$composeL,
						A2($elm$core$Basics$composeL, $elm$core$Task$succeed, resultToMessage),
						$elm$core$Result$Ok),
					task)));
	});
var $elm$browser$Browser$element = _Browser_element;
var $elm$browser$Browser$Events$MySub = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $elm$browser$Browser$Events$State = F2(
	function (subs, pids) {
		return {ay: pids, az: subs};
	});
var $elm$browser$Browser$Events$init = $elm$core$Task$succeed(
	A2($elm$browser$Browser$Events$State, _List_Nil, $elm$core$Dict$empty));
var $elm$browser$Browser$Events$Event = F2(
	function (key, event) {
		return {aw: key, aC: event};
	});
var $elm$browser$Browser$Events$spawn = F3(
	function (router, key, _v0) {
		var node = _v0.a;
		var name = _v0.b;
		var actualNode = function () {
			if (!node) {
				return _Browser_doc;
			} else {
				return _Browser_window;
			}
		}();
		return A2(
			$elm$core$Task$map,
			function (value) {
				return _Utils_Tuple2(key, value);
			},
			A3(
				_Browser_on,
				actualNode,
				name,
				function (event) {
					return A2(
						$elm$core$Platform$sendToSelf,
						router,
						A2($elm$browser$Browser$Events$Event, key, event));
				}));
	});
var $elm$browser$Browser$Events$nodeToKey = function (node) {
	if (!node) {
		return 'd_';
	} else {
		return 'w_';
	}
};
var $elm$browser$Browser$Events$addKey = function (sub) {
	var node = sub.a;
	var name = sub.b;
	return _Utils_Tuple2(
		_Utils_ap(
			$elm$browser$Browser$Events$nodeToKey(node),
			name),
		sub);
};
var $elm$core$Dict$fromList = function (assocs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, dict) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($elm$core$Dict$insert, key, value, dict);
			}),
		$elm$core$Dict$empty,
		assocs);
};
var $elm$browser$Browser$Events$onEffects = F3(
	function (router, subs, state) {
		var stepRight = F3(
			function (key, sub, _v6) {
				var deads = _v6.a;
				var lives = _v6.b;
				var news = _v6.c;
				return _Utils_Tuple3(
					deads,
					lives,
					A2(
						$elm$core$List$cons,
						A3($elm$browser$Browser$Events$spawn, router, key, sub),
						news));
			});
		var stepLeft = F3(
			function (_v4, pid, _v5) {
				var deads = _v5.a;
				var lives = _v5.b;
				var news = _v5.c;
				return _Utils_Tuple3(
					A2($elm$core$List$cons, pid, deads),
					lives,
					news);
			});
		var stepBoth = F4(
			function (key, pid, _v2, _v3) {
				var deads = _v3.a;
				var lives = _v3.b;
				var news = _v3.c;
				return _Utils_Tuple3(
					deads,
					A3($elm$core$Dict$insert, key, pid, lives),
					news);
			});
		var newSubs = A2($elm$core$List$map, $elm$browser$Browser$Events$addKey, subs);
		var _v0 = A6(
			$elm$core$Dict$merge,
			stepLeft,
			stepBoth,
			stepRight,
			state.ay,
			$elm$core$Dict$fromList(newSubs),
			_Utils_Tuple3(_List_Nil, $elm$core$Dict$empty, _List_Nil));
		var deadPids = _v0.a;
		var livePids = _v0.b;
		var makeNewPids = _v0.c;
		return A2(
			$elm$core$Task$andThen,
			function (pids) {
				return $elm$core$Task$succeed(
					A2(
						$elm$browser$Browser$Events$State,
						newSubs,
						A2(
							$elm$core$Dict$union,
							livePids,
							$elm$core$Dict$fromList(pids))));
			},
			A2(
				$elm$core$Task$andThen,
				function (_v1) {
					return $elm$core$Task$sequence(makeNewPids);
				},
				$elm$core$Task$sequence(
					A2($elm$core$List$map, $elm$core$Process$kill, deadPids))));
	});
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (!_v0.$) {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $elm$browser$Browser$Events$onSelfMsg = F3(
	function (router, _v0, state) {
		var event = _v0.aC;
		var key = _v0.aw;
		var toMessage = function (_v2) {
			var subKey = _v2.a;
			var _v3 = _v2.b;
			var node = _v3.a;
			var name = _v3.b;
			var decoder = _v3.c;
			return _Utils_eq(subKey, key) ? A2(_Browser_decodeEvent, decoder, event) : $elm$core$Maybe$Nothing;
		};
		var messages = A2($elm$core$List$filterMap, toMessage, state.az);
		return A2(
			$elm$core$Task$andThen,
			function (_v1) {
				return $elm$core$Task$succeed(state);
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Platform$sendToApp(router),
					messages)));
	});
var $elm$browser$Browser$Events$subMap = F2(
	function (func, _v0) {
		var node = _v0.a;
		var name = _v0.b;
		var decoder = _v0.c;
		return A3(
			$elm$browser$Browser$Events$MySub,
			node,
			name,
			A2($elm$json$Json$Decode$map, func, decoder));
	});
_Platform_effectManagers['Browser.Events'] = _Platform_createManager($elm$browser$Browser$Events$init, $elm$browser$Browser$Events$onEffects, $elm$browser$Browser$Events$onSelfMsg, 0, $elm$browser$Browser$Events$subMap);
var $elm$browser$Browser$Events$subscription = _Platform_leaf('Browser.Events');
var $elm$browser$Browser$Events$on = F3(
	function (node, name, decoder) {
		return $elm$browser$Browser$Events$subscription(
			A3($elm$browser$Browser$Events$MySub, node, name, decoder));
	});
var $elm$browser$Browser$Events$Document = 0;
var $elm$browser$Browser$Events$onKeyDown = A2($elm$browser$Browser$Events$on, 0, 'keydown');
var $author$project$Main$FocusFinished = {$: 13};
var $elm$json$Json$Decode$map5 = _Json_map5;
var $elm$json$Json$Decode$oneOf = _Json_oneOf;
var $author$project$Main$keyboardShortcut = A2(
	$elm$json$Json$Decode$andThen,
	function (event) {
		if (event.aM || event.aO) {
			return $elm$json$Json$Decode$fail('keep the native editing shortcut');
		} else {
			var _v0 = event.aw;
			switch (_v0) {
				case 'ArrowRight':
					return $elm$json$Json$Decode$succeed($author$project$Main$Next);
				case 'ArrowLeft':
					return $elm$json$Json$Decode$succeed($author$project$Main$Previous);
				default:
					return $elm$json$Json$Decode$fail('not a playback shortcut');
			}
		}
	},
	A4(
		$elm$json$Json$Decode$map3,
		F3(
			function (key, blocked, editing) {
				return {aw: key, aM: blocked, aO: editing};
			}),
		A2($elm$json$Json$Decode$field, 'key', $elm$json$Json$Decode$string),
		A6(
			$elm$json$Json$Decode$map5,
			F5(
				function (ctrl, alt, meta, shift, consumed) {
					return ctrl || (alt || (meta || (shift || consumed)));
				}),
			A2($elm$json$Json$Decode$field, 'ctrlKey', $elm$json$Json$Decode$bool),
			A2($elm$json$Json$Decode$field, 'altKey', $elm$json$Json$Decode$bool),
			A2($elm$json$Json$Decode$field, 'metaKey', $elm$json$Json$Decode$bool),
			A2($elm$json$Json$Decode$field, 'shiftKey', $elm$json$Json$Decode$bool),
			A2($elm$json$Json$Decode$field, 'defaultPrevented', $elm$json$Json$Decode$bool)),
		A2(
			$elm$json$Json$Decode$field,
			'target',
			A3(
				$elm$json$Json$Decode$map2,
				F2(
					function (tag, editable) {
						return editable || A2(
							$elm$core$List$member,
							$elm$core$String$toUpper(tag),
							_List_fromArray(
								['INPUT', 'TEXTAREA', 'SELECT', 'OPTION']));
					}),
				A2($elm$json$Json$Decode$field, 'tagName', $elm$json$Json$Decode$string),
				$elm$json$Json$Decode$oneOf(
					_List_fromArray(
						[
							A2($elm$json$Json$Decode$field, 'isContentEditable', $elm$json$Json$Decode$bool),
							$elm$json$Json$Decode$succeed(false)
						]))))));
var $author$project$Main$main = $elm$browser$Browser$element(
	{
		a$: $author$project$Main$init,
		a2: $author$project$Main$view,
		bb: F2(
			function (message, model) {
				return _Utils_Tuple2(
					A2($author$project$Main$update, message, model),
					function () {
						if (message.$ === 12) {
							return A2(
								$elm$core$Task$attempt,
								function (_v1) {
									return $author$project$Main$FocusFinished;
								},
								$elm$browser$Browser$Dom$focus('control-step'));
						} else {
							return $elm$core$Platform$Cmd$none;
						}
					}());
			}),
		bl: function (model) {
			return (model.q === 1) ? $elm$core$Platform$Sub$none : $elm$core$Platform$Sub$batch(
				_List_fromArray(
					[
						$elm$browser$Browser$Events$onKeyDown($author$project$Main$keyboardShortcut),
						model.a ? A2($elm$time$Time$every, model.x, $author$project$Main$Tick) : $elm$core$Platform$Sub$none
					]));
		}
	});
_Platform_export({'Main':{'init':$author$project$Main$main($elm$json$Json$Decode$value)(0)}});}(this));