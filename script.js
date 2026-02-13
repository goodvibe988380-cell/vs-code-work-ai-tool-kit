// ================================
// AI TOOL KIT - JAVASCRIPT
// Advanced Interactions & Animations
// ================================

// ========== SERVICE WORKER ==========
// Disabled by request.

// ========== WAIT FOR DOM TO LOAD ==========
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

// ========== MAIN INITIALIZATION ==========
function initializeApp() {
    setupNavigation();
    setupScrollAnimations();
    setupCategoryCards();
    updateCategoryCounts();
    setupSearchFunctionality();
    createParticles();
    setupTypingEffect();
}

// ========== NAVIGATION SCROLL EFFECT ==========
function setupNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    // Add scroll effect to navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ========== SCROLL ANIMATIONS ==========
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);
    
    // Observe all elements with slide-up class
    document.querySelectorAll('.slide-up').forEach(el => {
        observer.observe(el);
    });
}

// ========== CATEGORY CARD INTERACTIONS ==========
function setupCategoryCards() {
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach((card, index) => {
        // Add staggered animation delay
        card.style.animationDelay = `${index * 0.1}s`;
        
        // Click to expand/collapse
        card.addEventListener('click', () => {
            toggleCategoryTools(card);
        });
    });
}

// ========== EXPAND/COLLAPSE CATEGORY TOOLS ==========
function toggleCategoryTools(card) {
    const toolsContainer = card.querySelector('.tools-container');
    
    if (!toolsContainer) {
        // First time expanding - create tools dynamically
        createToolsForCategory(card);
    } else {
        // Toggle existing container
        toolsContainer.classList.toggle('expanded');
    }
    
    // Add ripple effect
    createRipple(card, event);
}

// ========== CREATE TOOLS DYNAMICALLY ==========
function createToolsForCategory(card) {
    const selectedCategory = card.querySelector('h3').textContent;
    const tools = getAllTools();

    // FIXED CATEGORY FILTER LOGIC
    const toolsData = tools.filter(tool =>
        normalizeCategory(tool.category) === normalizeCategory(selectedCategory)
    );
    
    const toolsContainer = document.createElement('div');
    toolsContainer.className = 'tools-container expanded';
    
    toolsData.forEach(tool => {
        const toolCard = document.createElement('div');
        toolCard.className = 'tool-card';
        toolCard.innerHTML = `
            <h4>${tool.name}</h4>
            <p>${tool.description}</p>
            <a href="${tool.link}" class="tool-link" target="_blank" onclick="event.stopPropagation()">
                Open Tool →
            </a>
        `;
        toolsContainer.appendChild(toolCard);
    });
    
    card.appendChild(toolsContainer);
    
    // Simple fade-in for tool cards
    setTimeout(() => {
        toolsContainer.querySelectorAll('.tool-card').forEach((tool) => {
            tool.style.opacity = '1';
            tool.style.transform = 'translateY(0)';
            tool.style.transition = 'opacity 0.2s ease';
        });
    }, 10);
}

// HELPER FUNCTION
function normalizeCategory(category) {
    return String(category || '').trim().toLowerCase();
}

// FIXED CATEGORY COUNT LOGIC
function updateCategoryCounts() {
    const categoryCards = document.querySelectorAll('.category-card');
    const tools = getAllTools();

    console.log([...new Set(tools.map(t => t.category))]);

    categoryCards.forEach((card) => {
        const selectedCategory = card.querySelector('h3').textContent;
        const countElement = card.querySelector('.tool-count');

        if (!countElement) return;

        const count = tools.filter(tool =>
            normalizeCategory(tool.category) === normalizeCategory(selectedCategory)
        ).length;

        countElement.textContent = `${count} Tools`;
    });
}

