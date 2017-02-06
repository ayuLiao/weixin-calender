# 微信小程序-月经管理
## 简介
微信作为国民级应用，在2017年1月9日推出微信小程序，目的是为了连接跟多的线下场景，业内人士对微信小程序的看法各有千秋，我个人认为，微信小程序想完全的替代原生Android应用是很困难的，树扎的深，风再大也很难把它吹倒，只要你原生的Android应用足够优秀，用户足够喜欢，你就不必太惊恐于微信小程序，而那些用户很少用，或者功能比较简单的原生Android应用就很有可能被微信小程序给取代。其实微信小程序并不是首创，百度在此之前已经做过类似的尝试，当然结局就是不了了之了，上面这些都不是本文的重点，这篇文章主要来讲讲从0开始快速开发一个比较完整的微信小程序

## 如何学习微信小程序？
开发微信小程序其实并不难，我自身从0开始花了5天时间就做出了一个月经管理小程序，先来看看具体的效果
首先是月经设置界面，用于设置月经的周期、长度和上次月经的时间

![月经设置](http://obfs4iize.bkt.clouddn.com/%E6%9C%88%E7%BB%8F%E8%AE%BE%E7%BD%AE.png)

设置完成后，就会通过简单的算法，显示出女性一个月内不同的生理期

![月经管理](http://obfs4iize.bkt.clouddn.com/%E6%9C%88%E7%BB%8F%E7%AE%A1%E7%90%86.png)

如果只是单纯的月经管理，那么这个小程序的功能就显得比较单一，所以又开发一个内容列表，展示一些月经知识

![月经知识](http://obfs4iize.bkt.clouddn.com/%E6%9C%88%E7%BB%8F%E7%9F%A5%E8%AF%86.png)

![月经知识内容](http://obfs4iize.bkt.clouddn.com/%E6%9C%88%E7%BB%8F%E7%9F%A5%E8%AF%86%E5%86%85%E5%AE%B9.png)

如何在比较短的时间内学会并使用这个新技术呢？我自己使用了5天左右的时间，首先可能因为我帅所以吸收的比较快，其次就是学习新技术也是有套路的

我的惯用套路就是，先看官方文档，微信小程序的官方文档比较全面，而且比较简单，没有什么深邃的内容，花2~3个小时把里面的内容大致的过一遍，有个大概的印象就好了，不要求你全部记住，知道有这个东西则可，然后混迹于比较成熟的技术论坛，直接Google微信小程序论坛，一搜一大堆，看看其他人使用微信小程序遇到什么问题，或者有什么比较好的第三方工具，然后就是从论坛上下载一些实战视频教程，我知道很多技术人员不推荐看视频教程来学习技术，觉得非常浪费时间，但是我觉得看实战教程还是有点用处的，当你看完文档对微信小程序有个模糊的了解后，弄一些视频来看，效果很不错，当然很多视频中老师的语速非常慢，所以我一般都是以2.5倍的速度来看的，遇到自己会的内容，就直接快进跳过，这样就可以快速的学会开发一个完整项目的流程，如果有一些比较好的项目源码，建议也要研究研究，我做完上面的工作用来1天左右的时间，接下来四天就是动手开发了，了解了这么多东西，如果不动手开发，不去遇到一些实际上的问题，是很难掌握前面学习的理论知识的，动手的重要性就不多讲了，总之很重要！

## 动手开发
下面来简单的看看开发的逻辑，只给出代码片段，具体代码可以在文末找到下载链接，项目的结构如下
![ayuLiao项目结构](http://obfs4iize.bkt.clouddn.com/ayuLiao%E9%A1%B9%E7%9B%AE%E7%BB%93%E6%9E%84.png)

首先是用于设置月经周期、长度和上次月经时间的设置界面，该界面使用了picker组件
```
picker
从底部弹起的滚动选择器，现支持三种选择器，通过mode来区分，分别是普通选择器，时间选择器，日期选择器，默认是普通选择器。
```
设置完后，点击按钮，将设置完的数据保存到缓存中，然后跳转到当月生理期显示界面（代码在picker文件夹下）

```js
save_btn(e) {
    const date = e.currentTarget.dataset.date
    const a = e.currentTarget.dataset.array
    const a2 = e.currentTarget.dataset.arrayb
    console.log(date, a, a2)
    try {
      //经期长度
      wx.setStorageSync('jinqi', a)
      //周期长度
      wx.setStorageSync('zhouqi', a2)
      //最近一次月经
      wx.setStorageSync('zuijinriqi', date)
    } catch (e) {
    }

    wx.switchTab({
      url: '../calendar/calendar'
    })
  }
```
这里有三个点要注意
1.这样通过data-Xxx来实现将wxml界面中的数据传递到js中，可以通过e.currentTarget.dataset.Xxx这段js代码获得相应的数据
2.使用wx.setStorageSync(key, value)将数据存入缓存中，缓存中的数据将永久保存，除非用户卸载了微信，最多可以缓存10M的数据
3.要跳转到tabBar指定的界面要使用wx.switchTab(OBJECT)，wx.navigateTo(OBJECT)只能跳转到tabBar指定之外的界面

接着来看现实月经规律的界面，该界面分为3部分

![经期管理3部分](http://obfs4iize.bkt.clouddn.com/%E7%BB%8F%E6%9C%9F%E7%AE%A1%E7%90%863%E9%83%A8%E5%88%86.png)

第一个部分:在app.json文件中进行设置，实现这个tabBar
```
"tabBar": {
    "backgroundColor": "#343",
    "color": "#fff",
    "list": [
      {
        "pagePath": "pages/calendar/calendar",
        "text": "月经记录",
        "iconPath": "image/1.png",
        "selectedIconPath": "image/2.png"
      },
      {
        "pagePath": "pages/lists/lists",
        "text": "月经知识",
        "iconPath": "image/3.png",
        "selectedIconPath": "image/4.png"
      },
      {
        "pagePath": "pages/picker/picker",
        "text": "月经设置",
        "iconPath": "image/2.png",
        "selectedIconPath": "image/4.png"
      }
    ]
  }
```
如果要重其他界面跳转到pagePath属性指定的界面要使用wx.switchTab(OBJECT)

第二部分比较复杂，通过for循环和if判断将对应数组中的值渲染上去
```xml
 <view class="days box box-lr box-wrap">
      <!--当月空出的位置-->
      <view wx:if="{{hasEmptyGrid}}" class="grid white-color box box-align-center box-pack-center" wx:for="{{empytGrids}}" wx:key="{{index}}" data-idx="{{index}}">
      </view>
      <!--当月空出的位置-->
      <!--月数-->
      <view class="grid white-color box box-align-center box-pack-center" wx:for="{{days}}" wx:key="{{index}}" data-idx="{{index}}">
        <view wx:for="{{yue}}" wx:for-item="y">
          <view wx:if="{{item == y}}">
            <view class="day box box-align-center box-pack-center border-radius pink-bg">{{item}}</view>
          </view>
        </view>
        <view wx:for="{{weixian}}" wx:for-item="w">
          <view wx:if="{{item == w}}">
            <view class="day box box-align-center box-pack-center border-radius purple-bg">{{item}}</view>
          </view>
        </view>
        <view wx:for="{{anquan}}" wx:for-item="a">
          <view wx:if="{{item == a}}">
            <view class="day box box-align-center box-pack-center border-radius green-bg">{{item}}</view>
          </view>
        </view>
        <view wx:if="{{item == pailuanri}}">
          <view class="day box box-align-center box-pack-center border-radius orange-bg">{{item}}</view>
        </view>
        <!--月数-->
      </view>
    </view>
  </view>
```
这里有5个数组，empytGrids数组表示渲染时要空出的位置，days数组表示这个月所有的天数，yue数组表示这个月月经的天数，weixian数组表示这个月危险期的天数，anquan数组表示这个月安全期的天数，使用不同的背景色渲染出来则可

先来看一下如何获得empytGrids数组和days数组，代码如下
```js
 // 获取当月共多少天，传年和月
  getThisMonthDays(year, month) {
    //通过Date来获取当月天数
    return new Date(year, month, 0).getDate();
  },
  // 获取当月第一天星期几，传年和月
  getFirstDayOfWeek(year, month) {
    return new Date(Date.UTC(year, month - 1, 1)).getDay();
  },
  // 计算当月1号前空了几个格子
  calculateEmptyGrids(year, month) {
    const firstDayOfWeek = this.getFirstDayOfWeek(year, month);
    let empytGrids = [];
    if (firstDayOfWeek > 0) {
      //将不渲染的添加进入empytGrids数组
      for (let i = 0; i < firstDayOfWeek; i++) {
        empytGrids.push(i);
      }
      this.setData({
        hasEmptyGrid: true,
        empytGrids
      });
    } else {
      this.setData({
        hasEmptyGrid: false,
        empytGrids: []
      });
    }
  },
  // 绘制当月天数占的格子
  calculateDays(year, month) {
    let days = [];
    //获得当月共有多少天
    const thisMonthDays = this.getThisMonthDays(year, month);
    for (let i = 1; i <= thisMonthDays; i++) {
      days.push(i);
    }
    //设置当月天数
    this.setData({
      days
    });
  },
```
代码注释非常清楚，要获得empytGrids数组，先通过getFirstDayOfWeek()获得这个月的第一个天是星期几，因为wxml界面显示时是从星期日开始的，所以这个月第一天是星期一就要空一格，而要获得days数组，则通过getThisMonthDays()方法获得这个月的天数，然后循环赋值则可

接着要获得yue数组、weixian数组和anquan数组，这里就要理解计算月经的算法，网上有很多在线月经计算器，在在线月经计算器旁一般都会有介绍如何简单的计算月经，其实就是通过上次月经的日期获得下次月经的日期，然后通过下次月经的日期减去14就可以获得排卵日，一般排卵日的前5天和后4天就是排卵期，在前面的月经设置界面，我们设置了月经长度、月经周期和上次月经的日期，通过这些信息就可以写出一个简单的算法，将这个月的日期分成3个部分
```
a:当前日期与初次月经的日期相差的天数再与月经周期取余

a<月经长度---->此时在月经期

月经长度<a<月经周期-14-5---->此时在安全期

月经周期-14-5<a<月经周期-14+4---->此时在排卵期

月经周期-14+4<a<月经周期---->此时在安全期

```
通过这个算法，就可以计算月经情况了，部分代码如下
```js
//计算天数差的函数
  DateDiff(sDate1, sDate2) {    //sDate1和sDate2是2002-12-18格式  
    var aDate, oDate1, oDate2, iDays
    aDate = sDate1.split("-")
    oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])    //转换为12-18-2002格式  
    aDate = sDate2.split("-")
    oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])
    iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24)    //把相差的毫秒数转换为天数  
    return iDays
  },


  //计算上一个月月经初潮的日期，用于判断,day为月经周期,yuejindate上次月经日期
  oldyuejindate(yuejindate, day) {
    var yue = yuejindate.split("-")
    var yue2 = new Date(yue[0] + "/" + yue[1] + "/" + yue[2]);
    var intValue = 0;
    var endDate = null;
    var days
    //获得指定日期的毫秒数
    intValue = yue2.getTime();
    // console.log("hahhaha"+intValue)
    intValue -= day * (24 * 3600 * 1000);
    endDate = new Date(intValue);
    days = endDate.getFullYear() + "-" + (endDate.getMonth() + 1) + "-" + endDate.getDate()
    // console.log("hahhaha"+days)
    return days
  },
```
DateDiff()方法用于计算两个日期间相差的天数，oldyuejindate()方法用于计算上一次初次月经的时间，之所以要编写oldyuejindate()方法是因为用户有时喜欢看几个月之前的月经规律，这样在月经设置界面设置的初次月经的日期就不能用了，该日期用于查看这个日期后的月份对应的月经规律，接着看代码
```js
viewyue(cur_year, cur_month) {
    try {
      //月经持续时间
      var jinqi = wx.getStorageSync('jinqi');
      //月经周期
      var zhouqi = wx.getStorageSync('zhouqi');
      //上次月经日期
      var zuijinriqi = wx.getStorageSync('zuijinriqi');
      if (zuijinriqi) {
        // Do something with return value
      }
    } catch (e) {
      // Do something when catch error
    }
    //当前年月日
    var date = new Date();
    const day = date.getDate();
    var nowday = cur_year + "-" + cur_month + "-" + day;
    //将当月所有的日期都根据条件判断一下，然后放入不同的数组中
    var y = 0, a = 0, w = 0;
    var yuejinqi = [];
    var anquanqi = [];
    var weixianqi = [];
    console.log(jinqi, zhouqi, date);
    //月经日期对应的毫秒数
    var zui = (new Date(zuijinriqi)).getTime();
    for (let i = 1; i <= this.getThisMonthDays(cur_year, cur_month); i++) {
      var yueday = cur_year + "-" + cur_month + "-" + i;
      //比初始月经数据要小的日期，就使用前一次月经日期
      if ((new Date(yueday)).getTime() < zui) {
        var zuijinriqi2 = this.oldyuejindate(zuijinriqi, zhouqi * 100)
        console.log(zuijinriqi2)
        var datediff = this.DateDiff(yueday, zuijinriqi2) % zhouqi;
      } else {
        var datediff = this.DateDiff(yueday, zuijinriqi) % zhouqi;
      }
      //月经期
      if (datediff < jinqi) {
        yuejinqi.push(i)
        // console.log("y" + datediff)
        if (nowday == yueday) {
          canvasetext = "月经期";
          canvaseNum = datediff + 1;
        }
      }
      if (jinqi <= datediff && datediff < zhouqi - 19) {
        anquanqi.push(i)
        if (nowday == yueday) {
          canvasetext = "安全期";
          canvaseNum = datediff - jinqi + 1;
        }
      }
      if (zhouqi - 19 <= datediff && datediff < zhouqi - 10) {
         if(datediff!=zhouqi-14){
           weixianqi.push(i)
         }

         if(datediff==zhouqi-14){
          this.setData({
            pailuanri:i
          })
        }
        if (nowday == yueday) {
          canvasetext = "危险期";
          canvaseNum = datediff - zhouqi + 20;
        }
      }
      if (zhouqi - 10 <= datediff && datediff < 28) {
        anquanqi.push(i)
        if (nowday == yueday) {
          canvasetext = "安全期";
          canvaseNum = datediff - zhouqi + 11;
        }
      }

    }
    this.setData({
      yue: yuejinqi,
      anquan: anquanqi,
      weixian: weixianqi
    })
  },

```
当我们要查看上一月下一个月时，就要刷新上面5个数组，从新渲染一遍
```js
// 切换控制年月
  handleCalendar(e) {
    const handle = e.currentTarget.dataset.handle;
    const cur_year = this.data.cur_year;
    const cur_month = this.data.cur_month;
    //上一个月，点击了prev
    if (handle === 'prev') {
      let newMonth = cur_month - 1;
      let newYear = cur_year;
      //如果是一月月，就上一年
      if (newMonth < 1) {
        newYear = cur_year - 1;
        newMonth = 12;
      }
      //获取当月天数
      this.calculateDays(newYear, newMonth);
      //获得当月要空的格子
      this.calculateEmptyGrids(newYear, newMonth);
      this.viewyue(newYear, newMonth)
      this.setData({
        cur_year: newYear,
        cur_month: newMonth
      })

    } else {//下一个月
      let newMonth = cur_month + 1;
      let newYear = cur_year;
      if (newMonth > 12) {
        newYear = cur_year + 1;
        newMonth = 1;
      }

      this.calculateDays(newYear, newMonth);
      this.calculateEmptyGrids(newYear, newMonth);
      this.viewyue(newYear, newMonth)
      this.setData({
        cur_year: newYear,
        cur_month: newMonth
      })
    }
  },
```

接着看到界面中第三个部分，一个曲形，实现这个非常简单，使用canvas绘制一个大圆，让界面显示大圆的一部分则可，然后同样通过canvas将相应的文字绘制上去，看了微信小程序文档，没有获得绘制文字长度的方法，所以为了让界面好看就自己调整了一下文字放置的位置，具体代码如下
```js
// 初始化数据
  onShow(options) {

    const date = new Date();
    const cur_year = date.getFullYear();
    const cur_month = date.getMonth() + 1;
    this.viewyue(cur_year, cur_month)

    var canvasewidth = this.getSystemInfo()
    //canvas绘图
    const ctx = wx.createCanvasContext('ayuCanvas')
    //屏幕宽度的一半
    var c2 = canvasewidth / 2
    // 花园
    ctx.arc(c2, -c2 * 2, c2 * 3, 0, 2 * Math.PI)
    ctx.setFillStyle('#FF5073')
    ctx.fill()

    ctx.setFontSize(15)
    ctx.setFillStyle('#FFFFFF')
    ctx.fillText(canvasetext, c2-24, c2/3-20)
    ctx.setFontSize(50)
    if(canvaseNum<10){
       ctx.fillText(canvaseNum, c2-15, c2-40)
        ctx.setFontSize(15)
    ctx.fillText("天", c2+20, c2-40)
    }else{
      ctx.fillText(canvaseNum, c2-25, c2-40)
       ctx.setFontSize(15)
    ctx.fillText("天", c2+35, c2-40)
    }
    ctx.draw()

    const weeks_ch = ['日', '一', '二', '三', '四', '五', '六'];
    //调用calculateEmptyGrids计算出当月空出几个格子，传入年和月
    this.calculateEmptyGrids(cur_year, cur_month);
    //调用calculateDays计算当月的天数
    this.calculateDays(cur_year, cur_month);
    //获得系统消息
    this.getSystemInfo();
    this.setData({
      cur_year,
      cur_month,
      weeks_ch
    })
  },
```
这样，月经规律显示界面就完成了，至于wcss代码就不展示出来了，太占篇幅，其实跟css十分相似，这篇就先将到这里，下一篇接着将月经知识展示列表的制作

下一篇文章，会发布到我博客和微信公众号上

博客：lmwen.top

微信公众号:懒写作

![懒写作](http://obfs4iize.bkt.clouddn.com/qrcode_for_gh_b26d6658df74_258.jpg)
