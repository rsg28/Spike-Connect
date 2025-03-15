from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import time
import json

def save_to_json(sessions):
    with open('volleyball_sessions.json', 'w') as f:
        json.dump(sessions, f)

# URL to scrape for volleyball drop-in links
volleyball_url = 'https://anc.ca.apm.activecommunities.com/burnaby/activity/search?onlineSiteId=0&activity_select_param=2&activity_keyword=volleyball&viewMode=list'

# Setup Chrome options to run in headless mode
chrome_options = Options()
chrome_options.add_argument("--headless")  # Run headlessly (without opening a browser window)
chrome_options.add_argument("--disable-gpu")  # Disable GPU acceleration
chrome_options.add_argument("--no-sandbox")  # Disable sandboxing (useful for Linux environments)

# Specify path to chromedriver
chrome_driver_path = '../mobileTemplate/chromedriver-win64/chromedriver.exe'  # Make sure this is correct for your system
service = Service(chrome_driver_path)

# Initialize WebDriver
driver = webdriver.Chrome(service=service, options=chrome_options)

def scrape_volleyball_links():
    try:
        # Open the URL
        driver.get(volleyball_url)

        # Scroll down to the bottom of the page multiple times to trigger lazy loading
        # You can adjust the number of scrolls based on the content you're trying to load
        for _ in range(5):  # Adjust this value for more/less scrolling
            driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            time.sleep(2)  # Wait for new content to load

        # Now scrape the page source using BeautifulSoup
        soup = BeautifulSoup(driver.page_source, 'html.parser')

        # List to store found sessions
        links = []

        # Find all anchor tags with aria-label containing "Reserve In Advance: Volleyball"
        for a_tag in soup.find_all('a', {'aria-label': lambda x: x and x.startswith('Reserve In Advance: Volleyball')}):
            link = a_tag.get('href')
            
            # Locate the div containing the location span
            location_div = a_tag.find_parent('div', class_='activity-card-info')
            location_span = location_div.find('div', class_='activity-card-info__location').find('span')
            location_text = location_span.get_text() if location_span else 'No location'

             # Find the div containing session props
            props_div = location_div.find('div', class_='activity-card-info__props')

            session_number_span = props_div.find('span', class_='activity-card-info__number').find('span')
            session_number = session_number_span.get_text() if session_number_span else 'No session number'

            category_span = props_div.find('span', class_='activity-card-info__category').find('span')
            category = category_span.get_text() if category_span else 'No category'
            category_text = category_span.get_text().strip()  # Get the text and remove any extra spaces
            # Remove "Activity category" and leave only the category
            category = category_text.split("Activity category")[-1].strip()

            ages_span = props_div.find('span', class_='activity-card-info__ages')
            ages = ages_span.get_text() if ages_span else 'No age group'
            ages = ages[:-1]
            ages = ages.replace(" ", "")

            openings_span = props_div.find('span', class_='activity-card-info__openings').find('span')
            openings = openings_span.get_text() if openings_span else 'No openings'
            openings_text = openings_span.get_text().strip()  # Get the text and remove extra spaces
            openings = openings_text.split()[-1]  # Get the last part, which should be the number of openings 
            if openings == '0':
                openings = "Full"

            # Find the div containing the datetime
            datetime_div = a_tag.find_parent('div', class_='activity-card-info')

            if datetime_div:
                # Extract the date
                date_span = datetime_div.find('span', class_='activity-card-info__dateRange')
                date = date_span.get_text().strip() if date_span else 'No date'

                # Extract the time range
                time_range_span = datetime_div.find('span', class_='activity-card-info__timeRange')
                time_range = time_range_span.get_text().strip() if time_range_span else 'No time range'

            if link:
              links.append({
                  'link': link,
                  'location': location_text,
                  'session_number': session_number,
                  'category': category,
                  'ages': ages,
                  'openings': openings,
                  'date': date,
                  'time_range': time_range
              })

        # Debugging: Print the found links with locations, session numbers, categories, ages, and openings
        if not links:
            print("No matching volleyball sessions found.")
        else:
            print("Found Links with Details:")
            for session in links:
                print(f"Session Link: {session['link']}, Location: {session['location']}, "
                f"Session Number: {session['session_number']}, Category: {session['category']}, "
                f"Ages: {session['ages']}, Openings: {session['openings']}, "
                f"Date: {session['date']}, Time Range: {session['time_range']}")
        
        save_to_json(links)

    except Exception as e:
        print(f"Error scraping links: {e}")

    finally:
        driver.quit()

# Run the scraper
scrape_volleyball_links()
