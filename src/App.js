import Navbar from './Navbar';
import Visualization from './Visualization';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

//Pages
import Home from './Home';

function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route exact path='/'>
          <Home />
        </Route>
        <Route path='/visualization'>
          <Visualization />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
