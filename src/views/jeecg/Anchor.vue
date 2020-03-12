<template>
    <div class="m-3 bg-white sphere-container">
            <div class="sphere-container-header">
                <div class="logo">
                    <img :src="require('@/assets/img/anchor-logo.png')">
                    <img class = "pl-4" :src="require('@/assets/img/anchor-logo1.png')">
                </div>
                <div class = "nav">
                    <div class = "nav-item" :class = "steps === 'home' ? 'active' : ''" @click="anchors('home')">首页</div>
                    <div class = "nav-item" :class = "steps === 'pie' ? 'active' : ''" @click="anchors('pie')">极客派</div>
                    <div class = "nav-item" :class = "steps === 'activity' ? 'active' : ''" @click="anchors('activity')">极客活动</div>
                    <div class = "nav-item" :class = "steps === 'work-shop' ? 'active' : ''" @click="anchors('work-shop')">工作坊</div>
                    <div class = "nav-item" :class = "steps === 'sponsor' ? 'active' : ''" @click="anchors('sponsor')">赞助商</div>
                </div>
            </div>
        <div class = "sphere-container-content">
            <div class="floor target-home">
                <div class = "flex items-center justify-center h-full">
                    <div>
                        <div class = "target-home-title">云栖极客派</div>
                        <div><img :src="require('@/assets/img/home-logo.png')"/></div>
                    </div>
                </div>
            </div>
            <div class="floor target-pie">

            </div>
            <div class="floor target-activity"></div>
            <div class="floor target-work-shop"></div>
            <div class="floor target-sponsor"></div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                steps: 0,
                scrolltop: 0,//滑轮 距顶部的距离
                target : {
                    home : 0,
                    pie : 0,
                    activity : 0,
                    workShop : 0,
                    sponsor : 0
                },
            }
        },
        mounted() {
            this.getFloorDistance();
            this.getPulleyTopDistance();
        },
        methods: {
            anchors(val) {
                let {home,pie,activity,workShop,sponsor} = this.target
                switch (val) {
                    case 'home' :
                        this.pulleyRoll(home, this.scrolltop);
                        break;
                    case 'pie' :
                        this.pulleyRoll(pie, this.scrolltop);
                        break;
                    case 'activity' :
                        this.pulleyRoll(activity, this.scrolltop);
                        break;
                    case 'work-shop' :
                        this.pulleyRoll(workShop, this.scrolltop);
                        break;
                    case 'sponsor' :
                        this.pulleyRoll(sponsor, this.scrolltop);
                        break;
                }
            },

            /**
             * 滑轮 向上滚动和向下滚动的函数
             * top是楼层距窗体顶部的距离,distance当前滚动条与窗体顶部的距离
             * */
            pulleyRoll(top, distance) {
                /*向下滚动*/
                if (distance < top) {
                    let small_interval = (top - distance) / 50;
                    let i = 0;
                    let timer = setInterval(() => {
                        i++;
                        console.log(distance += small_interval);
                        document.documentElement.scrollTop = distance;
                        if (i == 50) {
                            clearInterval(timer);
                        }
                    }, 10)
                }
                /*向上滚动*/
                else if (distance > top) {
                    let small_interval = (distance - top) / 50;
                    let i = 0;
                    let timer = setInterval(() => {
                        i++;
                        console.log(distance -= small_interval);
                        document.documentElement.scrollTop = distance;
                        if (i == 50) {
                            clearInterval(timer);
                        }
                    }, 10);
                }
            },

            /**
             * 拿到所有 楼层距窗体顶部的距离
             * */
            getFloorDistance() {
                //拿到每个 楼层距窗体顶部的距离
                let home = document.querySelector(".target-home").offsetTop;
                let pie = document.querySelector(".target-pie").offsetTop;
                let activity = document.querySelector(".target-activity").offsetTop;
                let workShop = document.querySelector(".target-work-shop").offsetTop;
                let sponsor = document.querySelector(".target-sponsor").offsetTop;
                this.target = {
                    ...this.target,
                    home,
                    pie,
                    activity,
                    workShop,
                    sponsor
                }
            },

            /**
             * 滑轮滚动事件 返回滑轮距顶部的距离
             * */
            getPulleyTopDistance() {
                window.onscroll = () => {
                    this.scrolltop = document.documentElement.scrollTop || document.body.scrollTop;
                }
            }
        },
        watch: {
            //监听 滑轮滚动的值的变化 来实现自动锚点
            scrolltop(val) {
                val += 200;
                let {home,pie,activity,workShop,sponsor} = this.target
                if (val > home && val <= pie) {
                    this.steps = 'home';
                } else if (val > pie && val <= activity) {
                    this.steps = 'pie';
                } else if (val > activity && val <= workShop) {
                    this.steps = 'activity';
                } else if (val > workShop && val <= sponsor) {
                    this.steps = 'work-shop';
                } else if (val > sponsor) {
                    this.steps = 'sponsor';
                }
            },
            steps(res) {
                console.log(res)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .sphere-container {
        background: #000;
        &-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: fixed;
            right: 17px;
            left: 251px;
            z-index: 999;
            min-width: 1200px;
            background: #000;
            height: 78px;
            margin: 0 auto;
            padding: 0 20px;
            .logo{
                img{
                    &:first-child{
                        width: 44px;
                    }
                    &:last-child{
                        width: 152px;
                    }
                }
            }
            .nav{
                display: flex;
                &-item{
                    width: 100px;
                    height: 100%;
                    height: 78px;
                    color: #fff;
                    line-height: 78px;
                    text-align: center;
                    cursor: pointer;
                }
                &-item.active{
                   border-bottom: 2px solid #fff;
                    transition: all ease-in-out 0.3s;
                }
            }
        }
        &-content{

        }
        .floor {
            height : 100vh;
            overflow: hidden;
        }

        .target-home {
            background: url('../../assets/img/anchor-bg1.png');
            background-repeat: no-repeat;
            background-size: cover;
            &-title{
                color: #fff;
                font-weight: 700;
                font-size: 110px;
                line-height: 154px;
                letter-spacing: 24px;
            }
        }

        .target-pie {
            background: url('../../assets/img/pie-bg.png');
            background-repeat: no-repeat;
            background-size: cover;
        }

        .target-activity {
            background: #000;
        }

        .target-work-shop {
            background: url('../../assets/img/work-shop-bg.png');
            background-repeat: no-repeat;
            background-size: cover;
        }

        .target-sponsor {
            background: #000;
        }
    }

</style>
