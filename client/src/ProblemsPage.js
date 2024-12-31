import React, { useState, useEffect } from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript';

function ProblemsPage() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [input, setInput] = useState('');

  useEffect(() => {
    console.log('Code updated:', code);
  }, [code]);

  const handleSubmit = async () => {
    setOutput('');
    setError('');
  
    try {
      const response = await fetch('http://localhost:5000/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ language, code, input }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        setOutput(result.output);
        setError(result.error || '');
      } else {
        setError(result.error || 'An error occurred');
      }
    } catch (err) {
      setError(err.message);
    }
  };  

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Solve Problems</h1>
      <div className="mb-6">
        <p className="text-lg">Problem: Write a function to reverse a string.</p>
      </div>
      <div className="border rounded shadow-lg mb-4">
        <select
          onChange={(e) => setLanguage(e.target.value)}
          value={language}
          className="mb-4 p-2 border rounded"
        >
          <option value="javascript">JavaScript</option>
          <option value="java">Java</option>
          <option value="python">Python</option>
          <option value="c++">C++</option>
        </select>
        <CodeMirror
          options={{
            mode: language,
            theme: 'dracula',
            lineNumbers: true,
          }}
          value={code}
          onBeforeChange={(editor, data, value) => setCode(value)}
        />
      </div>
      <textarea
        className="w-full p-2 border rounded mb-4"
        placeholder="Provide input (optional)"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Submit Code
      </button>
      <div className="mt-4">
        <h3 className="font-bold">Output:</h3>
        <pre className="bg-gray-200 p-2 rounded">{output}</pre>
      </div>
      {error && (
        <div className="mt-4 text-red-500">
          <h3 className="font-bold">Error:</h3>
          <pre>{error}</pre>
        </div>
      )}
    </div>
  );
}

export default ProblemsPage;
