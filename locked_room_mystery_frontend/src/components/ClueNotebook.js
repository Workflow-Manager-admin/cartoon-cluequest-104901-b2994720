import React from "react";

/**
 * PUBLIC_INTERFACE
 * ClueNotebook - Noir glassmorphic notebook: evidence cards and noir-button links to suspects (initials only).
 * Props:
 *   clues: Array - All clue objects
 *   suspects: Array - All suspects
 *   onSuspectClick: fn(suspectId)
 */
function ClueNotebook({ clues, suspects, onSuspectClick }) {
  // Accessibility: Detect focus for tab highlight on suspect links
  // No state required due to visible focus using outline from CSS
  return (
    <div
      className="noir-dossier-card"
      role="region"
      aria-label="Clue Notebook, evidence cards"
      style={{
        padding: "19px 12px 14px 19px",
        minHeight: 330,
        background: "var(--glass-surface)",
        borderRadius: "var(--radius)",
        backdropFilter: "var(--glass-blur)",
        border: "var(--border-med)",
        boxShadow: "0 1px 8px #1e28481a"
      }}
      tabIndex={0}
    >
      <h2 className="noir-title" style={{ marginBottom: 7 }}>Evidence Board</h2>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {clues.filter(clue => clue.found).map(clue => (
          <li
            key={clue.id}
            className="evidence-entry-animate"
            style={{
              margin: "15px 0",
              background: clue.redHerring
                ? "rgba(238,57,88,0.08)"
                : "rgba(85,117,255,0.08)",
              borderLeft: clue.redHerring
                ? "5px solid var(--danger)"
                : "5px solid var(--accent)",
              padding: "13px 12px 7px 22px",
              borderRadius: 9,
              boxShadow: clue.redHerring
                ? "0 1px 10px #fa435c49"
                : "0 1px 17px #355efb22",
              position: "relative",
              transition: "background .13s, border-color .18s, box-shadow .19s"
            }}
            aria-label={`Clue: ${clue.name}${clue.redHerring ? " (Red Herring)" : ""}`}
            tabIndex={0}
            onFocus={e => {
              // Optionally: show extra hint on focus, etc.
            }}
            onMouseEnter={e => {
              // Could show tooltip with explanation
            }}
          >
            <span style={{ fontWeight: 800, color: clue.redHerring ? "var(--danger)" : "var(--accent)", fontSize: 17 }}>
              {clue.name}
            </span>
            {clue.redHerring && (
              <span style={{ color: "var(--danger)", marginLeft: 10, fontWeight: 700, fontStyle: "italic" }}>
                (Red Herring)
              </span>
            )}
            <div style={{ fontSize: 15, color: "var(--text-light)", margin: "7px 0 4px 0" }}>
              {clue.description}
            </div>
            {/* Advanced red herring/puzzle logic: show type and fake link, if present */}
            {clue.redHerring && (
              <div style={{ fontSize: 13, color: "var(--danger)", fontStyle: "italic", marginBottom: 3 }}>
                {clue.redHerringType ? <span>Red Herring type: <b>{clue.redHerringType}</b>. </span> : ''}
                {clue.fakeLink && <span>Links to: <b>{clue.fakeLink}</b>.</span>}
                <span style={{ marginLeft: 7, color: "var(--text-light)" }}>
                  {clue.explanation}
                </span>
              </div>
            )}
            {/* Show extra hint for all clues if it was supplied */}
            {clue.extraHint && (
              <div style={{
                fontSize: 13.5,
                color: "#e8d44d",
                fontWeight: 600,
                opacity: 0.88,
                marginTop: "4px"
              }}>
                Hint: {clue.extraHint}
              </div>
            )}
            {!clue.redHerring && (
              <div style={{
                fontSize: 13.5,
                color: "var(--success)",
                fontWeight: 600,
                marginTop: 4
              }}>
                {clue.explanation}
              </div>
            )}
            <div style={{ marginTop: 7 }}>
              <b>Linked suspects:&nbsp;</b>
              {suspects.filter(s => s.clueLinks && s.clueLinks.includes(clue.id)).length === 0 ?
                <span style={{ color: "#888" }}>Unknown</span>
                :
                suspects.filter(s => s.clueLinks && s.clueLinks.includes(clue.id)).map(s => (
                  <button
                    key={s.id}
                    onClick={() => onSuspectClick(s.id)}
                    className="noir-btn"
                    aria-label={`View dossier for ${s.name}`}
                    style={{
                      background: !clue.redHerring ? "var(--accent)" : "var(--danger)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "var(--radius-small)",
                      margin: "0 4px",
                      fontWeight: 700,
                      fontSize: 15,
                      padding: "4px 13px",
                      cursor: "pointer",
                      transition: "background var(--transition), color var(--transition)",
                      opacity: clue.redHerring ? 0.84 : 1
                    }}
                  >
                    <span className="noir-avatar-initials" style={{
                      height: 29,
                      width: 29,
                      fontSize: "1rem",
                      background: "#232e46",
                      color: !clue.redHerring ? "var(--accent)" : "var(--danger)",
                      marginRight: 5,
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      borderRadius: 8,
                      border: "1.2px solid #536",
                      fontWeight: 700,
                      userSelect: "none",
                      verticalAlign: "middle"
                    }}>{s.avatar || getInitials(s.name)}</span>
                    {s.name}
                  </button>
                ))
              }
            </div>
          </li>
        ))}
      </ul>
      <div style={{ marginTop: 28, color: "var(--danger)", fontWeight: 700, fontSize: 14, opacity: 0.87 }}>
        * Some clues are red herrings.
      </div>
    </div>
  );
}

// Helper for avatar initials
function getInitials(name) {
  return (name || "")
    .split(' ')
    .map(n => n[0]?.toUpperCase())
    .join('')
    .slice(0, 2);
}

export default ClueNotebook;
