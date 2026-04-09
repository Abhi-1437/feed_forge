import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import Button from '../ui/Button'

export default function SummaryPanel({
  summary,
  loading,
  error,
  sourceUrl,
  onGenerate,
}) {
  const [expanded, setExpanded] = useState(true)

  return (
    <section className="glass-card rounded-[30px] p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-orange-200">AI Summary</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Condense the article into key takeaways</h2>
        </div>
        <div className="flex gap-3">
          <Button type="button" variant="secondary" onClick={() => setExpanded((value) => !value)}>
            {expanded ? 'Collapse' : 'Expand'}
          </Button>
          <Button type="button" onClick={onGenerate} disabled={loading} className="sm:min-w-[190px]">
            {loading ? 'Generating...' : 'Generate Summary'}
          </Button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${expanded}-${loading ? 'loading' : summary ? 'summary' : error ? 'error' : 'idle'}`}
          initial={{ opacity: 0, y: 10, height: 0 }}
          animate={{ opacity: expanded ? 1 : 0, y: expanded ? 0 : -8, height: expanded ? 'auto' : 0 }}
          exit={{ opacity: 0, y: -10, height: 0 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className="overflow-hidden"
        >
          <div className="mt-5 rounded-[24px] border border-white/10 bg-slate-950/35 p-5">
            {loading && (
              <div className="space-y-3">
                <div className="h-4 w-40 rounded-full shimmer" />
                <div className="h-4 w-full rounded-full shimmer" />
                <div className="h-4 w-5/6 rounded-full shimmer" />
                <div className="h-4 w-4/6 rounded-full shimmer" />
              </div>
            )}

            {!loading && error && <p className="text-sm leading-6 text-rose-200">{error}</p>}

            {!loading && !error && !summary && (
              <p className="text-sm leading-6 text-slate-400">
                Generate an AI summary to get the gist quickly before diving into the full article.
              </p>
            )}

            {!loading && !error && summary && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-emerald-100">
                    Summary ready
                  </span>
                  {sourceUrl && (
                    <a
                      href={sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-medium text-orange-200 transition hover:text-white"
                    >
                      Read original article
                    </a>
                  )}
                </div>
                <p className="text-sm leading-7 text-slate-300">{summary}</p>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  )
}
