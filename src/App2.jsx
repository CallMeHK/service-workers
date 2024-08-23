import { useState, useEffect, useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("/src/assets/service-worker.js", {
        scope: "/",
      });
      if (registration.installing) {
        console.log("Service worker installing");
      } else if (registration.waiting) {
        console.log("Service worker installed");
      } else if (registration.active) {
        console.log("Service worker active");
      }
    } catch (error) {
      console.error(`Registration failed with ${error}`);
    }
  }
};

const CACHE_NAME = "v1";
const URL_TO_CACHE = "/sw-cache";

const getCacheValue = async (key) => {
  try {
    const cache = await caches.open(CACHE_NAME)
    const response = await cache.match(URL_TO_CACHE + '/' + key)
    const value = await response.json()

    return value
  } catch(e) {
    console.error('No cached data', e)
  }
}

const setCacheValue = (value) => {
  if (navigator.serviceWorker.controller){
   navigator.serviceWorker.postMessage(value)
  }
}

function App2() {
  const [count, _setCount] = useState(0)
  const _updateSharedState = useRef(() => {})
  const updateSharedState = _updateSharedState.current

  useEffect(() => {
    registerServiceWorker()
  }, [])

  const setCount = (countFn) => {
    const _count = countFn(count)
    _setCount(_count)
    setCacheValue(_count)
    getCacheValue('count').then(console.log)
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

export default App2
