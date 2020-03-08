<template>
    <div>
        <el-form-item :label="item.label" :prop="item.field">
            <template v-if="item.view === 'text'">
                <template v-if = "item.mode === 'single'">
                    <el-input v-model="form[item.field]" :placeholder="item.label" clearable></el-input>
                </template>
                <template v-else-if = "item.mode === 'group'">
                    <div class = "flex">
                        <el-input v-model="form[item.field + '_begin']" :placeholder="'开始' + item.label" clearable></el-input>
                        <span class = "px-3"> ~ </span>
                        <el-input v-model="form[item.field + '_end']" :placeholder="'结束' + item.label" clearable></el-input>
                    </div>
                </template>
            </template>
            <template v-if="item.view === 'date'">
                <template v-if = "item.mode === 'single'">
                    <el-date-picker  v-model="form[item.field]" :placeholder="item.label" value-format="yyyy-MM-dd" class = "w-full"></el-date-picker>
                </template>
                <template v-else-if = "item.mode === 'group'">
                    <div class = "flex">
                        <el-date-picker v-model="form[item.field + '_begin']" :placeholder="'开始' + item.label" value-format="yyyy-MM-dd" class = "w-full"></el-date-picker>
                        <span class = "px-3"> ~ </span>
                        <el-date-picker v-model="form[item.field + '_end']" :placeholder="'结束' + item.label" value-format="yyyy-MM-dd" class = "w-full"></el-date-picker>
                    </div>
                </template>
            </template>
            <template v-if="item.view === 'list'">
                <template  v-if = "item.mode === 'single'">
                    <el-select v-model="form[item.field]" :placeholder="item.label" clearable filterable class = "w-full">
                        <template v-for = "{value,text} in table.dictOptions[item.field]">
                            <el-option :value = "value" :label = "text"></el-option>
                        </template>
                    </el-select>
                </template>
                <template v-else-if = "item.mode === 'group'">
                    <div class = "flex">
                        <el-select v-model="form[item.field]" :placeholder="'开始' + item.label" clearable filterable class = "w-full">
                            <template v-for = "{value,text} in table.dictOptions[item.field]">
                                <el-option :value = "value" :label = "text"></el-option>
                            </template>
                        </el-select>
                        <span class = "px-3"> ~ </span>
                        <el-select v-model="form[item.field]" :placeholder="'结束' + item.label" clearable filterable class = "w-full">
                            <template v-for = "{value,text} in table.dictOptions[item.field]">
                                <el-option :value = "value" :label = "text"></el-option>
                            </template>
                        </el-select>
                    </div>
                </template>
            </template>
            <template v-if="item.view === 'textarea'">
                <template v-if = "item.mode === 'single'">
                    <el-input type = "textarea" v-model="form[item.field]" :placeholder="item.label"></el-input>
                </template>
                <template v-else-if = "item.mode === 'group'">
                    <div class = "flex">
                        <el-input type = "textarea" v-model="form[item.field + '_begin']" :placeholder="'开始' + item.label"></el-input>
                        <span class = "px-3"> ~ </span>
                        <el-input type = "textarea"  v-model="form[item.field + '_end']" :placeholder="'结束' + item.label"></el-input>
                    </div>
                </template>
            </template>
        </el-form-item>
    </div>
</template>

<script>
    export default {
        name: "FormItemQuery",
        props : {
            item : {
                type : Object
            },
            form : {
                type : Object
            }
        }
    }
</script>

<style scoped>

</style>