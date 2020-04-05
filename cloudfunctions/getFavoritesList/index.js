// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command
const $ = _.aggregate
// 云函数入口函数
exports.main = async (event, context) => {
  let skip = event.skip ? event.skip : 0
  return await db.collection('favorites_list').aggregate().skip(skip).match({
    _openid: _.eq(event.userInfo.openId)
  }).lookup({
    from: 'goods_list',
    localField: 'goodsid',
    foreignField: '_id',
    as: 'goodslist',
    }).replaceRoot({
      newRoot: $.mergeObjects([$.arrayElemAt(['$goodslist', 0]), '$$ROOT'])
    })
    .project({
      goodslist: 0
    })
  .end()
}