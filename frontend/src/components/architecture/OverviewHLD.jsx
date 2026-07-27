/**
 * OverviewHLD - High-level design summary: stats, tech stack,
 * non-functional requirements, and documented trade-offs.
 */
import { FaShieldAlt, FaTachometerAlt, FaLayerGroup, FaCheckCircle, FaBalanceScale } from 'react-icons/fa';
import { nfrs, techStack, tradeoffs } from './archData';

const nfrIcons = {
  Security: FaShieldAlt,
  Performance: FaTachometerAlt,
  Scalability: FaLayerGroup,
  Reliability: FaCheckCircle,
};

const stats = [
  { label: 'Collections', value: '5' },
  { label: 'REST Endpoints', value: '43' },
  { label: 'Socket Events', value: '7' },
  { label: 'User Roles', value: '3' },
  { label: 'External Services', value: '4' },
  { label: 'Middleware Stages', value: '7' },
];

export default function OverviewHLD() {
  return (
    <div className="flex flex-col gap-8">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-center">
            <p className="font-mono text-2xl font-bold text-[#E23744]">{s.value}</p>
            <p className="mt-1 text-xs text-slate-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">
        <h3 className="mb-2 font-bold text-slate-100">System Summary</h3>
        <p className="text-sm leading-relaxed text-slate-400">
          BiteDash is a three-sided food delivery marketplace (customers, shop owners, delivery
          partners) built as a MERN monolith. A React 19 SPA talks to a single Express API over
          REST for commands/queries and Socket.IO for real-time events. MongoDB stores all domain
          data with geo-indexes powering proximity-based delivery assignment. Payments run through
          Stripe Checkout with server-side verification, media through Cloudinary, and OTP email
          through a three-provider fallback chain. The whole stack deploys behind an AWS
          Application Load Balancer via Docker Compose.
        </p>
      </div>

      {/* Tech stack */}
      <div className="overflow-hidden rounded-xl border border-slate-700">
        <div className="border-b border-slate-700 bg-slate-900 px-4 py-3">
          <h3 className="font-bold text-slate-100">Technology Stack</h3>
        </div>
        <ul className="divide-y divide-slate-800/70 bg-slate-950/40">
          {techStack.map((t) => (
            <li key={t.layer} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:gap-4">
              <span className="w-24 shrink-0 font-mono text-xs font-bold uppercase tracking-wider text-[#E23744]">
                {t.layer}
              </span>
              <span className="text-sm text-slate-300">{t.items}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* NFRs */}
      <div className="grid gap-4 sm:grid-cols-2">
        {nfrs.map((nfr) => {
          const Icon = nfrIcons[nfr.name] || FaCheckCircle;
          return (
            <div key={nfr.name} className="rounded-xl border border-slate-700 bg-slate-900 p-5">
              <h3 className="mb-3 flex items-center gap-2 font-bold text-slate-100">
                <Icon className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                {nfr.name}
              </h3>
              <ul className="flex flex-col gap-2">
                {nfr.items.map((item) => (
                  <li key={item} className="flex gap-2 text-sm leading-relaxed text-slate-400">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-600" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Trade-offs */}
      <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">
        <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-100">
          <FaBalanceScale className="h-4 w-4 text-amber-400" aria-hidden="true" />
          Architecture Decisions &amp; Trade-offs
        </h3>
        <div className="flex flex-col gap-4">
          {tradeoffs.map((t) => (
            <div key={t.decision} className="border-l-2 border-[#E23744]/60 pl-4">
              <p className="text-sm font-semibold text-slate-200">{t.decision}</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-400">{t.why}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
