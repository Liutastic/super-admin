import {
  request
} from '@/api/service'

export default {
  defaultType: 'qiniu', // 默认类型为腾讯云上传，可选值：【cos、qiniu、alioss】
  qiniu: {
    bucket: 'd2p-demo',
    getToken (custom) {
      return request({
        url: 'https://test.api.vodeshop.com/api/qiniu-uptoken',
        method: 'get'
      }).then(ret => {
        return ret.data // {token:xxx,expires:xxx}
      })
    },
    successHandle (ret) { // 上传完成后可以在此处处理结果，修改url什么的
      console.log('success handle:', ret)
      return ret
    },
    domain: 'https://image.vodeshop.com'
  },
  form: {
    action: this.$apis.MBASEURL + 'upload/form/upload',
    name: 'file',
    withCredentials: false,
    successHandle (ret) { // 上传完成后的结果处理， 此处后台返回的结果应该为 ret = {data:'fileurl'}
      if (ret.data == null || ret.data === '') {
        throw new Error('上传失败')
      }
      return { url: ret.data }
    }
  }
}
