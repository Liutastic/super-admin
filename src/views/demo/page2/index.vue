<template>
  <d2-container>
    <template slot="header">Page 2 header</template>
    {{ version }}
  </d2-container>
</template>

<script>
export default {
  name: 'page2',
  data () {
    return {
      version: {}
    }
  },
  async created () {
    const { code, msg, data } = await this.$apis.GetVersion({
      version: '1.0.0',
      type: 'shop'
    })
    if (code === 0) {
      this.version = data
    } else {
      this.$message.error(msg)
    }
  }
}
</script>
