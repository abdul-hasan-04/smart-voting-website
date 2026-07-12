# Verum — Website Pages Documentation

**Project:** Verum Election Systems
**Type:** Online voting platform for organizations (universities, unions, co-ops)
**Document purpose:** Overview of the main pages that make up the Verum web application, their function, and their key components.

---

## 1. Landing Page — `index.html`

**Route:** `/index.html`
**Access:** Public

The marketing homepage. It introduces Verum to prospective organizations and voters and drives traffic toward registration and login.

**Key sections:**

| Section | Description |
|---|---|
| Navbar | Logo, anchor links (Features, How it works, Security, Numbers), Log in / Register buttons |
| Hero | Headline, subtext, CTA buttons, and a live product mockup showing a sample ballot and results bar chart |
| Logo strip | Organizations that use Verum (social proof) |
| Features | Three core value props: Secure, Fast, Transparent |
| How it works | Three-step process: Register & verify → Review & vote → See the result |
| Stats | Animated counters (votes cast, elections run, uptime, average time to vote) |
| Security | Explains encryption-at-source, identity/vote separation, and the public audit trail, plus a terminal-style visual log |
| CTA | Final call to action to register or log in |
| Footer | Site links, legal, company info |

**Notes:** Loads `./css/styles.css` and `./script.js`. Links to `./pages/login.html` and `./pages/register.html`.

---

## 2. Registration Page — `register.html`

**Route:** `/pages/register.html`
**Access:** Public

Allows a new voter to create an account.

**Key elements:**
- Split layout: left branding panel (testimonial quote + trust stats), right form panel
- Form fields: Full name, Email, Password, Confirm password
- Live password-strength meter with rule checklist (length, uppercase, number, symbol)
- Terms & Election Policy agreement checkbox
- Link to `login.html` for existing users

**Script:** `../js/singup.js` (form logic), `../script.js` (shared UI behavior)

---

## 3. Login Page — `login.html`

**Route:** `/pages/login.html`
**Access:** Public

Authenticates returning voters and administrators.

**Key elements:**
- Same split-panel layout as Register, with its own testimonial and stats
- Form fields: Email, Password (with show/hide toggle)
- "Remember me" checkbox and "Forgot password?" link
- Link to `register.html` for new users

**Script:** `../js/login.js`, `../script.js`

---

## 4. Voter Dashboard — `dashboard.html`

**Route:** `/pages/dashboard.html`
**Access:** Authenticated voters

Lists elections available to the logged-in voter.

**Key elements:**
- Header with logo and user profile menu
- Filter tabs: All, Open, Upcoming, Closed
- `electionList-container` — dynamically populated list of election cards (rendered via JS)

**Script:** `../js/dashboard.js` (fetches and renders elections, handles filter state)

---

## 5. Vote / Candidate Selection Page — `vote-candidate.html`

**Route:** `/pages/vote-candidate.html`
**Access:** Authenticated voters, scoped to a specific election

Where a voter reviews candidates and casts a ballot for a chosen election.

**Key elements:**
- Alert banner for feedback messages (success/error)
- Modal overlay (`.overlay` / `.modal`) — likely used for vote confirmation
- "Back to elections" link to the dashboard
- Election title and description
- `candidates-list-container` — dynamically populated candidate cards
- "Show More" button for paginated candidate loading

**Script:** `../js/voting-service.js`

---

## 6. Admin Dashboard — `admin.html`

**Route:** `/pages/admin.html`
**Access:** Administrators only

Central control panel for election management.

**Key elements:**
- Header with logo and user profile menu
- Page intro: "Create elections, manage candidates, and review live results"
- "Create Election" button
- Summary metric cards: Total Elections, Currently Open, Total Candidates, Votes Cast
- Modal overlay for the create/edit election form
- `election-container-list` — dynamically populated list of elections the admin manages

**Script:** `../js/admin.js`

---

## 7. Election Result Page — `result.html`

**Route:** `/pages/result.html`
**Access:** Administrators (linked from the Admin Dashboard)

Displays the outcome of a specific election.

**Key elements:**
- Breadcrumb: Admin Dashboard / Result
- Page intro: "View Election Result"
- Summary metric cards: Total Votes, Total Candidates, Winner
- Leaderboard card — `candidates-list-leader-board`, a ranked, dynamically populated list of candidates by vote count

**Script:** `../js/election-result.js`

---

## Site Map Overview

```
index.html (Landing)
│
├── pages/register.html   → Create account
├── pages/login.html      → Authenticate
│
├── pages/dashboard.html  → Voter: browse elections
│     └── pages/vote-candidate.html → Voter: cast ballot
│
└── pages/admin.html      → Admin: manage elections
      └── pages/result.html → Admin: view results
```

---

## Shared Assets Across Pagesc

| Asset | Used by |
|---|---|
| `css/styles.css` | All pages |
| `css/dashbaord.css` | dashboard, login, admin, result |
| `css/admin.css` | admin, result |
| `css/result.css` | result |
| `css/candidate.css` | vote-candidate |
| Font Awesome 7.0.1 (CDN) | admin, dashboard, vote-candidate, result |
| `script.js` | index, login, register |

**Note:** The stylesheet filename `dashbaord.css` (and class name `dashbaord-mirrors-container`, page title "Dashbaord") contains a spelling inconsistency ("dashbaord" vs "dashboard") that appears consistently across `dashboard.html`, `admin.html`, and `result.html`. Standardizing this naming would be a worthwhile cleanup item.