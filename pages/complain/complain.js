import util from '../../utils/index';
const app = getApp()
var array = [];
Page({

  data: {
    star: 0,
    starMap: [
       '','','','','',
    ],
    play:'',
    content:'',
    orderId: ''
  },
  myStarChoose(e) {
      let star = parseInt(e.target.dataset.star) || 0;
      this.setData({
          star: star,
      });
  },

  onLoad(options){
    // console.log(options)
    // wx.getStorage({
    //   key:'driver',
    //   success: (res)=>{
    //       // console.log(res.data)
    //       this.setData({
    //         driver:res.data
    //       })
    //   } 
    // })
  // console.log(app.globalData.play)
    this.setData({
      play: app.globalData.play,
      orderId: options.id,
      driverName: options.driverName,
      driverLevelStar: options.driverLevelStar,
      driverPhoneNumber: options.driverPhoneNumber
    })
  },

  // 拨打电话
  calling: function () {
    var that = this;
    var that = this;
    // console.log('手机号：', that.data.driverPhoneNumber)
    wx.makePhoneCall({
      phoneNumber: that.data.driverPhoneNumber,
      success: function () {
        // console.log("拨打电话成功")
      },
      fail: function () {
        // console.log("拨打电话失败")
      }
    })
  },
  // 获取投诉内容
  bindTextAreaBlur: function(e){
    this.setData({
      content: e.detail.value
    })
  },
  // 提交投诉
  submit: function(e) {
    // console.log(e)
    var that = this
    setTimeout(() => {
      let param ={
        complaintContent: that.data.content,
        complaintStatus: 0,
        orderId: that.data.orderId,
        passengerId: app.globalData.passengerId
      }
      console.log('提交投诉',param)
      util.request({
        url: "http://localhost:8000/api/passenger/addComplaintInfoByOrderId",
        method: "post",
        data: param
      }).then((res) => {
        // console.log(res)
      })
    }, 1000)
    
    wx.showLoading({
      title: '提交中',
    })
    setTimeout(() => {
      wx.navigateTo({
        url: '/pages/message/message',
      })
    }, 2000)
  }
});