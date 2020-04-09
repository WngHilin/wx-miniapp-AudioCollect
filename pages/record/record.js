// pages/record/record.js
Page({
  const recordManager = wx.getRecorderManager(),
  /**
   * 页面的初始数据
   */
  data: {
    is_clock: false
  },

  /**
   * 录音开始
   */
  handleRecordStart: function (e) {
    this.setData({
      is_clock: true, //长按时设置为true，为可发送状态
      startPoint: e.touches[0], //记录触摸点的坐标信息
    })
    //录音参数
    const options = {
      duration: 10000,
      sampleRate: 16000, 
      numberOfChannels: 1, 
      encodeBitRate: 48000,
      format: 'mp3'
    }
    //开始录音
    recorderManager.start(options)
  },

  /**
   * 录音停止
   */
   handleRecordStop: function (e) {
    recorderManager.stop() //结束录音
    //先判断是否需要发送录音
    if(this.data.is_clock == true){
      var that = this
      //对停止录音进行监控
      recorderManager.onStop((res)=>{
        //对录音时长进行判断，少于2s不进行发送，并进行提示
        if(res.duration<2000){
          wx.showToast({
            title: '录音时间太短，请长安录音',
            icon: 'none',
            duration: 1000,
            mask: false,
          })
        }else{
          //进行语音发送
          const {tempFilePath} = res
          wx.wx.showLoading({
            title: '上传中',
            mask: true,
            success: (result)=>{
              
            },
            fail: ()=>{},
            complete: ()=>{}
          });
        }
      })
    }
  },

  /**
   * 滑动取消发送
   */
  handleTouchMove:function(e){
    //计算距离，当滑动的垂直距离大于25时，则取消发送语音
     if (Math.abs(e.touches[e.touches.length - 1].clientY - this.data.startPoint.clientY)>25){
       this.setData({
         is_clock: false//设置为不发送语音
       })
     }
   },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})