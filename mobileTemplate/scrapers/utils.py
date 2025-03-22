import json
import os

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