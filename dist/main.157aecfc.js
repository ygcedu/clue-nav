// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"epB2":[function(require,module,exports) {
var $siteList = $('.siteList');
var $lastLi = $siteList.find('li.last');
var x = localStorage.getItem('x');
var xObject = JSON.parse(x); // 如果cookie内没有x值则取后面的默认值

var hashMap = xObject || [{
  logo: 'A',
  url: 'https://www.acfun.cn'
}, {
  logo: 'B',
  url: 'https://www.bilibili.com'
}];

var simplifyUrl = function simplifyUrl(url) {
  return url.replace('https://', '').replace('http://', '').replace('www.', '').replace(/\/.*/, ''); // 删除以/开头的内容
};

var render = function render() {
  // 清除除了最后一个新增按钮以外的其他site
  $siteList.find('li:not(.last)').remove();
  hashMap.forEach(function (node, index) {
    // console.log(index)
    var $li = $("\n        <li>\n            <div class=\"site\">\n                <div class=\"logo\">\n                    <img class= \"favicon\" src= ".concat(JSON.stringify("https://www." + simplifyUrl(node.url) + "/favicon.ico"), "> \n                </div>\n                <div class=\"link\">").concat(simplifyUrl(node.url), "</div>\n                <div class=\"close\">\n                    <svg class=\"icon\">\n                        <use xlink:href=\"#icon-close\"></use>\n                    </svg>\n                </div>\n            </div>\n        </li>\n        ")).insertBefore($lastLi); // 用js来控制页面跳转（更加灵活），替换掉a标签

    $li.on('click', function () {
      window.open(node.url);
    });
    $li.on('click', '.close', function (e) {
      // console.log('这里')
      // 阻止冒泡（阻止不了a标签的跳转事件）
      e.stopPropagation();
      hashMap.splice(index, 1);
      render();
    });
    $(".favicon").on("error", function (e) {
      // e.currentTarget.style.display = 'none';
      // 找不到图标时,用首字母替换掉图片
      e.currentTarget.parentElement.innerHTML = node.logo;
    });
  });
}; // 第一次加载页面渲染$siteList


render();
$('.addButton').on('click', function () {
  var url = window.prompt("请问你要添加的网址是啥？");

  if (url.indexOf('http') !== 0) {
    url = 'https://' + url;
  }

  console.log(url);
  hashMap.push({
    logo: simplifyUrl(url)[0].toUpperCase(),
    url: url
  }); // 重新渲染$siteList

  render();
}); // 监听onbeforeunload事件

window.onbeforeunload = function () {
  console.log('页面关闭了');
  var string = JSON.stringify(hashMap); // 本地缓存cookie中保存x变量，值为$siteList字符串

  localStorage.setItem('x', string);
};

$(document).on('keypress', function (e) {
  if (e.target.localName === "body") {
    console.log(e.key);
    var key = e.key;

    for (var i = 0; i < hashMap.length; i++) {
      if (hashMap[i].logo.toLowerCase() === key) {
        window.open(hashMap[i].url);
      }
    }
  }
});
},{}]},{},["epB2"], null)
//# sourceMappingURL=main.157aecfc.js.map