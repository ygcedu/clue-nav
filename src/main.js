const $siteList = $('.siteList')
const $lastLi = $siteList.find('li.last')
const x = localStorage.getItem('x')
const xObject = JSON.parse(x)

// 如果cookie内没有x值则取后面的默认值
const hashMap = xObject || [
    {logo: 'A', url: 'https://www.acfun.cn'},
    {logo: 'B', url: 'https://www.bilibili.com'}
]

const simplifyUrl = (url) => {
    return url.replace('https://', '')
        .replace('http://', '')
        .replace('www', '')
        .replace(/\/.*/, '') // 删除以/开头的内容
}

const render = () => {
    // 清除除了最后一个新增按钮以外的其他site
    $siteList.find('li:not(.last)').remove()

    hashMap.forEach((node, index) => {
        console.log(index)
        const $li = $(`
        <li>
            <div class="site">
                <div class="logo">${node.logo}</div>
                <div class="link">${simplifyUrl(node.url)}</div>
                <div class="close">
                    <svg class="icon">
                        <use xlink:href="#icon-close"></use>
                    </svg>
                </div>
            </div>
        </li>
        `).insertBefore($lastLi)

        // 用js来控制页面跳转（更加灵活），替换掉a标签
        $li.on('click', () => {
            window.open(node.url)
        })

        $li.on('click', '.close', (e) => {
            // console.log('这里')
            // 阻止冒泡（阻止不了a标签的跳转事件）
            e.stopPropagation()
            hashMap.splice(index, 1)
            render()
        })
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
        logo: simplifyUrl(url)[0].toUpperCase(),
        url: url
    })

    // 重新渲染$siteList
    render()
})


// 监听onbeforeunload事件
window.onbeforeunload = () => {
    console.log('页面关闭了')
    const string = JSON.stringify(hashMap)
    // 本地缓存cookie中保存x变量，值为$siteList字符串
    localStorage.setItem('x', string)
}