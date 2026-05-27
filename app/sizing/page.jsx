import HelpTabs from '@/components/help/HelpTabs';
import { Ruler } from 'lucide-react';

export const metadata = {
  title: 'Sizing Guide',
  description: 'Find your perfect fit with our UK women\'s sizing guide.',
};

const SIZE_DATA = [
  { uk: '6',  eu: '34', us: '2',  bust_in: '32–33', waist_in: '24–25', hip_in: '34–35', bust_cm: '81–84',  waist_cm: '61–64',  hip_cm: '86–89'  },
  { uk: '8',  eu: '36', us: '4',  bust_in: '34–35', waist_in: '26–27', hip_in: '36–37', bust_cm: '86–89',  waist_cm: '66–69',  hip_cm: '91–94'  },
  { uk: '10', eu: '38', us: '6',  bust_in: '36–37', waist_in: '28–29', hip_in: '38–39', bust_cm: '91–94',  waist_cm: '71–74',  hip_cm: '96–99'  },
  { uk: '12', eu: '40', us: '8',  bust_in: '38–39', waist_in: '30–31', hip_in: '40–41', bust_cm: '96–99',  waist_cm: '76–79',  hip_cm: '101–104' },
  { uk: '14', eu: '42', us: '10', bust_in: '40–41', waist_in: '32–33', hip_in: '42–43', bust_cm: '101–104', waist_cm: '81–84', hip_cm: '106–109' },
  { uk: '16', eu: '44', us: '12', bust_in: '42–43', waist_in: '34–35', hip_in: '44–45', bust_cm: '106–109', waist_cm: '86–89', hip_cm: '111–114' },
  { uk: '18', eu: '46', us: '14', bust_in: '44–45', waist_in: '36–37', hip_in: '46–47', bust_cm: '111–114', waist_cm: '91–94', hip_cm: '116–119' },
  { uk: '20', eu: '48', us: '16', bust_in: '46–47', waist_in: '38–39', hip_in: '48–49', bust_cm: '116–119', waist_cm: '96–99', hip_cm: '121–124' },
  { uk: '22', eu: '50', us: '18', bust_in: '48–49', waist_in: '40–41', hip_in: '50–51', bust_cm: '121–124', waist_cm: '101–104', hip_cm: '126–129' },
  { uk: '24', eu: '52', us: '20', bust_in: '50–51', waist_in: '42–43', hip_in: '52–53', bust_cm: '126–129', waist_cm: '106–109', hip_cm: '131–134' },
];

const HOW_TO_MEASURE = [
  {
    label: 'Bust',
    desc: 'Measure around the fullest part of your chest, keeping the tape parallel to the floor.',
  },
  {
    label: 'Waist',
    desc: 'Measure around your natural waistline — the narrowest part of your torso.',
  },
  {
    label: 'Hips',
    desc: 'Stand with feet together and measure around the fullest part of your hips and bottom.',
  },
];

export default function SizingGuidePage() {
  return (
    <div className="bg-ivory min-h-screen">
      {/* Page header */}
      <div className="border-b border-ivory-dark py-12 px-6 lg:px-12 text-center">
        <div className="max-w-8xl mx-auto">
          <span className="text-[10px] tracking-[3px] uppercase text-gold font-semibold">Help</span>
          <h1 className="font-serif text-3xl lg:text-4xl mt-2 text-ebony">Sizing Guide</h1>
          <p className="mt-3 text-[13px] text-ebony-light leading-relaxed max-w-xl mx-auto">
            Every Olubukola Couture piece is cut to standard UK sizing. Use this guide to find
            your perfect fit before you order.
          </p>
        </div>
      </div>

      <HelpTabs />

      <div className="max-w-5xl mx-auto px-6 lg:px-12 py-14">
        {/* How to measure */}
        <section className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <Ruler size={16} className="text-gold" />
            <h2 className="text-[11px] tracking-[3px] uppercase font-semibold text-ebony">
              How to Measure
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {HOW_TO_MEASURE.map((m) => (
              <div key={m.label} className="border border-ivory-dark p-6">
                <p className="text-[10px] tracking-[2px] uppercase font-semibold text-gold mb-2">
                  {m.label}
                </p>
                <p className="text-[13px] text-ebony-light leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[12px] text-ebony-light">
            * Always measure over your underwear, not over clothing. Use a soft tape measure and keep it level.
          </p>
        </section>

        {/* Size table */}
        <section>
          <h2 className="text-[11px] tracking-[3px] uppercase font-semibold text-ebony mb-6">
            Women's Size Chart
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-[12px] text-ebony border-collapse">
              <thead>
                <tr className="bg-ebony text-ivory">
                  <th className="py-3 px-4 text-left text-[10px] tracking-[2px] uppercase font-semibold">UK</th>
                  <th className="py-3 px-4 text-left text-[10px] tracking-[2px] uppercase font-semibold">EU</th>
                  <th className="py-3 px-4 text-left text-[10px] tracking-[2px] uppercase font-semibold">US</th>
                  <th className="py-3 px-4 text-left text-[10px] tracking-[2px] uppercase font-semibold" colSpan={2}>Bust</th>
                  <th className="py-3 px-4 text-left text-[10px] tracking-[2px] uppercase font-semibold" colSpan={2}>Waist</th>
                  <th className="py-3 px-4 text-left text-[10px] tracking-[2px] uppercase font-semibold" colSpan={2}>Hips</th>
                </tr>
                <tr className="bg-ebony/80 text-ivory/70">
                  <th className="py-2 px-4" />
                  <th className="py-2 px-4" />
                  <th className="py-2 px-4" />
                  <th className="py-2 px-4 text-[9px] tracking-[1px] uppercase font-medium">inches</th>
                  <th className="py-2 px-4 text-[9px] tracking-[1px] uppercase font-medium">cm</th>
                  <th className="py-2 px-4 text-[9px] tracking-[1px] uppercase font-medium">inches</th>
                  <th className="py-2 px-4 text-[9px] tracking-[1px] uppercase font-medium">cm</th>
                  <th className="py-2 px-4 text-[9px] tracking-[1px] uppercase font-medium">inches</th>
                  <th className="py-2 px-4 text-[9px] tracking-[1px] uppercase font-medium">cm</th>
                </tr>
              </thead>
              <tbody>
                {SIZE_DATA.map((row, i) => (
                  <tr
                    key={row.uk}
                    className={`border-b border-ivory-dark ${i % 2 === 0 ? 'bg-white' : 'bg-ivory'}`}
                  >
                    <td className="py-3 px-4 font-semibold text-ebony">{row.uk}</td>
                    <td className="py-3 px-4 text-ebony-light">{row.eu}</td>
                    <td className="py-3 px-4 text-ebony-light">{row.us}</td>
                    <td className="py-3 px-4">{row.bust_in}</td>
                    <td className="py-3 px-4 text-ebony-light">{row.bust_cm}</td>
                    <td className="py-3 px-4">{row.waist_in}</td>
                    <td className="py-3 px-4 text-ebony-light">{row.waist_cm}</td>
                    <td className="py-3 px-4">{row.hip_in}</td>
                    <td className="py-3 px-4 text-ebony-light">{row.hip_cm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-6 text-[12px] text-ebony-light leading-relaxed">
            If your measurements fall between two sizes, we recommend sizing up for a more comfortable fit.
            For further assistance, please{' '}
            <a href="/contact" className="underline underline-offset-2 hover:text-ebony transition-colors">
              contact us
            </a>{' '}
            and our styling team will be happy to help.
          </p>
        </section>
      </div>
    </div>
  );
}
