import util from '../../utils/index';
const app = getApp()
var array = [];
Page({

  data: {
    star: 0,
    starMap: [
       '','','','','',
    ],
    ischecked:false,
    play:'',
    choose: [],
    list: [
      {id:0,name: 'clean', value: '车内整洁',checked:false},
      {id:1, name: 'stable', value: '开车平稳', checked: false},
      {id:2, name: 'dirction', value: '认路正确',checked:false},
      {id:3,name: 'attitude', value: '态度良好',checked:false }
    ],
    checkedList: []
  },
  myStarChoose(e) {
      let star = parseInt(e.target.dataset.star) || 0;
      this.setData({
          star: star,
      });
      // console.log(this.data.star)
  },

 
  // 选择标签
  serviceValChange: function (e) {
    var allGoodsFilte = this.data.list;
    var checkArr = e.detail.value;
    for (var i = 0; i < allGoodsFilte.length; i++) {
      if (checkArr.indexOf(i+"")!=-1) {
        allGoodsFilte[i].checked = true;
        // console.log(allGoodsFilte[i].checked)
      } else {
        allGoodsFilte[i].checked = false;
        // console.log(allGoodsFilte[i].checked)
      }
    }
    this.setData({
      list: allGoodsFilte,
      checkedList: e.detail.value
    })
    // console.log(this.data.checkedList)
  },

  onLoad(options){
    app.globalData.driverInfo.driverLevelStar /= 20
    console.log(app.globalData.driverInfo)
    this.setData({
      play: app.globalData.play,
      driver: app.globalData.driverInfo,
      orderId: options.orderId,
      // driver: options.driverInfo,
      // car: options.carInfo
    })
    console.log('driver:', this.data.driver)
    console.log('name:', this.data.driver.driverInfo.driverName)
    console.log('orderId:', options.orderId)
    // console.log('driver:', options.driverInfo)
    // console.log('car:',options.carInfo)
    // console.log('评价界面接收到司机信息：', this.data.driver)
    // console.log('评价：', this.data.id)
    // console.log('play:'+this.data.play)
  },
  // 获取评价内容
  bindTextAreaBlur: function (e) {
    this.setData({
      content: e.detail.value
    })
    // console.log('text:' + this.data.content)
  },
  // 提交评价
  submit: function (e) {
    var that = this
    setTimeout(() => {
      var isClear = 0;
      var isStable = 0;
      var isKnow = 0;
      var isGood = 0;
      // console.log('btn:' + this.data.content)
      // console.log(this.data.checkedList)
      for (var i = 0; i < this.data.checkedList.length; i++){
        var is = this.data.checkedList[i]
        if (is == 0){
          isClear = 1;
        } else if(is == 1){
          isStable = 1;
        } else if (is == 2) {
          isKnow = 1;
        } else if (is == 3) {
          isGood = 1;
        }
      }
      var point = that.data.star * 20
      let param = {
        commentContent: this.data.content,
        isClear: isClear,
        isStable: isStable,
        isKnow: isKnow,
        isGood: isGood,
        orderId: that.data.orderId,
        commentPoint: point
      }
      // console.log('评价传值：',param)
      util.request({
        url: `${app.globalData.baseUrl}/api/passenger/addCommentInfoByOrderId`,
        method: "post",
        data: param
      }).then((res) => {
        // console.log(res)
      })
    }, 900)
    
    wx.showLoading({
      title: '提交中',
      success: function(e){
        setTimeout(function () {
          wx.redirectTo({
            url: '/pages/index/index',
          })
        }, 2000);
        
      }
    })
  },
  // 拨打电话
  calling: function () {
    var that = this;
    // wx.request({
    //   url: '',
    //   method: 'GET',
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   success: function (res) {
    //     that.setData({
    //       phone: res.data.phone
    //     })
    //   }
    // })
    wx.makePhoneCall({
      // phoneNumber: this.phone,
      phoneNumber: "12345678900",
      success: function () {
        console.log("拨打电话成功")
      },
      fail: function () {
        console.log("拨打电话失败")
      }
    })
  }
});