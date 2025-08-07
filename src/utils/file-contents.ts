import type { FileNode } from "./types";

export const defaultFiles: FileNode[] = [
  {
    name: "src",
    type: "folder",
    path: "src",
    children: [
      {
        name: "App.jsx",
        type: "file",
        path: "src/App.jsx",
        content: `import React from 'react';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Welcome to React App</h1>
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
          <p className="text-gray-600 mb-4">
            This is your main application page. You can navigate to different pages using the navigation bar above.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Features</h3>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• File-based routing</li>
                <li>• Component system</li>
                <li>• Live preview</li>
                <li>• Real-time editing</li>
              </ul>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">Pages</h3>
              <ul className="text-green-700 text-sm space-y-1">
                <li>• Home (current page)</li>
                <li>• About</li>
                <li>• Contact</li>
                <li>• Dashboard</li>
              </ul>
            </div>
          </div>
        </div>
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
}

.page-container {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}`,
      },
      {
        name: "components",
        type: "folder",
        path: "src/components",
        children: [
          {
            name: "Counter.jsx",
            type: "file",
            path: "src/components/Counter.jsx",
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
          {
            name: "Header.jsx",
            type: "file",
            path: "src/components/Header.jsx",
            content: `import React from 'react';

function Header({ title, subtitle }) {
  return (
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">{title}</h1>
      {subtitle && <p className="text-gray-600">{subtitle}</p>}
    </div>
  );
}

export default Header;`,
          },
        ],
      },
      {
        name: "pages",
        type: "folder",
        path: "src/pages",
        children: [
          {
            name: "About.jsx",
            type: "file",
            path: "src/pages/About.jsx",
            content: `import React from 'react';
import Header from '../components/Header';

function About() {
  return (
    <div className="page-container">
      <Header 
        title="About Us" 
        subtitle="Learn more about our company and mission"
      />
    </div>
  );
}

export default About;`,
          },
          {
            name: "Contact.jsx",
            type: "file",
            path: "src/pages/Contact.jsx",
            content: `import React, { useState } from 'react';
import Header from '../components/Header';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for your message! We\'ll get back to you soon.");
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="page-container">
      <Header 
        title="Contact Us" 
        subtitle="Get in touch with our team"
      />
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;`,
          },
          {
            name: "Dashboard.jsx",
            type: "file",
            path: "src/pages/Dashboard.jsx",
            content: `import React, { useState } from 'react';
import Header from '../components/Header';
import Counter from '../components/Counter';

function Dashboard() {
  const [stats] = useState([
    { label: 'Total Users', value: '1,234', color: 'bg-blue-500' },
    { label: 'Active Projects', value: '12', color: 'bg-green-500' },
    { label: 'Revenue', value: '$45,678', color: 'bg-purple-500' },
    { label: 'Tasks Completed', value: '89', color: 'bg-orange-500' }
  ]);

  return (
    <div className="page-container">
      <Header 
        title="Dashboard" 
        subtitle="Overview of your application"
      />
      <div className="max-w-6xl mx-auto">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center">
                <div className={\`\${stat.color} w-12 h-12 rounded-lg flex items-center justify-center\`}>
                  <span className="text-white font-bold text-lg">{stat.value.charAt(0)}</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {[
                'User registration completed',
                'New project created',
                'Task assigned to team',
                'Payment processed successfully'
              ].map((activity, index) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-700">{activity}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Interactive Component</h3>
            <Counter />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;`,
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

export const createIframeContent = (
  files: FileNode[],
  userCode?: string
): string => {
  // 파일 시스템에서 모든 js/jsx 파일들을 추출
  const getAllFiles = (nodes: FileNode[]): FileNode[] => {
    const result: FileNode[] = [];
    for (const node of nodes) {
      if (node.type === "file" && node.path.endsWith(".jsx")) {
        result.push(node);
      }
      if (node.children) {
        result.push(...getAllFiles(node.children));
      }
    }
    return result;
  };

  const jsxFiles = getAllFiles(files);

  // App.jsx 파일 찾기
  const appFile = jsxFiles.find((file) => file.path === "src/App.jsx");

  // pages 폴더의 파일들 찾기
  const pageFiles = jsxFiles.filter((file) =>
    file.path.startsWith("src/pages/")
  );

  // components 폴더의 파일들 찾기
  const componentFiles = jsxFiles.filter((file) =>
    file.path.startsWith("src/components/")
  );

  // 라우트 설정 생성
  const generateRoutes = () => {
    if (pageFiles.length === 0) return "";

    const routes = pageFiles
      .map((page) => {
        const pageName = page.path
          .split("/")
          .pop()
          ?.replace(".js", "")
          .replace(".jsx", "");
        const routePath = page.path
          .replace("src/pages/", "")
          .replace(".js", "")
          .replace(".jsx", "");
        return `{ path: "/${routePath}", element: <${pageName} /> }`;
      })
      .join(",\n    ");

    return `
  const routes = [
    { path: "/", element: <App /> },
    ${routes}
  ];`;
  };

  // CSS 파일들 처리
  const cssFiles = getAllFiles(files).filter((file) =>
    file.path.endsWith(".css")
  );
  const cssImports = cssFiles
    .map((file) => {
      const importPath = file.path.replace("src/", "./").replace(".css", "");
      return `import '${importPath}.css';`;
    })
    .join("\n  ");

  // 모든 컴포넌트 파일들을 문자열로 변환
  const componentImports = jsxFiles
    .map((file) => {
      const fileName = file.name.replace(".jsx", "");
      const importPath = file.path.replace("src/", "./").replace(".jsx", "");
      return `import ${fileName} from '${importPath}';`;
    })
    .join("\n  ");

  // 페이지 파일들의 라우트 생성
  const pageRoutes = pageFiles
    .map((page) => {
      const pageName = page.path.split("/").pop()?.replace(".jsx", "");
      const routePath = page.path.replace("src/pages/", "").replace(".jsx", "");
      return `<Route path="/${routePath}" element={<${pageName} />} />`;
    })
    .join("\n                  ");

  // 페이지 파일들의 네비게이션 링크 생성
  const pageLinks = pageFiles
    .map((page) => {
      const pageName = page.path.split("/").pop()?.replace(".jsx", "");
      const routePath = page.path.replace("src/pages/", "").replace(".jsx", "");
      return `<Link to="/${routePath}" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">${pageName}</Link>`;
    })
    .join("\n              ");

  // 페이지 이름 배열
  const pageNames = pageFiles.map((f) =>
    f.path.replace("src/pages/", "").replace(".jsx", "")
  );
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
        <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
        <script 
          crossorigin 
          src="https://unpkg.com/react-router-dom@6/dist/umd/react-router-dom.production.min.js"
          onload="console.log('React Router loaded')"
        ></script>
        <script crossorigin src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
        <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body>
        <div id="root"></div>
        <script type="text/babel" defer>
          const { useState, useEffect, useCallback, useMemo } = React;
          const { BrowserRouter } = ReactRouterDOM;
          console.log(ReactRouterDOM);
              
          function MyComponent() {
            const [count, setCount] = useState(0);
            const location = useLocation();
              
            return (
              <div className="p-6 text-center">
                <h1 className="text-2xl font-bold mb-4">Hello React Router!</h1>
                <p className="mb-2">Current path: {location.pathname}</p>
                <p className="mb-4">Count: {count}</p>
                <button 
                  onClick={() => setCount(count + 1)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
                >
                  Click me!
                </button>
                <Link 
                  to="/" 
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Home
                </Link>
              </div>
            );
          }

          function App() {
            return (
              <BrowserRouter>
                <BrowserRouter.Routes>
                  <BrowserRouter.Route path="*" element={<MyComponent />} />
                </BrowserRouter.Routes>
              </BrowserRouter>
            );
          }
              
          const root = ReactDOM.createRoot(document.getElementById('root'));
          root.render(<App />);
        </script>
      </body>
    </html>
    `;
  //   return `<!DOCTYPE html>
  // <html>
  // <head>
  //   <meta charset="UTF-8">
  //   <meta name="viewport" content="width=device-width, initial-scale=1.0">
  //   <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  //   <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  //   <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  //   <script crossorigin src="https://unpkg.com/react-router-dom@6/dist/umd/react-router-dom.production.min.js"></script>
  //   <script src="https://cdn.tailwindcss.com"></script>
  //   <body>
  //     <div id="root"></div>
  //     <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  //     <script type="text/babel">

  //       const { useState, useEffect, useCallback, useMemo } = React;
  //       const { BrowserRouter, Routes, Route, Link, useLocation } = ReactRouterDOM;

  //       // CSS 파일들 import
  //       ${cssImports}

  //       // 컴포넌트 파일들 import
  //       ${componentImports}

  //       // 사용자 코드 (MyComponent가 있는 경우)
  //       ${userCode || ""}

  //       // 네비게이션 컴포넌트
  //       function Navigation() {
  //         const location = useLocation();
  //         const pages = ${JSON.stringify(pageNames)};

  //         return (
  //           <nav className="bg-white shadow-sm border-b p-4">
  //             <div className="max-w-6xl mx-auto flex items-center justify-between">
  //               <Link to="/" className="text-xl font-bold text-gray-800">
  //                 React App
  //               </Link>
  //               <div className="flex space-x-2">
  //                 <Link
  //                   to="/"
  //                   className={\`nav-link \${location.pathname === '/' ? 'active' : ''}\`}
  //                 >
  //                   Home
  //                 </Link>
  //                 {pages.map(page => (
  //                   <Link
  //                     key={page}
  //                     to={\`/\${page}\`}
  //                     className={\`nav-link \${location.pathname === '/' + page ? 'active' : ''}\`}
  //                   >
  //                     {page.charAt(0).toUpperCase() + page.slice(1)}
  //                   </Link>
  //                 ))}
  //                 ${
  //                   userCode
  //                     ? `
  //                 <Link
  //                   to="/my-component"
  //                   className={\`nav-link \${location.pathname === '/my-component' ? 'active' : ''}\`}
  //                 >
  //                   My Component
  //                 </Link>`
  //                     : ""
  //                 }
  //               </div>
  //             </div>
  //           </nav>
  //         );
  //       }

  //       // 메인 App 컴포넌트 (라우터 포함)
  //       function AppWithRouter() {
  //         return (
  //           <BrowserRouter>
  //             <div className="min-h-screen bg-gray-50">
  //               <Navigation />
  //               <main className="max-w-6xl mx-auto p-6">
  //                 <Routes>
  //                   <Route path="/" element={<App />} />
  //                   ${pageRoutes}
  //                   ${
  //                     userCode
  //                       ? '<Route path="/my-component" element={<MyComponentPage />} />'
  //                       : ""
  //                   }
  //                 </Routes>
  //               </main>
  //             </div>
  //           </BrowserRouter>
  //         );
  //       }

  //       // App.jsx가 없는 경우 기본 App 컴포넌트 생성
  //       ${
  //         !appFile
  //           ? `
  //       function App() {
  //         return (
  //           <div className="text-center py-12">
  //             <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to React App</h1>
  //             <p className="text-gray-600">This is the main page of your application.</p>
  //             ${
  //               pageFiles.length > 0
  //                 ? `
  //             <div className="mt-8">
  //               <h2 className="text-xl font-semibold mb-4">Available Pages:</h2>
  //               <div className="flex flex-wrap gap-2 justify-center">
  //                 ${pageLinks}
  //               </div>
  //             </div>`
  //                 : ""
  //             }
  //           </div>
  //         );
  //       }`
  //           : ""
  //       }

  //       // MyComponent가 있는 경우 별도 페이지로 추가
  //       ${
  //         userCode
  //           ? `
  //       function MyComponentPage() {
  //         return (
  //           <div className="p-6">
  //             <h2 className="text-2xl font-bold mb-4">My Component</h2>
  //             <MyComponent />
  //           </div>
  //         );
  //       }`
  //           : ""
  //       }

  //       try {
  //         const root = ReactDOM.createRoot(document.getElementById('root'));
  //         root.render(React.createElement(AppWithRouter));

  //         // 성공 메시지 전송
  //         window.parent.postMessage({ type: 'success' }, '*');

  //       } catch (error) {
  //         // 에러 메시지 전송
  //         window.parent.postMessage({
  //           type: 'error',
  //           message: error.message,
  //           stack: error.stack
  //         }, '*');

  //         // 에러를 화면에도 표시
  //         document.getElementById('root').innerHTML =
  //           '<div style="padding: 20px; color: red; font-family: monospace; white-space: pre-wrap;">' +
  //           'Error: ' + error.message +
  //           '</div>';
  //       }
  //     </script>
  //   </body>
  // </html>`;
};
