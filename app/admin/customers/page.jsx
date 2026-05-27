'use client';
import { useState, useEffect } from 'react';
import { Loader2, Users, Search, ShieldCheck, Mail } from 'lucide-react';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function fmt(pence) {
  return `£${(pence / 100).toFixed(2)}`;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => {
    fetch('/api/admin/customers')
      .then((r) => r.json())
      .then((d) => setCustomers(d.customers || []))
      .finally(() => setLoading(false));
  }, []);

  const visible = customers.filter((c) => {
    if (roleFilter && c.role !== roleFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        c.name?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalCustomers = customers.filter((c) => c.role === 'USER').length;
  const totalAdmins    = customers.filter((c) => c.role === 'ADMIN').length;
  const verified       = customers.filter((c) => c.emailVerified).length;
  const subscribers    = customers.filter((c) => c.newsletterSub).length;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-serif text-3xl text-ebony tracking-[2px]">Customers</h1>
        <p className="text-[12px] text-ebony-light mt-1">{customers.length} total accounts</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-4 border border-ivory-dark">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] tracking-[2px] uppercase text-ebony-light">Customers</span>
            <Users size={15} className="text-gold" />
          </div>
          <p className="text-2xl font-bold text-ebony">{totalCustomers}</p>
        </div>
        <div className="p-4 border border-ivory-dark">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] tracking-[2px] uppercase text-ebony-light">Admins</span>
            <ShieldCheck size={15} className="text-indigo-500" />
          </div>
          <p className="text-2xl font-bold text-indigo-600">{totalAdmins}</p>
        </div>
        <div className="p-4 border border-ivory-dark">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] tracking-[2px] uppercase text-ebony-light">Verified</span>
            <ShieldCheck size={15} className="text-green-500" />
          </div>
          <p className="text-2xl font-bold text-green-600">{verified}</p>
          <p className="text-[10px] text-ebony-light mt-0.5">email confirmed</p>
        </div>
        <div className="p-4 border border-ivory-dark">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] tracking-[2px] uppercase text-ebony-light">Newsletter</span>
            <Mail size={15} className="text-gold" />
          </div>
          <p className="text-2xl font-bold text-ebony">{subscribers}</p>
          <p className="text-[10px] text-ebony-light mt-0.5">subscribed</p>
        </div>
      </div>

      {/* Search + filter */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ebony-light" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="input-box pl-9 text-[13px] w-full"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="input-box text-[13px]"
        >
          <option value="">All Roles</option>
          <option value="USER">Customers</option>
          <option value="ADMIN">Admins</option>
        </select>
      </div>

      {/* Table */}
      <div className="border border-ivory-dark overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead className="bg-ivory-dark">
            <tr>
              {['Name', 'Email', 'Role', 'Verified', 'Newsletter', 'Orders', 'Total Spent', 'Joined'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[10px] tracking-[2px] uppercase text-ebony-light font-medium whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ivory-dark">
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center py-16">
                  <Loader2 size={24} className="animate-spin text-gold mx-auto" />
                </td>
              </tr>
            ) : visible.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-16 text-[12px] text-ebony-light">
                  No customers found
                </td>
              </tr>
            ) : visible.map((c) => (
              <tr key={c._id} className="hover:bg-ivory-dark/30 transition-colors">
                {/* Name */}
                <td className="px-4 py-3">
                  <p className="font-medium text-ebony">{c.name}</p>
                </td>
                {/* Email */}
                <td className="px-4 py-3 text-ebony-light">{c.email}</td>
                {/* Role */}
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 text-[9px] tracking-[1.5px] uppercase font-semibold ${
                    c.role === 'ADMIN'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'bg-ivory-dark text-ebony-light'
                  }`}>
                    {c.role}
                  </span>
                </td>
                {/* Verified */}
                <td className="px-4 py-3">
                  {c.emailVerified ? (
                    <span className="text-[10px] text-green-600 font-medium">✓ Yes</span>
                  ) : (
                    <span className="text-[10px] text-ebony-light">Pending</span>
                  )}
                </td>
                {/* Newsletter */}
                <td className="px-4 py-3">
                  {c.newsletterSub ? (
                    <span className="text-[10px] text-gold font-medium">✓ Yes</span>
                  ) : (
                    <span className="text-[10px] text-ebony-light">No</span>
                  )}
                </td>
                {/* Orders */}
                <td className="px-4 py-3 text-ebony font-medium">{c.orderCount}</td>
                {/* Total spent */}
                <td className="px-4 py-3 text-ebony">{c.totalSpentGBP ? fmt(c.totalSpentGBP) : '—'}</td>
                {/* Joined */}
                <td className="px-4 py-3 text-ebony-light whitespace-nowrap">
                  {formatDate(c.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
