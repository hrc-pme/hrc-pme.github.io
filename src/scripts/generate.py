#!/usr/bin/env python3
"""
Static Site Generator for HRC Lab Website
Python version of the build script
"""

import json
import os
import re
from pathlib import Path

class SiteGenerator:
    def __init__(self):
        self.root_dir = Path(__file__).parent.parent.parent
        self.src_dir = self.root_dir / 'src'
        self.data_dir = self.src_dir / 'data'
        self.components_dir = self.src_dir / 'components'
        self.templates_dir = self.src_dir / 'templates'
        self.pages_dir = self.root_dir / 'pages'
        
        # Load data
        self.site_data = self.load_json('site.json')
        self.people_data = self.load_json('people.json')
        self.news_data = self.load_json('news.json')
    
    def load_json(self, filename):
        with open(self.data_dir / filename, 'r', encoding='utf-8') as f:
            return json.load(f)
    
    def load_template(self, filename):
        with open(self.templates_dir / filename, 'r', encoding='utf-8') as f:
            return f.read()
    
    def load_component(self, filename):
        with open(self.components_dir / filename, 'r', encoding='utf-8') as f:
            return f.read()
    
    def replace_placeholders(self, template, replacements):
        result = template
        for key, value in replacements.items():
            placeholder = f"{{{{{key}}}}}"
            result = result.replace(placeholder, str(value) if value is not None else '')
        return result
    
    def generate_navigation(self, is_root=True):
        nav_items = []
        for item in self.site_data['navigation']:
            href = item['href'] if is_root else item['href'].replace('pages/', '')
            nav_items.append(f'<a href="{href}" style="font-size: 23px; color:black">{item["label"]}</a>')
        return '\n    '.join(nav_items)
    
    def generate_header(self, is_root=True):
        header_template = self.load_component('header.html')
        
        # Adjust asset paths based on whether this is a root page or subpage
        logo_path = self.site_data['site']['logo'] if is_root else f"../{self.site_data['site']['logo']}"
        home_link = 'index.html' if is_root else '../index.html'
        
        return self.replace_placeholders(header_template, {
            'HOME_LINK': home_link,
            'LOGO_PATH': logo_path,
            'NAVIGATION_LINKS': self.generate_navigation(is_root),
            'GITHUB_LINK': self.site_data['site']['github']
        })
    
    def generate_footer(self):
        return self.load_component('footer.html')
    
    def generate_person_profile(self, person, include_affiliation=False, is_root=True):
        template = self.load_component('person-profile.html')
        
        # Adjust image path for subpages
        image_path = person['image'] if is_root else f"../{person['image']}"
        
        # Generate profile links
        links = []
        if person.get('links', {}).get('homepage'):
            links.append(f'<a class="button-profile" href="{person["links"]["homepage"]}"><i class="fa fa-home" aria-hidden="true"></i></a>')
        if person.get('links', {}).get('scholar'):
            links.append(f'<a class="button-profile" href="{person["links"]["scholar"]}"><i class="fa fa-graduation-cap" aria-hidden="true"></i></a>')
        if person.get('links', {}).get('linkedin'):
            links.append(f'<a class="button-profile" href="{person["links"]["linkedin"]}"><i class="fa fa-linkedin"></i></a>')
        if person.get('links', {}).get('email'):
            links.append(f'<a class="button-profile" href="mailto:{person["links"]["email"]}"><i class="fa fa-envelope"></i></a>')
        
        affiliation_text = ''
        if include_affiliation and person.get('affiliation'):
            affiliation_text = f'<br>{person["affiliation"]}'
        
        return self.replace_placeholders(template, {
            'IMAGE_PATH': image_path,
            'IMAGE_STYLE': person.get('imageStyle', ''),
            'NAME': person['name'],
            'TITLE': person['title'],
            'AFFILIATION': affiliation_text,
            'PROFILE_LINKS': '\n                &nbsp\n                '.join(links)
        })
    
    def generate_robot_profile(self, robot, is_root=True):
        template = self.load_component('robot-profile.html')
        image_path = robot['image'] if is_root else f"../{robot['image']}"
        
        return self.replace_placeholders(template, {
            'IMAGE_PATH': image_path,
            'NAME': robot['name'],
            'MANUFACTURER': robot['manufacturer']
        })
    
    def generate_news_item(self, item, is_root=True):
        template = self.load_component('news-item.html')
        image_path = item['image'] if is_root else f"../{item['image']}"
        
        return self.replace_placeholders(template, {
            'IMAGE_PATH': image_path,
            'TITLE': item['title'],
            'DATE': item['date'],
            'DESCRIPTION': item['description']
        })
    
    def generate_section_header(self, title):
        template = self.load_component('section-header.html')
        return self.replace_placeholders(template, {
            'SECTION_TITLE': title
        })
    
    def generate_base_page(self, page_title, author, main_content, is_root=True):
        base_template = self.load_template('base.html')
        
        # Adjust paths based on whether this is a root page or subpage
        stylesheet_path = 'styles/stylesheet.css' if is_root else '../styles/stylesheet.css'
        favicon_path = self.site_data['site']['favicon'] if is_root else f"../{self.site_data['site']['favicon']}"
        
        return self.replace_placeholders(base_template, {
            'PAGE_TITLE': page_title,
            'AUTHOR': author,
            'STYLESHEET_PATH': stylesheet_path,
            'FAVICON_PATH': favicon_path,
            'HEADER': self.generate_header(is_root),
            'MAIN_CONTENT': main_content,
            'FOOTER': self.generate_footer()
        })
    
    def generate_index_page(self):
        content = f"""
      <table width="100%" align="center" border="0" cellspacing="0" cellpadding="20">
        <tbody>
          <tr>
            <td>
              <img src="assets/images/general/application_domains.png" width="100%">
              <p>{self.site_data['lab']['description']}</p>
              <p>
                <b>Location:</b> <a href="{self.site_data['lab']['location']['mapLink']}">{self.site_data['lab']['location']['address']}</a><br>
                <b>Lab: {self.site_data['lab']['location']['lab']}</b><br>
                <b>Office: {self.site_data['lab']['location']['office']}</b><br>
              </p>
            </td>
          </tr>
        </tbody>
      </table>"""
        
        return self.generate_base_page(self.site_data['site']['title'], 'Ching-I Huang', content)
    
    def generate_people_page(self):
        content = ''
        
        # Director section
        content += self.generate_section_header('Director')
        for person in self.people_data['director']:
            content += self.generate_person_profile(person, True, False)
        
        # PhD Students section
        content += self.generate_section_header('PhD Students')
        for person in self.people_data['phdStudents']:
            content += self.generate_person_profile(person, False, False)
        
        # Masters Students section
        content += self.generate_section_header('Masters Students')
        for person in self.people_data['mastersStudents']:
            content += self.generate_person_profile(person, False, False)
        
        # Collaborators section
        content += self.generate_section_header('Collaborators & Visiting Students')
        for person in self.people_data['collaborators']:
            content += self.generate_person_profile(person, False, False)
        
        # Robots section
        content += self.generate_section_header('Robots')
        content += """
      <table style="width:100%;border:0px;border-spacing:0px;border-collapse:separate;margin-right:auto;margin-left:auto;">
        <tbody>
          <table style="width:100%;border:0px;border-spacing:0px;border-collapse:separate;margin-right:auto;margin-left:auto;">
            <tbody>"""
        
        for robot in self.people_data['robots']:
            content += self.generate_robot_profile(robot, False)
        
        content += """
            </tbody>
          </table>
        </tbody>
      </table>"""
        
        return self.generate_base_page('People', 'Welly', content, False)
    
    def generate_news_page(self):
        content = ''
        
        # Awards section
        content += self.generate_section_header('Award')
        for item in self.news_data['awards']:
            content += self.generate_news_item(item, False)
        
        # Events section
        content += self.generate_section_header('Event')
        for item in self.news_data['events']:
            content += self.generate_news_item(item, False)
        
        # Research section
        content += self.generate_section_header('Research')
        for item in self.news_data['research']:
            content += self.generate_news_item(item, False)
        
        return self.generate_base_page('Publications', 'Andrea Bajcsy', content, False)
    
    def generate_research_page(self):
        content = f"""
      <table width="100%" align="center" border="0" cellspacing="0" cellpadding="20">
        <tbody>
          <tr>
            <td>
              <p>{self.site_data['lab']['researchDescription']}</p>
            </td>
          </tr>
        </tbody>
      </table>"""
        
        return self.generate_base_page('Research', 'Andrea Bajcsy', content, False)
    
    def generate(self):
        try:
            # Generate new pages
            root_pages = {
                'index.html': self.generate_index_page()
            }
            
            sub_pages = {
                'people.html': self.generate_people_page(),
                'news.html': self.generate_news_page(),
                'research.html': self.generate_research_page()
            }
            
            # Write root pages
            for filename, content in root_pages.items():
                output_path = self.root_dir / filename
                with open(output_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f'Generated: {filename}')
            
            # Write sub pages
            for filename, content in sub_pages.items():
                output_path = self.pages_dir / filename
                with open(output_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f'Generated: pages/{filename}')
            
            print('Site generation completed successfully!')
            
        except Exception as error:
            print(f'Error generating site: {error}')
            raise

if __name__ == '__main__':
    generator = SiteGenerator()
    generator.generate()
