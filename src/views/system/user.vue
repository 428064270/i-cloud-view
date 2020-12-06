<template>
  <div class="app-container">
    <div class="filter-container" style="padding-bottom: 3px;">
      <el-form :model="search">
        <el-row>
          <el-col :span="6">
            <el-form-item label="用户姓名" label-position="left" label-width="70px">
              <el-input v-model="search.query.name" style="min-width: 70%;width:70%;margin-right: 2%;" placeholder="用户姓名" @keyup.enter.native="query()" />
              <el-button icon="el-icon-search" style="min-width: 25%;width: 25%;" type="primary" @click="query()" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-button-group>
            <el-button icon="el-icon-plus" type="primary" @click="add()">添加</el-button>
          </el-button-group>
        </el-row>
      </el-form>
      <el-dialog :title="operate==='add'?'添加用户':'修改用户'" :visible.sync="dialogVisible" width="40%">
        <el-form ref="resource" :model="user" label-width="80px" style="height: 280px;">
          <el-col :span="11">
            <el-form-item label="登录名">
              <el-input v-model="user.username" placeholder="请输入登录名" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="登录密码">
              <el-input v-model="user.password" type="password" placeholder="请输入登录密码" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="角色">
              <el-select v-model="user.optionValues" multiple placeholder="请选择" style="width: 100%;">
                <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="真实姓名">
              <el-input v-model="user.name" placeholder="请输入真实姓名" />
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
    <el-table
      v-loading="table.loading"
      :data="table.list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="用户名" align="center" property="username" />
      <el-table-column label="用户姓名" align="center" property="name" />
      <el-table-column label="角色" align="center">
        <template slot-scope="scope">
          {{ scope.row.roleList | role }}
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
    <pagination
      v-show="table.total > 0"
      :total="table.total"
      :page.sync="search.page.pageNo"
      :limit.sync="search.page.pageSize"
      @pagination="query()"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { list, del, insert, edit } from '@/api/user'
import { allOptions } from '@/api/role'

export default {
  components: {
    Pagination
  },
  filters: {
    role(roleList) {
      if (!roleList) {
        return '--'
      }
      return roleList.toString().replaceAll('[', '').replaceAll(']', '').replaceAll(',', '，')
    }
  },
  data() {
    return {
      user: {
        id: '',
        name: '',
        password: '',
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
    edit(user) {
      this.operate = 'edit'
      this.user = user
      if (user.optionValuesJson) {
        this.user.optionValues = JSON.parse(user.optionValuesJson)
      }
      this.dialogVisible = true
    },
    add() {
      this.operate = 'add'
      Object.assign(this.$data.user, this.$options.data().user)
      this.loadOptions()
      this.dialogVisible = true
    },
    save() {
      const fun = this.operate === 'add' ? insert(this.user) : edit(this.user)
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
