import React, { useState, useEffect } from 'react';
import './App.css';
import FreepikMysteryImages from './FreepikMysteryImages';
import CrimeScene from './components/CrimeScene';
import ClueNotebook from './components/ClueNotebook';
import SuspectPanel from './components/SuspectPanel';
import InterrogationModal from './components/InterrogationModal';
import AnimatedScene from './components/AnimatedScene';
import AccusationPanel from './components/AccusationPanel';
import GameHeader from './components/GameHeader';
import GameOverModal from './components/GameOverModal';

// Main cartoon color palette
const THEME_COLORS = {
  primary: "#4E6E9A",   // Deep blue/purple
  secondary: "#F5B041", // Cartoon orange
  accent: "#E74C3C",    // Red lipstick/alert
};

const GAME_PHASES = Object.freeze({
  INTRO: 'intro',
  SCENE: 'scene',
  NOTEBOOK: 'notebook',
  INTERROGATION: 'interrogation',
  ACCUSATION: 'accusation',
  ENDING: 'ending'
});

// Initial game state and assets
const initialClues = [
  // Example cartoon clues (can be extended)
  {
    id: "clue-bloodstain", name: "Bloodstain", found: false, location: { x: 40, y: 25 },
    puzzle: "pattern", // mini-game type
    description: "A fresh bloodstain near the broken vase.",
    redHerring: false,
    connections: [],
  },
  {
    id: "clue-fingerprint", name: "Fingerprint", found: false, location: { x: 65, y: 38 },
    puzzle: "match", // mini-game type
    description: "A suspicious fingerprint on the window.",
    redHerring: false,
    connections: [],
  },
  {
    id: "clue-cat-hair", name: "Cat Hair", found: false, location: { x: 15, y: 79 },
    puzzle: "hidden", // just a red herring, no puzzle
    description: "A clump of orange cat hair on the chair.",
    redHerring: true,
    connections: [],
  },
  {
    id: "clue-broken-watch", name: "Broken Watch", found: false, location: { x: 75, y: 77 },
    puzzle: "logic", // logic puzzle
    description: "A classic watch stopped at 7:12.",
    redHerring: false,
    connections: [],
  }
];

const initialSuspects = [
  {
    id: "suspect-miss-peach", 
    name: "Miss Peach",
    emoji: "🧑‍🦰",
    description: "The victim's art student niece, anxious and defensive.",
    emotion: "nervous",
    dialogues: ["I'm just a student here, I swear!", "Why does everyone suspect me?", "I just wanted to help Uncle..."],
    alibi: "Was at the art class at the time of crime.",
    motive: "Possible inheritance.",
    clueLinks: ["clue-fingerprint"],
    guilty: false
  },
  {
    id: "suspect-prof-plum", 
    name: "Prof. Plum",
    emoji: "👨‍🏫",
    description: "Neighboring science teacher, logical and calm.",
    emotion: "calm",
    dialogues: ["Let's stick to the facts, detective.", "I heard a crash, but saw nothing.", "I always lock my windows."],
    alibi: "Working on a lesson plan.",
    motive: "Owed money to the victim.",
    clueLinks: ["clue-bloodstain"],
    guilty: false
  },
  {
    id: "suspect-mr-black", 
    name: "Mr. Black",
    emoji: "🕵️‍♂️",
    description: "The mysterious butler, loyal but secretive.",
    emotion: "defiant",
    dialogues: ["I did only as I was told.", "Those questions are... unnecessary.", "I don't know about any bloodstain."],
    alibi: "Preparing dinner.",
    motive: "Rumored argument with victim.",
    clueLinks: ["clue-broken-watch"],
    guilty: true // True culprit
  },
];

