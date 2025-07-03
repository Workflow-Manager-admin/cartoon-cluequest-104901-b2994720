import React, { useState, useRef, useEffect } from "react";

/**
 * PUBLIC_INTERFACE
 * AccusationPanel - Minimalist noir glass-modal for selecting and accusing a suspect.
 * Modern accessibility, focus style, initials avatar (no emoji).
 * Accessibility: Improved focus management, ARIA, keyboard navigation, transitions.
 * Props:
 *   suspects: Array - all suspects
 *   onAccuse: fn(suspectId)
 *   onCancel: fn()
 */
function AccusationPanel({ suspects, onAccuse, onCancel }) {
  const [selected, setSelected] = useState(null);
  const buttonRefs = useRef([]);
  const modalRef = useRef(null);

  useEffect(() => {
    // Focus first actionable within modal (first suspect or close)
    if (buttonRefs.current && buttonRefs.current[0]) {
      buttonRefs.current[0].focus();
    }
  }, []);

  // Keyboard accessibility for navigation in modal list
  const handleKeyDown = (e) => {
    const idx = suspects.findIndex(s => s.id === selected) !== -1 ? suspects.findIndex(s => s.id === selected) : 0;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = (idx + 1) % suspects.length;
      setSelected(suspects[next].id);
      buttonRefs.current[next]?.focus();
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = (idx - 1 + suspects.length) % suspects.length;
      setSelected(suspects[prev].id);
      buttonRefs.current[prev]?.focus();
    }
    if (e.key === "Enter" && selected) {
      e.preventDefault();
      onAccuse(selected);
    }
    if (e.key === "Escape") {
      onCancel();
    }
  };

  // Trap focus inside modal
  useEffect(() => {
    const focusHandler = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        e.stopPropagation();
        // Move focus into modal if clicking outside
        modalRef.current.focus();
      }
    };
    document.addEventListener("focusin", focusHandler);
    return () => document.removeEventListener("focusin", focusHandler);
  }, []);

  return (
    <div
      className="noir-modal-bg"
      role="dialog"
      aria-modal="true"
      aria-labelledby="accuse-modal-title"
      tabIndex={-1}
      style={{
        animation: "noirModalFadeIn .33s cubic-bezier(.79,-0.14,.71,1.34) 1"
      }}
      ref={modalRef}
      onKeyDown={handleKeyDown}
    >
      <div
        className="noir-modal"
        style={{
          maxWidth: 430,
          minWidth: 295,
          padding: "36px 33px 27px 33px"
        }}
      >
        <button
          aria-label="Close accusation panel"
          onClick={onCancel}
          style={{
            position: "absolute", top: 15, right: 17,
            background: "rgba(27,32,49,0.18)",
            border: "none",
            borderRadius: 7,
            color: "var(--danger)",
            fontWeight: 700, fontSize: 19,
            width: 38, height: 38, cursor: "pointer",
            boxShadow: "none",
            transition: "background var(--transition), color var(--transition)",
          }}
          tabIndex={0}
        >✕</button>
        <div className="noir-modal-titlebar" id="accuse-modal-title" style={{ marginBottom: 20, color: "var(--accent)" }}>
          Make Your Accusation
        </div>
        <div style={{ margin: "13px 0 25px 0", display: "flex", flexDirection: "column", gap: 13 }}>
          {suspects.map((s, i) => (
            <button
              key={s.id}
              aria-label={`Accuse ${s.name}`}
              onClick={() => setSelected(s.id)}
              aria-pressed={selected === s.id}
              className="noir-btn"
              ref={el => buttonRefs.current[i] = el}
              style={{
                display: "flex", alignItems: "center", gap: 18,
                background: selected === s.id ? "rgba(123,145,254,0.13)" : "rgba(38,42,55,0.07)",
                color: selected === s.id ? "var(--accent)" : "var(--text-main)",
                border: selected === s.id ? "2px solid var(--accent)" : "1.5px solid var(--border-color, #25304b)",
                borderRadius: "var(--radius)",
                fontWeight: 600,
                fontSize: 18,
                padding: "12px 18px 10px 12px",
                margin: "0 0 0 0",
                cursor: "pointer",
                boxShadow: selected === s.id ? "0 2px 12px #637bfa14" : "none",
                outline: selected === s.id ? "2.2px solid var(--accent)" : "none",
                transition: "all var(--transition)",
                justifyContent: "flex-start"
              }}
              tabIndex={0}
              onKeyDown={i === suspects.length - 1 ? handleKeyDown : undefined}
            >
              {/* Noir Initials avatar */}
              <span
                aria-hidden="true"
                className="noir-avatar-initials"
                style={{
                  height: 38, width: 38,
                  fontSize: 1.09 + "rem",
                  border: selected === s.id ? "2px solid var(--accent)" : "1.2px solid #3338",
                  background: "#232e46",
                  marginRight: 7,
                  userSelect: "none",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 700, letterSpacing: "1.25px"
                }}
              >
                {s.avatar || getInitials(s.name)}
              </span>
              <span style={{ fontWeight: 700, fontSize: 17 }}>{s.name}</span>
            </button>
          ))}
        </div>
        <div className="noir-modal-actions" style={{ marginTop: 20 }}>
          <button
            className="noir-btn"
            style={{
              background: "none", color: "var(--text-light)",
              border: "var(--border-input)", minWidth: 84,
              marginRight: 14,
              transition: "background var(--transition), color var(--transition), box-shadow var(--transition)"
            }}
            onClick={onCancel}
            tabIndex={0}
          >
            Cancel
          </button>
          <button
            className="noir-btn-primary"
            style={{
              minWidth: 105,
              background: selected ? "var(--accent)" : "var(--surface-bg)",
              color: selected ? "#fff" : "var(--text-light)",
              cursor: selected ? "pointer" : "not-allowed",
              opacity: selected ? 1 : 0.67,
              boxShadow: selected ? "0 1px 12px #7b91fe22" : "none",
              transition: "background var(--transition), color var(--transition), box-shadow var(--transition)"
            }}
            aria-disabled={!selected}
            disabled={!selected}
            onClick={() => selected ? onAccuse(selected) : undefined}
            tabIndex={selected ? 0 : -1}
          >
            Accuse
          </button>
        </div>
        <div style={{ marginTop: 14, fontSize: 14, color: "var(--danger)", textAlign: "center" }}>
          Choose carefully — your decision will end the game!
        </div>
      </div>
    </div>
  );
}

// Helper to get initials from name (fallback)
function getInitials(name) {
  return (name || "")
    .split(' ')
    .map(n => n[0]?.toUpperCase())
    .join('')
    .slice(0, 2);
}

export default AccusationPanel;
