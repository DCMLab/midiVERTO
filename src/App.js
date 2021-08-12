import Navbar from './Navbar';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

//Pages
import Home from './pages/Home';
import Visualization from './pages/Visualization';

function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Navbar />
      <Switch>
        <Route exact path='/'>
          <Home />
        </Route>
        <Route path='/visualization'>
          <Visualization />
        </Route>
        <Route component={Home} status={404}></Route>
      </Switch>
    </Router>
  );
}

export default App;
