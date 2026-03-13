import logo from './logo.svg';
import './App.css';

import CameraComponent from './components/CameraComponent';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Mi Aplicación de Cámara</h1>
      </header>
      <main>
        <CameraComponent />
      </main>
    </div>
  );
}

export default App;