// PUBLIC_INTERFACE
function App() {
  /**
   * Root component controlling game phase, state, and rendering.
   * Handles navigation, cartoon theme, asset rendering, and master state.
   */
  const [gamePhase, setGamePhase] = useState(GAME_PHASES.INTRO);
  const [theme] = useState("light"); // Fixed light; can be changed with a toggle if desired
  const [clues, setClues] = useState(initialClues);
  const [suspects, setSuspects] = useState(initialSuspects);
  const [notebookOpen, setNotebookOpen] = useState(false);
  const [selectedSuspect, setSelectedSuspect] = useState(null); // for interrogation
  const [accusationOpen, setAccusationOpen] = useState(false);
  const [ending, setEnding] = useState(null); // {type: "confessed", suspect: ...}
  const [showGameOver, setShowGameOver] = useState(false);
  const [sceneAnimation, setSceneAnimation] = useState({ type: "intro", playing: true });

  // Effect to apply CSS vars for theme and color palette
  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', THEME_COLORS.primary);
    document.documentElement.style.setProperty('--secondary-color', THEME_COLORS.secondary);
    document.documentElement.style.setProperty('--accent-color', THEME_COLORS.accent);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Scene/phase navigation
  const goToPhase = (phase) => {
    setGamePhase(phase);
    // Close overlays as needed
    setNotebookOpen(false);
    setSelectedSuspect(null);
    setAccusationOpen(false);
  };

  // When a clue is found (possibly after a mini-game)
  // PUBLIC_INTERFACE
  const onClueFound = (clueId) => {
    setClues(prev =>
      prev.map(c => (c.id === clueId ? { ...c, found: true } : c))
    );
  };

  // When interrogating a suspect
  // PUBLIC_INTERFACE
  const startInterrogation = (suspectId) => {
    setSelectedSuspect(suspectId);
    setGamePhase(GAME_PHASES.INTERROGATION);
  };

  // On completing interrogation or after making an accusation
  // PUBLIC_INTERFACE
  const endInterrogation = () => {
    setSelectedSuspect(null);
    setGamePhase(GAME_PHASES.SCENE);
  };

  // On pressing the notebook button
  // PUBLIC_INTERFACE
  const toggleNotebook = () => {
    setNotebookOpen(open => !open);
    setGamePhase(gamePhase === GAME_PHASES.NOTEBOOK ? GAME_PHASES.SCENE : GAME_PHASES.NOTEBOOK);
  };

  // PUBLIC_INTERFACE
  const openAccusation = () => {
    setAccusationOpen(true);
    setGamePhase(GAME_PHASES.ACCUSATION);
  };
  const closeAccusation = () => {
    setAccusationOpen(false);
    setGamePhase(GAME_PHASES.SCENE);
  };

  // Making an accusation—compute result
  // PUBLIC_INTERFACE
  const handleAccuse = (suspectId) => {
    const accused = suspects.find(s => s.id === suspectId);
    let type = '';
    if (accused.guilty) {
      type = "success";
    } else if (clues.filter(c => c.found).length < 3) {
      type = "fail-clues";
    } else {
      type = "fail-logic";
    }
    setEnding({ type, suspect: accused });
    setShowGameOver(true);
    setGamePhase(GAME_PHASES.ENDING);
  };

  // Resets the whole game
  // PUBLIC_INTERFACE
  const restartGame = () => {
    setClues(initialClues.map(c => ({ ...c, found: false })));
    setSuspects(initialSuspects);
    setGamePhase(GAME_PHASES.INTRO);
    setNotebookOpen(false);
    setSelectedSuspect(null);
    setEnding(null);
    setShowGameOver(false);
    setSceneAnimation({ type: "intro", playing: true });
  };

  // Animation sequence transitions (intro, ending, etc.)
  const onAnimationComplete = () => {
    if (sceneAnimation.type === "intro") {
      setGamePhase(GAME_PHASES.SCENE);
      setSceneAnimation({ type: "", playing: false });
    }
    if (sceneAnimation.type === "ending") {
      setShowGameOver(true);
      setSceneAnimation({ type: "", playing: false });
    }
  };

  // --- Main rendering ---
  return (
    <div className="App" style={{ background: "#fff", minHeight: "100vh" }}>
      <GameHeader
        clues={clues}
        suspects={suspects}
        onNotebook={toggleNotebook}
        onAccusation={openAccusation}
        phase={gamePhase}
      />

      {/* Animated intro, reveal, ending */}
      {(gamePhase === GAME_PHASES.INTRO && sceneAnimation.playing) && (
        <AnimatedScene
          type="intro"
          onDone={onAnimationComplete}
        />
      )}

      {/* Main crime scene */}
      {(gamePhase === GAME_PHASES.SCENE || gamePhase === GAME_PHASES.NOTEBOOK || gamePhase === GAME_PHASES.ACCUSATION) && (
        <div className="main-game-area" style={{
          display: "flex", flexDirection: "row",
          justifyContent: "space-between",
          margin: "0 auto",
          maxWidth: 1120, minHeight: 550, position: "relative"
        }}>
          {/* Cartoon Crime Scene */}
          <section style={{
            flex: 2,
            background: "#E7F3FC",
            borderRadius: 18,
            position: "relative",
            margin: 14,
            minHeight: 400,
            boxShadow: "0 2px 16px #aed4ff42"
          }}>
            <CrimeScene
              clues={clues}
              onClueFound={onClueFound}
              sceneComplete={clues.filter(c => c.found && !c.redHerring).length === initialClues.filter(c => !c.redHerring).length}
            />
          </section>
          {/* Side panel: Notebook or Suspect list */}
          <aside style={{
            flex: 1, minWidth: 320, maxWidth: 340,
            margin: 14,
            borderRadius: 18,
            background: "#fff8f1",
            boxShadow: "0 2px 12px #efd29a35"
          }}>
            {notebookOpen ?
              <ClueNotebook
                clues={clues}
                suspects={suspects}
                onSuspectClick={startInterrogation}
                selectedClueId={null}
              /> :
              <SuspectPanel
                suspects={suspects}
                onSuspect={startInterrogation}
              />}
          </aside>
        </div>
      )}

      {/* Accusation system */}
      {accusationOpen && (
        <AccusationPanel
          suspects={suspects}
          onAccuse={handleAccuse}
          onCancel={closeAccusation}
        />
      )}

      {/* Interrogation chat modal */}
      {(gamePhase === GAME_PHASES.INTERROGATION && selectedSuspect) && (
        <InterrogationModal
          suspect={suspects.find(s => s.id === selectedSuspect)}
          clues={clues}
          onClose={endInterrogation}
        />
      )}

      {/* Animated ending + feedback */}
      {(gamePhase === GAME_PHASES.ENDING && ending) && (
        <AnimatedScene
          type="ending"
          ending={ending}
          suspect={ending.suspect}
          onDone={onAnimationComplete}
        />
      )}

      {/* End game modal */}
      {showGameOver && (
        <GameOverModal
          ending={ending}
          onRestart={restartGame}
        />
      )}

      {/* Mobile floating notebook/suspect toggle */}
      <div className="mobile-game-toggle-bar" style={{
        position: "fixed",
        left: 10, right: 10,
        bottom: 14,
        display: "flex",
        justifyContent: "center",
        zIndex: 100
      }}>
        <button
          className="cartoon-btn"
          style={{
            background: THEME_COLORS.primary,
            color: "#fff",
            borderRadius: 12,
            margin: "0 8px",
            fontWeight: "bold",
            fontSize: 18,
            boxShadow: "0 1px 6px #0002",
            padding: "8px 18px",
            letterSpacing: 0.5
          }}
          onClick={toggleNotebook}
        >
          {notebookOpen ? "Show Suspects" : "Notebook/Clues"}
        </button>
        <button
          className="cartoon-btn"
          style={{
            background: THEME_COLORS.accent,
            color: "#fff",
            borderRadius: 12,
            margin: "0 8px",
            fontWeight: "bold",
            fontSize: 18,
            boxShadow: "0 1px 6px #0002",
            padding: "8px 18px"
          }}
          onClick={openAccusation}
        >Accuse!</button>
      </div>

      {/* Freepik visual asset sample showcase (at footer for integration demonstration) */}
      <div style={{
        width: "100%",
        margin: "0 auto",
        maxWidth: 680,
        background: "#f5fafd",
        borderRadius: 16,
        marginBottom: 14,
        boxShadow: "0 1px 8px #b9e0ff2e"
      }}>
        <FreepikMysteryImages />
      </div>
    </div>
  );
}

export default App;
