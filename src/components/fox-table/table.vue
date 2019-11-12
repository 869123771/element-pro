<template>
    <div class="lb-table">
        <el-table ref="elTable"
                  v-bind="$attrs"
                  v-on="$listeners"
                  stripe
                  border
                  :data="data"
                  :span-method="this.merge ? this.mergeMethod : this.spanMethod">
            <template v-for="(item, index) in column">
                <template v-if="item.slot">
                    <el-table-column
                            v-bind="$attrs"
                            v-on="$listeners"
                            :prop="item.prop"
                            :label="item.label"
                            :type="item.type"
                            :index="item.index"
                            :column-key="item.columnKey"
                            :width="item.width"
                            :min-width="item.minWidth"
                            :fixed="item.fixed"
                            :render-header="item.renderHeader"
                            :sortable="item.sortable || false"
                            :sort-method="item.sortMethod"
                            :sort-by="item.sortBy"
                            :sort-orders="item.sortOrders"
                            :resizable="item.resizable || true"
                            :formatter="item.formatter"
                            :show-overflow-tooltip="item.showOverflowTooltip || true"
                            :align="item.align || 'center'"
                            :header-align="item.headerAlign || item.align  || 'center'"
                            :class-name="item.className"
                            :label-class-name="item.labelClassName"
                            :selectable="item.selectable"
                            :reserve-selection="item.reserveSelection || false"
                            :filters="item.filters"
                            :filter-placement="item.filterPlacement"
                            :filter-multiple="item.filterMultiple"
                            :filter-method="item.filterMethod"
                            :filtered-value="item.filteredValue">
                        <template slot-scope="scope">
                            <slot :name="item.prop" :scope="handleScope(scope)"></slot>
                        </template>
                    </el-table-column>
                </template>
                <template v-else>
                    <column v-bind="$attrs"
                               :key="index"
                               :column="item">
                    </column>
                </template>
            </template>
        </el-table>
        <el-pagination class="table-pagination text-right my-2"
                       v-if="pagination"
                       v-bind="$attrs"
                       v-on="$listeners"
                       @current-change="currentChange"
        >
        </el-pagination>
    </div>
</template>

<script>
    import column from './column'
    import render from './render'
    import Sortable from 'sortablejs'

    export default {
        props: {
            column: Array,
            data: Array,
            spanMethod: Function,
            pagination: {
                type: Boolean,
                default: false
            },
            merge: Array,
        },
        components: {
            column
        },
        data() {
            return {
                mergeLine: {},
                mergeIndex: {}
            }
        },
        created() {
            this.getMergeArr(this.data, this.merge)
        },
        computed: {
            dataLength() {
                return this.data.length
            }
        },
        methods: {
            handleScope({row,$index,column}){
               return {row,$index,column}
            },
            clearSelection() {
                this.$refs.elTable.clearSelection()
            },
            toggleRowSelection(row, selected) {
                this.$refs.elTable.toggleRowSelection(row, selected)
            },
            toggleAllSelection() {
                this.$refs.elTable.toggleAllSelection()
            },
            toggleRowExpansion(row, expanded) {
                this.$refs.elTable.toggleRowExpansion(row, expanded)
            },
            setCurrentRow(row) {
                this.$refs.elTable.setCurrentRow(row)
            },
            clearSort() {
                this.$refs.elTable.clearSort()
            },
            clearFilter(columnKey) {
                this.$refs.elTable.clearFilter(columnKey)
            },
            doLayout() {
                this.$refs.elTable.doLayout()
            },
            sort(prop, order) {
                this.$refs.elTable.sort(prop, order)
            },
            currentChange(val) {
                this.$emit('p-current-change', val)
            },
            getMergeArr(tableData, merge) {
                if (!merge) return
                this.mergeLine = {}
                this.mergeIndex = {}
                merge.forEach((item, k) => {
                    tableData.forEach((data, i) => {
                        if (i === 0) {
                            this.mergeIndex[item] = this.mergeIndex[item] || []
                            this.mergeIndex[item].push(1)
                            this.mergeLine[item] = 0
                        } else {
                            if (data[item] === tableData[i - 1][item]) {
                                this.mergeIndex[item][this.mergeLine[item]] += 1
                                this.mergeIndex[item].push(0)
                            } else {
                                this.mergeIndex[item].push(1)
                                this.mergeLine[item] = i
                            }
                        }
                    })
                })
            },
            mergeMethod({row, column, rowIndex, columnIndex}) {
                const index = this.merge.indexOf(column.property)
                if (index > -1) {
                    const _row = this.mergeIndex[this.merge[index]][rowIndex]
                    const _col = _row > 0 ? 1 : 0
                    return {
                        rowspan: _row,
                        colspan: _col
                    }
                }
            },
            //行拖拽
            rowDrop() {
                const tbody = this.$refs.elTable.$el.querySelector('.el-table__body-wrapper tbody')
                const _this = this
                Sortable.create(tbody, {
                    onEnd({ newIndex, oldIndex }) {
                        const [currRow] = _this.data.splice(oldIndex, 1)
                        _this.data.splice(newIndex, 0, currRow)
                    }
                })
            },
            //列拖拽
            columnDrop() {
                const thead = this.$refs.elTable.$el.querySelector('.el-table__header-wrapper tr')
                this.sortable = Sortable.create(thead, {
                    animation: 180,
                    delay: 0,
                    onEnd : ({newIndex,oldIndex}) => {
                        const oldItem = this.column[oldIndex]
                        this.column.splice(oldIndex, 1)
                        this.column.splice(newIndex, 0, oldItem)
                    }
                })
            }
        },
        watch: {
            merge() {
                this.getMergeArr(this.data, this.merge)
            },
            dataLength() {
                this.getMergeArr(this.data, this.merge)
            }
        }
    }

</script>
