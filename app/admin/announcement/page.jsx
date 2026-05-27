'use client';
import { useState, useEffect } from 'react';
import { Plus, Trash2, GripVertical, Loader2, Eye, EyeOff, Save, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';

const DEFAULTS = [
  'FREE SHIPPING ON ORDERS OVER £150',
  'NEW ARRIVALS — RESORT COLLECTION 2025',
  'COMPLIMENTARY GIFT WRAPPING ON ALL ORDERS',
  'SAME-DAY DISPATCH BEFORE 2PM',
];

export default function AdminAnnouncementPage() {
  const [messages,  setMessages]  = useState([]);
  const [enabled,   setEnabled]   = useState(true);
  const [speed,     setSpeed]     = useState(18);
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [dragIdx,   setDragIdx]   = useState(null);

  useEffect(() => {
    fetch('/api/admin/announcement')
      .then((r) => r.json())
      .then((d) => {
        setMessages(d.messages || DEFAULTS);
        setEnabled(d.enabled ?? true);
        setSpeed(d.speed ?? 18);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (messages.filter((m) => m.trim()).length === 0) {
      toast.error('Add at least one message before saving.');
      return;
    }
    setSaving(true);
    const res = await fetch('/api/admin/announcement', {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ messages: messages.filter((m) => m.trim()), enabled, speed }),
    });
    setSaving(false);
    if (res.ok) toast.success('Announcement bar updated');
    else toast.error('Failed to save changes');
  };

  const addMessage = () => setMessages((prev) => [...prev, '']);

  const updateMessage = (idx, val) =>
    setMessages((prev) => prev.map((m, i) => (i === idx ? val : m)));

  const removeMessage = (idx) =>
    setMessages((prev) => prev.filter((_, i) => i !== idx));

  const resetToDefaults = () => {
    setMessages(DEFAULTS);
    setEnabled(true);
    setSpeed(18);
    toast.success('Reset to defaults — click Save to apply');
  };

  // Drag-to-reorder
  const onDragStart = (idx) => setDragIdx(idx);
  const onDragOver  = (e, idx) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) return;
    const reordered = [...messages];
    const [moved]   = reordered.splice(dragIdx, 1);
    reordered.splice(idx, 0, moved);
    setMessages(reordered);
    setDragIdx(idx);
  };
  const onDragEnd = () => setDragIdx(null);

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-ebony tracking-[2px]">Announcement Bar</h1>
          <p className="text-[12px] text-ebony-light mt-1">
            Edit the scrolling messages shown at the top of every page.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={resetToDefaults}
            className="flex items-center gap-2 text-[10px] tracking-[1.5px] uppercase border border-ivory-dark px-4 py-2.5 text-ebony-light hover:border-ebony hover:text-ebony transition-colors"
          >
            <RotateCcw size={13} /> Reset Defaults
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary text-[10px] flex items-center gap-2 disabled:opacity-60"
          >
            {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={24} className="animate-spin text-gold" />
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

          {/* ── Left: Controls ─────────────────────────────── */}
          <div className="xl:col-span-2 space-y-6">

            {/* Enable / disable toggle */}
            <div className="border border-ivory-dark p-5 flex items-center justify-between">
              <div>
                <p className="text-[12px] font-semibold text-ebony tracking-[0.5px]">Bar Visibility</p>
                <p className="text-[11px] text-ebony-light mt-0.5">
                  {enabled ? 'Announcement bar is showing on the site.' : 'Bar is hidden — visitors will not see it.'}
                </p>
              </div>
              <button
                onClick={() => setEnabled(!enabled)}
                className={`flex items-center gap-2 text-[10px] tracking-[1.5px] uppercase font-semibold px-4 py-2 border transition-colors ${
                  enabled
                    ? 'border-green-300 bg-green-50 text-green-700 hover:bg-green-100'
                    : 'border-ivory-dark bg-ivory-dark text-ebony-light hover:border-ebony'
                }`}
              >
                {enabled ? <Eye size={13} /> : <EyeOff size={13} />}
                {enabled ? 'Visible' : 'Hidden'}
              </button>
            </div>

            {/* Scroll speed */}
            <div className="border border-ivory-dark p-5">
              <label className="text-[10px] tracking-[2px] uppercase text-ebony-light mb-3 block">
                Scroll Speed
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={8}
                  max={40}
                  step={2}
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="flex-1 accent-gold"
                />
                <span className="text-[12px] text-ebony font-medium w-20 text-right">
                  {speed}s loop
                </span>
              </div>
              <p className="text-[10px] text-ebony-light mt-2">
                Lower = faster scroll. Range: 8s (fast) — 40s (slow).
              </p>
            </div>

            {/* Messages list */}
            <div className="border border-ivory-dark">
              <div className="flex items-center justify-between px-5 py-4 border-b border-ivory-dark">
                <div>
                  <p className="text-[11px] font-semibold text-ebony tracking-[0.5px]">Messages</p>
                  <p className="text-[10px] text-ebony-light mt-0.5">{messages.filter((m) => m.trim()).length} active — drag ≡ to reorder</p>
                </div>
                <button
                  onClick={addMessage}
                  className="flex items-center gap-1.5 text-[10px] tracking-[1.5px] uppercase bg-gold text-ivory px-3 py-2 hover:bg-gold-dark transition-colors"
                >
                  <Plus size={12} /> Add Message
                </button>
              </div>

              <div className="divide-y divide-ivory-dark">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    draggable
                    onDragStart={() => onDragStart(idx)}
                    onDragOver={(e)  => onDragOver(e, idx)}
                    onDragEnd={onDragEnd}
                    className={`flex items-center gap-3 px-5 py-4 transition-colors ${dragIdx === idx ? 'bg-gold/5' : 'hover:bg-ivory-dark/30'}`}
                  >
                    {/* Drag handle */}
                    <GripVertical size={16} className="text-ebony-light/40 cursor-grab flex-shrink-0" />

                    {/* Index badge */}
                    <span className="text-[10px] font-mono text-ebony-light/50 w-5 flex-shrink-0">{idx + 1}</span>

                    {/* Editable text */}
                    <input
                      type="text"
                      value={msg}
                      onChange={(e) => updateMessage(idx, e.target.value)}
                      placeholder="Type your message here…"
                      className="flex-1 bg-transparent border-b border-ebony-light/20 focus:border-gold outline-none text-[13px] text-ebony py-1 transition-colors placeholder:text-ebony-light/40"
                    />

                    {/* Delete */}
                    <button
                      onClick={() => removeMessage(idx)}
                      disabled={messages.length === 1}
                      className="text-ebony-light/40 hover:text-red-500 transition-colors disabled:opacity-20 disabled:cursor-not-allowed flex-shrink-0"
                      aria-label="Remove message"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}

                {messages.length === 0 && (
                  <div className="px-5 py-10 text-center text-[12px] text-ebony-light">
                    No messages yet.{' '}
                    <button onClick={addMessage} className="text-gold hover:text-gold-dark underline">Add one.</button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Right: Live Preview ─────────────────────────── */}
          <div className="xl:col-span-1">
            <div className="sticky top-24">
              <p className="text-[10px] tracking-[2px] uppercase text-ebony-light mb-3">Live Preview</p>
              <div className={`overflow-hidden ${enabled ? 'bg-ebony' : 'bg-ivory-dark'}`}>
                {enabled ? (
                  <div className="py-2.5 overflow-hidden">
                    <div
                      className="flex whitespace-nowrap"
                      style={{
                        width: 'max-content',
                        animation: `marquee ${speed}s linear infinite`,
                      }}
                    >
                      {[...messages.filter((m) => m.trim()), ...messages.filter((m) => m.trim())].map((msg, i) => (
                        <span key={i} className="text-[10px] tracking-[3px] mx-12 font-medium text-ivory">
                          {msg || '…'}
                          <span className="ml-12 text-gold">◆</span>
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="py-4 text-center text-[11px] tracking-[2px] text-ebony-light uppercase">
                    Bar hidden
                  </div>
                )}
              </div>

              <div className="mt-4 border border-ivory-dark p-4 space-y-2">
                <p className="text-[10px] tracking-[2px] uppercase text-ebony-light">Settings summary</p>
                <div className="flex justify-between text-[12px]">
                  <span className="text-ebony-light">Status</span>
                  <span className={`font-medium ${enabled ? 'text-green-600' : 'text-ebony-light'}`}>
                    {enabled ? 'Visible' : 'Hidden'}
                  </span>
                </div>
                <div className="flex justify-between text-[12px]">
                  <span className="text-ebony-light">Messages</span>
                  <span className="font-medium text-ebony">{messages.filter((m) => m.trim()).length}</span>
                </div>
                <div className="flex justify-between text-[12px]">
                  <span className="text-ebony-light">Scroll speed</span>
                  <span className="font-medium text-ebony">{speed}s</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
