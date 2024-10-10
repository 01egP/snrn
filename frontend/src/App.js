import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserComponent from './components/UserComponent';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserComponent />} />
      </Routes>
    </Router>
  );
}

export default App;
