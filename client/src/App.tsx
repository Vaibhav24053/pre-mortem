import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  Check,
  RotateCcw,
  ScanSearch,
  Terminal,
  X,
} from 'lucide-react';

type View = 'landing' | 'intake' | 'loading' | 'report' | 'failed';
type Severity = 'critical' | 'high' | 'medium' | 'low';

type Risk = {
  id: string;
  severity: Severity;
  title: string;
  summary: string;
  evidence: string;
  mitigation: string;
};

type ApiResult = {
  slug: string;
  summary: string;
  risks: Risk[];
};

const API_URL = 'https://pre-mortem.onrender.com';

const steps = [
  'Parsing the claim and extracting the real buyer',
  'Testing the workflow against market reality',
  'Comparing substitutes, incumbents, and switching cost',
  'Stress-testing the path to repeatable distribution',
  'Ranking failure modes by impact and proximity',
];

const initialIdea = '';

const severityLabel: Record<Severity, string> = {
  critical: 'CRITICAL',
  high: 'HIGH',
  medium: 'MEDIUM',
  low: 'LOW',
};

const stampVariants = {
  hidden: { opacity: 0, scale: 2, rotate: -24 },
  visible: { opacity: 1, scale: 1, rotate: -8, transition: { type: 'spring' as const, stiffness: 420, damping: 13 } },
};

function Header({ view, onReset }: { view: View; onReset: () => void }) {
  return (
    <header className="header-bar">
      <button className="brand-lockup" onClick={onReset} data-testid="button-brand-reset" aria-label="Return to start">
        <span className="brand-mark" aria-hidden="true" />
        <span className="brand-name">PRE-MORTEM / FIELD OFFICE</span>
      </button>
      <div className="header-meta">
        <span className="hide-mobile">CASEWORK // {view === 'landing' ? 'STANDBY' : 'ACTIVE'}</span>
        <span><i className="status-dot" />LOCAL SESSION</span>
      </div>
    </header>
  );
}

function Landing({ onBegin }: { onBegin: () => void }) {
  const reduceMotion = useReducedMotion();
  return (
    <main className="hero-grid">
      <section>
        <motion.div
          className="hero-kicker"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.35 }}
        >
          PRIVATE INTELLIGENCE / IDEA TRIAGE
        </motion.div>
        <h1 className="hero-title" aria-label="Pre-Mortem">
          <span className="hero-title-line">
            <span>PRE-</span>
            <motion.span className="redaction-cover" initial={{ scaleX: 1 }} animate={{ scaleX: 0 }} transition={{ duration: reduceMotion ? 0.05 : 0.85, delay: reduceMotion ? 0 : 0.35, ease: [0.7, 0, 0.3, 1] }} />
          </span>
          <span className="hero-title-line">
            <span>MORTEM</span>
            <motion.span className="redaction-cover" initial={{ scaleX: 1 }} animate={{ scaleX: 0 }} transition={{ duration: reduceMotion ? 0.05 : 0.85, delay: reduceMotion ? 0 : 0.55, ease: [0.7, 0, 0.3, 1] }} />
          </span>
        </h1>
        <motion.p className="hero-subtitle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: reduceMotion ? 0 : 1.1 }}>
          A structured interrogation of the idea before the market gets to it. <em>Specific ranked risks. No applause.</em>
        </motion.p>
        <motion.div className="hero-actions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduceMotion ? 0 : 1.25 }}>
          <button className="primary-button" onClick={onBegin} data-testid="button-begin-case">
            OPEN A CASE <ArrowRight size={15} />
          </button>
          <span className="mono" style={{ color: '#756e63', fontSize: 10 }}>~10 SEC / AI-POWERED / PRIVATE</span>
        </motion.div>
      </section>
      <motion.aside className="hero-evidence" initial={{ opacity: 0, x: 25 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: reduceMotion ? 0 : 0.7, duration: reduceMotion ? 0 : 0.55 }}>
        <div className="evidence-sheet back" aria-hidden="true" />
        <div className="evidence-sheet front">
          <span className="sheet-tab">CASE FILE / 001</span>
          <div className="sheet-row"><span>METHOD</span><span>ADVERSARIAL READ</span></div>
          <div className="sheet-row"><span>OUTPUT</span><span>RANKED FINDINGS</span></div>
          <div className="sheet-row"><span>DEFAULT</span><span>NOT ENCOURAGEMENT</span></div>
          <p className="sheet-fine">The useful answer is usually hiding behind the founder's first explanation.</p>
          <span className="stamp">CLASSIFIED</span>
        </div>
      </motion.aside>
    </main>
  );
}

