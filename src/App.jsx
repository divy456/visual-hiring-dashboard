import { useMemo, useState } from 'react';

const colleges = [
  'IIT Delhi',
  'NIT Trichy',
  'BITS Pilani',
  'VIT Vellore',
  'SRM Institute',
  'Manipal University',
  'IIIT Hyderabad',
  'DTU',
  'NSUT',
  'PES University',
];

const firstNames = [
  'Aarav',
  'Diya',
  'Ishaan',
  'Meera',
  'Kabir',
  'Ananya',
  'Reyansh',
  'Aisha',
  'Vivaan',
  'Saanvi',
  'Rohan',
  'Kavya',
  'Aditya',
  'Mira',
  'Arjun',
  'Ritika',
  'Dev',
  'Nisha',
  'Yash',
  'Tara',
];

const lastNames = [
  'Sharma',
  'Patel',
  'Reddy',
  'Iyer',
  'Gupta',
  'Menon',
  'Kapoor',
  'Joshi',
  'Nair',
  'Khan',
];

const assignmentCategories = [
  'uiQuality',
  'componentStructure',
  'stateHandling',
  'edgeCaseHandling',
  'responsiveness',
  'accessibility',
];

const videoCategories = [
  'clarity',
  'confidence',
  'architectureExplanation',
  'tradeoffReasoning',
  'communication',
];

const labelMap = {
  uiQuality: 'UI quality',
  componentStructure: 'Component structure',
  stateHandling: 'State handling',
  edgeCaseHandling: 'Edge-case handling',
  responsiveness: 'Responsiveness',
  accessibility: 'Accessibility',
  clarity: 'Clarity',
  confidence: 'Confidence',
  architectureExplanation: 'Architecture explanation',
  tradeoffReasoning: 'Tradeoff reasoning',
  communication: 'Communication',
};

const priorityConfig = [
  { code: 'P0', label: 'Interview immediately', min: 80, className: 'p0' },
  { code: 'P1', label: 'Strong shortlist', min: 68, className: 'p1' },
  { code: 'P2', label: 'Review later', min: 52, className: 'p2' },
  { code: 'P3', label: 'Reject', min: 0, className: 'p3' },
];

