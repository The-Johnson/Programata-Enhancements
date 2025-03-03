# Programata.bg Fix

This browser extension enhances film listings by:  
- Replacing translated movie titles with their original titles.  
- Adding country flags next to each film's name.  
- Providing quick IMDb search links for each movie.  

## Features  
✅ **Original Titles**: If a movie is not Bulgarian, its original title is displayed instead of the translated one.  
✅ **Country Flags**: Flags are added based on the film's country of origin. Multiple flags appear if a film has multiple countries.  
✅ **IMDb Search Links**: Clickable IMDb icons let you quickly look up films.  

## How It Works  
1. The script scans movie listings.  
2. It fetches the film’s details from its individual page.  
3. If an original title is found, it replaces the translated title.  
4. The script extracts the country/countries and displays the appropriate flag(s).  
5. An IMDb search link is appended next to the movie title.  

## Installation  
Available on the Chrome Web Store

OR

1. Download or clone this repository.  
2. Load it as an **unpacked extension** in your browser:  
   - Go to `chrome://extensions/` (or the equivalent in your browser).  
   - Enable **Developer Mode** (top right).  
   - Click **Load Unpacked** and select the folder.  
3. Enjoy enhanced movie listings!  

## Technical Details  
- Uses **regular expressions** to match country names in multiple languages (including Bulgarian).  
- **Handles multiple countries** by splitting them and adding all relevant flags.  
- Uses **DOM manipulation** to replace text and append elements.  
- Supports **dynamic font sizing** for flags and icons to match the site’s styling.  

## To-Do / Future Improvements  
- Add more country name variations to improve recognition.  
- Optimize IMDb search results using direct IMDb API (if available).  
- Add original Movie Posters next to movie titles
- Add functionality to find the original title even if it's not listed on the details page.

## Contributing  
Feel free to submit **pull requests** or suggest improvements.  

## License  
This project is open-source and available under the MIT License.  

---
  
🚀 **Enjoy better movie listings with country flags & IMDb links!** 🎬  
