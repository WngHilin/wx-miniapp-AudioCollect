const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const db = wx.cloud.database({
  env: 'audiocollect-ruiud'
})

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 传入对应的词语名称
function getAudioCount(wordName) {
  let result = 0
  db.collection('words').where({
    name: wordName
  })
  .get({
    success: function(res) {
      result = res.data.count
    }
  })
  return result
}

// 传入对应的词语名称
function getAudioId(wordName) {
  let id = 0
  db.collection('words').where({
    name: wordName
  })
  .get({
    success: function(res) {
      id = res.data.id
    }
  })
  return id
}


module.exports = {
  formatTime: formatTime,
  getAudioCount: getAudioCount,
  getAudioId: getAudioId
}
