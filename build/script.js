/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const global_1 = __webpack_require__(1);
const world_1 = __webpack_require__(2);
const layout_1 = __webpack_require__(17);
exports.g = new global_1.default;
document.addEventListener("DOMContentLoaded", function () {
    setConsts();
    new world_1.default({ cols: exports.g.sceneCols, rows: exports.g.sceneRows });
    layout_1.default();
    //setTimeout(test,500);
});
function setConsts() {
    exports.g.randomSeed = "0001";
    exports.g.kingdomNames = ["unclaimed", "Red Kingdom", "Blue Kingdom", "Green Kingdom"];
    exports.g.turnLength = 100;
    exports.g.sceneRows = 25;
    exports.g.sceneCols = 25;
    console.log(exports.g);
}
;
function runGame() {
    if (!exports.g.started) {
        exports.g.runner = setInterval(function () {
            nextRound();
        }, exports.g.turnLength);
        exports.g.started = true;
    }
    else {
        clearInterval(exports.g.runner);
        exports.g.started = false;
    }
}
exports.runGame = runGame;
;
function nextRound() {
    world_1.default.nextRound();
    layout_1.default();
}
;
function showPopulation() {
    exports.g.showPopulation = true;
}
exports.showPopulation = showPopulation;
;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Globals {
    constructor() {
        this.runner = 0;
        this.showPopulation = false;
        this.started = false;
        this.randomSeed = ""; // Seed for random number generation
        this.kingdomNames = []; // Name of the kingdoms
        this.turnLength = 0; // ms		   // Length of a turn
        this.sceneRows = 0; // Number of the rows of the Map
        this.sceneCols = 0; // Number of the coloumns of the Map
    }
}
exports.default = Globals;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const cell_1 = __webpack_require__(3);
const kingdom_1 = __webpack_require__(16);
const script_1 = __webpack_require__(0);
const seedrandom = __webpack_require__(4);
class World {
    constructor(dim) {
        this.numRows = dim.rows;
        this.numCols = dim.cols;
        if (this.numRows * this.numCols < 1) {
            console.error("Number of cells less than 1. Increase row or column number!");
        }
        this.initMap();
        this.initKingdoms();
    }
    initKingdoms() {
        const unclaimed = new kingdom_1.default(script_1.g.kingdomNames[0], "#7777cc", [], false, this);
        World.listOfCells.forEach(cell => unclaimed.claimTerritory(cell));
        const redKingdom = new kingdom_1.default(script_1.g.kingdomNames[1], "red", ["r0c0", "r0c1", "r1c0", "r2c0"], true, this);
        const blueKingdom = new kingdom_1.default(script_1.g.kingdomNames[2], "blue", ["r4c2", "r3c2", "r4c3", "r3c3"], true, this);
        const greenKingdom = new kingdom_1.default(script_1.g.kingdomNames[3], "green", ["r9c7", "r9c6", "r9c5", "r8c6"], true, this);
        World.listOfKingdoms = [unclaimed, redKingdom, blueKingdom, greenKingdom];
        World.listOfKingdoms.forEach(kingdom => kingdom.init());
    }
    initMap() {
        for (let i = 0; i < this.numRows; ++i) {
            World.map[i] = [];
            for (let j = 0; j < this.numCols; ++j) {
                var newCell = cell_1.default.initCell({ row: i, col: j });
                World.listOfCells.push(newCell);
                World.map[i][j] = newCell;
            }
        }
    }
    static nextRound() {
        var rng = seedrandom();
        World.listOfCells.forEach(cell => cell.nextRound());
        World.listOfKingdoms.forEach(kingdom => kingdom.nextRound(rng()));
    }
}
World.map = [[]];
World.listOfCells = [];
World.listOfKingdoms = [];
exports.default = World;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const script_1 = __webpack_require__(0);
const seedrandom = __webpack_require__(4);
class Cell {
    constructor(coordinates, type) {
        this.pos = coordinates;
        this.id = "r" + coordinates.row + "c" + coordinates.col;
        this.type = type;
        this.output = {
            money: 0,
            goods: 0,
            food: 0
        };
        // Efficiencies calculated from different elements for output calculation
        this.moneyEfficiency = 0;
        this.industryEfficiency = 0;
        this.agricultureEfficiency = 0;
        this.populationGrowth = 0;
        this.baseEfficiency = {
            money: 0.01,
            goods: 0.01,
            food: 0.01,
            people: 0.01
        };
        switch (this.type) {
            case LandType.Farm:
                this.wealth = 5;
                this.industry = 0;
                this.agriculture = 100;
                this.population = 10;
                break;
            case LandType.Settlement:
                this.wealth = 50;
                this.industry = 25;
                this.agriculture = 0;
                this.population = 100;
                break;
            case LandType.Forest:
                this.wealth = 20;
                this.industry = 25;
                this.agriculture = 20;
                this.population = 5;
                break;
            case LandType.Mountain:
                this.wealth = 50;
                this.industry = 100;
                this.agriculture = 0;
                this.population = 5;
                break;
            default:
                console.warn("Cell type not defined!");
        }
    }
    static initCell(coordinates) {
        const rng = seedrandom(script_1.g.randomSeed + coordinates.row + coordinates.col);
        const numberOfLandTypes = Object.keys(LandType).length / 2;
        const type = Math.floor(rng() * numberOfLandTypes);
        return new Cell(coordinates, type);
    }
    updateCell() {
        const populationPower = this.population; // TODO: Get a function with diminishing return;
        const excessFood = this.agriculture - this.population;
        this.moneyEfficiency = this.baseEfficiency.money * populationPower;
        this.industryEfficiency = this.baseEfficiency.goods * populationPower;
        this.agricultureEfficiency = this.baseEfficiency.food * populationPower;
        this.populationGrowth = this.baseEfficiency.people * populationPower * excessFood;
        this.population += this.populationGrowth;
    }
    generateOutput() {
        this.output.money = this.wealth * this.moneyEfficiency;
        this.output.goods = this.industry * this.industryEfficiency;
        this.output.food = this.agriculture * this.agricultureEfficiency;
        return this.output;
    }
    nextRound() {
        this.updateCell();
        Object.keys(this.output).map(function (i) {
            this.owner.income[i] += this.generateOutput()[i];
        }, this);
    }
}
exports.default = Cell;
var LandType;
(function (LandType) {
    LandType[LandType["Farm"] = 0] = "Farm";
    LandType[LandType["Settlement"] = 1] = "Settlement";
    LandType[LandType["Forest"] = 2] = "Forest";
    LandType[LandType["Mountain"] = 3] = "Mountain";
})(LandType = exports.LandType || (exports.LandType = {}));


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

