import React from "react";

/**
 * PUBLIC_INTERFACE
 * GameOverModal – Noir minimal modal ending panel, initials avatar, new button style.
 * Props:
 *   ending: {type, suspect}
 *   onRestart: fn()
 */
function GameOverModal({ ending, onRestart }) {
  const titles =
    ending?.type === "success"
      ? "Case Closed!"
      : ending?.type === "fail-clues"
      ? "Unsolved..."
      : "Mistaken Accusation!";

  // Keyboard a11y: Escape to close, Enter to restart
  const modalRef = React.useRef(null);
  React.useEffect(() => {
    if (modalRef.current) {
      // Focus Play Again button for ease of restart/key accessibility
      const playBtn = modalRef.current.querySelector("button");
      playBtn && playBtn.focus();
    }
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onRestart();
    }
    if (e.key === "Escape") {
      onRestart();
    }
  };

  // Reduce motion for accessibility if prefers-reduced-motion
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <div
      className="noir-modal-bg"
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      style={{
        zIndex: 2200,
        transition: reducedMotion ? undefined : "opacity 0.25s cubic-bezier(.66,-0.08,.56,1.13)"
      }}
      onKeyDown={handleKeyDown}
      ref={modalRef}
    >
      <div
        className="noir-modal"
        style={{
          minWidth: 290, maxWidth: 400,
          padding: "38px 38px 29px 38px",
          borderRadius: "var(--radius-large)",
          boxShadow: "var(--shadow-modal)",
          textAlign: "center",
          transition: reducedMotion ? undefined : "box-shadow var(--transition), background var(--transition)"
        }}
      >
        <div className="noir-modal-titlebar" style={{
          marginBottom: 12,
          color: "var(--accent)",
          fontWeight: 800,
        }}>
          {titles}
        </div>
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          margin: "0 0 6px 0"
        }}>
          <span
            aria-hidden="true"
            className="noir-avatar-initials"
            style={{
              height: 49,
              width: 49,
              fontSize: 21,
              background: "#232e46",
              color: "var(--accent)",
              border: "2px solid var(--accent)",
              marginBottom: 1,
              fontWeight: 700,
              userSelect: "none",
              letterSpacing: "1.1px",
              borderRadius: 13,
              marginRight: 0,
              display: "flex", alignItems: "center", justifyContent: "center"
            }}
          >
            {ending?.suspect ? (ending.suspect.avatar || getInitials(ending.suspect.name)) : "?"}
          </span>
          <span style={{ color: "var(--danger)", margin: "10px 0 2px 0", fontWeight: 700, fontSize: 19 }}>
            {ending?.suspect ? ending.suspect.name : ""}
          </span>
        </div>
        <button
          onClick={onRestart}
          className="noir-btn-primary"
          style={{
            background: "var(--accent)",
            color: "#fff",
            borderRadius: "var(--radius)",
            border: "none",
            fontWeight: 700,
            fontSize: 17,
            marginTop: 11,
            padding: "10px 28px",
            cursor: "pointer",
            boxShadow: "0 1px 12px #7b91fe21",
            transition: reducedMotion ? undefined : "background .13s, box-shadow var(--transition)"
          }}
          aria-label="Restart game"
          tabIndex={0}
        >
          Play Again
        </button>
      </div>
    </div>
  );
}

function getInitials(name) {
  return (name || "")
    .split(' ')
    .map(n => n[0]?.toUpperCase())
    .join('')
    .slice(0, 2);
}

export default GameOverModal;
