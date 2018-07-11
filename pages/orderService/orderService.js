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
    hiddenLoading:false
  },
  onLoad: function () {

    let { bluraddress,strLatitude,strLongitude,endLatitude,endLongitude} = app.globalData
    this.setData({
      markers: [{
        iconPath: "../../assets/images/str.png",
        id: 0,
        latitude: strLatitude,
        longitude:strLongitude,
        width: 30,
        height: 30
      },{
        iconPath: "../../assets/images/end.png",
        id: 0,
        latitude: endLatitude,
        longitude:endLongitude,
        width: 30,
        height: 30
      }],
      polyline: [{
        points: [{
          longitude: strLongitude,
          latitude: strLatitude
        }, {
          longitude:endLongitude,
          latitude:endLatitude
        }],
        color:"red",
        width: 4,
        dottedLine: true
      }],
  
    });
  wx.getSystemInfo({
    success: (res)=>{
      this.setData({
        controls:[{
          id: 1,
          iconPath: '../../assets/images/mapCart.png',
          position: {
            left: res.windowWidth/2 - 20,
            top: res.windowHeight/2 - 80,
            width: 22,
            height: 45
            },
          clickable: true
        }],
     
      })
    }
  })
  
  },

  onShow(){
    this.requesDriver();
    this.mapCtx = wx.createMapContext("didiMap");
    this.movetoPosition();
    setInterval(function () {
      // console.log('ok')
    }, 1000) //循环时间 这里是1秒 
  },
  // 获取司机信息
  requesDriver(){
    util.request({
      url: 'https://www.easy-mock.com/mock/5aded45053796b38dd26e970/comments#!method=get',
      // mock: false,

    }).then((res)=>{
      
      const drivers = res.data.drivers
      const driver = drivers[Math.floor(Math.random()*drivers.length)];
      wx.setStorage({
        key:"driver",
        data:driver
      });
      this.setData({
        hiddenLoading:true,
        driver:driver
      })
    })

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
    // wx.redirectTo({
    //   url: "/pages/cancel/cancel"
    // })
    wx.showToast({
      title: '取消中',
      icon: 'loading'
    })
    setTimeout(() => {
      wx.redirectTo({
        url: '/pages/index/index',
      })
    }, 2000)
  },
  
  toEvaluation(){
    wx.redirectTo({
      url:"/pages/evaluation/evaluation",
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
      success: function (){
        console.log("拨打电话成功")
      },
      fail: function() {
        console.log("拨打电话失败")
      }
    })
  }

  
  
})