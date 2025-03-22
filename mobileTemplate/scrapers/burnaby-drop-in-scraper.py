# burnaby-drop-in-scraper.py
from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import time
import utils

# URL to scrape for volleyball drop-in events
volleyball_url = 'https://anc.ca.apm.activecommunities.com/burnaby/activity/search?onlineSiteId=0&activity_select_param=2&activity_keyword=volleyball&viewMode=list'

# Setup Chrome options to run in headless mode
chrome_options = Options()
chrome_options.add_argument("--headless")  # Run headlessly (without opening a browser window)
chrome_options.add_argument("--disable-gpu")  # Disable GPU acceleration

# Automatically download and set the correct ChromeDriver
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)

def scrape_volleyball_events():
    try:
        # Open the URL
        driver.get(volleyball_url)

        # Scroll down to the bottom of the page multiple times to trigger lazy loading
        # You can adjust the number of scrolls based on the content you're trying to load
        # for _ in range(5):  # Adjust this value for more/less scrolling
        #     driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        #     time.sleep(1)  # Wait for new content to load

        # Now scrape the page source using BeautifulSoup
        soup = BeautifulSoup(driver.page_source, 'html.parser')

        # List to store found events
        events = []

        # Find all anchor tags with aria-label containing "Reserve In Advance: Volleyball"
        for a_tag in soup.find_all('a', {'aria-label': lambda x: x and x.startswith('Reserve In Advance: Volleyball')}):
            # get the event title
            title = a_tag.get('aria-label').replace('Reserve In Advance: ', '').strip()

            # get level from title
            level = utils.get_level_from_title(title)

            # Get the link to the event page
            eventLink = a_tag.get('href')
            
            # Locate the div containing the location span
            location_div = a_tag.find_parent('div', class_='activity-card-info')
            location_span = location_div.find('div', class_='activity-card-info__location').find('span')
            location = location_span.get_text() if location_span else 'No location'

            # Get the venue type from the location string
            venueType = utils.get_venue_type_from_location(location)

            # Find the div containing event props
            props_div = location_div.find('div', class_='activity-card-info__props')

            event_number_span = props_div.find('span', class_='activity-card-info__number').find('span')
            eventID = event_number_span.get_text() if event_number_span else 'No event number'

            ages_span = props_div.find('span', class_='activity-card-info__ages')
            ages = ages_span.get_text() if ages_span else 'No age group'
            ages = ages[:-1]
            ages = ages.replace(" ", "")

            openings_span = props_div.find('span', class_='activity-card-info__openings').find('span')
            openings = openings_span.get_text() if openings_span else 'No openings'
            openings_text = openings_span.get_text().strip()  # Get the text and remove extra spaces
            openings = openings_text.split()[-1]  # Get the last part, which should be the number of openings 

            # get status from openings
            status = utils.get_status_from_openings(openings)

            # Find the div containing the datetime
            datetime_div = a_tag.find_parent('div', class_='activity-card-info')

            if datetime_div:
                # Extract the date
                date_span = datetime_div.find('span', class_='activity-card-info__dateRange')
                eventDate = date_span.get_text().strip() if date_span else 'No date'

                # Extract the time range
                time_range_span = datetime_div.find('span', class_='activity-card-info__timeRange')
                eventTime = time_range_span.get_text().strip() if time_range_span else 'No time range'

            if eventLink:
              events.append({
                  'title': title,
                  'eventID': eventID,
                  'location': location,
                  'eventLink': eventLink,
                  'venueType': venueType,
                  'category': 'Drop-in',
                  'level': level,
                  'ages': ages,
                  'openings': openings,
                  "status": status,
                  'eventDate': eventDate,
                  'eventTime': eventTime,
                  'fee': "Pay in person"
              })

        # Debugging: Print the found events with locations, event numbers, categories, ages, and openings
        if not events:
            print("No matching volleyball events found.")
        else:
            print("Found events with Details:")
            # for event in events:
            #     print(f"event Link: {event['eventLink']}, Location: {event['location']}, "
            #     f"event ID: {event['eventID']}, Venue Type: {event['venueType']}, "
            #     f"Ages: {event['ages']}, Openings: {event['openings']}, "
            #     f"Date: {event['eventDate']}, Time: {event['eventTime']}")
        
        utils.save_to_json(events)

    except Exception as e:
        print(f"Error scraping events: {e}")

    finally:
        driver.quit()

# Run the scraper
scrape_volleyball_events()
