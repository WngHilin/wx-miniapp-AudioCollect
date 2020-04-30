// pages/tasks/tasks.js
const app = getApp()
wx.cloud.init()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    words: [],
    wordNum: [],
    nick_name: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.stopPullDownRefresh()
    var _this = this
    const db = wx.cloud.database({
      env: 'audiocollect-ruiud'
    })

    db.collection('words').get().then(res => {
      let temp1 = []
      let temp2 = []
      let temp3 = []
      for(let i = 0; i < res.data.length; i++){
        temp1.push(res.data[i].name)
        temp2.push(res.data[i].count)
        temp3.push(res.data[i].nick_name)
      }
      this.setData({
        words: temp1, 
        wordNum: temp2,
        nick_name: temp3
      })
    })
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
    var that=this;
    that.setData({
      currentTab:0
    })
    this.onLoad();

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