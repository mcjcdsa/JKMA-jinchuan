/**
 * 浏览器兼容性Polyfill
 * 为旧版浏览器提供现代JavaScript API支持
 */

// Object.assign polyfill (IE11支持)
if (typeof Object.assign !== 'function') {
    Object.assign = function(target) {
        if (target == null) {
            throw new TypeError('Cannot convert undefined or null to object');
        }
        var to = Object(target);
        for (var index = 1; index < arguments.length; index++) {
            var nextSource = arguments[index];
            if (nextSource != null) {
                for (var nextKey in nextSource) {
                    if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                        to[nextKey] = nextSource[nextKey];
                    }
                }
            }
        }
        return to;
    };
}

// Array.from polyfill (IE11支持)
if (!Array.from) {
    Array.from = function(arrayLike, mapFn, thisArg) {
        var C = this;
        var items = Object(arrayLike);
        if (arrayLike == null) {
            throw new TypeError('Array.from requires an array-like object - not null or undefined');
        }
        var mapFunction = typeof mapFn === 'undefined' ? undefined : mapFn;
        var T;
        if (typeof mapFunction !== 'undefined') {
            if (typeof mapFunction !== 'function') {
                throw new TypeError('Array.from: when provided, the second argument must be a function');
            }
            if (arguments.length > 2) {
                T = thisArg;
            }
        }
        var len = parseInt(items.length) || 0;
        var A = typeof C === 'function' ? Object(new C(len)) : new Array(len);
        var k = 0;
        var kValue;
        while (k < len) {
            kValue = items[k];
            if (mapFunction) {
                A[k] = typeof T === 'undefined' ? mapFunction(kValue, k) : mapFunction.call(T, kValue, k);
            } else {
                A[k] = kValue;
            }
            k += 1;
        }
        A.length = len;
        return A;
    };
}

// String.includes polyfill (IE11支持)
if (!String.prototype.includes) {
    String.prototype.includes = function(search, start) {
        if (typeof start !== 'number') {
            start = 0;
        }
        if (start + search.length > this.length) {
            return false;
        } else {
            return this.indexOf(search, start) !== -1;
        }
    };
}

// Array.includes polyfill (IE11支持)
if (!Array.prototype.includes) {
    Array.prototype.includes = function(searchElement, fromIndex) {
        if (this == null) {
            throw new TypeError('"this" is null or not defined');
        }
        var o = Object(this);
        var len = parseInt(o.length) || 0;
        if (len === 0) {
            return false;
        }
        var n = parseInt(fromIndex) || 0;
        var k;
        if (n >= 0) {
            k = n;
        } else {
            k = len + n;
            if (k < 0) {
                k = 0;
            }
        }
        function sameValueZero(x, y) {
            return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
        }
        for (; k < len; k++) {
            if (sameValueZero(o[k], searchElement)) {
                return true;
            }
        }
        return false;
    };
}

// Element.closest polyfill (IE11支持)
if (!Element.prototype.closest) {
    Element.prototype.closest = function(s) {
        var el = this;
        do {
            if (Element.prototype.matches.call(el, s)) return el;
            el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
    };
}

// Element.matches polyfill (IE11支持)
if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector || 
                                Element.prototype.webkitMatchesSelector;
}

// 检测并提示旧版浏览器用户
(function() {
    var isIE = /MSIE|Trident/.test(navigator.userAgent);
    var isOldBrowser = isIE || 
                      (navigator.userAgent.indexOf('Chrome') === -1 && 
                       navigator.userAgent.indexOf('Firefox') === -1 && 
                       navigator.userAgent.indexOf('Safari') === -1);
    
    if (isOldBrowser) {
        console.warn('您正在使用旧版浏览器，建议升级以获得更好的体验');
    }
})();

