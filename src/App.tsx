import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ReactLiveEditor from "./pages/ReactLiveEditor";
import WebIDE from "./pages/WebContainerPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ReactLiveEditor />} />
        <Route path="/webcontainer" element={<WebIDE />} />
      </Routes>
    </Router>
  );
}

export default App;
