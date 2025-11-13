import React from 'react';

const TabsContext = React.createContext();

export function Tabs({ children, value, onValueChange, className = '' }) {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={className}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className = '' }) {
  return (
    <div className={`inline-flex h-10 items-center justify-center rounded-md bg-gray-800 p-1 text-gray-400 ${className}`}>
      {children}
    </div>
  );
}

export function TabsTrigger({ children, value, className = '' }) {
  const { value: activeValue, onValueChange } = React.useContext(TabsContext);

  return (
    <button
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${activeValue === value ? 'bg-cyan-600 text-white shadow-sm' : 'text-gray-400 hover:text-white'} ${className}`}
      onClick={() => onValueChange(value)}
      data-state={activeValue === value ? 'active' : 'inactive'}
    >
      {children}
    </button>
  );
}

export function TabsContent({ children, value, className = '' }) {
  const { value: activeValue } = React.useContext(TabsContext);

  if (activeValue !== value) return null;

  return (
    <div className={`mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 ${className}`}>
      {children}
    </div>
  );
}
