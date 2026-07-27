/**
 * ApiExplorer - Grouped, expandable API reference plus the Socket.IO
 * event protocol table. Data sourced from backend/routes/*.js.
 */
import { useState } from 'react';
import { FaChevronDown, FaLock, FaLockOpen, FaBolt } from 'react-icons/fa';
import { apiGroups, socketEvents } from './archData';

const methodStyles = {
  GET: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  POST: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
  PUT: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  DELETE: 'bg-[#E23744]/15 text-[#E23744] border-[#E23744]/30',
};

export default function ApiExplorer() {
  const [open, setOpen] = useState(() => new Set([apiGroups[0].name]));

  const toggle = (name) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        {apiGroups.map((group) => {
          const isOpen = open.has(group.name);
          return (
            <div key={group.name} className="overflow-hidden rounded-xl border border-slate-700">
              <button
                type="button"
                onClick={() => toggle(group.name)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-3 bg-slate-900 px-4 py-3 text-left hover:bg-slate-800/80"
              >
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="font-bold text-slate-100">{group.name}</span>
                  <span className="font-mono text-xs text-[#E23744]">{group.base}</span>
                  <span className="hidden font-mono text-xs text-slate-500 md:inline">{group.file}</span>
                </div>
                <span className="flex items-center gap-2">
                  <span className="font-mono text-xs text-slate-500">{group.endpoints.length} endpoints</span>
                  <FaChevronDown
                    className={`h-3 w-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  />
                </span>
              </button>
              {isOpen && (
                <ul className="divide-y divide-slate-800/70 bg-slate-950/40">
                  {group.endpoints.map((ep) => (
                    <li key={`${ep.method}-${ep.path}`} className="flex flex-wrap items-center gap-3 px-4 py-2.5">
                      <span
                        className={`w-16 rounded border px-1.5 py-0.5 text-center font-mono text-[11px] font-bold ${methodStyles[ep.method]}`}
                      >
                        {ep.method}
                      </span>
                      <code className="font-mono text-xs text-slate-200">{ep.path}</code>
                      {ep.auth ? (
                        <span className="flex items-center gap-1 font-mono text-[10px] text-amber-400" title="Requires JWT (isAuth)">
                          <FaLock className="h-2.5 w-2.5" aria-hidden="true" /> isAuth
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 font-mono text-[10px] text-slate-500" title="Public route">
                          <FaLockOpen className="h-2.5 w-2.5" aria-hidden="true" /> public
                        </span>
                      )}
                      {ep.notes && (
                        <span className="min-w-0 flex-1 text-right text-xs text-slate-500">{ep.notes}</span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      {/* Socket protocol */}
      <div className="overflow-hidden rounded-xl border border-slate-700">
        <div className="flex items-center gap-2 border-b border-slate-700 bg-slate-900 px-4 py-3">
          <FaBolt className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
          <h3 className="font-bold text-slate-100">Socket.IO Event Protocol</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50 font-mono text-xs uppercase tracking-wider text-slate-500">
                <th scope="col" className="px-4 py-2">Event</th>
                <th scope="col" className="px-4 py-2">Direction</th>
                <th scope="col" className="px-4 py-2">Payload</th>
                <th scope="col" className="px-4 py-2">Purpose</th>
              </tr>
            </thead>
            <tbody>
              {socketEvents.map((ev) => (
                <tr key={ev.name} className="border-b border-slate-800/60 last:border-0">
                  <td className="whitespace-nowrap px-4 py-2 font-mono text-xs text-emerald-400">{ev.name}</td>
                  <td className="whitespace-nowrap px-4 py-2 font-mono text-xs text-slate-400">{ev.dir}</td>
                  <td className="whitespace-nowrap px-4 py-2 font-mono text-xs text-slate-300">{ev.payload}</td>
                  <td className="px-4 py-2 text-xs text-slate-400">{ev.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
