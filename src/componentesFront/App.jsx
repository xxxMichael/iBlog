import { useState } from 'react'
import reactLogo from '/src/assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import 'atropos/css'
import Atropos from 'atropos/react';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div id="app">
      <Atropos
        activeOffset={40}
        shadowScale={1.05}
        onEnter={() => console.log('Enter')}
        onLeave={() => console.log('Leave')}
        onRotate={(x, y) => console.log('Rotate', x, y)}
      >

        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo}  className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        </Atropos>

      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
