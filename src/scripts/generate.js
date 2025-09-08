/**
 * Static Site Generator for HRC Lab Website
 * This script reads data from JSON files and generates HTML pages using templates
 */

const fs = require('fs');
const path = require('path');

class SiteGenerator {
  constructor() {
    this.srcDir = path.join(__dirname, '..');
    this.outputDir = path.join(this.srcDir, '..');
    this.componentsDir = path.join(this.srcDir, 'components');
    this.templatesDir = path.join(this.srcDir, 'templates');
    this.dataDir = path.join(this.srcDir, 'data');
    
    // Load data
    this.siteData = this.loadJSON('site.json');
    this.peopleData = this.loadJSON('people.json');
    this.newsData = this.loadJSON('news.json');
  }

  loadJSON(filename) {
    const filePath = path.join(this.dataDir, filename);
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }

  loadTemplate(filename) {
    const filePath = path.join(this.templatesDir, filename);
    return fs.readFileSync(filePath, 'utf8');
  }

  loadComponent(filename) {
    const filePath = path.join(this.componentsDir, filename);
    return fs.readFileSync(filePath, 'utf8');
  }

  replacePlaceholders(template, replacements) {
    let result = template;
    for (const [key, value] of Object.entries(replacements)) {
      const placeholder = `{{${key}}}`;
      result = result.replace(new RegExp(placeholder, 'g'), value || '');
    }
    return result;
  }

  generateNavigation() {
    return this.siteData.navigation.map(item => 
      `<a href="${item.href}" style="font-size: 23px; color:black">${item.label}</a>`
    ).join('\n    ');
  }

  generateHeader() {
    const headerTemplate = this.loadComponent('header.html');
    return this.replacePlaceholders(headerTemplate, {
      'LOGO_PATH': this.siteData.site.logo,
      'NAVIGATION_LINKS': this.generateNavigation(),
      'GITHUB_LINK': this.siteData.site.github
    });
  }

  generateFooter() {
    return this.loadComponent('footer.html');
  }

  generatePersonProfile(person, includeAffiliation = false) {
    const template = this.loadComponent('person-profile.html');
    
    // Generate profile links
    const links = [];
    if (person.links.homepage) {
      links.push(`<a class="button-profile" href="${person.links.homepage}"><i class="fa fa-home" aria-hidden="true"></i></a>`);
    }
    if (person.links.scholar) {
      links.push(`<a class="button-profile" href="${person.links.scholar}"><i class="fa fa-graduation-cap" aria-hidden="true"></i></a>`);
    }
    if (person.links.linkedin) {
      links.push(`<a class="button-profile" href="${person.links.linkedin}"><i class="fa fa-linkedin"></i></a>`);
    }
    if (person.links.email) {
      links.push(`<a class="button-profile" href="mailto:${person.links.email}"><i class="fa fa-envelope"></i></a>`);
    }

    return this.replacePlaceholders(template, {
      'IMAGE_PATH': person.image,
      'IMAGE_STYLE': person.imageStyle || '',
      'NAME': person.name,
      'TITLE': person.title,
      'AFFILIATION': includeAffiliation && person.affiliation ? `<br>${person.affiliation}` : '',
      'PROFILE_LINKS': links.join('\n                &nbsp\n                ')
    });
  }

  generateRobotProfile(robot) {
    const template = this.loadComponent('robot-profile.html');
    return this.replacePlaceholders(template, {
      'IMAGE_PATH': robot.image,
      'NAME': robot.name,
      'MANUFACTURER': robot.manufacturer
    });
  }

  generateNewsItem(item) {
    const template = this.loadComponent('news-item.html');
    return this.replacePlaceholders(template, {
      'IMAGE_PATH': item.image,
      'TITLE': item.title,
      'DATE': item.date,
      'DESCRIPTION': item.description
    });
  }

  generateSectionHeader(title) {
    const template = this.loadComponent('section-header.html');
    return this.replacePlaceholders(template, {
      'SECTION_TITLE': title
    });
  }

  generateBasePage(pageTitle, author, mainContent) {
    const baseTemplate = this.loadTemplate('base.html');
    return this.replacePlaceholders(baseTemplate, {
      'PAGE_TITLE': pageTitle,
      'AUTHOR': author,
      'STYLESHEET_PATH': 'stylesheet.css',
      'FAVICON_PATH': this.siteData.site.favicon,
      'HEADER': this.generateHeader(),
      'MAIN_CONTENT': mainContent,
      'FOOTER': this.generateFooter()
    });
  }

