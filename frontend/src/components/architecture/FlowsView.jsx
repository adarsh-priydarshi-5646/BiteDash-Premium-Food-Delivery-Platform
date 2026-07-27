/**
 * FlowsView - Sequence-style timelines for the key end-to-end flows,
 * plus the Express middleware pipeline (LLD request lifecycle).
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import { flows, middlewarePipeline } from './archData';

const actorColors = {
  Customer: 'text-sky-400 border-sky-500/40',
  'React SPA': 'text-sky-400 border-sky-500/40',
  User: 'text-sky-400 border-sky-500/40',
  Express: 'text-emerald-400 border-emerald-500/40',
  'isAuth middleware': 'text-emerald-400 border-emerald-500/40',
  'Socket.IO': 'text-amber-400 border-amber-500/40',
  'Delivery Engine': 'text-[#E23744] border-[#E23744]/40',
  Owner: 'text-[#E23744] border-[#E23744]/40',
  Partner: 'text-amber-400 border-amber-500/40',
  Partners: 'text-amber-400 border-amber-500/40',
  'Partner + Customer': 'text-amber-400 border-amber-500/40',
  Stripe: 'text-emerald-400 border-emerald-500/40',
  'Race guard': 'text-[#E23744] border-[#E23744]/40',
  System: 'text-slate-300 border-slate-500/40',
  'Forgot password': 'text-slate-300 border-slate-500/40',
};

export default function FlowsView() {
  const [activeFlow, setActiveFlow] = useState(flows[0].id);
  const flow = flows.find((f) => f.id === activeFlow);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="System flows">
        {flows.map((f) => (
          <button
            key={f.id}
            type="button"
            role="tab"
            aria-selected={activeFlow === f.id}
            onClick={() => setActiveFlow(f.id)}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              activeFlow === f.id
                ? 'border-transparent bg-[#E23744] text-white'
                : 'border-slate-700 bg-slate-800/60 text-slate-300 hover:border-slate-500'
            }`}
          >
            {f.name}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={flow.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
          className="rounded-xl border border-slate-700 bg-slate-900 p-5"
        >
          <p className="mb-5 text-sm text-slate-400">{flow.summary}</p>
          <ol className="relative flex flex-col gap-0">
            {flow.steps.map((step, i) => (
              <li key={i} className="relative flex gap-4 pb-5 last:pb-0">
                {/* timeline rail */}
                {i < flow.steps.length - 1 && (
                  <span
                    className="absolute left-[15px] top-8 h-full w-px bg-slate-700"
                    aria-hidden="true"
                  />
                )}
                <span className="z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-600 bg-slate-800 font-mono text-xs font-bold text-slate-300">
                  {i + 1}
                </span>
                <div className="flex min-w-0 flex-col gap-1 pt-1">
                  <span
                    className={`w-fit rounded border bg-slate-950/60 px-2 py-0.5 font-mono text-[11px] font-semibold ${
                      actorColors[step.actor] || 'text-slate-300 border-slate-500/40'
                    }`}
                  >
                    {step.actor}
                  </span>
                  <p className="text-sm leading-relaxed text-slate-300">{step.action}</p>
                </div>
              </li>
            ))}
          </ol>
        </motion.div>
      </AnimatePresence>

      {/* Middleware pipeline */}
      <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">
        <h3 className="mb-1 font-bold text-slate-100">Request Lifecycle — Middleware Pipeline</h3>
        <p className="mb-4 text-sm text-slate-500">
          Every HTTP request passes through this exact chain before reaching business logic.
        </p>
        <div className="flex flex-wrap items-stretch gap-2">
          {middlewarePipeline.map((mw, i) => (
            <div key={mw.name} className="flex items-center gap-2">
              <div className="flex h-full min-w-[150px] flex-col justify-center gap-1 rounded-lg border border-slate-700 bg-slate-800/60 p-3">
                <span className="font-mono text-xs font-semibold text-emerald-400">{mw.name}</span>
                <span className="text-[11px] leading-snug text-slate-400">{mw.desc}</span>
              </div>
              {i < middlewarePipeline.length - 1 && (
                <FaArrowRight className="h-3 w-3 shrink-0 text-slate-600" aria-hidden="true" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
