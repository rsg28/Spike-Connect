# burnaby-drop-in-scraper.py
from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
import time
import utils
import re

# URL to scrape for volleyball drop-in events
volleyball_url = 'https://cityofnewwestminster.perfectmind.com/23693/Clients/BookMe4BookingPages/Classes?calendarId=510214f6-df2d-4ead-9caf-e3883d73d090&widgetId=2edd14d7-7dee-4a06-85e1-e211553c48d5&embed=False'

# Setup Chrome options to run in headless mode
chrome_options = Options()
# chrome_options.add_argument("--headless")  # Run headlessly (without opening a browser window)
chrome_options.add_argument("--disable-gpu")  # Disable GPU acceleration

# Automatically download and set the correct ChromeDriver
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)

# New Westminster drop-in volleyball base URL
base_url = "https://cityofnewwestminster.perfectmind.com"

def scrape_volleyball_events():
    try:
        # Open the URL
        driver.get(volleyball_url)

        # Now scrape the page source using BeautifulSoup
        soup = BeautifulSoup(driver.page_source, 'html.parser')

        # List to store found events
        events = []

        service_filter = WebDriverWait(driver, 5).until(
            EC.visibility_of_element_located((By.CSS_SELECTOR, 'div[aria-label="Service"]'))
        )
        service_filter.click()

        service_filter_input = driver.find_element(By.XPATH, "//input[@aria-label='Enter text to search for filter values']")
        service_filter_input.send_keys('v')

        volleyball_checkbox = driver.find_element(By.XPATH, "//label[text() = 'Volleyball - Drop-in']")
        volleyball_checkbox.click()

        time.sleep(3)

        # Now that the page is updated, parse the new HTML
        soup = BeautifulSoup(driver.page_source, 'html.parser')

        # Find the session elements
        for session in soup.find_all("div", class_="bm-class-container"):
            header_div = session.find("div", class_="bm-class-header-wrapper")
            title = header_div.find("h3").get_text().strip()

            # get level from title
            level = utils.get_level_from_title(title)

            # Locate openings and link div
            openings_and_link_div = session.find("div", class_="bm-group-item-link")

            # Extract the number of openings
            openings_span = openings_and_link_div.find("div", class_="bm-spots-left-label").find("span")
            if openings_span:
                openings = openings_span.get_text().split()[0]  # Extract the number of spots
            else:
                openings = "Registration has not started yet."

            # Find the register div and button
            register_div = openings_and_link_div.find_all("div")[1]  # Index 1 to get the second div
            register_button = register_div.find("input", class_="bm-button")

            # Extract the 'onclick' value
            onclick_value = register_button['onclick']

            # Use regex to extract the URL inside the single quotes
            match = re.search(r"\'([^\']+)\'", onclick_value)
            if match:
                relative_url = match.group(1)
                full_url = base_url + relative_url
                eventLink = full_url
            
            # # Locate the div containing the location span
            # location_div = session.find_parent('div', class_='activity-card-info')
            # location_span = location_div.find('div', class_='activity-card-info__location').find('span')
            # location = location_span.get_text() if location_span else 'No location'

            # # Get the venue type from the location string
            # venueType = utils.get_venue_type_from_location(location)

            # # Find the div containing event props
            # props_div = location_div.find('div', class_='activity-card-info__props')

            # event_number_span = props_div.find('span', class_='activity-card-info__number').find('span')
            # eventID = event_number_span.get_text() if event_number_span else 'No event number'

            # ages_span = props_div.find('span', class_='activity-card-info__ages')
            # ages = ages_span.get_text() if ages_span else 'No age group'
            # ages = ages[:-1]
            # ages = ages.replace(" ", "")

            # openings_span = props_div.find('span', class_='activity-card-info__openings').find('span')
            # openings = openings_span.get_text() if openings_span else 'No openings'
            # openings_text = openings_span.get_text().strip()  # Get the text and remove extra spaces
            # openings = openings_text.split()[-1]  # Get the last part, which should be the number of openings 

            # # get status from openings
            # status = utils.get_status_from_openings(openings)

            # # Find the div containing the datetime
            # datetime_div = session.find_parent('div', class_='activity-card-info')

            # if datetime_div:
            #     # Extract the date
            #     date_span = datetime_div.find('span', class_='activity-card-info__dateRange')
            #     eventDate = date_span.get_text().strip() if date_span else 'No date'

            #     # Extract the time range
            #     time_range_span = datetime_div.find('span', class_='activity-card-info__timeRange')
            #     eventTime = time_range_span.get_text().strip() if time_range_span else 'No time range'

            # if eventLink:
            #   events.append({
            #       'title': title,
            #       'eventID': eventID,
            #       'location': location,
            #       'eventLink': eventLink,
            #       'venueType': venueType,
            #       'category': 'Drop-in',
            #       'level': level,
            #       'ages': ages,
            #       'openings': openings,
            #       "status": status,
            #       'eventDate': eventDate,
            #       'eventTime': eventTime,
            #       'fee': "Pay in person"
            #   })

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
        
        utils.save_to_json(events, "newwest")

    except Exception as e:
        print(f"Error scraping events: {e}")

    finally:
        driver.quit()

# Run the scraper
scrape_volleyball_events()
