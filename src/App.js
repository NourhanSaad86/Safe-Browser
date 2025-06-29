import { BrowserRouter, Routes, Route } from "react-router-dom";
import ExamPage from "./ExamPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ExamPage />} />
        <Route path="/disqualified" element={<h1>لقد تم استبعادك من الامتحان</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
