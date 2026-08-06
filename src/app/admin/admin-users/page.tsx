'use client'
import { useState } from 'react'
import {
  Users, Plus, Shield, Edit2, Trash2, CheckCircle,
  Eye, EyeOff, Mail, Phone, Clock, Key, AlertTriangle
} from 'lucide-react'

type AdminUser = {
  id: string
  name: string
  email: string
  phone: string
  role: 'superadmin' | 'manager' | 'staff' | 'accountant' | 'readonly'
  permissions: string[]
  lastLogin: string
  createdAt: string
  status: 'active' | 'suspended'
  avatar: string
}

const ALL_PERMS = [
  { group:'Orders',     items:['View Orders','Update Order Status','Manage Returns','Generate Invoices'] },
  { group:'Products',   items:['View Products','Add Products','Edit Products','Delete Products'] },
  { group:'Inventory',  items:['View Inventory','Manage Rolls','Issue Cutting Slips'] },
  { group:'Customers',  items:['View Customers','Edit Customers','View Messages','Reply Messages'] },
  { group:'Finance',    items:['View Finance','View GST Reports','Export Reports'] },
  { group:'Settings',   items:['Manage Settings','Manage Admin Users','Manage Promotions'] },
]

const ROLE_PERMS: Record<string, string[]> = {
  superadmin:  ALL_PERMS.flatMap(g=>g.items),
  manager:     ['View Orders','Update Order Status','Manage Returns','Generate Invoices','View Products','Add Products','Edit Products','View Inventory','Manage Rolls','Issue Cutting Slips','View Customers','Edit Customers','View Messages','Reply Messages','View Finance','View GST Reports','Export Reports','Manage Promotions'],
  staff:       ['View Orders','Update Order Status','View Products','View Inventory','Issue Cutting Slips','View Customers','View Messages','Reply Messages'],
  accountant:  ['View Orders','Generate Invoices','View Finance','View GST Reports','Export Reports'],
  readonly:    ['View Orders','View Products','View Inventory','View Customers','View Finance'],
}

const ROLE_STYLE: Record<string,string> = {
  superadmin: 'bg-purple-100 text-purple-700',
  manager:    'bg-rose-100 text-rose-700',
  staff:      'bg-blue-100 text-blue-700',
  accountant: 'bg-amber-100 text-amber-700',
  readonly:   'bg-stone-100 text-stone-500',
}

const USERS: AdminUser[] = [
  { id:'1', name:'Lakshmi Sowjanya Aaki', email:'sowjanya@gofabrikos.com', phone:'9000000001', role:'superadmin', permissions:ROLE_PERMS.superadmin, lastLogin:'2026-08-06 09:15', createdAt:'2024-10-23', status:'active', avatar:'L' },
  { id:'2', name:'Ravi Kumar',            email:'ravi@gofabrikos.com',     phone:'9000000002', role:'staff',      permissions:ROLE_PERMS.staff,      lastLogin:'2026-08-05 14:30', createdAt:'2025-01-15', status:'active', avatar:'R' },
  { id:'3', name:'Sriram Prasad',         email:'sriram@gofabrikos.com',   phone:'9000000003', role:'staff',      permissions:ROLE_PERMS.staff,      lastLogin:'2026-08-05 11:00', createdAt:'2025-03-01', status:'active', avatar:'S' },
  { id:'4', name:'Preethi Sharma',        email:'preethi@gofabrikos.com',  phone:'9000000004', role:'accountant', permissions:ROLE_PERMS.accountant,  lastLogin:'2026-08-04 16:00', createdAt:'2025-06-01', status:'active', avatar:'P' },
]

