<template>
  <div class="app-container">
    <div class="filter-container" style="padding-bottom: 3px;">
      <el-form :model="search">
        <el-row>
          <el-col :span="6">
            <el-form-item label="资源名称" label-position="left" label-width="70px">
              <el-input v-model="search.query.name" style="min-width: 70%;width:70%;margin-right: 2%;" placeholder="资源名称" @keyup.enter.native="query()" />
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
      <el-dialog :title="operate==='add'?'添加资源':'修改资源'" :visible.sync="dialogVisible" width="40%">
        <el-form ref="resource" :model="resource" label-width="80px" style="height: 300px;">
          <el-col :span="11">
            <el-form-item label="父级资源">
              <el-cascader v-model="resource.optionValues" style="width: 100%;" placeholder="请选择父级资源" :options="options" :props="{ checkStrictly: true }" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="资源类型">
              <el-select v-model="resource.type" style="width: 100%;" @change="typeChange">
                <el-option label="菜单" value="0" />
                <el-option label="接口" value="1" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="资源名称">
              <el-input v-model="resource.name" placeholder="请输入资源名称" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="访问路径">
              <el-input v-model="resource.path" placeholder="请输入访问路径" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item v-if="resource.type==0" label="是否展示">
              <el-select v-model="resource.display" style="width: 100%;">
                <el-option label="是" value="0" />
                <el-option label="否" value="1" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item v-if="resource.type==0" label="菜单排序">
              <el-input v-model="resource.order" placeholder="请输入菜单排序" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item v-if="resource.type==0" label="菜单图标">
              <el-input v-model="resource.icon" placeholder="请输入菜单图标" />
            </el-form-item>
          </el-col>
          <el-col v-if="resource.type==0" :span="11">
            <el-form-item label="组件路径">
              <el-input v-model="resource.componentPath" placeholder="请输入组件路径" />
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
    <el-table v-loading="table.loading" :data="table.list" element-loading-text="Loading" row-key="id" border :default-expand-all="false" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" fit highlight-current-row>
      <el-table-column label="资源名称" align="center" property="name" />
      <el-table-column label="资源类型" align="center">
        <template slot-scope="scope">
          {{ scope.row.type == 0?'菜单':'接口' }}
        </template>
      </el-table-column>
      <el-table-column label="访问路径" align="center" property="path" />
      <el-table-column label="是否展示" align="center">
        <template slot-scope="scope">
          {{ scope.row.display == 0?'是':'否' }}
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center" property="order" />
      <el-table-column label="图标" align="center">
        <template slot-scope="scope">
          {{ scope.row.type == 0? scope.row.icon:'--' }}
        </template>
      </el-table-column>
      <el-table-column label="组件路径" align="center">
        <template slot-scope="scope">
          {{ scope.row.type == 0? (scope.row.componentPath?scope.row.componentPath:'--'):'--' }}
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
  </div>
</template>

<script>
import { list, del, menuOptions, insert, edit } from '@/api/resource'
export default {
  data() {
    return {
      resource: {
        id: '',
        name: '',
        type: '0',
        path: '',
        display: '0',
        order: null,
        icon: '',
        componentPath: '',
        optionValues: []
      },
      search: {
        query: {
          name: ''
        }
      },
      table: {
        list: [],
        loading: false
      },
      dialogVisible: false,
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
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
        this.table.list = response.data
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
    edit(resource) {
      this.loadOptions()
      this.operate = 'edit'
      this.resource = resource
      this.resource.optionValues = JSON.parse(resource.optionValuesJson)
      this.resource.type = resource.type.toString()
      this.dialogVisible = true
    },
    add() {
      this.operate = 'add'
      Object.assign(this.$data.resource, this.$options.data().resource)
      this.loadOptions()
      this.dialogVisible = true
    },
    save() {
      const fun = this.operate === 'add' ? insert(this.resource) : edit(this.resource)
      fun.then(() => {
        this.query()
        this.dialogVisible = false
      })
    },
    typeChange(value) {
      if (value === '1') {
        Object.assign(this.resource, { icon: '', order: 0, componentPath: '', display: '0' })
      }
    },
    loadOptions() {
      menuOptions().then(response => {
        this.options = response.data
      })
    }
  }
}
</script>
