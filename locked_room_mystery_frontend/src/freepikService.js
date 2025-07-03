//
// Freepik API Utility Service for asset searching
//
// Uses Freepik API key for authenticated search requests
//

const FREEPIK_API_KEY = "FPSXea76cd23d3f1cbe367c46ca0681847d3";
const API_BASE_URL = "https://api.freepik.com/v1/resources"; // See Freepik API docs for correct endpoint

/**
 * PUBLIC_INTERFACE
 * fetchFreepikImages - Search Freepik for images based on a search query.
 *
 * @param {string} query The search query (e.g., "cartoon detective")
 * @param {number} [limit=8] Number of images to fetch.
 * @returns {Promise<{ results: Array<{ id: string, title: string, url: string, thumbnail: string }> }>} Array of image info or empty if error.
 */
export async function fetchFreepikImages(query, limit = 8) {
  /** This is a public function. */
  // Upgraded: try multiple top queries for visual/thematic fit, and gracefully deduplicate/merge results
  const upgradedQueries = [
    query,
    query + " detective evidence crime comic illustration",
    query + " cartoon mystery scene",
    "noir detective mystery cartoon",
    "crime scene illustration minimal",
    "locked room mystery cartoon"
  ];

  let fetched = [];
  let seen = new Set();

  for (let i = 0; i < upgradedQueries.length && fetched.length < limit; ++i) {
    const apiUrl = `${API_BASE_URL}/search?term=${encodeURIComponent(upgradedQueries[i])}&limit=${Math.max(6, limit * 2)}`;
    try {
      const response = await fetch(apiUrl, {
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${FREEPIK_API_KEY}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Adapt to Freepik response structure
        const candidates = (data.resources || data.data || []).map(item => ({
          id: item.id || item.identifier,
          title: item.title || item.slug,
          url: item.url || (item.assets && item.assets.preview_url) || "#",
          thumbnail:
            item.thumbnail_url ||
            (item.assets && item.assets.preview_url) ||
            (item.images && item.images['200_200']) ||
            "#"
        }));

        // Filter: Thematic fit in title or url, strong visual cues
        const filtered = candidates.filter(img => {
          const t = (img.title || "").toLowerCase();
          return (
            t.includes("detective") ||
            t.includes("crime") ||
            t.includes("scene") ||
            t.includes("mystery") ||
            t.includes("noir") ||
            t.includes("investigation") ||
            t.includes("evidence")
          );
        });

        // De-duplicate and aggregate
        filtered.forEach(img => {
          if (!seen.has(img.id) && fetched.length < limit) {
            seen.add(img.id);
            fetched.push(img);
          }
        });
      }
    } catch (error) {
      // Continue to next query, only log once if totally broken
      if (i === 0) console.error("Error fetching Freepik assets:", error);
      continue;
    }
  }

  if (fetched.length === 0) {
    // Fallback
    fetched.push({
      id: "fallback-generic-cartoon",
      title: "Detective finds murdered man (fallback Freepik)",
      url: "https://img.freepik.com/free-vector/detective-finds-murdered-man_1308-37349.jpg?w=680",
      thumbnail: "https://img.freepik.com/free-vector/detective-finds-murdered-man_1308-37349.jpg?w=250"
    });
  }

  return { results: fetched.slice(0, limit) };
}

/**
 * PUBLIC_INTERFACE
 * fetchCrimeSceneIllustrations - Fetches multiple highly themed detective crime scene room cartoons from Freepik.
 * Uses advanced queries and strict visual filtering for maximum thematic relevance and fallback support.
 * Returns up to 'maxImages' strong-fitting results.
 *
 * @param {number} maxImages - Max images to return (default: 4)
 * @returns {Promise<{ images: Array<{ id: string, title: string, url: string, thumbnail: string }> }>}
 */
export async function fetchCrimeSceneIllustrations(maxImages = 4) {
  // Advanced query logic: try a series of thematic, specificity-ranked queries for best visual/thematic fit.
  const queries = [
    "cartoon detective crime scene room noir minimal",
    "locked room mystery cartoon illustration",
    "cartoon clue evidence crime scene board",
    "cartoon investigation detective scene",
    "noir detective cartoon digital art",
    "crime scene cartoon isometric",
    "crime scene cartoon illustration",
    "cartoon evidence board scene"
  ];
  let allFetched = [];
  let seenIds = new Set();

  for (let i = 0; i < queries.length && allFetched.length < maxImages; ++i) {
    const { results } = await fetchFreepikImages(queries[i], Math.max(6, maxImages * 2));
    // Aggressive post-filtering: confirm fit by keywords, avoid obvious outliers
    const filtered = (results || []).filter(img => {
      const t = (img.title || "").toLowerCase();
      return (
        (t.includes("crime") && (t.includes("scene") || t.includes("detective") || t.includes("mystery"))) ||
        t.includes("investigation") ||
        t.includes("locked room") ||
        t.includes("noir") ||
        t.includes("clue") ||
        t.includes("evidence")
      );
    });
    filtered.forEach(img => {
      if (!seenIds.has(img.id) && allFetched.length < maxImages) {
        seenIds.add(img.id);
        allFetched.push(img);
      }
    });
  }

  // Fallback: a highly on-theme default if no results from Freepik
  if (allFetched.length === 0) {
    allFetched.push({
      id: 'fallback-cartoon-scene',
      title: 'Detective finds murdered man (fallback Freepik)',
      url: 'https://img.freepik.com/free-vector/detective-finds-murdered-man_1308-37349.jpg?w=680',
      thumbnail: 'https://img.freepik.com/free-vector/detective-finds-murdered-man_1308-37349.jpg?w=250'
    });
  }
  return { images: allFetched.slice(0, maxImages) };
}
