(function() {
  const POSTER_WIDTH = 110; // Adjust as needed


  function fixPhoneticTypos(str) {
    // Mapping based on the Bulgarian phonetic QWERTY layout:
    // Latin:   qwertyuiop[]asdfghjkl;'`zxcvbnm,./
    // Cyrillic: чшертъуиопящасдфгхйкл;ўюзжцвбнм,./
    const mapping = {
      'q': 'ч', 'w': 'ш', 'e': 'е',
      'r': 'р', 't': 'т', 'y': 'ъ',
      'u': 'у', 'i': 'и', 'o': 'о',
      'p': 'п','[': 'я', ']': 'щ',
      'a': 'а', 's': 'с', 'd': 'д',
      'f': 'ф', 'g': 'г', 'h': 'х',
      'j': 'й', 'k': 'к', 'l': 'л',
      '`': 'ю', 'z': 'з', 'x': 'ж',
      'c': 'ц', 'v': 'в', 'b': 'б',
      'n': 'н', 'm':'м'
    };
    let result = "";
    // Apply mapping if the string is intended to be in Bulgarian (i.e. contains any Cyrillic letters)
    if (/[А-Яа-яЁё]/.test(str)) {
      for (let char of str) {
        const lowerChar = char.toLowerCase();
        if (mapping.hasOwnProperty(lowerChar)) {
          result += (char === char.toUpperCase() && /[a-z]/.test(char))
            ? mapping[lowerChar].toUpperCase()
            : mapping[lowerChar];
        } else {
          result += char;
        }
      }
      return result;
    }
    return str;
  }
  
  function sanitizeQuery(query) {
    let sanitized = query.normalize("NFC").replace(/[\uFFFD]/g, "е");
    sanitized = fixPhoneticTypos(sanitized);
    return sanitized;
  }
  

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
      { regex: /^(iceland|icelandic|исландия)$/, code: 'IS' }
    ];
    for (const { regex, code } of patterns) {
      if (regex.test(normalized)) {
        return code;
      }
    }
    return null;
  }

  // Helper: Convert a country string (may contain multiple countries) to flag emoji(s)
  function getFlagEmoji(countryName) {
    if (!countryName) return "";
    // Split by common delimiters: comma, slash, hyphen, etc.
    const countryNames = countryName.split(/[\s,\/\-]+/);
    const flags = countryNames.map(name => {
      const code = getCountryCode(name);
      if (!code) return null;
      return Array.from(code.toUpperCase())
        .map(letter => String.fromCodePoint(letter.charCodeAt(0) - 65 + 0x1F1E6))
        .join('');
    }).filter(Boolean);
    return flags.join(" ");
  }

  // TMDb API call: Search movie by title
  function fetchTmdbSearch(query) {
    const sanitizedQuery = sanitizeQuery(query);
    // Route the request through your proxy. Note: the correct URL includes the endpoint parameter.
    const url = `https://programata-api-proxy.vnr5z46jcc.workers.dev/?endpoint=/3/search/movie?query=${encodeURIComponent(sanitizedQuery)}`;
    return fetch(url, {
      headers: {
        accept: 'application/json'
      }
    }).then(response => {
      if (!response.ok) throw new Error(`TMDb API error: ${response.status}`);
      return response.json();
    });
  }
  
  // TMDb API call: Get external IDs (to fetch IMDb ID)
  function fetchTmdbExternalIds(tmdbId) {
    const url = `https://programata-api-proxy.vnr5z46jcc.workers.dev/?endpoint=/3/movie/${tmdbId}/external_ids`;
    return fetch(url, {
      headers: {
        accept: 'application/json'
      }
    }).then(response => {
      if (!response.ok) throw new Error(`TMDb External IDs error: ${response.status}`);
      return response.json();
    });
  }  

  // OMDb API call: Get ratings using IMDb ID
  function fetchOmdbData(imdbID) {
    // Route the OMDb request through your proxy.
    const url = `https://programata-api-proxy.vnr5z46jcc.workers.dev/?endpoint=/?i=${imdbID}`;
    return fetch(url, {
      headers: {
        accept: 'application/json'
      }
    }).then(response => {
      if (!response.ok) throw new Error(`OMDb API error: ${response.status}`);
      return response.json();
    });
  }  

  // Fallback function to scrape poster if API call for it fails.
  function fallbackInsertPoster(link, fallbackUrl) {
    if (!fallbackUrl) return;
    const container = link.closest('.program-item');
    if (!container) return;
  
    // Transform container into a flex layout if not already done.
    if (!container.classList.contains('flexified')) {
      container.style.display = "flex";
      container.style.alignItems = "stretch"; // Items stretch vertically.
    
      const contentWrapper = document.createElement('div');
      contentWrapper.style.flexGrow = "1"; // Content takes remaining space.
    
      // Move all existing child nodes into the content wrapper.
      while (container.firstChild) {
        contentWrapper.appendChild(container.firstChild);
      }
      container.appendChild(contentWrapper);
      container.classList.add('flexified');
    }
  
    // Use fallbackUrl as both low-res and high-res (since we only have one URL).
    const posterLink = document.createElement('a');
    posterLink.href = fallbackUrl;
    posterLink.target = "_blank";
    posterLink.title = "Click to view high-resolution poster (fallback)";
    
    const posterImg = document.createElement('img');
    posterImg.src = fallbackUrl;
    posterImg.alt = 'Movie Poster (Fallback)';
    posterImg.style.width = `${POSTER_WIDTH}px`;
    posterImg.style.height = "100%";           // Span full container height.
    posterImg.style.objectFit = "cover";        // Maintain aspect ratio.
    posterImg.style.marginRight = "0.5em";
    
    posterLink.appendChild(posterImg);
    container.insertBefore(posterLink, container.firstChild);
  }
  

  // Insert poster image as a left column spanning the full vertical height of the program-item.
  function insertPoster(link, posterPath) {
    if (!posterPath) return;
    const container = link.closest('.program-item');
    if (!container) return;
  
    // Transform container into a flex layout if not already done.
    if (!container.classList.contains('flexified')) {
      container.style.display = "flex";
      container.style.alignItems = "stretch"; // Items stretch vertically.
  
      const contentWrapper = document.createElement('div');
      contentWrapper.style.flexGrow = "1"; // Content takes remaining space.
  
      // Move all existing child nodes into the content wrapper.
      while (container.firstChild) {
        contentWrapper.appendChild(container.firstChild);
      }
      container.appendChild(contentWrapper);
      container.classList.add('flexified');
    }
  
    // Construct the low-res and high-res poster URLs.
    const posterUrl = `https://image.tmdb.org/t/p/w200${posterPath}`;
    const highResPosterUrl = `https://image.tmdb.org/t/p/w1280${posterPath}`;
  
    // Create the poster image element.
    const posterImg = document.createElement('img');
    posterImg.src = posterUrl;
    posterImg.alt = 'Movie Poster';
    posterImg.style.width = `${POSTER_WIDTH}px`;
    posterImg.style.height = "100%";            // Span full container height.
    posterImg.style.objectFit = "cover";         // Maintain aspect ratio.
    posterImg.style.marginRight = "0.5em";
  
    // Wrap the image in an anchor linking to the high-res poster.
    const posterLink = document.createElement('a');
    posterLink.href = highResPosterUrl;
    posterLink.target = "_blank";
    posterLink.title = "Click to view high-resolution poster";
    posterLink.appendChild(posterImg);
  
    // Insert the anchor (with poster image) as the first child of the container.
    container.insertBefore(posterLink, container.firstChild);
  }  

  // Helper: Create a rating icon with visible text.
  function createRatingIcon(src, rating, platformName) {
    const wrapper = document.createElement('span');
    wrapper.style.display = "inline-flex";
    wrapper.style.alignItems = "center";
    wrapper.style.marginRight = "8px"; // Space between ratings

    const img = document.createElement('img');
    img.src = chrome.runtime.getURL(src);
    img.alt = platformName;
    img.style.width = "16px";
    img.style.height = "16px";
    img.style.verticalAlign = "middle";
    img.title = `${platformName} rating: ${rating || "N/A"}`; // Tooltip

    const text = document.createElement('span');
    text.textContent = ` ${rating || "N/A"}`;
    text.style.fontSize = "14px";
    text.style.marginLeft = "4px"; // Space between icon and text

    wrapper.appendChild(img);
    wrapper.appendChild(text);
    return wrapper;
  }

  // Insert ratings below the title.
  function insertRatings(link, omdbData) {
    const ratingsDiv = document.createElement('div');
    ratingsDiv.style.fontSize = '14px';
    ratingsDiv.style.marginTop = '4px';

    // Always show IMDb, Rotten Tomatoes, and Metacritic.
    const imdbRating = omdbData.imdbRating || "N/A";
    let rottenRating = "N/A";
    let metacriticRating = "N/A";

    if (omdbData.Ratings && Array.isArray(omdbData.Ratings)) {
      omdbData.Ratings.forEach(r => {
        if (r.Source === "Rotten Tomatoes") {
          rottenRating = r.Value;
        }
      });
    }
    if (omdbData.Metascore) {
      metacriticRating = omdbData.Metascore;
    }

    // Create icons (assume these images exist in your extension's folder)
    const imdbIconEl = createRatingIcon("imdb-icon.png", imdbRating, "IMDb");
    const rottenIconEl = createRatingIcon("rt-icon.png", rottenRating, "Rotten Tomatoes");
    const metacriticIconEl = createRatingIcon("metacritic-icon.png", metacriticRating, "Metacritic");

    ratingsDiv.appendChild(imdbIconEl);
    ratingsDiv.appendChild(rottenIconEl);
    ratingsDiv.appendChild(metacriticIconEl);

    // Append ratings container to the program-item div (below the title block)
    link.parentNode.appendChild(ratingsDiv);
  }

  // Find all movie title links within each .program-item.
  const movieLinks = document.querySelectorAll(".program-item a");

  movieLinks.forEach(link => {
    const baseTitle = link.textContent.trim();

    fetch(link.href)
      .then(response => {
        if (!response.ok) throw new Error(`Network error: ${response.status}`);
        return response.text();
      })
      .then(htmlText => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, "text/html");

        // Try to get original title from details page.
        const originalTitleElem = doc.querySelector("div.text-summary-item");
        let originalTitle = null;
        if (originalTitleElem && originalTitleElem.textContent.includes("Оригинално заглавие:")) {
          originalTitle = originalTitleElem.textContent.split("Оригинално заглавие:")[1].trim();
        }

        // Check for country info.
        let country = null;
        const countryElem = Array.from(doc.querySelectorAll("div.text-summary-item"))
                                .find(el => el.textContent.includes("Държава:"));
        if (countryElem) {
          country = countryElem.textContent.split("Държава:")[1].trim();
        }

        // Determine if film is Bulgarian.
        const isBulgarian = country && (country.trim().toLowerCase() === "българия" || country.trim().toLowerCase() === "bulgaria");

        // Add flag(s) if country info exists.
        if (country) {
          const flagEmoji = getFlagEmoji(country);
          if (flagEmoji) {
            const flagSpan = document.createElement('span');
            flagSpan.textContent = " " + flagEmoji;
            // Use same font size as our rating icons.
            flagSpan.style.fontSize = "24px";
            flagSpan.style.verticalAlign = 'middle';
            flagSpan.title = `Държава: ${country}`;
            link.appendChild(flagSpan);
          }
        }

        // For non-Bulgarian films, update title if original title found.
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

        // Compute icon size (for ratings and IMDb icon) based on the link's font size.
        const computedStyle = window.getComputedStyle(link);
        const fontSizePx = parseFloat(computedStyle.fontSize) || 16;
        // iconSize is used only for rating icons in this version.

        // Use TMDb API to fetch movie data (for poster, original title if missing, and IMDb ID).
        // Use sanitized query.
        const queryTitle = originalTitle || baseTitle;
        fetchTmdbSearch(queryTitle)
        .then(data => {
          if (data && data.results && data.results.length > 0) {
            const movie = data.results[0];
            // Update title using original_language logic.
            if (movie.original_title) {
              let newTitle = "";
              if (movie.original_language === "en" || movie.original_language === "bg") {
                newTitle = movie.original_title;
              } else {
                newTitle = `${movie.title} (${movie.original_title})`;
              }
              const strongElem = link.querySelector("strong");
              if (strongElem) {
                strongElem.textContent = newTitle;
              } else if (link.firstChild && link.firstChild.nodeType === Node.TEXT_NODE) {
                link.firstChild.nodeValue = newTitle;
              } else {
                link.textContent = newTitle;
              }
            }
            // Insert poster: use TMDb poster_path if available; otherwise, fallback to scraping.
            if (movie.poster_path && typeof movie.poster_path === "string" && movie.poster_path.trim() !== "") {
              insertPoster(link, movie.poster_path);
            } else {
              const fallbackPosterElem = doc.querySelector("img.wp-post-image, img.attachment-post-thumbnail, img.poster, img.thumbnail, img.cover");
              if (fallbackPosterElem && fallbackPosterElem.src) {
                fallbackInsertPoster(link, fallbackPosterElem.src);
              } else {
              }
            }
            // Proceed to fetch external IDs.
            return fetchTmdbExternalIds(movie.id);
          } else {
            // No TMDb result; use fallback methods.
            const fallbackPosterElem = doc.querySelector("img.wp-post-image, img.attachment-post-thumbnail, img.poster, img.thumbnail, img.cover");
            if (fallbackPosterElem && fallbackPosterElem.src) {
              fallbackInsertPoster(link, fallbackPosterElem.src);
            } else {
            }
            // Update title to the baseTitle as fallback.
            const strongElem = link.querySelector("strong");
            if (strongElem) {
              strongElem.textContent = baseTitle;
            } else if (link.firstChild && link.firstChild.nodeType === Node.TEXT_NODE) {
              link.firstChild.nodeValue = baseTitle;
            } else {
              link.textContent = baseTitle;
            }
            // Return a resolved Promise with null so the chain continues without external IDs.
            return Promise.resolve(null);
          }
        })
        
        
        .then(externalData => {
          if (externalData && externalData.imdb_id) {
            const imdbID = externalData.imdb_id;
            // Create direct IMDb link.
            const imdbLink = document.createElement('a');
            imdbLink.href = `https://www.imdb.com/title/${imdbID}/`;
            imdbLink.target = '_blank';
            imdbLink.title = 'View on IMDb';
            imdbLink.style.marginLeft = '0.3em';
            const imdbIcon = document.createElement('img');
            imdbIcon.src = chrome.runtime.getURL('imdb-icon.png');
            imdbIcon.alt = 'IMDb';
            imdbIcon.style.width = "24px";
            imdbIcon.style.height = "24px";
            imdbIcon.style.verticalAlign = 'middle';
            imdbLink.appendChild(imdbIcon);
            link.parentNode.insertBefore(imdbLink, link.nextSibling);
            // Now query OMDb for ratings using the IMDb ID.
            return fetchOmdbData(imdbID);
          } else {
            // If no externalData (TMDb did not return external IDs), resolve with null.
            return Promise.resolve(null);
          }
        })
        .then(omdbData => {
          if (omdbData && omdbData.Response === "True") {
            insertRatings(link, omdbData);
          } else {
            // If OMDb data is missing, insert ratings with "N/A" values.
            insertRatings(link, { imdbRating: "N/A", Ratings: [], Metascore: "N/A" });
          }
        })
        
          .catch(err => {
            console.error(`Error during TMDb/OMDb lookup for "${baseTitle}":`, err);
          });
      })
      .catch(error => {
        console.error(`Error fetching details for ${link.href}:`, error);
      });
  });
})();