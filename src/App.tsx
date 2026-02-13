import { Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { Home } from "./pages/Home";
import { CreateGroupPage } from "./pages/CreateGroupPage";
import { FindGroupPage } from "./pages/FindGroupPage";
import { PostDetail } from "./components/PostDetail";
import { ToDoPage } from "./pages/ToDoPage";
import { TimerPage } from "./pages/TimerPage";
import { CalendarPage } from "./pages/CalendarPage";
import { CreateDiscussionPage } from "./pages/CreateDiscussionPage";
import { DiscussionsPage } from "./pages/DiscussionsPage";
import { DiscussionPage } from "./pages/DiscussionPage";
import { useParams } from "react-router-dom";

// Wrapper components for proper useParams usage
const PostDetailWrapper = () => {
  const { id } = useParams<{ id: string }>();
  return <PostDetail postId={Number(id)} />;
};

const GroupDetailWrapper = () => {
  const { id } = useParams<{ id: string }>();
  return <PostDetail postId={Number(id)} />;
};

function App() {
  return (
    <div className="min-h-screen bg-cream text-ink transition-opacity duration-700 pt-20">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-8">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/create-group" element={<CreateGroupPage />} />
          <Route path="/find-group" element={<FindGroupPage />} />
          <Route path="/group/:id" element={<GroupDetailWrapper />} />
          <Route path="/post/:id" element={<PostDetailWrapper />} />
          <Route path="/todo" element={<ToDoPage />} />
          <Route path="/timer" element={<TimerPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/discussion/create" element={<CreateDiscussionPage />} />
          <Route path="/discussions" element={<DiscussionsPage />} />
          <Route path="/discussion/:id" element={<DiscussionPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
