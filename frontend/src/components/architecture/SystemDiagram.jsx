/**
 * SystemDiagram - Interactive HLD diagram.
 * Layered flexbox layout; clicking a node opens a detail panel and
 * highlights its downstream connections.
 */
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaArrowRight, FaArrowDown } from 'react-icons/fa';
import { layers } from './archData';

const allNodes = layers.flatMap((l) => l.nodes);

export default function SystemDiagram() {
  const [selectedId, setSelectedId] = useState(null);

  const selected = useMemo(
    () => allNodes.find((n) => n.id === selectedId) || null,
    [selectedId]
  );

  const highlighted = useMemo(() => {
    if (!selected) return new Set();
    const set = new Set([selected.id, ...selected.connectsTo]);
    // also highlight nodes that connect INTO the selected node
    allNodes.forEach((n) => {
      if (n.connectsTo.includes(selected.id)) set.add(n.id);
    });
    return set;
  }, [selected]);

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      {/* Diagram */}
      <div className="flex-1 flex flex-col gap-2" role="group" aria-label="System architecture diagram">
        {layers.map((layer, li) => (
          <div key={layer.id} className="flex flex-col gap-2">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <p className="mb-3 font-mono text-xs uppercase tracking-widest text-slate-500">
                {layer.name}
              </p>
              <div className="flex flex-wrap gap-3">
                {layer.nodes.map((node) => {
                  const isSelected = selectedId === node.id;
                  const isHighlighted = highlighted.has(node.id);
                  const dimmed = selected && !isHighlighted;
                  return (
                    <button
                      key={node.id}
                      type="button"
                      onClick={() => setSelectedId(isSelected ? null : node.id)}
                      aria-pressed={isSelected}
                      className={`group flex min-w-[180px] flex-1 flex-col items-start gap-1 rounded-lg border p-3 text-left transition-all duration-200 ${
                        isSelected
                          ? 'border-[#E23744] bg-[#E23744]/10 shadow-[0_0_20px_rgba(226,55,68,0.25)]'
                          : isHighlighted
                          ? 'border-emerald-500/60 bg-emerald-500/5'
                          : 'border-slate-700 bg-slate-800/60 hover:border-slate-500'
                      } ${dimmed ? 'opacity-40' : 'opacity-100'}`}
                    >
                      <span className="text-sm font-semibold text-slate-100">
                        {node.name}
                      </span>
                      <span className="font-mono text-[11px] leading-relaxed text-slate-400">
                        {node.tech}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            {li < layers.length - 1 && (
              <div className="flex justify-center" aria-hidden="true">
                <FaArrowDown className="h-3 w-3 text-slate-600" />
              </div>
            )}
          </div>
        ))}
        <p className="mt-1 text-center font-mono text-xs text-slate-500">
          Click any node to inspect its responsibilities and connections
        </p>
      </div>

      {/* Detail panel */}
      <AnimatePresence mode="wait">
        {selected && (
          <motion.aside
            key={selected.id}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 16 }}
            transition={{ duration: 0.18 }}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 p-5 lg:w-96 lg:self-start lg:sticky lg:top-24"
            aria-label={`Details for ${selected.name}`}
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-100">{selected.name}</h3>
                <p className="mt-0.5 font-mono text-xs text-[#E23744]">{selected.tech}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                aria-label="Close details"
              >
                <FaTimes className="h-4 w-4" />
              </button>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-slate-300">{selected.role}</p>
            <ul className="flex flex-col gap-2">
              {selected.details.map((d) => (
                <li key={d} className="flex gap-2 text-sm leading-relaxed text-slate-400">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" aria-hidden="true" />
                  {d}
                </li>
              ))}
            </ul>
            {selected.connectsTo.length > 0 && (
              <div className="mt-4 border-t border-slate-800 pt-3">
                <p className="mb-2 font-mono text-xs uppercase tracking-widest text-slate-500">
                  Connects to
                </p>
                <div className="flex flex-wrap gap-2">
                  {selected.connectsTo.map((id) => {
                    const target = allNodes.find((n) => n.id === id);
                    if (!target) return null;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setSelectedId(id)}
                        className="flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 font-mono text-xs text-emerald-400 hover:bg-emerald-500/20"
                      >
                        {target.name}
                        <FaArrowRight className="h-2.5 w-2.5" aria-hidden="true" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}
