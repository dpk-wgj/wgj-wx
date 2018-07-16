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
    canICancel: true
  },
  onLoad: function (option) {
    this.setData({
      // orderId: option.orderId
      orderId: 483
    })

    let driverInfo = app.globalData.driverInfo
    console.log("接收到的司机信息：", driverInfo)
    let userId = app.globalData.userInfo.passengerId
    console.log("呼车传过来的订单id：", option.orderId)
    
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
      }else if(res.status === 2){
        console.log("本次派送已经结束了")
        wx.redirectTo({
          url: '/pages/evaluation/evaluation?orderId=' + _this.data.orderId + '&driver=' + driverInfo,
        })
      }
    })


    wx.setStorage({
      key: "driverInfo",
      data: driverInfo
    });
    // console.log("dasdasdas", driverInfo.driverInfo.driverName)
    this.setData({
      hiddenLoading: true,
      driver: driverInfo,
      canICancel: true
    })
    // console.log("12121",this.data.driver.driverInfo.driverName)

    // 无用
  //   let { bluraddress,strLatitude,strLongitude,endLatitude,endLongitude} = app.globalData
  //   this.setData({
  //     markers: [{
  //       iconPath: "../../assets/images/str.png",
  //       id: 0,
  //       latitude: strLatitude,
  //       longitude:strLongitude,
  //       width: 30,
  //       height: 30
  //     },{
  //       iconPath: "../../assets/images/end.png",
  //       id: 0,
  //       latitude: endLatitude,
  //       longitude:endLongitude,
  //       width: 30,
  //       height: 30
  //     }],
  //     polyline: [{
  //       points: [{
  //         longitude: strLongitude,
  //         latitude: strLatitude
  //       }, {
  //         longitude:endLongitude,
  //         latitude:endLatitude
  //       }],
  //       color:"red",
  //       width: 4,
  //       dottedLine: true
  //     }],
  
  //   });
  // wx.getSystemInfo({
  //   success: (res)=>{
  //     this.setData({
  //       controls:[{
  //         id: 1,
  //         iconPath: '../../assets/images/mapCart.png',
  //         position: {
  //           left: res.windowWidth/2 - 20,
  //           top: res.windowHeight/2 - 80,
  //           width: 22,
  //           height: 45
  //           },
  //         clickable: true
  //       }],
     
  //     })
  //   }
  // })
  
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
  },
  // 无用
  // requesDriver(){
  //   util.request({
  //     url: 'https://www.easy-mock.com/mock/5aded45053796b38dd26e970/comments#!method=get',
  //     // mock: false,

  //   }).then((res)=>{
      
  //     const drivers = res.data.drivers
  //     const driver = drivers[Math.floor(Math.random()*drivers.length)];
  //     wx.setStorage({
  //       key:"driver",
  //       data:driver
  //     });
  //     this.setData({
  //       hiddenLoading:true,
  //       driver:driver
  //     })
  //   })

  // },

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
    // wx.redirectTo({
    //   url: "/pages/cancel/cancel"
    // })

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
              setTimeout(function () {
                wx.redirectTo({
                  url: '/pages/index/index',
                })
              }, 2000);
              
            }
          })

        } else if (res.cancel) {
        }
      }
    })  
  },
  
  toEvaluation(){
    wx.redirectTo({
      url:"/pages/evaluation/evaluation?orderId=" + this.data.orderId,
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
    wx.makePhoneCall({
      // phoneNumber: this.phone,
      phoneNumber: "12345678900",
      success: function (){
        console.log("拨打电话成功")
      },
      fail: function() {
        console.log("拨打电话失败")
      }
    })
  }

  
  
})