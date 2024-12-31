import React, { useState, useEffect } from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript';

function ProblemsPage() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');

  useEffect(() => {
    console.log('Code updated:', code);
  }, [code]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Solve Problems</h1>
      <div className="mb-6">
        <p className="text-lg">Problem: Write a function to reverse a string.</p>
      </div>
      <div className="border rounded shadow-lg">
        <select
          onChange={(e) => setLanguage(e.target.value)}
          value={language}
          className="mb-4"
        >
          <option value="javascript">JavaScript</option>
          <option value="java">Java</option>
          <option value="python">Python</option>
          <option value="c++">C++</option>
        </select>
        <CodeMirror
          options={{
            mode: 'javascript',
            theme: 'dracula',
            lineNumbers: true,
          }}
          value={code}
          theme="vs-dark"
          height="90vh"
          language={language}
          defaultValue="// Write your code here"
          onBeforeChange={(editor, data, value) => setCode(value)}
        />
      </div>
      <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Submit Code
      </button>
    </div>
  );
}

export default ProblemsPage;
