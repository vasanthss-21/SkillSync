const express = require('express');
const cors = require('cors');
const { VM } = require('vm2'); 

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.post('/execute', (req, res) => {
  const { language, code, input } = req.body;

  if (language !== 'javascript') {
    return res.status(400).json({ error: 'Unsupported language for this method' });
  }

  try {
    // Create a sandboxed environment
    const vm = new VM({
      timeout: 1000,
      sandbox: { input }    // Pass any input variables to the sandbox if necessary
    });

    // Use console.log to capture printed output if needed
    const output = vm.run(`
      const output = (() => {
        try {
          return ${code};
        } catch (e) {
          return { error: e.message };
        }
      })();
      output;
    `);

    // Send the result
    res.json({ output, error: null });

  } catch (error) {
    res.json({ output: null, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
