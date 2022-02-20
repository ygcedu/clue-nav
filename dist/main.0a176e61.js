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
// 加载必应每日壁纸
var loadWallpaper = function loadWallpaper() {
  var options = {
    format: 'js',
    idx: '0',
    n: '1',
    mkt: 'zh-CN'
  };
  var imgUrl = '/bing/' + 'HPImageArchive.aspx?' + "format=".concat(options.format, "&idx=").concat(options.idx, "&n=").concat(options.n, "&mkt=").concat(options.mkt); // 这里 bing 就是 Nginx 匹配规则，可自定义

  $.ajax({
    url: imgUrl,
    dataType: 'json',
    type: 'GET',
    success: function success(req) {
      imgUrl = 'https://cn.bing.com' + req.images[0].url;
      document.body.style.backgroundImage = "url(".concat(imgUrl, ")");
    }
  });
};

var $searchForm = $('.searchForm');
var $suggests = $('.search-suggest'); // 搜索提示

var smartReminder = function smartReminder(words) {
  if (words) {
    //组装查询地址
    var sugurl = 'http://api.bing.com/qsonhs.aspx?type=cb&q=#content#&cb=window.bing.sug';
    sugurl = sugurl.replace('#content#', words); //定义回调函数

    window.bing = {
      sug: function sug(json) {
        $suggests.empty();
        $suggests.attr('class', 'search-suggest show');

        if (json.AS.Results) {
          json.AS.Results[0].Suggests.forEach(function (suggest) {
            var $suggest = $("<li class=\"suggest-item\">".concat(suggest.Txt, "</li>")).prependTo($suggests);
            $suggest.on('click', $('li'), function () {
              $searchForm.children('input').val(this.innerText);
              $searchForm.submit();
            });
          });
        }
      }
    }; //动态添加JS脚本

    var script = document.createElement('script');
    script.src = sugurl;
    document.getElementsByTagName('head')[0].appendChild(script);
  }
}; //初始化搜索引擎并添加点击事件


var searchInit = function searchInit(elements) {
  //初始化搜索引擎
  // $('.google').addClass('searchSelected');
  $(".google").css('background', '#4285F433').css("color", "#4285F4").find("svg").css("font-size", "20px");
  $searchForm.attr('action', "https://www.google.com/search").find("input").attr("name", "q").end().find("use").attr("xlink:href", "#icon-google"); //添加点击事件

  elements.find('li').on('click', function (e) {
    var className = e.target.getAttribute('class'); //设置查询地址

    switch (className) {
      case 'google':
        $searchForm.attr("action", "https://www.google.com/search");
        $searchForm.find("input").attr("name", "q");
        break;

      case 'baidu':
        $searchForm.attr("action", "https://www.baidu.com/s");
        $searchForm.find("input").attr("name", "wd");
        break;

      case 'bing':
        $searchForm.attr("action", "https://www.bing.com/search");
        $searchForm.find("input").attr("name", "q");
        break;

      case 'sougou':
        $searchForm.attr("action", "https://www.sogou.com/sogou");
        $searchForm.find("input").attr("name", "query");
        break;

      case 'duckduckgo':
        $searchForm.attr("action", "https://duckduckgo.com/");
        $searchForm.find("input").attr("name", "q");
        break;
    } //清除当前样式
    // $(`.searchTab`).removeClass();


    $(".searchTab").find("li").attr("style", "").css("font-weight", "600").find("svg").css("font-size", "0"); //添加点击样式

    $(".".concat(className)).css("background", "#4285F433").css("color", "#4285F4").find("svg").css("font-size", "20px"); //修改 input 内 icon

    $searchForm.find("use").attr("xlink:href", "#icon-".concat(className));
  });
};

loadWallpaper();
var $siteList = $('.siteList');
var $lastLi = $siteList.find('li.last');
var x = localStorage.getItem('x');
var xObject = JSON.parse(x); // 如果cookie内没有x值则取后面的默认值

var hashMap = xObject || [{
  name: 'A站',
  url: 'https://www.acfun.cn',
  logoType: 'text',
  logo: 'A'
}, {
  name: 'B站',
  url: 'https://www.bilibili.com',
  logoType: 'link',
  logo: 'B'
}];

var save = function save() {
  var string = JSON.stringify(hashMap); // 本地缓存cookie中保存x变量，值为$siteList字符串

  localStorage.setItem('x', string);
};

var simplifyUrl = function simplifyUrl(url) {
  return url.replace('https://', '').replace('http://', '').replace('www.', '').replace(/\/.*/, ''); // 删除以/开头的内容
};

