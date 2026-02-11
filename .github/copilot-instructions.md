**Project Overview**

- **Type:** Static, client-side web app (no bundler). Open the HTML files in a browser or serve via a local static server.
- **UI:** Bootstrap via CDN; styles live in [css/](css/).
- **Pages:** Entry at [index.html](index.html). Dedicated pages under [pages/](pages/) (e.g. [pages/add_event.html](pages/add_event.html), [pages/signin.html](pages/signin.html)).

**Architecture & Data Flow**

- **Frontend modules:** ES modules in [js/](js/) (some files are modules and use `import`/`export` — ensure the corresponding script tag uses `type="module"`). Examples: [js/calendar.js](js/calendar.js) and [js/nav.js](js/nav.js) are loaded as modules; [js/weather_api.js](js/weather_api.js) and [js/news_api.js](js/news_api.js) are non-module scripts inlined in [index.html](index.html).
- **State & auth:** Authentication is Firebase Auth (see [js/firebase_config.js](js/firebase_config.js)). The app stores the logged-in user's UID in `localStorage.currentUserID` and uses that to scope Firestore queries (see [js/login.js](js/login.js) and [js/nav.js](js/nav.js)).
- **Persistence:** Firestore used for users and tasks — add/update reads use the Firestore SDK in [js/add_event.js](js/add_event.js) and [js/calendar.js](js/calendar.js).
- **Entities & UI rendering:** Data models and UI rendering helpers live in [js/entities.js](js/entities.js). For example `Task.toUIHTMLTag()` returns the HTML string used to render events on the calendar.
- **Routing:** Lightweight client routing via `location.href` and URL query params (e.g., `?taskId=...` and `?hour=...`) — see event click handling in [js/calendar.js](js/calendar.js) and form handling in [js/add_event.js](js/add_event.js).

**Third-party integrations**

- **Firebase (Auth + Firestore):** Config and exported objects in [js/firebase_config.js](js/firebase_config.js). All Firebase imports use CDN module URLs.
- **External APIs:** News (NewsAPI key in [js/news_api.js](js/news_api.js)) and OpenWeather (key in [js/weather_api.js](js/weather_api.js)). These keys are committed in-source.

**Project-specific conventions & gotchas**

- **No build step:** There is no `package.json` or bundler — preserve relative import paths and `type="module"` script tags. Editing imports requires maintaining correct relative paths.
- **Mixed script loading:** Some scripts are loaded as modules and others as plain scripts. Match the existing pattern rather than converting all scripts to modules.
- **Local server recommended:** Because of module imports and geolocation, open the project via a local server (not `file://`). Example:

```bash
python -m http.server 8000
# then visit http://localhost:8000/
```

- **Auth flow expectation:** Pages assume a logged-in user; [js/nav.js](js/nav.js) redirects to [pages/signin.html](pages/signin.html) if `localStorage.currentUserID` is missing. When testing flows, ensure you sign-in first.
- **UI mutation pattern:** The codebase is DOM-first and imperative — prefer minimal patches that follow existing patterns (querySelector, innerHTML, event listeners) rather than introducing frameworks.

**Where to look for common tasks (examples)**

- Add/update a task: follow the flow in [pages/add_event.html](pages/add_event.html) + [js/add_event.js](js/add_event.js) — Firestore `addDoc()` and `updateDoc()` are used.
- Calendar rendering and click-to-edit behavior: [js/calendar.js](js/calendar.js) and [js/entities.js](js/entities.js) (see `Task.toUIHTMLTag()` for how events are positioned and classed).
- Auth & user creation: [pages/signin.html](pages/signin.html) + [js/login.js](js/login.js) — registration writes a `users` document in Firestore.
- Nav + session enforcement: [js/nav.js](js/nav.js) — used on pages to enforce login and show username.

**Guidance for AI edits**

- Keep changes small and focused: update the smallest set of files necessary.
- Preserve existing script tag types and relative import paths. If you update an `import` path, also update the HTML `<script type="module">` usage if needed.
- Avoid exposing new secrets: the repo already includes API keys and a Firebase config; do not add more secrets in source — prefer advising maintainers to move keys to env/config if requested.
- Use the app in-browser to validate DOM interactions (calendar click -> `pages/add_event.html?taskId=...`, form submit -> Firestore write).

**Run / Debug Checklist**

- Start a local static server (see above). Open DevTools to inspect network requests and module import errors.
- To test auth flows, sign up and sign in via [pages/signin.html](pages/signin.html) — `localStorage.currentUserID` should be set after sign-in.
- Geolocation features require serving over `http://localhost` or HTTPS.

If anything above is unclear or you'd like me to expand any section (e.g., give a short walkthrough of the add-event flow or convert a script to module), tell me which area to flesh out.
