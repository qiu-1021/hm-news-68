<template>
<div>
  <hm-floor :count="count-1" :comment="comment.parent" v-if="comment.parent"></hm-floor>
  <div class="hm-floor bt">
	<div class="title">
	  <div class="left">{{count}}.{{comment.user.nickname}}</div>
	  <div class="center">{{comment.creat_date | now}}</div>
	  <div class="right" @click="reply">回复</div>
	</div>
  <div class="content">{{comment.content}}</div>
  </div>
</div>
</template>

<script>
export default {
  props: {
	  comment: Object,
    count: Number
  },
  methods: {
    reply () {
      this.$bus.$emit('reply', this.comment.id, this.comment.user.id)
    }
  }
}
</script>

<style lang="less" scoped>
.hm-floor.bt {
  border-top: 1px solid red;
}
.first > .hm-floor {
  border-bottom: 1px solid red;
}

.hm-floor {
  // margin-top: -1px;
  border: 1px solid red;
  border-bottom: none;
  padding: 10px;
  .title {
    display: flex;
    font-size: 14px;
    .center {
      flex: 1;
      font-size: 12px;
      color: #666;
      padding-left: 10px;
    }
    .right {
      color: #666;
    }
  }
  .content  {
    font-size: 14px;
    margin-top: 10px;
  }
}
</style>
