import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ExamPage = () => {
  const [started, setStarted] = useState(false);
  const [examEnded, setExamEnded] = useState(false);
  const [showResumeButton, setShowResumeButton] = useState(false);
  const navigate = useNavigate();
  let timeoutId;

  // Activate fullscreen mode
  const enterFullScreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
    setShowResumeButton(false);
  };

  // Exit fullscreen if active
  const exitFullScreen = () => {
    const isFullScreen =
      document.fullscreenElement ||
      document.mozFullScreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement;

    if (isFullScreen) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }

    setExamEnded(true);
    setStarted(false);
  };

  // Start the exam
  const startExam = () => {
    enterFullScreen();
    setStarted(true);
    setExamEnded(false);
  };

  // Finish exam and go back to home page
  const finishExam = () => {
    exitFullScreen();
    navigate("/");
  };

  useEffect(() => {
    if (!started) return;

    // Handle fullscreen change
    const handleFullScreenChange = () => {
      if (!document.fullscreenElement && !examEnded) {
        setShowResumeButton(true);
        alert("You have exited the exam mode! Click the button to resume.");

        timeoutId = setTimeout(() => {
          navigate("/disqualified");
        }, 60000);
      } else {
        clearTimeout(timeoutId);
      }
    };

    // Handle tab switch / visibility change
    const handleTabChange = () => {
      if (document.hidden && !examEnded) {
        setShowResumeButton(true);
        alert("You left the exam tab! You have 60 seconds to return before disqualification.");

        timeoutId = setTimeout(() => {
          navigate("/disqualified");
        }, 60000);
      } else {
        clearTimeout(timeoutId);
      }
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    document.addEventListener("visibilitychange", handleTabChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
      document.removeEventListener("visibilitychange", handleTabChange);
      clearTimeout(timeoutId);
    };
  }, [started, examEnded]);

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      {!started ? (
        <button onClick={startExam} style={{ padding: "10px 20px", fontSize: "16px" }}>
          Start Exam
        </button>
      ) : (
        <>
          <h1>Your Exam Has Started!</h1>
          <p>Please stay on this page until you finish the exam.</p>

          {/* Finish Exam Button */}
          <button 
            onClick={finishExam} 
            style={{ 
              padding: "10px 20px", fontSize: "16px", marginTop: "20px", background: "green", color: "white", border: "none", cursor: "pointer" 
            }}
          >
            Finish Exam
          </button>

          {showResumeButton && (
            <div>
              <button 
                onClick={() => {
                  enterFullScreen();
                  setShowResumeButton(false);
                  clearTimeout(timeoutId);
                }} 
                style={{ 
                  padding: "10px 20px", fontSize: "16px", marginTop: "20px", background: "green", color: "white", border: "none", cursor: "pointer"
                }}
              >
                Return to Exam
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ExamPage;