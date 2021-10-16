import Navbar from './Navbar';
import { HashRouter, Route, Switch } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';

//Pages
import Home from './pages/Home';
import Theory from './pages/Theory';
import Application from './pages/Application';

function App() {
  return (
    <>
      <CssBaseline />
      <HashRouter basename={process.env.PUBLIC_URL}>
        <Navbar />
        <Switch>
          <Route exact path='/' component={Home}></Route>
          <Route exact path='/theory' component={Theory}></Route>
          <Route exact path='/analysis' component={Application}></Route>
        </Switch>
      </HashRouter>
    </>
  );
}

export default App;
