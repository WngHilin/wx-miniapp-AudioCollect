const app = getApp();
const recorderManager = wx.getRecorderManager();
var innerAudioContext = wx.createInnerAudioContext();
var tempFilePath;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    hasRecord: false,
    isDot: "block",
    isTouchStart: false,
    isTouchEnd: false,
    value: '100',
    touchStart:0,
    touchEnd:0,
    vd:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var a = this;
    wx.authorize({
      scope: "scope.record",
      success: function() {
        console.log("录音授权成功");
      },
      fail: function() {
        console.log("录音授权失败");
      }
    }), a.onShow()

  },
  // 点击录音按钮
  onRecordClick: function () {
    wx.getSetting({
      success: function (t) {
        console.log(t.authSetting), t.authSetting["scope.record"] ? console.log("已授权录音") : (console.log("未授权录音"),
          wx.openSetting({
            success: function (t) {
              console.log(t.authSetting);
            }
          }));
      }
    });
  },
  /**
   * 长按录音开始
   */
  recordStart: function(e) {
    var n = this;
    var a = 60, o = 10;
    n.setData({
      touchStart: e.timeStamp,
      isTouchStart: true,
      isTouchEnd: false,
      showPg: true,
    });
    const options = {
      duration: 60000,
      sampleRate: 32000,
      numberOfChannels: 1, 
      encodeBitRate: 96000,
      format: 'wav', 
      frameSize: 50,
    };

    //开始录音
    recorderManager.start(options);
    recorderManager.onStart(() => {
      console.log('recorder start');
    });

    //错误回调
    recorderManager.onError((res) => {
      console.log(res)
    });

    
    //上方进度条
    this.timer = setInterval(function () {
      n.setData({
        value: n.data.value - 100 / 6000
      }), (o += 10) >= 1e3 && o % 1e3 == 0 && (a-- , console.log(a), a <= 0 && (recorderManager.stop(),
        clearInterval(n.timer), n.animation2.scale(1, 1).step(), n.setData({
          animationData: n.animation2.export(),
        showPg: false,
        })));
    }, 10);
  },
  /**
   * 长按录音结束
   */
  recordTerm: function(e) {
    this.setData({
      isTouchEnd: true,
      isTouchStart: false,
      touchEnd: e.timeStamp,
      showPg: false,
      value: 100
    }), clearInterval(this.timer);

    recorderManager.stop();
    recorderManager.onStop((res) => {
      this.tempFilePath = res.tempFilePath;
      console.log('停止录音', res.tempFilePath);
      const { tempFilePath } = res;
    })
  },

  /**
   * 播放声音
   */
  play: function () {
    innerAudioContext.autoplay = true;
    innerAudioContext.src = this.tempFilePath,
      innerAudioContext.onPlay(() => {
        console.log('开始播放')
      });
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  }, 

  upload: function () {
    wx.showModal({
      title: '确认',
      content: '是否确认上传？',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: (result) => {
        if(result.confirm){
          wx.uploadFile({
            url: 'https://localhost:3000/voice',
            filePath: this.tempFilePath,
            name: 'file',
            header: {
              "Content-Type": "multipart/form-data"
            },
            formData: {
              userId: 12345678 //附加信息为用户ID
            },
            success: (result)=>{
              console.log(result);
              wx.showToast({
                title: '上传成功',
                icon: 'success',
                duration: 1500,
                mask: false,
              });
            },
            fail: (result)=>{
              console.log(result);
              wx.showToast({
                title: '上传失败',
                icon: 'none',
                duration: 1500,
                mask: false,
              });
            },
          });
        } else {
          wx.showToast({
            title: '已取消上传',
            icon: 'none',
            duration: 1500,
            mask: false,
          });
        }
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  }
})