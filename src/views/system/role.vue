<template>
  <div class="app-container">
    <div class="filter-container" style="padding-bottom: 3px;">
      <el-form :model="search">
        <el-row>
          <el-col :span="6">
            <el-form-item label="角色名称" label-position="left" label-width="70px">
              <el-input v-model="search.query.name" style="min-width: 70%;width:70%;margin-right: 2%;" placeholder="角色名称" @keyup.enter.native="query()" />
              <el-button icon="el-icon-search" style="min-width: 25%;width: 25%;" type="primary" @click="query()">搜索</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-button-group>
            <el-button icon="el-icon-plus" type="primary" @click="add()">添加</el-button>
          </el-button-group>
        </el-row>
      </el-form>
      <el-dialog :title="operate==='add'?'添加角色':'修改角色'" :visible.sync="dialogVisible" width="40%">
        <el-form ref="resource" :model="role" label-width="80px" style="height: 230px;">
          <el-col :span="22">
            <el-form-item label="资源权限">
              <el-cascader v-model="role.optionValues" clearable style="width: 100%;" placeholder="请选择资源权限" :options="options" collapse-tags :props="{ multiple: true,checkStrictly: true }" />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <el-form-item label="角色名称">
              <el-input v-model="role.name" placeholder="请输入角色名称" />
            </el-form-item>
          </el-col>
          <el-col :span="22">
            <div class="dialog-footer" style="float: right">
              <el-button type="primary" @click="save()">确定</el-button>
              <el-button @click="dialogVisible = false">取消</el-button>
            </div>
          </el-col>
        </el-form>
      </el-dialog>
    </div>
    <el-table v-loading="table.loading" :data="table.list" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column label="角色编号" align="center">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="角色名称" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-row>
            <el-button type="primary" icon="el-icon-edit" circle @click="edit(scope.row)" />
            <el-button type="danger" icon="el-icon-delete" circle @click="remove(scope.row.id)" />
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="table.total > 0" :total="table.total" :page.sync="search.page.pageNo" :limit.sync="search.page.pageSize" @pagination="query()" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { list, del, insert, edit } from '@/api/role'
import { allOptions } from '@/api/resource'
export default {
  components: {
    Pagination
  },
  data() {
    return {
      role: {
        id: '',
        name: '',
        optionValues: []
      },
      search: {
        query: {
          name: ''
        },
        page: {
          pageNo: 1,
          pageSize: 20
        }
      },
      table: {
        list: [],
        loading: false,
        total: 1
      },
      dialogVisible: false,
      options: [],
      operate: 'add'
    }
  },
  created() {
    this.query()
    this.loadOptions()
  },
  methods: {
    query() {
      this.table.loading = true
      list(this.search).then(response => {
        const { total, records } = response.data
        this.table.list = records
        this.table.total = total
      })
      setTimeout(() => {
        this.table.loading = false
      }, 1200)
    },
    remove(id) {
      del(id).then(() => {
        this.query()
      })
    },
    edit(role) {
      this.operate = 'edit'
      this.role = role
      this.role.optionValues = JSON.parse(role.optionValuesJson)
      this.dialogVisible = true
    },
    add() {
      this.operate = 'add'
      Object.assign(this.$data.role, this.$options.data().role)
      this.loadOptions()
      this.dialogVisible = true
    },
    save() {
      const fun = this.operate === 'add' ? insert(this.role) : edit(this.role)
      fun.then(() => {
        this.query()
        this.dialogVisible = false
      })
    },
    loadOptions() {
      allOptions().then(response => {
        this.options = response.data
      })
    }
  }
}
</script>
