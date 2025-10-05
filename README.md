# notdueyet
A lightweight assignment tracker with class management, subtasks, priorities, and calendar view.

## Table of contents

- [Overview](#overview)
- [Key features](#key-features)
- [Why this project matters](#why-this-project-matters)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Development tips](#development-tips)
- [Suggestions & improvements](#suggestions--improvements)
- [Contributing](#contributing)
- [License](#license)

## Overview

notdueyet is a simple, fast, client-side application that helps students track assignments and classes. It's intentionally lightweight and privacy-friendly: all data is stored in the browser's LocalStorage, so nothing leaves the user's device.

Use cases:
- Quickly add classes and assignments during lectures
- Track due dates and priorities
- Break large tasks into subtasks
- View assignments on a calendar for weekly planning

## Key features

- Class management (create/edit/delete classes)
- Assignment creation with due date, priority and subtasks
- Calendar view to visualize upcoming work
- LocalStorage persistence — no backend or login
- Mobile-friendly responsive UI

## Why this project matters

Students need approachable tools that minimize friction. notdueyet reduces setup time and privacy concerns by running entirely in the browser. Because it's static HTML/CSS/JS, it is easy to host, fork, and extend.

## Tech stack

- HTML5
- CSS3 (responsive layout)
- JavaScript (vanilla, modular)
- LocalStorage for client-side persistence

No build step or external dependencies are required to run the app.

## Project structure

Top-level files in this repository (current):

```
notdueyet/
├── index.html        # Main app UI
├── home.html         # (optional) alternate/home view
├── class.html        # Class-specific view
├── calendar.html     # Calendar view
├── auth.js           # (optional) auth helper (if used)
├── script.js         # Main application script
├── style.css         # Main stylesheet
├── README.md         # Project documentation
```

Note: Some builds or forks may organize assets into `/css`, `/js` and `/images` folders — adjust paths if you refactor.

## Getting started

Prerequisites:
- Git (to clone the repository)
- A modern web browser (Chrome, Edge, Firefox, Safari)

Clone and open the app locally (PowerShell):

```powershell
git clone https://github.com/tvisham/notdueyet.git
Set-Location notdueyet
Start-Process -FilePath .\index.html
```

Or simply double-click `index.html` in the project folder to open it in your default browser.

No server or package manager is required for normal use. If you prefer serving with a local static server (useful for development), you can run one (examples below).

## Development tips

- If you edit JavaScript or CSS, refresh the browser to see changes. Use the browser devtools (F12) to inspect LocalStorage and console logs.
- To serve via a simple HTTP server (optional):

Node (if you have Node.js installed):

```powershell
npx http-server -c-1 .
# or: npx serve .
```

Python 3 (if installed):

```powershell
python -m http.server 8000
```

Then open http://localhost:8000 in your browser.

## Suggestions & improvements

Ideas that would improve the app and README:

- Add a dedicated assets folder (`/css`, `/js`, `/images`) and update references
- Add automated tests (unit tests for core logic) and a small test runner
- Add export/import of data (JSON) to back up LocalStorage
- Add a small service worker to enable offline installation as a PWA
- Provide keyboard shortcuts and accessibility improvements (ARIA labels)
- Include screenshots or an animated GIF in this README to show the UI

## Contributing

Contributions are welcome. A simple suggested workflow:

1. Fork the repository on GitHub
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Make changes and test them locally
4. Commit and push: `git push origin feat/your-feature`
5. Open a Pull Request describing your change

Please include screenshots for UI changes and describe any user-facing behavior.

## License

This repository does not include a license file. If you want others to use or contribute to the project, consider adding a LICENSE (for example MIT). If you'd like, I can add a suggested `LICENSE` file.

---

If you'd like, I can also:

- add screenshots or a short demo GIF to this README
- split CSS/JS into `css/` and `js/` subfolders and update the HTML paths
- add a simple JSON export/import feature for LocalStorage

Tell me which of the above you'd like me to implement next.
