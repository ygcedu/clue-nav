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

    $li.children('.favicon').on('error', (e) => {
      // e.currentTarget.style.display = 'none';
      try {
        // 找不到图标时,用首字母替换掉图片
        e.currentTarget.parentElement.innerHTML = simurl[0].toUpperCase();
      } catch (error) {}
    });
  });
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
      console.log(e.key);
      const {key} = e;
      for (let i = 0; i < hashMap.length; i++) {
        if (hashMap[i].logo.toLowerCase() === key) {
          window.open(hashMap[i].url);
        }
      }
    }
  });

  $(document).mousemove((e) => {
    const clientWidth = document.documentElement.clientWidth;
    // const clientHeight = document.documentElement.clientHeight;
    let classes = 'move';
    const x = e.pageX;
    const y = e.pageY;
    if (x < (clientWidth - 138) / 2) {
      classes += ' left';
    } else if (x > (clientWidth - 138) / 2 + 138) {
      classes += ' right';
    }

    if (y < 43) {
      classes += ' top';
    } else if (y > 268) {
      classes += ' bottom';
    }
    $('.move').attr('class', classes);
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
};

addEventListeners();