  generateIndexPage() {
    const content = `
      <table width="100%" align="center" border="0" cellspacing="0" cellpadding="20">
        <tbody>
          <tr>
            <td>
              <img src="assets/images/general/application_domains.png" width="100%">
              <p>${this.siteData.lab.description}</p>
              <p>
                <b>Location:</b> <a href="${this.siteData.lab.location.mapLink}">${this.siteData.lab.location.address}</a><br>
                <b>Lab: ${this.siteData.lab.location.lab}</b><br>
                <b>Office: ${this.siteData.lab.location.office}</b><br>
              </p>
            </td>
          </tr>
        </tbody>
      </table>`;

    return this.generateBasePage(this.siteData.site.title, 'Ching-I Huang', content);
  }

  generatePeoplePage() {
    let content = '';

    // Director section
    content += this.generateSectionHeader('Director');
    this.peopleData.director.forEach(person => {
      content += this.generatePersonProfile(person, true);
    });

    // PhD Students section
    content += this.generateSectionHeader('PhD Students');
    this.peopleData.phdStudents.forEach(person => {
      content += this.generatePersonProfile(person);
    });

    // Masters Students section
    content += this.generateSectionHeader('Masters Students');
    this.peopleData.mastersStudents.forEach(person => {
      content += this.generatePersonProfile(person);
    });

    // Collaborators section
    content += this.generateSectionHeader('Collaborators & Visiting Students');
    this.peopleData.collaborators.forEach(person => {
      content += this.generatePersonProfile(person);
    });

    // Robots section
    content += this.generateSectionHeader('Robots');
    content += `
      <table style="width:100%;border:0px;border-spacing:0px;border-collapse:separate;margin-right:auto;margin-left:auto;">
        <tbody>
          <table style="width:100%;border:0px;border-spacing:0px;border-collapse:separate;margin-right:auto;margin-left:auto;">
            <tbody>`;
    
    this.peopleData.robots.forEach(robot => {
      content += this.generateRobotProfile(robot);
    });
    
    content += `
            </tbody>
          </table>
        </tbody>
      </table>`;

    return this.generateBasePage('People', 'Welly', content);
  }

  generateNewsPage() {
    let content = '';

    // Awards section
    content += this.generateSectionHeader('Award');
    this.newsData.awards.forEach(item => {
      content += this.generateNewsItem(item);
    });

    // Events section
    content += this.generateSectionHeader('Event');
    this.newsData.events.forEach(item => {
      content += this.generateNewsItem(item);
    });

    // Research section
    content += this.generateSectionHeader('Research');
    this.newsData.research.forEach(item => {
      content += this.generateNewsItem(item);
    });

    return this.generateBasePage('Publications', 'Andrea Bajcsy', content);
  }

  generateResearchPage() {
    const content = `
      <table width="100%" align="center" border="0" cellspacing="0" cellpadding="20">
        <tbody>
          <tr>
            <td>
              <p>${this.siteData.lab.researchDescription}</p>
            </td>
          </tr>
        </tbody>
      </table>`;

    return this.generateBasePage('Research', 'Andrea Bajcsy', content);
  }

  copyStaticFiles() {
    // Copy existing files that don't need processing
    const staticFiles = ['publications.html', 'join.html', 'teaching.html'];
    staticFiles.forEach(file => {
      const srcPath = path.join(this.outputDir, file);
      if (fs.existsSync(srcPath)) {
        // These files will be updated manually or kept as-is
        console.log(`Static file ${file} kept as-is`);
      }
    });
  }

  generate() {
    try {
      // Generate new pages
      const pages = {
        'index.html': this.generateIndexPage(),
        'people.html': this.generatePeoplePage(),
        'news.html': this.generateNewsPage(),
        'research.html': this.generateResearchPage()
      };

      // Write generated pages
      Object.entries(pages).forEach(([filename, content]) => {
        const outputPath = path.join(this.outputDir, filename);
        fs.writeFileSync(outputPath, content, 'utf8');
        console.log(`Generated: ${filename}`);
      });

      this.copyStaticFiles();
      console.log('Site generation completed successfully!');

    } catch (error) {
      console.error('Error generating site:', error);
    }
  }
}

// Run the generator
if (require.main === module) {
  const generator = new SiteGenerator();
  generator.generate();
}

module.exports = SiteGenerator;
