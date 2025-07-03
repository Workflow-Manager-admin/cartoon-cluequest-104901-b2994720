import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import FreepikMysteryImages from './FreepikMysteryImages';
import CrimeScene from './components/CrimeScene';
import ClueNotebook from './components/ClueNotebook';
import SuspectPanel from './components/SuspectPanel';
import InterrogationModal from './components/InterrogationModal';
import AnimatedScene from './components/AnimatedScene';
import AccusationPanel from './components/AccusationPanel';
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

// --- Enhanced feedback: toast/snackbar/animated regions ---
function FeedbackBar({ message, type, onClose }) {
  return (
    <div className="noir-toast-bar"
         style={{background: type === "success" ? "linear-gradient(90deg,var(--accent) 75%,var(--success) 100%)"
                 : type === "fail" ? "linear-gradient(90deg,var(--danger) 80%,#684 100%)"
                 : undefined }}>
      {message}
      {onClose && (
        <button aria-label="Dismiss"
                onClick={onClose}
                style={{
                  marginLeft: 18, background: "none", border: "none", color: "#fff",
                  fontWeight: 700, fontSize: 24, cursor: "pointer", opacity: 0.83
                }}
        >×</button>
      )}
    </div>
  );
}

function Snackbar({ message, type, onClose }) {
  return (
    <div className="noir-snackbar"
         style={{
           background: type === "success" ? "var(--success)" :
                       type === "fail" ? "var(--danger)" : "var(--accent)",
         }}>
      {message}
      {onClose && (
        <button aria-label="Close"
          onClick={onClose}
          style={{
            marginLeft: 12, background: "none", border: "none", color: "#fff",
            fontWeight: 700, fontSize: 18, cursor: "pointer"
          }}>×</button>
      )}
    </div>
  );
}




/**
 * Upgraded core clues and red herrings for a more challenging, narratively rich, and engaging mystery.
 * Each clue provides stronger story connection, cleverer logic, and integrates advanced red herring mechanics.
 * 
 * New fields: 
 * - extraHint: optional hint supplied after initial puzzle fail
 * - redHerringType: for more sophisticated decoy logic (e.g. "diversion", "partial-truth")
 * - fakeLink: ties some red herrings to suspect or story for deeper player misdirection
 * - explanation: how the clue helps/hurts the case post-discovery, for logics/mini-UX
 */
