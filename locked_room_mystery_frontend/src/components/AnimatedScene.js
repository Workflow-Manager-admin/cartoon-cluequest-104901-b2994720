import React, { useEffect } from "react";

/**
 * PUBLIC_INTERFACE
 * AnimatedScene - Flexible visual scene for intro/ending/animations.
 * Props:
 *   type: "intro" | "ending"
 *   onDone: fn()
 *   ending (optional): ending result object
 *   suspect (optional): suspect for endings
 */
function AnimatedScene({ type, onDone, ending, suspect }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 3200);
    return () => clearTimeout(timer);
  }, [onDone]);

  if (type === "intro")
    return (
      <div style={{
        position: "fixed",
        top: 0, left: 0,
        background: "#fff1ecEE",
        width: "100vw", height: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 888
      }}>
        <div style={{
          textAlign: "center",
          background: "#fff",
          borderRadius: 22,
          padding: "55px 35px",
          boxShadow: "0 6px 62px #EDD9B7"
        }}>
          <h1 style={{
            color: "#4E6E9A", fontWeight: 800, fontSize: 38,
            letterSpacing: 1, marginBottom: 16, fontFamily: "Comic Sans MS, Comic Sans, cursive"
          }}>
            Locked Room Mystery
          </h1>
          <img
            src="https://img.freepik.com/free-vector/detective-finds-murdered-man_1308-37349.jpg?w=680"
            alt="Cartoon detective opening"
            style={{
              maxWidth: 340, borderRadius: 12, boxShadow: "0 2px 18px #bbb"
            }}
            draggable={false}
          />
          <div style={{ fontSize: 24, margin: "35px 0 10px 0" }}>
            <span style={{color:"#E74C3C", fontWeight:700}}>A crime has been committed...</span><br/>
            Only your detective wits can solve it!
          </div>
          <div style={{ fontSize: 18, color: "#F5B041" }}>(Click to start)</div>
        </div>
      </div>
    );

  if (type === "ending") {
    const win = ending.type === "success";
    // Reveal types: correct, fail clues, fail logic. Use ending/props to customize.
    return (
      <div style={{
        position: "fixed",
        top: 0, left: 0,
        background: "#fff1ecdd",
        width: "100vw", height: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 1001
      }}>
        <div
          style={{
            textAlign: "center",
            background: "#fff",
            borderRadius: 22,
            padding: "54px 36px",
            boxShadow: "0 10px 70px #E74C3C44"
          }}>
          <div style={{ fontSize: 68 }}>{suspect ? suspect.emoji : ""}</div>
          <h2 style={{
            color: win ? "#4E6E9A" : "#E74C3C",
            fontWeight: 800, letterSpacing: 0.5, fontSize: 32, marginBottom: 10
          }}>
            {win ?
              "You solved the case!" :
              (ending.type === "fail-clues" ?
                "Not enough evidence..." : "Wrong suspect!")}
          </h2>
          <div style={{
            fontSize: 24,
            margin: "10px 0 10px 0",
            color: win ? "#4E6E9A" : "#E74C3C"
          }}>
            {win ?
              `Congratulations—you correctly accused ${suspect ? suspect.name : "the culprit"}!`
              :
              (ending.type === "fail-clues" ?
                "You needed more clues for a solid accusation." :
                "Try connecting clues and suspects with deduction!")
            }
          </div>
          <img
            src={win ?
              "https://img.freepik.com/free-vector/happy-policeman-giving-thumb-up-cartoon_1308-155812.jpg?w=400" :
              "https://img.freepik.com/free-vector/mad-detective-working-table_1308-30398.jpg?w=400"}
            alt="Ending"
            style={{ maxWidth: 190, margin: "17px auto", borderRadius: 9, boxShadow: "0 1px 12px #bbb" }}
            draggable={false}
          />
        </div>
      </div>
    );
  }
  return null;
}

export default AnimatedScene;
