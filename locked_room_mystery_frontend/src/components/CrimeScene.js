import React, { useState, useEffect } from "react";
import { fetchCrimeSceneIllustration } from "../freepikService";

/**
 * PUBLIC_INTERFACE
 * CrimeScene - Cartoon-styled crime scene with clickable, animated clue hotspots.
 * Props:
 *   clues: Array of clue objects
 *   onClueFound: function(clueId) to mark clue as found
 *   sceneComplete: boolean, true when all real clues found
 */
function CrimeScene({ clues, onClueFound, sceneComplete }) {
  const [puzzleClue, setPuzzleClue] = useState(null);
  const [sceneImg, setSceneImg] = useState(null);
  const [sceneLoading, setSceneLoading] = useState(true);
  const [sceneErr, setSceneErr] = useState(null);

  // Fetch the main crime scene illustration on mount only
  useEffect(() => {
    let isMounted = true;
    setSceneLoading(true);
    fetchCrimeSceneIllustration()
      .then(({ image }) => {
        if (isMounted) {
          setSceneImg(image);
          setSceneLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setSceneImg(null);
          setSceneLoading(false);
          setSceneErr("Couldn't load crime scene illustration.");
        }
      });
    return () => { isMounted = false; };
  }, []);

  // Called when user clicks a clue hotspot
  const handleClueClick = (clue) => {
    if (clue.found) return;
    // Show mini-puzzle for real clues, else auto-find (red herrings)
    if (clue.redHerring) {
      onClueFound(clue.id);
    } else {
      setPuzzleClue(clue);
    }
  };

  // Handles successful puzzle completion
  const onPuzzleWin = () => {
    if (puzzleClue) {
      onClueFound(puzzleClue.id);
      setPuzzleClue(null);
    }
  };

  // Close puzzle modal
  const onPuzzleClose = () => setPuzzleClue(null);

  // Responsive demo "scene" cartoon or loading/fallback/err
  return (
    <div style={{
      position: "relative",
      width: "100%",
      height: 440,
      background: "linear-gradient(180deg,#a7c8f9 65%,#fff2e5 100%)",
      borderRadius: 14,
      overflow: "hidden"
    }}>
      {/* Background illustration */}
      {sceneLoading && (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "#e0ebf7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            zIndex: 1,
            fontSize: 22,
            color: "#4960a1"
          }}
        >
          Loading crime scene illustration...
        </div>
      )}
      {sceneErr && !sceneLoading && (
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            background: "#ffd3d3",
            color: "#a13636",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
            fontSize: 18
          }}
        >
          {sceneErr}
        </div>
      )}
      {sceneImg && (
        <img
          src={sceneImg.url || sceneImg.thumbnail}
          alt={sceneImg.title || "Detective cartoon crime scene"}
          style={{
            objectFit: "cover",
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0, left: 0,
            zIndex: 1
          }}
          draggable={false}
        />
      )}

      {/* Overlay clue hotspots */}
      {clues.map(clue => (
        <button
          key={clue.id}
          onClick={() => handleClueClick(clue)}
          className="clue-hotspot"
          title={clue.name}
          disabled={clue.found}
          style={{
            position: "absolute",
            top: `${clue.location.y}%`,
            left: `${clue.location.x}%`,
            width: 48, height: 48,
            borderRadius: "50%",
            outline: clue.found ? "2.2px solid #cccc" : "3.5px solid #F5B041",
            background: clue.found ? "#7fe0b019" : "#fff6",
            border: "none",
            boxShadow: clue.found ? "none" : "0 4px 24px #faaf0024",
            transform: "translate(-50%, -50%)",
            filter: clue.found ? "grayscale(0.8)" : "none",
            zIndex: 3,
            transition: "all .15s"
          }}
        >
          {clue.found ? "✔️" : "🕵️"}
        </button>
      ))}

      {/* Mini-game puzzle modal */}
      {puzzleClue && (
        <MiniPuzzleModal
          clue={puzzleClue}
          onWin={onPuzzleWin}
          onClose={onPuzzleClose}
        />
      )}

      {/* Completion confetti/animation */}
      {sceneComplete && (
        <div style={{
          position: "absolute",
          top: 18, right: 18, zIndex: 8,
          padding: "8px 26px", background: "#fff8d8dd",
          borderRadius: 20, fontWeight: 700, fontSize: 21, color: "#612"
        }}>
          🎉 All clues discovered!
        </div>
      )}
    </div>
  );
}

