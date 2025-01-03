import React, { useState } from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/python/python';
import 'codemirror/mode/clike/clike';

function ProblemsPage() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [input, setInput] = useState('');

  const starterCode = {
    javascript: `// Write your code here\n`,
    java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n       // Write your code here\n    }\n}`,
    python: `# Write your code here\n`,
    'c++': `// Write a function to reverse a string\n#include <iostream>\n#include <algorithm>\nusing namespace std;\n\nstring reverseString(string str) {\n    reverse(str.begin(), str.end());\n    return str;\n}\n\nint main() {\n    cout << reverseString("hello") << endl;\n    return 0;\n}`,
  };

  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    setLanguage(selectedLanguage);
    setCode(starterCode[selectedLanguage] || '');
  };

  const handleSubmit = async () => {
    setOutput('');
    setError('');
  
    if (!code) {
      setError('Please write some code before submitting.');
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:5000/execute/${language}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ language, code, input }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        setOutput(result.output || '');
        setError(result.error || '');
      } else {
        setError(result.error || 'An error occurred.');
      }
    } catch (err) {
      setError(`Failed to connect to the server: ${err.message}`);
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
          onChange={handleLanguageChange}
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
