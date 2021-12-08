// 加载必应每日壁纸
const loadWallpaper = () => {
  const options = {
    format: 'js',
    idx: '0',
    n: '1',
    mkt: 'zh-CN'
  };

  let imgUrl = '/bing/' + 'HPImageArchive.aspx?' + `format=${options.format}&idx=${options.idx}&n=${options.n}&mkt=${options.mkt}`;
// 这里 bing 就是 Nginx 匹配规则，可自定义

  $.ajax({
    url: imgUrl,
    dataType: 'json',
    type: 'GET',
    success: (req) => {
      imgUrl = 'https://cn.bing.com' + req.images[0].url;
      document.body.style.backgroundImage = `url(${imgUrl})`;
    },
  });
};

const $searchForm = $('.searchForm');
const $suggests = $('.search-suggest');
// 搜索提示
const smartReminder = (words) => {
  if (words) {
    //组装查询地址
    let sugurl = 'http://api.bing.com/qsonhs.aspx?type=cb&q=#content#&cb=window.bing.sug';
    sugurl = sugurl.replace('#content#', words);
    //定义回调函数
    window.bing = {
      sug: function (json) {
        $suggests.empty();
        $suggests.attr('class', 'search-suggest show');
        if (json.AS.Results) {
          json.AS.Results[0].Suggests.forEach((suggest) => {
            const $suggest = $(`<li class="suggest-item">${suggest.Txt}</li>`).prependTo($suggests);

            $suggest.on('click', $('li'), function () {
              $searchForm.children('input').val(this.innerText);
              $searchForm.submit();
            });
          });
        }
      }
    };

    //动态添加JS脚本
    const script = document.createElement('script');
    script.src = sugurl;
    document.getElementsByTagName('head')[0].appendChild(script);
  }
};

//初始化搜索引擎并添加点击事件
let searchInit = (elements) => {
  //初始化搜索引擎
  // $('.google').addClass('searchSelected');
  $(`.google`).css('background', '#4285F433').css(`color`, `#4285F4`).find(`svg`).css(`font-size`, `20px`);
  $searchForm.attr('action', `https://www.google.com/search`).find(`input`).attr(`name`, `q`).end().find(`use`).attr(`xlink:href`, `#icon-google`);

  //添加点击事件
  elements.find('li').on('click', (e) => {
    let className = e.target.getAttribute('class');
    //设置查询地址
    switch (className) {
      case 'google':
        $searchForm.attr(`action`, `https://www.google.com/search`);
        $searchForm.find(`input`).attr(`name`, `q`);
        break;
      case 'baidu':
        $searchForm.attr(`action`, `https://www.baidu.com/s`);
        $searchForm.find(`input`).attr(`name`, `wd`);
        break;
      case 'bing':
        $searchForm.attr(`action`, `https://www.bing.com/search`);
        $searchForm.find(`input`).attr(`name`, `q`);
        break;
      case 'sougou':
        $searchForm.attr(`action`, `https://www.sogou.com/sogou`);
        $searchForm.find(`input`).attr(`name`, `query`);
        break;
      case 'duckduckgo':
        $searchForm.attr(`action`, `https://duckduckgo.com/`);
        $searchForm.find(`input`).attr(`name`, `q`);
        break;
    }

    //清除当前样式
    // $(`.searchTab`).removeClass();
    $(`.searchTab`).find(`li`).attr(`style`, ``).css(`font-weight`, `600`).find(`svg`).css(`font-size`, `0`);
    //添加点击样式
    $(`.${className}`).css(`background`, `#4285F433`).css(`color`, `#4285F4`).find(`svg`).css(`font-size`, `20px`);
    //修改 input 内 icon
    $searchForm.find(`use`).attr(`xlink:href`, `#icon-${className}`);
  });
};

loadWallpaper();

const $siteList = $('.siteList');
const $lastLi = $siteList.find('li.last');
const x = localStorage.getItem('x');
const xObject = JSON.parse(x);

