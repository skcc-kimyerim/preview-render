"use client";

import { useState, useEffect, useRef, useCallback } from "react";

import {
  Copy,
  Play,
  RotateCcw,
  Plus,
  Folder,
  File,
  X,
  FolderOpen,
} from "lucide-react";

interface FileNode {
  name: string;
  type: "file" | "folder";
  content?: string;
  children?: FileNode[];
  path: string;
}

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

export default function ReactFileEditor() {
  const [files, setFiles] = useState<FileNode[]>(defaultFiles);
  const [activeFile, setActiveFile] = useState<string>("src/App.js");
  const [openFolders, setOpenFolders] = useState<Set<string>>(
    new Set(["src", "src/components"])
  );
  const [error, setError] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [openTabs, setOpenTabs] = useState<string[]>(["src/App.js"]);
  const iframeRef = useRef<HTMLIFrameElement>(null);

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

  const getAllFiles = useCallback(
    (nodes: FileNode[] = files): Record<string, string> => {
      const result: Record<string, string> = {};

      const traverse = (nodes: FileNode[]) => {
        nodes.forEach((node) => {
          if (node.type === "file" && node.content) {
            result[node.path] = node.content;
          }
          if (node.children) {
            traverse(node.children);
          }
        });
      };

      traverse(nodes);
      return result;
    },
    [files]
  );

  const createIframeContent = useCallback(
    (allFiles: Record<string, string>) => {
      const moduleSystem = `
      window.modules = {};
      window.require = function(path) {
        // 상대 경로 처리
        if (path.startsWith('./')) {
          const currentDir = window.currentModule ? window.currentModule.split('/').slice(0, -1).join('/') : 'src';
          path = currentDir + '/' + path.substring(2);
        }
        
        // 확장자 추가
        if (!path.includes('.')) {
          if (window.modules[path + '.js']) path += '.js';
          else if (window.modules[path + '.jsx']) path += '.jsx';
        }
        
        if (window.modules[path]) {
          return window.modules[path].exports;
        }
        throw new Error('Module not found: ' + path);
      };
      
      window.defineModule = function(path, fn) {
        window.currentModule = path;
        const module = { exports: {} };
        const exports = module.exports;
        fn(module, exports, window.require);
        window.modules[path] = module;
        return module.exports;
      };
    `;

      const moduleDefinitions = Object.entries(allFiles)
        .filter(([path]) => path.endsWith(".js") || path.endsWith(".jsx"))
        .map(([path, content]) => {
          const transformedContent = content
            .replace(
              /import\s+(\w+)\s+from\s+['"]([^'"]+)['"]/g,
              'const $1 = require("$2")'
            )
            .replace(
              /import\s+\{([^}]+)\}\s+from\s+['"]([^'"]+)['"]/g,
              'const {$1} = require("$2")'
            )
            .replace(/export\s+default\s+(\w+)/g, "module.exports = $1")
            .replace(/export\s+\{([^}]+)\}/g, (match, exports) => {
              const exportList = exports
                .split(",")
                .map((exp: string) => exp.trim());
              return exportList
                .map((exp: string) => `module.exports.${exp} = ${exp}`)
                .join("; ");
            });

          return `
          window.defineModule('${path}', function(module, exports, require) {
            ${transformedContent}
          });
        `;
        })
        .join("\n");

      const cssContent = Object.entries(allFiles)
        .filter(([path]) => path.endsWith(".css"))
        .map(([, content]) => content)
        .join("\n");

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
    ${cssContent}
  </style>
</head>
<body>
  <div id="root"></div>
  <script>
    ${moduleSystem}
  </script>
  <script type="text/babel">
    try {
      ${moduleDefinitions}
      
      // App.js를 메인 엔트리포인트로 사용
      const App = require('src/App.js');
      
      if (typeof App !== 'function') {
        throw new Error('App must be a function component');
      }
      
      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(React.createElement(App));
      
      window.parent.postMessage({ type: 'success' }, '*');
      
    } catch (error) {
      window.parent.postMessage({ 
        type: 'error', 
        message: error.message,
        stack: error.stack 
      }, '*');
      
      document.getElementById('root').innerHTML = 
        '<div style="padding: 20px; color: red; font-family: monospace; white-space: pre-wrap;">' +
        'Error: ' + error.message + 
        '</div>';
    }
  </script>
</body>
</html>`;
    },
    []
  );

  const executeCode = useCallback(() => {
    if (!iframeRef.current) return;

    setIsExecuting(true);
    setError(null);

    const allFiles = getAllFiles();
    const iframeContent = createIframeContent(allFiles);
    const blob = new Blob([iframeContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    iframeRef.current.src = url;

    return () => URL.revokeObjectURL(url);
  }, [getAllFiles, createIframeContent]);

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
      executeCode();
    }, 1000); // 1초 디바운스

    return () => clearTimeout(timeoutId);
  }, [files, executeCode]);

  const activeFileContent = findFile(activeFile)?.content || "";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 헤더 */}
      <div className="h-12 bg-white border-b border-gray-200 flex items-center px-4">
        <h1 className="text-xl font-bold">React Multi-File Editor</h1>
        <div className="ml-auto flex gap-2">
          <button
            onClick={executeCode}
            className="flex items-center gap-1"
            disabled={isExecuting}
          >
            <Play className="w-3 h-3" />
            {isExecuting ? "Running..." : "Run"}
          </button>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 flex">
        {/* 파일 트리 */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold mb-2">Project Files</h2>
            <div className="flex gap-2">
              <button
                onClick={() => addNewFile("src", "NewComponent.js", "file")}
                className="flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                File
              </button>
              <button
                onClick={() => addNewFile("src", "newfolder", "folder")}
                className="flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                Folder
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-auto">{renderFileTree(files)}</div>
        </div>

        {/* 메인 에디터 영역 */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 grid grid-cols-2 gap-0">
            {/* 코드 에디터 */}
            <div className="flex flex-col rounded-none border-r">
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

              {/* 에디터 */}
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

            {/* 프리뷰 */}
            <div className="flex flex-col rounded-none">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">Preview</h2>
                <div className="text-sm text-gray-500">
                  {isExecuting
                    ? "Executing..."
                    : error
                    ? "Error"
                    : "Live Preview"}
                </div>
              </div>
              <div className="flex-1 bg-white overflow-hidden">
                {error && <div className="p-4">{error}</div>}
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
    </div>
  );
}
