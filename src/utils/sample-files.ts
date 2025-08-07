import type { FileNode } from "./types";

export const defaultFiles: FileNode[] = [
  {
    name: "src",
    type: "folder",
    path: "src",
    children: [
      {
        name: "App.js",
        type: "file",
        path: "src/App.js",
        content: `import React, { useState } from 'react';
  import Counter from './components/Counter';
  import './App.css';
  
  function App() {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">My React App</h1>
          <Counter />
        </div>
      </div>
    );
  }
  
  export default App;`,
      },
      {
        name: "App.css",
        type: "file",
        path: "src/App.css",
        content: `/* Custom styles */
  .app {
    text-align: center;
  }
  
  .counter-container {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }`,
      },
      {
        name: "components",
        type: "folder",
        path: "src/components",
        children: [
          {
            name: "Counter.js",
            type: "file",
            path: "src/components/Counter.js",
            content: `import React, { useState } from 'react';
  
  function Counter() {
    const [count, setCount] = useState(0);
    
    return (
      <div className="counter-container bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Counter Component</h2>
        <p className="text-2xl mb-4">Count: {count}</p>
        <div className="space-x-2">
          <button
            onClick={() => setCount(count + 1)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Increment
          </button>
          <button 
            onClick={() => setCount(count - 1)}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Decrement
          </button>
          <button 
            onClick={() => setCount(0)}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Reset
          </button>
        </div>
      </div>
    );
  }
  
  export default Counter;`,
          },
        ],
      },
    ],
  },
];

export const defaultCode = `function MyComponent() {
    const [count, setCount] = useState(0);
    
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Hello React!</h1>
        <p className="mb-4">Count: {count}</p>
        <button 
          onClick={() => setCount(count + 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Click me!
        </button>
      </div>
    );
  }`;

export const jsxExample = `function MyComponent() {
    const [name, setName] = useState('World');
    
    return (
      <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Hello Example</h2>
        <input 
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          placeholder="Enter your name"
        />
        <p className="text-gray-700">Hello, {name}!</p>
      </div>
    );
  }`;

export const todoExample = `function MyComponent() {
    const [todos, setTodos] = useState(['Learn React', 'Build something cool']);
    const [newTodo, setNewTodo] = useState('');
    
    const addTodo = () => {
      if (newTodo.trim()) {
        setTodos([...todos, newTodo]);
        setNewTodo('');
      }
    };
    
    const removeTodo = (index) => {
      setTodos(todos.filter((_, i) => i !== index));
    };
    
    return (
      <div className="p-6 max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-4">Todo List</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            className="flex-1 p-2 border rounded"
            placeholder="Add new todo"
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          />
          <button
            onClick={addTodo}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add
          </button>
        </div>
        <ul className="space-y-2">
          {todos.map((todo, index) => (
            <li key={index} className="flex justify-between items-center p-2 bg-gray-100 rounded">
              <span>{todo}</span>
              <button
                onClick={() => removeTodo(index)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }`;

export const createIframeContent = (userCode: string): string => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body {
      margin: 0; 
      padding: 0; 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    }
    #root { 
      width: 100%; 
      height: 100vh; 
      overflow: auto; 
    }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    const { useState, useEffect, useCallback, useMemo } = React;
    
    try {
      ${userCode}
      
      if (typeof MyComponent !== 'function') {
        throw new Error('MyComponent must be a function');
      }
      
      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(React.createElement(MyComponent));
      
      // 성공 메시지 전송
      window.parent.postMessage({ type: 'success' }, '*');
      
    } catch (error) {
      // 에러 메시지 전송
      window.parent.postMessage({ 
        type: 'error', 
        message: error.message,
        stack: error.stack 
      }, '*');
      
      // 에러를 화면에도 표시
      document.getElementById('root').innerHTML = 
        '<div style="padding: 20px; color: red; font-family: monospace; white-space: pre-wrap;">' +
        'Error: ' + error.message + 
        '</div>';
    }
  </script>
</body>
</html>`;
};
