import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ExamPage = () => {
  const [started, setStarted] = useState(false);
  const [examEnded, setExamEnded] = useState(false);
  const [showResumeButton, setShowResumeButton] = useState(false);
  const navigate = useNavigate();
  let timeoutId;

  // ✅ تفعيل وضع الشاشة الكاملة
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

  // ✅ الخروج من وضع الشاشة الكاملة إذا كان مفعّلًا
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

  // ✅ بدء الامتحان
  const startExam = () => {
    enterFullScreen();
    setStarted(true);
    setExamEnded(false);
  };

  // ✅ إنهاء الامتحان والعودة إلى الصفحة الرئيسية
  const finishExam = () => {
    exitFullScreen();
    navigate("/");
  };

  useEffect(() => {
    if (!started) return;

    // ✅ معالجة التغيير في وضع الشاشة الكاملة
    const handleFullScreenChange = () => {
      if (!document.fullscreenElement && !examEnded) {
        setShowResumeButton(true);
        alert("لقد خرجت من وضع الامتحان! اضغط على الزر للعودة.");

        timeoutId = setTimeout(() => {
          navigate("/disqualified");
        }, 60000);
      } else {
        clearTimeout(timeoutId);
      }
    };

    // ✅ معالجة الخروج من التبويب
    const handleTabChange = () => {
      if (document.hidden && !examEnded) {
        setShowResumeButton(true);
        alert("تم اكتشاف خروجك من صفحة الامتحان! لديك 60 ثانية للعودة قبل الاستبعاد.");

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
          ابدأ الامتحان
        </button>
      ) : (
        <>
          <h1>امتحانك بدأ الآن!</h1>
          <p>يُرجى البقاء داخل هذه الصفحة حتى تنتهي من الامتحان.</p>

          {/* ✅ زر إنهاء الامتحان والعودة للصفحة الرئيسية */}
          <button 
            onClick={finishExam} 
            style={{ padding: "10px 20px", fontSize: "16px", marginTop: "20px", background: "green", color: "white", border: "none", cursor: "pointer" }}
          >
            إنهاء الامتحان
          </button>

          {showResumeButton && (
            <div>
              <button 
                onClick={() => {
                  enterFullScreen();
                  setShowResumeButton(false);
                  clearTimeout(timeoutId);
                }} 
                style={{  padding: "10px 20px", fontSize: "16px", marginTop: "20px", background: "green", color: "white", border: "none", cursor: "pointer"}}
              >
                العودة إلى الامتحان
              </button>
              <br />
              {/* <button 
                onClick={exitFullScreen} 
                disabled={examEnded} 
                style={{ padding: "10px 20px", fontSize: "16px", marginTop: "20px", background: "red", color: "white", border: "none", cursor: examEnded ? "not-allowed" : "pointer" }}
              >
                إنهاء الامتحان
              </button> */}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ExamPage;
