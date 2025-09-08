# HRC Lab Website

Human-Robot Collaboration Lab website with modular architecture.

## Live Documentation

Visit our live website at: https://hrc-pme.github.io/

## Architecture

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

## Data Structure

### Site Configuration (`src/data/site.json`)
- **navigation**: Array of navigation menu items (pointing to pages/ subdirectory)
- **site**: Basic site information (title, logo, favicon, links)
- **lab**: Lab description, location, and research information

### People Data (`src/data/people.json`)
- **director**: Lab director information
- **phdStudents**: PhD students array
- **mastersStudents**: Masters students array
- **collaborators**: Collaborators and visiting students
- **robots**: Lab robots and equipment

### News Data (`src/data/news.json`)
- **awards**: Awards and recognitions
- **events**: Events and visits
- **research**: Research publications and presentations

### Person Object Structure
```json
{
  "name": "Person Name",
  "title": "Position/Title", 
  "affiliation": "Optional affiliation",
  "image": "assets/images/people/image.jpg",
  "imageStyle": "Optional CSS styles",
  "links": {
    "homepage": "URL",
    "scholar": "Google Scholar URL",
    "linkedin": "LinkedIn URL", 
    "email": "email@domain.com"
  }
}
```

### News Item Structure
```json
{
  "id": "unique_identifier",
  "date": "YYYY-MM-DD",
  "title": "Item Title",
  "description": "Detailed description",
  "image": "assets/images/news/image.jpg"
}
```

## Build System

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

## Key Features

- **Clean Structure**: Only index.html at root, all other pages in pages/ subdirectory
- **Modular Components**: Reusable HTML components for consistent styling
- **Data-Driven**: Content separated from presentation via JSON files
- **Relative Paths**: Smart path handling for root vs. subpage navigation
- **Asset Organization**: Structured asset directory with categories
- **Template System**: Base templates for consistent page structure
- **Static Generation**: Fast, deployable static HTML files
- **Maintainable**: Easy to update content and add new sections

## Directory Benefits

- **Root Clarity**: Only index.html at root level keeps the main directory clean
- **Organized Pages**: All content pages grouped in pages/ subdirectory
- **Asset Structure**: Categorized asset organization improves maintainability
- **Style Separation**: Dedicated styles/ directory for stylesheets
- **Source Separation**: All source code and data in src/ subdirectory

## Adding New Content

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

## Development

This is a static website built with HTML, CSS, and Python using a custom build system for maintainability and modularity. The build system handles relative path generation automatically for both root-level and subdirectory pages.
