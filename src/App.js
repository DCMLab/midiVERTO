import Navbar from './Navbar';
import { HashRouter, Route, Switch } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';

//Pages
import Home from './pages/Home';
import Visualization from './pages/Visualization';
import Live from './pages/Live';
import Keyboard from './pages/Keyboard';
import Application from './pages/Application';

function App() {
  return (
    <>
      <CssBaseline />
      <HashRouter basename={process.env.PUBLIC_URL}>
        <Navbar />
        <Switch>
          <Route exact path='/' component={Home}></Route>
          <Route exact path='/visualization' component={Visualization}></Route>
          <Route exact path='/live' component={Live}></Route>
          <Route exact path='/keyboard' component={Keyboard}></Route>
          <Route exact path='/analysis' component={Application}></Route>
        </Switch>
      </HashRouter>
    </>
  );
}

export default App;
