<template>
    <div id="login" @keydown.enter="handleSubmit">
        <Row type="flex" class = "px-3 py-5 my-5">
            <Col :xs="{ span : 24}" :sm = "{span:5,offset : 14}">
                <CollapseCard v-model = "cardProps">
                    <Form :model="formItem" :rules="rules" ref="form" @keyup.enter.prevent="login">
                        <FormItem prop="userName">
                            <Input v-model="formItem.userName" size="large" autofocus placeholder = "请输入用户名或手机号">
                                <Icon class = "iconfont icon-user" slot="prefix"/>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="formItem.password" size="large" placeholder = "请输入密码">
                                <Icon class = "iconfont icon-lock" slot="prefix"/>
                            </Input>
                        </FormItem>
                        <FormItem>
                            <Select v-model = "formItem.loginWay" size="large">
                                <Option value = "local">本地登录</Option>
                                <Option value = "remote">远程登录</Option>
                            </Select>
                        </FormItem>
                        <FormItem>
                            <Button type="primary" long size="large" @click="handleSubmit">登录</Button>
                        </FormItem>
                    </Form>
                </CollapseCard>
            </Col>
        </Row>
    </div>
</template>

<script>
    import CollapseCard from '@/components/CollapseCard'
    import {http,constant,apiList} from "@/assets/js/common";
    export default {
        name: "login",
        components : {
            CollapseCard,
        },
        data() {
            return {
                cardProps : {
                    title : 'Regist',
                    linkTitle : true,
                },
                formItem: {
                    userName: '',
                    password: '',
                    loginWay : 'local'
                },
                rules: {
                    userName: [
                        {required: true, message: '账号不能为空', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '密码不能为空', trigger: 'blur'}
                    ]
                }
            }

        },
        methods: {
            handleSubmit() {
                this.$refs.form.validate((valid) => {
                    if (!valid) {
                        this.$Message.error('请完成必填校验');
                    } else {
                        this.login()
                    }
                })
            },
            async login() {
                let {
                    userName: mobile,
                    password
                } = this.formItem
                let param = {mobile, password}
                let {code:ERRORCODE,msg,result:RESULT} = await http.post(apiList.login, param)
                if (ERRORCODE === constant.SUCCESS) {
                    this.$Message.success({
                        content: '登录成功',
                        duration: 2,
                        closable : true,
                        onClose : ()=>this.$router.push('/home')
                    });
                    const token = "logined"
                }

            }
        },
        mounted() {

        }
    }
</script>

<style scoped>
    .ivu-input-prefix i, .ivu-input-suffix i{
        color : #ccc
    }
</style>
