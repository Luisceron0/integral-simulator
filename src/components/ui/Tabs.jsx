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
    <div className={`inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground ${className}`}>
      {children}
    </div>
  );
}

export function TabsTrigger({ children, value, className = '' }) {
  const { value: activeValue, onValueChange } = React.useContext(TabsContext);

  return (
    <button
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm ${activeValue === value ? 'bg-background text-foreground shadow-sm' : ''} ${className}`}
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
    <div className={`mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className}`}>
      {children}
    </div>
  );
}
