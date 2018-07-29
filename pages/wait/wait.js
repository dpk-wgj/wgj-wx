import util from '../../utils/index';
const app = getApp()
Page({
  data: {
  progress_txt: '已等待', 
  count:0, 
  waitTimer: null,
  time: '00:00',
  randomTime: 100,
  flag: false,
  socketTimer: null,
  cancel: false
  },

  onLoad(option){
    if (option.isChangeDriver){
      wx.showToast({
        title: '司机申请改派',
        icon: 'none',
        duration: 2000,
      })
    }
    let userId = app.globalData.userInfo.passengerId
    console.log("orderService转到wait呼车传过来的订单id：", option.orderId, app.globalData.userInfo)
    this.setData({
      orderId: option.orderId
    })
    let _this = this
    /**
     * 连接websocket
     */    
    if (app.globalData.socketOpen){
      wx.closeSocket({})
    }    
    wx.connectSocket({
      url: `${app.globalData.baseWsUrl}/ws/passenger/${userId}/${option.orderId}`
    })
    wx.onSocketError(function (res) {
      app.globalData.socketOpen = false
      console.log('WebSocket连接打开失败，请检查！')
    })
      wx.onSocketOpen(function (res) {
        console.log('WebSocket连接已打开！')
        _this.sendSocketMessage("passenger,toWait")
        _this.requestDriver()
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
        console.log("乘客端停止请求司机，清除定时器")
        clearInterval(_this.socketTimer) 
        clearInterval(_this.countTimer)       
        // wx.closeSocket()
        wx.redirectTo({
          url: `/pages/orderService/orderService?orderId=` + _this.data.orderId,
        })
      }
    })
    wx.onSocketClose(function (res) {
      app.globalData.socketOpen = false
      console.log('WebSocket 已关闭！')
    })
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
  requestDriver: function(){
    let t = 0
    let _this = this
    this.socketTimer = setInterval(() => {
      t++
      _this.sendSocketMessage("passenger,toWait")
      wx.getLocation({
        type: "gcj02",
        success: (res) => {
          // console.log("ws中获取经纬度", res)
          let driverLoc = `{"passengerId":"${app.globalData.userInfo.passengerId}","passengerLocation":"${res.longitude}${t},${res.latitude}-${res.longitude}${t},${res.latitude}"}`
          _this.setData({
            longitude: res.longitude,
            latitude: res.latitude
          })
        }
      })
    }, 1000)
  },
  parseTime: function(time){
  var time = time.toString();
    return time[1]?time:'0'+time;
},

  onShow: function() {
    this.setData({
      address: app.globalData.bluraddress,
    })
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
    context.arc(110, 110, 100, -Math.PI /2, step*Math.PI /2-Math.PI /2, false);
    context.stroke();
    context.draw()
  },

  // 取消订单
  toCancel() {
    let _this = this
    let params = {
      orderId: _this.data.orderId
    }
    console.log('params:', params)
    util.request({
      url: `${app.globalData.baseUrl}/api/passenger/cancelOrderForPassenger`,
      method: 'post',
      data: params
    }).then(res => {
      console.log('取消订单res：',res)
      if (res.status === 1) {
        wx.showToast({
          title: '取消中',
          icon: 'loading',
          success: function(e){
            wx.closeSocket()
            wx.redirectTo({
              url: "/pages/index/index",
            })
          }
        })
        
      }
    })
    
  },
  countInterval: function () {
    var curr = 0;
    var timer = new Date(0, 0);
    this.countTimer = setInterval(() => {
      this.setData({
        time: this.parseTime(timer.getMinutes()) + ":" + this.parseTime(timer.getSeconds()),
      });
      timer.setMinutes(curr / 60);
      timer.setSeconds(curr % 60);
      curr++;
      this.drawProgress(this.data.count / (60 / 2))
      this.data.count++;
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
  backIndex(){
    wx.redirectTo({
      url:  "/pages/index/index",
    })
  }
 

})