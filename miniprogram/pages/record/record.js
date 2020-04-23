const app = getApp();
const recorderManager = wx.getRecorderManager();
var innerAudioContext = wx.createInnerAudioContext();
var db = wx.cloud.database()
var util = require('../../utils/util')
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
    vd:'',
    wordName: '',
    audioCount: 0, //该文件中语音的数量
    nickName: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _this = this;
    
    // navigator传过来的值
    var name = options.wordName
    var nickname = options.nickName

    // 获取该类音频的数量
    db.collection('words').where({
      name: name
    })
    .get().then(res => {
      console.log(nickname)
      _this.setData({
        wordName: name, 
        audioCount: res.data[0].count,
        nickName: nickname
      })
      console.log(res.data[0].count)
    })
    console.log(this.data.nickName)

    wx.authorize({
      scope: "scope.record",
      success: function() {
        console.log("录音授权成功");
      },
      fail: function() {
        console.log("录音授权失败");
      }
    }), _this.onShow()

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
    let _this = this
    let wordName = this.data.wordName
    let count = this.data.audioCount
    let nickname = this.data.nickName
    let path = 'audio/'+nickname+'/'+nickname+count+'.wav'
    
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
          // 上传文件
          wx.cloud.uploadFile({
            cloudPath: path,
            filePath: this.tempFilePath,
            success: (result)=>{
              let fileid = result.fileID
              // 数据库添加文件路径
              console.log('开始添加路径')
              wx.cloud.callFunction({
                name: 'addFilePath', 
                data: {
                  data1: path,
                  data2: fileid
                },
                success: function(res) {
                  console.log(res)
                }
              })
              wx.showToast({
                title: '上传成功',
                icon: 'success',
                duration: 1500,
                mask: false,
              });
              // 将对应的数据加1
              wx.cloud.callFunction({
                name: 'updateAudioCount',
                data: {
                  wordName: wordName,
                  data: count + 1
                }, 
                success: function (res) {
                  console.log('增加成功')
                }
              })

              // 将data中的count也加一，防止在加载一次页面的情况下录音两次
              _this.setData({
                audioCount: count + 1
              })
              console.log(_this.data.audioCount)
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
          })
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