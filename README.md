# HRC Lab Website

Human-Robot Collaboration Lab website with modular architecture.

Visit our live website at: https://hrc-pme.github.io/

## 1. Architecture

This website follows a modular architecture with a clean directory structure:

```
├── index.html                    # Main homepage (root level)
├── pages/                        # All other pages
│   ├── people.html              # Team members page
│   ├── research.html            # Research page
│   ├── news.html                # News and events page
│   ├── publications.html        # Publications page
│   ├── join.html                # Join us page
│   └── teaching.html            # Teaching page
├── styles/                       # Stylesheets
│   └── stylesheet.css           # Main stylesheet
├── assets/                       # Asset files
│   ├── images/                  # All image assets
│   │   ├── general/            # General site images (logos, banners)
│   │   ├── people/             # People and robot photos
│   │   ├── news/               # News and event images
│   │   └── publications/       # Publication images
│   └── documents/              # PDF and document files
├── src/                          # Source files
│   ├── components/               # Reusable HTML components
│   │   ├── header.html          # Navigation header
│   │   ├── footer.html          # Page footer
│   │   ├── person-profile.html  # Person profile card
│   │   ├── robot-profile.html   # Robot profile card
│   │   ├── news-item.html       # News item card
│   │   └── section-header.html  # Section title header
│   ├── templates/               # Page templates
│   │   └── base.html           # Base page template
│   ├── data/                   # JSON data files
│   │   ├── people.json         # People and robots data
│   │   ├── news.json           # News, awards, events data
│   │   └── site.json           # Site configuration
│   └── scripts/                # Build scripts
│       ├── generate.py         # Python static site generator
│       └── generate.js         # Node.js static site generator
└── package.json                # Build configuration
```

## 2. Build System

### Prerequisites
- Python 3 (for build script and local development server)

### Commands

```bash
# Generate static HTML files from templates and data
python3 src/scripts/generate.py

# Serve for local development
python3 -m http.server 8000
```

### Development Workflow

1. **Update Data**: Modify JSON files in `src/data/`
2. **Update Components**: Edit HTML templates in `src/components/`
3. **Build Site**: Run `python3 src/scripts/generate.py` to generate HTML files
4. **Test Locally**: Use `python3 -m http.server 8000` to test changes

## 3. Adding New Content

### Adding a New Person
1. Add person object to appropriate array in `src/data/people.json`
2. Place person's image in `assets/images/people/`
3. Run `python3 src/scripts/generate.py` to regenerate pages

### Adding News Items
1. Add news object to appropriate array in `src/data/news.json`
2. Ensure image is placed in `assets/images/news/` directory
3. Run `python3 src/scripts/generate.py` to regenerate pages

### Modifying Site Structure
1. Edit components in `src/components/`
2. Update generator logic in `src/scripts/generate.py` if needed
3. Run `python3 src/scripts/generate.py` to apply changes
