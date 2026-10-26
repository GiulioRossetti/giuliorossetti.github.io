# giuliorossetti.github.io

Source code of the personal website of **Giulio Rossetti**, Senior Researcher at
[CNR-ISTI](https://www.isti.cnr.it/) (Pisa) and PI of the Social Network Analysis team of the
[KDD Lab](http://kdd.isti.cnr.it/). The site presents research in **Computational Social Science,
Network Science, Generative AI and Social Twins**, together with publications, open-source software,
team, teaching and CV.

Live site: <https://giuliorossetti.github.io>

---

## About the project

The website is a static site generated with [Jekyll](https://jekyllrb.com/) and
[jekyll-scholar](https://github.com/inukshuk/jekyll-scholar) (publications are rendered directly from a
BibTeX file). It started from the [al-folio](https://github.com/alshedivat/al-folio) theme; the **v2026**
redesign replaces the whole presentation layer while keeping the same build and deploy pipeline.

**v2026 highlights**

- Editorial-scientific design system (Fraunces · Inter · JetBrains Mono), light and dark themes, responsive layout.
- No jQuery / Bootstrap / MDB: plain SCSS + a small vanilla JS file.
- Fonts and icons are self-hosted (no requests to Google Fonts or CDNs for typography/icons).
- Home page built for personal promotion: hero, at-a-glance stats (computed from the `.bib` file), bio and
  recognition, four research pillars, YSocial spotlight, featured and recent publications, software, team, contact.
- Publications page with type filters, live search and year navigation.
- SEO: Open Graph / Twitter cards, social preview image, schema.org `ProfilePage`/`Person` JSON-LD, sitemap, Atom feed.

### Repository structure

```
_config.yml              Site configuration (name, social profiles, SEO, jekyll-scholar, plugins)
_data/
  profile.yml            Home page content: hero, pillars, YSocial spotlight, recognition, contact
  software.yml           Open-source tools (home page + /software/)
  cv.yml                 CV content (/cv/)
  coauthors.yml          Optional co-author links used in publication lists
_bibliography/papers.bib All publications (single source of truth)
_pages/                  Top-level pages: home (about.md), research, publications, software, team, teaching, cv, news
_projects/               Research lines, funded projects and teaching courses (one Markdown file each)
_team/                   Team members (one Markdown file each; not rendered as pages)
_news/                   News items
_layouts/  _includes/    HTML templates (Liquid)
_sass/                   Design system: _tokens, _fonts, _base, _components, _pages
_plugins/                Small Jekyll plugins (publication stats, BibTeX field filtering, external posts)
assets/                  CSS entry point, JS, images, PDFs, self-hosted fonts and icon libraries (assets/lib)
bin/deploy               Build-and-publish script used by GitHub Actions
.github/workflows/       CI: deploy.yml builds the site and publishes it to the gh-pages branch
```

### Where to edit content

| What | File |
|---|---|
| Hero, current positions, research pillars, YSocial spotlight, contact block | `_data/profile.yml` |
| Home page bio ("About") | `_pages/about.md` |
| Software / open-source tools | `_data/software.yml` (`group: twins` or `net` → section on /software/, `featured: true` → home page, logos in `assets/img/software/`) |
| Publications | `_bibliography/papers.bib` |
| Research lines and funded projects | `_projects/project-*.md` (`summary:` is the text shown on the card) |
| Teaching | `_projects/*_teaching-*.md` (`status: current` → "Current courses", `past` → archive; `level`, `institution`, `period`, `summary`, `materials`, `link: false` for courses without a page) |
| Team members | `_team/*.md` (`img:` photo, `category:` group, e.g. `PhD Students`, `Alumni`) |
| CV | `_data/cv.yml` (+ PDF in `assets/pdf/short_cv.pdf`) |
| News | `_news/announcement_N.md` |
| Name, e-mail, social profiles, SEO description | `_config.yml` |

**BibTeX conventions** (custom fields are hidden from the public BibTeX export):

- `abbr={Journal|Conference|Preprint|Book|Book-chapter}` → coloured type badge and publications filter;
- `selected={true}` → listed under "Featured work" on the home page;
- `genai`, `net`, `dyn`, `pies`, `sie`, `cog` `={true}` → listed on the corresponding research-line page;
- `pdf={papers/FILE.pdf}` (file in `assets/pdf/papers/`), `doi`, `url`, `code`, `slides`, `abstract`,
  `bibtex_show={true}` → links and toggles under each entry.

### Design system

- Tokens (colours, fonts, radii, shadows, light/dark): `_sass/_tokens.scss`
- Typography and layout primitives: `_sass/_base.scss`
- Components (header, buttons, cards, publication entries, footer): `_sass/_components.scss`
- Page sections (hero, stats, pillars, spotlight, team, CV, publications toolbar): `_sass/_pages.scss`
- Behaviour (theme toggle, mobile menu, publication search/filter, BibTeX/abstract panels): `assets/js/site.js`
- YSocial look & feel (spotlight, animated feed, badges), aligned with y-not.social: `_sass/_ysocial.scss`, `_includes/ysocial_*.html`
- Research-line and course illustrations: animated SVGs generated by `python3 bin/gen_illustrations.py .` into `_includes/illo/` (inlined, interactive) and `assets/img/research|teaching/`; set `illo:` in the project/course front matter
- Social preview images (Open Graph / X cards, 1200×630): `assets/img/og/*.png`, regenerated with `node bin/gen_og.js` (needs Playwright); set `og_image:` in a page front matter to override

---

## Build and preview locally

### Option A — native Ruby (recommended)

Requirements: **Ruby ≥ 3.0** (with development headers), **Bundler**, **Node.js** (JavaScript runtime used by
the minifier) and a C/C++ toolchain to compile native gems.

macOS (Homebrew):

```bash
brew install ruby node            # then follow brew's hint to put the new ruby first in PATH
gem install bundler
```

Ubuntu / Debian:

```bash
sudo apt install ruby-full build-essential zlib1g-dev nodejs
gem install --user-install bundler
```

Then, from the repository root:

```bash
git checkout v2026                # or master, once v2026 has been merged
bundle config set --local path vendor/bundle   # keep gems inside the project (vendor/ is git-ignored)
bundle install                    # first time only, or after changing the Gemfile

# Live preview with automatic rebuild and browser reload
bundle exec jekyll serve --livereload
# → open http://localhost:4000
```

Useful variants:

```bash
bundle exec jekyll serve --livereload --incremental     # faster rebuilds while editing
bundle exec jekyll serve --host 0.0.0.0 --port 8080     # reachable from other devices on the LAN
bundle exec jekyll build                                 # one-off build into ./_site
JEKYLL_ENV=production bundle exec jekyll build           # same build used in production (minified)
bundle exec jekyll clean                                 # remove _site and caches
bundle update                                            # update gems (Gemfile.lock is not versioned)
```

> If `bundle install` fails on `mini_racer` (it compiles V8), you can skip it locally: Node.js already
> provides the JavaScript runtime. Comment out `gem 'mini_racer'` in the `Gemfile` *only on your machine*
> and do not commit that change.

### Option B — Docker

Requirements: Docker Desktop (or Docker Engine + Compose).

```bash
docker compose up                 # uses the prebuilt image declared in docker-compose.yml
# → open http://localhost:8080   (Ctrl+C to stop, `docker compose down` to remove the container)
```

To build the image from the local `Dockerfile` instead:

```bash
docker compose -f docker-local.yml up --build
```

> The Docker images come from the original al-folio template and ship older gem versions: if the build
> behaves differently from production, prefer Option A.

---

## Publish

The site is published to **GitHub Pages** from the `gh-pages` branch, which is generated automatically:
the workflow `.github/workflows/deploy.yml` runs on every push to `master` (or `main`), builds the site
with `bin/deploy` (`JEKYLL_ENV=production`) and force-pushes the result to `gh-pages`.
In the repository settings, *Settings → Pages → Build and deployment* must be set to
**Deploy from a branch → `gh-pages` / root**. Never edit `gh-pages` by hand.

### Normal update (content changes)

```bash
git checkout master
git pull
# ... edit files, check them with `bundle exec jekyll serve` ...
git add -A
git commit -m "Update publications"
git push origin master            # triggers the deploy workflow; the site updates in a few minutes
```

Follow the run under the repository's **Actions** tab (workflow *deploy*).

### Publishing the v2026 redesign

```bash
# 1. Push the branch and open a Pull Request towards master:
git push -u origin v2026
#    The deploy workflow also runs on pull requests, but only builds the site (no publish):
#    a green check means the production build works.

# 2. Merge the Pull Request on GitHub (or locally):
git checkout master
git merge v2026
git push origin master            # → automatic deploy to gh-pages
```

### Manual deploy (fallback, without GitHub Actions)

```bash
git checkout master
bin/deploy                        # builds, rewrites the local gh-pages branch and pushes it
```

`bin/deploy` requires a clean working tree (no uncommitted or untracked files) and asks for confirmation.
Use `bin/deploy --no-push` to build the `gh-pages` branch locally without pushing.

---

## Credits and license

Built with [Jekyll](https://jekyllrb.com/), [jekyll-scholar](https://github.com/inukshuk/jekyll-scholar),
[Fontsource](https://fontsource.org/) fonts (SIL OFL), [Font Awesome Free](https://fontawesome.com/) and
[Academicons](https://jpswalsh.github.io/academicons/). Originally based on the
[al-folio](https://github.com/alshedivat/al-folio) theme. Code released under the [MIT License](LICENSE);
texts, images and publications © Giulio Rossetti and co-authors.
