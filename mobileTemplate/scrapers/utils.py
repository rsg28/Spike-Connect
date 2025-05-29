import json
import os
from datetime import datetime

def standardize_date(date_str):
    """
    Convert various date formats to a standardized ISO format (YYYY-MM-DD).
    This makes date parsing and comparison much easier in the frontend.
    """
    try:
        # Try different date formats
        formats = [
            "%B %d, %Y",  # April 11, 2025
            "%b %d, %Y",  # Apr 12, 2025
            "%d-%b-%Y",   # 12-Apr-2025
            "%Y-%m-%d",   # 2025-04-12
            "%m/%d/%Y",   # 04/12/2025
            "%d/%m/%Y"    # 12/04/2025
        ]
        
        for fmt in formats:
            try:
                date_obj = datetime.strptime(date_str, fmt)
                return date_obj.strftime("%Y-%m-%d")  # Returns ISO format (YYYY-MM-DD)
            except ValueError:
                continue
                
        # If none of the formats work, raise an exception
        raise ValueError(f"Could not parse date: {date_str}")
        
    except Exception as e:
        print(f"Error standardizing date: {e}")
        return date_str  # Return original string if parsing fails

def get_day_of_week(date_str):
    try:
        # First standardize the date
        iso_date = standardize_date(date_str)
        
        # Parse the ISO date
        date_obj = datetime.strptime(iso_date, "%Y-%m-%d")
        return date_obj.strftime("%A")  # Returns full day name (Monday, Tuesday, etc.)
        
    except Exception as e:
        print(f"Error getting day of week: {e}")
        return "Unknown" 

def save_to_json(events, city):
    directory = "../assets/data"
    file_path = os.path.join(directory, f'{city}-drop-in-sessions.json')
    
    with open(file_path, "w") as f:
        json.dump(events, f, indent=4)
    
    print(f"Data saved successfully in {file_path}")

def get_venue_type_from_location(location):
    location_lower = location.lower()
    if "centre" in location_lower or "complex" in location_lower or "gymnasium" in location_lower or "gym" in location_lower:
        return "Indoor"
    elif "beach" in location_lower or "sand" in location_lower in location_lower or "banks" in location_lower:
        return "Beach"
    elif "grass" in location_lower:
        return "Grass"
    else:
        return "Not Specified"
    
def get_status_from_openings(openings):
    openings = openings.lower()
    if openings == "0" or "full" in openings:
        return "Full"
    else:
        return "Open"
    
def get_level_from_title(title):
    title_lower = title.lower()
    if "beginner" in title_lower:
        return "Beginner"
    elif "intermediate" in title_lower:
        return "Intermediate"
    elif "advanced" in title_lower:
        return "Advanced"
    else:
        return "All Levels"
