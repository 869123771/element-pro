<template>
  <div id = "tableWithPage">
    <Row>
      <Col span = "24">
        <Table
          :columns = "tablePage.columns"
          :data = "tablePage.datas"
          :height = "tablePage.height"
          :size = "tablePage.size"
          :loading = "tablePage.loading"
          stripe
        >
        </Table>
      </Col>
    </Row>
    <Row type = "flex" justify = "end" class = "mt-3">
      <Page
        :total = "tablePage.totalRows"
        :current.sync = "tablePage.pageNum"
        :page-size = "tablePage.pageSize"
        :show-size = "tablePage.showSize"
        :show-elevator = "tablePage.showElevator"
        :page-size-opts = "opts"
        show-total
        @on-change = "pageChange"
        @on-page-size-change = "sizeChange"
      ></Page>
    </Row>
  </div>
</template>
<script>
  export default {
    name : "table-with-page",
    data(){
      return {
        opts : [10,20,30,40]
      }
    },
    props : {
      tablePage : Object
    },
    watch : {
      tablePage(props){
        let defaultObj = {
          showSize : true,
          showElevator : true,
        }
        this.setDefaultValue(props,defaultObj)
      }
    },
    methods : {
      setDefaultValue(props,defaultObj){
        Object.keys(defaultObj).forEach(key=>{
          if(!props.hasOwnProperty(key)){
            props[key] = defaultObj[key]
          }
        })
        return props
      },
      pageChange(pageNum){
        this.tablePag = {
          ...this.tablePag,pageNum
        }
        this.query()
      },
      sizeChange(pageSize){
        this.tablePag = {
          ...this.tablePag,pageSize
        }
        this.query()
      },
      query(){
        this.$emit('query',this.tablePage)
      }
    }
  }
</script>
