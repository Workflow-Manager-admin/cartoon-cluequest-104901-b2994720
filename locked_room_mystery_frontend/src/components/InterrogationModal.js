import React, { useState } from "react";

/**
 * PUBLIC_INTERFACE
 * InterrogationModal - Noir glass-style modal, initials avatar, accessible, no emoji.
 * Props:
 *   suspect: Object (current suspect)
 *   clues: Array (clues)
 *   onClose: fn()
 */
function InterrogationModal({ suspect, clues, onClose }) {
  const [stage, setStage] = useState(0);
  const [emotion, setEmotion] = useState(suspect.emotion);

  // Simulate branching on response
  const handleResponse = (resp) => {
    if (resp === "alibi") {
      setStage(2); setEmotion("defensive");
    } else if (resp === "motive") {
      setStage(3); setEmotion("anxious");
    } else if (stage < suspect.dialogues.length - 1) {
      setStage(stage + 1);
      setEmotion("nervous");
    } else {
      setStage(suspect.dialogues.length - 1);
      setEmotion("calm");
    }
  };

  return (
    <div
      className="noir-modal-bg"
      role="dialog"
      aria-modal="true"
      aria-labelledby="interrogation-title"
      tabIndex={-1}
      style={{ zIndex: 1998 }}
    >
      <div
        className="noir-modal"
        style={{
          minWidth: 320, maxWidth: 498,
          minHeight: 240,
          padding: "34px 29px 29px 29px",
          background: "var(--surface-bg)",
          borderRadius: "var(--radius-large)",
          boxShadow: "var(--shadow-modal)",
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close interrogation dialog"
          style={{
            position: "absolute", top: 13, right: 13,
            fontSize: 18,
            borderRadius: "50%",
            border: "none",
            background: "rgba(27,32,49,0.18)",
            color: "var(--danger)",
            width: 34, height: 34,
            fontWeight: 700,
            cursor: "pointer"
          }}
        >✕</button>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 7 }}>
          <span
            aria-hidden="true"
            className="noir-avatar-initials"
            style={{
              height: 41,
              width: 41,
              borderRadius: 11,
              background: "#232e46",
              color: "var(--accent)",
              fontSize: 20,
              fontWeight: 700,
              userSelect: "none",
              letterSpacing: "1.18px",
              marginRight: 6,
              display: "flex", alignItems: "center", justifyContent: "center"
            }}
          >
            {suspect.avatar || getInitials(suspect.name)}
          </span>
          <span style={{ fontWeight: 700, fontSize: 21, color: "var(--accent)" }}>
            {suspect.name}
          </span>
          <span style={{
            marginLeft: 11,
            color:
              emotion === "nervous" ? "var(--danger)" :
                (emotion === "calm" ? "var(--accent)" :
                  (emotion === "defensive" ? "#cda518" : "#4ecc90")),
            fontWeight: 600,
            fontSize: 15
          }}>
            {emotion}
          </span>
        </div>
        <div style={{
          minHeight: 53,
          padding: "13px 14px",
          background: "rgba(49,59,82,0.14)",
          borderRadius: 9,
          color: "var(--text-main)",
          marginBottom: 13,
          fontSize: 16.5
        }}>
          <span>{suspect.dialogues[stage]}</span>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
          <button
            className="noir-btn"
            style={{
              background: "var(--accent)",
              color: "#fff",
              border: "none",
              borderRadius: "var(--radius-small)",
              fontWeight: 700,
              padding: "6px 18px",
              fontSize: 15,
              cursor: "pointer"
            }}
            onClick={() => handleResponse("alibi")}
          >
            Where were you?
          </button>
          <button
            className="noir-btn"
            style={{
              background: "var(--danger)",
              color: "#fff",
              border: "none",
              borderRadius: "var(--radius-small)",
              fontWeight: 700,
              padding: "6px 18px",
              fontSize: 15,
              cursor: "pointer"
            }}
            onClick={() => handleResponse("motive")}
          >
            Motive?
          </button>
          <button
            className="noir-btn"
            style={{
              background: "rgba(123, 145, 254, 0.076)",
              color: "var(--text-light)",
              border: "var(--border-input)",
              borderRadius: "var(--radius-small)",
              fontWeight: 600,
              padding: "6px 13px",
              fontSize: 15,
              cursor: "pointer"
            }}
            onClick={onClose}
          >
            Leave
          </button>
        </div>
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

export default InterrogationModal;