var render = function render() {
  // 清除除了最后一个新增按钮以外的其他site
  $siteList.find('li:not(.last)').remove();
  hashMap.forEach(function (site, index) {
    var simurl = simplifyUrl(site.url);
    var logo = site.logoType === 'link' ? site.logo : 'https://www.' + simurl + '/favicon.ico';
    var $li = $("\n        <li>\n            <div class=\"site\">\n                <div class=\"logo\">\n                    <img class= \"favicon\" src= ".concat(JSON.stringify(logo), "> \n                </div>\n                <div class=\"close\">\n                    <svg class=\"icon\">\n                        <use xlink:href=\"#icon-close\"></use>\n                    </svg>\n                </div>\n                <div class=\"link\">").concat(site.name, "</div>\n            </div>\n        </li>\n        ")).insertBefore($lastLi);
    $li.on('click', function () {
      window.open(site.url);
    }); // fixme:删除遇到找不到图标时会报错，数据就保存不下来(重复监听？)

    $li.on('click', '.close', function (e) {
      // console.log('这里')
      // 阻止冒泡（阻止不了a标签的跳转事件）
      e.stopPropagation();
      console.log(index);
      var result = window.confirm("\u662F\u5426\u786E\u8BA4\u5220\u9664 ".concat(site.name, " \uFF1F"));

      if (result) {
        hashMap.splice(index, 1);
        render();
      }
    });
    $li.find('.favicon').on('error', function (e) {
      // e.currentTarget.style.display = 'none';
      try {
        // 找不到图标时,用首字母替换掉图片
        e.currentTarget.parentElement.innerHTML = simurl[0].toUpperCase();
      } catch (error) {}
    });
  });
  searchInit($('.searchTab'));
}; // 第一次加载页面渲染$siteList


render();
$('.addButton').on('click', function () {
  $('.addSiteForm').addClass('showDialog');
  $('.mask').css('display', 'block');
}); //提交表单事件

var submitForm = function submitForm() {
  var siteName = $('input[name = "siteName"]').val();
  var siteLink = $('input[name = "siteLink"]').val();
  var siteIconsType = $('input[name = "siteIconsType"]:checked').val();
  var siteIcon = $('input[name = "siteIcon"]').val();

  if (siteLink === '') {
    $('.siteLink').css('background-color', '#f8d9d9').attr('placeholder', '网站地址为必填项！');
  } else {
    if (siteLink.indexOf('http') !== 0) {
      siteLink = 'https://' + siteLink;
    }

    hashMap.push({
      name: siteName,
      url: siteLink,
      logoType: siteIconsType,
      logo: siteIcon
    });
    save();
    render();
    closeForm();
  }
}; //form 表单关闭事件


var closeForm = function closeForm() {
  $('.addSiteForm').removeClass('showDialog'); // $addSiteForm.css(`transform`, `translateY(-100%)`);

  $('.mask').css('display', 'none'); // $('.siteIconLink').css('display', 'flex');

  document.querySelector('.addSiteForm').reset();
};

var addEventListeners = function addEventListeners() {
  // 监听onbeforeunload事件
  window.onbeforeunload = function () {
    console.log('页面关闭了');
    save();
  };

  $(document).on('keypress', function (e) {
    if (e.target.localName === 'body') {
      var key = e.key;

      for (var i = 0; i < hashMap.length; i++) {
        if (hashMap[i].logo.toLowerCase() === key) {
          window.open(hashMap[i].url);
        }
      }
    }
  });
  $(document).mousemove(function (e) {
    var clientWidth = document.documentElement.clientWidth; // const clientHeight = document.documentElement.clientHeight;

    var classes = 'head';
    var x = e.pageX;
    var y = e.pageY;

    if (x < (clientWidth - 138) / 2) {
      classes += ' left';
    } else if (x > (clientWidth - 138) / 2 + 138) {
      classes += ' right';
    }

    if (y < 83) {
      classes += ' top';
    } else if (y > 196) {
      classes += ' bottom';
    }

    $('.head').attr('class', classes);
  }); // 搜索建议：blog.51cto.com/1095221645/1916022
  //根据 siteIconType 的值改变 表单中 siteIcon 链接项的可见性

  $('input[name = "siteIconsType"]').change(function () {
    console.log(this.value);

    if (this.value === 'link') {
      $('.siteIconLink').css('display', 'flex');
    } else {
      $('.siteIconLink').css('display', 'none');
    }
  });
  $('.searchForm > input').keydown(function (e) {
    // smartReminder(this.value, e.key);
    var active = $('.suggest-item.active');
    var text = '';

    switch (e.key) {
      case 'ArrowUp':
        if (active.length > 0) {
          active.removeClass('active');
          text = active.prev().addClass('active').text();
        } else {
          text = $('.search-suggest>.suggest-item:last-child').addClass('active').text();
        }

        $searchForm.children('input').val(text);
        break;

      case 'ArrowDown':
        if (active.length > 0) {
          active.removeClass('active');
          text = active.next().addClass('active').text();
        } else {
          text = $('.search-suggest>.suggest-item:first-child').addClass('active').text();
        }

        $searchForm.children('input').val(text);
        break;
    }
  });
  $('.searchForm > input').on('input', function (e) {
    smartReminder(e.delegateTarget.value);
  });
  $('body').on('click', function () {
    $suggests.attr('class', 'search-suggest hide');
  });
  $('.siteLink').on('focus', function (e) {
    e.currentTarget.style.backgroundColor = '#fff';
  });
};

addEventListeners();
},{}]},{},["epB2"], null)
//# sourceMappingURL=main.0a176e61.js.map