import React, { useEffect, useRef, useState } from "react";
import { WebContainer } from "@webcontainer/api";
import Editor from "@monaco-editor/react";

const INITIAL_FILES = {
  "server.js": {
    file: {
      contents: `import http from 'http';
const server = http.createServer((req, res) => {
  res.end('<h2>Hello from WebContainer!</h2>');
});
server.listen(3000, () => console.log('Server running!'));
`,
    },
  },
  "package.json": {
    file: {
      contents: JSON.stringify(
        {
          type: "module",
          scripts: { start: "node server.js" },
          dependencies: {},
        },
        null,
        2
      ),
    },
  },
};

export default function WebIDE() {
  const [files, setFiles] = useState(INITIAL_FILES);
  const [currentFile, setCurrentFile] = useState("server.js");
  const [code, setCode] = useState(INITIAL_FILES["server.js"].file.contents);
  const [webcontainer, setWebcontainer] = useState<any>(null);
  const terminalRef = useRef<HTMLPreElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    (async () => {
      const instance = await WebContainer.boot();
      setWebcontainer(instance);
      await instance.mount(files);

      const proc = await instance.spawn("node", ["server.js"]);
      proc.output.pipeTo(
        new WritableStream({
          write(data) {
            if (terminalRef.current) {
              terminalRef.current.textContent += data;
            }
          },
        })
      );

      // 포트 3000이 열릴 때까지 대기
      (instance as any).on(
        "port",
        (portData: { port: number; type: "open" | "close" }) => {
          if (portData.port === 32000 && portData.type === "open") {
            if (iframeRef.current) {
              iframeRef.current.src = `http://localhost:${portData.port}`;
            }
          }
        }
      );
    })();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setCode(files[currentFile].file.contents);
  }, [currentFile, files]);

  const onEditorChange = (value?: string) => {
    setCode(value ?? "");
    setFiles((prev) => ({
      ...prev,
      [currentFile]: { file: { contents: value ?? "" } },
    }));
  };

  const saveAndRun = async () => {
    if (!webcontainer) return;
    await webcontainer.fs.writeFile("/" + currentFile, code);

    await webcontainer.spawn("pkill", ["-f", "node"]);
    const proc = await webcontainer.spawn("node", ["server.js"]);
    proc.output.pipeTo(
      new WritableStream({
        write(data) {
          if (terminalRef.current) {
            terminalRef.current.textContent += data;
          }
        },
      })
    );
    // 서버가 재시작되면 iframe에 URL 설정
    setTimeout(() => {
      if (iframeRef.current) {
        iframeRef.current.src = "http://localhost:3000";
      }
    }, 1000);
  };

  const renderFileTree = () => (
    <ul className="list-none p-0">
      {Object.keys(files).map((fname) => (
        <li
          key={fname}
          className={`px-3 py-1 rounded cursor-pointer transition-colors ${
            currentFile === fname
              ? "bg-lime-400 text-neutral-800 font-bold"
              : "text-neutral-300 hover:bg-neutral-700"
          }`}
          onClick={() => setCurrentFile(fname)}
        >
          {fname}
        </li>
      ))}
    </ul>
  );

  const addFile = () => {
    let fname = prompt("새 파일 이름을 입력하세요 (ex: test.js)");
    if (!fname || files[fname]) return;
    setFiles((prev) => ({
      ...prev,
      [fname]: { file: { contents: "" } },
    }));
    setCurrentFile(fname);
  };

  const clearTerminal = () => {
    if (terminalRef.current) terminalRef.current.textContent = "";
  };

  return (
    <div className="flex h-screen font-sans">
      {/* 파일 트리 영역 */}
      <div className="w-44 bg-neutral-900 text-neutral-100 p-3 flex flex-col">
        <div className="mb-3 font-bold text-lg flex items-center gap-2">
          <span className="text-lime-400">📁</span> 파일
        </div>
        <button
          onClick={addFile}
          className="mb-3 py-1 rounded bg-lime-500 text-neutral-900 font-semibold hover:bg-lime-400 transition-colors"
        >
          + 새 파일
        </button>
        <div className="flex-1 overflow-y-auto">{renderFileTree()}</div>
      </div>

      {/* 메인 영역 */}
      <div className="flex-1 flex flex-col bg-neutral-800">
        {/* 코드 에디터 */}
        <div className="flex-none border-b border-neutral-700">
          <Editor
            height="260px"
            defaultLanguage={
              currentFile.endsWith(".json") ? "json" : "javascript"
            }
            value={code}
            onChange={onEditorChange}
            theme="vs-dark"
            options={{
              fontSize: 15,
              minimap: { enabled: false },
              fontFamily: "Menlo, monospace",
            }}
          />
          <div className="mt-2 flex gap-3 px-4 pb-2">
            <button
              onClick={saveAndRun}
              className="px-3 py-1 bg-lime-500 text-neutral-900 rounded font-bold hover:bg-lime-400 transition-colors"
            >
              💾 저장 및 실행
            </button>
            <button
              onClick={clearTerminal}
              className="px-3 py-1 bg-neutral-700 text-neutral-200 rounded hover:bg-neutral-600 transition-colors"
            >
              🧹 터미널 초기화
            </button>
          </div>
        </div>
        {/* 터미널 + 프리뷰 */}
        <div className="flex flex-1 min-h-0">
          <pre
            ref={terminalRef}
            className="w-80 h-full bg-neutral-900 text-lime-300 m-0 p-4 overflow-auto text-xs rounded-bl-lg"
          />
          <iframe
            ref={iframeRef}
            title="Web Preview"
            className="flex-1 border-l border-neutral-700 bg-white"
            style={{ minHeight: 0 }}
          />
        </div>
      </div>
    </div>
  );
}
