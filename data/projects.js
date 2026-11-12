// All site content lives here. To add a project, add one object to PROJECTS.
// Required: id, title, kind, area, oneLiner. Everything else is optional and only renders if present.
// The index lists projects area by area (in AREAS order), keeping this file's order inside each area.
// area: one of the AREAS ids below; it drives the index grouping and the filter buttons.
// featured: true moves a project out of the table into a large card at the top of the index.
// stats: [{ value, label, highlight? }]  A row of key numbers under the figure; highlight colours one of them.
// built/results items: a string, or { text, chart } to put a chart under that one claim (chart takes max? to set the scale).
// figure: { type: "video", src, poster, caption, ratio?, sound? }  (ratio: "w / h"; taller than wide renders as a phone frame)
//       | { type: "image", src, alt, caption } | { type: "diagram", src: "assets/<id>.svg", caption }
//       | { type: "chart", unit, bars: [{ label, value, highlight? }], caption }

window.AREAS = [
  { id: "ai", name: "AI and RAG systems", short: "AI and RAG" },
  { id: "agents", name: "Agent infrastructure", short: "Agents" },
  { id: "infra", name: "Infrastructure and tools", short: "Infrastructure" },
  { id: "client", name: "Client work", short: "Client" },
  { id: "research", name: "Research", short: "Research" },
  { id: "mobile", name: "Mobile", short: "Mobile" }
];

