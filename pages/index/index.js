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
        endLongitude: ''
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
          console.log(res)
        })
      }
      
      // this.requestCart();
      // this.requestWaitingtime();
      this.hasMessage();
      var that = this
      setTimeout(function () {
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
        console.log('params:',params)
        util.request({
          url: `${app.globalData.baseUrl}/api/passenger/addOrderInfo`,
          method: 'post',
          data: params
        }).then(res => {
          // console.log(res)
          if(res.status === 1){
            console.log("创建订单成功",res.result.orderId)
            wx.navigateTo({
              url: `/pages/wait/wait?orderId=${res.result.orderId}`,
            })
          }
        })
      }
    },
    // requestCart(e){
    //     util.request({
    //         url: 'https://www.easy-mock.com/mock/5aded45053796b38dd26e970/comments#!method=get',
    //         mock: false,
    //       }).then((res)=>{
       
    //         const navData = res.data.navData;
    //         const imgUrls = res.data.imgUrls;
    //         const cost = res.data.cost
    //         this.setData({
    //             navData,
    //             imgUrls,
    //             cost
    //         })
    //       })
    // },
    onShow(){
        // this.setData({
        //     address:app.globalData.bluraddress,
        //     destination:app.globalData.destination,
        //     currentTab:app.globalData.id,
        // })
      
        
    },
    // requestWaitingtime(){
    //     setTimeout(() => {
    //         util.request({
    //             url: 'https://www.easy-mock.com/mock/5aded45053796b38dd26e970/comments#!method=get',
    //             mock: false,
    //             data: {
    //             }
    //           }).then((res)=>{
    //           const arr = res.data.waitingTimes;
    //             var index = Math.floor((Math.random()*arr.length));
    //             this.setData({
    //             isLoading:false,
    //             waitingTimes: arr[index]
    //             })
    //           })
    //     }, 1000);
    // },
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

    // 获取位置
    // getLoc: function(){
    //   var that = this;
    //   wx.getLocation({
    //     type: 'wgs84',
    //     success: function(res) {
    //       console.log(res)
    //       qqmapsdk.reverseGeocoder({
    //         location: {
    //           latitude: res.latitude,
    //           longitude: res.longitude
    //         },
    //         success: function (addressRes) {
    //           var address = addressRes.result.formatted_addresses.recommend;
    //           // console.log(address)
    //           app.globalData.bluraddress = address;
    //           app.globalData.strLatitude = addressRes.result.location.lat;
    //           app.globalData.strLongitude = addressRes.result.location.lng;
    //           that.setData({
    //             address: app.globalData.bluraddress,
    //           })
    //           console.log('index.app:' + app.globalData.bluraddress)
    //           console.log('index.address:' + that.data.address)
    //         }
    //       })
    //     },
    //   })
    // }

})