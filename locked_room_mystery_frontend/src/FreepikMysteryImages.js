import React, { useEffect, useState } from "react";
import { fetchFreepikImages } from "./freepikService";

/**
 * PUBLIC_INTERFACE
 * FreepikMysteryImages - Displays a row/grid of cartoon-style mystery images from Freepik.
 *
 * This sample UI component demonstrates Freepik API usage.
 *
 * Props:
 *   query (optional): string - Custom search query (default: cartoon detective mystery)
 *   limit (optional): number - Max images (default: 8)
 */
function FreepikMysteryImages({ query = "cartoon mystery detective", limit = 8 }) {
  /** This is a public function. */
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    fetchFreepikImages(query, limit)
      .then(({ results }) => {
        setImages(results);
        setLoading(false);
      })
      .catch(() => {
        setError("Error loading images.");
        setLoading(false);
      });
  }, [query, limit]);

  return (
    <div className="freepik-mystery-images-section" style={{ padding: 16 }}>
      <h3>
        🕵️ Cartoon Mystery Assets from Freepik
      </h3>
      {loading && <p>Loading image assets...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div
        className="freepik-images-grid"
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 16,
          marginTop: 12,
        }}
      >
        {images && images.length > 0 ? (
          images.map((img) => (
            <a
              key={img.id}
              href={img.url}
              target="_blank"
              rel="noopener noreferrer"
              className="freepik-img-link"
              title={img.title}
              style={{
                background: "#fff",
                borderRadius: 8,
                boxShadow: "0 2px 8px #0001",
                overflow: "hidden",
                border: "1px solid #e5e5e5",
                width: 110,
                height: 110,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <img
                src={img.thumbnail}
                alt={img.title}
                style={{ maxWidth: 100, maxHeight: 100, objectFit: "cover" }}
              />
            </a>
          ))
        ) : (
          !loading && <p>No images found for "{query}".</p>
        )}
      </div>
      <p style={{ marginTop: 10, fontStyle: "italic", fontSize: "0.95em", color: "#888" }}>
        Images powered by <a href="https://www.freepik.com/" target="_blank" rel="noopener noreferrer">Freepik</a>
      </p>
    </div>
  );
}

export default FreepikMysteryImages;
