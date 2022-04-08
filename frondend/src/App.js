import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Page/Home/Home";
import Chat from "./Page/Chat/Chat";
import ChatProvider from "./Context/ChatProvider";
function App() {
  return (
    <div className="App">
      <Router>
        <ChatProvider>
          <Routes>
            <Route path="/" element={<Home />} exact />
            <Route path="/chat" element={<Chat />} />
          </Routes>
        </ChatProvider>
      </Router>
    </div>
  );
}

export default App;
