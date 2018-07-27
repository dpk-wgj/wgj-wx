var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
qqmapsdk = new QQMapWX({
  key:'DHNBZ-2ZLKK-T7IJJ-AXSQW-WX5L6-A6FJZ'
});
import util from '../../utils/index';

const app = getApp();

Page({
  data: {
    scale: 14,
    hiddenLoading:false,
    canICancel: true,
    count: 0
  },
  onLoad: function (option) {
    this.setData({
      orderId: option.orderId,
      driverInfo: app.globalData.driverInfo
    })

    let driverInfo = app.globalData.driverInfo
    console.log("接收到的司机信息：", driverInfo)
    let userId = app.globalData.userInfo.passengerId
    console.log("wait转到orderService呼车传过来的订单id：", option.orderId)
    
    let _this = this
    
    //websocket
    wx.onSocketMessage(function (res) {
      res = JSON.parse(res.data)
      console.log('收到服务器内容：', res)

      if (res.status === 1) {//司机端确认接到乘客
        _this.setData({
          canICancel: false
        })
        console.log("司机端接到了乘客！！！！！")
      }else if(res.status === 2){//已到达目的地
        console.log("本次派送已经结束了,传司机信息：", _this.data.driverInfo)
        wx.closeSocket()
        wx.redirectTo({
          url: '/pages/evaluation/evaluation?orderId=' + _this.data.orderId
        })
      }else if(res.status === 3){//司机端按下转派
          wx.closeSocket()
          wx.redirectTo({
            url: `/pages/wait/wait?orderId=${option.orderId}&isChangeDriver=true`,
          })
          console.log("转派",res)
        }
    })


    wx.setStorage({
      key: "driverInfo",
      data: driverInfo
    });
    // console.log("dasdasdas", driverInfo.driverInfo.driverLevelStar)
    driverInfo.driverInfo.driverLevelStar /= 20
    this.setData({
      hiddenLoading: true,
      driver: driverInfo,
      canICancel: true
    })
    // console.log("12121", this.data.driver.driverInfo.driverLevelStar)
  
  },

  sendSocketMessage: function (msg) {
    if (app.globalData.socketOpen) {
      wx.sendSocketMessage({
        data: msg
      })
    } else {
      app.globalData.socketMsgQueue.push(msg)
    }
  },
  onShow(){
    // this.requesDriver();
    this.mapCtx = wx.createMapContext("didiMap");
    this.movetoPosition();
    var randomTime = 300;
    var timer = new Date(0, 0);
    var curr = 0;
    this.countTimer = setInterval(() => {
      if (this.data.count <= randomTime) {
        timer.setMinutes(curr / 60);
        timer.setSeconds(curr % 60);
        curr++;
        // this.drawProgress(this.data.count / (60 / 2))
        this.data.count++;
        // console.log('curr:',curr)
      } else {
        this.setData({
          canICancel: false
        })
        // console.log('五分钟已到，无法取消订单')
        clearInterval(this.countTimer);
      }
    }, 1000)
  },

  drawProgressbg: function () {
    var ctx = wx.createCanvasContext('canvasProgressbg');
    ctx.setLineWidth(4);
    ctx.setStrokeStyle("#e5e5e5");
    ctx.setLineCap("round");
    ctx.beginPath();
    ctx.arc(110, 110, 100, 0, 2 * Math.PI, false);
    ctx.stroke();
    ctx.draw();
  },

  bindcontroltap: (e)=>{
    console.log("hello")
    this.movetoPosition();
  },
  onReady(){
   
  },
  movetoPosition: function(){
    this.mapCtx.moveToLocation();
  },
 
  bindregionchange: (e)=>{

  },
  // 取消订单
  toCancel(){

    let _this = this
    wx.showModal({
      title: '提示',
      content: '您确认要取消此次订单吗',
      success: function (res) {
        if (res.confirm) {
          _this.sendSocketMessage("passenger,cancelOrder")
          wx.showToast({
            title: '取消中',
            icon: 'loading',
            success: function(e){
              let params = {
                orderId: _this.data.orderId
              }
              console.log('params:', params)
              util.request({
                url: `${app.globalData.baseUrl}/api/passenger/updateOrderInfoByOrderId`,
                method: 'post',
                data: params
              }).then(res => {
                console.log(res)
                if (res.status === 1) {
                  wx.redirectTo({
                    url: "/pages/index/index?cancel=" + true + "&cancelId=" + _this.data.orderId,
                  })
                }
              })
              // setTimeout(function () {
              //   wx.redirectTo({
              //     url: '/pages/index/index',
              //   })
              // }, 2000);
              
            }
          })

        } else if (res.cancel) {
        }
      }
    })  
  },
  
  toEvaluation(){
    wx.redirectTo({
      url: "/pages/evaluation/evaluation?orderId=" + this.data.orderId + '&driver=' + app.globalData.driverInfo,
    })
  },
  onReady: function () {
    wx.getLocation({
      type: "gcj02",
      success:(res)=>{
        this.setData({
          longitude:res.longitude,
          latitude: res.latitude
        })
      }
      })
     
  },
  // 拨打电话
  calling: function () {
    var that = this;
    console.log('app.driverInfo',app.globalData.driverInfo)
    wx.makePhoneCall({
      phoneNumber: app.globalData.driverInfo.driverInfo.driverPhoneNumber,
      success: function (){
        console.log("拨打电话成功")
      },
      fail: function() {
        console.log("取消拨打电话")
      }
    })
  }

  
  
})