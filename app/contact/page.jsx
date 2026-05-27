import HelpTabs from '@/components/help/HelpTabs';
import ContactForm from './ContactForm';
import { MapPin, Mail, Phone, Clock } from 'lucide-react';

export const metadata = {
  title: 'Contact Us',
  description: 'Get in touch with the Olubukola Couture team.',
};

const CONTACT_DETAILS = [
  {
    icon: MapPin,
    label: 'Visit Us',
    lines: ['65 Periwinkle Close', 'Sittingbourne, Kent', 'ME10 2JU', 'United Kingdom'],
  },
  {
    icon: Mail,
    label: 'Email Us',
    lines: ['olubukolacoutore@writeme.com'],
    href: 'mailto:olubukolacoutore@writeme.com',
  },
  {
    icon: Phone,
    label: 'Call Us',
    lines: ['+44 789 364 377'],
    href: 'tel:+44789364377',
  },
  {
    icon: Clock,
    label: 'Opening Hours',
    lines: ['Monday – Friday: 9am – 6pm', 'Saturday: 10am – 4pm', 'Sunday: Closed'],
  },
];

export default function ContactPage() {
  return (
    <div className="bg-ivory min-h-screen">
      {/* Page header */}
      <div className="border-b border-ivory-dark py-12 px-6 lg:px-12 text-center">
        <div className="max-w-8xl mx-auto">
          <span className="text-[10px] tracking-[3px] uppercase text-gold font-semibold">Help</span>
          <h1 className="font-serif text-3xl lg:text-4xl mt-2 text-ebony">Contact Us</h1>
          <p className="mt-3 text-[13px] text-ebony-light leading-relaxed max-w-xl mx-auto">
            We'd love to hear from you. Reach out with any questions, styling advice requests,
            or feedback and we'll get back to you as soon as possible.
          </p>
        </div>
      </div>

      <HelpTabs />

      <div className="max-w-5xl mx-auto px-6 lg:px-12 py-14">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Contact details */}
          <div className="space-y-8">
            <h2 className="text-[11px] tracking-[3px] uppercase font-semibold text-ebony">
              Get in Touch
            </h2>

            <div className="space-y-6">
              {CONTACT_DETAILS.map(({ icon: Icon, label, lines, href }) => (
                <div key={label} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 border border-ivory-dark flex items-center justify-center">
                    <Icon size={16} className="text-gold" />
                  </div>
                  <div>
                    <p className="text-[10px] tracking-[2px] uppercase font-semibold text-ebony mb-1.5">
                      {label}
                    </p>
                    {lines.map((line, i) =>
                      href && i === 0 ? (
                        <a
                          key={line}
                          href={href}
                          className="block text-[13px] text-ebony-light hover:text-ebony transition-colors underline underline-offset-2"
                        >
                          {line}
                        </a>
                      ) : (
                        <p key={line} className="text-[13px] text-ebony-light">
                          {line}
                        </p>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="border border-ivory-dark p-5 bg-white">
              <p className="text-[11px] tracking-[1.5px] uppercase font-semibold text-ebony mb-2">
                Response Time
              </p>
              <p className="text-[13px] text-ebony-light leading-relaxed">
                We aim to respond to all enquiries within 24 hours on business days.
                For urgent order queries, please call us directly.
              </p>
            </div>
          </div>

          {/* Contact form */}
          <div>
            <h2 className="text-[11px] tracking-[3px] uppercase font-semibold text-ebony mb-6">
              Send a Message
            </h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
