# Authing Log SDK


## 引入项目
```
# use npm
npm install @authing/log

# use yarn
yarn add @authing/log
```

## 初始化
```javascript
import { AuthingLog } from '@authing/log'

const authingLog = AuthingLog.registerLogTrack({
  reportFunc: (m) => {
    console.log('执行一次埋点任务', m)
  },
})
```
初始化的关键是调用一次 `registerLogTrack` 方法，传入一个对象作为参数。

一旦函数调用成功，程序会自动寻找所有带有 `data-log` 标记的 DOM 对象，并在合适的时机自动触发埋点（标记式埋点），具体埋点规则请阅读文档的编码解析部分。

传入对象的格式为 `key: callback` 的形式，一个名字对应一个埋点函数，这个函数由调用方自行实现，例如要用 fetch 调用接口，或是 ajax 请求图片都可以。

由于是一个对象，所以可以传入多个函数，可以在后面一次性触发，也可以通过 log 控制只触发一部分。

`registerLogTrack` 方法返回一个 authingLog 实例对象，可以用来在 js 中手动埋点。

## 标记式埋点
也称为自动埋点，通过在元素的 `data-*` 自定义属性上标记，即可在对应时机自动触发埋点函数

```html
<button data-log='console/n1/n2'>登录</button>
```


## 命令式埋点
也称为手动埋点，通过一行 js 代码埋点

```javascript
// 原生代码中
document.querySelector('#login').addEventListener('click', () => {
  authingLog.bury('console/m3/m4')
})

// react 中
<button onClick={() => authingLog.bury('console/n1/n2')}>登录</button>
```

## 使用示例
```javascript
const reportGoogle = (m) => {
  // 模拟发送谷歌埋点
  fetch('google.example.com')
}

const reportBaidu = (m) => {
  // 模拟发送百度埋点
  axios.get('baidu.example.com')
}

const gsgl = AuthingLog.registerLogTrack({
  reportGoogle: reportGoogle,
  reportBaidu: reportBaidu,
})

document.querySelector('#l1').addEventListener('click', () => {
  gsgl.bury('console/m3/m4')
})
```


## 编码规则
```javascript
data-log="site/page/block/element"

/*
site = console // 站点
page = costManage // 哪个页面
block = pageTitle // 页面的哪一块
element = upgrade // 按钮的名字
*/

data-log="site/page/block/element?alive=reportName"

// 默认触发所有埋点方法，可以通过 `alive` 参数指定只触发某个方法
```

一个点的标记分为 4 层，每层的含义比较明确就不多赘述，重要的是信息不可以省略，
为了降低开发时业务层的负担，可以在 config 里面设置默认值（见后文 config 参数说明）。

设置默认值后，一旦遇到简写情况，按照从左到右的顺序补全，举例说明：

```javascript
defaultSite = 'authing'
defaultPage = 'index'
defaultBlock = 'header'

data-log="page/block/element"
// 实际埋点结果：authing/page/block/element

data-log="block/element"
// 实际埋点结果：authing/index/block/element

data-log="element"
// 实际埋点结果：authing/index/header/element

```

## API 参数
以下面一段代码为模板，分别说明其中的 API 参数
``` javascript
const callbacks = {
  reportFunc: (m) => {
    console.log('执行一次埋点任务', m)
  },
}

const config = {
  defaultSite: "authing",
  defaultPage : 'index',
  defaultBlock: 'header',
}

const authingLog = AuthingLog.registerLogTrack(callbacks, config)

<button data-log="door/footer/signIn">登录</button>
```


### AuthingLog.registerLogTrack 参数说明


| 参数名    | 含义                                                       | 示例                       |
| --------- | ---------------------------------------------------------- | -------------------------- |
| callbacks | 一个对象，单项为回调函数，函数中自行实现埋点 | { foo:()=>{}, baz:()=>{} } |
| config    | 一个对象，允许设置埋点配置                                 | {defaultSite: "authing"}   |

### config 参数说明

| 参数名            | 含义                  |
| ----------------- | --------------------- |
| defaultSite       | 默认的 site 值        |
| defaultPage       | 默认的 page 值        |
| defaultBlock      | 默认的 block 值       |
| defaultElement    | 默认的 element 值     |
| defaultUserId     | 默认的 user id 值     |
| defaultUserPoolId | 默认的 userpool id 值 |

default 值会在缺少对应值的时候尝试应用。

### 回调函数参数说明
调用 `registerLogTrack` 时，传入的 `report` 函数里会有一个参数，这个参数表示了埋点时的信息，在实现埋点业务时，可以使用这些信息。

参数中至少包含如下信息：


| 参数名         | 含义                                            |
| -------------- | ----------------------------------------------- |
| name           | 按照 site_page_block_element 组装出的名称字符串 |
| site           | 埋点网站                                        |
| page           | 埋点页面                                        |
| block          | 埋点区块                                        |
| element        | 埋点元素                                        |
| expansionBlock | 拓展块信息                                      |
| uid            | 用户 id （仅 authing 可用）                     |
| upid           | 用户池 id（仅 authing 可用）                    |


---
如有疑问，请发送邮件到 djw7569@gmail.com
