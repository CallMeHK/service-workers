import { useState, useEffect, useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


// Start the communication


function App() {
  const [count, _setCount] = useState(0)
  const _updateSharedState = useRef()
  const updateSharedState = _updateSharedState.current

  useEffect(() => {
    const worker = new SharedWorker('/src/assets/shared-worker.js');
    function __updateSharedState(newState) {
        worker.port.postMessage({ type: 'updateState', state: newState });
    }
    _updateSharedState.current = __updateSharedState
    worker.port.onmessage = function (event) {
        const data = event.data;
    
        if (data.type === 'init') {
            // Initialize tab with the current shared state
            console.log('Initial state:', data.state);
            _setCount(data.state.count)
        } else if (data.type === 'stateUpdated') {
            // React to state updates
            console.log('State updated:', data.state);
        }
    };

    worker.port.start();
  }, [])

  const setCount = (countFn) => {
    const _count = countFn(count)
    _setCount(_count)
    updateSharedState({count: _count})
  }

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
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
