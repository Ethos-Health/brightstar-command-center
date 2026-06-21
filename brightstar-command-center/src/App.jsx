import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import { INITIAL_TASKS, MILESTONES, CATEGORIES, OPENING_DATE } from './data';

const PRI_COLOR = { high: '#E24B4A', med: '#BA7517', low: '#639922' };
const TODAY = new Date(); TODAY.setHours(0, 0, 0, 0);

function daysTo(d) { return Math.ceil((new Date(d) - TODAY) / 86400000); }
function fmt(d)    { return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); }

function DuePill({ due, done }) {
  if (done) return <span className="pill p-done">done</span>;
  const n = daysTo(due), lbl = fmt(due);
  const cls = n < 0 ? 'p-over' : n <= 4 ? 'p-urg' : n <= 14 ? 'p-soon' : 'p-late';
  return <span className={`pill ${cls}`}>{lbl}</span>;
}

function MsBadge({ date }) {
  const n = daysTo(date);
  if (n < 0)  return <span className="ms-badge">passed</span>;
  if (n === 0) return <span className="ms-badge" style={{color:'var(--teal)'}}>today!</span>;
  return <span className="ms-badge">{n} days</span>;
}

export default function App() {
  const [tasks,   setTasks]   = useState(() => {
    try { const s = localStorage.getItem('bsc_tasks'); return s ? JSON.parse(s) : INITIAL_TASKS; }
    catch { return INITIAL_TASKS; }
  });
  const [checked, setChecked] = useState(() => {
    try { const s = localStorage.getItem('bsc_checked'); return s ? JSON.parse(s) : {}; }
    catch { return {}; }
  });
  const [filter,  setFilter]  = useState('all');
  const [newName, setNewName] = useState('');
  const [newDue,  setNewDue]  = useState('');
  const [newCat,  setNewCat]  = useState('ops');
  const [newPri,  setNewPri]  = useState('med');
  const [saveNote,setSaveNote]= useState('');

  const persist = useCallback((c, t) => {
    try {
      localStorage.setItem('bsc_checked', JSON.stringify(c));
      localStorage.setItem('bsc_tasks',   JSON.stringify(t));
      setSaveNote('Saved ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch { setSaveNote('Storage full'); }
  }, []);

  function toggle(id) {
    const nc = { ...checked, [id]: !checked[id] };
    setChecked(nc); persist(nc, tasks);
  }

  function addTask() {
    if (!newName.trim() || !newDue) return;
    const nt = [...tasks, { id: Date.now(), name: newName.trim(), due: newDue, cat: newCat, pri: newPri }];
    setTasks(nt); persist(checked, nt);
    setNewName(''); setNewDue('');
  }

  function clearDone() {
    const ids = Object.keys(checked).filter(k => checked[k]).map(Number);
    const nt = tasks.filter(t => !ids.includes(t.id));
    setTasks(nt); setChecked({}); persist({}, nt);
  }

  const visible = filter === 'all' ? tasks : tasks.filter(t => t.cat === filter);
  const groups  = {};
  visible.forEach(t => {
    const n = daysTo(t.due);
    const g = n < 0 ? 'Overdue' : n <= 7 ? 'This week' : n <= 21 ? 'This month' : 'Coming up';
    (groups[g] = groups[g] || []).push(t);
  });

  const doneN  = Object.values(checked).filter(Boolean).length;
  const total  = tasks.length;
  const pct    = total ? Math.round(doneN / total * 100) : 0;
  const urgN   = tasks.filter(t => !checked[t.id] && daysTo(t.due) >= 0 && daysTo(t.due) <= 5).length;
  const daysLeft = daysTo(OPENING_DATE);

  return (
    <div className="layout">

      {/* ── Header ── */}
      <div className="topbar">
        <div className="topbar-left">
          <div className="logo-dot"><i className="ti ti-star" aria-hidden="true" /></div>
          <div>
            <div className="topbar-title">BrightStar Care · Shoreline–Mill Creek</div>
            <div className="topbar-sub">Owner command center · July 10, 2026 grand opening</div>
          </div>
        </div>
        {saveNote && <div className="save-pill"><i className="ti ti-check" aria-hidden="true" /> {saveNote}</div>}
      </div>

      {/* ── Stats ── */}
      <div className="stats">
        <div className="stat">
          <div className="stat-val teal">{daysLeft}</div>
          <div className="stat-lbl">Days to opening</div>
          <div className="stat-sub">July 10, 2026</div>
        </div>
        <div className="stat">
          <div className="stat-val">{doneN}</div>
          <div className="stat-lbl">Tasks complete</div>
          <div className="stat-sub">of {total} total</div>
        </div>
        <div className="stat">
          <div className="stat-val">{urgN}</div>
          <div className="stat-lbl">Due this week</div>
          <div className="stat-sub">next 5 days</div>
        </div>
        <div className="stat">
          <div className="stat-val">3</div>
          <div className="stat-lbl">Key milestones</div>
          <div className="stat-sub">Jun 1 · Jun 15 · Jul 10</div>
        </div>
      </div>

      {/* ── Milestones ── */}
      <div className="card">
        <div className="card-title">Key milestones</div>
        {MILESTONES.map(m => (
          <div className="ms-row" key={m.date}>
            <div className="ms-dot" style={{ background: m.color }} />
            <div className="ms-lbl">{m.label}</div>
            <div className="ms-date">{fmt(m.date)}</div>
            <MsBadge date={m.date} />
          </div>
        ))}
        <div className="divider" style={{ margin: '12px 0 10px' }} />
        <div className="prog-row">
          <span>Overall progress</span>
          <span>{pct}% · {doneN} of {total} tasks</span>
        </div>
        <div className="prog-track">
          <div className="prog-fill" style={{ width: pct + '%' }} />
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="filters">
        {CATEGORIES.map(c => (
          <button key={c} className={`fbtn${filter === c ? ' on' : ''}`} onClick={() => setFilter(c)}>
            {c === 'all' ? 'All tasks' : c}
          </button>
        ))}
      </div>

      {/* ── Task list ── */}
      {['Overdue', 'This week', 'This month', 'Coming up'].map(g => {
        if (!groups[g] || !groups[g].length) return null;
        return (
          <React.Fragment key={g}>
            <div className="sec-lbl">{g}</div>
            {groups[g].map(t => (
              <div key={t.id} className={`task${checked[t.id] ? ' done' : ''}`}>
                <div
                  className={`chk${checked[t.id] ? ' on' : ''}`}
                  onClick={() => toggle(t.id)}
                  role="checkbox"
                  aria-checked={!!checked[t.id]}
                  aria-label="Mark complete"
                >
                  {checked[t.id] && <span className="chk-tick">✓</span>}
                </div>
                <div>
                  <div className="tname">
                    <span className="pdot" style={{ background: PRI_COLOR[t.pri], marginRight: 6 }} />
                    {t.name}
                  </div>
                  <div className="tmeta">
                    <span className="tcat">{t.cat}</span>
                  </div>
                </div>
                <DuePill due={t.due} done={!!checked[t.id]} />
              </div>
            ))}
          </React.Fragment>
        );
      })}

      {visible.length === 0 && (
        <div className="empty">No tasks in this category yet.</div>
      )}

      {/* ── Add task ── */}
      <div className="add-card">
        <div className="card-title">Add a new task</div>
        <div className="add-row">
          <input
            type="text"
            placeholder="Task name…"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTask()}
          />
          <input
            type="date"
            value={newDue}
            onChange={e => setNewDue(e.target.value)}
          />
          <select value={newCat} onChange={e => setNewCat(e.target.value)}>
            {['ops','licensing','hiring','marketing','clinical'].map(c =>
              <option key={c} value={c}>{c}</option>
            )}
          </select>
          <select value={newPri} onChange={e => setNewPri(e.target.value)}>
            <option value="high">High</option>
            <option value="med">Med</option>
            <option value="low">Low</option>
          </select>
          <button className="add-btn" onClick={addTask}>+ Add</button>
          {doneN > 0 && (
            <button className="clr-btn" onClick={clearDone}>
              Clear done ({doneN})
            </button>
          )}
        </div>
      </div>

    </div>
  );
}
