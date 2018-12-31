<template>
    <Collapse v-model="collapse">
        <Panel name="content">
            <span class="slotTitle" v-if="cardProps.linkTitle" @click="loginOrReg">
                {{cardProps.title}}
            </span>
            <span v-else>{{cardProps.title}}</span>
            <div slot="content">
                <slot></slot>
            </div>
        </Panel>
    </Collapse>
</template>

<script>
    import 'dom-slider'
    import {Card,Icon} from 'iview'
    export default {
        name: "collapseCard",
        model: {
            prop: 'cardProps',
            event: ''
        },
        props: {
            cardProps: {
                type: Object
            }
        },
        data() {
            return {
                collapse: 'content'
            }
        },
        methods: {
            /*slide() {
                this.collapseCard = !this.collapseCard
                document.querySelector('.ivu-card-body').slideToggle()
            },*/
            loginOrReg() {
                if (this.$route.name === 'login') {
                    this.$router.push('/regist')
                } else {
                    this.$router.push('/login')
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .slotTitle {
        cursor: pointer;
        color: #007bff !important;
        font-weight: bold;
    }
</style>
<style scoped>
    >>> .ivu-icon-ios-arrow-forward{
        position: absolute;
        right: 0;
        top: 12px;
    }
</style>
