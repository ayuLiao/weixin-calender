// pages/picker/picker.js
var ayu = "AYU"
const page = {
  data: {
    array: [],
    array2: [],
    date: '2016-09-01',
    index: 5,
    index2: 28,
    tocalendar: 0
  },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  bindPickerChange2: function (e) {
    this.setData({
      index2: e.detail.value
    })
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  onShow:function(){
     //月经持续时间
      var jinqi = wx.getStorageSync('jinqi');
      //月经周期
      var zhouqi = wx.getStorageSync('zhouqi');
      //上次月经日期
      var zuijinriqi = wx.getStorageSync('zuijinriqi');
      if(jinqi!=null&&zhouqi!=null&&zuijinriqi!=null){
        this.setData({
          index:jinqi,
          index2:zhouqi,
          date:zuijinriqi
        })
      }
  },
  onLoad: function () {
    //月经持续时间
    ayu = wx.getStorageSync('jinqi');
    if (ayu != "AYU") {
      wx.switchTab({
        url: '../calendar/calendar'
      })
    }
    console.log('onLoad')
    const date = new Date();
    const cur_year = date.getFullYear();
    const cur_month = date.getMonth() + 1;
    const day = date.getDate();
    var nowday = cur_year + "-" + cur_month + "-" + day;
    var arr = []
    var arr2 = []
    for (let i = 0; i < 110; i++) {
      if (i < 40) {
        arr[i] = i
      }
      arr2[i] = i
    }
    this.setData({
      array: arr,
      array2: arr2,
      //当天时间
      date: nowday
    })
  },

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
}

Page(page)