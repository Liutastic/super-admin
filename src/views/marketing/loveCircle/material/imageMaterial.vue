<template>
  <d2-container>
    <el-row>
      <el-col class="flex justify-center" :span="10">
        <preview-model
        @delProImg="delProImg"
        @delPublisherPart="delPublisherPart"
        @delContentPart="delContentPart"
        @delProImgPart="delProImgPart"
        @delShowProPart="delShowProPart"
        :type="'image'"
        :virtualNum="formData.pink_circle_fictitious_forward"
        :issuerInfo="issuerInfo"
        :proImgList="formData.media"
        :content="formData.content"
        :showProInfo="showProInfo"></preview-model>
      </el-col>
      <el-col class="flex justify-center" :span="10">
        <div class="publish-box">
          <div class="title color-333 font-bold">爱粉圈素材编辑区</div>
          <!-- 素材基础信息 -->
          <div>
            <div class="color-666 font-size-9 mb-9 text-center">素材基础信息</div>
            <div class="flex align-center mb-9">
              <div class="label color-333 font-size-8"><span class="red-tip">*</span>素材名称：</div>
              <div class="flex-sub">
                <el-input class="input-width-100" show-word-limit maxlength="10" size="mini" v-model="formData.name" />
              </div>
            </div>
            <div class="flex align-center mb-9">
              <div class="label color-333 font-size-8"><span class="red-tip">*</span>素材分类：</div>
              <div class="flex-sub">
                <el-cascader
                class="input-width-100"
                v-model="materailClassValue"
                size="mini"
                :options="materailClassList" />
              </div>
            </div>
            <div class="flex align-center mb-9">
              <div class="label color-333 font-size-8"><span class="red-tip">*</span>权限模板：</div>
              <div class="flex-sub">
                <el-select v-model="formData.pink_circle_competence_id" class="input-width-100" size="mini">
                  <el-option
                    v-for="item in permissionOption"
                    :key="item.id"
                    :label="item.title"
                    :value="item.id">
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="flex align-center mb-9">
              <div class="label color-333 font-size-8">虚拟转发：</div>
              <div class="flex-sub">
                <el-input type="number" class="input-width-100" size="mini" v-model="formData.pink_circle_fictitious_forward" />
              </div>
            </div>
          </div>
          <!-- 素材图文信息 -->
          <div>
             <div class="color-666 font-size-9 mb-9 text-center">素材图文信息</div>
             <div class="flex align-center mb-9">
              <div class="label color-333 font-size-8"><span class="red-tip">*</span>发布人：</div>
              <div class="flex-sub">
                <el-select @change="publisherChange" v-model="formData.pink_circle_user_id" class="input-width-100" size="mini">
                  <el-option
                    v-for="item in publisherOption"
                    :key="item.id"
                    :label="item.name"
                    :disabled="!item.is_enable"
                    :value="item.id">
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="flex align-center mb-9">
              <div class="label color-333 font-size-8">展示商品：</div>
              <div class="flex-sub">
                <el-input class="input-width-100" placeholder="输入商品id" size="mini" @change="inputShowProId" v-model="formData.goods_id"/>
              </div>
              <div class="btn ml-5 cursor" @click="choosePro('show')">选择商品</div>
            </div>
            <div class="flex align-center mb-9" v-if="idIsError">
              <div class="label color-333 font-size-8"></div>
              <div class="ml-5 red-tip font-size-8">请输入正确的商品ID</div>
            </div>
            <div class="color-333 font-size-8 mb-9">已绑商品:{{showProInfo.name || '暂未绑定商品'}}</div>
            <div class="flex align-center mb-9">
              <div class="label color-333 font-size-8"><span class="red-tip">*</span>文本内容：</div>
              <div class="flex-sub">
                <el-input type="textarea" size="mini " :rows="8" class="input-width-100 text-area" v-model="formData.content" />
              </div>
            </div>
            <div class="flex align-center mb-9">
              <div class="label color-333 font-size-8"><span class="red-tip">*</span>上传图片：</div>
              <div class="flex-sub">
                <el-upload
                  v-if="formData.media.length < 9 && !uploadLoading"
                  class="upload-btn"
                  :action="QINIUURL"
                  :data="dataToken"
                  :show-file-list="false"
                  :on-success="uploadProImgSuccess"
                  :before-upload="beforeUpload">
                  <i class="el-icon-picture color-666"></i>
                </el-upload>
                <!-- <div class="upload-btn cursor" @click="controlUploadProRelate" v-if="show1">
                  <i class="el-icon-picture color-666"></i>
                </div> -->
                <div class="upload-btn cursor" @click="controlUploadProNum9" v-if="formData.media.length === 9 && !uploadLoading">
                  <i class="el-icon-picture color-666"></i>
                </div>
                <div class="upload-btn cursor flex flex-direction-column align-center justify-center" v-if="uploadLoading">
                  <div class="color-666 font-size-8" style="line-height:20px;">上传中</div>
                  <i class="el-icon-loading color-666"></i>
                </div>
              </div>
            </div>
            <div class="flex align-center mb-9">
              <div class="label color-333 font-size-8">关联商品：</div>
              <div class="flex-sub">
                <el-input class="input-width-100" placeholder="输入商品id" @change="inputRelateProId" size="mini" v-model="relateProId" />
              </div>
              <div class="btn ml-5 cursor" @click="choosePro('href')">选择商品</div>
            </div>
            <div class="flex align-center mb-9" v-if="relateTdIsError">
              <div class="label color-333 font-size-8"></div>
              <div class="ml-5 red-tip font-size-8">请输入正确的商品ID</div>
            </div>
            <div class="color-333 font-size-8 mb-9">关联商品: {{relatePro.name || '暂未关联商品'}}</div>
          </div>
          <div class="submit-btn-box pb-20">
            <el-button type="primary" size="mini" @click="save">{{id ? '修改' : '保存'}}</el-button>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- 选择商品弹窗 -->
    <SelProDialog :selProDialogShow="selProDialogShow" @selHrefPro="selHrefPro" @closeSelProDialog="closeSelProDialog"></SelProDialog>
  </d2-container>