const initialClues = [
  {
    id: "clue-bloodstain", name: "Bloodstain on Sculpture", found: false,
    location: { x: 40, y: 25 },
    puzzle: "pattern",
    description: "A smear of fresh blood trails the edge of the broken marble sculpture, too high for a simple fall.",
    extraHint: "The blood pattern curves away from the accident site.",
    redHerring: false,
    connections: [],
    canonical: true,
    flavor: "crime",
    difficulty: "hard",
    explanation: "Suggests victim interacted with attacker at close range; not accidental."
  },
  {
    id: "clue-fingerprint", name: "Glove Print on Window Latch", found: false,
    location: { x: 63, y: 35 },
    puzzle: "match",
    description: "A partial print, consistent with a left glove, smudges the inner latch of a rarely opened window.",
    extraHint: "One suspect claims the window was always stuck.",
    redHerring: false,
    connections: [],
    canonical: true,
    flavor: "entry",
    difficulty: "medium",
    explanation: "Points to a forced entry or staged scene; links to alibis for time of entry."
  },
  {
    id: "clue-cat-hair", name: "Orange Cat Hair", found: false,
    location: { x: 18, y: 77 },
    puzzle: "hidden",
    description: "Some long orange cat hair rests on the back of a padded chair, but the victim was allergic.",
    extraHint: "No cat reportedly lives at the house.",
    redHerring: true,
    redHerringType: "diversion",
    fakeLink: "Miss Peach",
    explanation: "Distracts from actual physical clues—the real culprit is not linked to pets."
  },
  {
    id: "clue-broken-watch", name: "Broken Gold Watch", found: false,
    location: { x: 78, y: 73 },
    puzzle: "logic",
    description: "A gold pocket watch, its crystal shattered and hands frozen at 7:12. The family crest is faintly bloodied.",
    extraHint: "The suspect’s dinner was due at 7:10.",
    redHerring: false,
    connections: [],
    canonical: true,
    flavor: "timing",
    difficulty: "hard",
    explanation: "Pinpoints time of fatal altercation; only one person has no alibi at this time."
  },
  {
    id: "clue-gloves", name: "Pair of Leather Gloves", found: false,
    location: { x: 59, y: 49 },
    puzzle: "logic",
    description: "Dark gloves partly hidden under the settee, with a faint reddish stain on one index finger.",
    extraHint: "Weather is mild—nobody claimed to need gloves tonight.",
    redHerring: false,
    connections: [],
    canonical: true,
    flavor: "tool",
    difficulty: "medium",
    explanation: "Implies a prepared intruder; excludes suspects with bare hands or open wounds."
  },
  {
    id: "clue-crushed-invite", name: "Crushed Party Invitation", found: false,
    location: { x: 34, y: 65 },
    puzzle: "hidden",
    description: "A crumpled, muddy party invite addressed to 'P. Plum', with a faded shoeprint.",
    extraHint: "The invite was not on the guest list.",
    redHerring: true,
    redHerringType: "partial-truth",
    fakeLink: "Prof. Plum",
    explanation: "Designed as a subtle decoy: Plum's invite was lost, but not found here—implies misdirection."
  },
  {
    id: "clue-detective-badge", name: "Dropped Detective’s Badge", found: false,
    location: { x: 12, y: 19 },
    puzzle: "pattern",
    description: "A cheap child’s detective badge lies beneath a side table, oddly clean amid the dust.",
    extraHint: "No children were present at the party.",
    redHerring: true,
    redHerringType: "whimsy",
    fakeLink: "",
    explanation: "Meant to confuse; unrelated to any guest or event."
  }
];

