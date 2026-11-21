# Miras Ghrissi · Portfolio

React + Tailwind CSS (Vite). Two modes:

- **GUI**: sidebar navigation, interactive robot arm (inverse kinematics, pick & place), filterable projects with detail views, clickable skills, light/dark theme, EN/FR.
- **Pure terminal mode**: click the round terminal button (or press <kbd>`</kbd>). Try `help`, `ls`, `cd projects`, `cat ur5-vision`, `grep stm32`, `simulate`, `neofetch`, `sensors`, `gui`.

## Run

Install Node.js LTS (https://nodejs.org), then:

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production files in dist/
```

## Edit content

Everything (texts EN/FR, projects, skills, experience…) is in `src/data/content.js`.
Images are in `public/img/`, CVs in `public/`.

## Deploy

`npm run build`, then drag the `dist/` folder onto https://app.netlify.com/drop, or push the repo to GitHub and import it on Vercel/Netlify.
