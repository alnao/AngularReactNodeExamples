
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import PlayView from './PlayView';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/play/:storyId" element={<PlayView />} />
      </Routes>
    </Router>
  );
}

export default App;