const sortOptions = {
  priority: (a, b) => b.priorityScore - a.priorityScore,
  assignment: (a, b) => b.assignmentScore - a.assignmentScore,
  video: (a, b) => b.videoScore - a.videoScore,
  ats: (a, b) => b.atsScore - a.atsScore,
  name: (a, b) => a.name.localeCompare(b.name),
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function averageRating(record) {
  const values = Object.values(record);
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function calculatePriority(candidate) {
  const score =
    candidate.assignmentScore * 0.3 +
    candidate.videoScore * 0.25 +
    candidate.atsScore * 0.2 +
    candidate.githubScore * 0.15 +
    candidate.communicationScore * 0.1;

  const bucket = priorityConfig.find((item) => score >= item.min) ?? priorityConfig.at(-1);

  return {
    priorityScore: Math.round(score),
    priorityCode: bucket.code,
    priorityLabel: bucket.label,
    priorityClass: bucket.className,
  };
}

function createAssignmentRatings(seed) {
  return {
    uiQuality: 2 + (seed % 4),
    componentStructure: 2 + ((seed + 1) % 4),
    stateHandling: 2 + ((seed + 2) % 4),
    edgeCaseHandling: 2 + ((seed + 3) % 4),
    responsiveness: 2 + ((seed + 1) % 3),
    accessibility: 1 + ((seed + 2) % 5),
  };
}

function createVideoRatings(seed) {
  return {
    clarity: 2 + (seed % 4),
    confidence: 2 + ((seed + 2) % 4),
    architectureExplanation: 2 + ((seed + 1) % 4),
    tradeoffReasoning: 1 + ((seed + 3) % 5),
    communication: 2 + ((seed + 1) % 4),
  };
}

function createTimestampNotes(seed) {
  return [
    `${String(1 + (seed % 4)).padStart(2, '0')}:${String((seed * 7) % 60).padStart(2, '0')} - clear explanation of project scope`,
    `${String(2 + (seed % 3)).padStart(2, '0')}:${String((seed * 11) % 60).padStart(2, '0')} - could justify tradeoffs more directly`,
  ];
}

function createCandidate(id) {
  const assignmentRatings = createAssignmentRatings(id);
  const videoRatings = createVideoRatings(id);
  const assignmentScore = Math.round(averageRating(assignmentRatings) * 20);
  const videoScore = Math.round(averageRating(videoRatings) * 20);
  const atsScore = 52 + ((id * 9) % 41);
  const githubScore = 45 + ((id * 11) % 46);
  const communicationScore = 50 + ((id * 7) % 41);
  const reviewed = id % 3 === 0;
  const shortlisted = id % 8 === 0;
  const candidate = {
    id,
    name: `${firstNames[id % firstNames.length]} ${lastNames[id % lastNames.length]}`,
    college: colleges[id % colleges.length],
    assignmentScore,
    videoScore,
    atsScore,
    githubScore,
    communicationScore,
    reviewStatus: reviewed ? 'Reviewed' : 'Pending',
    shortlisted,
    assignmentRatings,
    videoRatings,
    timestampNotes: createTimestampNotes(id),
  };

  return { ...candidate, ...calculatePriority(candidate) };
}

function generateCandidates(count = 100) {
  return Array.from({ length: count }, (_, index) => createCandidate(index + 1));
}

function summaryStats(candidates) {
  return {
    total: candidates.length,
    reviewed: candidates.filter((candidate) => candidate.reviewStatus === 'Reviewed').length,
    shortlisted: candidates.filter((candidate) => candidate.shortlisted).length,
    pending: candidates.filter((candidate) => candidate.reviewStatus === 'Pending').length,
  };
}

function refreshCandidate(candidate) {
  const assignmentScore = Math.round(averageRating(candidate.assignmentRatings) * 20);
  const videoScore = Math.round(averageRating(candidate.videoRatings) * 20);
  const communicationScore = Math.round(candidate.videoRatings.communication * 20);
  const nextCandidate = {
    ...candidate,
    assignmentScore,
    videoScore,
    communicationScore,
  };

  return {
    ...nextCandidate,
    ...calculatePriority(nextCandidate),
  };
}

function StatCard({ label, value, accent }) {
  return (
    <div className={`stat-card ${accent}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function ScoreRangeFilter({ label, range, onChange }) {
  return (
    <div className="filter-block">
      <span className="filter-label">{label}</span>
      <div className="range-row">
        <input
          type="number"
          min="0"
          max="100"
          value={range.min}
          onChange={(event) => onChange({ ...range, min: clamp(Number(event.target.value), 0, 100) })}
        />
        <span>to</span>
        <input
          type="number"
          min="0"
          max="100"
          value={range.max}
          onChange={(event) => onChange({ ...range, max: clamp(Number(event.target.value), 0, 100) })}
        />
      </div>
    </div>
  );
}

function RatingControl({ label, value, onChange }) {
  return (
    <label className="rating-row">
      <div>
        <span>{label}</span>
        <strong>{value}/5</strong>
      </div>
      <input
        type="range"
        min="1"
        max="5"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

function ScorePill({ candidate }) {
  return (
    <div className={`priority-pill ${candidate.priorityClass}`}>
      <strong>{candidate.priorityCode}</strong>
      <span>{candidate.priorityScore}</span>
    </div>
  );
}

function CandidateDrawer({
  candidate,
  onClose,
  onCandidateChange,
  comparisonIds,
  onToggleCompare,
}) {
  const [newNote, setNewNote] = useState('');

  if (!candidate) {
    return (
      <section className="detail-panel empty-panel">
        <p>Select a candidate to inspect scores, review submissions, and update priority live.</p>
      </section>
    );
  }

  const updateScoreField = (field, value) => {
    onCandidateChange(candidate.id, {
      ...candidate,
      [field]: clamp(Number(value), 0, 100),
    });
  };

  const updateAssignmentRating = (field, value) => {
    onCandidateChange(candidate.id, refreshCandidate({
      ...candidate,
      reviewStatus: 'Reviewed',
      assignmentRatings: {
        ...candidate.assignmentRatings,
        [field]: value,
      },
    }));
  };

  const updateVideoRating = (field, value) => {
    onCandidateChange(candidate.id, refreshCandidate({
      ...candidate,
      reviewStatus: 'Reviewed',
      videoRatings: {
        ...candidate.videoRatings,
        [field]: value,
      },
    }));
  };

  const addTimestampNote = () => {
    const trimmed = newNote.trim();
    if (!trimmed) {
      return;
    }
    onCandidateChange(candidate.id, {
      ...candidate,
      reviewStatus: 'Reviewed',
      timestampNotes: [...candidate.timestampNotes, trimmed],
    });
    setNewNote('');
  };

  return (
    <section className="detail-panel">
      <div className="detail-header">
        <div>
          <p className="eyebrow">Candidate Detail</p>
          <h2>{candidate.name}</h2>
          <p>{candidate.college}</p>
        </div>
        <div className="header-actions">
          <button
            type="button"
            className={comparisonIds.includes(candidate.id) ? 'ghost active' : 'ghost'}
            onClick={() => onToggleCompare(candidate.id)}
          >
            {comparisonIds.includes(candidate.id) ? 'In Compare' : 'Compare'}
          </button>
          <button type="button" className="ghost" onClick={onClose}>
            Close
          </button>
        </div>
      </div>

      <div className="score-grid">
        {[
          ['ATS', 'atsScore'],
          ['Assignment', 'assignmentScore'],
          ['Video', 'videoScore'],
          ['Communication', 'communicationScore'],
          ['GitHub', 'githubScore'],
        ].map(([label, field]) => (
          <label key={field} className="score-card">
            <span>{label}</span>
            <input
              type="number"
              min="0"
              max="100"
              value={candidate[field]}
              onChange={(event) => updateScoreField(field, event.target.value)}
            />
          </label>
        ))}
        <div className={`score-card score-priority ${candidate.priorityClass}`}>
          <span>Priority</span>
          <strong>{candidate.priorityCode}</strong>
          <small>{candidate.priorityLabel}</small>
        </div>
      </div>

      <div className="panel-grid">
        <div className="review-panel">
          <div className="panel-title">
            <h3>Assignment Evaluation</h3>
            <span>{candidate.assignmentScore}/100</span>
          </div>
          {assignmentCategories.map((field) => (
            <RatingControl
              key={field}
              label={labelMap[field]}
              value={candidate.assignmentRatings[field]}
              onChange={(value) => updateAssignmentRating(field, value)}
            />
          ))}
        </div>

        <div className="review-panel">
          <div className="panel-title">
            <h3>Video Evaluation</h3>
            <span>{candidate.videoScore}/100</span>
          </div>
          {videoCategories.map((field) => (
            <RatingControl
              key={field}
              label={labelMap[field]}
              value={candidate.videoRatings[field]}
              onChange={(value) => updateVideoRating(field, value)}
            />
          ))}

          <div className="notes-block">
            <div className="notes-header">
              <h4>Timestamp Notes</h4>
              <button type="button" className="ghost small" onClick={addTimestampNote}>
                Add note
              </button>
            </div>
            <textarea
              rows="3"
              placeholder="02:10 - clear explanation"
              value={newNote}
              onChange={(event) => setNewNote(event.target.value)}
            />
            <div className="notes-list">
              {candidate.timestampNotes.map((note, index) => (
                <div key={`${candidate.id}-${index}`} className="note-chip">
                  {note}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ComparisonPanel({ candidates, onRemove }) {
  return (
    <section className="comparison-panel">
      <div className="comparison-header">
        <div>
          <p className="eyebrow">Comparison Mode</p>
          <h3>Candidate side-by-side review</h3>
        </div>
        <span>Select up to 3 candidates</span>
      </div>
      <div className="comparison-grid">
        {candidates.length === 0 ? (
          <div className="comparison-empty">Choose 2 to 3 candidates from the list to compare their fit.</div>
        ) : (
          candidates.map((candidate) => (
            <div key={candidate.id} className="comparison-card">
              <div className="comparison-card-head">
                <div>
                  <strong>{candidate.name}</strong>
                  <span>{candidate.college}</span>
                </div>
                <button type="button" className="ghost small" onClick={() => onRemove(candidate.id)}>
                  Remove
                </button>
              </div>
              <ScorePill candidate={candidate} />
              <div className="metric-list">
                <div><span>Assignment</span><strong>{candidate.assignmentScore}</strong></div>
                <div><span>Video</span><strong>{candidate.videoScore}</strong></div>
                <div><span>ATS</span><strong>{candidate.atsScore}</strong></div>
                <div><span>GitHub</span><strong>{candidate.githubScore}</strong></div>
                <div><span>Communication</span><strong>{candidate.communicationScore}</strong></div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default function App() {
  const [candidates, setCandidates] = useState(() => generateCandidates(100));
  const [selectedId, setSelectedId] = useState(1);
  const [comparisonIds, setComparisonIds] = useState([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('priority');
  const [statusFilter, setStatusFilter] = useState('All');
  const [assignmentRange, setAssignmentRange] = useState({ min: 0, max: 100 });
  const [videoRange, setVideoRange] = useState({ min: 0, max: 100 });
  const [atsRange, setAtsRange] = useState({ min: 0, max: 100 });

  const selectedCandidate = candidates.find((candidate) => candidate.id === selectedId) ?? null;
  const stats = useMemo(() => summaryStats(candidates), [candidates]);

  const filteredCandidates = useMemo(() => {
    return [...candidates]
      .filter((candidate) => candidate.name.toLowerCase().includes(search.toLowerCase()))
      .filter((candidate) =>
        candidate.assignmentScore >= assignmentRange.min &&
        candidate.assignmentScore <= assignmentRange.max,
      )
      .filter((candidate) => candidate.videoScore >= videoRange.min && candidate.videoScore <= videoRange.max)
      .filter((candidate) => candidate.atsScore >= atsRange.min && candidate.atsScore <= atsRange.max)
      .filter((candidate) => statusFilter === 'All' || candidate.reviewStatus === statusFilter)
      .sort(sortOptions[sortBy]);
  }, [assignmentRange, atsRange, candidates, search, sortBy, statusFilter, videoRange]);

  const comparisonCandidates = comparisonIds
    .map((id) => candidates.find((candidate) => candidate.id === id))
    .filter(Boolean);

  const handleCandidateChange = (id, nextCandidate) => {
    setCandidates((current) =>
      current.map((candidate) => (candidate.id === id ? { ...refreshCandidate(nextCandidate) } : candidate)),
    );
  };

  const toggleShortlist = (id) => {
    setCandidates((current) =>
      current.map((candidate) =>
        candidate.id === id
          ? {
              ...candidate,
              shortlisted: !candidate.shortlisted,
              reviewStatus: candidate.reviewStatus === 'Pending' ? 'Reviewed' : candidate.reviewStatus,
            }
          : candidate,
      ),
    );
  };

  const toggleCompare = (id) => {
    setComparisonIds((current) => {
      if (current.includes(id)) {
        return current.filter((item) => item !== id);
      }
      if (current.length === 3) {
        return [...current.slice(1), id];
      }
      return [...current, id];
    });
  };

  return (
    <main className="app-shell">
      <section className="topbar">
        <div>
          <p className="eyebrow">Internal Hiring Console</p>
          <h1>Student applicant prioritization dashboard</h1>
          <p className="subtitle">
            Review assignment quality, video explanations, and resume fit for 1000+ applicants with a live priority engine.
          </p>
        </div>
        <div className="summary-grid">
          <StatCard label="Total candidates" value={stats.total} accent="neutral" />
          <StatCard label="Reviewed" value={stats.reviewed} accent="reviewed" />
          <StatCard label="Shortlisted" value={stats.shortlisted} accent="shortlisted" />
          <StatCard label="Pending" value={stats.pending} accent="pending" />
        </div>
      </section>

      <ComparisonPanel candidates={comparisonCandidates} onRemove={toggleCompare} />

      <section className="workspace">
        <section className="list-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Candidate List</p>
              <h2>Reviewer queue</h2>
            </div>
            <div className="toolbar">
              <input
                type="search"
                placeholder="Search by name"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                <option value="priority">Sort by priority</option>
                <option value="assignment">Sort by assignment</option>
                <option value="video">Sort by video</option>
                <option value="ats">Sort by ATS</option>
                <option value="name">Sort by name</option>
              </select>
            </div>
          </div>

          <div className="filters">
            <ScoreRangeFilter label="Assignment score" range={assignmentRange} onChange={setAssignmentRange} />
            <ScoreRangeFilter label="Video score" range={videoRange} onChange={setVideoRange} />
            <ScoreRangeFilter label="ATS score" range={atsRange} onChange={setAtsRange} />
            <div className="filter-block">
              <span className="filter-label">Review status</span>
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                <option value="All">All</option>
                <option value="Reviewed">Reviewed</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>College</th>
                  <th>Assignment</th>
                  <th>Video</th>
                  <th>ATS</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Shortlist</th>
                </tr>
              </thead>
              <tbody>
                {filteredCandidates.map((candidate) => (
                  <tr
                    key={candidate.id}
                    className={selectedId === candidate.id ? 'selected-row' : ''}
                    onClick={() => setSelectedId(candidate.id)}
                  >
                    <td>
                      <div className="name-cell">
                        <strong>{candidate.name}</strong>
                        <button
                          type="button"
                          className={comparisonIds.includes(candidate.id) ? 'ghost small active' : 'ghost small'}
                          onClick={(event) => {
                            event.stopPropagation();
                            toggleCompare(candidate.id);
                          }}
                        >
                          Compare
                        </button>
                      </div>
                    </td>
                    <td>{candidate.college}</td>
                    <td>{candidate.assignmentScore}</td>
                    <td>{candidate.videoScore}</td>
                    <td>{candidate.atsScore}</td>
                    <td><ScorePill candidate={candidate} /></td>
                    <td>
                      <span className={`status-chip ${candidate.reviewStatus.toLowerCase()}`}>{candidate.reviewStatus}</span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className={candidate.shortlisted ? 'shortlist active' : 'shortlist'}
                        onClick={(event) => {
                          event.stopPropagation();
                          toggleShortlist(candidate.id);
                        }}
                      >
                        {candidate.shortlisted ? 'Shortlisted' : 'Shortlist'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <CandidateDrawer
          candidate={selectedCandidate}
          onClose={() => setSelectedId(null)}
          onCandidateChange={handleCandidateChange}
          comparisonIds={comparisonIds}
          onToggleCompare={toggleCompare}
        />
      </section>
    </main>
  );
}
