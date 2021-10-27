/* Layout */
import Layout from '@/layout'
 
import AccountRole from './account-role'

const routes = [
  {
    path: '/system/accountRole',
    hidden: true,
    component: Layout,
    noCache: true,
    redirect: 'noRedirect',
    children: [
      ...AccountRole,
    ]
  }
 
];
 
export default routes;