'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Mail, Users, Send, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

// Load TipTap dynamically (no SSR)
const RichTextEditor = dynamic(() => import('@/components/admin/RichTextEditor'), { ssr: false });

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [subject,     setSubject]     = useState('');
  const [content,     setContent]     = useState('');
  const [sending,     setSending]     = useState(false);
  const [activeTab,   setActiveTab]   = useState('compose'); // compose | list

  useEffect(() => {
    fetch('/api/admin/newsletter')
      .then((r) => r.json())
      .then((d) => { setSubscribers(d.subscribers || []); setLoading(false); });
  }, []);

  const handleSend = async () => {
    if (!subject || !content) { toast.error('Please add a subject and content.'); return; }
    if (!window.confirm(`Send to ${subscribers.length} subscribers?`)) return;
    setSending(true);
    try {
      const res = await fetch('/api/newsletter/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, htmlContent: content }),
      });
      const data = await res.json();
      toast.success(`Newsletter sent to ${data.sent} subscribers!`);
      setSubject('');
      setContent('');
    } catch {
      toast.error('Failed to send newsletter.');
    } finally {
      setSending(false);
    }
  };


  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-ebony tracking-[2px]">Newsletter</h1>
          <p className="text-[12px] text-ebony-light mt-1">
            {loading ? '...' : `${subscribers.length} active subscribers`}
          </p>
        </div>
        <div className="flex gap-2">
          {['compose', 'list'].map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-4 py-2 text-[11px] tracking-[1.5px] uppercase transition-colors border ${
                activeTab === t ? 'bg-ebony text-ivory border-ebony' : 'border-ivory-dark text-ebony-light hover:text-ebony'
              }`}
            >
              {t === 'compose' ? <span className="flex items-center gap-1.5"><Mail size={13} /> Compose</span>
                              : <span className="flex items-center gap-1.5"><Users size={13} /> Subscribers</span>}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'compose' ? (
        <div className="space-y-6">
          <div>
            <label className="text-[10px] tracking-[2px] uppercase text-ebony-light mb-2 block">Subject Line</label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. New Summer Arrivals — Shop Now"
              className="input-box w-full max-w-2xl"
            />
          </div>

          <div>
            <div className="mb-2">
              <label className="text-[10px] tracking-[2px] uppercase text-ebony-light">Email Content</label>
            </div>
            <div className="border border-ivory-dark min-h-[400px] bg-ivory">
              <RichTextEditor content={content} onChange={setContent} />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleSend}
              disabled={sending || !subject || !content}
              className="btn-primary text-[10px] disabled:opacity-60 flex items-center gap-2"
            >
              {sending ? <><Loader2 size={14} className="animate-spin" /> Sending...</>
                       : <><Send size={14} /> Send to {subscribers.length} Subscribers</>}
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="border border-ivory-dark overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead className="bg-ivory-dark">
                <tr>
                  {['Email', 'Source', 'Subscribed', 'Status'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] tracking-[2px] uppercase text-ebony-light font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ivory-dark">
                {loading ? (
                  <tr><td colSpan={4} className="text-center py-8"><Loader2 size={20} className="animate-spin text-gold mx-auto" /></td></tr>
                ) : subscribers.map((s) => (
                  <tr key={s._id} className="hover:bg-ivory-dark/50 transition-colors">
                    <td className="px-4 py-3 font-medium">{s.email}</td>
                    <td className="px-4 py-3 text-ebony-light capitalize">{s.source}</td>
                    <td className="px-4 py-3 text-ebony-light">{new Date(s.subscribedAt).toLocaleDateString('en-GB')}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] tracking-[1px] uppercase px-2 py-0.5 rounded-full ${s.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                        {s.isActive ? 'Active' : 'Unsubscribed'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
