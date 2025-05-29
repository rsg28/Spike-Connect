# newwest-drop-in-scraper.py
from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
from datetime import datetime, timedelta
import time
import utils
import re

# URL to scrape for volleyball drop-in events
volleyball_url = 'https://cityofnewwestminster.perfectmind.com/23693/Clients/BookMe4BookingPages/Classes?calendarId=510214f6-df2d-4ead-9caf-e3883d73d090&widgetId=2edd14d7-7dee-4a06-85e1-e211553c48d5&embed=False'

# Setup Chrome options to run in headless mode
chrome_options = Options()
chrome_options.add_argument("--headless=new")  # modern headless
chrome_options.add_argument("--window-size=1920,1080")
chrome_options.add_argument("--disable-blink-features=AutomationControlled")
chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
chrome_options.add_experimental_option("useAutomationExtension", False)

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
        time.sleep(1)

        # Now that the page is updated, parse the new HTML
        soup = BeautifulSoup(driver.page_source, 'html.parser')
            
        # Find the end date input field
        date_to_input = driver.find_element(By.CSS_SELECTOR, 'input[aria-labelledby="dateTo"]')
        # Find the calendar icon specifically for the end date field
        date_to_calendar_icon = date_to_input.find_element(By.XPATH, './following-sibling::span//span[contains(@class, "k-i-calendar")]')
        date_to_calendar_icon.click()

        # Find the "Next" button in the calendar
        next_month_button = driver.find_element(By.CSS_SELECTOR, 'a[data-action="next"][role="button"]')
        
        # Click the next twice
        driver.execute_script("arguments[0].click();", next_month_button)
        driver.execute_script("arguments[0].click();", next_month_button)
        time.sleep(1)  # Wait for calendar to update

        # Get the current month from the calendar header
        try:
            month_header = driver.find_element(By.CSS_SELECTOR, 'a.k-nav-fast')
            month_text = month_header.text  # e.g., "August 2025"
            month_name, year = month_text.split()
            
            # Convert month name to number (1-12)
            month_num = datetime.strptime(month_name, "%B").month
            
            # Get the last day of the month
            if month_num in [4, 6, 9, 11]:  # 30 days
                last_day = 30
            elif month_num == 2:  # February
                last_day = 29 if int(year) % 4 == 0 else 28  # Simple leap year check
            else:  # 31 days
                last_day = 31
                
            # Format the date string to match the website's format (YYYY/M/D)
            formatted_date = f"{year}/{month_num - 1}/{last_day}"
            
            # Find and click the last day
            date_element = driver.find_element(By.CSS_SELECTOR, f'a.k-link[data-value="{formatted_date}"]')
            date_element.click()
            print(f"Successfully clicked last day of {month_name}: {formatted_date}")
            time.sleep(1.5)
            
        except Exception as e:
            print(f"Error selecting date: {e}")
            raise

        # Now that the page is updated, parse the new HTML
        soup = BeautifulSoup(driver.page_source, 'html.parser')

        # Find the session elements
        for session in soup.find_all("div", class_="bm-class-container"):
            header_div = session.find("div", class_="bm-class-header-wrapper")
            title = header_div.find("h3").get_text().strip()

            # Extract event ID
            event_id_span = header_div.find("span", class_="bm-event-description", attrs={"aria-label": lambda x: x and "event" in x and not "Volleyball" in x})
            eventID = event_id_span.get_text().strip().replace('#', '')

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

            # Extract the event link
            match = re.search(r"\'([^\']+)\'", onclick_value)
            if match:
                relative_url = match.group(1)
                full_url = base_url + relative_url
                eventLink = full_url
            
            # Locate the div containing the location
            location_div = session.find("div", class_="location-block")
            location_text = location_div.find("span").get_text().strip()
            location = location_text.split('-')[0].strip() if '-' in location_text else location_text

            # get status from openings
            status = utils.get_status_from_openings(openings)

            # Extract the number of openings
            openings_span = openings_and_link_div.find("div", class_="bm-spots-left-label").find("span")
            if openings_span:
                openings = openings_span.get_text().split()[0]
            else:
                openings = "Unspecified"

            ages, fee, eventDate, eventTime = get_details_and_return(eventLink)

            # get status from openings
            status = utils.get_status_from_openings(openings)

            # Get venue type from location
            venueType = utils.get_venue_type_from_location(location)
            
            # Get the day of week
            dayOfWeek = utils.get_day_of_week(eventDate)

            if eventLink:
                events.append({
                    'title': title,
                    'eventID': eventID,
                    'location': location,
                    'city': 'New Westminster',
                    'eventLink': eventLink,
                    'venueType': venueType,
                    'category': 'Drop-in',
                    'level': level,
                    'ages': ages,
                    'openings': openings,
                    "status": status,
                    'eventDate': eventDate,
                    'eventTime': eventTime,
                    'dayOfWeek': dayOfWeek,
                    'fee': fee
                })
        
        utils.save_to_json(events, "newwest")

    except Exception as e:
        print(f"Error scraping events: {e}")

    finally:
        driver.quit()

def get_details_and_return(eventLink):
    """Click the details button and return to the original page"""
    try:
        # Open the details page in a new tab
        driver.execute_script(f"window.open('{eventLink}', '_blank');")
        
        # Switch to the new tab
        driver.switch_to.window(driver.window_handles[-1])

        # Extract the age text
        age_element = driver.find_element("xpath", "//div[contains(@class, 'bm-course-restrictions')]//div[contains(@class, 'row')]//div[contains(@class, 'second-column')]")
        age_text = age_element.text

        # Extract the adult fee
        fee_element = driver.find_element("xpath", "//div[contains(@class, 'bm-course-prices')]//div[contains(@class, 'row')]//div[contains(@class, 'first-column')][contains(text(), 'Adult')]/following-sibling::div//div[contains(@class, 'bm-price-tag')]")
        fee_text = fee_element.text

        # Find the time and date
        date_time_span = driver.find_element(By.XPATH, "//span[contains(@aria-label, 'Event date')]")
        raw_date = date_time_span.text
        date_parts = raw_date.split('-')
        
        # Format the date in a standard format (Month Day, Year)
        formatted_date = f"{date_parts[1]} {date_parts[0]}, {date_parts[2]}"
        
        # Standardize the date format to ISO (YYYY-MM-DD)
        eventDate = utils.standardize_date(formatted_date)

        time_span = driver.find_element(By.XPATH, "//span[contains(@aria-label, 'Event time')]")
        eventTime = time_span.text.upper()

        # Close the details tab
        driver.close()
        
        # Switch back to the main tab
        driver.switch_to.window(driver.window_handles[0])

        return age_text, fee_text, eventDate, eventTime
        
    except Exception as e:
        print(f"Error in get_details_and_return: {e}")
        # Make sure we switch back to the main tab even if there's an error
        if len(driver.window_handles) > 1:
            driver.close()
            driver.switch_to.window(driver.window_handles[0])
        return "Unknown", "Unknown", "Unknown", "Unknown"

# Run the scraper
scrape_volleyball_events()