// 如果cookie内没有x值则取后面的默认值
const hashMap = xObject || [
  {name: 'A站', url: 'https://www.acfun.cn', logoType: 'text', logo: 'A'},
  {name: 'B站', url: 'https://www.bilibili.com', logoType: 'link', logo: 'B'}
];

const save = () => {
  const string = JSON.stringify(hashMap);
  // 本地缓存cookie中保存x变量，值为$siteList字符串
  localStorage.setItem('x', string);
};

const simplifyUrl = (url) => {
  return url.replace('https://', '')
    .replace('http://', '')
    .replace('www.', '')
    .replace(/\/.*/, ''); // 删除以/开头的内容
};

const render = () => {
  // 清除除了最后一个新增按钮以外的其他site
  $siteList.find('li:not(.last)').remove();

  hashMap.forEach((site, index) => {
    const simurl = simplifyUrl(site.url);
    const logo = site.logoType === 'link' ? site.logo : 'https://www.' + simurl + '/favicon.ico';

    const $li = $(`
        <li>
            <div class="site">
                <div class="logo">
                    <img class= "favicon" src= ${JSON.stringify(logo)}> 
                </div>
                <div class="close">
                    <svg class="icon">
                        <use xlink:href="#icon-close"></use>
                    </svg>
                </div>
                <div class="link">${site.name}</div>
            </div>
        </li>
        `).insertBefore($lastLi);

    $li.on('click', () => {
      window.open(site.url);
    });

    // fixme:删除遇到找不到图标时会报错，数据就保存不下来(重复监听？)
    $li.on('click', '.close', (e) => {
      // console.log('这里')
      // 阻止冒泡（阻止不了a标签的跳转事件）
      e.stopPropagation();
      console.log(index);

      let result = window.confirm(`是否确认删除 ${site.name} ？`);
      if (result) {
        hashMap.splice(index, 1);
        render();
      }
    });

    $li.find('.favicon').on('error', (e) => {
      // e.currentTarget.style.display = 'none';
      try {
        // 找不到图标时,用首字母替换掉图片
        e.currentTarget.parentElement.innerHTML = simurl[0].toUpperCase();
      } catch (error) {}
    });
  });
  searchInit($('.searchTab'));
};

// 第一次加载页面渲染$siteList
render();

$('.addButton').on('click', () => {
  $('.addSiteForm').addClass('showDialog');
  $('.mask').css('display', 'block');
});

//提交表单事件
let submitForm = () => {
  const siteName = $('input[name = "siteName"]').val();
  let siteLink = $('input[name = "siteLink"]').val();
  const siteIconsType = $('input[name = "siteIconsType"]:checked').val();
  let siteIcon = $('input[name = "siteIcon"]').val();

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
};

//form 表单关闭事件
let closeForm = () => {
  $('.addSiteForm').removeClass('showDialog');
  // $addSiteForm.css(`transform`, `translateY(-100%)`);
  $('.mask').css('display', 'none');
  // $('.siteIconLink').css('display', 'flex');
  document.querySelector('.addSiteForm').reset();
};

const addEventListeners = () => {
  // 监听onbeforeunload事件
  window.onbeforeunload = () => {
    console.log('页面关闭了');
    save();
  };

  $(document).on('keypress', (e) => {
    if (e.target.localName === 'body') {
      const {key} = e;
      for (let i = 0; i < hashMap.length; i++) {
        if (simplifyUrl(hashMap[i].url)[0].toLowerCase() === key) {
          window.open(hashMap[i].url);
        }
      }
    }
  });

  $(document).mousemove((e) => {
    const clientWidth = document.documentElement.clientWidth;
    // const clientHeight = document.documentElement.clientHeight;
    let classes = 'head';
    const x = e.pageX;
    const y = e.pageY;
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
  });

  // 搜索建议：blog.51cto.com/1095221645/1916022

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
    const active = $('.suggest-item.active');
    let text = '';
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

  $('body').on('click', () => {
    $suggests.attr('class', 'search-suggest hide');
  });

  $('.siteLink').on('focus', (e) => {
    e.currentTarget.style.backgroundColor = '#fff';
  });
};

addEventListeners();


