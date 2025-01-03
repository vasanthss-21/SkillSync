const express = require('express');
const cors = require('cors');
const { VM } = require('vm2');
const { exec } = require('child_process');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Common function for executing code
const executeCode = (command, res) => {
  exec(command, (error, stdout, stderr) => {
    if (error) {
      res.json({ output: null, error: stderr || error.message });
    } else {
      res.json({ output: stdout, error: null });
    }
  });
};

// JavaScript execution
app.post('/execute/javascript', (req, res) => {
  const { language, code, input } = req.body;

  if (language !== 'javascript') {
    return res.status(400).json({ error: 'Unsupported language for this method' });
  }

  try {
    const vm = new VM({
      timeout: 1000,
      sandbox: { input },
    });

    const output = vm.run(code);
    res.json({ output, error: null });
  } catch (error) {
    res.json({ output: null, error: error.message });
  }
});

// Java execution
app.post('/execute/java', (req, res) => {
  const { language, code, input } = req.body;

  if (language !== 'java') {
    return res.status(400).json({ error: 'Unsupported language for this method' });
  }

  const filename = 'Main.java';
  const inputFilename = 'input.txt';
  const fs = require('fs');

  // Save Java code and input to files
  fs.writeFileSync(filename, code);
  fs.writeFileSync(inputFilename, input);

  // Command to execute the code
  const command = `javac ${filename} && java Main < ${inputFilename}`;
  executeCode(command, res);
});

// Python execution
app.post('/execute/python', (req, res) => {
  const { language, code, input } = req.body;

  if (language !== 'python') {
    return res.status(400).json({ error: 'Unsupported language for this method' });
  }

  const filename = 'script.py';
  const inputFilename = 'input.txt';
  const fs = require('fs');

  // Save Python code and input to files
  fs.writeFileSync(filename, code);
  fs.writeFileSync(inputFilename, input);

  // Command to execute the code
  const command = `python ${filename} < ${inputFilename}`;
  executeCode(command, res);
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
