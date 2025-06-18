import React, { useState } from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/python/python';
import 'codemirror/mode/clike/clike';

function ProblemsPage({onsubmit}) {
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
        onsubmit(80);
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
        <span className="text-lg"><b>Problem Statement:</b> Sum of Even Numbers in a Range
Write a program that calculates the sum of all even numbers in a given range [L, R] (inclusive).
<br></br>
<br></br>
<b>Constraints:</b>
<br></br>
1. 1≤𝐿≤𝑅≤10^6
<br></br>
2. L and R are integers.
<br></br><br></br>
<b>Required Time Complexity:</b> O(n)
<br></br>
<b>Required Space Complexity:</b> O(1)
<br></br>
<b>Time Limit:</b> 1 second
<br></br>
<br></br>
<b>Score of the Question:</b> 80
<br></br>
<br></br>
<b>Rules:</b> 
<br></br>
Wrong Submission: -20,
<br></br>
Late Submission: -0, 
<br></br>
Compiling Error: -30,
<br></br>
Time Taken to Solve : 1 min,+10
<br></br>
<br></br>
<b>Input:</b>
<br></br>
The first line contains an integer
L, the starting number of the range.
<br></br>
The second line contains an integer 
R, the ending number of the range.
<br></br><br></br>
<b>Output: </b>
Print a single integer, the sum of all even numbers in the range [L, R].
<br></br>
<br></br>
<b>Example Test Case:</b>
<br></br>
<b>Input:</b>
<br></br>
2
6
<br></br>
<b>Output:</b>
<br></br>
12
<br></br>
<b>Explanation:</b>
<br></br>
Even numbers between 2 and 6 are 2,4, and 6.
<br></br>
Their sum is 2+4+6=12.
</span>
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
