import AdminWorkspace from './AdminWorkspace'
export const metadata = { title: 'Dogtor 團隊工作台', robots: { index: false, follow: false } }
export default function AdminLayout({ children }) { return <AdminWorkspace>{children}</AdminWorkspace> }
