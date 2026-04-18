function App() {
  return (
    <div className="min-h-screen bg-briefing-surface">
      <header className="bg-briefing-primary text-white p-4">
        <h1 className="font-briefing text-xl">amazing-briefing-viewer</h1>
        <p className="text-sm opacity-80">High-signal project briefing</p>
      </header>
      
      <main className="p-6 max-w-4xl mx-auto">
        <div className="briefing-card">
          <h2 className="briefing-header mb-4">Project Not Loaded</h2>
          <p className="briefing-label">Configure a project to view its briefing.</p>
          
          <div className="mt-4 p-4 bg-gray-50 rounded">
            <p className="text-sm text-briefing-muted">
              Expected artifacts:
            </p>
            <ul className="mt-2 text-sm space-y-1">
              <li>• Product North Star</li>
              <li>• RunState</li>
              <li>• Feature Specs</li>
              <li>• Execution Results</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6 briefing-card">
          <h3 className="briefing-header mb-2">V1 Scope</h3>
          <p className="text-sm">
            Single-project briefing viewer with Executive Brief, What Changed,
            Current State, Recommended Next Step, and Evidence Panel.
          </p>
        </div>
      </main>
    </div>
  )
}

export default App