function Intake({ idea, setIdea, onAnalyze, onFailure }: { idea: string; setIdea: (value: string) => void; onAnalyze: () => void; onFailure: () => void }) {
  return (
    <main className="intake-wrap">
      <div className="intake-header">
        <div>
          <div className="document-kicker">INTAKE DOCUMENT / FOUNDER SUBMISSION</div>
          <h1 className="page-title">Put the idea<br />on the table.</h1>
          <p className="page-deck">No pitch deck. No positioning exercise. Give the case file the version you would say to a smart stranger over coffee.</p>
        </div>
        <div className="file-tag">FILE STATUS: OPEN</div>
      </div>
      <div className="intake-layout">
        <form className="intake-form" onSubmit={(event) => { event.preventDefault(); onAnalyze(); }}>
          <span className="clip" aria-hidden="true" />
          <div className="form-inner">
            <h2 className="form-title">Founder intake / working theory</h2>
            <p className="form-instruction">Describe what you want to build, who it is for, and the change you believe it creates. Rough is useful.</p>
            <label className="form-label" htmlFor="idea-input">THE IDEA, IN YOUR WORDS</label>
            <textarea id="idea-input" className="idea-textarea" value={idea} onChange={(event) => setIdea(event.target.value)} data-testid="input-startup-idea" aria-describedby="idea-count" placeholder="e.g. A vertical SaaS product that helps independent clinics automate insurance verification, reduce no-shows, and keep their front desk out of spreadsheets." />
            <div className="form-footer">
              <span className="character-count" id="idea-count" data-testid="text-idea-character-count">{idea.length} CHARACTERS / {idea.length >= 20 ? 'READY FOR READ' : 'NEEDS CONTENT'}</span>
              <button className="form-submit" type="submit" disabled={idea.trim().length < 20} data-testid="button-run-analysis">
                RUN THE PRE-MORTEM <ScanSearch size={15} />
              </button>
            </div>
          </div>
        </form>
        <aside className="form-side">
          <h2 className="side-heading">WHAT HAPPENS NEXT</h2>
          <ul className="side-list">
            <li><span>THE READ</span>We separate the claim from the operating reality.</li>
            <li><span>THE PRESSURE TEST</span>We look for buyer friction, substitutes, and distribution drag.</li>
            <li><span>THE FILE</span>You get the risks most likely to matter first.</li>
          </ul>
          <p className="intake-note"><strong>AI-POWERED.</strong><br />This case is sent to GPT-4o for a real adversarial read, then saved to your case file database.</p>
          <button className="text-button" onClick={onFailure} data-testid="button-preview-failure">Preview redacted failure state</button>
        </aside>
      </div>
    </main>
  );
}

