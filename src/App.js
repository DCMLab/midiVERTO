import Navbar from './Navbar';
import { HashRouter, Route, Switch } from 'react-router-dom';

//Pages
import Home from './pages/Home';
import Visualization from './pages/Visualization';

function App() {
  return (
    <HashRouter basename={process.env.PUBLIC_URL}>
      <Navbar />
      <Switch>
        <Route exact path='/' component={Home}></Route>
        <Route exact path='/visualization' component={Visualization}></Route>
      </Switch>
    </HashRouter>
  );
}

export default App;
