import util from '../../utils/index';
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
qqmapsdk = new QQMapWX({
  key:'DHNBZ-2ZLKK-T7IJJ-AXSQW-WX5L6-A6FJZ'
});
const app = getApp()
Page({
    data: {
        currentTab: 1,
        currentCost: 0,
        cart: '',
        navScrollLeft: 0,
        duration: 1000,
        interval: 5000,
        isLoading: true,
        color:"#cccccc",
        callCart: true,
        destination: '',
        bluraddress : '',
        index: '',
        address: '',
        hasMessage: false,
        startLatitude: '',
        startLongitude: '',
        endLatitude: '',
        endLongitude: '',
        scale: 14,
        
    },
    onLoad: function(options) {
      
      // 取消订单
      if(options.cancel){
        let params = {
          orderId: options.cancelId
        }
        // console.log(params)
        util.request({
          url: `${app.globalData.baseUrl}/api/passenger/updateOrderInfoByOrderId`,
          method: 'post',
          data: params
        }).then(res => {
          console.log('取消订单：',res)
        })
      }

      // this.requestCart();
      // this.requestWaitingtime();
      // this.hasMessage();
      var that = this
      setTimeout(function () {
        // 获取司机位置
        var markers = []
        var m = {}
        let str = {
          iconPath: "../../assets/images/str.png",
          latitude: app.globalData.strLatitude,
          longitude: app.globalData.strLongitude,
        }
        let end = {
          iconPath: "../../assets/images/end.png",
          latitude: app.globalData.endLatitude,
          longitude: app.globalData.endLongitude, 
        }
        markers.push(str)
        markers.push(end)
        util.request({
          url: `${app.globalData.baseUrl}/api/passenger/getAllCarLocation`,
          method: 'get'
        }).then(res => {
          console.log('获取司机位置信息：', res)
          if (res.status == 1) {
            for (let driver of res.result) {
              var str = driver.driverInfo.driverLocation;
              // console.log('str:',str)
              var arr = str.split(',');
              var longitude = arr[0];
              var latitude = arr[1];
              var img = "../../assets/images/car.png";
              // driver.driverInfo.longitude = longitude;
              // driver.driverInfo.latitude = latitude;
              // driver.driverInfo.iconPath = img;
              // console.log('driver:',driver)
              // console.log('res driver:', res.result)
              m.longitude = longitude;
              m.latitude = latitude;
              m.iconPath = img;
              // console.log('m：',m)
              markers.push(m)

              
            }
          } else if (res.status == -1) {
            wx.showToast({
              title: '获取司机位置失败',
              icon: 'none'
            })
          }
          that.setData({
            markers: markers
          })
          // console.log('markers:', markers)
          // console.log('this.data.markers:', that.data.markers)
        })
        // console.log(app.globalData.userInfo)
        that.setData({
          address: app.globalData.bluraddress,
          startLatitude: app.globalData.strLatitude,
          startLongitude: app.globalData.strLongitude,
          endLatitude: app.globalData.endLatitude,
          endLongitude: app.globalData.endLongitude,
          destination: app.globalData.destination,
          currentTab: app.globalData.id
        })
        
        
        // console.log('onLoad,startLocation:', that.data.startLongitude + "," + that.data.startLatitude)
        // console.log('onLoad,endLocation:', that.data.endLongitude + "," + that.data.endLatitude)
        
        if (that.data.endLongitude != null && that.data.endLatitude != null){
          that.include()
        }
        
      }, 1000)
    },
    // 一键叫车
    callingCar(e){
      var that = this
      const destination = this.data.destination

      if (app.globalData.userInfo.passengerPhoneNumber == null){
        wx.showToast({
          title: '未绑定手机号',
          icon: 'none',
          mask: true,
          success: function(e){
            setTimeout(function () {
              wx.redirectTo({
                url: `/pages/login/login`,
              })
            }, 1000);
          }
        })
        
      } else if (destination == '') {
        wx.showToast({
          title: '目的地不能为空',
          icon: 'none',
          mask: true,
          duration: 1000
        })
      } else {
        //创建订单
        let params = {
          "startLocation":this.data.address + "," + this.data.startLongitude + "," + this.data.startLatitude,
          "endLocation": this.data.destination + "," + this.data.endLongitude + "," + this.data.endLatitude,
          "locationInfo": this.data.startLongitude + "," + this.data.startLatitude + "-" + this.data.endLongitude + "," + this.data.endLatitude
        }
        console.log('创建订单传值:',params)
        util.request({
          url: `${app.globalData.baseUrl}/api/passenger/addOrderInfo`,
          method: 'post',
          data: params
        }).then(res => {
          console.log('叫车创建订单返回值：',res)
          if(res.status === 1){
            console.log("创建订单成功",res.result.orderId)
            wx.navigateTo({
              url: `/pages/wait/wait?orderId=${res.result.orderId}`,
            })
          }
        })
      }
    },
    onShow(){
        
    },

    onReady(){
      this.mapCtx = wx.createMapContext('map')
    },
    // 缩放
    include: function () {
      var that = this
      this.mapCtx.includePoints({
        padding: [20],
        points: [{
          latitude: that.data.startLatitude,
          longitude: that.data.startLongitude,
        }, {
          latitude: that.data.endLatitude,
          longitude: that.data.endLongitude,
        }]
      })
      // console.log('startLocation:', that.data.startLongitude + "," + that.data.startLatitude)
      // console.log('endLocation:', that.data.endLongitude + "," + that.data.endLatitude)
    },

    switchNav(event){
     
        this.requestWaitingtime();
       const cart = event.currentTarget.dataset.name
        let text = this.data.navData;
        this.setData({
            cart,
            isLoading:true,
            waitingTimes: ''
        })
        var cur = event.currentTarget.dataset.current; 
        var singleNavWidth = this.data.windowWindth/6;
        
        this.setData({
            navScrollLeft: (cur - 1) * singleNavWidth,
            currentTab: cur,
        })      
    },
    switchCart(e){
        const id = e.currentTarget.dataset.index;
        this.setData({
          index:id,
          
        })
       
    },
    switchTab(event){
        var cur = event.detail.current;
        var singleNavWidth =55;
        this.setData({
            currentTab: cur,
            navScrollLeft: (cur - 1) * singleNavWidth
        });
    },

    // 点击用户
    showUser(){
      // console.log(app.globalData.userInfo.phone)
      // console.log(app.globalData.userInfo.captcha)
    // 如果全局未存手机号进入登录页
      if (app.globalData.userInfo && app.globalData.userInfo.passengerPhoneNumber){
        wx.navigateTo({
          url: "/pages/my/my",
        })
      }else{
          wx.navigateTo({
          url:  "/pages/login/login",
          })
      } 
    },
    onChange(e){
        const currentCost = e.target.dataset.index;
        this.setData({
            currentCost
        })
      
    },

    // 判断是否有新消息
    hasMessage: function() {
      this.setData({
        hasMessage: true
      })
    },


})