// ========== LATEST POPULAR TOOLS (2024-2026) ==========
const latestPopularTools = [
    { name: 'Kimi K2', category: 'Chatbots', description: 'Long-context multilingual assistant model by Moonshot AI.', link: 'https://github.com/MoonshotAI/Kimi-K2' },
    { name: 'OpenRouter', category: 'App Build', description: 'Unified API router for accessing multiple frontier and open LLMs.', link: 'https://openrouter.ai' },
    { name: 'Perplexity', category: 'Research', description: 'AI answer engine with web grounding and citations.', link: 'https://www.perplexity.ai' },
    { name: 'Runway', category: 'Video Editing', description: 'Generative video suite for creation, editing, and production workflows.', link: 'https://runwayml.com' },
    { name: 'Pika', category: 'Video Editing', description: 'Fast AI video generation and edit control platform.', link: 'https://pika.art' },
    { name: 'Claude 3', category: 'Chatbots', description: 'Anthropic model family for reasoning, coding, and enterprise assistants.', link: 'https://www.anthropic.com/claude' },
    { name: 'Gemini Advanced', category: 'Google Tools', description: 'Premium Gemini experience with advanced model capabilities.', link: 'https://gemini.google.com/advanced' },
    { name: 'Grok', category: 'Chatbots', description: 'xAI conversational assistant with real-time web awareness.', link: 'https://x.ai/grok' },
    { name: 'Replit AI', category: 'Code Assistant', description: 'Cloud coding assistant for generation, debugging, and deployment.', link: 'https://replit.com/ai' },
    { name: 'Cursor', category: 'Code Assistant', description: 'AI-native code editor for large-codebase workflows.', link: 'https://www.cursor.com' },
    { name: 'Midjourney', category: 'Image Generation', description: 'High-fidelity text-to-image platform for creators.', link: 'https://www.midjourney.com' },
    { name: 'Suno', category: 'Music & Audio', description: 'Generate complete songs with vocals and arrangement from prompts.', link: 'https://suno.ai' },
    { name: 'ElevenLabs', category: 'Music & Audio', description: 'High-quality voice synthesis, dubbing, and voice cloning platform.', link: 'https://elevenlabs.io' },
    { name: 'Devin AI', category: 'Vibe Coding', description: 'Autonomous software engineering agent for multi-step coding tasks.', link: 'https://www.cognition.ai' },
    { name: 'Hugging Face', category: 'App Build', description: 'Open AI platform for models, datasets, inference APIs, and tooling.', link: 'https://huggingface.co' },
    { name: 'Replicate', category: 'App Build', description: 'Run and deploy machine learning models through simple APIs.', link: 'https://replicate.com' },
    { name: 'Stability AI', category: 'Image Generation', description: 'Provider of generative image and multimodal models and tooling.', link: 'https://stability.ai' },
    { name: 'Leonardo AI', category: 'Image Generation', description: 'AI image creation platform for assets and creative workflows.', link: 'https://leonardo.ai' },
    { name: 'Anthropic', category: 'App Build', description: 'Claude API platform focused on reliable and safe enterprise AI.', link: 'https://www.anthropic.com' },
    { name: 'Together AI', category: 'App Build', description: 'Inference and fine-tuning platform for open foundation models.', link: 'https://www.together.ai' },
    { name: 'Mistral', category: 'Chatbots', description: 'Frontier and open-weight model provider for assistant use cases.', link: 'https://mistral.ai' },
    { name: 'Cohere', category: 'App Build', description: 'Enterprise AI platform for chat, retrieval, and automation.', link: 'https://cohere.com' },
    { name: 'You.com', category: 'Research', description: 'AI-first search assistant combining retrieval and conversation.', link: 'https://you.com' },
    { name: 'Phind', category: 'Research', description: 'Developer-focused AI search engine for technical answers.', link: 'https://www.phind.com' },
    { name: 'Exa', category: 'Research', description: 'Semantic search API designed for AI agents and apps.', link: 'https://exa.ai' },
    { name: 'Genspark', category: 'Research', description: 'AI search product focused on synthesized answer experiences.', link: 'https://www.genspark.ai' },
    { name: 'Windsurf', category: 'Code Assistant', description: 'AI coding environment for multi-file refactors and edits.', link: 'https://windsurf.com' },
    { name: 'Sourcegraph Cody', category: 'Code Assistant', description: 'Context-aware coding assistant for large repositories.', link: 'https://sourcegraph.com/cody' },
    { name: 'Augment Code', category: 'Code Assistant', description: 'AI coding assistant optimized for team codebases.', link: 'https://www.augmentcode.com' },
    { name: 'Continue.dev', category: 'Code Assistant', description: 'Open-source coding assistant framework for popular IDEs.', link: 'https://www.continue.dev' },
    { name: 'Ideogram', category: 'Image Generation', description: 'Text-to-image model known for strong prompt and text rendering.', link: 'https://ideogram.ai' },
    { name: 'FLUX.1', category: 'Image Generation', description: 'State-of-the-art image model line by Black Forest Labs.', link: 'https://blackforestlabs.ai' },
    { name: 'OpenAI Sora', category: 'Video Editing', description: 'Text-to-video generation system for cinematic outputs.', link: 'https://openai.com/sora' },
    { name: 'Luma Dream Machine', category: 'Video Editing', description: 'AI video generation platform for realistic motion and scenes.', link: 'https://lumalabs.ai/dream-machine' },
    { name: 'Kling AI', category: 'Video Editing', description: 'Video generation platform focused on longer and realistic clips.', link: 'https://klingai.com' },
    { name: 'Udio', category: 'Music & Audio', description: 'Text-to-music platform for end-to-end song generation.', link: 'https://www.udio.com' },
    { name: 'Notion AI', category: 'Writing', description: 'Workspace assistant for drafting, summarizing, and planning.', link: 'https://www.notion.so/product/ai' },
    { name: 'ClickUp Brain', category: 'Writing', description: 'Productivity assistant for task summaries and workflow content.', link: 'https://clickup.com/ai' },
    { name: 'Manus AI', category: 'Vibe Coding', description: 'General-purpose autonomous agent for multi-step digital tasks.', link: 'https://manus.im' },
    { name: 'CrewAI', category: 'Vibe Coding', description: 'Framework for orchestrating collaborative multi-agent systems.', link: 'https://www.crewai.com' },
    { name: 'OpenHands', category: 'Vibe Coding', description: 'Open-source software agent project for autonomous coding.', link: 'https://github.com/All-Hands-AI/OpenHands' },
    { name: 'LangGraph', category: 'Vibe Coding', description: 'Stateful orchestration framework for complex AI agents.', link: 'https://www.langchain.com/langgraph' },
    { name: 'Llama 3.3', category: 'Chatbots', description: 'Meta open-weight model family for assistant and coding tasks.', link: 'https://ai.meta.com/llama/' },
    { name: 'DeepSeek-R1', category: 'Chatbots', description: 'Reasoning-focused open model with strong coding and math performance.', link: 'https://www.deepseek.com/' },
    { name: 'Qwen2.5', category: 'Chatbots', description: 'Multilingual open model family with strong coding capabilities.', link: 'https://qwenlm.github.io/' },
    { name: 'Gemma 2', category: 'Google Tools', description: 'Google open model family for efficient local and cloud inference.', link: 'https://ai.google.dev/gemma' },
    { name: 'Fireworks AI', category: 'App Build', description: 'High-performance model serving and inference platform.', link: 'https://fireworks.ai' },
    { name: 'GroqCloud', category: 'App Build', description: 'Low-latency inference platform on Groq hardware.', link: 'https://groq.com' },
    { name: 'NotebookLM', category: 'Research', description: 'Source-grounded AI assistant for document research workflows.', link: 'https://notebooklm.google' },
    { name: 'SciSpace', category: 'Research', description: 'AI research companion for paper discovery and understanding.', link: 'https://www.scispace.com' }
];

