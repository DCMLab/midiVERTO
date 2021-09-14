import Navbar from './Navbar';
import { HashRouter, Route, Switch } from 'react-router-dom';

//Pages
import Home from './pages/Home';
import Visualization from './pages/Visualization';
import Live from './pages/Live';

function App() {
  return (
    <HashRouter basename={process.env.PUBLIC_URL}>
      <Navbar />
      <Switch>
        <Route exact path='/' component={Home}></Route>
        <Route exact path='/visualization' component={Visualization}></Route>
        <Route exact path='/live' component={Live}></Route>
      </Switch>
    </HashRouter>
  );
}

export default App;
