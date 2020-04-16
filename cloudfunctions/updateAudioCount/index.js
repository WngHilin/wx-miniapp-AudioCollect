// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  var wordName = event.wordName
  var vdata1 = event.data
  try {
    return await db.collection('words').where({
      name: wordName
    }).update({
      data: {
        count: vdata1
      }
    })
  } catch (e) {
    console.log(e)
  }
}