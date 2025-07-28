import { useState } from 'react'

function App() {
  const [tabGroups, setTabGroups] = useState<chrome.tabGroups.TabGroup[]>([])
  const [tabs, setTabs] = useState<chrome.tabs.Tab[]>([])

  const onClick = async () =>{
    const tabs = await chrome.tabs.query({})
    const tabGroups = await chrome.tabGroups.query({})
    if (tabs.length > 0) {
      setTabs(tabs)
    }
    if (tabGroups.length > 0) {
      setTabGroups(tabGroups)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Tab Group Extension
        </h1>
        <p>{tabs.length} active tab(s) and {tabGroups.length} tab group(s)</p>
        
        {tabs.length > 0 && (
          <>
            <h3>Active Tabs</h3>
            <ul className="list-disc list-inside mb-4">
              {tabs.map((tab) => (
                <li key={tab.id}>{tab.title}</li>
              ))}
            </ul>
          </>
        )}
        
        {tabGroups.length > 0 && (
          <>
            <h3>Tab Groups</h3>
            <ul className="list-disc list-inside mb-4">
              {tabGroups.map((group) => (
                <li key={group.id}>{group.title}</li>
              ))}
            </ul>
          </>
        )}
        <button
          className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded"
          onClick={onClick}
        >
          Get Tabs and Groups
        </button>
      </div>
    </div>
  )
}

export default App