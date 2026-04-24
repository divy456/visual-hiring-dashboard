# Hiring Dashboard

A visual internal hiring dashboard for reviewing 100+ student applicants with live priority scoring, shortlist management, and side-by-side comparison.

## Features

- Candidate list with search, score filters, review-status filter, and sorting
- Detail panel for ATS, assignment, video, GitHub, and communication scores
- Assignment evaluation panel with live rating controls
- Video evaluation panel with timestamp notes
- Live priority engine:
  - 30% Assignment
  - 25% Video
  - 20% ATS
  - 15% GitHub
  - 10% Communication
- Dashboard summary cards
- Candidate comparison mode for up to 3 candidates
- Visual priority states:
  - `P0` green
  - `P1` yellow
  - `P2` orange
  - `P3` red

## Run locally

```bash
npm install
npm run dev
```

Then open the local URL shown in the terminal.

## Production build

```bash
npm run build
npm run preview
```

## Notes

- Dummy candidate data is generated locally inside the app.
- Editing assignment and video review sliders updates candidate priority in real time.
