const express = require('express');
const bodyParser = require('body-parser');
const { exec, execFile } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(require('cors')());

// Supported languages configuration
const SUPPORTED_LANGUAGES = {
  python: { extension: '.py', command: 'python3' },
  c: { extension: '.c', compile: 'gcc', execute: './' },
  cpp: { extension: '.cpp', compile: 'g++', execute: './' },
  java: { extension: '.java', compile: 'javac', execute: 'java' },
};

const TEMP_DIR = path.join(__dirname, 'temp');

// Ensure temp directory exists
const ensureTempDir = async () => {
  try {
    await fs.mkdir(TEMP_DIR, { recursive: true });
  } catch (err) {
    console.error('Error creating temp directory:', err);
  }
};

// Clean up temporary files
const cleanUpFiles = async (files) => {
  try {
    for (const file of files) {
      await fs.rm(file, { force: true });
    }
  } catch (err) {
    console.error('Error during file cleanup:', err);
  }
};

// API Route to execute code
app.post('/execute', async (req, res) => {
  const { language, code, input = '' } = req.body;

  if (!SUPPORTED_LANGUAGES[language]) {
    return res.status(400).json({ error: 'Unsupported language' });
  }

  const langConfig = SUPPORTED_LANGUAGES[language];
  const tempFileName = `code${langConfig.extension}`;
  const tempFilePath = path.join(TEMP_DIR, tempFileName);

  await ensureTempDir();

  try {
    // Write user code to a temporary file
    await fs.writeFile(tempFilePath, code);

    if (language === 'python') {
      // Execute Python code
      const child = exec(`${langConfig.command} ${tempFilePath}`, (err, stdout, stderr) => {
        if (err) {
          return res.json({ error: stderr || err.message });
        }
        res.json({ output: stdout.trim(), error: stderr.trim() });
      });
      if (input) {
        child.stdin.write(input);
        child.stdin.end();
      }
    } else if (language === 'c' || language === 'cpp') {
      // Compile and execute C or C++
      const exeFilePath = path.join(TEMP_DIR, 'output');
      exec(`${langConfig.compile} ${tempFilePath} -o ${exeFilePath}`, (compileErr, _, compileStderr) => {
        if (compileErr) {
          return res.json({ error: compileStderr });
        }
        const child = execFile(exeFilePath, (runErr, stdout, stderr) => {
          if (runErr) {
            return res.json({ error: stderr || runErr.message });
          }
          res.json({ output: stdout.trim(), error: stderr.trim() });
        });
        if (input) {
          child.stdin.write(input);
          child.stdin.end();
        }
      });
    } else if (language === 'java') {
      // Compile and execute Java code
      const className = tempFileName.replace('.java', '');
      exec(`${langConfig.compile} ${tempFilePath}`, (compileErr, _, compileStderr) => {
        if (compileErr) {
          return res.json({ error: compileStderr });
        }
        const child = exec(`${langConfig.execute} -cp ${TEMP_DIR} ${className}`, (runErr, stdout, stderr) => {
          if (runErr) {
            return res.json({ error: stderr || runErr.message });
          }
          res.json({ output: stdout.trim(), error: stderr.trim() });
        });
        if (input) {
          child.stdin.write(input);
          child.stdin.end();
        }
      });
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    // Clean up temporary files
    const cleanupFiles = [tempFilePath];
    if (language === 'c' || language === 'cpp') {
      cleanupFiles.push(path.join(TEMP_DIR, 'output'));
    } else if (language === 'java') {
      cleanupFiles.push(tempFilePath.replace('.java', '.class'));
    }
    await cleanUpFiles(cleanupFiles);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