// --- Mini Puzzle Modal (Basic Demo Implementations) ---
function MiniPuzzleModal({ clue, onWin, onClose }) {
  // Can be expanded; shows a simple "Simon says" or logic or match minigame
  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0,
      width: "100vw", height: "100vh",
      background: "#0009",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 99
    }}>
      <div style={{
        background: "#fff",
        borderRadius: 18,
        boxShadow: "0 4px 28px #6b93e430",
        minWidth: 320, minHeight: 180,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: 26,
        position: "relative"
      }}>
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 13, right: 13, fontSize: 19,
            borderRadius: "50%", border: "none", background: "#FAE4C8", color: "#000"
          }}
        >✕</button>
        <h3 style={{ color: "#4E6E9A", marginTop: 4 }}>
          {clue.name} Puzzle
        </h3>
        <p>{clue.description}</p>
        {/* Placeholder minigame: quick memory/order/logic */}
        <div style={{
          margin: "22px 0",
          minHeight: 70, minWidth: 220,
          background: "#fffbf7", borderRadius: 12, display: "flex",
          alignItems: "center", justifyContent: "center", fontSize: 19
        }}>
          {/* MINI-GAME LOGIC (simple demo for each puzzle type) */}
          {
            clue.puzzle === "pattern" && <PatternPuzzle onSuccess={onWin} />
          }
          {
            clue.puzzle === "match" && <MatchPuzzle onSuccess={onWin} />
          }
          {
            clue.puzzle === "logic" && <LogicPuzzle onSuccess={onWin} />
          }
          {
            clue.puzzle === "hidden" && (
              <button onClick={onWin} style={{fontWeight:700, fontSize:18}}>Just a silly red herring!</button>
            )
          }
        </div>
      </div>
    </div>
  );
}

// --- Placeholder/Example Mini-puzzles ---

// Pattern Puzzle (Simon says)
function PatternPuzzle({ onSuccess }) {
  // For demo, just require clicking colored buttons in order
  const [clicked, setClicked] = useState([]);
  const order = ["blue", "orange", "blue"];

  const handleClick = (color) => {
    const newClicked = [...clicked, color];
    setClicked(newClicked);
    if (newClicked.length === order.length) {
      if (JSON.stringify(newClicked) === JSON.stringify(order)) {
        setTimeout(onSuccess, 500);
      } else {
        setClicked([]);
        alert("Try the color order again!");
      }
    }
  };

  return (
    <div>
      <p>Tap colors in this order: <span style={{color:"#4E6E9A"}}>Blue</span>, <span style={{color:"#F5B041"}}>Orange</span>, <span style={{color:"#4E6E9A"}}>Blue</span></p>
      <div style={{ display: "flex", gap: 13 }}>
        <button
          style={{ background: "#4E6E9A", color: "#fff", border: "none", borderRadius: 16, minWidth: 48, height: 36, fontWeight:600 }}
          onClick={() => handleClick("blue")}
        >Blue</button>
        <button
          style={{ background: "#F5B041", color: "#333", border: "none", borderRadius: 16, minWidth: 48, height: 36, fontWeight:600 }}
          onClick={() => handleClick("orange")}
        >Orange</button>
      </div>
    </div>
  );
}

// Match Puzzle (simple drag/drop match, but demo as click)
function MatchPuzzle({ onSuccess }) {
  return (
    <div>
      <p>Which fingerprint matches?</p>
      <div style={{ display: "flex", gap: 7 }}>
        <button
          style={{ background: "#eee", borderRadius: 12, border: "2px solid #E74C3C", fontSize: 20, fontWeight: 700 }}
          onClick={onSuccess}
        >🖐️</button>
        <button
          style={{ background: "#eee", borderRadius: 12, border: "2px solid #ccc", fontSize: 20 }}
          onClick={() => alert("Not quite, look for the other!")}
        >👣</button>
      </div>
    </div>
  );
}

// Logic Puzzle (simple yes/no)
function LogicPuzzle({ onSuccess }) {
  return (
    <div>
      <p>What time did the crime happen?</p>
      <button
        style={{ background: "#4E6E9A", color: "#fff", border: "none", borderRadius: 7, margin: "5px", padding: "6px 13px", fontWeight:600 }}
        onClick={onSuccess}
      >7:12</button>
      <button
        style={{ background: "#ddd", color: "#964", border: "none", borderRadius: 7, margin: "5px", padding: "6px 13px" }}
        onClick={() => alert("Nope! Look at the watch!")}
      >9:30</button>
    </div>
  );
}

export default CrimeScene;
