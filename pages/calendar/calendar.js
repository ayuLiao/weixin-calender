var canvasetext = "";
var canvaseNum = 1;
const page = {
  data: {
    // hasEmptyGrid 变量控制是否渲染空格子，若当月第一天是星期天，就不应该渲染空格子
    hasEmptyGrid: false,
    yue: [],
    anquan: [],
    weixian: [],
    canvasewidth: 375,
    pailuanri:0
  },

  // 控制scroll-view高度
  getSystemInfo() {
    //获得系统数据
    const res = wx.getSystemInfoSync();
    console.log(res.windowWidth)
    this.setData({
      scrollViewHeight: res.windowHeight * res.pixelRatio || 667,
      canvasewidth: res.windowWidth
    });

    return res.windowWidth;
  },

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


  //计算上一个月月经初潮的日期，用于判断,day为月经周期,yuejindate上传月经日期
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
    // const cur_year = date.getFullYear();
    // const cur_month = date.getMonth() + 1;
    const day = date.getDate();
    var nowday = cur_year + "-" + cur_month + "-" + day;
    // console.log(this.DateDiff(nowday, zuijinriqi));
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

      //  this.oldyuejindate(yueday,28)

      // console.log(d)
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
    // console.log(zhouqi-10,zhouqi-19,jinqi)
    // for (let j = 0; j < anquanqi.length; j++) {
    //   console.log("a" + anquanqi[j])
    // }

    this.setData({
      yue: yuejinqi,
      anquan: anquanqi,
      weixian: weixianqi
    })
  },
  // 初始化数据
  onShow(options) {

    const date = new Date();
    const cur_year = date.getFullYear();
    const cur_month = date.getMonth() + 1;
    this.viewyue(cur_year, cur_month)

    var canvasewidth = this.getSystemInfo()
    //canvas绘图
    const ctx = wx.createCanvasContext('ayuCanvas')
    var c2 = canvasewidth / 2
    // Draw coordinates
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
  //微信的分享方法
  onShareAppMessage() {
    return {
      title: '男朋友',
      desc: '拒绝大血崩，让他来照顾你的大姨妈',
      path: 'pages/calendar/calendar'
    }
  }
}

Page(page)