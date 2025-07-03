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
  const apiUrl = `${API_BASE_URL}/search?term=${encodeURIComponent(query)}&limit=${limit}`;
  try {
    const response = await fetch(apiUrl, {
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${FREEPIK_API_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error(`Freepik API error: ${response.status}`);
    }
    const data = await response.json();

    // Adapt result based on Freepik API response schema
    const results = (data.resources || data.data || []).map(item => ({
      id: item.id || item.identifier,
      title: item.title || item.slug,
      url: item.url || (item.assets && item.assets.preview_url) || "#",
      thumbnail:
        item.thumbnail_url ||
        (item.assets && item.assets.preview_url) ||
        (item.images && item.images['200_200']) ||
        "#"
    }));

    return { results };
  } catch (error) {
    console.error("Error fetching Freepik assets:", error);
    return { results: [] };
  }
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
  // List of increasingly broad but strong queries (most specific first)
  const queries = [
    "cartoon detective crime scene room illustration noir",
    "cartoon mystery murder investigation digital art illustration",
    "cartoon clue hidden object detective illustration",
    "noir detective crime scene cartoon illustration",
    "cartoon mansion murder mystery",
    "cartoon evidence board scene detective"
  ];
  let allFetched = [];
  for (let i = 0; i < queries.length && allFetched.length < maxImages; i++) {
    // Request more per query to allow for filtering, but avoid excessive hits
    const perQueryLimit = Math.max(4, maxImages * 2);
    const { results } = await fetchFreepikImages(queries[i], perQueryLimit);
    // Strict filtering: require some thematic relevance in title or strong visual fit
    const filtered = (results || []).filter((img) => {
      const t = (img.title || "").toLowerCase();
      return (
        // Require at least two thematic words in title or query
        (t.includes("crime") && (t.includes("scene") || t.includes("detective") || t.includes("mystery"))) ||
        t.includes("murder") ||
        t.includes("investigation")
      );
    });
    filtered.forEach(img => {
      // De-duplicate by id/url/title
      if (!allFetched.some(x =>
        x.id === img.id ||
        x.url === img.url ||
        x.title === img.title
      )) {
        allFetched.push(img);
      }
    });
  }
  // Fallback: if no images, try default Freepik detective cartoon
  if (allFetched.length === 0) {
    allFetched.push({
      id: 'fallback-cartoon-scene',
      title: 'Detective finds murdered man (fallback Freepik)',
      url: 'https://img.freepik.com/free-vector/detective-finds-murdered-man_1308-37349.jpg?w=680',
      thumbnail: 'https://img.freepik.com/free-vector/detective-finds-murdered-man_1308-37349.jpg?w=250'
    });
  }
  // Limit to maxImages
  return { images: allFetched.slice(0, maxImages) };
}
