// pages/user/user.js
const app = getApp()
var pageObj = {

  data: {
      userInfo: {},
      hasUserInfo: true,
      canIUse: wx.canIUse('button.open-type.getUserInfo'),
      focus: false,
      inputValue: '',
      isChecked1:false
  },

  //事件处理函数
  bindViewTap: function() {
      wx.navigateTo({
          url: '../logs/logs'
      })
  },
  onLoad: function () {
      if (app.globalData.userInfo) {
          this.setData({
              userInfo: app.globalData.userInfo,
              hasUserInfo: true
          })
      } else if (this.data.canIUse){
          // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
          // 所以此处加入 callback 以防止这种情况
          app.userInfoReadyCallback = res => {
              this.setData({
                  userInfo: res.userInfo,
                  hasUserInfo: true
              })
          }
      } else {
          // 在没有 open-type=getUserInfo 版本的兼容处理
          wx.getUserInfo({
              success: res => {
                  app.globalData.userInfo = res.userInfo
                  this.setData({
                      userInfo: res.userInfo,
                      hasUserInfo: true
                  })
              }
          })
      }
  },
  getUserInfo: function(e) {
      console.log(e)
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
          userInfo: e.detail.userInfo,
          hasUserInfo: true
      })
  }
};

for (var i = 1; i <=1; ++i) {
  (function (i) {
      pageObj['changeSwitch'+i] = function (e) {
          var changedData = {};
          changedData['isChecked'+i] = !this.data['isChecked'+i];
          this.setData(changedData);
      }
  })(i)
}
Page(pageObj);