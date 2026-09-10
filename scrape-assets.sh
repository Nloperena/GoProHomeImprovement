#!/usr/bin/env bash
# scrape-assets.sh — Pulls all media and per-page HTML from goprohomeimprovements.com
# Run from the new Astro project root. Creates ./scrape/ with raw HTML and ./public/images/ with organized media.
#
# Requires: curl, pup (https://github.com/ericchiang/pup) OR python3+beautifulsoup4
# Install pup: brew install pup  (or) go install github.com/ericchiang/pup@latest

set -euo pipefail

BASE="https://goprohomeimprovements.com"
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Go Pro Rebuild Scraper"

mkdir -p scrape public/images/{hero,services,work,about,gallery,logos}

# --- 1. Download every page HTML for reference ---
PAGES=(
  "/"
  "/about/"
  "/our-work/"
  "/contact/"
  "/service/power-washing/"
  "/service/interior-exterior-painting/"
  "/service/demolition-work/"
  "/service/trim-crown-molding/"
  "/service/wallpaper/"
  "/service/murals/"
  "/service/wall-mount-tv-installations/"
  "/service/movie-room-designs-installations/"
  "/service/drywall-texture-install/"
)

for p in "${PAGES[@]}"; do
  fname="scrape/$(echo "$p" | sed 's|/|_|g; s|^_||; s|_$||').html"
  [[ "$fname" == "scrape/.html" ]] && fname="scrape/home.html"
  echo "Fetching $p → $fname"
  curl -sSL -A "$UA" "$BASE$p" -o "$fname"
done

# --- 2. Extract all image URLs from all pages ---
echo ""
echo "Extracting image URLs..."
grep -hoE 'https://b1243227\.smushcdn\.com/[^"'"'"' ]+\.(jpg|jpeg|png|webp)[^"'"'"' ]*' scrape/*.html | sort -u > scrape/all-image-urls.txt
grep -hoE 'https://goprohomeimprovements\.com/wp-content/uploads/[^"'"'"' ]+\.(jpg|jpeg|png|webp|svg|ico)[^"'"'"' ]*' scrape/*.html | sort -u >> scrape/all-image-urls.txt
sort -u scrape/all-image-urls.txt -o scrape/all-image-urls.txt

echo "Found $(wc -l < scrape/all-image-urls.txt) unique image URLs"

# --- 3. Download logos + favicon ---
echo ""
echo "Downloading brand assets..."
curl -sSL -A "$UA" "$BASE/favicon.ico" -o public/favicon.ico
curl -sSL -A "$UA" "https://b1243227.smushcdn.com/1243227/wp-content/uploads/2019/02/SiteLogo.png?lossy=1&strip=1&webp=1" -o public/images/logos/site-logo.png
curl -sSL -A "$UA" "https://b1243227.smushcdn.com/1243227/wp-content/uploads/2019/02/FooterLogo.png?lossy=1&strip=1&webp=1" -o public/images/logos/footer-logo.png

# --- 4. Bulk-download every referenced image ---
echo ""
echo "Bulk downloading all referenced images to public/images/gallery/..."
while IFS= read -r url; do
  # Derive a filename: strip query string, take last path segment
  fname=$(echo "$url" | sed 's|?.*||' | awk -F/ '{print $NF}')
  # Dedupe by size hash suffix — Smush generates many resized variants of the same original
  out="public/images/gallery/$fname"
  if [[ ! -f "$out" ]]; then
    curl -sSL -A "$UA" "$url" -o "$out" || echo "  FAILED: $url"
  fi
done < scrape/all-image-urls.txt

echo ""
echo "Done. Review:"
echo "  - scrape/*.html       → reference HTML for each page"
echo "  - scrape/all-image-urls.txt → full URL list"
echo "  - public/images/gallery/    → every image downloaded"
echo "  - public/images/logos/      → logo files"
echo "  - public/favicon.ico        → favicon"
echo ""
echo "Next: manually sort /gallery/ into /hero/, /services/, /work/, /about/"
echo "      or match by filename pattern (IMG_7777* → painting, OurWork* → portfolio, etc.)"
