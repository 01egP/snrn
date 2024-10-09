import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import UserComponent from './components/UserComponent';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={UserComponent} />
      </Switch>
    </Router>
  );
}

export default App;
