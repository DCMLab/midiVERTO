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
        <Route path='/' component={Home} exact></Route>
        <Route path='/visualization' component={Visualization} exact></Route>
      </Switch>
    </Router>
  );
}

export default App;
