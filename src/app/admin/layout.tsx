import AdminShell from './AdminShell'

export const metadata = {
  title: 'GoFabrikos Admin ERP',
  description: 'GoFabrikos Admin Dashboard',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>
}
