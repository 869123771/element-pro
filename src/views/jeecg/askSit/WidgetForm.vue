<template>
    <draggable
            v-model="pageData.list"
            :group="{ name:'widget',put:true}"
            ghostClass="ghost"
            handle = ".el-card__header"
            :swapThreshold="0.8"
            :animation="100"
            @add="handleWidgetAdd"
            class="widget-form-list"
            :class="{'widget-empty': pageData.list.length === 0&&!pageData.style.backgroundImage}"
    >
        <template v-for="(item,index) in pageData.list">
            <div
                    v-if="item.type === 'formList'"
                    :key="item.key"
                    :style="item.style"
                    class="widget-child-form-list"
                    :class="{active: selectWg.key === item.key}"
                    @click="handleSelectWidget(item)"
            >
                <i class="el-icon-rank"></i>
                <draggable
                        v-model="item.list"
                        :group="{ name:'widget',put:true}"
                        ghostClass="ghost"
                        :swapThreshold="0.8"
                        :animation="100"
                        @add="formWidgetAdd"
                        class="widget-form-list"
                        :class="{'widget-empty': item.list.length === 0}"
                >
                    <template v-for="(formItem,i) in item.list">
                        <widget-form-list
                                :item="formItem"
                                :key="formItem.key"
                                :data="item.list"
                                :index="i"
                                @click.native.stop="handleSelectWidget(item.list[i])"
                                @handleWidgetDelete="handleWidgetDelete(pageData.list,i)"
                        />
                    </template>
                </draggable>
            </div>
            <div v-else :key="item.key">
                <widget-form-list
                        :item="item"
                        :data="pageData.list"
                        :index="index"
                        :class="{active : selectWg.key === item.key}"
                        @click.native.stop="handleSelectWidget(item)"
                        @handleWidgetDelete="handleWidgetDelete(pageData.list,index)"
                />
            </div>
        </template>
    </draggable>
</template>

<script>
    import {mapState, mapMutations} from 'vuex'
    import Draggable from 'vuedraggable'
    import {http, apiList, constant, sweetAlert} from '@/utils'
    import {deepClone} from '30-seconds-of-code'
    import WidgetFormList from './widgetForm/WgFormList'

    export default {
        name: "WidgetForm",
        components: {
            Draggable,
            WidgetFormList
        },
        computed: {
            ...mapState({
                pageData: ({app}) => app.pageData,
                selectWg: ({app}) => app.selectWg,
            })
        },
        methods: {
            ...mapMutations({
                setPageData : 'SET_PAGE_DATA',
                setSelectWg: 'SET_SELECT_WG',
                setConfigTab: 'SET_CONFIG_TAB'
            }),
            confirmDeleteBatch({data, index}) {
                if (data.length - 1 === index) {
                    if (index === 0) {
                        this.setSelectWg({})
                    } else {
                        this.setSelectWg(data[index - 1])
                    }
                } else {
                    this.setSelectWg(data[index + 1])
                }
                this.$nextTick(() => {
                    data.splice(index, 1)
                })
            },
            handleWidgetDelete(data, index) {
                sweetAlert.confirm(this.$t('common_delete'), this.$t('common_confirm_do'), this.confirmDeleteBatch, {
                    data,
                    index
                })
            },
            handleSelectWidget(selectWg) {
                let {list} = this.pageData
                if(this.selectWg.key !== selectWg.key){
                    this.setSelectWg({})
                    this.$nextTick(()=>{
                        this.setSelectWg(selectWg)
                    })
                    list.forEach(item=>{
                        if(item.key === selectWg.key){
                            item.active = true
                        }else{
                            item.active = false
                        }
                    })
                    this.setPageData(deepClone(this.pageData))
                    this.$emit('handleSelectType',selectWg)
                }

                /*let unActiveList = this.pageData.list.filter(item=>item.key !== selectWg.key).map(item=>{
                    return {...item,active : false}
                })
                let activeList = this.pageData.list.filter(item=>item.key === selectWg.key).map(item=>{
                    return {...item,active:true}
                })*/
                /*let {list,...res} = this.pageData
                this.setPageData({list:[...unActiveList,...activeList],...res})
                this.$set(this.pageData, 'list', [...unActiveList,...activeList]);*/
            },
            handleWidgetAdd(evt) {
                // console.log(evt);
                const newIndex = evt.newIndex;
                let newObj = deepClone(this.pageData.list[newIndex]);
                newObj.key = newObj.type + '_' + Date.now() + '_' + Math.ceil(Math.random() * 1000000);
                this.$set(this.pageData.list, newIndex, newObj);
                this.handleSelectWidget(newObj)
            },

            formWidgetAdd(evt) {
                // console.log(evt);
                const formIndex = this.pageData.list.findIndex(item => item.type === 'formList');
                const newIndex = evt.newIndex;
                let newObj = deepClone(this.pageData.list[formIndex].list[newIndex]);
                newObj.key = newObj.type + '_' + Date.now() + '_' + Math.ceil(Math.random() * 1000000);
                this.$set(this.pageData.list[formIndex].list, newIndex, newObj);
                this.setSelectWg(newObj)
                this.setConfigTab('widget')
            },
            setConfigTab() {
                this.$store.commit("setConfigTab", "page");
            }
        }
    }
</script>

<style scoped lang="less">
    .widget-form-list {
        min-height: 360px;
        .ghost {
            background: #fff;
            border: 1px dashed;

            &::after {
                background: #fff;
            }
        }

        li.ghost {
            position: relative;
            line-height: 30px;
            list-style: none;
            font-size: 0;

            &::after {
                content: '放到这里';
                display: block;
                background: #fff;
                position: absolute;
                left: 50%;
                margin-left: -32px;
                top: 0;
                font-size: 16px;
                color: #999;
                z-index: 10;
            }
        }
    }

    .widget-empty {
        background-image: url('../../../assets/img/form_empty.png');
        background-repeat: no-repeat;
        background-position: 50%;
        padding: 1px;
        border: 1px dashed #2672ff;
        border-radius: 4px;
    }

    .active {
        /deep/ .el-card {
            border: 1px solid blue;
        }
    }
</style>