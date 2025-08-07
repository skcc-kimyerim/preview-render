import { useState, useEffect, useRef, useCallback } from "react";
import type { FileNode } from "../utils/types";
import Editor from "@monaco-editor/react";
import {
  defaultCode,
  defaultFiles,
  createIframeContent,
} from "../utils/file-contents";

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
  FolderOpen,
} from "lucide-react";
import { Button } from "../components/Button";

export default function ReactLiveEditor() {
  const [code, setCode] = useState(defaultCode);
  const [error, setError] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // 파일 시스템 관련 상태 추가
  const [files, setFiles] = useState<FileNode[]>(defaultFiles);
  const [activeFile, setActiveFile] = useState<string>("src/App.jsx");
  const [openFolders, setOpenFolders] = useState<Set<string>>(
    new Set(["src", "src/components"])
  );
  const [showFileSystem, setShowFileSystem] = useState(false);

  const executeCode = useCallback(
    (codeToExecute?: string) => {
      if (!iframeRef.current) return;

      setIsExecuting(true);
      setError(null);

      const iframeContent = createIframeContent(files, codeToExecute);
      const blob = new Blob([iframeContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);

      iframeRef.current.src = url;

      // 이전 URL 정리
      return () => URL.revokeObjectURL(url);
    },
    [files]
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

  // useEffect(() => {
  //   const timeoutId = setTimeout(() => {
  //     executeCode(code);
  //   }, 500); // 500ms debounce

  //   return () => clearTimeout(timeoutId);
  // }, [code, files]);

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
        <div className="flex items-center text-lg font-bold text-gray-900 ml-4">
          <Sparkles className="w-5 h-5 mr-2" />
          <span className="text-xl">React Live Editor</span>
        </div>

        <div className="flex items-center space-x-2 mr-4">
          <Button onClick={() => setShowFileSystem(!showFileSystem)}>
            {showFileSystem ? "Hide Files" : "Show Files"}
          </Button>
          <Button onClick={handleReset}>
            <RotateCcw className="w-3 h-3" />
            Reset
          </Button>
          <Button onClick={handleCopy}>
            <Copy className="w-3 h-3" />
            Copy
          </Button>
          <Button onClick={() => executeCode(code)} disabled={isExecuting}>
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

          {/* 코드 에디터 */}
          <div className="flex flex-col border-r border-gray-200 flex-[2] h-full">
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200">
              <Code className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                File: {activeFile.split("/").pop()}
              </span>
              <div className="ml-auto flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            </div>
            <div className="flex-1 relative">
              <Editor
                height="100%"
                defaultLanguage="javascript"
                value={activeFileContent}
                onChange={(value) => {
                  updateFileContent(activeFile, value ?? "");
                }}
                theme="vs-dark"
                className="pt-2 bg-black"
                options={{
                  fontSize: 14,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                }}
              />
              <div className="absolute top-4 right-4 text-xs text-gray-500">
                {activeFileContent.length} chars
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
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                allow="cross-origin-isolated"
                title="React Component Preview"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
