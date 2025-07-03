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
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    setLoading(true);
    setError("");
    fetchFreepikImages(query, limit)
      .then(({ results }) => {
        setImages(results);
        setActiveIdx(0);
        setLoading(false);
      })
      .catch(() => {
        setError("Error loading images.");
        setLoading(false);
      });
  }, [query, limit]);

  // Carousel keyboard navigation (left/right)
  useEffect(() => {
    if (images.length < 2) return;
    const handleCarouselKey = (e) => {
      if (e.key === "ArrowLeft") setActiveIdx(i => i <= 0 ? images.length - 1 : i - 1);
      if (e.key === "ArrowRight") setActiveIdx(i => i >= images.length - 1 ? 0 : i + 1);
    };
    window.addEventListener("keydown", handleCarouselKey);
    return () => window.removeEventListener("keydown", handleCarouselKey);
  }, [images.length]);

  // Single image fallback
  const showCarousel = images.length > 1;

  return (
    <div className="freepik-mystery-images-section" style={{ padding: 16, textAlign: "center" }}>
      <h3 style={{ fontWeight: 800, color: "var(--accent)", fontSize: 18, marginBottom: 2 }}>
        🕵️ Cartoon Mystery Assets from Freepik
      </h3>
      {loading && <p>Loading image assets...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div
        className="freepik-images-grid"
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: showCarousel ? 0 : 16,
          minHeight: 128,
          marginTop: 10,
          position: "relative"
        }}
      >
        {images && images.length > 0 ? (
          showCarousel ? (
            <div style={{ width: 210, minHeight: 120, display: "flex", flexDirection: "row", position: "relative", alignItems: "center", justifyContent: "center" }}>
              <button aria-label="Previous" style={{
                position: "absolute",
                left: -8,
                zIndex: 4,
                background: "rgba(30,35,60,0.97)",
                border: "none",
                color: "var(--accent)",
                borderRadius: "50%",
                width: 33,
                height: 33,
                fontWeight: "bold",
                fontSize: 22,
                cursor: "pointer",
                opacity: 0.88,
                boxShadow: "0 2px 8px #1119"
              }} onClick={() => setActiveIdx(i => i <= 0 ? images.length - 1 : i - 1)} tabIndex={0}>
                {"‹"}
              </button>
              <a
                href={images[activeIdx].url}
                target="_blank"
                rel="noopener noreferrer"
                title={images[activeIdx].title}
                className="freepik-img-link"
                style={{
                  background: "#fff",
                  borderRadius: 9,
                  boxShadow: "0 2px 14px #151c3725",
                  overflow: "hidden",
                  border: "1.6px solid #e8eaf1",
                  width: 170,
                  height: 120,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto"
                }}
              >
                <img
                  src={images[activeIdx].thumbnail}
                  alt={images[activeIdx].title}
                  style={{ maxWidth: 158, maxHeight: 108, objectFit: "cover", borderRadius: 7, border: "none", transition: "box-shadow .17s" }}
                  draggable={false}
                />
              </a>
              <button aria-label="Next" style={{
                position: "absolute",
                right: -8,
                zIndex: 4,
                background: "rgba(30,35,60,0.97)",
                border: "none",
                color: "var(--accent)",
                borderRadius: "50%",
                width: 33,
                height: 33,
                fontWeight: "bold",
                fontSize: 22,
                cursor: "pointer",
                opacity: 0.88,
                boxShadow: "0 2px 8px #1119"
              }} onClick={() => setActiveIdx(i => i >= images.length - 1 ? 0 : i + 1)} tabIndex={0}>
                {"›"}
              </button>
              {/* Dot indicators */}
              <div style={{
                position: "absolute",
                bottom: 5,
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: 7,
                zIndex: 5
              }}>
                {images.map((img, i) =>
                  <span
                    key={img.id}
                    aria-label={activeIdx === i ? "Current image" : undefined}
                    style={{
                      width: activeIdx === i ? 19 : 9,
                      height: 7,
                      background: activeIdx === i ? "var(--accent)" : "#bed01955",
                      borderRadius: 6,
                      boxShadow: activeIdx === i ? "0 1px 4px #7b91fe55" : undefined,
                      margin: "0 2px",
                      border: "none"
                    }}
                  ></span>
                )}
              </div>
            </div>
          ) : (
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
                  draggable={false}
                />
              </a>
            ))
          )
        ) : (
          !loading && <p>No images found for "{query}".</p>
        )}
      </div>
      <p style={{ marginTop: 10, fontStyle: "italic", fontSize: "0.93em", color: "#888" }}>
        Images powered by <a href="https://www.freepik.com/" target="_blank" rel="noopener noreferrer">Freepik</a>
      </p>
    </div>
  );
}

export default FreepikMysteryImages;
