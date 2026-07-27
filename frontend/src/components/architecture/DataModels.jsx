/**
 * DataModels - ER-style viewer for the 5 MongoDB collections.
 * Cards act like ER entities; clicking one reveals its relationships.
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaDatabase, FaLink } from 'react-icons/fa';
import { models } from './archData';

export default function DataModels() {
  const [openModel, setOpenModel] = useState(models[0].name);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Data models">
        {models.map((m) => (
          <button
            key={m.name}
            type="button"
            role="tab"
            aria-selected={openModel === m.name}
            onClick={() => setOpenModel(m.name)}
            className={`flex items-center gap-2 rounded-full border px-4 py-1.5 font-mono text-sm transition-colors ${
              openModel === m.name
                ? 'border-transparent bg-[#E23744] text-white'
                : 'border-slate-700 bg-slate-800/60 text-slate-300 hover:border-slate-500'
            }`}
          >
            <FaDatabase className="h-3 w-3" aria-hidden="true" />
            {m.name}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {models
          .filter((m) => m.name === openModel)
          .map((m) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="grid gap-6 lg:grid-cols-[1fr_320px]"
            >
              {/* Entity table */}
              <div className="overflow-hidden rounded-xl border border-slate-700">
                <div className="flex items-center justify-between border-b border-slate-700 bg-slate-900 px-4 py-3">
                  <h3 className="font-mono text-sm font-bold text-slate-100">{m.name}</h3>
                  <span className="font-mono text-xs text-slate-500">db.{m.collection}</span>
                </div>
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900/50 font-mono text-xs uppercase tracking-wider text-slate-500">
                      <th scope="col" className="px-4 py-2">Field</th>
                      <th scope="col" className="px-4 py-2">Type</th>
                      <th scope="col" className="hidden px-4 py-2 sm:table-cell">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {m.fields.map((f) => (
                      <tr key={f.name} className="border-b border-slate-800/60 last:border-0">
                        <td className="px-4 py-2 font-mono text-xs text-slate-200">{f.name}</td>
                        <td className="px-4 py-2 font-mono text-xs text-emerald-400">{f.type}</td>
                        <td className="hidden px-4 py-2 text-xs text-slate-400 sm:table-cell">{f.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Relations */}
              <div className="rounded-xl border border-slate-700 bg-slate-900 p-5 lg:self-start">
                <p className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-slate-500">
                  <FaLink className="h-3 w-3" aria-hidden="true" /> Relationships
                </p>
                <ul className="flex flex-col gap-2.5">
                  {m.relations.map((r) => (
                    <li key={r} className="flex gap-2 text-sm leading-relaxed text-slate-300">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#E23744]" aria-hidden="true" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
      </AnimatePresence>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <p className="mb-2 font-mono text-xs uppercase tracking-widest text-slate-500">Design note</p>
        <p className="text-sm leading-relaxed text-slate-400">
          Orders embed <span className="font-mono text-emerald-400">shopOrders[]</span> sub-documents
          so a single checkout spanning multiple shops writes atomically and reads without joins.
          Item prices are snapshotted into{' '}
          <span className="font-mono text-emerald-400">shopOrderItems[]</span> at purchase time, so
          later menu edits never mutate historical orders. Geo queries rely on 2dsphere indexes on{' '}
          <span className="font-mono text-emerald-400">User.location</span> and{' '}
          <span className="font-mono text-emerald-400">Shop.location</span>.
        </p>
      </div>
    </div>
  );
}
