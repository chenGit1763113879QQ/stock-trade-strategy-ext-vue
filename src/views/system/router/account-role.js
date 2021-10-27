const routes = [
    {
      path: 'role',
      component: () => import('@/views/router-view'),

      meta: { title: '角色管理', icon: '', id:"",roles:"" },
      children: [
        //角色管理分配用户页面
        {
          path: 'assign-users/:applyCode',
          component: () => import('@/views/system/role/components/assign-users'),
          name: 'AssignUsers',
          meta: { title: '分配用户', icon:"" }
        }
      ]
    }
  ]
   
  export default routes