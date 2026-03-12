import logo from './logo.svg';
import './App.css';
import OficinaComponente from './componentes/OficinaComponente';
import OficinaBandeira from './componentes/OficinaBandeira';
import OficinaForm from './componentes/OficinaForm';
import OficinaIp from './componentes/OficinaIp';

function App() {
  return (
    <div className="App">
      <OficinaComponente />
      <OficinaBandeira />
      <OficinaForm />
      <OficinaIp />
    </div>
  );
}

export default App;
