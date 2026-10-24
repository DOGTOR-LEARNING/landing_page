import AdminWorkspace from './AdminWorkspace'
export const metadata = {
  title: 'Dogtor 團隊工作台', robots: { index: false, follow: false },
  manifest: '/admin-manifest.webmanifest',
  appleWebApp: { capable: true, title: 'Dogtor 團隊', statusBarStyle: 'default' },
  icons: { apple: '/admin-apple-touch-icon.png' },
}
// The admin is used as an installed app: fixed to the device width, no pinch or double-tap zoom.
export const viewport = {
  width: 'device-width', initialScale: 1, maximumScale: 1, userScalable: false, viewportFit: 'cover',
  themeColor: '#1e374b',
}
export default function AdminLayout({ children }) { return <AdminWorkspace>{children}</AdminWorkspace> }