export default function AdminUsersPage() {
  const [users, setUsers]     = useState<AdminUser[]>(USERS)
  const [selected, setSelected] = useState<AdminUser|null>(null)
  const [showModal, setModal] = useState(false)
  const [showInvite, setInvite] = useState(false)
  const [editPerms, setEditPerms] = useState<string[]>([])

  const [invite, setInvite2] = useState({ name:'', email:'', phone:'', role:'staff' as AdminUser['role'] })
  const [inviteSent, setInviteSent] = useState(false)

  function togglePerm(perm: string) {
    setEditPerms(prev => prev.includes(perm) ? prev.filter(p=>p!==perm) : [...prev,perm])
  }

  function openEdit(u: AdminUser) {
    setSelected(u)
    setEditPerms([...u.permissions])
    setModal(true)
  }

  function savePerms() {
    if(!selected) return
    setUsers(prev => prev.map(u => u.id===selected.id ? {...u, permissions:editPerms} : u))
    setModal(false)
  }

  function toggleStatus(id: string) {
    setUsers(prev => prev.map(u => u.id===id ? {...u, status:u.status==='active'?'suspended':'active'} : u))
  }

  function sendInvite() {
    if(!invite.name||!invite.email) return
    const newUser: AdminUser = {
      id: Date.now().toString(), ...invite,
      permissions: ROLE_PERMS[invite.role],
      lastLogin: 'Never', createdAt: new Date().toISOString().split('T')[0],
      status: 'active', avatar: invite.name[0],
    }
    setUsers(prev=>[...prev,newUser])
    setInviteSent(true)
    setTimeout(()=>{ setInviteSent(false); setInvite(false as any); setInvite2({name:'',email:'',phone:'',role:'staff'}) },2000)
  }

  return (
    <div className="p-6 max-w-[1200px] mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Admin Users</h2>
          <p className="text-sm text-stone-500">Manage team access and permissions</p>
        </div>
        <button onClick={()=>setInvite(true)}
          className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold px-4 py-2 rounded-xl">
          <Plus size={15}/>Invite Admin
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <p className="text-2xl font-bold text-stone-900">{users.length}</p>
          <p className="text-xs font-semibold text-stone-500 mt-0.5">Total Users</p>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <p className="text-2xl font-bold text-green-600">{users.filter(u=>u.status==='active').length}</p>
          <p className="text-xs font-semibold text-stone-500 mt-0.5">Active</p>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <p className="text-2xl font-bold text-purple-600">1</p>
          <p className="text-xs font-semibold text-stone-500 mt-0.5">Super Admin</p>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <p className="text-2xl font-bold text-blue-600">{users.filter(u=>u.role==='staff').length}</p>
          <p className="text-xs font-semibold text-stone-500 mt-0.5">Staff</p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-stone-100 bg-stone-50 text-xs font-semibold text-stone-400 text-left">
              <th className="px-5 py-3">USER</th>
              <th className="px-5 py-3">ROLE</th>
              <th className="px-5 py-3">PERMISSIONS</th>
              <th className="px-5 py-3">LAST LOGIN</th>
              <th className="px-5 py-3">STATUS</th>
              <th className="px-5 py-3">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {users.map(u=>(
              <tr key={u.id} className={`hover:bg-stone-50 ${u.status==='suspended'?'opacity-60':''}`}>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm
                      ${u.role==='superadmin'?'bg-purple-100 text-purple-700':'bg-rose-100 text-rose-600'}`}>
                      {u.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-stone-800 text-sm">{u.name}</p>
                      <p className="text-xs text-stone-400">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full capitalize ${ROLE_STYLE[u.role]}`}>{u.role}</span>
                </td>
                <td className="px-5 py-3">
                  <p className="text-xs text-stone-500">{u.permissions.length} of {ALL_PERMS.flatMap(g=>g.items).length} permissions</p>
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {u.permissions.slice(0,3).map(p=>(
                      <span key={p} className="text-xs bg-stone-100 text-stone-500 px-1.5 py-0.5 rounded-full">{p}</span>
                    ))}
                    {u.permissions.length > 3 && <span className="text-xs text-stone-400">+{u.permissions.length-3}</span>}
                  </div>
                </td>
                <td className="px-5 py-3 text-xs text-stone-500">{u.lastLogin}</td>
                <td className="px-5 py-3">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${u.status==='active'?'bg-green-100 text-green-700':'bg-red-100 text-red-600'}`}>
                    {u.status}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1.5">
                    {u.role !== 'superadmin' && (
                      <>
                        <button onClick={()=>openEdit(u)} className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-100" title="Edit Permissions"><Key size={13}/></button>
                        <button onClick={()=>toggleStatus(u.id)}
                          className={`text-xs font-semibold px-2 py-1 rounded-lg ${u.status==='active'?'text-red-600 hover:bg-red-50':'text-green-600 hover:bg-green-50'}`}>
                          {u.status==='active'?'Suspend':'Activate'}
                        </button>
                      </>
                    )}
                    {u.role === 'superadmin' && (
                      <span className="text-xs text-stone-400 flex items-center gap-1"><Shield size={10}/>Owner</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Security Note */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle size={15} className="text-amber-600 mt-0.5 shrink-0"/>
        <div>
          <p className="text-sm font-semibold text-amber-800">Admin Password Security</p>
          <p className="text-xs text-amber-600 mt-0.5">The main admin login password (ADMIN_PASSWORD) is managed in Vercel Environment Variables. Each team member should use their own credentials — do not share passwords.</p>
        </div>
      </div>

      {/* Edit Permissions Modal */}
      {showModal && selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl">
            <div className="p-5 border-b border-stone-100 flex items-center justify-between">
              <div>
                <p className="font-bold text-stone-900">Edit Permissions — {selected.name}</p>
                <p className="text-xs text-stone-500 capitalize">{selected.role} · {editPerms.length} permissions selected</p>
              </div>
              <div className="flex items-center gap-2">
                <select onChange={e=>setEditPerms([...ROLE_PERMS[e.target.value as AdminUser['role']]])}
                  className="px-3 py-1.5 text-xs border border-stone-200 rounded-lg focus:outline-none">
                  <option value="">Apply role preset…</option>
                  {(['manager','staff','accountant','readonly'] as const).map(r=>(
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                <button onClick={()=>setModal(false)} className="text-stone-400 hover:text-stone-700 text-lg font-bold">✕</button>
              </div>
            </div>
            <div className="overflow-y-auto p-5 space-y-5">
              {ALL_PERMS.map(group=>(
                <div key={group.group}>
                  <p className="text-xs font-bold text-stone-400 mb-2">{group.group.toUpperCase()}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {group.items.map(perm=>(
                      <label key={perm} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-stone-50">
                        <input type="checkbox" checked={editPerms.includes(perm)} onChange={()=>togglePerm(perm)}
                          className="accent-rose-600"/>
                        <span className="text-sm text-stone-700">{perm}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-5 border-t border-stone-100 flex gap-2">
              <button onClick={()=>setModal(false)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-stone-200 text-stone-600">Cancel</button>
              <button onClick={savePerms} className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-rose-600 hover:bg-rose-700 text-white">Save Permissions</button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {showInvite && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-stone-900">Invite Admin User</h3>
              <button onClick={()=>setInvite(false as any)} className="text-stone-400 hover:text-stone-600 text-lg font-bold">✕</button>
            </div>
            {inviteSent ? (
              <div className="py-8 text-center">
                <CheckCircle size={40} className="mx-auto text-green-500 mb-3"/>
                <p className="font-bold text-stone-800">Invite sent!</p>
                <p className="text-sm text-stone-500 mt-1">An email has been sent to {invite.email}</p>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {[
                    { label:'Full Name', k:'name', placeholder:'e.g. Ravi Kumar' },
                    { label:'Email Address', k:'email', placeholder:'staff@gofabrikos.com' },
                    { label:'Phone', k:'phone', placeholder:'9000000000' },
                  ].map(f=>(
                    <div key={f.k}>
                      <label className="block text-xs font-semibold text-stone-500 mb-1">{f.label}</label>
                      <input value={(invite as any)[f.k]} onChange={e=>setInvite2(p=>({...p,[f.k]:e.target.value}))}
                        placeholder={f.placeholder}
                        className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-rose-400"/>
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs font-semibold text-stone-500 mb-1">Role</label>
                    <select value={invite.role} onChange={e=>setInvite2(p=>({...p,role:e.target.value as AdminUser['role']}))}
                      className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-rose-400">
                      <option value="staff">Staff — Order processing & cutting</option>
                      <option value="manager">Manager — Full access except settings</option>
                      <option value="accountant">Accountant — Finance & GST only</option>
                      <option value="readonly">Read Only — View only access</option>
                    </select>
                  </div>
                  <div className="bg-stone-50 rounded-xl p-3">
                    <p className="text-xs font-bold text-stone-400 mb-1">PERMISSIONS FOR {invite.role.toUpperCase()}</p>
                    <p className="text-xs text-stone-500">{ROLE_PERMS[invite.role].join(' · ')}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={()=>setInvite(false as any)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-stone-200 text-stone-600">Cancel</button>
                  <button onClick={sendInvite} className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-rose-600 hover:bg-rose-700 text-white">Send Invite</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
