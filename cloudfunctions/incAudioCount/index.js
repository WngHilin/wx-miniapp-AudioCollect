// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'audiocollect-ruiud'
})

const db = cloud.database({
  env: 'audiocollect-ruiud'
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let wordName = event.wordName
  let temp = 0
  // 查找对应的值
  db.collection('words').where({
    name: wordName
  })
  .get({
    success: function(res) {
      temp = res.data.count
    }
  })
  temp = res.result.count + 1
  console.log(temp)
  //更新数据
  db.collection('words').where({
    name: wordName
  })
  .update({
    data: {
      count: temp
    },
    success: function (res) {
      console.log(res.data)
    } 
  })

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}