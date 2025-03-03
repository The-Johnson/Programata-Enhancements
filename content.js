(function() {
    // Helper: Determine the ISO country code using regex patterns.
    function getCountryCode(countryName) {
      if (!countryName) return null;
      const normalized = countryName.trim().toLowerCase();
      const patterns = [
        { regex: /^(usa|united states|сащ|съединени\s+щати)$/, code: 'US' },
        { regex: /^(bulgaria|българия)$/, code: 'BG' },
        { regex: /^(uk|united kingdom|great britain|великобритания|англия)$/, code: 'GB' },
        { regex: /^(germany|german|германия|германиия)$/, code: 'DE' },
        { regex: /^(france|french|франция)$/, code: 'FR' },
        { regex: /^(italy|italian|италия)$/, code: 'IT' },
        { regex: /^(spain|spanish|испания)$/, code: 'ES' },
        { regex: /^(canada|канада)$/, code: 'CA' },
        { regex: /^(australia|австралия)$/, code: 'AU' },
        { regex: /^(netherlands|holland|нидерландия|холандия)$/, code: 'NL' },
        { regex: /^(poland|polish|полша)$/, code: 'PL' },
        { regex: /^(romania|romanian|румъния)$/, code: 'RO' },
        { regex: /^(greece|greek|гърция)$/, code: 'GR' },
        { regex: /^(russia|russian|русия)$/, code: 'RU' },
        { regex: /^(sweden|swedish|швеция)$/, code: 'SE' },
        { regex: /^(norway|norwegian|норвегия)$/, code: 'NO' },
        { regex: /^(denmark|danish|дания)$/, code: 'DK' },
        { regex: /^(finland|finnish|финландия)$/, code: 'FI' },
        { regex: /^(switzerland|swiss|швейцария)$/, code: 'CH' },
        { regex: /^(austria|austrian|австрия)$/, code: 'AT' },
        { regex: /^(portugal|portuguese|португалия)$/, code: 'PT' },
        { regex: /^(belgium|belgian|белгия)$/, code: 'BE' },
        { regex: /^(czech republic|czech|чехия|чешка\s+република)$/, code: 'CZ' },
        { regex: /^(slovakia|slovakian|словашко|словашка\s+република)$/, code: 'SK' },
        { regex: /^(hungary|hungarian|унгария)$/, code: 'HU' },
        { regex: /^(croatia|croatian|хърватия)$/, code: 'HR' },
        { regex: /^(serbia|serbian|сърбия)$/, code: 'RS' },
        { regex: /^(slovenia|slovenian|словения)$/, code: 'SI' },
        { regex: /^(bosnia|bosnia and herzegovina|босна|босна\s+и\s+херцеговина)$/, code: 'BA' },
        { regex: /^(montenegro|montenegrin|черна\s+гора)$/, code: 'ME' },
        { regex: /^(north macedonia|macedonia|северна\s+македония|македония)$/, code: 'MK' },
        { regex: /^(albania|albanian|албания)$/, code: 'AL' },
        { regex: /^(turkey|turkish|турция)$/, code: 'TR' },
        { regex: /^(ukraine|ukrainian|украйна)$/, code: 'UA' },
        { regex: /^(belarus|belarusian|беларус|беларусия)$/, code: 'BY' },
        { regex: /^(latvia|latvian|латвия)$/, code: 'LV' },
        { regex: /^(lithuania|lithuanian|литва)$/, code: 'LT' },
        { regex: /^(estonia|estonian|естония)$/, code: 'EE' },
        { regex: /^(georgia|georgian|грузия)$/, code: 'GE' },
        { regex: /^(moldova|moldovan|молдова)$/, code: 'MD' },
        { regex: /^(cyprus|cypriot|кипър)$/, code: 'CY' },
        { regex: /^(malta|maltese|малта)$/, code: 'MT' },
        { regex: /^(luxembourg|luxembourgish|люксембург)$/, code: 'LU' },
        { regex: /^(iceland|icelandic|исландия)$/, code: 'IS' },
        // Add more patterns here as needed.
      ];
      for (const { regex, code } of patterns) {
        if (regex.test(normalized)) {
          return code;
        }
      }
      return null;
    }
  
    // Helper: Convert an ISO country code to a flag emoji.
    function getFlagEmoji(countryName) {
      if (!countryName) return "";
  
      // Split country names in case multiple countries are listed (e.g., "Франция, Германия")
      const countryNames = countryName.split(/\s*,\s*/); 
  
      const flags = countryNames.map(name => {
          const code = getCountryCode(name);
          if (!code) return null;
          return Array.from(code.toUpperCase())
              .map(letter => String.fromCodePoint(letter.charCodeAt(0) - 65 + 0x1F1E6))
              .join('');
      }).filter(Boolean); // Remove null values (countries not found)
  
      return flags.join(" "); // Join multiple flags with a space
    }
  
    // Find all movie title links within each .program-item.
    const movieLinks = document.querySelectorAll(".program-item a");
  
    movieLinks.forEach(link => {
      // Save the current text (without modifications) for later use.
      const baseTitle = link.textContent.trim();
  
      fetch(link.href)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Network error: ${response.status}`);
          }
          return response.text();
        })
        .then(htmlText => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(htmlText, "text/html");
  
          // Look for the element containing the original title.
          const originalTitleElem = doc.querySelector("div.text-summary-item");
          let originalTitle = null;
          if (originalTitleElem && originalTitleElem.textContent.includes("Оригинално заглавие:")) {
            originalTitle = originalTitleElem.textContent.split("Оригинално заглавие:")[1].trim();
          }
  
          // Check for country info by scanning for an element that includes "Държава:".
          let country = null;
          const countryElem = Array.from(doc.querySelectorAll("div.text-summary-item")).find(el => el.textContent.includes("Държава:"));
          if (countryElem) {
            country = countryElem.textContent.split("Държава:")[1].trim();
          }
  
          // Determine if the film is Bulgarian.
          const isBulgarian = country && (country.trim().toLowerCase() === "българия" || country.trim().toLowerCase() === "bulgaria");
  
          // For non-Bulgarian films, update the title with the original title if available.
          if (!isBulgarian && originalTitle) {
            const strongElem = link.querySelector("strong");
            if (strongElem) {
              strongElem.textContent = originalTitle;
            } else if (link.firstChild && link.firstChild.nodeType === Node.TEXT_NODE) {
              link.firstChild.nodeValue = originalTitle;
            } else {
              link.textContent = originalTitle;
            }
          }
  
          // Compute the icon size based on the computed font size of the link.
          const computedStyle = window.getComputedStyle(link);
          const fontSizePx = parseFloat(computedStyle.fontSize) || 16;
          const iconSize = fontSizePx * 2; // Adjust multiplier as needed.
  
          // If country info is found, get the flag emoji and append it.
          if (country) {
            const flagEmoji = getFlagEmoji(country);
            if (flagEmoji) {
              const flagSpan = document.createElement('span');
              flagSpan.textContent = " " + flagEmoji;
              // Set the flag emoji's size equal to the IMDb icon.
              flagSpan.style.fontSize = `${iconSize}px`;
              flagSpan.style.verticalAlign = 'middle';
              // Set a tooltip showing the country.
              flagSpan.title = `Държава: ${country}`;
              link.appendChild(flagSpan);
            }
          }
  
          // Create an IMDb icon link.
          const imdbLink = document.createElement('a');
          let imdbHref = "";
          if (isBulgarian) {
            // For Bulgarian films, use the base title (without flag emoji) for the Google search.
            imdbHref = `https://www.google.com/search?q=${encodeURIComponent(baseTitle + " IMDb")}`;
          } else {
            imdbHref = `https://www.imdb.com/find?q=${encodeURIComponent(originalTitle || baseTitle)}`;
          }
          imdbLink.href = imdbHref;
          imdbLink.target = '_blank';
          imdbLink.title = 'View on IMDb';
          imdbLink.style.marginLeft = '0.3em';
  
          // Create and size the IMDb icon image.
          const imdbIcon = document.createElement('img');
          imdbIcon.src = chrome.runtime.getURL('imdb-icon.png');
          imdbIcon.alt = 'IMDb';
          imdbIcon.style.width = `${iconSize}px`;
          imdbIcon.style.height = `${iconSize}px`;
          imdbIcon.style.verticalAlign = 'middle';
  
          imdbLink.appendChild(imdbIcon);
  
          // Insert the IMDb link right after the movie title link.
          link.parentNode.insertBefore(imdbLink, link.nextSibling);
        })
        .catch(error => {
          console.error(`Error fetching details for ${link.href}:`, error);
        });
    });
  })();
  