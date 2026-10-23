"use client"
import AdminTools from '../AdminTools'
import { useAdmin } from '../AdminWorkspace'
export default function Page() {
  const { user } = useAdmin()
  return user ? <AdminTools section="announcements" user={user} /> : null
}
