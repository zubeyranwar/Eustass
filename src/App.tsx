import Toolbar from "./components/toolbar"
import Canvas from "./components/canvas"
import LeftSidePanel from "./components/left-side-panel"
import PropertiesPanel from "./components/properties-panel"
import EngineStateProvider from "./components/engine-state"

function App() {
  return (
    <EngineStateProvider>
      <main className="flex flex-col h-screen">
        <Toolbar />
        <div className="bg-red-400 flex flex-1 w-full mt-10">
          <LeftSidePanel />
          <Canvas />
          <PropertiesPanel />
        </div>
      </main>
    </EngineStateProvider>
  )
}

export default App
