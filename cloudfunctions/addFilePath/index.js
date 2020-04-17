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
  var value1 = event.data1
  try {
    return await db.collection('filepath').add({
      data:{
        path: value1
      }
    })
  } catch (e) {
    console.log(e)
  }
}