const cloud = require('wx-server-sdk')
cloud.init()
exports.main = async (event, context) => {
  try {
    const result = await cloud.openapi.subscribeMessage.send({
        touser: event.touser,
        page: event.page,
        lang: 'zh_CN',
        data: {
          thing21: {
            value: '报班成功'
          },
          name15: {
            value: event.name
          },
          date22: {
            value: event.time
          },
          thing11: {
            value: '岗位以队长发布为准，请按时到达岗位'
          }
        },
        templateId: '_Vs_yfS8lXCqxQgmtggpFbYTVJtMO2m1bxIyFqBoaro',
        miniprogramState: 'formal'
      })
    return result
  } catch (err) {
    return err
  }
}