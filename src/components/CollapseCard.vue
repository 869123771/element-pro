<template>
    <Card :class="{collapseCard}">
        <span slot="title" class="slotTitle" v-if="cardProps.linkTitle" @click="loginOrReg">
            {{cardProps.title}}
        </span>
        <span slot="title" v-else>
            {{cardProps.title}}
        </span>
        <span slot="extra" class="extraIcon" @click="slide">
            <Icon type="ios-arrow-down"></Icon>
        </span>
        <slot></slot>
    </Card>
</template>

<script>
    import 'dom-slider'
    import {Card,Icon} from 'iview'
    export default {
        name: "collapseCard",
        components : {
            Card,Icon
        },
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
                collapseCard: false
            }
        },
        methods: {
            slide() {
                this.collapseCard = !this.collapseCard
                document.querySelector('.ivu-card-body').slideToggle()
            },
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

<style lang="less">
    .ivu-card-extra {
        top: 8px !important;
    }

    .ivu-card-head{
        padding : 18px 12px;
    }

    .slotTitle {
        cursor: pointer;
        color: #007bff !important;
        font-weight: bold;
    }

    .extraIcon {
        font-size: 20px;
        cursor: pointer;
    }

    .collapseCard .extraIcon > i {
        transform: rotate(-90deg);
    }

    .collapseCard .extraIcon > i,
    .extraIcon > i {
        transition: all 0.6s ease 0s;
    }
</style>
