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
  // API may return /search endpoint.
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
 * fetchCrimeSceneIllustration - Fetches one highly themed detective crime scene room cartoon from Freepik.
 * Will always use a strong, specific query for maximum thematic relevance.
 * 
 * @returns {Promise<{ image: { id: string, title: string, url: string, thumbnail: string } | null }>}
 */
export async function fetchCrimeSceneIllustration() {
  const thematicallyStrongQuery =
    "cartoon detective crime scene room illustration";
  const { results } = await fetchFreepikImages(thematicallyStrongQuery, 1);
  return { image: results && results.length > 0 ? results[0] : null };
}