</template>

<script>
import PreviewModel from './components/PreviewModel'
import SelProDialog from './components/SelProDialog'
import { QINIUURL } from '@/api/config'
export default {
  name: 'imageMaterial',
  components: {
    PreviewModel,
    SelProDialog
  },
  data () {
    return {
      QINIUURL,
      // 展示商品输入id错误是否显示
      idIsError: false,
      // 关联商品输入id错误是否显示
      relateTdIsError: false,
      dataToken: { token: '' }, // 上传的token
      formData: {
        // 素材名
        name: '',
        // 素材分类一级id
        pink_circle_category_id: null,
        // 权限模板id
        pink_circle_competence_id: null,
        goods_id: null,
        content: '',
        // 虚拟转发
        pink_circle_fictitious_forward: 0,
        // media: [{ goods_id: 33889, url: 'FgxbSPy-x-rCSOt-lz1L17gQneRj' }],
        media: [],
        // 发布人id
        pink_circle_user_id: null,
        // 素材分类子id
        category_child_id: null
      },
      // 判断选择商品的类型 show=选择展示商品 href=选择链接商品
      chooseProType: '',
      // 权限模板选项集合
      permissionOption: [],
      // 选中的素材分类
      materailClassValue: [],
      // 素材分类选项集合
      materailClassList: [],
      // 发布人相关信息
      issuerInfo: {},
      // 展示商品的信息
      showProInfo: {},
      // 发布人选项合集
      publisherOption: [],
      // 关联商品对象内容
      relatePro: {},
      // 关联商品id
      relateProId: null,
      // 选择商品弹窗显示隐藏
      selProDialogShow: false,
      // 编辑的时候素材的id
      id: '33',
      // 素材详情
      materialDetail: {},
      uploadLoading: false
    }
  },
  computed: {
    // show1 () {
    //   return this.formData.media.length && this.formData.media.length < 9 && this.formData.media[this.formData.media.length - 1] && !this.formData.media[this.formData.media.length - 1].goods_id
    // },
    // show2 () {
    //   return !this.formData.media.length || (this.formData.media.length && this.formData.media.length < 9 && this.formData.media[this.formData.media.length - 1] && this.formData.media[this.formData.media.length - 1].goods_id)
    // },
  },
  async mounted () {
    this.id = this.$route.query.id || null
    if (this.id) {
      this.$loading()
      const { code, msg, data } = await this.$apis.GetMaterialDetail({ id: this.id })
      if (code === 0) {
        console.log('素材详情', data)
        this.$loading().close()
        // console.log('获取素材详情', data)
        this.materialDetail = data
        this.formData.name = data.name
        this.formData.pink_circle_category_id = data.category.id
        this.formData.pink_circle_competence_id = data.competence.id
        this.formData.goods_id = data.goods.id
        this.formData.content = data.content
        this.formData.pink_circle_fictitious_forward = data.forward
        this.formData.category_child_id = data.category_child_id || null
        const arr = []
        data.media.forEach(val => {
          arr.push({ goods_id: (val.goods && val.goods.id) ? val.goods.id : null, url: val.url })
        })
        this.formData.media = arr
        this.formData.pink_circle_user_id = data.user.id
        this.issuerInfo = data.user
        if (data.goods && data.goods.id) {
          const res = await this.$apis.GetProDetail(data.goods.id)
          if (res.code === 0) this.showProInfo = res.data
          console.log('获取详情的数据', res)
        }
        // console.log('this.showProInfo', this.showProInfo)
        this.materailClassValue = [data.category.id]
        if (data.category_child_id) this.materailClassValue.push(data.category_child_id)
        this.getCategoryList()
        this.getPermissionList()
        this.getAllIssuerList()
      } else {
        this.$loading().close()
        this.$message.error(msg)
      }
      return
    }
    this.getCategoryList()
    this.getPermissionList()
    this.getAllIssuerList()
  },
  methods: {
    // 输入的展示商品id后调用
    async inputShowProId (e) {
      if (!e) {
        return
      }
      // console.log('获取输入的展示商品id', e)
      const { code, data } = await this.$apis.GetProDetail(e)
      if (code === 0) {
        this.idIsError = false
        this.showProInfo = data
        this.formData.goods_id = data.id
      } else {
        this.idIsError = true
        this.formData.goods_id = null
      }
    },
    // 输入的图片链接商品id后调用
    async inputRelateProId (e) {
      if (!e) {
        return
      }
      console.log('获取输入的展示商品id', e)
      // console.log('商品详情', data)
      const { code, data } = await this.$apis.GetProDetail(e)
      if (code === 0) {
        this.relateTdIsError = false
        this.relatePro = data
        this.relateProId = data.id
        if (this.formData.media.length && this.formData.media[this.formData.media.length - 1].url && !this.formData.media[this.formData.media.length - 1].goods_id) {
          this.formData.media[this.formData.media.length - 1].goods_id = data.id
          return
        }
        if (this.formData.media.length && !this.formData.media[this.formData.media.length - 1].url && this.formData.media[this.formData.media.length - 1].goods_id) {
          this.formData.media[this.formData.media.length - 1].goods_id = data.id
          console.log('this.formData.media2', this.formData.media)
          return
        }
        if (!this.formData.media.length || (this.formData.media[this.formData.media.length - 1].url && this.formData.media[this.formData.media.length - 1].goods_id)) {
          this.formData.media.push({ goods_id: e, url: '' })
        }
      } else {
        this.relateTdIsError = true
        this.relateProId = null
      }
    },
    // 选择图片链接的商品
    selHrefPro (item) {
      this.selProDialogShow = false
      // console.log('选择商品1', item, this.chooseProType)
      if (this.chooseProType === 'show') {
        this.idIsError = false
        console.log(this.idIsError)
        this.formData.goods_id = item.id
        this.showProInfo = item
        // console.log('this.showProInfo', this.showProInfo)
        return
      }
      this.relateTdIsError = false
      this.relatePro = item
      this.relateProId = item.id
      console.log('this.formData.media1', this.formData.media)
      if (this.formData.media.length && this.formData.media[this.formData.media.length - 1].url && !this.formData.media[this.formData.media.length - 1].goods_id) {
        this.formData.media[this.formData.media.length - 1].goods_id = item.id
        console.log('this.formData.media2', this.formData.media)
        return
      }
      if (this.formData.media.length && !this.formData.media[this.formData.media.length - 1].url && this.formData.media[this.formData.media.length - 1].goods_id) {
        this.formData.media[this.formData.media.length - 1].goods_id = item.id
        console.log('this.formData.media2', this.formData.media)
        return
      }
      if (!this.formData.media.length || (this.formData.media[this.formData.media.length - 1].url && this.formData.media[this.formData.media.length - 1].goods_id)) {
        this.formData.media.push({ goods_id: item.id, url: '' })
      }
      console.log(this.formData.media)
    },
    // 上传
    async save () {
      if (!this.formData.media[this.formData.media.length - 1].url) {
        console.log('抹去')
        this.formData.media.splice(this.formData.media.length - 1, 1)
      }
      console.log(this.formData)
      if (!this.formData.name) {
        this.$message({
          message: '素材名称不能为空~',
          type: 'warning'
        })
        return
      }
      if (!this.materailClassValue.length) {
        this.$message({
          message: '请选择素材分类~',
          type: 'warning'
        })
        return
      }
      if (!this.formData.pink_circle_competence_id) {
        this.$message({
          message: '请选择权限模板~',
          type: 'warning'
        })
        return
      }
      // if (!this.formData.pink_circle_fictitious_forward) {
      //   this.$message({
      //     message: '请输入虚拟转发数~',
      //     type: 'warning'
      //   })
      //   return
      // }
      if (!this.formData.pink_circle_user_id) {
        this.$message({
          message: '请选择发布人~',
          type: 'warning'
        })
        return
      }
      // if (!this.formData.goods_id) {
      //   this.$message({
      //     message: '请选择展示商品~',
      //     type: 'warning'
      //   })
      //   return
      // }
      if (!this.formData.content) {
        this.$message({
          message: '请输入文本内容~',
          type: 'warning'
        })
        return
      }
      if (!this.formData.media.length) {
        this.$message({
          message: '请上传图片~',
          type: 'warning'
        })
        return
      }
      this.formData.pink_circle_category_id = this.materailClassValue[0] || null
      this.formData.category_child_id = this.materailClassValue[1] || null
      // console.log('上传参数', this.formData)
      // 更新编辑
      if (this.id) {
        const { code } = await this.$apis.EditMaterial(this.formData, this.id)
        // console.log(code, msg, data)
        if (code === 0) {
          this.$message({
            message: '操作成功！',
            type: 'success'
          })
          setTimeout(() => {
            this.$router.back(-1)
          }, 2000)
        }
        // else {
        //   this.$message.error(msg)
        // }
        return
      }
      // 新增
      const { code } = await this.$apis.AddImageMaterial(this.formData)
      // console.log(code, msg, data)
      if (code === 0) {
        this.$message({
          message: '操作成功！',
          type: 'success'
        })
        setTimeout(() => {
          this.$router.push({
            path: '/marketing/loveCircle/allMaterial'
          })
        }, 2000)
      }
      // else {
      //   this.$message.error(msg)
      // }
    },
    // 预览页面删除发布人模块
    delPublisherPart () {
      this.issuerInfo = {}
      this.formData.pink_circle_fictitious_forward = null
      this.formData.pink_circle_user_id = null
    },
    // 预览页删除文案模块
    delContentPart () {
      this.formData.content = ''
    },
    // 删除商品图片模块
    delProImgPart () {
      this.formData.media = []
      this.relatePro = {}
      this.relateProId = null
    },
    // 删除商品展示模块
    delShowProPart () {
      this.showProInfo = {}
      this.formData.goods_id = null
    },
    // 删除商品图片
    delProImg (index) {
      // console.log(this.formData.media)
      this.formData.media.splice(index, 1)
      // console.log(this.formData.media)
    },
    // 选择发布人
    publisherChange (e) {
      // console.log('改变发布人', e)
      this.issuerInfo = this.publisherOption.find(val => val.id === e)
      // console.log('this.issuerInfo', this.issuerInfo)
    },
    uploadProImgSuccess (res) {
      this.relatePro = {}
      this.relateProId = null
      this.uploadLoading = false
      if (this.formData.media.length && this.formData.media[this.formData.media.length - 1].goods_id && !this.formData.media[this.formData.media.length - 1].url) {
        this.formData.media[this.formData.media.length - 1].url = res.hash
        return
      }
      if (!this.formData.media.length || (this.formData.media[this.formData.media.length - 1].url && this.formData.media[this.formData.media.length - 1].goods_id)) {
        console.log()
        this.formData.media.push({ url: res.hash, goods_id: '' })
      }
      console.log('this.formData.media', this.formData.media)
    },
    // 提醒并且控制上传图片后一定要先上传关联商品才可以上传下一张
    // controlUploadProRelate () {
    //   this.$message({
    //     message: '请先关联上一张图片的产品，再上传下一张喔~',
    //     type: 'warning'
    //   })
    // },
    controlUploadProNum9 () {
      this.$message({
        message: '限制最多上传9张图片喔~',
        type: 'warning'
      })
    },
    async beforeUpload (file) {
      console.log(file)
      this.$loading()
      const { uptoken } = await this.$apis.qiniuToken()
      this.dataToken.token = uptoken
      this.$loading().close()
      return new Promise((resolve, reject) => {
        const types = ['image/jpeg', 'image/png']
        const isImage = types.includes(file.type)
        if (!isImage) {
          this.$message({
            message: '上传图片只能是 JPG、PNG 格式喔~',
            type: 'warning'
          })
          return reject(new Error(false))
        } else {
          this.uploadLoading = true
          return resolve(true)
        }
        // const isOver = file.size / 1024 > 700
        // if (!isImage || isOver) {
        //   if (!isImage) {
        //     this.$message({
        //       message: '上传图片只能是 JPG、PNG 格式喔~',
        //       type: 'warning'
        //     })
        //   }
        //   if (isOver) {
        //     this.$message({
        //       message: '上传图片不能超过700KB喔~',
        //       type: 'warning'
        //     })
        //   }
        //   return reject(new Error(false))
        // } else {
        //   this.uploadLoading = true
        //   return resolve(true)
        // }
      })
    },
    uploadProImgPropress (val) {
      // console.log(val)
    },
    // 选择商品
    choosePro (type) {
      this.chooseProType = type
      // console.log('选择', this.selProDialogShow)
      this.selProDialogShow = true
    },
    // 关闭选择商品弹窗
    closeSelProDialog () {
      // console.log('关闭', this.selProDialogShow)
      this.selProDialogShow = false
    },
    // 处理级联选择器对象Key问题
    transitionKey (list) {
      const keyMap = {
        name: 'label',
        id: 'value',
        children: 'children',
        parent_id: 'parent_id'
      }
      function toTransition (list) {
        var newObj = list instanceof Array ? [] : {}
        for (const key in list) {
          var newKey = keyMap[key] ? keyMap[key] : key
          newObj[newKey] = typeof list[key] === 'object' ? toTransition(list[key], keyMap) : list[key]
        }
        return newObj
      }
      return toTransition(list)
    },
    // 获取素材分类
    async getCategoryList () {
      const { code, data } = await this.$apis.GetCategoryAllList()
      // console.log('素材分类', code, data)
      if (code === 0) {
        // console.log(this.transitionKey(data))
        this.materailClassList = this.transitionKey(data)
        this.materailClassList.map(val => {
          if (!val.children.length) {
            delete val.children
          }
          return val
        })
        // console.log('this.materailClassList', this.materailClassList)
      }
    },
    // 获取权限模板列表
    async getPermissionList () {
      const { code, data } = await this.$apis.GetPermissionList({ page: 1, per_page: 1000 })
      // console.log('权限模板', code, data)
      if (code === 0) {
        this.permissionOption = data.data.filter(val => {
          return val.status === 1
        })
      }
    },
    // 获取发布人列表
    async getAllIssuerList () {
      const { code, data } = await this.$apis.GetAllIssuerList()
      // console.log('发布人列表', code, data)
      if (code === 0) {
        this.publisherOption = data
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.publish-box{
  width:300px;
  min-height:700px;
  background: #F7F8FA;
  padding:0 10px;
  box-sizing: border-box;
  .title{
    height:30px;
    line-height:30px;
    text-align: center;
    font-size: 10px;
    font-weight: bold;
    font-family: PingFangSC-Medium, PingFang SC;
  }
  .label{
    width:65px;
  }
  .input-width-100{
    width:100% !important;
  }
  .btn{
    width: 60px;
    height: 25px;
    background: #2589FF;
    border-radius: 3px;
    text-align:center;
    line-height:25px;
    font-size:8px;
    opacity: 0.8;
    color:#ffffff;
  }
  .upload-btn{
    width:75px;
    height:75px;
    background: #FFFFFF;
    border-radius: 1px;
    text-align: center;
    line-height:75px;
  }
  .submit-btn-box{
    margin-top:20px;
    text-align: center;
  }
}
.cursor{
  cursor: pointer;
}
.text-center{
  text-align: center;
}
.flex{
  display:flex;
}
.flex-direction-column{
  flex-direction: column;
}
.align-center{
  align-items: center;
}
.justify-center{
  justify-content: center;
}
.flex-sub{
  flex:1;
}
.font-size-9{
  font-size: 9px;
}
.font-size-8{
  font-size: 8px;
}
.padding-lr-8{
  padding-left:8px;
  padding-right:8px;
}
.padding-tb-10{
  padding-top:10px;
  padding-bottom:10px;
}
.color-333{
  color:#333333;
}
.color-666{
  color:#666666;
}
.mb-9{
  margin-bottom:9px;
}
.mt-40{
  margin-top:40px;
}
.ml-5{
  margin-left:5px;
}
.red-tip{
  color:#F4222D;
}
.pb-20{
  padding-bottom:20px;
}
// .text-area{
//   min-height:100px !important;
// }
</style>
