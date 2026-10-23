"use client"
import AdminTools from '../AdminTools'
import { useAdmin } from '../AdminWorkspace'
export default function Page() {
  const { user } = useAdmin()
  return user ? <AdminTools section="push" user={user} /> : null
}
