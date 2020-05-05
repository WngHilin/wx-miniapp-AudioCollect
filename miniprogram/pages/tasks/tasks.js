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
  onLoad: async function (options) {
    wx.stopPullDownRefresh()
    var that = this

    wx.showLoading({
      title: '加载中',
    })

    const db = wx.cloud.database({
      env: 'audiocollect-ruiud'
    })

    // 定义每次获取的条数
    const MAX_LIMIT = 20
    // 先取出集合的总数
    const countResult = await db.collection('words').count()
    const total = countResult.total
    // 计算分几次取
    const batchTimes = Math.ceil(total / MAX_LIMIT)
    // 承载所有读操作的promise的数组
    let temp1 = []
    let temp2 = []
    let temp3 = []

    // 获取分次数的promise数组
    for(let i = 0; i < batchTimes; i++) {
      const promise = await db.collection('words').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
      //二次循环根据获取的promise数组的数据长度获取全部数据push到数组中
      for(let j = 0; j < promise.data.length; j++){
        temp1.push(promise.data[j].name)
        temp2.push(promise.data[j].count)
        temp3.push(promise.data[j].nick_name)
      }
    }
    this.setData({
      words: temp1, 
      wordNum: temp2,
      nick_name: temp3
    })

    wx.hideLoading({
      complete: (res) => {},
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