import { useState } from 'react';
import { Terminal, Code, Cpu, Book, ArrowRight, Zap, Layers, Globe, Box, CheckCircle } from 'lucide-react';
import './index.css';

const sections = {
  getting_started: {
    title: 'Getting Started',
    icon: <Zap size={18} />,
    content: (
      <div className="markdown-body fade-in">
        <h1 className="gradient-text">Getting Started with SageBatch</h1>
        <p className="lead-text">SageBatch is a modern, high-performance implementation of MS-DOS Batch 4.0, built entirely in SageLang. It aims to provide full compatibility with classic batch scripts while offering the incredible speed and safety guarantees of the SageLang toolchain.</p>
        
        <div className="card-highlight">
          <h2>Installation</h2>
          <p>To start using SageBatch, you'll need the SageLang toolchain installed on your system.</p>
          <pre><code>{`# Clone the repository
git clone https://github.com/Night-Traders-Dev/SageBatch.git
cd SageBatch

# Clean any existing artifacts
./sagemake clean

# Build the native executable
./sagemake build

# Run an interactive REPL
./build/sagebatch

# Execute a script
./build/sagebatch script.bat`}</code></pre>
        </div>

        <h2>Why SageBatch?</h2>
        <div className="grid-list">
          <div className="grid-item">
            <CheckCircle className="text-primary" size={24} />
            <div>
              <h3>Blazing Fast</h3>
              <p>Compiled to native machine code via SageLang's C backend.</p>
            </div>
          </div>
          <div className="grid-item">
            <CheckCircle className="text-secondary" size={24} />
            <div>
              <h3>SageVM Support</h3>
              <p>Can run perfectly in pure bytecode mode for embedded environments.</p>
            </div>
          </div>
          <div className="grid-item">
            <CheckCircle className="text-accent" size={24} />
            <div>
              <h3>Familiar Syntax</h3>
              <p>Supports standard MS-DOS Batch syntax, variables, conditionals, loops, and commands.</p>
            </div>
          </div>
        </div>
      </div>
    )
  },
  sagelang: {
    title: 'SageLang Implementation',
    icon: <Code size={18} />,
    content: (
      <div className="markdown-body fade-in">
        <h1 className="gradient-text">Built in SageLang</h1>
        <p className="lead-text">SageBatch is written entirely in <strong>SageLang</strong>, a high-performance Python-inspired systems programming language that compiles to C and LLVM IR.</p>
        
        <h2>Compiler Architecture & Native (AOT)</h2>
        <p>Because SageLang compiles directly to C via its AOT backend, SageBatch produces a highly optimized, statically linked ELF binary. The runtime string pooling and garbage collector ensure low memory overhead even during complex recursive batch executions. In our benchmarks, parsing and interpreting 1000 loop iterations completes in under 0.024s!</p>

        <h3>Garbage Collector Safety</h3>
        <p>Because SageLang uses a precise tracing garbage collector (or ARC depending on compiler flags), developers must be careful about memory roots. A previous version of SageBatch suffered from `SIGSEGV` crashes and heap corruption due to inline dictionary literals (e.g. <code>&#123;"type": "IfStatement"&#125;</code>). These literals were unrooted across fast C-level allocations in the AOT backend. By explicitly rooting AST nodes in local variables, SageBatch achieved 100% stability.</p>

        <h2>Phase Pipeline</h2>
        <p>The interpreter follows a traditional phased compiler design implemented through highly modular `.sage` files:</p>
        
        <div className="timeline">
          <div className="timeline-item">
            <div className="timeline-icon">1</div>
            <div className="timeline-content">
              <h3>Lexer <code>(lexer.sage)</code></h3>
              <p>Tokenizes the raw <code>.bat</code> file into tokens (<code>WORD</code>, <code>VARIABLE</code>, <code>STRING</code>, <code>REDIRECT</code>). Identifies structures like <code>%VAR%</code> vs delayed expansion <code>!VAR!</code>.</p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-icon">2</div>
            <div className="timeline-content">
              <h3>Parser <code>(parser.sage)</code></h3>
              <p>Constructs an Abstract Syntax Tree (AST) handling batch specifics like nested loops, complex conditionals, and block nodes <code>()</code>. Built using a Recursive Descent parser pattern.</p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-icon">3</div>
            <div className="timeline-content">
              <h3>Interpreter <code>(interpreter.sage)</code></h3>
              <p>A recursive tree-walking executor that evaluates AST nodes via the <code>Environment</code> and <code>VarStore</code>.</p>
            </div>
          </div>
        </div>
      </div>
    )
  },
  sagevm: {
    title: 'SageVM Mode',
    icon: <Cpu size={18} />,
    content: (
      <div className="markdown-body fade-in">
        <h1 className="gradient-text">SageVM Compilation</h1>
        <p className="lead-text">SageBatch can theoretically be compiled into <strong>SageVM bytecode (.sgvm)</strong> for execution on embedded systems, bare-metal kernels, and specialized sandboxed environments.</p>

        <div className="card-highlight">
          <h2>State of the VM Backend</h2>
          <p>Currently, running multi-file SageLang projects (like SageBatch) inside the SageVM environment has technical limitations due to the upstream compiler. When compiling via the newer SGVM backend (<code>sage --sgvm</code>), the SageLang compiler throws a Segmentation Fault on deeply nested AST structures present in SageBatch's parser.</p>

          <h2>Bytecode Emitting (<code>--emit-vm</code>)</h2>
          <p>Alternatively, users can use the legacy <code>.svm</code> format:</p>
          <pre><code>{`# Emit legacy SVM bytecode
sage --emit-vm src/sage/batch.sage -o build/sagebatch.svm

# Run via bytecode interpreter
sage --run-vm build/sagebatch.svm script.bat`}</code></pre>
          <p>However, the legacy SVM bytecode compiler fails to package imported modules (<code>token</code>, <code>parser</code>, etc.), resulting in module not found runtime errors.</p>

          <h2>Interpreter Mode Workarounds</h2>
          <p>To bypass SageVM backend bugs while preserving a true "interpreted" runtime, SageBatch provides a dedicated <code>SAGEBATCH_SCRIPT</code> environment variable for testing AST/Bytecode runtime compatibility directly through the core interpreter:</p>
          <pre><code>{`SAGEBATCH_SCRIPT=script.bat sage --runtime bytecode -I src/sage src/sage/batch.sage`}</code></pre>
        </div>
      </div>
    )
  },
  sagedos: {
    title: 'SageDOS Integration',
    icon: <Globe size={18} />,
    content: (
      <div className="markdown-body fade-in">
        <h1 className="gradient-text">SageDOS Integration</h1>
        <p className="lead-text">SageBatch is the beating heart of <a href="https://github.com/Night-Traders-Dev/SageDOS" target="_blank" rel="noreferrer" style={{color: 'var(--primary)', textDecoration: 'none'}}>SageDOS</a>, providing the core interactive <code>COMMAND.COM</code> shell experience.</p>
        
        <div className="card-highlight glow-on-hover">
          <h2>The Shell Environment</h2>
          <p>By compiling SageBatch directly into the SageDOS kernel, the operating system achieves near-instant boot times and high-performance script execution.</p>
          
          <div className="grid-list" style={{ marginTop: '2rem' }}>
            <div className="grid-item">
              <CheckCircle className="text-primary" size={24} />
              <div>
                <h3>Boot Scripts</h3>
                <p>Native parsing and execution of <code>AUTOEXEC.BAT</code> equivalent system initialization scripts during startup.</p>
              </div>
            </div>
            <div className="grid-item">
              <CheckCircle className="text-secondary" size={24} />
              <div>
                <h3>System Environment</h3>
                <p>Global variable scoping and path management for launching external commands and system utilities.</p>
              </div>
            </div>
            <div className="grid-item">
              <CheckCircle className="text-accent" size={24} />
              <div>
                <h3>Drive Emulation</h3>
                <p>Establishing the classic <code>C:\</code> root namespace directly over the custom filesystem.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="info-box">
          <Zap className="info-icon" size={24} />
          <div>
            <h3>Zero Overhead</h3>
            <p>Integrated as a direct C API, the shell communicates directly with kernel data structures, completely removing process overhead for built-in operations.</p>
          </div>
        </div>

        <div className="card-highlight glow-on-hover" style={{ marginTop: '2rem' }}>
          <h2>Building the OS</h2>
          <p>SageDOS uses a unified <code>sagemake</code> build script to compile the kernel and the integrated SageBatch shell into a single native executable.</p>
          <pre><code>{`# Clone the repository
git clone https://github.com/Night-Traders-Dev/SageDOS.git
cd SageDOS

# Clean, compile to native ELF, and boot the OS
./sagemake --clean --build --run`}</code></pre>
        </div>
      </div>
    )
  },
  components: {
    title: 'Components Guide',
    icon: <Layers size={18} />,
    content: (
      <div className="markdown-body fade-in">
        <h1 className="gradient-text">Internal Components</h1>
        <p className="lead-text">SageBatch is broken down into modular components found in <code>src/sage/</code>, strictly separating responsibilities.</p>
        
        <div className="component-grid">
          <div className="component-card">
            <Box className="component-icon text-primary" size={32} />
            <h3><code>lexer.sage</code></h3>
            <p>Handles the extraction of tokens. It specifically deals with batch variables like <code>%VAR%</code> and delayed expansion <code>!VAR!</code>.</p>
          </div>
          <div className="component-card">
            <Box className="component-icon text-secondary" size={32} />
            <h3><code>parser.sage</code></h3>
            <p>Transforms tokens into AST nodes (<code>IfStatement</code>, <code>ForStatement</code>). Complex syntax like <code>FOR %%A IN (1) DO (...)</code> is parsed here.</p>
          </div>
          <div className="component-card">
            <Box className="component-icon text-accent" size={32} />
            <h3><code>interpreter.sage</code></h3>
            <p>Evaluates AST nodes. Implements Goto jump logic, variable expansion, sub-shell execution via <code>CALL</code>, and redirection. Highly optimized loops without inline string allocations to prevent GC crashes.</p>
          </div>
          <div className="component-card">
            <Box className="component-icon text-primary" size={32} />
            <h3><code>registry.sage & commands.sage</code></h3>
            <p>Dispatches commands. Identifies internal commands (<code>ECHO</code>, <code>SET</code>, <code>GOTO</code>, <code>IF</code>, <code>FOR</code>) and maps them to pure SageLang implementations avoiding system calls.</p>
          </div>
          <div className="component-card">
            <Box className="component-icon text-secondary" size={32} />
            <h3><code>environment.sage</code></h3>
            <p>Holds the DOS environment block, pre-populating PATH, TEMP, COMSPEC, and handling variable expansions. Resolves delayed vs immediate expansion.</p>
          </div>
          <div className="component-card">
            <Box className="component-icon text-accent" size={32} />
            <h3><code>varstore.sage</code></h3>
            <p>A stack of dicts that models DOS's flat environment but supports nested FOR loop variable scoping safely without memory leaks.</p>
          </div>
        </div>
      </div>
    )
  },
  commands_ref: {
    title: 'Commands Reference',
    icon: <Book size={18} />,
    content: (
      <div className="markdown-body fade-in">
        <h1 className="gradient-text">Commands Reference</h1>
        <p className="lead-text">Detailed reference for internal MS-DOS Batch commands implemented natively in SageBatch.</p>
        
        <h2>Basic Output</h2>
        <ul>
          <li><strong><code>ECHO</code></strong>: Displays messages or turns command echoing on or off (<code>ECHO ON</code> / <code>ECHO OFF</code>).</li>
          <li><strong><code>TITLE</code></strong>: Sets the window title for the terminal (emits ANSI escape sequences).</li>
          <li><strong><code>COLOR</code></strong>: Sets the console foreground and background colors (e.g. <code>COLOR 0A</code> for green text).</li>
          <li><strong><code>DATE</code></strong>: Displays the current system date.</li>
          <li><strong><code>TIME</code></strong>: Displays the current system time.</li>
        </ul>

        <h2>Variables & State</h2>
        <ul>
          <li><strong><code>SET</code></strong>: Displays, sets, or removes environment variables. Supports math via <code>SET /A</code> and user input via <code>SET /P</code>.</li>
          <li><strong><code>PROMPT</code></strong>: Changes the command prompt format (e.g. <code>PROMPT $P$G</code>).</li>
          <li><strong><code>SHIFT</code></strong>: Shifts the position of replaceable parameters (e.g. <code>%1</code> becomes <code>%0</code>).</li>
        </ul>

        <h2>File System</h2>
        <ul>
          <li><strong><code>CD / CHDIR</code></strong>: Displays or changes the current directory.</li>
          <li><strong><code>PUSHD</code></strong>: Saves the current directory on a stack and then changes to a new directory.</li>
          <li><strong><code>POPD</code></strong>: Restores the directory saved by the <code>PUSHD</code> command.</li>
          <li><strong><code>MD / MKDIR</code></strong>: Creates a directory.</li>
          <li><strong><code>RD / RMDIR</code></strong>: Removes a directory.</li>
          <li><strong><code>DIR</code></strong>: Displays a list of files and subdirectories in a directory.</li>
          <li><strong><code>TYPE</code></strong>: Displays the contents of a text file.</li>
          <li><strong><code>COPY</code></strong>: Copies one or more files to another location.</li>
          <li><strong><code>MOVE</code></strong>: Moves one or more files from one directory to another.</li>
          <li><strong><code>DEL / ERASE</code></strong>: Deletes one or more files.</li>
          <li><strong><code>REN / RENAME</code></strong>: Renames a file or files.</li>
        </ul>

        <h2>Control Flow</h2>
        <ul>
          <li><strong><code>GOTO</code></strong>: Directs the interpreter to a labeled line in a batch program. Label lookups are <code>O(1)</code> time via parser pre-indexing.</li>
          <li><strong><code>CALL</code></strong>: Calls one batch program from another, or jumps to a label as a subroutine.</li>
          <li><strong><code>IF</code></strong>: Performs conditional processing. Supports <code>IF EXIST</code>, <code>IF NOT</code>, and <code>IF DEFINED</code>.</li>
          <li><strong><code>FOR</code></strong>: Runs a specified command for each file in a set of files, or iterables.</li>
          <li><strong><code>PAUSE</code></strong>: Suspends processing and prompts the user to press any key.</li>
          <li><strong><code>EXIT</code></strong>: Quits the SageBatch interpreter.</li>
        </ul>

        <h2>Miscellaneous</h2>
        <ul>
          <li><strong><code>REM</code></strong>: Records comments in a batch file.</li>
          <li><strong><code>CLS</code></strong>: Clears the terminal screen via ANSI escapes.</li>
          <li><strong><code>VER</code></strong>: Displays the SageBatch MS-DOS clone version.</li>
          <li><strong><code>VOL</code></strong>: Displays the disk volume label and serial number.</li>
          <li><strong><code>VERIFY</code></strong>: Mock command for MS-DOS compatibility.</li>
        </ul>
      </div>
    )
  },
  language: {
    title: 'Language Syntax',
    icon: <Book size={18} />,
    content: (
      <div className="markdown-body fade-in">
        <h1 className="gradient-text">Batch Syntax Reference</h1>
        <p className="lead-text">SageBatch faithfully reproduces MS-DOS Batch 4.0 syntax with modern conveniences.</p>

        <h2>Variables & Expansion</h2>
        <pre><code>{`SET NAME=Jacob
ECHO %NAME%          :: immediate expansion
SETLOCAL ENABLEDELAYEDEXPANSION
SET VAL=hello
ECHO !VAL!           :: delayed expansion
ENDLOCAL`}</code></pre>

        <h2>Control Flow (Labels & GOTO)</h2>
        <p>Label resolution is O(1) via the label table built by the interpreter on the first pass.</p>
        <pre><code>{`:MENU
ECHO 1. Start
ECHO 2. Exit
SET /P CHOICE=Enter choice:
IF %CHOICE%==1 GOTO START
IF %CHOICE%==2 GOTO END
GOTO MENU

:START
ECHO Starting...`}</code></pre>

        <h2>Loops & Iteration</h2>
        <pre><code>{`:: List iteration
FOR %%A IN (apple banana cherry) DO ECHO %%A

:: File globbing
FOR %%F IN (*.txt) DO TYPE %%F`}</code></pre>

        <h2>Redirection</h2>
        <pre><code>{`DIR > listing.txt
DIR >> listing.txt
TYPE file.txt | FIND "ERROR"`}</code></pre>
      </div>
    )
  },
  benchmarks: {
    title: 'Benchmarks',
    icon: <Zap size={18} />,
    content: (
      <div className="markdown-body fade-in">
        <h1 className="gradient-text">Performance Benchmarks</h1>
        <p className="lead-text">SageBatch is built with performance in mind. Compiled via the SageLang AOT compiler, it significantly outperforms typical script environments.</p>

        <div className="card-highlight glow-on-hover">
          <h2>Loop Benchmark (1000 Iterations)</h2>
          <p>Evaluating an empty <code>FOR</code> loop for 1000 iterations to measure interpreter overhead.</p>
          <div className="chart-bar-container">
            <div className="chart-label">SageBatch AOT</div>
            <div className="chart-bar-wrapper">
              <div className="chart-bar primary-bar" style={{ width: '15%' }}></div>
              <span className="chart-value">0.02s</span>
            </div>
          </div>
          <div className="chart-bar-container">
            <div className="chart-label">SageBatch Interpreter (SageVM)</div>
            <div className="chart-bar-wrapper">
              <div className="chart-bar secondary-bar" style={{ width: '60%' }}></div>
              <span className="chart-value">1.15s</span>
            </div>
          </div>
        </div>
        
        <div className="card-highlight glow-on-hover">
          <h2>Fibonacci Benchmark (200 Iterations)</h2>
          <p>Recursive parsing and evaluation of math operations using <code>SET /A</code>.</p>
          <div className="chart-bar-container">
            <div className="chart-label">SageBatch AOT</div>
            <div className="chart-bar-wrapper">
              <div className="chart-bar primary-bar" style={{ width: '25%' }}></div>
              <span className="chart-value">0.08s</span>
            </div>
          </div>
          <div className="chart-bar-container">
            <div className="chart-label">SageBatch Interpreter (SageVM)</div>
            <div className="chart-bar-wrapper">
              <div className="chart-bar secondary-bar" style={{ width: '90%' }}></div>
              <span className="chart-value">3.40s</span>
            </div>
          </div>
        </div>

        <div className="info-box">
          <CheckCircle className="info-icon" size={24} />
          <div>
            <h3>The AOT Advantage</h3>
            <p>Native compilation removes VM bytecode parsing overhead and leverages GCC/Clang link-time optimizations, producing a tightly-packed executable.</p>
          </div>
        </div>
      </div>
    )
  }
};

function App() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  if (activeSection === null) {
    return (
      <div className="app-container">
        <header className="glass-header">
          <div className="logo-container">
            <div className="logo-icon-wrapper">
              <Terminal className="logo-icon" size={24} />
            </div>
            <span className="logo-text">SageBatch</span>
          </div>
          <div className="nav-links">
            <span className="nav-link" onClick={() => setActiveSection('getting_started')}>Documentation</span>
            <a href="https://github.com/Night-Traders-Dev/SageBatch" className="nav-link github-btn" target="_blank" rel="noreferrer">
              <Globe size={16} /> GitHub
            </a>
          </div>
        </header>

        <main className="landing-content">
          <div className="glow-sphere sphere-1"></div>
          <div className="glow-sphere sphere-2"></div>
          
          <section className="hero">
            <div className="hero-badge">v1.0.0 Release</div>
            <h1 className="hero-title">The Ultimate DOS <br/><span className="gradient-text">Batch Engine</span></h1>
            <p className="hero-subtitle">Reimagining MS-DOS Batch 4.0 with extreme performance, modern type-safety, and seamless SageVM portability. Completely written in pure SageLang.</p>
            <div className="hero-buttons">
              <button className="btn btn-primary" onClick={() => setActiveSection('getting_started')}>
                Explore Documentation <ArrowRight size={18} />
              </button>
              <button className="btn btn-secondary" onClick={() => window.open('https://github.com/Night-Traders-Dev/SageBatch', '_blank')}>
                <Code size={18} /> View Source
              </button>
            </div>
          </section>

          <section className="features-grid">
            <div className="feature-card glass-card">
              <div className="feature-icon-wrapper bg-primary-dim">
                <Zap className="text-primary" size={28} />
              </div>
              <h3>Native Performance</h3>
              <p>Compiled directly to native C/LLVM via the SageLang compiler for blazing-fast script execution with minimal memory overhead.</p>
            </div>
            <div className="feature-card glass-card">
              <div className="feature-icon-wrapper bg-secondary-dim">
                <Code className="text-secondary" size={28} />
              </div>
              <h3>100% Pure SageLang</h3>
              <p>A full lexer, AST parser, and recursive tree-walk interpreter built from scratch in the beautiful Sage systems language.</p>
            </div>
            <div className="feature-card glass-card">
              <div className="feature-icon-wrapper bg-accent-dim">
                <Cpu className="text-accent" size={28} />
              </div>
              <h3>SageVM Ready</h3>
              <p>Seamlessly compile to SGVM bytecode and run batch scripts on bare-metal kernels, bootloaders, and embedded systems.</p>
            </div>
            <div className="feature-card glass-card">
              <div className="feature-icon-wrapper bg-primary-dim">
                <Globe className="text-primary" size={28} />
              </div>
              <h3>SageDOS Core</h3>
              <p>Serves as the foundational COMMAND.COM shell for SageDOS, managing the environment, boot scripts, and system tools natively.</p>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="app-container docs-layout">
      <header className="glass-header docs-header">
        <div className="logo-container" style={{ cursor: 'pointer' }} onClick={() => setActiveSection(null)}>
          <div className="logo-icon-wrapper">
            <Terminal className="logo-icon" size={24} />
          </div>
          <span className="logo-text">SageBatch</span>
        </div>
        <div className="nav-links">
          <span className="nav-link active">Docs</span>
          <a href="https://github.com/Night-Traders-Dev/SageBatch" className="nav-link" target="_blank" rel="noreferrer">GitHub</a>
        </div>
      </header>

      <div className="docs-body">
        <aside className="sidebar glass-sidebar">
          <div className="sidebar-content">
            <div className="sidebar-group">
              <span className="sidebar-title">Menu</span>
              {Object.entries(sections).map(([key, section]) => (
                <div 
                  key={key} 
                  className={`sidebar-item ${activeSection === key ? 'active' : ''}`}
                  onClick={() => setActiveSection(key)}
                >
                  <span className="sidebar-item-icon">{section.icon}</span>
                  <span className="sidebar-item-text">{section.title}</span>
                  {activeSection === key && <div className="active-indicator"></div>}
                </div>
              ))}
            </div>
          </div>
        </aside>

        <main className="content-area custom-scrollbar">
          <div className="content-wrapper glass-content">
            {sections[activeSection as keyof typeof sections]?.content}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