function Loading({ activeStep }: { activeStep: number }) {
  const reduceMotion = useReducedMotion();
  const typedTarget = steps[Math.min(activeStep, steps.length - 1)];
  const [typed, setTyped] = useState('');
  useEffect(() => {
    setTyped('');
    let cursor = 0;
    const timer = window.setInterval(() => {
      cursor += 1;
      setTyped(typedTarget.slice(0, cursor));
      if (cursor >= typedTarget.length) window.clearInterval(timer);
    }, reduceMotion ? 1 : 25);
    return () => window.clearInterval(timer);
  }, [activeStep, reduceMotion, typedTarget]);
  return (
    <main className="loading-wrap">
      <section className="loading-panel" aria-live="polite">
        <div className="loading-top">
          <div>
            <div className="document-kicker">ANALYSIS IN PROGRESS</div>
            <h1 className="loading-title">Assembling the file.</h1>
          </div>
          <span className="loading-progress" data-testid="status-analysis-progress">{Math.min(activeStep, steps.length)} / {steps.length}</span>
        </div>
        <div className="progress-track"><motion.div className="progress-fill" animate={{ scaleX: Math.max(activeStep / steps.length, .03) }} transition={{ type: 'spring', stiffness: 100, damping: 18 }} /></div>
        <div>
          {steps.map((step, index) => {
            const complete = index < activeStep;
            const active = index === activeStep && activeStep < steps.length;
            return (
              <div className={`analysis-step ${active ? 'active' : ''} ${complete ? 'completed' : ''}`} key={step}>
                <span className="step-number">{String(index + 1).padStart(2, '0')}</span>
                <span className="step-copy" data-testid={`text-analysis-step-${index + 1}`}>{active ? typed : complete ? step : 'Awaiting clearance...' }{active && <span className="cursor" />}</span>
                <AnimatePresence>
                  {complete && (
                    <motion.span className="verified-stamp" variants={stampVariants} initial="hidden" animate="visible" data-testid={`status-verified-${index + 1}`}>
                      <Check size={12} strokeWidth={3} /> VERIFIED
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
        <div className="loading-footnote"><span><Terminal size={11} style={{ verticalAlign: '-2px' }} /> LIVE GPT-4O CONNECTION</span><span>DO NOT OPTIMIZE FOR COMFORT</span></div>
      </section>
    </main>
  );
}

type DetectiveMood = 'idle' | 'working' | 'alarm' | 'relieved';

function Detective({ mood }: { mood: DetectiveMood }) {
  const [showNote, setShowNote] = useState(false);
  const reduceMotion = useReducedMotion();
  const note =
    mood === 'alarm'
      ? 'That is not ideal.'
      : mood === 'working'
        ? 'Still assembling the file.'
        : mood === 'relieved'
          ? "I've seen worse."
          : 'Another one for the file.';

  return (
    <motion.div
      className="detective-dock"
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 360, damping: 24, delay: 0.7 }}
      data-testid="detective-companion"
    >
      <AnimatePresence>
        {showNote ? (
          <motion.div
            className="detective-note"
            initial={{ opacity: 0, y: 5, rotate: -2, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, rotate: -2, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ duration: reduceMotion ? 0 : 0.16 }}
            role="note"
          >
            {note}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.div
        className={`detective detective--${mood}`}
        tabIndex={0}
        role="img"
        aria-label={`Case file detective, ${mood} reaction`}
        onMouseEnter={() => setShowNote(true)}
        onMouseLeave={() => setShowNote(false)}
        onFocus={() => setShowNote(true)}
        onBlur={() => setShowNote(false)}
        whileHover={reduceMotion ? undefined : { y: -3, rotate: -1 }}
        transition={{ duration: reduceMotion ? 0 : 0.18 }}
      >
        <motion.svg
          viewBox="0 0 120 150"
          aria-hidden="true"
          animate={reduceMotion ? undefined : mood === 'working' ? { x: [0, 2, 0] } : { y: [0, -1, 0] }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : mood === 'working'
              ? { duration: 1.6, repeat: Infinity, ease: 'easeInOut' }
              : { duration: 3.8, repeat: Infinity, ease: 'easeInOut' }
          }
        >
          <motion.g
            className="detective-paper"
            animate={reduceMotion ? undefined : mood === 'working' ? { rotate: [-4, 5, -4] } : { rotate: [-1, 1, -1] }}
            transition={{ duration: reduceMotion ? 0 : mood === 'working' ? 1.1 : 4.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <path d="M12 69 38 63 44 98 18 104Z" />
            <path className="detective-paper__line" d="m18 78 17-4M19 86l17-4M20 94l11-3" />
          </motion.g>
          <path className="detective-coat" d="M36 71 51 66l14 5 12 34-14 7-5-19-5 19-17-7Z" />
          <path className="detective-coat__lapel" d="m49 69 7 15 5-15M56 84l-4 21M61 84l4 21" />
          <path className="detective-arm" d="m68 74 13 15-7 6-13-14Z" />
          <circle className="detective-glass" cx="86" cy="94" r="11" />
          <path className="detective-glass__handle" d="m94 102 10 12" />
          <path className="detective-neck" d="M48 59h17v14H48Z" />
          <path className="detective-face" d="M40 36c0-12 9-20 20-20s20 8 20 20v19c0 9-9 17-20 17s-20-8-20-17Z" />
          <path className="detective-hat" d="M35 34c2-14 10-23 27-23 13 0 22 6 25 18l-7 5-7-8-35 11Z" />
          <path className="detective-hat__band" d="m38 32 45-9 3 7-46 10Z" />
          <path className="detective-hat__brim" d="M30 39c12-8 39-12 62-6-11 7-42 12-62 6Z" />
          <path
            className="detective-brow"
            d={mood === 'alarm' ? 'm48 43 7-3M64 40l7 3' : 'm48 42 7 1M64 43l7-1'}
          />
          <circle className="detective-eye" cx="53" cy="48" r="1.7" />
          <circle className="detective-eye" cx="68" cy="48" r="1.7" />
          <path className="detective-nose" d="m59 48-2 8 5 1" />
          <path className="detective-mouth" d={mood === 'alarm' ? 'm56 63q4-4 8 0' : 'm56 62q4 3 8 0'} />
          {mood === 'alarm' ? (
            <motion.path
              className="detective-sweat"
              d="M78 39c5 7 5 9 1 11-4-2-4-5-1-11Z"
              initial={reduceMotion ? { opacity: 0, y: 0 } : { opacity: 0, y: -2 }}
              animate={reduceMotion ? { opacity: 0, y: 0 } : { opacity: [0, 1, 0], y: [-2, 2, -2] }}
              transition={reduceMotion ? { duration: 0 } : { duration: 2.5, delay: 0.8, repeat: Infinity, repeatDelay: 2.6 }}
            />
          ) : null}
          <path className="detective-shoe" d="m39 108 17 0 2 8-22 0ZM62 108l15 0 7 8-22 0Z" />
        </motion.svg>
        <span className="detective-caption">CASE ASSISTANT</span>
      </motion.div>
    </motion.div>
  );
}

function RiskCard({ risk, index, selected }: { risk: Risk; index: number; selected: Severity | null }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.article
      className={`risk-card ${selected && selected !== risk.severity ? 'is-dimmed' : ''}`}
      initial={{ opacity: 0, y: -55, rotate: index % 2 === 0 ? -2.5 : 2.2 }}
      animate={{ opacity: 1, y: 0, rotate: index % 2 === 0 ? -1.2 : 1.1 }}
      transition={{ delay: reduceMotion ? 0 : index * .08, type: 'spring', stiffness: 260, damping: 18 }}
      whileHover={reduceMotion ? undefined : { y: -7, rotate: 0, transition: { type: 'spring', stiffness: 400, damping: 22 } }}
      data-testid={`card-risk-${risk.id}`}
    >
      <span className={`risk-edge ${risk.severity}`} />
      <span className="risk-pin" aria-hidden="true" />
      <div className="risk-meta">
        <span className={`severity-label ${risk.severity}`} data-testid={`status-severity-${risk.id}`}>{severityLabel[risk.severity]}</span>
        <span className="risk-id">{risk.id}</span>
      </div>
      <h3 className="risk-title" data-testid={`text-risk-title-${risk.id}`}>{risk.title}</h3>
      <p className="risk-summary">{risk.summary}</p>
      <div className="evidence-block">
        <span className="block-label">EVIDENCE / SIGNAL</span>
        <p data-testid={`text-risk-evidence-${risk.id}`}>{risk.evidence}</p>
      </div>
      <div className="mitigation">
        <span className="block-label">FIRST MITIGATION</span>
        <p>{risk.mitigation}</p>
      </div>
    </motion.article>
  );
}

function Report({ idea, result, onReset, onFailure }: { idea: string; result: ApiResult; onReset: () => void; onFailure: () => void }) {
  const [selected, setSelected] = useState<Severity | null>(null);
  const risks = result.risks;
  const counts = useMemo(() => risks.reduce<Record<Severity, number>>((res, risk) => {
    res[risk.severity] += 1;
    return res;
  }, { critical: 0, high: 0, medium: 0, low: 0 }), [risks]);
  return (
    <main className="report-wrap">
      <div className="report-head">
        <div>
          <div className="document-kicker">DECLASSIFIED CASE FILE / FINDINGS</div>
          <h1 className="report-title">The idea can work.<br /><em>Not like this.</em></h1>
        </div>
        <div className="report-ref">CASE REF <strong>{result.slug.toUpperCase()}</strong><br />READ COMPLETE / LIVE ANALYSIS</div>
      </div>
      <p className="page-deck" style={{ maxWidth: 670, marginTop: 21 }}>Working theory reviewed: <span style={{ color: '#ece7dc' }}>{idea}</span></p>
      <p className="page-deck" style={{ maxWidth: 670, marginTop: 10 }}>{result.summary}</p>
      <div className="summary-bar" aria-label="Severity summary">
        {(Object.keys(counts) as Severity[]).map((severity) => (
          <button key={severity} className={`summary-item ${severity} ${selected === severity ? 'is-selected' : ''}`} onClick={() => setSelected(selected === severity ? null : severity)} data-testid={`button-filter-${severity}`}>
            <span className="summary-number" data-testid={`text-count-${severity}`}>{counts[severity]}</span>
            <span className="summary-label">{severityLabel[severity]} FINDINGS</span>
          </button>
        ))}
      </div>
      <div className="report-section-head">
        <h2>Priority findings</h2>
        <span>{selected ? `SHOWING ${severityLabel[selected]} ONLY` : 'SELECT A SEVERITY TO TRACE THE FILE'}</span>
      </div>
      <div className="risk-grid">
        {risks.map((risk, index) => <RiskCard key={risk.id} risk={risk} index={index} selected={selected} />)}
      </div>
      <footer className="report-foot">
        <span data-testid="status-report-complete"><Check size={12} style={{ verticalAlign: '-2px', color: '#4a8a82' }} /> REPORT SEALED / {String(risks.length).padStart(2, '0')} FINDINGS INDEXED</span>
        <div className="report-actions">
          <button className="ghost-button" onClick={onFailure} data-testid="button-report-failure"><X size={14} /> REDACTED FAILURE PREVIEW</button>
          <button className="primary-button" onClick={onReset} data-testid="button-start-another"><RotateCcw size={14} /> START ANOTHER CASE</button>
        </div>
      </footer>
    </main>
  );
}

function Failed({ onRetry }: { onRetry: () => void }) {
  return (
    <main className="failure-wrap">
      <section className="failure-document" aria-live="assertive">
        <motion.div className="failure-stamp" initial={{ opacity: 0, scale: 1.3, rotate: -12 }} animate={{ opacity: 1, scale: 1, rotate: -5 }} transition={{ type: 'spring', stiffness: 300, damping: 17 }} data-testid="status-analysis-failed">
          REDACTED / FAILED
        </motion.div>
        <h1 className="failure-title">The file did not clear.</h1>
        <p className="failure-copy">The working theory could not be cleanly separated from its assumptions, or the connection to the analyst was lost. That is a useful signal, but not a finished analysis.</p>
        <button className="primary-button" onClick={onRetry} data-testid="button-retry-analysis"><RotateCcw size={14} /> RETURN TO INTAKE</button>
      </section>
    </main>
  );
}

function App() {
  const [view, setView] = useState<View>('landing');
  const [idea, setIdea] = useState(initialIdea);
  const [activeStep, setActiveStep] = useState(0);
  const [stepsDone, setStepsDone] = useState(false);
  const [apiResult, setApiResult] = useState<ApiResult | null>(null);
  const [apiError, setApiError] = useState(false);

  const detectiveMood: DetectiveMood =
    view === 'loading' || view === 'failed'
      ? 'working'
      : view === 'report' && apiResult
        ? apiResult.risks.some((risk) => risk.severity === 'critical')
          ? 'alarm'
          : apiResult.risks.some((risk) => risk.severity === 'high')
            ? 'idle'
            : apiResult.risks.some((risk) => risk.severity === 'low')
              ? 'relieved'
              : 'idle'
        : 'idle';

  const reset = () => {
    setView('landing');
    setActiveStep(0);
    setStepsDone(false);
    setApiResult(null);
    setApiError(false);
  };

  const begin = () => setView('intake');

  const runAnalysis = async () => {
    setActiveStep(0);
    setStepsDone(false);
    setApiResult(null);
    setApiError(false);
    setView('loading');

    try {
      const res = await fetch(`${API_URL}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const mappedRisks: Risk[] = data.report.risks.map((r: any, i: number) => ({
        id: `R-${String(i + 1).padStart(2, '0')}`,
        severity: (r.severity as Severity) || 'medium',
        title: r.title,
        summary: r.description,
        evidence: r.evidence || r.description,
        mitigation: r.mitigation,
      }));

      setApiResult({ slug: data.slug, summary: data.report.summary, risks: mappedRisks });
    } catch (err) {
      console.error('Analysis failed:', err);
      setApiError(true);
    }
  };

  // Cosmetic step ticker
  useEffect(() => {
    if (view !== 'loading') return;
    if (activeStep < steps.length) {
      const timer = window.setTimeout(() => setActiveStep((step) => step + 1), 1120);
      return () => window.clearTimeout(timer);
    }
    setStepsDone(true);
  }, [activeStep, view]);

  // Transition once BOTH the step animation and the real API call have finished
  useEffect(() => {
    if (!stepsDone) return;
    if (apiError) {
      setView('failed');
      return;
    }
    if (apiResult) {
      setView('report');
    }
  }, [stepsDone, apiResult, apiError]);

  return (
    <div className={`app-shell app-shell--${view}`}>
      <Header view={view} onReset={reset} />
      <AnimatePresence mode="wait">
        <motion.div key={view} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .18 }}>
          {view === 'landing' && <Landing onBegin={begin} />}
          {view === 'intake' && <Intake idea={idea} setIdea={setIdea} onAnalyze={runAnalysis} onFailure={() => setView('failed')} />}
          {view === 'loading' && <Loading activeStep={activeStep} />}
          {view === 'report' && apiResult && <Report idea={idea} result={apiResult} onReset={reset} onFailure={() => setView('failed')} />}
          {view === 'failed' && <Failed onRetry={() => setView('intake')} />}
        </motion.div>
      </AnimatePresence>
      <Detective mood={detectiveMood} />
      <div style={{ position: 'fixed', bottom: 18, left: 20, color: '#5f5a52', font: '9px var(--app-font-mono)', zIndex: 22 }}>
        PRE-MORTEM / 2026 / EYES OPEN
      </div>
    </div>
  );
}

export default App;
