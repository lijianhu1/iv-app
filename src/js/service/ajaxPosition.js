import tool from '../utils/Tool'

export default {
  //职位搜索
  jobsearch(data, success) {
    tool.ajax({
      url: tool.serviceUrl + '/job/jobsearch',
      data,
      type: 'post',
      success
    })
  },
  //在招职位
  getTalentDemandList(data, success) {
    tool.ajax({
      url: tool.serviceUrl + '/job/getTalentDemandList',
      data,
      type: 'POST',
      success
    })
  },
  //职位详情
  getTalentDemand(data, success) {
    tool.ajax({
      url: tool.serviceUrl + '/job/getTalentDemand',
      data,
      type: 'POST',
      success
    })
  },
  //职位投递
  userDelivery(data, success) {
    tool.ajax({
      url: tool.serviceUrl + '/record/userDelivery',
      data,
      type: 'POST',
      success
    })
  },
  //职位投递
  hotSearch(success) {
    tool.ajax({
      url: tool.serviceUrl + '/job/hotSearch',
      type: 'GET',
      success
    })
  },
  //简历完善度
  countType(success) {
    tool.ajax({
      url: tool.serviceUrl + '/resumeControllOperation/countType',
      type: 'GET',
      success
    })
  },
  //投遞規則
  getDeliveryRules(data,success) {
    tool.ajax({
      data,
      url: tool.serviceUrl + '/personalRecord/getDeliveryRules',
      type: 'GET',
      success
    })
  },
};
