import { Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { Home } from "./pages/Home";
import { CreateGroupPage } from "./pages/CreateGroupPage";
import { FindGroupPage } from "./pages/FindGroupPage";
import { PostDetail } from "./components/PostDetail";
import { TimerPage } from "./pages/TimerPage";
import { CalendarPage } from "./pages/CalendarPage";
import { ToDoPage } from "./pages/ToDoPage";
import { CreateDiscussionPage } from "./pages/CreateDiscussionPage";
import { DiscussionsPage } from "./pages/DiscussionsPage";
import { DiscussionPage } from "./pages/DiscussionPage";
import { useParams } from "react-router-dom";

function App() {
  return (
    <div className="min-h-screen bg-black text-gray-100 transition-opacity duration-700 pt-20">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/create-group" element={<CreateGroupPage />} />
          <Route path="/find-group" element={<FindGroupPage />} />
          <Route path="/group/:id" element={<PostDetail postId={Number(useParams().id)} />} />
          <Route path="/record-study-time" element={<TimerPage />} />
          <Route path="/calendar" element={<CalendarPage />} /> 
          <Route path="/todo" element={<ToDoPage />} /> 
          <Route path="/discussion/create" element={<CreateDiscussionPage />} /> 
          <Route path="/discussions" element={<DiscussionsPage />} />
          <Route path="/discussion/:id" element={<DiscussionPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;