window.PROJECTS = [
  {
    id: "wiqas",
    area: "ai",
    featured: true,
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
      "A comparison of 8 pipeline configurations to locate where each answer went wrong.",
      "The SvelteKit frontend, and the deployment of the full system on Google Cloud Platform."
    ],
    results: [
      "A three-tier failure taxonomy: retrieval, generation, and cultural. Cultural failures are often silent: the answer is grounded and scores fine on RAGAS, but it is culturally wrong.",
      {
        text: "Retrieval, not generation, is the bottleneck. Complete retrieval misses outnumber every generation failure mode combined by about 15 to 1.",
        chart: {
          unit: "%",
          bars: [
            { label: "Complete retrieval miss", value: 38.2, highlight: true },
            { label: "All generation failures", value: 2.6 }
          ],
          caption: "Retrieval: mean across 8 configurations. Generation: the worst single configuration."
        }
      },
      {
        text: "Filipino queries miss retrieval almost twice as often as English ones, traced to embedding misalignment in BGE-M3.",
        chart: {
          unit: "%",
          bars: [
            { label: "English queries", value: 30 },
            { label: "Filipino queries", value: 53, highlight: true }
          ],
          caption: "Complete-miss rate at baseline, rounded. Ranges across both generators: 29.4-30.3% and 52.3-52.8%."
        }
      },
      "Outstanding Thesis Award, and the basis of a paper accepted at PRICAI 2026."
    ],
    stats: [
      { value: "2,917", label: "questions, English and Filipino" },
      { value: "8", label: "pipeline configurations" },
      { value: "23,321", label: "answers judged" },
      { value: "35.0%", label: "of answers failed culturally", highlight: true }
    ],
    figure: { type: "video", src: "assets/wiqas.mp4?v=2", poster: "assets/wiqas.jpg", ratio: "1440 / 714", caption: "A Filipino question answered with cited sources and per-stage timings. The 23-second wait for the answer is sped up 8x." },
    stack: ["Python", "BM25", "BGE-M3", "Ollama", "RAGAS", "SvelteKit", "GCP"],
    repo: "https://github.com/Ralf090102/WiQAS"
  },
  {
    id: "lex",
    area: "ai",
    featured: true,
    title: "Lex",
    kind: "Ablation study",
    year: 2026,
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
    area: "ai",
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
    figure: { type: "video", src: "assets/orion.mp4?v=2", poster: "assets/orion.jpg", ratio: "1440 / 756", sound: true, caption: "A question answered from local course notes, with page citations and the reply read aloud." },
    stack: ["Python", "FastAPI", "ChromaDB", "SvelteKit", "Tauri"],
    repo: "https://github.com/Ralf090102/Orion"
  },
  {
    id: "eruvoice",
    area: "ai",
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
      {
        text: "Benchmarking showed the quantized int8 Kokoro model was over 10x slower than fp32 on the target CPU, the opposite of what quantization usually buys, so fp32 is the default.",
        chart: {
          unit: " s",
          max: 16,
          bars: [
            { label: "int8 (114 MB)", value: 14.4 },
            { label: "fp32 (326 MB)", value: 1.2, highlight: true }
          ],
          caption: "Time to synthesize a 4-second clip, reproduced 3 times. Lower is better."
        }
      }
    ],
    figure: { type: "diagram", src: "assets/eruvoice.svg", caption: "One turn. A keyword router handles cancel and local commands without calling Claude. Everything else goes to a single Claude Code session that can only reach the vault through one MCP server." },
    stack: ["Claude Code CLI", "MCP", "faster-whisper", "Kokoro-82M"]
  },
  {
    id: "erudition",
    area: "agents",
    title: "Erudition",
    kind: "MCP memory server",
    year: 2026,
    context: "Personal project, open source",
    oneLiner: "Portable, git-backed memory for AI agents, stored as markdown that people can read.",
    problem: "Agent memory is usually locked inside one tool or one machine. Erudition stores it as plain markdown in a git repo, and any MCP client can use it.",
    built: [
      "An MCP server with 10 tools: file reading, writing, and targeted edits, plus memory operations that follow a memory taxonomy.",
      "Claude Code SessionStart and Stop hooks that load context at the start of a session and sync memory after each turn.",
      "A rebuildable SQLite FTS5 search index over the markdown, which detects stale entries."
    ],
    results: [
      "An 82-test suite, checked by breaking the path-traversal guard and the staleness check on purpose and confirming the tests caught both."
    ],
    stack: ["Python", "MCP", "SQLite FTS5", "pytest"],
    repo: "https://github.com/Ralf090102/Erudition"
  },
  {
    id: "lyra",
    area: "agents",
    title: "Lyra",
    kind: "MCP pipeline tools",
    year: 2026,
    context: "Personal project",
    oneLiner: "Typed RAG pipeline stages that an agent can call directly, instead of reading scripts and asking for pasted output.",
    problem: "When an agent works on a RAG pipeline, it usually reads the code or asks a person to run a script and paste the output. Both are slow and lose structure.",
    built: [
      "One typed interface for retrieve, rerank, and eval stages, exposed as MCP tools: list_stages, get_stage_config, set_stage_config, run_stage, run_pipeline.",
      "Each stage runs the target project's own Python environment as a subprocess and talks JSON over stdin and stdout, so Lyra itself stays dependency-light.",
      "An eval stage (RAGAS answer similarity) to show the interface also works for stages that call a live LLM."
    ],
    results: [
      "Works with two codebases of different shapes: WiQAS (scripts) and Orion (a FastAPI service), with no changes to shared code.",
      "Scoped down from a visual node-canvas idea to the typed layer, which is what actually saves an agent time."
    ],
    figure: { type: "diagram", src: "assets/lyra.svg", caption: "Two projects with different shapes behind one interface. Wrapping Orion took new adapter files only; the core, the executor, and the shared runner were not changed." },
    stack: ["Python", "MCP", "RAGAS"],
    repo: "https://github.com/Ralf090102/lyra-mcp"
  },
  {
    id: "job-tracker",
    area: "ai",
    title: "Job Application Tracker",
    kind: "Full stack + LLM",
    year: 2026,
    context: "Personal project",
    oneLiner: "Paste a job posting, and a local model extracts the fields and flags red flags.",
    built: [
      "A Laravel 13 API with Sanctum authentication and a React interface with search, filtering, and sorting.",
      "Local Ollama extraction that scores each posting against a personal vetting rubric.",
      "An auto-apply pipeline: n8n pulls listings from JSearch, a local model screens out non-matches and tailors a resume for each match, and Proteus renders it to PDF. A Claude Code skill then reviews the queue and submits through Indeed's Easy Apply, under a daily cap, and stops to ask on salary or unfamiliar screening questions."
    ],
    results: ["Taken from a new Laravel install to a working app in two days, to learn the stack for a target role."],
    figure: { type: "diagram", src: "assets/job-tracker.svg", caption: "The whole system. The React app is for manual tracking. The auto-apply pipeline ingests listings through n8n, tailors a resume for each match, and hands the queue to Claude Code for review and submission." },
    stack: ["Laravel", "PHP", "React", "Ollama"],
    repo: "https://github.com/Ralf090102/Job-Application-Tracker"
  },
  {
    id: "proteus",
    area: "infra",
    title: "Proteus",
    kind: "CLI tool",
    year: 2026,
    context: "Personal project",
    oneLiner: "A local document converter with Windows shell integration, so files never go to an online converter.",
    built: [
      "A converter registry where each new format pair is a two-line addition. Three pairs were added after v1 without touching the core.",
      "Multi-file merging through Windows Send To, the one shell mechanism that passes a whole selection to a single process."
    ],
    figure: { type: "video", src: "assets/proteus.mp4", poster: "assets/proteus.jpg", ratio: "990 / 694", caption: "A .docx converted to PDF from the right-click menu, then three PDFs merged into one through Send To. Waits are sped up." },
    stats: [
      { value: "240", label: "unit tests" },
      { value: "8", label: "integration tests" },
      { value: "2 lines", label: "to add a format pair" }
    ],
    stack: ["Python", "Windows shell"],
    repo: "https://github.com/Ralf090102/Proteus"
  },
  {
    id: "tmwa",
    area: "infra",
    title: "TMWA",
    kind: "Kubernetes / GitOps",
    year: 2026,
    context: "Learning project",
    oneLiner: "A task manager built to learn Kubernetes and GitOps from start to finish.",
    built: [
      "Split a Next.js monolith into microservices, each with its own image and Helm templates.",
      "ArgoCD canary rollouts, with Prometheus, Grafana, and Loki for observability."
    ],
    stats: [
      { value: "8", label: "microservices" },
      { value: "9", label: "container images per commit" },
      { value: "5", label: "Prometheus alert rules" }
    ],
    figure: { type: "diagram", src: "assets/tmwa.svg", caption: "The whole system. GitHub Actions builds the images, ArgoCD syncs the Helm chart into the cluster, and the Next.js app fans out to the services behind the ingress." },
    stack: ["Kubernetes", "ArgoCD", "Prometheus", "Grafana"],
    repo: "https://github.com/Ralf090102/Task-Manager-Web-Application"
  },
  {
    id: "anito",
    area: "research",
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
    area: "research",
    title: "Project-VoyagAR",
    kind: "AR authoring tool",
    year: 2025,
    context: "Internship, DLSU GameLab",
    oneLiner: "A no-code tool for building AR tabletop quizzes on PC, played on an Android app.",
    built: [
      "Built the editor's interface panels with Dear ImGui.",
      "Ran QA with 10 user testers who evaluated the tool and reported issues.",
      "Created a skeleton AR quiz that uses every feature, as an end-to-end check that each one works."
    ],
    results: [
      "Published in Entertainment Computing, vol. 58 (2026).",
      "Exhibited at PGDX 2025, Indie Stars."
    ],
    figure: { type: "image", src: "assets/voyagar.png", alt: "VoyagAR 3D Editor main menu", caption: "The VoyagAR 3D Editor, where quizzes are authored on PC before being played in AR on Android." },
    stack: ["Unity", "C#", "Vuforia", "Android"],
    repo: "https://github.com/DLSU-GAME-Lab/Project-VoyagAR"
  },
  {
    id: "ggcn",
    area: "client",
    title: "GGCN Website",
    kind: "Client web app",
    year: 2025,
    context: "Nonprofit client, 6-person Scrum team",
    oneLiner: "A website for Grace Gospel Church North, with attendance tracking and reports.",
    built: [
      "Attendance tracking with filtering and reporting statistics.",
      "CI/CD with automatic deploys, a main/dev/feature branching workflow, and automated tests."
    ],
    figure: { type: "image", src: "assets/ggcn.webp", alt: "Grace Gospel Church North logo banner", caption: "The client's banner: Grace Gospel Church North." },
    stack: ["SvelteKit", "Supabase", "Jest", "Cloudflare Pages"]
  },
  {
    id: "gabay",
    area: "client",
    title: "GABAY",
    kind: "Client web app",
    year: 2024,
    context: "Nonprofit client, 4-person Scrum team",
    oneLiner: "A website for a Caloocan City nonprofit. I worked on both the frontend and the backend.",
    built: [
      "Dynamic pages with Handlebars.js, and client data in MongoDB.",
      "Worked with the team on the payment feature."
    ],
    figure: { type: "image", src: "assets/gabay.jpg?v=2", alt: "Collage of GABAY's community outreach and HIV testing events", caption: "GABAY's outreach work in Caloocan City, the nonprofit the site was built for." },
    stack: ["Handlebars.js", "MongoDB", "Vercel"]
  },
  {
    id: "sonusync",
    area: "mobile",
    title: "SonuSync",
    kind: "Android app",
    year: 2024,
    context: "Personal project",
    oneLiner: "A music player in Kotlin with an expandable player and media controls.",
    built: [
      "A repository layer that reads songs from the device's local storage and caches them in a Room database.",
      "Playback on ExoPlayer inside a MediaSession foreground service, so music keeps playing with notification and lock-screen controls.",
      "An expandable player: drag down to shrink it to a mini bar, tap to bring it back.",
      "MVVM with ViewModel and LiveData, Dagger Hilt for dependency injection, and a Preference Screen for settings."
    ],
    figure: { type: "video", src: "assets/sonusync.mp4", poster: "assets/sonusync.jpg", ratio: "540 / 1200", caption: "Songs, artists, albums, search, and lock-screen media controls. Played at 1.5x." },
    stack: ["Kotlin", "ExoPlayer", "Room", "Dagger Hilt"],
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