// Use stylized initials in place of emoji for noir
const initialSuspects = [
  {
    id: "suspect-miss-peach",
    name: "Miss Peach",
    avatar: "MP", // Noir minimalist avatar: stylized initials
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
    avatar: "PP", // Noir minimalist avatar: stylized initials
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
    avatar: "MB", // Noir minimalist avatar: stylized initials
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

  // Feedback/polish/UX state
  const [feedback, setFeedback] = useState(null); // { message, type }
  const [snackbar, setSnackbar] = useState(null);

  // Add smart feedback on clue/interrogation, accusation, etc.
  const showFeedback = (message, type = "neutral", time = 2000) => {
    setFeedback({ message, type });
    if (time > 0)
      setTimeout(() => setFeedback(null), time);
  };
  const showSnackbar = (message, type = "neutral", time = 2000) => {
    setSnackbar({ message, type });
    if (time > 0)
      setTimeout(() => setSnackbar(null), time);
  };

  // noir/minimalist: set background and color scheme once + motion theme
  useEffect(() => {
    document.documentElement.style.setProperty('background', 'linear-gradient(140deg, #15161a 74%, #202342 100%)');
    document.body.style.background = 'linear-gradient(140deg, #15161a 74%, #202342 100%)';
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.documentElement.style.setProperty('scroll-behavior', 'auto');
    }
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
    const clue = clues.find(c => c.id === clueId);
    if (clue) {
      showSnackbar(
        clue.redHerring
          ? `${clue.name}: Red herring! (Decoy clue)`
          : `Clue found: ${clue.name}`,
        clue.redHerring ? "fail" : "success"
      );
    }
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
      showFeedback("Case closed! You solved the mystery.", "success", 2300);
    } else if (clues.filter(c => c.found).length < 3) {
      type = "fail-clues";
      showFeedback("Not enough clues for an accusation!", "fail", 2300);
    } else {
      type = "fail-logic";
      showFeedback("Incorrect deduction—review your clues.", "fail", 2300);
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
      {/* Premium: Feedback bar (clue found, mistakes, accusation etc.) */}
      {feedback && <FeedbackBar message={feedback.message} type={feedback.type} onClose={() => setFeedback(null)} />}
      {snackbar && <Snackbar message={snackbar.message} type={snackbar.type} onClose={() => setSnackbar(null)} />}

      {/* Persistent navigation sidebar (vertical desktop, horizontal mobile) */}
      <nav className="noir-sidebar" aria-label="Primary" style={{
        transition: "box-shadow 0.31s cubic-bezier(.3,.81,.58,1.06)", zIndex: 1099
      }}>
        <button
          className={`noir-nav-btn${navTab === 0 ? " selected" : ""}`}
          aria-label="Crime Scene"
          onClick={() => { setNavTab(0); setGamePhase(GAME_PHASES.SCENE); showFeedback("Crime scene view", "neutral", 900); }}
          style={{transition: "background var(--transition), color var(--transition), box-shadow var(--transition)"}}
        >
          <span className="noir-icon" aria-hidden="true">🕵️</span>
          <span style={{ fontSize: 13, marginTop: 2 }}>Scene</span>
        </button>
        <button
          className={`noir-nav-btn${navTab === 1 ? " selected" : ""}`}
          aria-label="Clue Board"
          onClick={() => { setNavTab(1); setGamePhase(GAME_PHASES.NOTEBOOK); setNotebookOpen(true); showFeedback("Clue board opened", "neutral", 900); }}
        >
          <span className="noir-icon" aria-hidden="true">📝</span>
          <span style={{ fontSize: 13, marginTop: 2 }}>Clues</span>
        </button>
        <button
          className={`noir-nav-btn${navTab === 2 ? " selected" : ""}`}
          aria-label="Suspects"
          onClick={() => { setNavTab(2); setGamePhase(GAME_PHASES.SCENE); setNotebookOpen(false); showFeedback("Suspect dossiers loaded", "neutral", 900); }}
        >
          <span className="noir-icon" aria-hidden="true">🕴️</span>
          <span style={{ fontSize: 13, marginTop: 2 }}>Suspects</span>
        </button>
        <button
          className={`noir-nav-btn${navTab === 3 ? " selected" : ""}`}
          aria-label="Accuse"
          onClick={() => { setNavTab(3); openAccusation(); showFeedback("Prepare your accusation...", "danger", 1200); }}
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
          <main className="noir-main-area" role="main"
            style={{
              transition: "box-shadow 0.28s cubic-bezier(.7,-0.03,.62,1.12), background 0.19s",
              boxShadow: "0 4px 29px #31244c13"
            }}>
            {/* Scene on left, notebook/suspect drawer on right */}
            <section className="noir-board" style={{ transition: "box-shadow 0.28s" }}>
              <CrimeScene
                clues={clues}
                onClueFound={onClueFound}
                sceneComplete={
                  clues.filter(c => c.found && !c.redHerring).length === initialClues.filter(c => !c.redHerring).length
                }
              />
            </section>
            <aside className="noir-drawer-panel"
              aria-label={notebookOpen ? "Clue Board" : "Suspect List"}
              style={{
                boxShadow: notebookOpen
                  ? "0 3px 23px #4559df33"
                  : "0 1px 9px #243bfa18",
                transition: "box-shadow 0.35s cubic-bezier(.65,.23,.3,1.08)"
              }}>
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
        {/* Visual asset showcase (footer — for demonstration/polish only) */}
        <div style={{
          width: "100%", maxWidth: 690, margin: "0 auto",
          marginBottom: 14, background: "rgba(30,33,44,0.84)",
          borderRadius: 17, boxShadow: "0 1px 9px #0511451b",
          transition: "box-shadow 0.21s"
        }}>
          <FreepikMysteryImages />
        </div>
      </div>
    </div>
  );
}

export default App;
