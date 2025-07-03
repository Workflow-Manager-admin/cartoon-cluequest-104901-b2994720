import React, { useState, useEffect } from 'react';
import './App.css';
import FreepikMysteryImages from './FreepikMysteryImages';
import CrimeScene from './components/CrimeScene';
import ClueNotebook from './components/ClueNotebook';
import SuspectPanel from './components/SuspectPanel';
import InterrogationModal from './components/InterrogationModal';
import AnimatedScene from './components/AnimatedScene';
import AccusationPanel from './components/AccusationPanel';
import GameHeader from './components/GameHeader'; // For now, will refactor header in next steps
import GameOverModal from './components/GameOverModal';

// Minimalist/Noir theme state
const GAME_PHASES = Object.freeze({
  INTRO: 'intro',
  SCENE: 'scene',
  NOTEBOOK: 'notebook',
  INTERROGATION: 'interrogation',
  ACCUSATION: 'accusation',
  ENDING: 'ending'
});

const initialClues = [
  {
    id: "clue-bloodstain", name: "Bloodstain", found: false, location: { x: 40, y: 25 },
    puzzle: "pattern",
    description: "A fresh bloodstain near the broken vase.",
    redHerring: false,
    connections: [],
  },
  {
    id: "clue-fingerprint", name: "Fingerprint", found: false, location: { x: 65, y: 38 },
    puzzle: "match",
    description: "A suspicious fingerprint on the window.",
    redHerring: false,
    connections: [],
  },
  {
    id: "clue-cat-hair", name: "Cat Hair", found: false, location: { x: 15, y: 79 },
    puzzle: "hidden",
    description: "A clump of orange cat hair on the chair.",
    redHerring: true,
    connections: [],
  },
  {
    id: "clue-broken-watch", name: "Broken Watch", found: false, location: { x: 75, y: 77 },
    puzzle: "logic",
    description: "A classic watch stopped at 7:12.",
    redHerring: false,
    connections: [],
  }
];

// Use stylized initials in place of emoji for noir
const initialSuspects = [
  {
    id: "suspect-miss-peach",
    name: "Miss Peach",
    avatar: "MP",
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
    avatar: "PP",
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
    avatar: "MB",
    description: "The mysterious butler, loyal but secretive.",
    emotion: "defiant",
    dialogues: ["I did only as I was told.", "Those questions are... unnecessary.", "I don't know about any bloodstain."],
    alibi: "Preparing dinner.",
    motive: "Rumored argument with victim.",
    clueLinks: ["clue-broken-watch"],
    guilty: true
  }
];