function normalizeToolName(name) {
    return String(name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function appendLatestPopularTools(toolsDatabase) {
    const existingNames = new Set();

    Object.values(toolsDatabase).forEach((tools) => {
        tools.forEach((tool) => {
            existingNames.add(normalizeToolName(tool.name));
        });
    });

    latestPopularTools.forEach((tool) => {
        const normalizedName = normalizeToolName(tool.name);

        if (!normalizedName || existingNames.has(normalizedName)) {
            return;
        }

        if (!toolsDatabase[tool.category]) {
            toolsDatabase[tool.category] = [];
        }

        toolsDatabase[tool.category].push({
            name: tool.name,
            description: tool.description,
            link: tool.link
        });
        existingNames.add(normalizedName);
    });
}

// ========== SAMPLE TOOLS DATA ==========
function getToolsForCategory(category) {
    const toolsDatabase = {
        'Image Generation': [
            { name: 'DALL-E', description: 'Create images from text descriptions', link: 'https://openai.com/dall-e' },
            { name: 'Midjourney', description: 'AI art generator for stunning visuals', link: 'https://midjourney.com' },
            { name: 'Stable Diffusion', description: 'Open-source image generation', link: 'https://stablediffusionweb.com' },
            { name: 'Adobe Firefly', description: 'Generative AI for creative tasks', link: 'https://www.adobe.com/products/firefly' },
            { name: 'Artbreeder', description: 'Create and explore AI-generated art', link: 'https://www.artbreeder.com' },
            { name: 'NightCafe', description: 'AI art creation from text', link: 'https://creator.nightcafe.studio' },
            { name: 'Leonardo.AI', description: 'AI image generation for creators', link: 'https://www.leonardo.ai' },
            { name: 'Craiyon', description: 'Free AI image generator', link: 'https://www.craiyon.com' },
            { name: 'Deep Dream Generator', description: 'Neural network art generator', link: 'https://deepdreamgenerator.com' },
            { name: 'Imagine by Magic Studio', description: 'Generate AI art instantly', link: 'https://www.magicstudio.com' },
            { name: 'Starryai', description: 'AI art generation with NFT support', link: 'https://www.starryai.com' },
            { name: 'Wombo Dream', description: 'AI art generator app', link: 'https://www.wombo.ai' },
            { name: 'Pixelcut', description: 'AI background removal and editing', link: 'https://www.pixelcut.ai' },
            { name: 'Remove.bg', description: 'Remove image backgrounds automatically', link: 'https://www.remove.bg' },
            { name: 'Upscayl', description: 'Free AI image upscaler', link: 'https://www.upscayl.org' },
            { name: 'Icons8 Upscaler', description: 'Enhance and upscale images', link: 'https://upscayl.icons8.com' },
            { name: 'Bigjpg', description: 'Lossless image enlargement', link: 'https://bigjpg.com' },
            { name: 'Let\'s Enhance', description: 'AI image upscaling and enhancement', link: 'https://www.letsenhance.io' },
            { name: 'Photoroom', description: 'AI photo editing and background removal', link: 'https://www.photoroom.com' },
            { name: 'Cleanup.pictures', description: 'Remove unwanted objects from photos', link: 'https://cleanup.pictures' }
        ],
        'Video Editing': [
            { name: 'Runway ML', description: 'AI-powered video editing suite', link: 'https://runwayml.com' },
            { name: 'Descript', description: 'Edit videos by editing text', link: 'https://descript.com' },
            { name: 'Pictory', description: 'Turn scripts into videos', link: 'https://pictory.ai' },
            { name: 'Synthesia', description: 'Create AI video avatars', link: 'https://www.synthesia.io' },
            { name: 'Opus Clip', description: 'Repurpose long videos into short clips', link: 'https://www.opusclip.com' },
            { name: 'Fliki', description: 'AI video creation from text', link: 'https://www.fliki.ai' },
            { name: 'HeyGen', description: 'AI video generator with avatars', link: 'https://www.heygen.com' },
            { name: 'Dify', description: 'Video editing with AI assistance', link: 'https://dify.co' },
            { name: 'Adobe Premiere Pro', description: 'Professional video editing with AI', link: 'https://www.adobe.com/products/premiere' }
        ],
        'Code Assistant': [
            { name: 'GitHub Copilot', description: 'AI pair programmer', link: 'https://github.com/features/copilot' },
            { name: 'Tabnine', description: 'AI code completion', link: 'https://tabnine.com' },
            { name: 'Cursor', description: 'AI-first code editor', link: 'https://cursor.sh' },
            { name: 'Codeium', description: 'Free code acceleration toolkit', link: 'https://codeium.com' },
            { name: 'ChatGPT', description: 'General AI for code help', link: 'https://chat.openai.com' },
            { name: 'Claude', description: 'AI assistant for coding', link: 'https://claude.ai' },
            { name: 'Replit Ghostwriter', description: 'AI-powered code assistant', link: 'https://replit.com' },
            { name: 'Amazon CodeWhisperer', description: 'ML-powered code recommendations', link: 'https://aws.amazon.com/codewhisperer' },
            { name: 'Kite', description: 'Advanced code completion engine', link: 'https://www.kite.com' }
        ],
        'Excel & Data': [
            { name: 'Formula Bot', description: 'Convert text to Excel formulas', link: 'https://formulabot.com' },
            { name: 'SheetAI', description: 'AI for Google Sheets', link: 'https://sheetai.app' },
            { name: 'DataRobot', description: 'Automated machine learning', link: 'https://datarobot.com' },
            { name: 'Tableau', description: 'AI-powered data visualization', link: 'https://www.tableau.com' },
            { name: 'Power BI', description: 'Business analytics with AI', link: 'https://powerbi.microsoft.com' },
            { name: 'Alteryx', description: 'Automated analytics platform', link: 'https://www.alteryx.com' },
            { name: 'MonkeyLearn', description: 'ML text analysis platform', link: 'https://monkeylearn.com' },
            { name: 'Akkio', description: 'AI predictions for spreadsheets', link: 'https://www.akkio.com' }
        ],
        'Chatbots': [
            { name: 'ChatGPT', description: 'Conversational AI assistant', link: 'https://chat.openai.com' },
            { name: 'Claude', description: 'AI assistant by Anthropic', link: 'https://claude.ai' },
            { name: 'Perplexity', description: 'AI-powered search engine', link: 'https://perplexity.ai' },
            { name: 'Bard', description: 'Google\'s conversational AI', link: 'https://bard.google.com' },
            { name: 'Gemini', description: 'Google\'s advanced AI model', link: 'https://gemini.google.com' },
            { name: 'Microsoft Copilot', description: 'AI assistant by Microsoft', link: 'https://copilot.microsoft.com' },
            { name: 'LLaMA', description: 'Open-source language model', link: 'https://www.meta.com/research/llama' },
            { name: 'Hugging Chat', description: 'Open-source chatbot', link: 'https://huggingface.co/chat' },
            { name: 'Replika', description: 'AI companion chatbot', link: 'https://replika.ai' }
        ],
        'Music & Audio': [
            { name: 'Suno', description: 'Generate music from text', link: 'https://suno.ai' },
            { name: 'AIVA', description: 'AI music composition', link: 'https://aiva.ai' },
            { name: 'Mubert', description: 'AI soundtrack generator', link: 'https://mubert.com' },
            { name: 'OpenAI Jukebox', description: 'Generate music in various genres', link: 'https://openai.com/blog/jukebox' },
            { name: 'Landr', description: 'AI music mastering service', link: 'https://www.landr.com' },
            { name: 'iZotope RX', description: 'Advanced audio restoration', link: 'https://www.izotope.com/en/products/rx' },
            { name: 'Descript', description: 'Audio editing by editing text', link: 'https://www.descript.com' },
            { name: 'ElevenLabs', description: 'AI voice generation', link: 'https://elevenlabs.io' }
        ],
        'Writing': [
            { name: 'Jasper', description: 'AI writing assistant for marketing', link: 'https://jasper.ai' },
            { name: 'Copy.ai', description: 'AI copywriting tool', link: 'https://copy.ai' },
            { name: 'Grammarly', description: 'AI grammar and writing check', link: 'https://grammarly.com' },
            { name: 'Wordtune', description: 'AI rewriting and paraphrasing', link: 'https://wordtune.com' },
            { name: 'Sudowrite', description: 'AI writing for creative fiction', link: 'https://sudowrite.com' },
            { name: 'Rytr', description: 'AI writing assistant for all use cases', link: 'https://rytr.me' },
            { name: 'QuillBot', description: 'AI paraphrasing tool', link: 'https://quillbot.com' },
            { name: 'Hemingway Editor', description: 'AI writing editor', link: 'https://www.hemingwayapp.com' },
            { name: 'Writesonic', description: 'AI content generation platform', link: 'https://writesonic.com' }
        ],
        'Research': [
            { name: 'Consensus', description: 'AI-powered research search', link: 'https://consensus.app' },
            { name: 'Elicit', description: 'AI research paper analysis', link: 'https://elicit.org' },
            { name: 'Perplexity', description: 'AI research assistant', link: 'https://perplexity.ai' },
            { name: 'Connected Papers', description: 'Research paper visualization', link: 'https://connectedpapers.com' },
            { name: 'Scite', description: 'AI scientific citation search', link: 'https://scite.ai' },
            { name: 'Semantic Scholar', description: 'AI research paper search', link: 'https://www.semanticscholar.org' },
            { name: 'Research Rabbit', description: 'AI academic paper discovery', link: 'https://www.researchrabbit.ai' },
            { name: 'PubMed', description: 'Medical research database', link: 'https://pubmed.ncbi.nlm.nih.gov' }
        ],
        'Design': [
            { name: 'Canva AI', description: 'AI-powered design editor', link: 'https://canva.com' },
            { name: 'Adobe Firefly', description: 'AI-powered generative design', link: 'https://www.adobe.com/products/firefly' },
            { name: 'Runway', description: 'AI design and video platform', link: 'https://runwayml.com' },
            { name: 'Looka', description: 'AI logo and branding generator', link: 'https://looka.com' },
            { name: 'Figma AI', description: 'AI features in Figma design tool', link: 'https://figma.com' },
            { name: 'Descript', description: 'AI design for video content', link: 'https://www.descript.com' },
            { name: 'Brandmark', description: 'AI logo design generator', link: 'https://brandmark.io' },
            { name: 'Namelix', description: 'AI business name generator', link: 'https://namelix.com' },
            { name: 'Uizard', description: 'AI UI/UX design tool', link: 'https://uizard.io' }
        ],
        'Vibe Coding': [
            { name: 'Plandex', description: 'Open source AI coding agent for large projects', link: 'https://github.com/plandex-ai/plandex' },
            { name: 'Browser-use', description: 'Make websites accessible for AI agents', link: 'https://github.com/browser-use/browser-use' },
            { name: 'Claude Flow', description: 'Agent orchestration platform for multi-agent workflows', link: 'https://github.com/ruvnet/claude-flow' },
            { name: 'Steel Browser', description: 'Browser API for AI agents and apps', link: 'https://www.steelbrowser.com' },
            { name: 'Nanobrowser', description: 'Open-source Chrome extension for AI web automation', link: 'https://github.com/nanobrowser/nanobrowser' },
            { name: 'Cowork', description: 'Turn Claude into your digital coworker', link: 'https://cowork.com' },
            { name: '1Code', description: 'Open source Cursor-like UI for Claude Code', link: 'https://github.com/1Code-AI/1Code' },
            { name: 'Tonkotsu', description: 'Manage a team of coding agents from a doc', link: 'https://www.tonkotsu.ai' },
            { name: 'Bytebot', description: 'Self-hosted AI desktop agent for computer automation', link: 'https://github.com/bytebot-ai/bytebot' },
            { name: 'Anima', description: 'Design-aware AI for modern product teams with vibe coding', link: 'https://www.animaapp.com' },
            { name: 'Logfire', description: 'AI observability platform for LLM and agent systems', link: 'https://logfire.pydantic.dev' },
            { name: 'Judge0', description: 'Sandboxed code execution system for AI agents', link: 'https://judge0.com' }
        ],
        'App Build': [
            { name: 'PWA Builder', description: 'Build Progressive Web Apps with ease using Microsoft\'s PWA Builder platform', link: 'https://www.pwabuilder.com/' },
            { name: 'Android Studio', description: 'Official IDE for Android app development with powerful tools and emulator', link: 'https://developer.android.com/studio' },
            { name: 'MIT App Inventor', description: 'Visual block-based programming for beginners to create Android apps', link: 'https://appinventor.mit.edu/' },
            { name: 'Firebase', description: 'Backend platform for building web and mobile apps with real-time database', link: 'https://firebase.google.com/' },
            { name: 'React Native', description: 'Build native mobile apps using React and JavaScript for iOS and Android', link: 'https://reactnative.dev/' }
        ],
        'Google Tools': [
            { name: 'Gemini', description: 'Google\'s advanced AI model for text, images, and multimodal tasks', link: 'https://gemini.google.com' },
            { name: 'Bard', description: 'Google\'s conversational AI assistant powered by Gemini', link: 'https://bard.google.com' },
            { name: 'Google Vertex AI', description: 'Fully managed AI platform for building and deploying ML models', link: 'https://cloud.google.com/vertex-ai' },
            { name: 'Google Cloud AI', description: 'Comprehensive AI and ML services in Google Cloud', link: 'https://cloud.google.com/solutions/ai' },
            { name: 'Google Colab', description: 'Free Jupyter notebook environment for data analysis and machine learning', link: 'https://colab.google.com' },
            { name: 'Google Cloud Vision', description: 'AI-powered image analysis and understanding', link: 'https://cloud.google.com/vision' },
            { name: 'Google Cloud NLP', description: 'Natural language processing and text analysis API', link: 'https://cloud.google.com/natural-language' },
            { name: 'Google Cloud Speech-to-Text', description: 'Convert audio to text using AI', link: 'https://cloud.google.com/speech-to-text' },
            { name: 'Google Cloud Text-to-Speech', description: 'Convert text to natural-sounding audio', link: 'https://cloud.google.com/text-to-speech' },
            { name: 'Google Cloud Translation', description: 'AI-powered language translation service', link: 'https://cloud.google.com/translate' },
            { name: 'Firebase ML Kit', description: 'Machine learning SDK for mobile apps', link: 'https://firebase.google.com/docs/ml' },
            { name: 'Google Cloud Document AI', description: 'AI for document processing and data extraction', link: 'https://cloud.google.com/document-ai' }
        ]
    };

    appendLatestPopularTools(toolsDatabase);
    
    return toolsDatabase[category] || [];
}

// ========== CARD TILT EFFECT ==========
function createTiltEffect(card, e) {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 50;
    const rotateY = (centerX - x) / 50;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
}

function resetTilt(card) {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
}

// ========== RIPPLE EFFECT ==========
function createRipple(element, e) {
    // Simplified ripple - just add a subtle background effect
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(0, 255, 255, 0.2)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 0.4s ease-out';
    ripple.style.pointerEvents = 'none';
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 400);
}

// Add ripple animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ========== PARTICLE SYSTEM ==========
function createParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const particleCount = 10;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 3 + 1}px;
            height: ${Math.random() * 3 + 1}px;
            background: radial-gradient(circle, rgba(0, 255, 255, 0.6), transparent);
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${Math.random() * 15 + 15}s linear infinite;
            opacity: ${Math.random() * 0.3 + 0.1};
            pointer-events: none;
        `;
        hero.appendChild(particle);
    }
    
    // Add subtle float animation
    const particleStyle = document.createElement('style');
    particleStyle.textContent = `
        @keyframes float {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(5px, -10px); }
        }
    `;
    document.head.appendChild(particleStyle);
}

// ========== SEARCH FUNCTIONALITY ==========
function setupSearchFunctionality() {
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.querySelector('.search-input');
    const searchOverlay = document.querySelector('.search-overlay');
    const closeSearchBtn = document.querySelector('.close-search');
    
    if (!searchBtn) return;
    
    // Open search modal
    searchBtn.addEventListener('click', () => {
        searchOverlay.classList.add('active');
        searchInput.focus();
    });
    
    // Close search modal
    closeSearchBtn.addEventListener('click', () => {
        searchOverlay.classList.remove('active');
        searchInput.value = '';
    });
    
    // Close on background click
    searchOverlay.addEventListener('click', (e) => {
        if (e.target === searchOverlay) {
            searchOverlay.classList.remove('active');
            searchInput.value = '';
        }
    });
    
    // Search on input
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const resultsContainer = document.querySelector('.search-results');
        
        if (query.length === 0) {
            resultsContainer.innerHTML = '';
            return;
        }
        
        const allTools = getAllTools();
        const filtered = allTools.filter(tool => 
            tool.name.toLowerCase().includes(query) || 
            tool.description.toLowerCase().includes(query) ||
            tool.category.toLowerCase().includes(query)
        );
        
        displaySearchResults(filtered, resultsContainer);
    });
}

function getAllTools() {
    const toolsDatabase = {
        'Image Generation': [
            { name: 'DALL-E', description: 'Create images from text descriptions', link: 'https://openai.com/dall-e' },
            { name: 'Midjourney', description: 'AI art generator for stunning visuals', link: 'https://midjourney.com' },
            { name: 'Stable Diffusion', description: 'Open-source image generation', link: 'https://stablediffusionweb.com' },
            { name: 'Adobe Firefly', description: 'Generative AI for creative tasks', link: 'https://www.adobe.com/products/firefly' },
            { name: 'Artbreeder', description: 'Create and explore AI-generated art', link: 'https://www.artbreeder.com' },
            { name: 'NightCafe', description: 'AI art creation from text', link: 'https://creator.nightcafe.studio' },
            { name: 'Leonardo.AI', description: 'AI image generation for creators', link: 'https://www.leonardo.ai' },
            { name: 'Craiyon', description: 'Free AI image generator', link: 'https://www.craiyon.com' },
            { name: 'Deep Dream Generator', description: 'Neural network art generator', link: 'https://deepdreamgenerator.com' },
            { name: 'Imagine by Magic Studio', description: 'Generate AI art instantly', link: 'https://www.magicstudio.com' },
            { name: 'Starryai', description: 'AI art generation with NFT support', link: 'https://www.starryai.com' },
            { name: 'Wombo Dream', description: 'AI art generator app', link: 'https://www.wombo.ai' },
            { name: 'Pixelcut', description: 'AI background removal and editing', link: 'https://www.pixelcut.ai' },
            { name: 'Remove.bg', description: 'Remove image backgrounds automatically', link: 'https://www.remove.bg' },
            { name: 'Upscayl', description: 'Free AI image upscaler', link: 'https://www.upscayl.org' },
            { name: 'Icons8 Upscaler', description: 'Enhance and upscale images', link: 'https://upscayl.icons8.com' },
            { name: 'Bigjpg', description: 'Lossless image enlargement', link: 'https://bigjpg.com' },
            { name: 'Let\'s Enhance', description: 'AI image upscaling and enhancement', link: 'https://www.letsenhance.io' },
            { name: 'Photoroom', description: 'AI photo editing and background removal', link: 'https://www.photoroom.com' },
            { name: 'Cleanup.pictures', description: 'Remove unwanted objects from photos', link: 'https://cleanup.pictures' }
        ],
        'Video Editing': [
            { name: 'Runway ML', description: 'AI-powered video editing suite', link: 'https://runwayml.com' },
            { name: 'Descript', description: 'Edit videos by editing text', link: 'https://descript.com' },
            { name: 'Pictory', description: 'Turn scripts into videos', link: 'https://pictory.ai' },
            { name: 'Synthesia', description: 'Create AI video avatars', link: 'https://www.synthesia.io' },
            { name: 'Opus Clip', description: 'Repurpose long videos into short clips', link: 'https://www.opusclip.com' },
            { name: 'Fliki', description: 'AI video creation from text', link: 'https://www.fliki.ai' },
            { name: 'HeyGen', description: 'AI video generator with avatars', link: 'https://www.heygen.com' },
            { name: 'Dify', description: 'Video editing with AI assistance', link: 'https://dify.co' },
            { name: 'Adobe Premiere Pro', description: 'Professional video editing with AI', link: 'https://www.adobe.com/products/premiere' }
        ],
        'Code Assistant': [
            { name: 'GitHub Copilot', description: 'AI pair programmer', link: 'https://github.com/features/copilot' },
            { name: 'Tabnine', description: 'AI code completion', link: 'https://tabnine.com' },
            { name: 'Cursor', description: 'AI-first code editor', link: 'https://cursor.sh' },
            { name: 'Codeium', description: 'Free code acceleration toolkit', link: 'https://codeium.com' },
            { name: 'ChatGPT', description: 'General AI for code help', link: 'https://chat.openai.com' },
            { name: 'Claude', description: 'AI assistant for coding', link: 'https://claude.ai' },
            { name: 'Replit Ghostwriter', description: 'AI-powered code assistant', link: 'https://replit.com' },
            { name: 'Amazon CodeWhisperer', description: 'ML-powered code recommendations', link: 'https://aws.amazon.com/codewhisperer' },
            { name: 'Kite', description: 'Advanced code completion engine', link: 'https://www.kite.com' }
        ],
        'Excel & Data': [
            { name: 'Formula Bot', description: 'Convert text to Excel formulas', link: 'https://formulabot.com' },
            { name: 'SheetAI', description: 'AI for Google Sheets', link: 'https://sheetai.app' },
            { name: 'DataRobot', description: 'Automated machine learning', link: 'https://datarobot.com' },
            { name: 'Tableau', description: 'AI-powered data visualization', link: 'https://www.tableau.com' },
            { name: 'Power BI', description: 'Business analytics with AI', link: 'https://powerbi.microsoft.com' },
            { name: 'Alteryx', description: 'Automated analytics platform', link: 'https://www.alteryx.com' },
            { name: 'MonkeyLearn', description: 'ML text analysis platform', link: 'https://monkeylearn.com' },
            { name: 'Akkio', description: 'AI predictions for spreadsheets', link: 'https://www.akkio.com' }
        ],
        'Chatbots': [
            { name: 'ChatGPT', description: 'Conversational AI assistant', link: 'https://chat.openai.com' },
            { name: 'Claude', description: 'AI assistant by Anthropic', link: 'https://claude.ai' },
            { name: 'Perplexity', description: 'AI-powered search engine', link: 'https://perplexity.ai' },
            { name: 'Bard', description: 'Google\'s conversational AI', link: 'https://bard.google.com' },
            { name: 'Gemini', description: 'Google\'s advanced AI model', link: 'https://gemini.google.com' },
            { name: 'Microsoft Copilot', description: 'AI assistant by Microsoft', link: 'https://copilot.microsoft.com' },
            { name: 'LLaMA', description: 'Open-source language model', link: 'https://www.meta.com/research/llama' },
            { name: 'Hugging Chat', description: 'Open-source chatbot', link: 'https://huggingface.co/chat' },
            { name: 'Replika', description: 'AI companion chatbot', link: 'https://replika.ai' }
        ],
        'Music & Audio': [
            { name: 'Suno', description: 'Generate music from text', link: 'https://suno.ai' },
            { name: 'AIVA', description: 'AI music composition', link: 'https://aiva.ai' },
            { name: 'Mubert', description: 'AI soundtrack generator', link: 'https://mubert.com' },
            { name: 'OpenAI Jukebox', description: 'Generate music in various genres', link: 'https://openai.com/blog/jukebox' },
            { name: 'Landr', description: 'AI music mastering service', link: 'https://www.landr.com' },
            { name: 'iZotope RX', description: 'Advanced audio restoration', link: 'https://www.izotope.com/en/products/rx' },
            { name: 'Descript', description: 'Audio editing by editing text', link: 'https://www.descript.com' },
            { name: 'ElevenLabs', description: 'AI voice generation', link: 'https://elevenlabs.io' }
        ],
        'Writing': [
            { name: 'Jasper', description: 'AI writing assistant for marketing', link: 'https://jasper.ai' },
            { name: 'Copy.ai', description: 'AI copywriting tool', link: 'https://copy.ai' },
            { name: 'Grammarly', description: 'AI grammar and writing check', link: 'https://grammarly.com' },
            { name: 'Wordtune', description: 'AI rewriting and paraphrasing', link: 'https://wordtune.com' },
            { name: 'Sudowrite', description: 'AI writing for creative fiction', link: 'https://sudowrite.com' },
            { name: 'Rytr', description: 'AI writing assistant for all use cases', link: 'https://rytr.me' },
            { name: 'QuillBot', description: 'AI paraphrasing tool', link: 'https://quillbot.com' },
            { name: 'Hemingway Editor', description: 'AI writing editor', link: 'https://www.hemingwayapp.com' },
            { name: 'Writesonic', description: 'AI content generation platform', link: 'https://writesonic.com' }
        ],
        'Research': [
            { name: 'Consensus', description: 'AI-powered research search', link: 'https://consensus.app' },
            { name: 'Elicit', description: 'AI research paper analysis', link: 'https://elicit.org' },
            { name: 'Perplexity', description: 'AI research assistant', link: 'https://perplexity.ai' },
            { name: 'Connected Papers', description: 'Research paper visualization', link: 'https://connectedpapers.com' },
            { name: 'Scite', description: 'AI scientific citation search', link: 'https://scite.ai' },
            { name: 'Semantic Scholar', description: 'AI research paper search', link: 'https://www.semanticscholar.org' },
            { name: 'Research Rabbit', description: 'AI academic paper discovery', link: 'https://www.researchrabbit.ai' },
            { name: 'PubMed', description: 'Medical research database', link: 'https://pubmed.ncbi.nlm.nih.gov' }
        ],
        'Design': [
            { name: 'Canva AI', description: 'AI-powered design editor', link: 'https://canva.com' },
            { name: 'Adobe Firefly', description: 'AI-powered generative design', link: 'https://www.adobe.com/products/firefly' },
            { name: 'Runway', description: 'AI design and video platform', link: 'https://runwayml.com' },
            { name: 'Looka', description: 'AI logo and branding generator', link: 'https://looka.com' },
            { name: 'Figma AI', description: 'AI features in Figma design tool', link: 'https://figma.com' },
            { name: 'Descript', description: 'AI design for video content', link: 'https://www.descript.com' },
            { name: 'Brandmark', description: 'AI logo design generator', link: 'https://brandmark.io' },
            { name: 'Namelix', description: 'AI business name generator', link: 'https://namelix.com' },
            { name: 'Uizard', description: 'AI UI/UX design tool', link: 'https://uizard.io' }
        ],
        'Vibe Coding': [
            { name: 'Plandex', description: 'Open source AI coding agent for large projects', link: 'https://github.com/plandex-ai/plandex' },
            { name: 'Browser-use', description: 'Make websites accessible for AI agents', link: 'https://github.com/browser-use/browser-use' },
            { name: 'Claude Flow', description: 'Agent orchestration platform for multi-agent workflows', link: 'https://github.com/ruvnet/claude-flow' },
            { name: 'Steel Browser', description: 'Browser API for AI agents and apps', link: 'https://www.steelbrowser.com' },
            { name: 'Nanobrowser', description: 'Open-source Chrome extension for AI web automation', link: 'https://github.com/nanobrowser/nanobrowser' },
            { name: 'Cowork', description: 'Turn Claude into your digital coworker', link: 'https://cowork.com' },
            { name: '1Code', description: 'Open source Cursor-like UI for Claude Code', link: 'https://github.com/1Code-AI/1Code' },
            { name: 'Tonkotsu', description: 'Manage a team of coding agents from a doc', link: 'https://www.tonkotsu.ai' },
            { name: 'Bytebot', description: 'Self-hosted AI desktop agent for computer automation', link: 'https://github.com/bytebot-ai/bytebot' },
            { name: 'Anima', description: 'Design-aware AI for modern product teams with vibe coding', link: 'https://www.animaapp.com' },
            { name: 'Logfire', description: 'AI observability platform for LLM and agent systems', link: 'https://logfire.pydantic.dev' },
            { name: 'Judge0', description: 'Sandboxed code execution system for AI agents', link: 'https://judge0.com' }
        ],
        'App Build': [
            { name: 'PWA Builder', description: 'Build Progressive Web Apps with ease using Microsoft\'s PWA Builder platform', link: 'https://www.pwabuilder.com/' },
            { name: 'Android Studio', description: 'Official IDE for Android app development with powerful tools and emulator', link: 'https://developer.android.com/studio' },
            { name: 'MIT App Inventor', description: 'Visual block-based programming for beginners to create Android apps', link: 'https://appinventor.mit.edu/' },
            { name: 'Firebase', description: 'Backend platform for building web and mobile apps with real-time database', link: 'https://firebase.google.com/' },
            { name: 'React Native', description: 'Build native mobile apps using React and JavaScript for iOS and Android', link: 'https://reactnative.dev/' }
        ],
        'Google Tools': [
            { name: 'Gemini', description: 'Google\'s advanced AI model for text, images, and multimodal tasks', link: 'https://gemini.google.com' },
            { name: 'Bard', description: 'Google\'s conversational AI assistant powered by Gemini', link: 'https://bard.google.com' },
            { name: 'Google Vertex AI', description: 'Fully managed AI platform for building and deploying ML models', link: 'https://cloud.google.com/vertex-ai' },
            { name: 'Google Cloud AI', description: 'Comprehensive AI and ML services in Google Cloud', link: 'https://cloud.google.com/solutions/ai' },
            { name: 'Google Colab', description: 'Free Jupyter notebook environment for data analysis and machine learning', link: 'https://colab.google.com' },
            { name: 'Google Cloud Vision', description: 'AI-powered image analysis and understanding', link: 'https://cloud.google.com/vision' },
            { name: 'Google Cloud NLP', description: 'Natural language processing and text analysis API', link: 'https://cloud.google.com/natural-language' },
            { name: 'Google Cloud Speech-to-Text', description: 'Convert audio to text using AI', link: 'https://cloud.google.com/speech-to-text' },
            { name: 'Google Cloud Text-to-Speech', description: 'Convert text to natural-sounding audio', link: 'https://cloud.google.com/text-to-speech' },
            { name: 'Google Cloud Translation', description: 'AI-powered language translation service', link: 'https://cloud.google.com/translate' },
            { name: 'Firebase ML Kit', description: 'Machine learning SDK for mobile apps', link: 'https://firebase.google.com/docs/ml' },
            { name: 'Google Cloud Document AI', description: 'AI for document processing and data extraction', link: 'https://cloud.google.com/document-ai' }
        ]
    };

    appendLatestPopularTools(toolsDatabase);
    
    const allTools = [];
    for (const [category, tools] of Object.entries(toolsDatabase)) {
        tools.forEach(tool => {
            allTools.push({ ...tool, category });
        });
    }
    return allTools;
}

function displaySearchResults(tools, container) {
    if (tools.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: rgba(255,255,255,0.5);">No tools found</p>';
        return;
    }
    
    container.innerHTML = tools.map(tool => `
        <div class="search-result-item">
            <div class="result-header">
                <h4>${tool.name}</h4>
                <span class="result-category">${tool.category}</span>
            </div>
            <p>${tool.description}</p>
            <a href="${tool.link}" target="_blank" class="result-link">Open Tool →</a>
        </div>
    `).join('');
}

// ========== TYPING EFFECT FOR SUBTITLE ==========
function setupTypingEffect() {
    const subtitle = document.querySelector('.hero p');
    if (!subtitle) return;
    
    const originalText = subtitle.textContent;
    subtitle.textContent = '';
    let charIndex = 0;
    
    function type() {
        if (charIndex < originalText.length) {
            subtitle.textContent += originalText.charAt(charIndex);
            charIndex++;
            setTimeout(type, 50);
        }
    }
    
    // Start typing after page load
    setTimeout(type, 1000);
}

// ========== SCROLL PROGRESS INDICATOR ==========
window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    
    // Create progress bar if doesn't exist
    let progressBar = document.querySelector('.scroll-progress');
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: linear-gradient(90deg, #00ffff, #ff00ff);
            z-index: 10001;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);
    }
    
    progressBar.style.width = scrolled + '%';
});

// ========== CONSOLE EASTER EGG ==========
console.log('%c🚀 AI Tool Kit', 'color: #00ffff; font-size: 24px; font-weight: bold;');
console.log('%cBuilt with ❤️ and AI', 'color: #ff00ff; font-size: 14px;');
console.log('%cWant to contribute? Visit github.com/yourrepo', 'color: #ffff00; font-size: 12px;');