// A library of seedable RNGs implemented in Javascript.
//
// Usage:
//
// var seedrandom = require('seedrandom');
// var random = seedrandom(1); // or any seed.
// var x = random();       // 0 <= x < 1.  Every bit is random.
// var x = random.quick(); // 0 <= x < 1.  32 bits of randomness.

// alea, a 53-bit multiply-with-carry generator by Johannes Baagøe.
// Period: ~2^116
// Reported to pass all BigCrush tests.
var alea = __webpack_require__(5);

// xor128, a pure xor-shift generator by George Marsaglia.
// Period: 2^128-1.
// Reported to fail: MatrixRank and LinearComp.
var xor128 = __webpack_require__(9);

// xorwow, George Marsaglia's 160-bit xor-shift combined plus weyl.
// Period: 2^192-2^32
// Reported to fail: CollisionOver, SimpPoker, and LinearComp.
var xorwow = __webpack_require__(10);

// xorshift7, by François Panneton and Pierre L'ecuyer, takes
// a different approach: it adds robustness by allowing more shifts
// than Marsaglia's original three.  It is a 7-shift generator
// with 256 bits, that passes BigCrush with no systmatic failures.
// Period 2^256-1.
// No systematic BigCrush failures reported.
var xorshift7 = __webpack_require__(11);

// xor4096, by Richard Brent, is a 4096-bit xor-shift with a
// very long period that also adds a Weyl generator. It also passes
// BigCrush with no systematic failures.  Its long period may
// be useful if you have many generators and need to avoid
// collisions.
// Period: 2^4128-2^32.
// No systematic BigCrush failures reported.
var xor4096 = __webpack_require__(12);

// Tyche-i, by Samuel Neves and Filipe Araujo, is a bit-shifting random
// number generator derived from ChaCha, a modern stream cipher.
// https://eden.dei.uc.pt/~sneves/pubs/2011-snfa2.pdf
// Period: ~2^127
// No systematic BigCrush failures reported.
var tychei = __webpack_require__(13);

// The original ARC4-based prng included in this library.
// Period: ~2^1600
var sr = __webpack_require__(14);

sr.alea = alea;
sr.xor128 = xor128;
sr.xorwow = xorwow;
sr.xorshift7 = xorshift7;
sr.xor4096 = xor4096;
sr.tychei = tychei;

module.exports = sr;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_RESULT__;// A port of an algorithm by Johannes Baagøe <baagoe@baagoe.com>, 2010
// http://baagoe.com/en/RandomMusings/javascript/
// https://github.com/nquinlan/better-random-numbers-for-javascript-mirror
// Original work is under MIT license -

// Copyright (C) 2010 by Johannes Baagøe <baagoe@baagoe.org>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.



