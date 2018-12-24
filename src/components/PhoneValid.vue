<template>
    <div id="phoneValid">
        <Row>
            <FormItem prop="phoneValid">
                <Input v-model="phoneValidProps.phoneValid" size="large" placeholder="短信验证码">
                <Icon type="md-mail-open" slot="prefix"></Icon>
                </Input>
            </FormItem>
            <div class="validCode">
                <span @click="postCode" v-if="!isSend" :class="isSend?'send':'notSend'">{{codeMsg}}</span>
                <span v-else class="send">{{codeMsg}}</span>
            </div>
        </Row>
    </div>
</template>
<script>
    import {Row,Col,FormItem,Input,Icon} from 'iview'
    let time = 60;
    export default {
        name: 'phone-valid',
        components : {Row,Col,FormItem,Input,Icon},
        props: {
            phoneValidProps: {
                type: Object
            }
        },
        data() {
            return {
                codeMsg: '发送验证码',
                isSend: false
            }
        },
        methods: {
            postCode() {
                this.$parent.validateField('phoneNumber',(errorMsg)=>{
                    if(errorMsg){
                        return false
                    }else{
                        let id = setInterval(() => {
                            if (time) {
                                time--;
                                this.isSend = true;
                                this.codeMsg = `已发送(${time}s)`;
                            } else {
                                this.isSend = false;
                                this.codeMsg = '发送验证码'
                                time = 60
                                clearInterval(id)
                            }
                        }, 1000)
                    }
                })
            }
        }
    }

</script>
<style scoped lang="less">
    #phoneValid {
        .validCode {
            position: absolute;
            top: 8px;
            right: 20px;
            span {
                padding: 3px 0px 3px 1rem;
                border-left: 1px solid #e8eaec;
                cursor: pointer;
                color: #03a9f4;
            }
            span.send {
                cursor: default;
                color: gray;
            }
        }
    }
</style>
