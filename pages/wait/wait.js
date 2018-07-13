var util = require('../../utils/util.js');
const app = getApp()
Page({
  data: {
  progress_txt: '已等待', 
  count:0, 
  waitTimer: null,
  time: '00:00',
  randomTime: 100,
  flag: false
  },

  onLoad(option){
    let userId = app.globalData.userInfo.passengerId
    console.log("呼车传过来的订单id：",option.orderId)
    let _this = this
    let socketTimer
    /**
     * 连接websocket
     */
    wx.connectSocket({
      url: `ws://10.30.211.120:8000/ws/passenger/${userId}/${option.orderId}`
    })
    wx.onSocketError(function (res) {
      app.globalData.socketOpen = false
      console.log('WebSocket连接打开失败，请检查！')
    })
    wx.onSocketOpen(function (res) {
      console.log('WebSocket连接已打开！')
      let t = 0
      _this.sendSocketMessage("passenger,toWait")
      socketTimer = setInterval(() => {
        t++
        _this.sendSocketMessage("passenger,toWait")
        wx.getLocation({
          type: "gcj02",
          success: (res) => {
            console.log("ws中获取经纬度", res)
            let driverLoc = `{"passengerId":3,"passengerLocation":"${res.longitude}${t},${res.latitude}-${res.longitude}${t},${res.latitude}"}`
            _this.setData({
              longitude: res.longitude,
              latitude: res.latitude
            })
          }
        })
      }, 1000)
      app.globalData.socketOpen = true
      for (var i = 0; i < app.globalData.socketMsgQueue.length; i++) {
        _this.sendSocketMessage(app.globalData.socketMsgQueue[i])
      }
      app.globalData.socketMsgQueue = []
    })

    wx.onSocketMessage(function (res) {
      res = JSON.parse(res.data)
      console.log('收到服务器内容：', res)
      if (res.status === 1) {
        app.globalData.driverInfo = res.result
        clearInterval(socketTimer)
        // wx.closeSocket()
        wx.navigateTo({
          url: `/pages/orderService/orderService`,
        })
      }
    })
    wx.onSocketClose(function (res) {
      app.globalData.socketOpen = false
      console.log('WebSocket 已关闭！')
    })
    console.log("是否打开：", app.globalData.socketOpen)
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
  parseTime: function(time){
  var time = time.toString();
    return time[1]?time:'0'+time;
},
// 得到订单
countInterval: function () {
  var curr = 0;
  var timer = new Date(0, 0);
  var randomTime = 300;
  // console.log(randomTime)
  this.countTimer = setInterval(() => {
    // if (this.data.count <= randomTime) {
      this.setData({
        time: this.parseTime(timer.getMinutes()) + ":" + this.parseTime(timer.getSeconds()),
      });
      timer.setMinutes(curr / 60);
      timer.setSeconds(curr % 60);
      curr++;
      this.drawProgress(this.data.count / (60 / 2))
      this.data.count++;
      if (this.data.count > randomTime){
        wx.showToast({
          title: '请重新叫车',
          icon: 'loading'
        })
        setTimeout(() => {
          wx.redirectTo({
            url: '/pages/index/index',
          })
        }, 2000)
      clearInterval(this.countTimer);
      } else {
        // 
      }
    // } else {
    //   this.setData({
    //     progress_txt: "匹配成功"
    //   });
    //   wx.redirectTo({
    //     url: "/pages/orderService/orderService",
    //   });
    //   clearInterval(this.countTimer);
    // }
  }, 1000)
},

  drawProgressbg: function(){
   var ctx = wx.createCanvasContext('canvasProgressbg');
   ctx.setLineWidth(4);
   ctx.setStrokeStyle("#e5e5e5");
   ctx.setLineCap("round");
   ctx.beginPath();
   ctx.arc(110,110,100,0,2*Math.PI,false);
   ctx.stroke();
   ctx.draw();
  },
  onShow: function() {
    this.setData({
      address: app.globalData.bluraddress,
    })
    setInterval(function () {   
      // console.log('ok')
    }, 1000) //循环时间 这里是1秒 
  },
  onReady: function () {
    this.drawProgressbg();
    this.countInterval();
    this.drawProgress();
  },
  
  drawProgress: function (step){ 
    var context = wx.createCanvasContext('canvasProgress'); 
    context.setLineWidth(4);
    context.setStrokeStyle("#fbcb02");
    context.setLineCap('round')
    context.beginPath();
      // 参数step 为绘制的圆环周长，从0到2为一周 。 -Math.PI / 2 将起始角设在12点钟位置 ，结束角 通过改变 step 的值确定
    context.arc(110, 110, 100, -Math.PI /5, step*Math.PI /5-Math.PI /5, false);
    context.stroke();
    context.draw()
  },
  // 取消订单
  toCancel(){
    wx.showToast({
      title: '取消成功',
      icon: 'success'
    })
    setTimeout(() => {
      wx.redirectTo({
        url: '/pages/index/index',
      })
    }, 2000)
   
  },
  backIndex(){
    wx.redirectTo({
      url:  "/pages/index/index",
    })
  }
 

})