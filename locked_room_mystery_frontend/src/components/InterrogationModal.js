import React, { useState } from "react";

/**
 * PUBLIC_INTERFACE
 * InterrogationModal - Chat/interrogation interface with basic branching (demo).
 * Props:
 *   suspect: Object (current suspect)
 *   clues: Array (clues)
 *   onClose: fn()
 */
function InterrogationModal({ suspect, clues, onClose }) {
  const [stage, setStage] = useState(0);
  const [emotion, setEmotion] = useState(suspect.emotion);

  // Simulate branching on response ("Did you see the bloodstain?")
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

  // Chat messages
  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0,
      width: "100vw", height: "100vh",
      background: "#0008",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 999
    }}>
      <div style={{
        background: "#fff",
        borderRadius: 15,
        minWidth: 333, maxWidth: 480,
        minHeight: 270,
        padding: 30, boxShadow: "0 2px 18px #5ea7d136",
        position: "relative"
      }}>
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 11, right: 11, fontSize: 16, fontWeight: 700, color: "#7b5e2c",
            background: "#f7d7ae", border: "none", borderRadius: 6
          }}>
          ✕
        </button>

        {/* Cartoon suspect avatar + state */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 7 }}>
          <span style={{
            fontSize: 38,
            transition: "transform .18s",
            transform: emotion === "anxious" ? "rotate(-8deg) scale(1.04)" :
              emotion === "defensive" ? "scale(1.08)" : "none"
          }}>{suspect.emoji}</span>
          <span style={{ fontWeight: 700, fontSize: 22 }}>{suspect.name}</span>
          <span style={{
            marginLeft: 16,
            color:
              emotion === "nervous" ? "#E74C3C" :
                (emotion === "calm" ? "#4E6E9A" :
                  (emotion === "defensive" ? "#F5B041" : "#5CC364"))
          }}>
            {emotion}
          </span>
        </div>
        <div style={{
          minHeight: 60, padding: 10, background: "#ecf5ff33",
          borderRadius: 8, marginBottom: 15
        }}>
          <span style={{ fontSize: 17 }}>{suspect.dialogues[stage]}</span>
        </div>
        <div>
          <button
            onClick={() => handleResponse("alibi")}
            style={{
              background: "#F5B041", color: "#4E6E9A", borderRadius: 8, border: "none",
              fontWeight: 600, padding: "6px 17px", margin: 5, cursor: "pointer"
            }}
          >Where were you?</button>
          <button
            onClick={() => handleResponse("motive")}
            style={{
              background: "#E74C3C", color: "#fff", borderRadius: 8, border: "none",
              fontWeight: 600, padding: "6px 17px", margin: 5, cursor: "pointer"
            }}
          >Any reason to hurt the victim?</button>
          <button
            onClick={onClose}
            style={{
              background: "#ccc", color: "#222", borderRadius: 8, border: "none",
              fontWeight: 600, padding: "6px 17px", margin: 5, cursor: "pointer"
            }}
          >Leave</button>
        </div>
      </div>
    </div>
  );
}

export default InterrogationModal;
