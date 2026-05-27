'use client';

export default function ContactForm() {
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const name = `${data.get('first-name')} ${data.get('last-name')}`.trim();
    const subject = encodeURIComponent(`[Olubukola Couture] ${data.get('subject')}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${data.get('email')}\n\nMessage:\n${data.get('body')}`
    );
    window.location.href = `mailto:olubukolacoutore@writeme.com?subject=${subject}&body=${body}`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-[10px] tracking-[2px] uppercase font-semibold text-ebony mb-2">
            First Name
          </label>
          <input
            type="text"
            name="first-name"
            required
            className="w-full border border-ivory-dark bg-white px-4 py-3 text-[13px] text-ebony placeholder:text-ebony-light/60 focus:outline-none focus:border-ebony transition-colors"
            placeholder="Jane"
          />
        </div>
        <div>
          <label className="block text-[10px] tracking-[2px] uppercase font-semibold text-ebony mb-2">
            Last Name
          </label>
          <input
            type="text"
            name="last-name"
            required
            className="w-full border border-ivory-dark bg-white px-4 py-3 text-[13px] text-ebony placeholder:text-ebony-light/60 focus:outline-none focus:border-ebony transition-colors"
            placeholder="Smith"
          />
        </div>
      </div>

      <div>
        <label className="block text-[10px] tracking-[2px] uppercase font-semibold text-ebony mb-2">
          Email Address
        </label>
        <input
          type="email"
          name="email"
          required
          className="w-full border border-ivory-dark bg-white px-4 py-3 text-[13px] text-ebony placeholder:text-ebony-light/60 focus:outline-none focus:border-ebony transition-colors"
          placeholder="jane@example.com"
        />
      </div>

      <div>
        <label className="block text-[10px] tracking-[2px] uppercase font-semibold text-ebony mb-2">
          Subject
        </label>
        <select
          name="subject"
          required
          className="w-full border border-ivory-dark bg-white px-4 py-3 text-[13px] text-ebony focus:outline-none focus:border-ebony transition-colors appearance-none"
        >
          <option value="">Select a topic</option>
          <option value="Order Enquiry">Order Enquiry</option>
          <option value="Return or Refund">Return or Refund</option>
          <option value="Sizing & Fit Advice">Sizing & Fit Advice</option>
          <option value="Product Information">Product Information</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-[10px] tracking-[2px] uppercase font-semibold text-ebony mb-2">
          Message
        </label>
        <textarea
          name="body"
          rows={5}
          required
          className="w-full border border-ivory-dark bg-white px-4 py-3 text-[13px] text-ebony placeholder:text-ebony-light/60 focus:outline-none focus:border-ebony transition-colors resize-none"
          placeholder="How can we help?"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-ebony text-ivory text-[11px] tracking-[3px] uppercase font-semibold py-4 hover:bg-ebony-dark transition-colors"
      >
        Send Message
      </button>

      <p className="text-[11px] text-ebony-light text-center leading-relaxed">
        Alternatively, email us directly at{' '}
        <a
          href="mailto:olubukolacoutore@writeme.com"
          className="underline underline-offset-2 hover:text-ebony transition-colors"
        >
          olubukolacoutore@writeme.com
        </a>
      </p>
    </form>
  );
}
