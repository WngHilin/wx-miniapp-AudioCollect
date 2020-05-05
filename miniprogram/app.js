//app.js
wx.cloud.init()
const db = wx.cloud.database()

App({
   onLaunch: function () {
    var that = this
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
        env: 'audiocollect-ruiud'
      })
    }
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        console.log(res.code)//登录成功后获取js_code
        wx.request({
          url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + that.globalData.appid + '&secret=' + that.globalData.secret + '&js_code=' + res.code + '&grant_type=authorization_code',//获取openid的url，请求微信服务器
          data: {},
          header: {
            'content-type': 'application/json'
          },
          success: function(res) {
            that.globalData.openid = res.data.openid
            //app.globalData.test="hello"
            console.log("1: ", res.data.openid)
            let result = res
            // 判断数据库中是否有该用户，没有则加入数据库
            wx.cloud.callFunction({
              name: 'addUser', 
              data: {
                openid: result.data.openid,
              },
              success: function(res) {
                console.log(res)
              }
          })
          }
        })
      }
    })

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    appid: "wx36c2130b391f6a75",
    secret: "2af608a70df21048483bd939bc15e4b2",
    userInfo: null,
    openid: null, 
    userAge: 20,
    userSex: '女'
  }
})