// PUBLIC_INTERFACE
function App() {
  /**
   * Root component controlling game phase, state, and rendering.
   * Handles navigation, theme, asset rendering, and master state.
   */
  const [gamePhase, setGamePhase] = useState(GAME_PHASES.INTRO);
  // Theme currently fixed, palette controlled by CSS variables
  const [clues, setClues] = useState(initialClues);
  const [suspects, setSuspects] = useState(initialSuspects);
  const [notebookOpen, setNotebookOpen] = useState(false);
  const [selectedSuspect, setSelectedSuspect] = useState(null);
  const [accusationOpen, setAccusationOpen] = useState(false);
  const [ending, setEnding] = useState(null);
  const [showGameOver, setShowGameOver] = useState(false);
  const [sceneAnimation, setSceneAnimation] = useState({ type: "intro", playing: true });

  // noir/minimalist: set background and color scheme once
  useEffect(() => {
    document.documentElement.style.setProperty('background', 'linear-gradient(140deg, #15161a 74%, #202342 100%)');
    document.body.style.background = 'linear-gradient(140deg, #15161a 74%, #202342 100%)';
  }, []);

  // Navigation helpers
  const goToPhase = (phase) => {
    setGamePhase(phase);
    setNotebookOpen(false);
    setSelectedSuspect(null);
    setAccusationOpen(false);
  };

  // PUBLIC_INTERFACE
  const onClueFound = (clueId) => {
    setClues(prev =>
      prev.map(c => (c.id === clueId ? { ...c, found: true } : c))
    );
  };

  // PUBLIC_INTERFACE
  const startInterrogation = (suspectId) => {
    setSelectedSuspect(suspectId);
    setGamePhase(GAME_PHASES.INTERROGATION);
  };

  // PUBLIC_INTERFACE
  const endInterrogation = () => {
    setSelectedSuspect(null);
    setGamePhase(GAME_PHASES.SCENE);
  };

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

  // --- Navigation layout state ---
  // navTab: 0 = Scene, 1 = Clues, 2 = Suspects, 3 = Accuse
  const [navTab, setNavTab] = useState(0);

  // Keyboard navigation - sketch for A11y
  useEffect(() => {
    const handleShortcuts = e => {
      if (e.altKey && !e.shiftKey) {
        if (e.key === "1") setNavTab(0);
        if (e.key === "2") setNavTab(1);
        if (e.key === "3") setNavTab(2);
        if (e.key === "4") setNavTab(3);
      }
    };
    window.addEventListener("keydown", handleShortcuts);
    return () => window.removeEventListener("keydown", handleShortcuts);
  }, []);

  // --- Main rendering ---
  return (
    <div className="App">
      {/* Persistent navigation sidebar (vertical desktop, horizontal mobile) */}
      <nav className="noir-sidebar" aria-label="Primary">
        <button
          className={`noir-nav-btn${navTab === 0 ? " selected" : ""}`}
          aria-label="Crime Scene"
          onClick={() => { setNavTab(0); setGamePhase(GAME_PHASES.SCENE); }}
        >
          <span className="noir-icon" aria-hidden="true">🕵️</span>
          <span style={{ fontSize: 13, marginTop: 2 }}>Scene</span>
        </button>
        <button
          className={`noir-nav-btn${navTab === 1 ? " selected" : ""}`}
          aria-label="Clue Board"
          onClick={() => { setNavTab(1); setGamePhase(GAME_PHASES.NOTEBOOK); setNotebookOpen(true); }}
        >
          <span className="noir-icon" aria-hidden="true">📝</span>
          <span style={{ fontSize: 13, marginTop: 2 }}>Clues</span>
        </button>
        <button
          className={`noir-nav-btn${navTab === 2 ? " selected" : ""}`}
          aria-label="Suspects"
          onClick={() => { setNavTab(2); setGamePhase(GAME_PHASES.SCENE); setNotebookOpen(false); }}
        >
          <span className="noir-icon" aria-hidden="true">🕴️</span>
          <span style={{ fontSize: 13, marginTop: 2 }}>Suspects</span>
        </button>
        <button
          className={`noir-nav-btn${navTab === 3 ? " selected" : ""}`}
          aria-label="Accuse"
          onClick={() => { setNavTab(3); openAccusation(); }}
        >
          <span className="noir-icon" aria-hidden="true" style={{ fontWeight: "bold" }}>⚡</span>
          <span style={{ fontSize: 13, marginTop: 2 }}>Accuse</span>
        </button>
      </nav>
      {/* Content wrapper */}
      <div className="noir-content-frame">
        {/* Noir header/topbar */}
        <header className="noir-header" role="banner">
          <div className="noir-header-brand">
            {/* Placeholder icon - replace with SVG silhouette later */}
            <span style={{
              fontWeight: 700, color: "var(--accent)",
              display: "inline-block", fontSize: 28, letterSpacing: "0.06em"
            }}>LRM</span>
            <span style={{
              color: "var(--text-main)", fontWeight: 700, letterSpacing: "0.02em", fontSize: 21
            }}>
              Locked Room Mystery
            </span>
          </div>
          {/* Game status/CTA */}
          <div className="noir-header-status" aria-live="polite">
            Clues: <b>{clues.filter(c => c.found && !c.redHerring).length} / {clues.filter(c => !c.redHerring).length}</b>
            <button
              className="noir-btn"
              style={{ marginLeft: 28 }}
              onClick={toggleNotebook}
              aria-label={notebookOpen ? "Hide Clue Board" : "Show Clue Board"}
            >{notebookOpen ? "Hide Clues" : "Clue Board"}</button>
            <button
              className="noir-btn-primary"
              style={{ marginLeft: 6 }}
              onClick={openAccusation}
              aria-label="Accuse a suspect"
            >Accuse</button>
          </div>
        </header>
        {/* Animated intro/ending overlays */}
        {(gamePhase === GAME_PHASES.INTRO && sceneAnimation.playing) && (
          <AnimatedScene type="intro" onDone={onAnimationComplete} />
        )}
        {(gamePhase === GAME_PHASES.ENDING && ending) && (
          <AnimatedScene type="ending" ending={ending} suspect={ending.suspect} onDone={onAnimationComplete} />
        )}
        {/* Modals */}
        {accusationOpen && (
          <AccusationPanel
            suspects={suspects}
            onAccuse={handleAccuse}
            onCancel={closeAccusation}
          />
        )}
        {(gamePhase === GAME_PHASES.INTERROGATION && selectedSuspect) && (
          <InterrogationModal
            suspect={suspects.find(s => s.id === selectedSuspect)}
            clues={clues}
            onClose={endInterrogation}
          />
        )}
        {/* Main game area */}
        {(gamePhase !== GAME_PHASES.INTRO && !sceneAnimation.playing) && (
          <main className="noir-main-area" role="main">
            {/* Scene on left, notebook/suspect drawer on right */}
            <section className="noir-board">
              <CrimeScene
                clues={clues}
                onClueFound={onClueFound}
                sceneComplete={
                  clues.filter(c => c.found && !c.redHerring).length === initialClues.filter(c => !c.redHerring).length
                }
              />
            </section>
            <aside className="noir-drawer-panel" aria-label={notebookOpen ? "Clue Board" : "Suspect List"}>
              {notebookOpen ? (
                <ClueNotebook
                  clues={clues}
                  suspects={suspects}
                  onSuspectClick={startInterrogation}
                  selectedClueId={null}
                />
              ) : (
                <SuspectPanel
                  suspects={suspects}
                  onSuspect={startInterrogation}
                />
              )}
            </aside>
          </main>
        )}
        {/* End game modal */}
        {showGameOver && (
          <GameOverModal
            ending={ending}
            onRestart={restartGame}
          />
        )}
        {/* Noir: Snackbars/feedback region for future accessibility */}
        {/* Visual asset showcase (footer — for demonstration/polish only) */}
        <div style={{
          width: "100%", maxWidth: 690, margin: "0 auto",
          marginBottom: 14, background: "rgba(30,33,44,0.84)",
          borderRadius: 17, boxShadow: "0 1px 9px #0511451b"
        }}>
          <FreepikMysteryImages />
        </div>
      </div>
    </div>
  );
}

export default App;
