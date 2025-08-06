import { useState, useEffect, useRef, useCallback } from "react";
import type { FileNode } from "../utils/types";

import {
  Copy,
  Play,
  RotateCcw,
  Code,
  Eye,
  Sparkles,
  Plus,
  Folder,
  File,
  X,
  FolderOpen,
} from "lucide-react";
import { Button } from "../components/Button";

const defaultFiles: FileNode[] = [
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

const defaultCode = `function MyComponent() {
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

const jsxExample = `function MyComponent() {
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

const todoExample = `function MyComponent() {
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

export default function ReactLiveEditor() {
  const [code, setCode] = useState(defaultCode);
  const [error, setError] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // 파일 시스템 관련 상태 추가
  const [files, setFiles] = useState<FileNode[]>(defaultFiles);
  const [activeFile, setActiveFile] = useState<string>("src/App.js");
  const [openFolders, setOpenFolders] = useState<Set<string>>(
    new Set(["src", "src/components"])
  );
  const [openTabs, setOpenTabs] = useState<string[]>(["src/App.js"]);
  const [showFileSystem, setShowFileSystem] = useState(false);

  const createIframeContent = useCallback((userCode: string) => {
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
  }, []);

  const executeCode = useCallback(
    (codeToExecute: string) => {
      if (!iframeRef.current) return;

      setIsExecuting(true);
      setError(null);

      const iframeContent = createIframeContent(codeToExecute);
      const blob = new Blob([iframeContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);

      iframeRef.current.src = url;

      // 이전 URL 정리
      return () => URL.revokeObjectURL(url);
    },
    [createIframeContent]
  );

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "success") {
        setError(null);
        setIsExecuting(false);
      } else if (event.data.type === "error") {
        setError(event.data.message);
        setIsExecuting(false);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      executeCode(code);
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [code, executeCode]);

  const handleReset = () => {
    setCode(defaultCode);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const loadExample = (exampleCode: string) => {
    setCode(exampleCode);
  };

  const findFile = useCallback(
    (path: string, nodes: FileNode[] = files): FileNode | null => {
      for (const node of nodes) {
        if (node.path === path) return node;
        if (node.children) {
          const found = findFile(path, node.children);
          if (found) return found;
        }
      }
      return null;
    },
    [files]
  );

  const updateFileContent = useCallback(
    (path: string, content: string) => {
      const updateNode = (nodes: FileNode[]): FileNode[] => {
        return nodes.map((node) => {
          if (node.path === path) {
            return { ...node, content };
          }
          if (node.children) {
            return { ...node, children: updateNode(node.children) };
          }
          return node;
        });
      };
      setFiles(updateNode(files));
    },
    [files]
  );

  const toggleFolder = (path: string) => {
    setOpenFolders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  };

  const openFile = (path: string) => {
    setActiveFile(path);
    if (!openTabs.includes(path)) {
      setOpenTabs((prev) => [...prev, path]);
    }
  };

  const closeTab = (path: string) => {
    setOpenTabs((prev) => {
      const newTabs = prev.filter((tab) => tab !== path);
      if (activeFile === path && newTabs.length > 0) {
        setActiveFile(newTabs[newTabs.length - 1]);
      }
      return newTabs;
    });
  };

  const addNewFile = (
    parentPath: string,
    name: string,
    type: "file" | "folder"
  ) => {
    const newPath = parentPath ? `${parentPath}/${name}` : name;
    const newNode: FileNode = {
      name,
      type,
      path: newPath,
      content: type === "file" ? "// New file\n" : undefined,
      children: type === "folder" ? [] : undefined,
    };

    const addToNode = (nodes: FileNode[]): FileNode[] => {
      return nodes.map((node) => {
        if (node.path === parentPath && node.type === "folder") {
          return {
            ...node,
            children: [...(node.children || []), newNode],
          };
        }
        if (node.children) {
          return { ...node, children: addToNode(node.children) };
        }
        return node;
      });
    };

    setFiles(addToNode(files));
    if (type === "file") {
      openFile(newPath);
    }
  };

  const renderFileTree = (nodes: FileNode[], level = 0) => {
    return nodes.map((node) => (
      <div key={node.path}>
        <div
          className={`flex items-center gap-2 px-2 py-1 hover:bg-gray-100 cursor-pointer ${
            activeFile === node.path ? "bg-blue-100" : ""
          }`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => {
            if (node.type === "folder") {
              toggleFolder(node.path);
            } else {
              openFile(node.path);
            }
          }}
        >
          {node.type === "folder" ? (
            openFolders.has(node.path) ? (
              <FolderOpen className="w-4 h-4 text-blue-500" />
            ) : (
              <Folder className="w-4 h-4 text-blue-500" />
            )
          ) : (
            <File className="w-4 h-4 text-gray-500" />
          )}
          <span className="text-sm">{node.name}</span>
        </div>
        {node.type === "folder" &&
          openFolders.has(node.path) &&
          node.children && (
            <div>{renderFileTree(node.children, level + 1)}</div>
          )}
      </div>
    ));
  };

  const activeFileContent = findFile(activeFile)?.content || "";

  return (
    <div className="min-h-screen bg-white w-full">
      {/* 헤더 */}
      <section className="w-full h-[50px] flex justify-between items-center">
        <div className="flex items-center text-lg font-bold text-gray-900">
          <Sparkles className="w-5 h-5 text-white mr-2" />
          <span className="ml-4">React Live Editor</span>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            onClick={() => setShowFileSystem(!showFileSystem)}
            size="sm"
            className="text-xs"
          >
            {showFileSystem ? "Hide Files" : "Show Files"}
          </Button>
          <Button
            onClick={() => loadExample(jsxExample)}
            size="sm"
            className="text-xs"
          >
            Input Example
          </Button>
          <Button
            onClick={() => loadExample(todoExample)}
            size="sm"
            className="text-xs"
          >
            Todo Example
          </Button>
          <Button
            onClick={handleReset}
            size="sm"
            className="text-xs flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </Button>
          <Button
            onClick={handleCopy}
            size="sm"
            className="text-xs flex items-center gap-1"
          >
            <Copy className="w-3 h-3" />
            Copy
          </Button>
          <Button
            onClick={() => executeCode(code)}
            size="sm"
            className="text-xs flex items-center gap-1"
            disabled={isExecuting}
          >
            <Play className="w-3 h-3" />
            {isExecuting ? "Running..." : "Run"}
          </Button>
        </div>
      </section>

      {/* 메인 컨텐츠 */}
      <div className="w-full h-full">
        <div className="flex h-[calc(100vh-64px)]">
          {/* 파일 시스템 (조건부 렌더링) */}
          {showFileSystem && (
            <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold mb-2">Project Files</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => addNewFile("src", "NewComponent.js", "file")}
                    className="flex items-center gap-1 text-xs px-2 py-1 bg-blue-100 hover:bg-blue-200 rounded"
                  >
                    <Plus className="w-3 h-3" />
                    File
                  </button>
                  <button
                    onClick={() => addNewFile("src", "newfolder", "folder")}
                    className="flex items-center gap-1 text-xs px-2 py-1 bg-blue-100 hover:bg-blue-200 rounded"
                  >
                    <Plus className="w-3 h-3" />
                    Folder
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-auto">
                {renderFileTree(files)}
              </div>
            </div>
          )}

          {/* 파일 에디터 탭 (조건부 렌더링) */}
          {showFileSystem && (
            <div className="flex flex-col border-r border-gray-200 w-64">
              {/* 탭 바 */}
              <div className="flex items-center bg-gray-50 border-b border-gray-200 min-h-[40px]">
                {openTabs.map((tab) => (
                  <div
                    key={tab}
                    className={`flex items-center gap-2 px-3 py-2 border-r border-gray-200 cursor-pointer ${
                      activeFile === tab
                        ? "bg-white border-b-2 border-blue-500"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => setActiveFile(tab)}
                  >
                    <File className="w-3 h-3" />
                    <span className="text-sm">{tab.split("/").pop()}</span>
                    {openTabs.length > 1 && (
                      <X
                        className="w-3 h-3 hover:text-red-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          closeTab(tab);
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* 파일 에디터 */}
              <div className="flex-1">
                <textarea
                  value={activeFileContent}
                  onChange={(e) =>
                    updateFileContent(activeFile, e.target.value)
                  }
                  className="w-full h-full p-4 font-mono text-sm border-none outline-none resize-none bg-gray-900 text-gray-100 leading-relaxed"
                  placeholder="Select a file to edit..."
                  spellCheck={false}
                />
              </div>
            </div>
          )}

          {/* 코드 에디터 */}
          <div className="flex flex-col border-r border-gray-200 flex-[2] h-full">
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200">
              <Code className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                Code Editor
              </span>
              <div className="ml-auto flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            </div>
            <div className="flex-1 relative">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-full p-6 font-mono text-sm border-none outline-none resize-none bg-gray-900 text-gray-100 leading-relaxed"
                placeholder="Enter your React component code here..."
                spellCheck={false}
                style={{
                  background: "#0d1117",
                  color: "#f0f6fc",
                  fontFamily:
                    'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                }}
              />
              <div className="absolute top-4 right-4 text-xs text-gray-500">
                {code.length} chars
              </div>
            </div>
          </div>

          {/* 프리뷰 */}
          <div className="flex flex-col flex-[1]">
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200">
              <Eye className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Preview</span>
              <div className="ml-auto">
                <div
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    isExecuting
                      ? "bg-blue-100 text-blue-700"
                      : error
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {isExecuting ? "실행 중..." : error ? "에러" : "실행 완료"}
                </div>
              </div>
            </div>
            <div className="flex-1 bg-white relative">
              {error && (
                <div className="absolute inset-0 bg-red-50 border-l-4 border-red-400 p-4 z-10">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-5 h-5 bg-red-400 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">!</span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        실행 오류
                      </h3>
                      <div className="mt-1 text-sm text-red-700 font-mono whitespace-pre-wrap">
                        {error}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <iframe
                ref={iframeRef}
                className="w-full h-full border-none"
                sandbox="allow-scripts"
                title="React Component Preview"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
