 const app = getApp()
import util from '../../utils/index';
Page({
  data: {
    star: 0,
    time: "",
    content: "",
    starMap: [
      '', '', '', '', '',
    ],
    play: '',
    id: 0,
    startTime: '',
    endTime: '',
    startLocation: '',
    endLocation: '',
    isComment: false,
    isfinished: true
  },
  myStarChoose(e) {
    let star = parseInt(e.target.dataset.star) || 0;
    this.setData({
      star: star,
    });
  },
  // 跳转评价
  toEvaluation: function(){
    var that = this
    wx.navigateTo({
      url: '/pages/evaluationafter/evaluationafter?id=' + this.data.id + '&driverName=' + this.data.driverName + '&driverLevelStar=' + this.data.driverLevelStar + '&driverPhoneNumber=' + this.data.driverPhoneNumber + '&carNumber=' + this.data.carNumber,
      success: function(e){
        //  console.log('跳转评价成功')
      },
      fail: function (e) {
        // console.log('跳转评价失败')
      }
    })
  },
  // 跳转投诉
  toComplain: function(){
    var that = this
    wx.navigateTo({
      url: '/pages/complain/complain?id=' + that.data.id + '&driverName=' + this.data.driverName + '&driverLevelStar=' + this.data.driverLevelStar + '&driverPhoneNumber=' + this.data.driverPhoneNumber + '&carNumber=' + this.data.carNumber,
      success: function (e) {
        //  console.log('跳转投诉成功')
      },
      fail: function(e){
        // console.log('跳转投诉失败')
      }
    })
  },
  // 删除评价
  cancel(e) {
    var that = this
    // console.log(this.data.commentId)
    let param = {
      commentId: this.data.commentId
    }
    // console.log(param)
    util.request({
      url: `${app.globalData.baseUrl}/api/passenger/deleteCommentInfoByCommentId`,
      method: "post",
      data: param
    }).then((res) => {
      // console.log(res)
      wx.navigateBack({
        delta: 1
      })
    })
  },
  onLoad(options) {
    var that = this
    console.log('options:',options)
    // console.log(app.globalData.play)
    this.setData({
      play: app.globalData.play,
      id: options.id,
      startTime: options.startTime,
      endTime: options.endTime,
      startLocation: options.startLocation,
      endLocation: options.endLocation,
      driverName: options.driverName,
      driverLevelStar: options.driverLevelStar/20,
      driverPhoneNumber: options.driverPhoneNumber,
      orderStatus: options.orderStatus,
      carNumber: options.carNumber
    })
    // 订单是否已完成=>按钮是否显示
    if (that.data.orderStatus == "未完成"){
      this.setData({
        isfinished: false
      })
    } else{
      // 获取评价
      let param = {
        orderId: this.options.id
      }
      // console.log(this.options.id)
      util.request({
        url: `${app.globalData.baseUrl}/api/passenger/getCommendInfoByOrderId`,
        method: "post",
        data: param
      }).then((res) => {
        // console.log(res)
        if (res.status == 0) {
          that.setData({
            isComment: false
          })
        } else {
          if (res.result.commentId != null) {
            that.setData({
              isComment: true
            })
          }
          // var clear, good, know, stable
          if (res.result.isClear == 1) {
            that.setData({
              clear: '车内整洁'
            })
          }
          if (res.result.isGood == 1) {
            that.setData({
              good: '态度良好'
            })
          }
          if (res.result.isKnow == 1) {
            that.setData({
              know: '认路正确'
            })
          }
          if (res.result.isStable == 1) {
            that.setData({
              stable: '开车平稳'
            })
          }
          var star = res.result.commentPoint / 20
          that.setData({
            commentId: res.result.commentId,
            commentContent: res.result.commentContent,
            isClear: res.result.isClear,
            isGood: res.result.isGood,
            isKnow: res.result.isKnow,
            isStable: res.result.isStable,
            isComment: true,
            star: star
          })
        }
      })
    }
  },
  // 拨打电话
  calling: function () {
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
  onShow: function(options){
    
  },
  
});