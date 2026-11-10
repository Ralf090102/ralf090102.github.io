// All site content lives here. To add a project, add one object to PROJECTS.
// Required: id, title, kind, oneLiner. Everything else is optional and only renders if present.
// The array order is the display order on the index.
// figure: { type: "video", src, poster, caption, sound? } | { type: "image", src, alt, caption }
//       | { type: "chart", unit, bars: [{ label, value, highlight? }], caption }

window.PROJECTS = [
  {
    id: "wiqas",
    title: "WiQAS",
    kind: "RAG / evaluation",
    year: 2025,
    context: "Undergraduate thesis, DLSU",
    oneLiner: "Filipino cultural question answering that answers only from retrieved evidence, plus the evaluation to show where it fails.",
    problem: "Students can find Filipino heritage content online, but rarely a way to check whether it is culturally accurate. Most RAG evaluation methods are built on English benchmarks and miss failures specific to a low-resource language.",
    built: [
      "Hybrid retrieval combining BM25 with BGE-M3 embeddings.",
      "Generation with Gemma and SEA-LION through Ollama, chosen for real Filipino-language ability.",
      "A Cultural LLM Judge: a custom judge prompt and rubric used alongside RAGAS metrics.",
      "A comparison of 8 pipeline configurations to locate where each answer went wrong."
    ],
    results: [
      "A three-tier failure taxonomy: retrieval, generation, and cultural. Cultural failures are often silent.",
      "An 18-28% English vs Filipino performance gap, traced to embedding misalignment in retrieval.",
      "Outstanding Thesis Award, and the basis of a paper accepted at PRICAI 2026."
    ],
    figure: { type: "video", src: "assets/wiqas.mp4", poster: "assets/wiqas.jpg", caption: "A Filipino-language question answered with cited sources." },
    stack: ["Python", "BM25", "BGE-M3", "Ollama", "RAGAS"],
    repo: "https://github.com/Ralf090102/WiQAS"
  },
  {
    id: "lex",
    title: "Lex",
    kind: "Ablation study",
    context: "Course project, DLSU NLP1000, with a course partner",
    oneLiner: "A legal assistant for the Philippine Revised Penal Code, used to measure what prompting contributes and what retrieval contributes.",
    problem: "When a RAG system works, it is rarely clear whether the retrieval or the prompt did the work. We built a legal assistant over Act No. 3815 and ran an ablation on 20 legal queries to separate the two.",
    built: [
      "Three conditions: the baseline model, prompt engineering only, and full RAG with prompt engineering.",
      "A failure review of every wrong answer, each traced to a root cause with a proposed fix."
    ],
    results: [
      "Prompting added 25 points and retrieval added 30, for a 55-point gain overall.",
      "Retrieval mattered most for exact statutory facts such as article numbers and amendment dates. The base model already handled broad doctrine like transferred intent.",
      "Four failure modes: retrieval miss, hallucination and precision errors, formatting and similarity underperformance, and statutory metadata confusion."
    ],
    figure: {
      type: "chart",
      unit: "%",
      bars: [
        { label: "Baseline model", value: 5 },
        { label: "Prompt engineering only", value: 30 },
        { label: "RAG + prompt engineering", value: 60, highlight: true }
      ],
      caption: "Accuracy on 20 legal queries, by condition."
    },
    stack: ["Python", "RAG", "Prompt engineering"]
  },
  {
    id: "orion",
    title: "Orion",
    kind: "Local RAG assistant",
    year: 2025,
    context: "Personal project",
    oneLiner: "A private RAG assistant that runs entirely on your own machine, with chat, voice output, and a knowledge base that updates as files change.",
    problem: "Personal knowledge management with an LLM usually means sending your notes to a cloud service. Orion keeps everything local, including the model.",
    built: [
      "A FastAPI backend with hybrid retrieval (ChromaDB + BM25) and cross-encoder reranking.",
      "Local generation through Ollama, and Qwen3-TTS for spoken answers.",
      "A SvelteKit interface packaged as a Tauri desktop app with a bundled Python runtime, shipped as a signed installer."
    ],
    results: [
      "Installs and runs without a Python setup on the user's machine.",
      "Fixed packaging bugs, such as CORS and static-adapter issues, that only appear when a Python backend ships inside a desktop app."
    ],
    figure: { type: "video", src: "assets/orion.mp4", poster: "assets/orion.jpg", caption: "Asking Orion about a local knowledge base." },
    stack: ["Python", "FastAPI", "ChromaDB", "SvelteKit", "Tauri"],
    repo: "https://github.com/Ralf090102/Orion"
  },
  {
    id: "eruvoice",
    title: "EruVoice",
    kind: "Voice agent",
    year: 2026,
    context: "Personal project",
    oneLiner: "Talk to a notes vault and get a spoken answer. It can also create and edit notes, not just answer questions.",
    problem: "A voice assistant over personal notes has to cope with speech-to-text errors, and it must not act on a command it misheard.",
    built: [
      "faster-whisper for speech to text, then Claude Code in print mode, limited to a single vault MCP server, then Piper or Kokoro for speech.",
      "A system prompt that tells Claude the input is a transcription that may be wrong, so it asks before acting on an unclear command.",
      "A spoken fallback for every failure: timeouts, bad exits, malformed output, and expired sessions."
    ],
    results: [
      "Live microphone testing found bugs that a spec review missed, including language misdetection on short clips and a gap in MCP scoping.",
      "Benchmarking showed int8 was about 10x slower than fp32 on the target CPU (RTF 3.65 vs 0.31), so fp32 is the default."
    ],
    figure: { type: "video", src: "assets/eruvoice.mp4", poster: "assets/eruvoice.jpg", caption: "Push to talk, a spoken answer, and a note edited by voice.", sound: true },
    stack: ["Claude Code CLI", "MCP", "faster-whisper", "Kokoro-82M"]
  },
  {
    id: "erudition",
    title: "Erudition",
    kind: "MCP memory server",
    year: 2026,
    context: "Personal project, open source",
    oneLiner: "Portable, git-backed memory for AI agents, stored as markdown that people can read.",
    problem: "Agent memory is usually locked inside one tool or one machine. Erudition stores it as plain markdown in a git repo, and any MCP client can use it.",
    built: [
      "An MCP server with 9 tools: file reading and writing plus memory operations that follow a memory taxonomy.",
      "Claude Code SessionStart and Stop hooks that load context at the start of a session and sync memory after each turn.",
      "A rebuildable SQLite FTS5 search index over the markdown, which detects stale entries."
    ],
    results: [
      "An 82-test suite, checked by breaking the path-traversal guard and the staleness check on purpose and confirming the tests caught both.",
      "Found and fixed a memory-sync hook that had silently done nothing since launch because of a swallowed exception."
    ],
    stack: ["Python", "MCP", "SQLite FTS5", "pytest"],
    repo: "https://github.com/Ralf090102/Erudition"
  },
  {
    id: "lyra",
    title: "Lyra",
    kind: "MCP pipeline tools",
    year: 2026,
    context: "Personal project",
    oneLiner: "Typed RAG pipeline stages that an agent can call directly, instead of reading scripts and asking for pasted output.",
    problem: "When an agent works on a RAG pipeline, it usually reads the code or asks a person to run a script and paste the output. Both are slow and lose structure.",
    built: [
      "One interface for retrieve, rerank, generate, and eval stages, exposed as MCP tools: list_stages, get_stage_config, set_stage_config, run_stage, run_pipeline.",
      "An eval stage (RAGAS answer similarity) to show the interface also works for stages that call a live LLM."
    ],
    results: [
      "Works with two codebases of different shapes: WiQAS (scripts) and Orion (a FastAPI service), with no changes to shared code.",
      "Scoped down from a visual node-canvas idea to the typed layer, which is what actually saves an agent time."
    ],
    stack: ["Python", "MCP", "RAGAS"],
    repo: "https://github.com/Ralf090102/lyra-mcp"
  },
  {
    id: "job-tracker",
    title: "Job Application Tracker",
    kind: "Full stack + LLM",
    year: 2026,
    context: "Personal project",
    oneLiner: "Paste a job posting, and a local model extracts the fields and flags red flags.",
    built: [
      "A Laravel 13 API with Sanctum authentication and a React interface with search, filtering, and sorting.",
      "Local Ollama extraction that scores each posting against a personal vetting rubric."
    ],
    results: ["Taken from a new Laravel install to a working app in two days, to learn the stack for a target role."],
    stack: ["Laravel", "PHP", "React", "Ollama"],
    repo: "https://github.com/Ralf090102/Job-Application-Tracker"
  },
  {
    id: "proteus",
    title: "Proteus",
    kind: "CLI tool",
    year: 2026,
    context: "Personal project",
    oneLiner: "A local document converter with Windows shell integration, so files never go to an online converter.",
    built: [
      "A converter registry where each new format pair is a two-line addition. Three pairs were added after v1 without touching the core.",
      "Multi-file merging through Windows Send To, the one shell mechanism that passes a whole selection to a single process."
    ],
    results: ["240 unit and 8 integration tests passing."],
    stack: ["Python", "Windows shell"],
    repo: "https://github.com/Ralf090102/Proteus"
  },
  {
    id: "tmwa",
    title: "TMWA",
    kind: "Kubernetes / GitOps",
    year: 2026,
    context: "Learning project",
    oneLiner: "A task manager built to learn Kubernetes and GitOps from start to finish.",
    built: [
      "Moved from a monolith to 8 microservices across 9 container images.",
      "ArgoCD canary rollouts, with Prometheus, Grafana, and Loki for observability."
    ],
    stack: ["Kubernetes", "ArgoCD", "Prometheus", "Grafana"],
    repo: "https://github.com/Ralf090102/Task-Manager-Web-Application"
  },
  {
    id: "anito",
    title: "Anito-3DBenchmark",
    kind: "Rendering benchmark",
    year: 2025,
    context: "Research assistant, DLSU GameLab",
    oneLiner: "A C++ benchmark that compares rendering backends behind one abstraction.",
    built: [
      "Swappable backends: Vulkan, DirectX 11, BGFX, Diligent Engine, and Wicked Engine.",
      "Assimp for model loading, GLM for math, and Dear ImGui for the benchmarking interface."
    ],
    stack: ["C++", "CMake", "Vulkan", "DirectX 11"],
    repo: "https://github.com/DLSU-GAME-Lab/Anito-3DBenchmark"
  },
  {
    id: "voyagar",
    title: "Project-VoyagAR",
    kind: "AR authoring tool",
    year: 2025,
    context: "Internship, DLSU GameLab",
    oneLiner: "A no-code tool for building AR tabletop quizzes on PC, played on an Android app.",
    results: [
      "Published in Entertainment Computing, vol. 58 (2026).",
      "Exhibited at PGDX 2025, Indie Stars."
    ],
    stack: ["Unity", "C#", "Vuforia", "Android"],
    repo: "https://github.com/DLSU-GAME-Lab/Project-VoyagAR"
  },
  {
    id: "ggcn",
    title: "GGCN Website",
    kind: "Client web app",
    context: "Nonprofit client, 6-person Scrum team",
    oneLiner: "A website for Grace Gospel Church North, with attendance tracking and reports.",
    built: [
      "Attendance tracking with filtering and reporting statistics.",
      "CI/CD with automatic deploys, a main/dev/feature branching workflow, and automated tests."
    ],
    stack: ["SvelteKit", "Supabase", "Jest", "Cloudflare Pages"]
  },
  {
    id: "gabay",
    title: "GABAY",
    kind: "Client web app",
    context: "Nonprofit client, 4-person Scrum team",
    oneLiner: "A website for a Caloocan City nonprofit. I worked on both the frontend and the backend.",
    built: [
      "Dynamic pages with Handlebars.js, and client data in MongoDB.",
      "Worked with the team on the payment feature."
    ],
    stack: ["Handlebars.js", "MongoDB", "Vercel"]
  },
  {
    id: "sonusync",
    title: "SonuSync",
    kind: "Android app",
    context: "Personal project",
    oneLiner: "A music player in Kotlin with an expandable player and media controls.",
    stack: ["Kotlin", "ExoPlayer"],
    repo: "https://github.com/Ralf090102/SonuSync"
  }
];

window.PAPERS = [
  {
    venue: "PRICAI 2026",
    title: "Cultural Failure as a Third Tier of RAG Failure: Taxonomy, Silent Failures, and Empirical Validation in a Low-Resource Language Setting",
    authors: "Cheng, C., Hernandez, R.W., Ortiz, M.C., Santos, A.L., Montalan, J.R.",
    note: "Accepted. Guangzhou, November 2026.",
    project: "wiqas"
  },
  {
    venue: "Entertainment Computing",
    title: "A No-Code Augmented Reality Authoring Tool for Creating AR Tabletop Interactive Quizzes",
    authors: "Del Gallego, N.P., Hernandez, R.W., Too, K.S., Lim, R.K., Ilao, J.",
    note: "Vol. 58, 101187 (2026).",
    url: "https://doi.org/10.1016/j.entcom.2026.101187",
    project: "voyagar"
  }
];
