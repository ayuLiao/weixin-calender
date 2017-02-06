//在使用的View中引入WxParse模块
var WxParse = require('../../wxParse/wxParse.js');

Page({
  data: {
    info: {
      id: 1,
      title: "aaaa",
      img: "../../image/1.png",
      cTime: "2016-12-16 21:40",
      content: "hahahaha"
    }
  },
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '详情页面'
    })
  },
  onLoad: function (options) {
    var that = this
    wx.request({
      url: 'http://localhost/index.php?s=/addon/Yuejin/Yuejin/getDetail',
      data: {
        //从lists.wxml的navigator中获得id
        id: options.id
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        //更新数据
        that.setData({
          info: res.data
        })
        var article = res.data.content;
        /**
        * WxParse.wxParse(bindName , type, data, target,imagePadding)
        * 1.bindName绑定的数据名(必填)
        * 2.type可以为html或者md(必填)
        * 3.data为传入的具体数据(必填)
        * 4.target为Page对象,一般为this(必填)
        * 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)
        */
        WxParse.wxParse('article', 'html', article, that, 5);
      }
    })
  }
})