(function(global, module, define) {

function Alea(seed) {
  var me = this, mash = Mash();

  me.next = function() {
    var t = 2091639 * me.s0 + me.c * 2.3283064365386963e-10; // 2^-32
    me.s0 = me.s1;
    me.s1 = me.s2;
    return me.s2 = t - (me.c = t | 0);
  };

  // Apply the seeding algorithm from Baagoe.
  me.c = 1;
  me.s0 = mash(' ');
  me.s1 = mash(' ');
  me.s2 = mash(' ');
  me.s0 -= mash(seed);
  if (me.s0 < 0) { me.s0 += 1; }
  me.s1 -= mash(seed);
  if (me.s1 < 0) { me.s1 += 1; }
  me.s2 -= mash(seed);
  if (me.s2 < 0) { me.s2 += 1; }
  mash = null;
}

function copy(f, t) {
  t.c = f.c;
  t.s0 = f.s0;
  t.s1 = f.s1;
  t.s2 = f.s2;
  return t;
}

function impl(seed, opts) {
  var xg = new Alea(seed),
      state = opts && opts.state,
      prng = xg.next;
  prng.int32 = function() { return (xg.next() * 0x100000000) | 0; }
  prng.double = function() {
    return prng() + (prng() * 0x200000 | 0) * 1.1102230246251565e-16; // 2^-53
  };
  prng.quick = prng;
  if (state) {
    if (typeof(state) == 'object') copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

function Mash() {
  var n = 0xefc8249d;

  var mash = function(data) {
    data = data.toString();
    for (var i = 0; i < data.length; i++) {
      n += data.charCodeAt(i);
      var h = 0.02519603282416938 * n;
      n = h >>> 0;
      h -= n;
      h *= n;
      n = h >>> 0;
      h -= n;
      n += h * 0x100000000; // 2^32
    }
    return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
  };

  return mash;
}


if (module && module.exports) {
  module.exports = impl;
} else if (__webpack_require__(7) && __webpack_require__(8)) {
  !(__WEBPACK_AMD_DEFINE_RESULT__ = (function() { return impl; }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
} else {
  this.alea = impl;
}

})(
  this,
   true && module,    // present in node.js
  __webpack_require__(7)   // present with an AMD loader
);



/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(6)(module)))

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = function() {
	throw new Error("define cannot be used indirect");
};


/***/ }),
/* 8 */
/***/ (function(module, exports) {

/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {/* globals __webpack_amd_options__ */
module.exports = __webpack_amd_options__;

/* WEBPACK VAR INJECTION */}.call(this, {}))

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_RESULT__;// A Javascript implementaion of the "xor128" prng algorithm by
// George Marsaglia.  See http://www.jstatsoft.org/v08/i14/paper

(function(global, module, define) {

function XorGen(seed) {
  var me = this, strseed = '';

  me.x = 0;
  me.y = 0;
  me.z = 0;
  me.w = 0;

  // Set up generator function.
  me.next = function() {
    var t = me.x ^ (me.x << 11);
    me.x = me.y;
    me.y = me.z;
    me.z = me.w;
    return me.w ^= (me.w >>> 19) ^ t ^ (t >>> 8);
  };

  if (seed === (seed | 0)) {
    // Integer seed.
    me.x = seed;
  } else {
    // String seed.
    strseed += seed;
  }

  // Mix in string seed, then discard an initial batch of 64 values.
  for (var k = 0; k < strseed.length + 64; k++) {
    me.x ^= strseed.charCodeAt(k) | 0;
    me.next();
  }
}

function copy(f, t) {
  t.x = f.x;
  t.y = f.y;
  t.z = f.z;
  t.w = f.w;
  return t;
}

function impl(seed, opts) {
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (typeof(state) == 'object') copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (__webpack_require__(7) && __webpack_require__(8)) {
  !(__WEBPACK_AMD_DEFINE_RESULT__ = (function() { return impl; }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
} else {
  this.xor128 = impl;
}

})(
  this,
   true && module,    // present in node.js
  __webpack_require__(7)   // present with an AMD loader
);



/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(6)(module)))

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_RESULT__;// A Javascript implementaion of the "xorwow" prng algorithm by
// George Marsaglia.  See http://www.jstatsoft.org/v08/i14/paper

(function(global, module, define) {

function XorGen(seed) {
  var me = this, strseed = '';

  // Set up generator function.
  me.next = function() {
    var t = (me.x ^ (me.x >>> 2));
    me.x = me.y; me.y = me.z; me.z = me.w; me.w = me.v;
    return (me.d = (me.d + 362437 | 0)) +
       (me.v = (me.v ^ (me.v << 4)) ^ (t ^ (t << 1))) | 0;
  };

  me.x = 0;
  me.y = 0;
  me.z = 0;
  me.w = 0;
  me.v = 0;

  if (seed === (seed | 0)) {
    // Integer seed.
    me.x = seed;
  } else {
    // String seed.
    strseed += seed;
  }

  // Mix in string seed, then discard an initial batch of 64 values.
  for (var k = 0; k < strseed.length + 64; k++) {
    me.x ^= strseed.charCodeAt(k) | 0;
    if (k == strseed.length) {
      me.d = me.x << 10 ^ me.x >>> 4;
    }
    me.next();
  }
}

function copy(f, t) {
  t.x = f.x;
  t.y = f.y;
  t.z = f.z;
  t.w = f.w;
  t.v = f.v;
  t.d = f.d;
  return t;
}

function impl(seed, opts) {
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (typeof(state) == 'object') copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (__webpack_require__(7) && __webpack_require__(8)) {
  !(__WEBPACK_AMD_DEFINE_RESULT__ = (function() { return impl; }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
} else {
  this.xorwow = impl;
}

})(
  this,
   true && module,    // present in node.js
  __webpack_require__(7)   // present with an AMD loader
);



/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(6)(module)))

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_RESULT__;// A Javascript implementaion of the "xorshift7" algorithm by
// François Panneton and Pierre L'ecuyer:
// "On the Xorgshift Random Number Generators"
// http://saluc.engr.uconn.edu/refs/crypto/rng/panneton05onthexorshift.pdf

(function(global, module, define) {

function XorGen(seed) {
  var me = this;

  // Set up generator function.
  me.next = function() {
    // Update xor generator.
    var X = me.x, i = me.i, t, v, w;
    t = X[i]; t ^= (t >>> 7); v = t ^ (t << 24);
    t = X[(i + 1) & 7]; v ^= t ^ (t >>> 10);
    t = X[(i + 3) & 7]; v ^= t ^ (t >>> 3);
    t = X[(i + 4) & 7]; v ^= t ^ (t << 7);
    t = X[(i + 7) & 7]; t = t ^ (t << 13); v ^= t ^ (t << 9);
    X[i] = v;
    me.i = (i + 1) & 7;
    return v;
  };

  function init(me, seed) {
    var j, w, X = [];

    if (seed === (seed | 0)) {
      // Seed state array using a 32-bit integer.
      w = X[0] = seed;
    } else {
      // Seed state using a string.
      seed = '' + seed;
      for (j = 0; j < seed.length; ++j) {
        X[j & 7] = (X[j & 7] << 15) ^
            (seed.charCodeAt(j) + X[(j + 1) & 7] << 13);
      }
    }
    // Enforce an array length of 8, not all zeroes.
    while (X.length < 8) X.push(0);
    for (j = 0; j < 8 && X[j] === 0; ++j);
    if (j == 8) w = X[7] = -1; else w = X[j];

    me.x = X;
    me.i = 0;

    // Discard an initial 256 values.
    for (j = 256; j > 0; --j) {
      me.next();
    }
  }

  init(me, seed);
}

function copy(f, t) {
  t.x = f.x.slice();
  t.i = f.i;
  return t;
}

function impl(seed, opts) {
  if (seed == null) seed = +(new Date);
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (state.x) copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (__webpack_require__(7) && __webpack_require__(8)) {
  !(__WEBPACK_AMD_DEFINE_RESULT__ = (function() { return impl; }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
} else {
  this.xorshift7 = impl;
}

})(
  this,
   true && module,    // present in node.js
  __webpack_require__(7)   // present with an AMD loader
);


/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(6)(module)))

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_RESULT__;// A Javascript implementaion of Richard Brent's Xorgens xor4096 algorithm.
//
// This fast non-cryptographic random number generator is designed for
// use in Monte-Carlo algorithms. It combines a long-period xorshift
// generator with a Weyl generator, and it passes all common batteries
// of stasticial tests for randomness while consuming only a few nanoseconds
// for each prng generated.  For background on the generator, see Brent's
// paper: "Some long-period random number generators using shifts and xors."
// http://arxiv.org/pdf/1004.3115v1.pdf
//
// Usage:
//
// var xor4096 = require('xor4096');
// random = xor4096(1);                        // Seed with int32 or string.
// assert.equal(random(), 0.1520436450538547); // (0, 1) range, 53 bits.
// assert.equal(random.int32(), 1806534897);   // signed int32, 32 bits.
//
// For nonzero numeric keys, this impelementation provides a sequence
// identical to that by Brent's xorgens 3 implementaion in C.  This
// implementation also provides for initalizing the generator with
// string seeds, or for saving and restoring the state of the generator.
//
// On Chrome, this prng benchmarks about 2.1 times slower than
// Javascript's built-in Math.random().

(function(global, module, define) {

function XorGen(seed) {
  var me = this;

  // Set up generator function.
  me.next = function() {
    var w = me.w,
        X = me.X, i = me.i, t, v;
    // Update Weyl generator.
    me.w = w = (w + 0x61c88647) | 0;
    // Update xor generator.
    v = X[(i + 34) & 127];
    t = X[i = ((i + 1) & 127)];
    v ^= v << 13;
    t ^= t << 17;
    v ^= v >>> 15;
    t ^= t >>> 12;
    // Update Xor generator array state.
    v = X[i] = v ^ t;
    me.i = i;
    // Result is the combination.
    return (v + (w ^ (w >>> 16))) | 0;
  };

  function init(me, seed) {
    var t, v, i, j, w, X = [], limit = 128;
    if (seed === (seed | 0)) {
      // Numeric seeds initialize v, which is used to generates X.
      v = seed;
      seed = null;
    } else {
      // String seeds are mixed into v and X one character at a time.
      seed = seed + '\0';
      v = 0;
      limit = Math.max(limit, seed.length);
    }
    // Initialize circular array and weyl value.
    for (i = 0, j = -32; j < limit; ++j) {
      // Put the unicode characters into the array, and shuffle them.
      if (seed) v ^= seed.charCodeAt((j + 32) % seed.length);
      // After 32 shuffles, take v as the starting w value.
      if (j === 0) w = v;
      v ^= v << 10;
      v ^= v >>> 15;
      v ^= v << 4;
      v ^= v >>> 13;
      if (j >= 0) {
        w = (w + 0x61c88647) | 0;     // Weyl.
        t = (X[j & 127] ^= (v + w));  // Combine xor and weyl to init array.
        i = (0 == t) ? i + 1 : 0;     // Count zeroes.
      }
    }
    // We have detected all zeroes; make the key nonzero.
    if (i >= 128) {
      X[(seed && seed.length || 0) & 127] = -1;
    }
    // Run the generator 512 times to further mix the state before using it.
    // Factoring this as a function slows the main generator, so it is just
    // unrolled here.  The weyl generator is not advanced while warming up.
    i = 127;
    for (j = 4 * 128; j > 0; --j) {
      v = X[(i + 34) & 127];
      t = X[i = ((i + 1) & 127)];
      v ^= v << 13;
      t ^= t << 17;
      v ^= v >>> 15;
      t ^= t >>> 12;
      X[i] = v ^ t;
    }
    // Storing state as object members is faster than using closure variables.
    me.w = w;
    me.X = X;
    me.i = i;
  }

  init(me, seed);
}

function copy(f, t) {
  t.i = f.i;
  t.w = f.w;
  t.X = f.X.slice();
  return t;
};

function impl(seed, opts) {
  if (seed == null) seed = +(new Date);
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (state.X) copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (__webpack_require__(7) && __webpack_require__(8)) {
  !(__WEBPACK_AMD_DEFINE_RESULT__ = (function() { return impl; }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
} else {
  this.xor4096 = impl;
}

})(
  this,                                     // window object or global
   true && module,    // present in node.js
  __webpack_require__(7)   // present with an AMD loader
);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(6)(module)))

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_RESULT__;// A Javascript implementaion of the "Tyche-i" prng algorithm by
// Samuel Neves and Filipe Araujo.
// See https://eden.dei.uc.pt/~sneves/pubs/2011-snfa2.pdf

(function(global, module, define) {

function XorGen(seed) {
  var me = this, strseed = '';

  // Set up generator function.
  me.next = function() {
    var b = me.b, c = me.c, d = me.d, a = me.a;
    b = (b << 25) ^ (b >>> 7) ^ c;
    c = (c - d) | 0;
    d = (d << 24) ^ (d >>> 8) ^ a;
    a = (a - b) | 0;
    me.b = b = (b << 20) ^ (b >>> 12) ^ c;
    me.c = c = (c - d) | 0;
    me.d = (d << 16) ^ (c >>> 16) ^ a;
    return me.a = (a - b) | 0;
  };

  /* The following is non-inverted tyche, which has better internal
   * bit diffusion, but which is about 25% slower than tyche-i in JS.
  me.next = function() {
    var a = me.a, b = me.b, c = me.c, d = me.d;
    a = (me.a + me.b | 0) >>> 0;
    d = me.d ^ a; d = d << 16 ^ d >>> 16;
    c = me.c + d | 0;
    b = me.b ^ c; b = b << 12 ^ d >>> 20;
    me.a = a = a + b | 0;
    d = d ^ a; me.d = d = d << 8 ^ d >>> 24;
    me.c = c = c + d | 0;
    b = b ^ c;
    return me.b = (b << 7 ^ b >>> 25);
  }
  */

  me.a = 0;
  me.b = 0;
  me.c = 2654435769 | 0;
  me.d = 1367130551;

  if (seed === Math.floor(seed)) {
    // Integer seed.
    me.a = (seed / 0x100000000) | 0;
    me.b = seed | 0;
  } else {
    // String seed.
    strseed += seed;
  }

  // Mix in string seed, then discard an initial batch of 64 values.
  for (var k = 0; k < strseed.length + 20; k++) {
    me.b ^= strseed.charCodeAt(k) | 0;
    me.next();
  }
}

function copy(f, t) {
  t.a = f.a;
  t.b = f.b;
  t.c = f.c;
  t.d = f.d;
  return t;
};

function impl(seed, opts) {
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (typeof(state) == 'object') copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (__webpack_require__(7) && __webpack_require__(8)) {
  !(__WEBPACK_AMD_DEFINE_RESULT__ = (function() { return impl; }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
} else {
  this.tychei = impl;
}

})(
  this,
   true && module,    // present in node.js
  __webpack_require__(7)   // present with an AMD loader
);



/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(6)(module)))

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/*
Copyright 2014 David Bau.

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

(function (pool, math) {
//
// The following constants are related to IEEE 754 limits.
//

// Detect the global object, even if operating in strict mode.
// http://stackoverflow.com/a/14387057/265298
var global = (0, eval)('this'),
    width = 256,        // each RC4 output is 0 <= x < 256
    chunks = 6,         // at least six RC4 outputs for each double
    digits = 52,        // there are 52 significant digits in a double
    rngname = 'random', // rngname: name for Math.random and Math.seedrandom
    startdenom = math.pow(width, chunks),
    significance = math.pow(2, digits),
    overflow = significance * 2,
    mask = width - 1,
    nodecrypto;         // node.js crypto module, initialized at the bottom.

//
// seedrandom()
// This is the seedrandom function described above.
//
function seedrandom(seed, options, callback) {
  var key = [];
  options = (options == true) ? { entropy: true } : (options || {});

  // Flatten the seed string or build one from local entropy if needed.
  var shortseed = mixkey(flatten(
    options.entropy ? [seed, tostring(pool)] :
    (seed == null) ? autoseed() : seed, 3), key);

  // Use the seed to initialize an ARC4 generator.
  var arc4 = new ARC4(key);

  // This function returns a random double in [0, 1) that contains
  // randomness in every bit of the mantissa of the IEEE 754 value.
  var prng = function() {
    var n = arc4.g(chunks),             // Start with a numerator n < 2 ^ 48
        d = startdenom,                 //   and denominator d = 2 ^ 48.
        x = 0;                          //   and no 'extra last byte'.
    while (n < significance) {          // Fill up all significant digits by
      n = (n + x) * width;              //   shifting numerator and
      d *= width;                       //   denominator and generating a
      x = arc4.g(1);                    //   new least-significant-byte.
    }
    while (n >= overflow) {             // To avoid rounding up, before adding
      n /= 2;                           //   last byte, shift everything
      d /= 2;                           //   right using integer math until
      x >>>= 1;                         //   we have exactly the desired bits.
    }
    return (n + x) / d;                 // Form the number within [0, 1).
  };

  prng.int32 = function() { return arc4.g(4) | 0; }
  prng.quick = function() { return arc4.g(4) / 0x100000000; }
  prng.double = prng;

  // Mix the randomness into accumulated entropy.
  mixkey(tostring(arc4.S), pool);

  // Calling convention: what to return as a function of prng, seed, is_math.
  return (options.pass || callback ||
      function(prng, seed, is_math_call, state) {
        if (state) {
          // Load the arc4 state from the given state if it has an S array.
          if (state.S) { copy(state, arc4); }
          // Only provide the .state method if requested via options.state.
          prng.state = function() { return copy(arc4, {}); }
        }

        // If called as a method of Math (Math.seedrandom()), mutate
        // Math.random because that is how seedrandom.js has worked since v1.0.
        if (is_math_call) { math[rngname] = prng; return seed; }

        // Otherwise, it is a newer calling convention, so return the
        // prng directly.
        else return prng;
      })(
  prng,
  shortseed,
  'global' in options ? options.global : (this == math),
  options.state);
}
math['seed' + rngname] = seedrandom;

//
// ARC4
//
// An ARC4 implementation.  The constructor takes a key in the form of
// an array of at most (width) integers that should be 0 <= x < (width).
//
// The g(count) method returns a pseudorandom integer that concatenates
// the next (count) outputs from ARC4.  Its return value is a number x
// that is in the range 0 <= x < (width ^ count).
//
function ARC4(key) {
  var t, keylen = key.length,
      me = this, i = 0, j = me.i = me.j = 0, s = me.S = [];

  // The empty key [] is treated as [0].
  if (!keylen) { key = [keylen++]; }

  // Set up S using the standard key scheduling algorithm.
  while (i < width) {
    s[i] = i++;
  }
  for (i = 0; i < width; i++) {
    s[i] = s[j = mask & (j + key[i % keylen] + (t = s[i]))];
    s[j] = t;
  }

  // The "g" method returns the next (count) outputs as one number.
  (me.g = function(count) {
    // Using instance members instead of closure state nearly doubles speed.
    var t, r = 0,
        i = me.i, j = me.j, s = me.S;
    while (count--) {
      t = s[i = mask & (i + 1)];
      r = r * width + s[mask & ((s[i] = s[j = mask & (j + t)]) + (s[j] = t))];
    }
    me.i = i; me.j = j;
    return r;
    // For robust unpredictability, the function call below automatically
    // discards an initial batch of values.  This is called RC4-drop[256].
    // See http://google.com/search?q=rsa+fluhrer+response&btnI
  })(width);
}

//
// copy()
// Copies internal state of ARC4 to or from a plain object.
//
function copy(f, t) {
  t.i = f.i;
  t.j = f.j;
  t.S = f.S.slice();
  return t;
};

//
// flatten()
// Converts an object tree to nested arrays of strings.
//
function flatten(obj, depth) {
  var result = [], typ = (typeof obj), prop;
  if (depth && typ == 'object') {
    for (prop in obj) {
      try { result.push(flatten(obj[prop], depth - 1)); } catch (e) {}
    }
  }
  return (result.length ? result : typ == 'string' ? obj : obj + '\0');
}

//
// mixkey()
// Mixes a string seed into a key that is an array of integers, and
// returns a shortened string seed that is equivalent to the result key.
//
function mixkey(seed, key) {
  var stringseed = seed + '', smear, j = 0;
  while (j < stringseed.length) {
    key[mask & j] =
      mask & ((smear ^= key[mask & j] * 19) + stringseed.charCodeAt(j++));
  }
  return tostring(key);
}

//
// autoseed()
// Returns an object for autoseeding, using window.crypto and Node crypto
// module if available.
//
function autoseed() {
  try {
    var out;
    if (nodecrypto && (out = nodecrypto.randomBytes)) {
      // The use of 'out' to remember randomBytes makes tight minified code.
      out = out(width);
    } else {
      out = new Uint8Array(width);
      (global.crypto || global.msCrypto).getRandomValues(out);
    }
    return tostring(out);
  } catch (e) {
    var browser = global.navigator,
        plugins = browser && browser.plugins;
    return [+new Date, global, plugins, global.screen, tostring(pool)];
  }
}

//
// tostring()
// Converts an array of charcodes to a string
//
function tostring(a) {
  return String.fromCharCode.apply(0, a);
}

//
// When seedrandom.js is loaded, we immediately mix a few bits
// from the built-in RNG into the entropy pool.  Because we do
// not want to interfere with deterministic PRNG state later,
// seedrandom will not call math.random on its own again after
// initialization.
//
mixkey(math.random(), pool);

//
// Nodejs and AMD support: export the implementation as a module using
// either convention.
//
if ( true && module.exports) {
  module.exports = seedrandom;
  // When in node.js, try using crypto package for autoseeding.
  try {
    nodecrypto = __webpack_require__(15);
  } catch (ex) {}
} else if (true) {
  !(__WEBPACK_AMD_DEFINE_RESULT__ = (function() { return seedrandom; }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}

// End anonymous scope, and pass initial values.
})(
  [],     // pool: entropy pool starts empty
  Math    // math: package containing random, pow, and seedrandom
);


/***/ }),
/* 15 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const world_1 = __webpack_require__(2);
class Kingdom {
    constructor(name, color, cellIDs, active, world) {
        this.cells = [];
        this.name = name;
        this.color = color;
        this.cells = [];
        this.world = world;
        this.active = active;
        this.econ = {
            wealth: 0,
            industry: 0,
            agriculture: 0,
            population: 0
        };
        this.income = {
            money: 0,
            goods: 0,
            food: 0
        };
        cellIDs.forEach(function (cellId) {
            const currentCell = world_1.default.listOfCells.find(cell => cell.id === cellId);
            this.claimTerritory(currentCell);
        }, this);
    }
    nextRound(random) {
        if (this.active) {
            const attackList = this.findNeighbourCells();
            const target = Math.floor(random * attackList.length);
            this.claimTerritory(attackList[target]);
        }
        this.calculateEconomy();
    }
    updateCellsList() {
        this.cells = world_1.default.listOfCells.filter(cell => cell.owner === this);
    }
    setTerritoryStatus() {
        this.cells.forEach(cell => cell.owner = this);
    }
    claimTerritory(claimedCell) {
        if (claimedCell === undefined)
            return;
        if (!this.cells.includes(claimedCell)) {
            if (claimedCell.owner != undefined) {
                claimedCell.owner.loseTerritory(claimedCell);
            }
            this.cells.push(claimedCell);
            this.setTerritoryStatus();
        }
    }
    loseTerritory(cell) {
        this.cells.splice(this.cells.indexOf(cell), 1);
        cell.owner = world_1.default.listOfKingdoms[0]; // unclaimed
    }
    findNeighbourCells() {
        let neighbours = [];
        this.cells.forEach(cell => {
            neighbours = neighbours.concat(this.analizeNeighbours(cell));
        });
        return neighbours;
    }
    analizeNeighbours(inputCell) {
        let outputList = [];
        const rowNum = inputCell.pos.row;
        const colNum = inputCell.pos.col;
        if (rowNum > 0) {
            outputList.push(world_1.default.map[rowNum - 1][colNum]);
        }
        if (rowNum < this.world.numRows - 1) {
            outputList.push(world_1.default.map[rowNum + 1][colNum]);
        }
        if (colNum > 0) {
            outputList.push(world_1.default.map[rowNum][colNum - 1]);
        }
        if (colNum < this.world.numCols - 1) {
            outputList.push(world_1.default.map[rowNum][colNum + 1]);
        }
        return outputList.filter(cell => cell.owner != this);
    }
    init() {
        this.updateCellsList();
        this.setTerritoryStatus();
        this.calculateEconomy();
    }
    calculateEconomy() {
        Object.keys(this.econ).forEach(i => this.econ[i] = 0);
        this.cells.forEach(cell => {
            this.econ.wealth += cell.wealth;
            this.econ.industry += cell.industry;
            this.econ.agriculture += cell.agriculture;
            this.econ.population += cell.population;
        });
    }
}
exports.default = Kingdom;
;
;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(18);
const ReactDOM = __webpack_require__(19);
const world_1 = __webpack_require__(2);
const main_1 = __webpack_require__(20);
const script_1 = __webpack_require__(0);
function renderLayout() {
    ReactDOM.render(React.createElement(main_1.default, { colNum: script_1.g.sceneCols, rowNum: script_1.g.sceneRows, worldMap: world_1.default.map }), document.getElementById("main"));
}
exports.default = renderLayout;
;


/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = React;

/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = ReactDOM;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(18);
const map_1 = __webpack_require__(21);
const infoPanel_1 = __webpack_require__(23);
const world_1 = __webpack_require__(2);
const script_1 = __webpack_require__(0);
const resize_1 = __webpack_require__(24);
class Main extends React.Component {
    constructor() {
        super(...arguments);
        this.updateDimensions = () => {
            this.setState({ panelSize: resize_1.default.calculatePanelSizes() });
        };
        this.handleSelect = (kingdom) => {
            if (kingdom === undefined)
                return;
            const clickedCellKingdom = world_1.default.listOfKingdoms.find(listKingdom => listKingdom === kingdom);
            let highlightedKindom = this.state.highlightedKindom === clickedCellKingdom
                ? null
                : clickedCellKingdom;
            this.setState({ highlightedKindom });
        };
        this.zoomMap = (event) => {
            const panelSize = Object.assign({}, this.state.panelSize);
            panelSize.mapCellSize = resize_1.default.zoomMap(event);
            this.setState({ panelSize });
        };
    }
    componentWillMount() {
        this.setState({ panelSize: resize_1.default.calculatePanelSizes(), highlightedKindom: null });
    }
    ;
    componentDidMount() {
        window.addEventListener("resize", this.updateDimensions);
        const mapDiv = document.getElementById("mapDiv");
        if (mapDiv === null)
            return;
        mapDiv.addEventListener("wheel", this.zoomMap);
    }
    ;
    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
        const mapDiv = document.getElementById("mapDiv");
        if (mapDiv === null)
            return;
        mapDiv.removeEventListener("wheel", this.zoomMap);
    }
    ;
    render() {
        const { rowNum, colNum, worldMap } = this.props;
        const { highlightedKindom, panelSize } = this.state;
        const absolute = 'absolute';
        const mapDivStyle = {
            backgroundColor: "#00ff00",
            position: absolute,
            overflow: "scroll",
            top: 0,
            left: 0,
            width: panelSize.mapWidth,
            height: panelSize.mapHeight
        };
        const dashDivStyle = {
            backgroundColor: "#ff00ff",
            position: absolute,
            width: panelSize.dashboardWidth,
            height: panelSize.dashboardHeight,
            top: panelSize.dashboardTop,
            left: panelSize.dashboardLeft
        };
        return (React.createElement(React.Fragment, null,
            React.createElement("div", { id: "mapDiv", style: mapDivStyle },
                React.createElement(map_1.default, { colNum: colNum, rowNum: rowNum, worldMap: worldMap, highlightedKindom: highlightedKindom, cellSize: panelSize.mapCellSize, onSelect: this.handleSelect })),
            React.createElement("div", { id: "dashDiv", style: dashDivStyle },
                React.createElement("button", { onClick: script_1.runGame }, "Start / Stop"),
                React.createElement("button", { onClick: script_1.showPopulation }, "Show Population"),
                React.createElement(infoPanel_1.default, { highlightedKindom: highlightedKindom, height: panelSize.dashboardHeight / 2, width: panelSize.dashboardWidth }))));
    }
    ;
}
exports.default = Main;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(18);
const cell_1 = __webpack_require__(22);
class Map extends React.Component {
    constructor() {
        super(...arguments);
        this.createTable = () => {
            const { rowNum, colNum, worldMap, highlightedKindom, cellSize } = this.props;
            let table = [];
            for (let i = 0; i < rowNum; ++i) {
                let rows = [];
                for (let j = 0; j < colNum; ++j) {
                    const mapCell = worldMap[i][j];
                    rows.push(React.createElement(cell_1.default, { key: "r" + i + "c" + j, cellSize: cellSize, cellObj: mapCell, onSelect: this.props.onSelect, isHighlighted: mapCell.owner === highlightedKindom }));
                }
                table.push(React.createElement("tr", { key: "r" + i }, rows));
            }
            return table;
        };
    }
    render() {
        const { cellSize, colNum } = this.props;
        const mapStyle = { width: cellSize * colNum };
        return (React.createElement("table", { id: "map", style: mapStyle },
            React.createElement("tbody", null, this.createTable())));
    }
    ;
}
exports.default = Map;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(18);
const cell_1 = __webpack_require__(3);
const script_1 = __webpack_require__(0);
class Cell extends React.Component {
    constructor() {
        super(...arguments);
        this.borderRatio = 0.02; // Cell-size/border thickness ratio
    }
    showCellIcon() {
        const { cellObj, cellSize } = this.props;
        const type = cellObj.type;
        const cellImgStyle = {
            height: cellSize / 2,
            width: cellSize / 2,
            top: cellSize / 8,
            left: cellSize / 8
        };
        let src = '';
        switch (type) {
            case cell_1.LandType.Farm:
                src = 'img/farm.svg';
                break;
            case cell_1.LandType.Settlement:
                src = 'img/settlement.svg';
                break;
            case cell_1.LandType.Forest:
                src = 'img/forest.svg';
                break;
            case cell_1.LandType.Mountain:
                src = 'img/mountain.svg';
                break;
            default:
            //TODO: create Unknown cell-type svg.
        }
        return (React.createElement("img", { className: "cellImg", style: cellImgStyle, src: src }));
    }
    render() {
        const { isHighlighted, cellSize, cellObj, onSelect } = this.props;
        const borderThickness = isHighlighted ?
            Math.ceil(cellSize * this.borderRatio) * 2 :
            Math.ceil(cellSize * this.borderRatio);
        const nonSelectedStyle = { boxShadow: "inset " + borderThickness + "px " + borderThickness + "px #ffffff," +
                "inset -" + borderThickness + "px -" + borderThickness + "px #ffffff" };
        const selectedStyle = { boxShadow: "inset " + borderThickness + "px " + borderThickness + "px #dddd55," +
                "inset -" + borderThickness + "px -" + borderThickness + "px #dddd55" };
        const boxShadowStyle = isHighlighted ? selectedStyle : nonSelectedStyle;
        const backGroundstyle = { backgroundColor: cellObj.owner.color };
        const cellStyle = Object.assign({ height: cellSize, width: cellSize }, boxShadowStyle, backGroundstyle);
        return (React.createElement("td", { id: "r" + cellObj.pos.row + "c" + cellObj.pos.col, className: "cell", style: cellStyle, onClick: () => onSelect(cellObj.owner) }, script_1.g.showPopulation ?
            String(Math.round(cellObj.population))
            : this.showCellIcon()));
    }
    ;
}
exports.default = Cell;


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(18);
class InfoPanel extends React.Component {
    render() {
        const { highlightedKindom, height, width } = this.props;
        const infoPanelStyle = {
            backgroundColor: "#ffffff",
            width,
            height
        };
        if (!highlightedKindom) {
            return React.createElement("div", { id: "infoPanel", style: infoPanelStyle });
        }
        const { name, econ } = highlightedKindom;
        return (React.createElement("div", { id: "infoPanel", style: infoPanelStyle },
            React.createElement("div", { id: "infoWealth" }, name + " wealth: " + econ.wealth),
            React.createElement("div", { id: "infoIndustry" }, name + " industry: " + econ.industry),
            React.createElement("div", { id: "infoAgriculture" }, name + " agriculture: " + econ.agriculture),
            React.createElement("div", { id: "infoPopulation" }, name + " population: " + econ.population)));
    }
    ;
}
exports.default = InfoPanel;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const script_1 = __webpack_require__(0);
var Orientation;
(function (Orientation) {
    Orientation[Orientation["Portrait"] = 0] = "Portrait";
    Orientation[Orientation["Landscape"] = 1] = "Landscape";
})(Orientation || (Orientation = {}));
class Resize {
    static calculatePanelSizes() {
        Resize.wWidth = Number(window.innerWidth);
        Resize.wHeight = Number(window.innerHeight);
        Resize.decideWindowOrientation();
        Resize.calcDashboardSize();
        Resize.calcMapSize();
        Resize.positionDashboard();
        Resize.calcCellSize();
        return ({
            windowWidth: Resize.wWidth,
            windowHeight: Resize.wHeight,
            mapWidth: Resize.mWidth,
            mapHeight: Resize.mHeight,
            mapCellSize: Resize.mActualCellSize,
            dashboardWidth: Resize.dWidth,
            dashboardHeight: Resize.dHeight,
            dashboardTop: Resize.dTop,
            dashboardLeft: Resize.dLeft,
            dashboardDisabled: Resize.dDisabled
        });
    }
    ;
    static decideWindowOrientation() {
        Resize.wOrientation = (Resize.wWidth > Resize.wHeight ?
            Orientation.Landscape : Orientation.Portrait);
        Resize.wShort = Resize.wOrientation === Orientation.Portrait ?
            Resize.wWidth : Resize.wHeight;
        Resize.wLong = Resize.wOrientation === Orientation.Portrait ?
            Resize.wHeight : Resize.wWidth;
    }
    ;
    static calcDashboardSize() {
        if (Resize.wLong < Resize.minThickness * Resize.minDashboardThickessRatio) {
            Resize.dLength = 0;
            Resize.dThickness = 0;
            Resize.dDisabled = true;
        }
        else {
            Resize.dLength = Resize.wShort;
            Resize.dThickness = Math.floor(Resize.dLength * Resize.thicknessRatio);
            Resize.dThickness = Math.max(Resize.dThickness, Resize.minThickness);
            Resize.dThickness = Math.min(Resize.dThickness, Resize.maxThickness);
            Resize.dDisabled = false;
        }
    }
    ;
    static calcMapSize() {
        Resize.mWidth = Resize.wWidth;
        Resize.mHeight = Resize.wHeight;
        if (Resize.wOrientation === Orientation.Landscape)
            Resize.mWidth -= Resize.dThickness;
        else
            Resize.mHeight -= Resize.dThickness;
    }
    ;
    static positionDashboard() {
        if (Resize.wOrientation === Orientation.Landscape) {
            Resize.dWidth = Resize.dThickness;
            Resize.dHeight = Resize.dLength;
            Resize.dTop = 0;
            Resize.dLeft = Resize.mWidth;
        }
        else {
            Resize.dWidth = Resize.dLength;
            Resize.dHeight = Resize.dThickness;
            Resize.dTop = Resize.mHeight;
            Resize.dLeft = 0;
        }
    }
    ;
    static calcCellSize() {
        const verticalMapSize = script_1.g.sceneRows * Resize.mActualCellSize;
        if (Resize.mHeight < verticalMapSize)
            return;
        const horizontalMapSize = script_1.g.sceneCols * Resize.mActualCellSize;
        if (Resize.mWidth < horizontalMapSize)
            return;
        const verticalScale = Resize.mHeight / verticalMapSize;
        const horizontalScale = Resize.mWidth / horizontalMapSize;
        const scale = Math.min(verticalScale, horizontalScale);
        Resize.mActualCellSize = Math.floor(Resize.mActualCellSize * scale);
        Resize.mActualCellSize =
            Resize.roundToNumber(Resize.mActualCellSize, Resize.stepCellSize);
        Resize.mActualCellSize = Resize.normalizeCellSize();
    }
    ;
    static roundToNumber(rounded, roundTo) {
        return Math.round(rounded / roundTo) * roundTo;
    }
    ;
    static normalizeCellSize() {
        return Math.min(Resize.maxCellSize, Math.max(Resize.minCellSize, Resize.mActualCellSize));
    }
    ;
}
Resize.mActualCellSize = 30; // Actual Cell size
Resize.borderRatio = 0.02; // Cell-size/border thickness ratio
Resize.minCellSize = 20; // px      // Minimum size of the drawn cells
Resize.maxCellSize = 100; // px      // Maximum size of the drawn cells
Resize.stepCellSize = 5; // px      // Cell-size increment/decrement constant
Resize.minDrawnCells = 3; // Minimum number of drawn cells
Resize.thicknessRatio = 0.2; // Dashboard width/height ratio
Resize.minThickness = 200; // px      // Dashboard thickness minimum
Resize.maxThickness = 400; // px      // Dashboard thickness maximum
Resize.minDashboardThickessRatio = 2; // Dashboard thickness/window shorter size minimum ratio
Resize.zoomMap = (event) => {
    if (event.ctrlKey === true) {
        event.preventDefault();
        Resize.mActualCellSize = event.deltaY < 0 ?
            Resize.mActualCellSize += Resize.stepCellSize :
            Resize.mActualCellSize -= Resize.stepCellSize;
    }
    return Resize.mActualCellSize = Resize.normalizeCellSize();
};
exports.default = Resize;


/***/ })
/******/ ]);