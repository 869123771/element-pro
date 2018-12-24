<template>
    <div id="regist">
        <Row type="flex" class="loginPosition px-3 py-5 my-5">
            <Col :xs="{ span : 24}" :sm="{span:6,offset : 14}">
                <CollapseCard v-model="cardProps">
                    <Form :model="formItem" :rules="rules" ref="form" @keyup.enter.prevent="regist">
                        <FormItem prop="userName">
                            <Input v-model="formItem.userName" size="large" autofocus placeholder="请输入用户名">
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="formItem.password" size="large" placeholder="请输入密码">
                            </Input>
                        </FormItem>
                        <FormItem prop="confirmPassword">
                            <Input type="password" v-model="formItem.confirmPassword" size="large" placeholder="请确认密码">
                            </Input>
                        </FormItem>
                        <phone-select :phoneSelectProps = "formItem"></phone-select>
                        <phone-valid :phoneValidProps = "formItem"></phone-valid>
                        <FormItem>
                            <Button type = "primary" long size="large" @click = "regist('form')">注册</Button>
                        </FormItem>
                    </Form>
                </CollapseCard>
            </Col>
        </Row>
    </div>
</template>
<script>
    import CollapseCard from '@/components/CollapseCard'
    import PhoneSelect from '@/components/PhoneSelect'
    import PhoneValid from '@/components/PhoneValid'
    import {userName,password,confirmPassword,phoneNumber} from '@/assets/js/utils/validate'
    import {http, constant, apiList} from "@/assets/js/common";
    import {Row,Col,Input,Select,Form,FormItem,Button} from 'iview'
    export default {
        name: 'regist',
        components: {
            CollapseCard,
            PhoneSelect,
            PhoneValid,
           Row,Col,Input,Select,Form,FormItem,Button
        },
        data() {
            return {
                cardProps: {
                    title: 'Login',
                    linkTitle: true,
                },
                formItem : {
                    userName : '',
                    password : '',
                    confirmPassword : '',
                    phoneNumber : '',
                    phoneValid : '',
                },
                rules : {
                  userName : [
                    {required : true,message : '必填',trigger : 'change'},
                    {validator : userName,trigger : 'change'}
                  ],
                    password : [
                        {required : true,message : '必填',trigger : 'change'},
                        {validator  : password, trigger : 'change'},
                    ],
                    confirmPassword : [
                        {required : true,message : '必填',trigger : 'change'},
                        {validator  : (...args)=>confirmPassword(this,args), type : 'string', trigger : 'change'},
                    ],
                    phoneNumber : [
                        {required : true,message : '必填',trigger : 'change'},
                        {validator : phoneNumber, trigger : 'change'},
                    ],
                    phoneValid : [
                        {required : true,message : '必填',trigger : 'change'},
                        {type: 'string', len:6,message : '请输入6位有效的验证码', trigger : 'change'},
                    ]
                }

            }
        },
        methods : {
            regist(name){
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.registOk()
                    }
                })
            },
           async registOk(){
                let {
                    password ,
                    phoneNumber : mobile,
                    phoneValid : code,
                } = this.formItem
                let param = {
                    mobile,code,password
                }
                let {code:ERRORCODE, msg, result:RESULT} = await http.post(apiList.register, param)
                if (ERRORCODE === constant.SUCCESS) {
                    this.$Message.success({
                        content: '注册成功',
                        duration: 2,
                        closable : true,
                        onClose : ()=>this.$router.push('/login')
                    });
                }
            }
        }
    }

</script>
<style>

</style>
