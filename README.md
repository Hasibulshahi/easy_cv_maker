# Easy CV Maker

A React.js CV maker with a live preview pane, editable sections, template switcher, and print-to-PDF support.

## Features

- Real-time CV preview while editing
- Personal details, summary, skills, experience, and education sections
- Add and remove multiple experience and education entries
- Two visual templates: Modern and Classic
- Print-ready layout for exporting as PDF

## Run locally

```bash
npm install
npm run dev
```

## Build for production

```bash
npm run build
npm run preview
```

## GitHub CI/CD

This repo now includes a GitHub Actions workflow at [.github/workflows/deploy.yml](.github/workflows/deploy.yml) that:

- runs `npm ci`
- runs `npm run lint`
- runs `npm run build`
- deploys the `dist` output to GitHub Pages on every push to `main`

To use auto-deployment:

1. Push this repository to GitHub.
2. In GitHub, open `Settings > Pages`.
3. Set `Source` to `GitHub Actions`.
4. Push to `main` and the site will build and deploy automatically.

Pull requests will run the build checks, but they will not deploy.
