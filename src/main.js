const $siteList = $('.siteList')
const $lastLi = $siteList.find('li.last')
const x = localStorage.getItem('x')
const xObject = JSON.parse(x)

// 如果cookie内没有x值则取后面的默认值
const hashMap = xObject || [
    {logo: 'A', logoType: 'text', url: 'https://www.acfun.cn'},
    {logo: './images/bilibili.png', logoType: 'image', url: 'https://www.bilibili.com'}
]

const render = () => {
    // 清除除了最后一个新增按钮以外的其他site
    $siteList.find('li:not(.last)').remove()

    hashMap.forEach(node => {
        const $li = $(`
        <li>
            <a href="${node.url}">
                <div class="site">
                    <div class="logo">${node.logo[0]}</div>
                    <div class="link">${node.url}</div>
                </div>
            </a>
        </li>
        `).insertBefore($lastLi)
    })
}

// 第一次加载页面渲染$siteList
render()

$('.addButton').on('click', () => {
    let url = window.prompt("请问你要添加的网址是啥？")
    if (url.indexOf('http') !== 0) {
        url = 'https://' + url
    }
    console.log(url)
    hashMap.push({
        logo: url[0],
        logoType: 'text',
        url: url
    })

    // 重新渲染$siteList
    render()
})


// 监听onbeforeunload事件
window.onbeforeunload = ()=>{
    console.log('页面关闭了')
    const string = JSON.stringify(hashMap)
    // 本地缓存cookie中保存x变量，值为$siteList字符串
    localStorage.setItem('x',string)
}