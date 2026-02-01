const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Link = require('./models/Link');
const User = require('./models/User');

// node seed_official_links.js

// Load env vars
dotenv.config({ path: './.env' });

const officialLinks = [
    // --- AI & ML ---
    {
        title: "OpenAI",
        url: "https://openai.com",
        image: "https://logo.clearbit.com/openai.com",
        category: "AI & ML",
        description: "AI research and deployment company dedicated to ensuring AGI benefits all of humanity.",
        isOfficial: true,
        clicks: 450,
        isPublic: true,
        tags: ["ai", "chatgpt", "research"]
    },
    {
        title: "Hugging Face",
        url: "https://huggingface.co",
        image: "https://logo.clearbit.com/huggingface.co",
        category: "AI & ML",
        description: "The AI community building the future. Build, train and deploy state of the art models.",
        isOfficial: true,
        clicks: 320,
        isPublic: true,
        tags: ["ai", "open source", "models"]
    },
    {
        title: "Midjourney",
        url: "https://www.midjourney.com",
        image: "https://logo.clearbit.com/midjourney.com",
        category: "AI & ML",
        description: "An independent research lab exploring new mediums of thought and expanding the imaginative powers of the human species.",
        isOfficial: true,
        clicks: 280,
        isPublic: true,
        tags: ["generative art", "images", "ai"]
    },
    {
        title: "Runway",
        url: "https://runwayml.com",
        image: "https://logo.clearbit.com/runwayml.com",
        category: "AI & ML",
        description: "Applied AI research to shape the next era of art, entertainment and human creativity.",
        isOfficial: true,
        clicks: 150,
        isPublic: true,
        tags: ["video", "editing", "ai"]
    },
    {
        title: "Jasper",
        url: "https://www.jasper.ai",
        image: "https://logo.clearbit.com/jasper.ai",
        category: "AI & ML",
        description: "AI copywriter and content generator for teams.",
        isOfficial: true,
        clicks: 180,
        isPublic: true,
        tags: ["marketing", "writing", "copy"]
    },
    {
        title: "Stability AI",
        url: "https://stability.ai",
        image: "https://logo.clearbit.com/stability.ai",
        category: "AI & ML",
        description: "Open source generative AI company, creators of Stable Diffusion.",
        isOfficial: true,
        clicks: 210,
        isPublic: true,
        tags: ["open source", "generative", "images"]
    },
    {
        title: "TensorFlow",
        url: "https://www.tensorflow.org",
        image: "https://logo.clearbit.com/tensorflow.org",
        category: "AI & ML",
        description: "An end-to-end open source platform for machine learning.",
        isOfficial: true,
        clicks: 195,
        isPublic: true,
        tags: ["dev", "library", "google"]
    },
    {
        title: "PyTorch",
        url: "https://pytorch.org",
        image: "https://logo.clearbit.com/pytorch.org",
        category: "AI & ML",
        description: "An open source machine learning framework that accelerates the path from research prototyping to production deployment.",
        isOfficial: true,
        clicks: 200,
        isPublic: true,
        tags: ["dev", "framework", "meta"]
    },
    {
        title: "LangChain",
        url: "https://langchain.com",
        image: "https://logo.clearbit.com/langchain.com",
        category: "AI & ML",
        description: "Building applications with LLMs through composability.",
        isOfficial: true,
        clicks: 175,
        isPublic: true,
        tags: ["llm", "dev", "framework"]
    },
    {
        title: "Perplexity AI",
        url: "https://www.perplexity.ai",
        image: "https://logo.clearbit.com/perplexity.ai",
        category: "AI & ML",
        description: "An AI-powered search engine that provides accurate, cited answers to questions.",
        isOfficial: true,
        clicks: 310,
        isPublic: true,
        tags: ["search", "research", "assistant"]
    },
    {
        title: "Anthropic",
        url: "https://www.anthropic.com",
        image: "https://logo.clearbit.com/anthropic.com",
        category: "AI & ML",
        description: "AI research company focused on safety and alignment.",
        isOfficial: true,
        clicks: 120,
        isPublic: true,
        tags: ["ai", "claude", "safety"]
    },
    {
        title: "Cohere",
        url: "https://cohere.com",
        image: "https://logo.clearbit.com/cohere.com",
        category: "AI & ML",
        description: "Enterprise-focused large language model platform.",
        isOfficial: true,
        clicks: 100,
        isPublic: true,
        tags: ["llm", "enterprise", "ai"]
    },
    {
        title: "Mistral AI",
        url: "https://mistral.ai",
        image: "https://logo.clearbit.com/mistral.ai",
        category: "AI & ML",
        description: "Open-weight LLM research lab.",
        isOfficial: true,
        clicks: 90,
        isPublic: true,
        tags: ["open source", "llm"]
    },
    {
        title: "OpenRouter",
        url: "https://openrouter.ai",
        image: "https://logo.clearbit.com/openrouter.ai",
        category: "AI & ML",
        description: "Unified API gateway for AI models.",
        isOfficial: true,
        clicks: 110,
        isPublic: true,
        tags: ["api", "llm", "gateway"]
    },
    {
        title: "Weights & Biases",
        url: "https://wandb.ai",
        image: "https://logo.clearbit.com/wandb.ai",
        category: "AI & ML",
        description: "ML experiment tracking and collaboration.",
        isOfficial: true,
        clicks: 140,
        isPublic: true,
        tags: ["mlops", "tracking"]
    },

    // --- Design ---
    {
        title: "Figma",
        url: "https://www.figma.com",
        image: "https://logo.clearbit.com/figma.com",
        category: "Design",
        description: "Collaborative interface design tool.",
        isOfficial: true,
        clicks: 700,
        isPublic: true,
        tags: ["ui", "ux", "collaboration"]
    },
    {
        title: "Adobe XD",
        url: "https://www.adobe.com/products/xd.html",
        image: "https://logo.clearbit.com/adobe.com",
        category: "Design",
        description: "UI/UX design and prototyping tool.",
        isOfficial: true,
        clicks: 300,
        isPublic: true,
        tags: ["prototype", "adobe"]
    },
    {
        title: "Dribbble",
        url: "https://dribbble.com",
        image: "https://logo.clearbit.com/dribbble.com",
        category: "Design",
        description: "The leading destination to find & showcase creative work and home to the world's best design professionals.",
        isOfficial: true,
        clicks: 400,
        isPublic: true,
        tags: ["inspiration", "portfolio", "community"]
    },
    {
        title: "Behance",
        url: "https://www.behance.net",
        image: "https://logo.clearbit.com/behance.net",
        category: "Design",
        description: "Showcase and discover creative work on the world's largest creative network.",
        isOfficial: true,
        clicks: 380,
        isPublic: true,
        tags: ["portfolio", "adobe", "inspiration"]
    },
    {
        title: "Canva",
        url: "https://www.canva.com",
        image: "https://logo.clearbit.com/canva.com",
        category: "Design",
        description: "Free design tool: presentations, video, social media.",
        isOfficial: true,
        clicks: 500,
        isPublic: true,
        tags: ["graphic design", "easy", "tools"]
    },
    {
        title: "Adobe Creative Cloud",
        url: "https://www.adobe.com/creativecloud.html",
        image: "https://logo.clearbit.com/adobe.com",
        category: "Design",
        description: "A set of applications and services from Adobe Inc. for graphic design, video editing, web development, photography.",
        isOfficial: true,
        clicks: 420,
        isPublic: true,
        tags: ["professional", "tools", "suite"]
    },
    {
        title: "Framer",
        url: "https://www.framer.com",
        image: "https://logo.clearbit.com/framer.com",
        category: "Design",
        description: "Design and publish your dream site. Zero code, maximum speed.",
        isOfficial: true,
        clicks: 250,
        isPublic: true,
        tags: ["web design", "prototyping", "no-code"]
    },
    {
        title: "Sketch",
        url: "https://www.sketch.com",
        image: "https://logo.clearbit.com/sketch.com",
        category: "Design",
        description: "The all-in-one platform for digital design.",
        isOfficial: true,
        clicks: 210,
        isPublic: true,
        tags: ["ui", "vector", "mac"]
    },
    {
        title: "Coolors",
        url: "https://coolors.co",
        image: "https://logo.clearbit.com/coolors.co",
        category: "Design",
        description: "The super fast color palettes generator!",
        isOfficial: true,
        clicks: 300,
        isPublic: true,
        tags: ["colors", "generator", "tools"]
    },
    {
        title: "Unsplash",
        url: "https://unsplash.com",
        image: "https://logo.clearbit.com/unsplash.com",
        category: "Design",
        description: "The internet’s source for visuals. Powered by creators everywhere.",
        isOfficial: true,
        clicks: 410,
        isPublic: true,
        tags: ["photos", "stock", "free"]
    },
    {
        title: "FontAwesome",
        url: "https://fontawesome.com",
        image: "https://logo.clearbit.com/fontawesome.com",
        category: "Design",
        description: "The internet's icon library and toolkit, used by millions of designers, developers, and content creators.",
        isOfficial: true,
        clicks: 350,
        isPublic: true,
        tags: ["icons", "svg", "toolkit"]
    },
    {
        title: "Awwwards",
        url: "https://www.awwwards.com",
        image: "https://logo.clearbit.com/awwwards.com",
        category: "Design",
        description: "The awards that recognize the talent and effort of the best web designers, developers and agencies in the world.",
        isOfficial: true,
        clicks: 290,
        isPublic: true,
        tags: ["awards", "inspiration", "web"]
    },
    {
        title: "InVision",
        url: "https://www.invisionapp.com",
        image: "https://logo.clearbit.com/invisionapp.com",
        category: "Design",
        description: "Digital product design platform.",
        isOfficial: true,
        clicks: 250,
        isPublic: true,
        tags: ["prototype", "collaboration"]
    },
    {
        title: "Affinity Designer",
        url: "https://affinity.serif.com/designer",
        image: "https://logo.clearbit.com/serif.com",
        category: "Design",
        description: "Professional vector graphic design software.",
        isOfficial: true,
        clicks: 180,
        isPublic: true,
        tags: ["vector", "design"]
    },
    {
        title: "Pixlr",
        url: "https://pixlr.com",
        image: "https://logo.clearbit.com/pixlr.com",
        category: "Design",
        description: "Online photo editing tool.",
        isOfficial: true,
        clicks: 200,
        isPublic: true,
        tags: ["photo", "editor"]
    },

    // --- Development ---
    {
        title: "GitHub",
        url: "https://github.com",
        image: "https://logo.clearbit.com/github.com",
        category: "Development",
        description: "The world's leading AI-powered developer platform.",
        isOfficial: true,
        clicks: 800,
        isPublic: true,
        tags: ["git", "code", "collaboration"]
    },
    {
        title: "Stack Overflow",
        url: "https://stackoverflow.com",
        image: "https://logo.clearbit.com/stackoverflow.com",
        category: "Development",
        description: "Where developers learn, share, & build careers.",
        isOfficial: true,
        clicks: 750,
        isPublic: true,
        tags: ["qa", "community", "help"]
    },
    {
        title: "MDN Web Docs",
        url: "https://developer.mozilla.org",
        image: "https://logo.clearbit.com/mozilla.org",
        category: "Development",
        description: "Resources for developers, by developers.",
        isOfficial: true,
        clicks: 600,
        isPublic: true,
        tags: ["documentation", "web", "standards"]
    },
    {
        title: "Docker",
        url: "https://www.docker.com",
        image: "https://logo.clearbit.com/docker.com",
        category: "Development",
        description: "Accelerate how you build, share, and run applications.",
        isOfficial: true,
        clicks: 340,
        isPublic: true,
        tags: ["containers", "devops", "tools"]
    },
    {
        title: "Postman",
        url: "https://www.postman.com",
        image: "https://logo.clearbit.com/postman.com",
        category: "Development",
        description: "An API platform for building and using APIs.",
        isOfficial: true,
        clicks: 310,
        isPublic: true,
        tags: ["api", "testing", "tools"]
    },
    {
        title: "Supabase",
        url: "https://supabase.com",
        image: "https://logo.clearbit.com/supabase.com",
        category: "Development",
        description: "The Open Source Firebase Alternative.",
        isOfficial: true,
        clicks: 220,
        isPublic: true,
        tags: ["database", "backend", "open source"]
    },
    {
        title: "CodePen",
        url: "https://codepen.io",
        image: "https://logo.clearbit.com/codepen.io",
        category: "Development",
        description: "The best place to build, test, and discover front-end code.",
        isOfficial: true,
        clicks: 280,
        isPublic: true,
        tags: ["frontend", "playground", "social"]
    },
    {
        title: "GitLab",
        url: "https://about.gitlab.com",
        image: "https://logo.clearbit.com/gitlab.com",
        category: "Development",
        description: "The most comprehensive AI-powered DevSecOps platform.",
        isOfficial: true,
        clicks: 210,
        isPublic: true,
        tags: ["git", "ci/cd", "devops"]
    },
    {
        title: "VS Code",
        url: "https://code.visualstudio.com",
        image: "https://logo.clearbit.com/visualstudio.com",
        category: "Development",
        description: "Code editing. Redefined.",
        isOfficial: true,
        clicks: 550,
        isPublic: true,
        tags: ["editor", "ide", "microsoft"]
    },
    {
        title: "npm",
        url: "https://www.npmjs.com",
        image: "https://logo.clearbit.com/npmjs.com",
        category: "Development",
        description: "Build amazing things. The repository for JavaScript.",
        isOfficial: true,
        clicks: 480,
        isPublic: true,
        tags: ["javascript", "packages", "node"]
    },
    {
        title: "Bitbucket",
        url: "https://bitbucket.org",
        image: "https://logo.clearbit.com/bitbucket.org",
        category: "Development",
        description: "Git repository management by Atlassian.",
        isOfficial: true,
        clicks: 200,
        isPublic: true,
        tags: ["git", "repos"]
    },
    {
        title: "Heroku",
        url: "https://www.heroku.com",
        image: "https://logo.clearbit.com/heroku.com",
        category: "Development",
        description: "Cloud platform for deploying apps.",
        isOfficial: true,
        clicks: 250,
        isPublic: true,
        tags: ["paas", "deployment"]
    },
    {
        title: "Vercel",
        url: "https://vercel.com",
        image: "https://logo.clearbit.com/vercel.com",
        category: "Development",
        description: "Frontend cloud platform for web apps.",
        isOfficial: true,
        clicks: 400,
        isPublic: true,
        tags: ["frontend", "hosting"]
    },
    {
        title: "Netlify",
        url: "https://www.netlify.com",
        image: "https://logo.clearbit.com/netlify.com",
        category: "Development",
        description: "Build and deploy modern web projects.",
        isOfficial: true,
        clicks: 380,
        isPublic: true,
        tags: ["hosting", "ci/cd"]
    },
    {
        title: "Firebase",
        url: "https://firebase.google.com",
        image: "https://logo.clearbit.com/google.com",
        category: "Development",
        description: "Google’s backend platform for apps.",
        isOfficial: true,
        clicks: 600,
        isPublic: true,
        tags: ["backend", "database"]
    },

    // --- Productivity ---
    {
        title: "Trello",
        url: "https://trello.com",
        image: "https://logo.clearbit.com/trello.com",
        category: "Productivity",
        description: "Collaborate, manage projects, and reach new productivity peaks.",
        isOfficial: true,
        clicks: 300,
        isPublic: true,
        tags: ["kanban", "management", "atlassian"]
    },
    {
        title: "Asana",
        url: "https://asana.com",
        image: "https://logo.clearbit.com/asana.com",
        category: "Productivity",
        description: "Track, manage, and connect your projects across any team.",
        isOfficial: true,
        clicks: 280,
        isPublic: true,
        tags: ["management", "tasks", "team"]
    },
    {
        title: "ClickUp",
        url: "https://clickup.com",
        image: "https://logo.clearbit.com/clickup.com",
        category: "Productivity",
        description: "One app to replace them all.",
        isOfficial: true,
        clicks: 290,
        isPublic: true,
        tags: ["all-in-one", "tasks", "docs"]
    },
    {
        title: "Obsidian",
        url: "https://obsidian.md",
        image: "https://logo.clearbit.com/obsidian.md",
        category: "Productivity",
        description: "A second brain, for you, forever.",
        isOfficial: true,
        clicks: 250,
        isPublic: true,
        tags: ["notes", "knowledge", "local"]
    },
    {
        title: "Todoist",
        url: "https://todoist.com",
        image: "https://logo.clearbit.com/todoist.com",
        category: "Productivity",
        description: "The world's #1 task manager and to-do list app.",
        isOfficial: true,
        clicks: 270,
        isPublic: true,
        tags: ["tasks", "personal", "list"]
    },
    {
        title: "Evernote",
        url: "https://evernote.com",
        image: "https://logo.clearbit.com/evernote.com",
        category: "Productivity",
        description: "Tame your work, organize your life.",
        isOfficial: true,
        clicks: 220,
        isPublic: true,
        tags: ["notes", "archive", "classic"]
    },
    {
        title: "Google Workspace",
        url: "https://workspace.google.com",
        image: "https://logo.clearbit.com/google.com",
        category: "Productivity",
        description: "Innovative tools that help you work, learn, and lead.",
        isOfficial: true,
        clicks: 600,
        isPublic: true,
        tags: ["suite", "email", "docs"]
    },
    {
        title: "Microsoft 365",
        url: "https://www.office.com",
        image: "https://logo.clearbit.com/office.com",
        category: "Productivity",
        description: "Productivity apps and cloud services.",
        isOfficial: true,
        clicks: 580,
        isPublic: true,
        tags: ["office", "suite", "enterprise"]
    },
    {
        title: "Calendly",
        url: "https://calendly.com",
        image: "https://logo.clearbit.com/calendly.com",
        category: "Productivity",
        description: "Easy scheduling ahead.",
        isOfficial: true,
        clicks: 310,
        isPublic: true,
        tags: ["scheduling", "calendar", "meetings"]
    },
    {
        title: "Pocket",
        url: "https://getpocket.com",
        image: "https://logo.clearbit.com/getpocket.com",
        category: "Productivity",
        description: "Save the best stories to read later.",
        isOfficial: true,
        clicks: 180,
        isPublic: true,
        tags: ["reading", "save", "bookmarks"]
    },

    // --- Marketing ---
    {
        title: "HubSpot",
        url: "https://www.hubspot.com",
        image: "https://logo.clearbit.com/hubspot.com",
        category: "Marketing",
        description: "Marketing, sales, and service software that helps your business grow without compromise.",
        isOfficial: true,
        clicks: 340,
        isPublic: true,
        tags: ["crm", "inbound", "automation"]
    },
    {
        title: "Mailchimp",
        url: "https://mailchimp.com",
        image: "https://logo.clearbit.com/mailchimp.com",
        category: "Marketing",
        description: "Turn emails into revenue.",
        isOfficial: true,
        clicks: 310,
        isPublic: true,
        tags: ["email", "newsletters", "ads"]
    },
    {
        title: "Google Analytics",
        url: "https://analytics.google.com",
        image: "https://logo.clearbit.com/google.com",
        category: "Marketing",
        description: "Get a deeper understanding of your customers.",
        isOfficial: true,
        clicks: 500,
        isPublic: true,
        tags: ["analytics", "data", "traffic"]
    },
    {
        title: "SEMrush",
        url: "https://www.semrush.com",
        image: "https://logo.clearbit.com/semrush.com",
        category: "Marketing",
        description: "Online visibility management and content marketing SaaS platform.",
        isOfficial: true,
        clicks: 260,
        isPublic: true,
        tags: ["seo", "keyword", "audit"]
    },
    {
        title: "Ahrefs",
        url: "https://ahrefs.com",
        image: "https://logo.clearbit.com/ahrefs.com",
        category: "Marketing",
        description: "Everything you need to rank higher & get more traffic.",
        isOfficial: true,
        clicks: 275,
        isPublic: true,
        tags: ["seo", "backlinks", "content"]
    },
    {
        title: "Buffer",
        url: "https://buffer.com",
        image: "https://logo.clearbit.com/buffer.com",
        category: "Marketing",
        description: "Grow your audience on social media.",
        isOfficial: true,
        clicks: 230,
        isPublic: true,
        tags: ["social media", "scheduling", "organic"]
    },
    {
        title: "Hootsuite",
        url: "https://www.hootsuite.com",
        image: "https://logo.clearbit.com/hootsuite.com",
        category: "Marketing",
        description: "Social media marketing and management tool.",
        isOfficial: true,
        clicks: 220,
        isPublic: true,
        tags: ["social media", "enterprise", "dashboard"]
    },
    {
        title: "Moz",
        url: "https://moz.com",
        image: "https://logo.clearbit.com/moz.com",
        category: "Marketing",
        description: "SEO software and data to help you increase traffic, rankings, and visibility in search results.",
        isOfficial: true,
        clicks: 200,
        isPublic: true,
        tags: ["seo", "community", "tools"]
    },
    {
        title: "Typeform",
        url: "https://www.typeform.com",
        image: "https://logo.clearbit.com/typeform.com",
        category: "Marketing",
        description: "People-friendly forms and surveys.",
        isOfficial: true,
        clicks: 240,
        isPublic: true,
        tags: ["forms", "surveys", "feedback"]
    },
    {
        title: "Sprout Social",
        url: "https://sproutsocial.com",
        image: "https://logo.clearbit.com/sproutsocial.com",
        category: "Marketing",
        description: "A powerful, all-in-one social media management platform.",
        isOfficial: true,
        clicks: 190,
        isPublic: true,
        tags: ["social", "analytics", "business"]
    },

    // --- Content Creation ---
    {
        title: "YouTube Studio",
        url: "https://studio.youtube.com",
        image: "https://logo.clearbit.com/youtube.com",
        category: "Content Creation",
        description: "Manage your YouTube channel and grow your community.",
        isOfficial: true,
        clicks: 800,
        isPublic: true,
        tags: ["video", "creator", "analytics"]
    },
    {
        title: "Twitch",
        url: "https://www.twitch.tv",
        image: "https://logo.clearbit.com/twitch.tv",
        category: "Content Creation",
        description: "Interactive livestreaming service for content spanning gaming, entertainment, sports, music, and more.",
        isOfficial: true,
        clicks: 600,
        isPublic: true,
        tags: ["streaming", "live", "gaming"]
    },
    {
        title: "OBS Studio",
        url: "https://obsproject.com",
        image: "https://logo.clearbit.com/obsproject.com",
        category: "Content Creation",
        description: "Free and open source software for video recording and live streaming.",
        isOfficial: true,
        clicks: 450,
        isPublic: true,
        tags: ["software", "streaming", "recording"]
    },
    {
        title: "Descript",
        url: "https://www.descript.com",
        image: "https://logo.clearbit.com/descript.com",
        category: "Content Creation",
        description: "There's a new way to make video and podcasts. A good way.",
        isOfficial: true,
        clicks: 220,
        isPublic: true,
        tags: ["editing", "transcription", "ai"]
    },
    {
        title: "Kapwing",
        url: "https://www.kapwing.com",
        image: "https://logo.clearbit.com/kapwing.com",
        category: "Content Creation",
        description: "Collaborative online video editor.",
        isOfficial: true,
        clicks: 210,
        isPublic: true,
        tags: ["video", "editor", "online"]
    },
    {
        title: "Audacity",
        url: "https://www.audacityteam.org",
        image: "https://logo.clearbit.com/audacityteam.org",
        category: "Content Creation",
        description: "Free, open source, cross-platform audio software.",
        isOfficial: true,
        clicks: 300,
        isPublic: true,
        tags: ["audio", "recording", "open source"]
    },
    {
        title: "Medium",
        url: "https://medium.com",
        image: "https://logo.clearbit.com/medium.com",
        category: "Content Creation",
        description: "Where good ideas find you.",
        isOfficial: true,
        clicks: 400,
        isPublic: true,
        tags: ["blogging", "writing", "platform"]
    },
    {
        title: "Substack",
        url: "https://substack.com",
        image: "https://logo.clearbit.com/substack.com",
        category: "Content Creation",
        description: "The home for great writing.",
        isOfficial: true,
        clicks: 350,
        isPublic: true,
        tags: ["newsletter", "monetization", "writing"]
    },
    {
        title: "WordPress",
        url: "https://wordpress.org",
        image: "https://logo.clearbit.com/wordpress.org",
        category: "Content Creation",
        description: "Open source software you can use to create a beautiful website, blog, or app.",
        isOfficial: true,
        clicks: 600,
        isPublic: true,
        tags: ["cms", "blog", "web"]
    },
    {
        title: "Vimeo",
        url: "https://vimeo.com",
        image: "https://logo.clearbit.com/vimeo.com",
        category: "Content Creation",
        description: "Simple tools for you and your team to create, manage and share high-quality videos.",
        isOfficial: true,
        clicks: 250,
        isPublic: true,
        tags: ["video", "hosting", "professional"]
    },

    // --- Collaboration ---
    {
        title: "Slack",
        url: "https://slack.com",
        image: "https://logo.clearbit.com/slack.com",
        category: "Collaboration",
        description: "Made for people. Built for productivity.",
        isOfficial: true,
        clicks: 650,
        isPublic: true,
        tags: ["chat", "messaging", "work"]
    },
    {
        title: "Discord",
        url: "https://discord.com",
        image: "https://logo.clearbit.com/discord.com",
        category: "Collaboration",
        description: "Your place to talk and hang out.",
        isOfficial: true,
        clicks: 700,
        isPublic: true,
        tags: ["community", "chat", "voice"]
    },
    {
        title: "Zoom",
        url: "https://zoom.us",
        image: "https://logo.clearbit.com/zoom.us",
        category: "Collaboration",
        description: "One platform to connect.",
        isOfficial: true,
        clicks: 750,
        isPublic: true,
        tags: ["video conferencing", "meetings", "webinar"]
    },
    {
        title: "Microsoft Teams",
        url: "https://www.microsoft.com/en-us/microsoft-teams/group-chat-software",
        image: "https://logo.clearbit.com/microsoft.com",
        category: "Collaboration",
        description: "Meet, chat, call, and collaborate in just one place.",
        isOfficial: true,
        clicks: 680,
        isPublic: true,
        tags: ["enterprise", "chat", "suite"]
    },
    {
        title: "Miro",
        url: "https://miro.com",
        image: "https://logo.clearbit.com/miro.com",
        category: "Collaboration",
        description: "The visual collaboration platform for every team.",
        isOfficial: true,
        clicks: 320,
        isPublic: true,
        tags: ["whiteboard", "brainstorming", "visual"]
    },
    {
        title: "Loom",
        url: "https://www.loom.com",
        image: "https://logo.clearbit.com/loom.com",
        category: "Collaboration",
        description: "Video messaging for work.",
        isOfficial: true,
        clicks: 290,
        isPublic: true,
        tags: ["video", "async", "screen recording"]
    },
    {
        title: "Dropbox",
        url: "https://www.dropbox.com",
        image: "https://logo.clearbit.com/dropbox.com",
        category: "Collaboration",
        description: "Keep life organized and work moving.",
        isOfficial: true,
        clicks: 400,
        isPublic: true,
        tags: ["storage", "cloud", "sharing"]
    },
    {
        title: "Box",
        url: "https://www.box.com",
        image: "https://logo.clearbit.com/box.com",
        category: "Collaboration",
        description: "The Content Cloud: One secure platform for managing the entire content journey.",
        isOfficial: true,
        clicks: 210,
        isPublic: true,
        tags: ["storage", "enterprise", "secure"]
    },
    {
        title: "WeTransfer",
        url: "https://wetransfer.com",
        image: "https://logo.clearbit.com/wetransfer.com",
        category: "Collaboration",
        description: "The simplest way to send your files around the world.",
        isOfficial: true,
        clicks: 350,
        isPublic: true,
        tags: ["file sharing", "transfer", "simple"]
    },
    {
        title: "Google Meet",
        url: "https://meet.google.com",
        image: "https://logo.clearbit.com/google.com",
        category: "Collaboration",
        description: "Premium video meetings and conferencing.",
        isOfficial: true,
        clicks: 620,
        isPublic: true,
        tags: ["video", "google", "meetings"]
    },

    // --- Business ---
    {
        title: "LinkedIn",
        url: "https://www.linkedin.com",
        image: "https://logo.clearbit.com/linkedin.com",
        category: "Business",
        description: "Manage your professional identity. Build and engage with your professional network.",
        isOfficial: true,
        clicks: 900,
        isPublic: true,
        tags: ["networking", "careers", "social"]
    },
    {
        title: "Crunchbase",
        url: "https://www.crunchbase.com",
        image: "https://logo.clearbit.com/crunchbase.com",
        category: "Business",
        description: "Discover innovative companies and the people behind them.",
        isOfficial: true,
        clicks: 310,
        isPublic: true,
        tags: ["startups", "data", "funding"]
    },
    {
        title: "Y Combinator",
        url: "https://www.ycombinator.com",
        image: "https://logo.clearbit.com/ycombinator.com",
        category: "Business",
        description: "Provides seed funding for startups.",
        isOfficial: true,
        clicks: 450,
        isPublic: true,
        tags: ["accelerator", "startups", "vc"]
    },
    {
        title: "AngelList",
        url: "https://angel.co",
        image: "https://logo.clearbit.com/angel.co",
        category: "Business",
        description: "The world's largest startup community.",
        isOfficial: true,
        clicks: 280,
        isPublic: true,
        tags: ["investing", "jobs", "startups"]
    },
    {
        title: "Product Hunt",
        url: "https://www.producthunt.com",
        image: "https://logo.clearbit.com/producthunt.com",
        category: "Business",
        description: "The best new products in tech.",
        isOfficial: true,
        clicks: 390,
        isPublic: true,
        tags: ["launch", "discovery", "tech"]
    },
    {
        title: "Gartner",
        url: "https://www.gartner.com",
        image: "https://logo.clearbit.com/gartner.com",
        category: "Business",
        description: "Delivering actionable, objective insight to executives and their teams.",
        isOfficial: true,
        clicks: 180,
        isPublic: true,
        tags: ["research", "consulting", "enterprise"]
    },
    {
        title: "Bloomberg",
        url: "https://www.bloomberg.com",
        image: "https://logo.clearbit.com/bloomberg.com",
        category: "Business",
        description: "Business and financial news.",
        isOfficial: true,
        clicks: 420,
        isPublic: true,
        tags: ["news", "finance", "global"]
    },
    {
        title: "Forbes",
        url: "https://www.forbes.com",
        image: "https://logo.clearbit.com/forbes.com",
        category: "Business",
        description: "Global media company, focusing on business, investing, technology, entrepreneurship.",
        isOfficial: true,
        clicks: 400,
        isPublic: true,
        tags: ["magazine", "news", "wealth"]
    },
    {
        title: "HBR",
        url: "https://hbr.org",
        image: "https://logo.clearbit.com/hbr.org",
        category: "Business",
        description: "Harvard Business Review - Ideas and advice for leaders.",
        isOfficial: true,
        clicks: 250,
        isPublic: true,
        tags: ["journal", "management", "learning"]
    },
    {
        title: "DocuSign",
        url: "https://www.docusign.com",
        image: "https://logo.clearbit.com/docusign.com",
        category: "Business",
        description: "The World's #1 Way to Agree.",
        isOfficial: true,
        clicks: 300,
        isPublic: true,
        tags: ["contracts", "esignature", "legal"]
    },

    // --- No-Code ---
    {
        title: "Webflow",
        url: "https://webflow.com",
        image: "https://logo.clearbit.com/webflow.com",
        category: "No-Code",
        description: "Build with the power of code — without writing any.",
        isOfficial: true,
        clicks: 380,
        isPublic: true,
        tags: ["website builder", "design", "cms"]
    },
    {
        title: "Bubble",
        url: "https://bubble.io",
        image: "https://logo.clearbit.com/bubble.io",
        category: "No-Code",
        description: "The best way to build web apps without code.",
        isOfficial: true,
        clicks: 320,
        isPublic: true,
        tags: ["app builder", "visual", "development"]
    },
    {
        title: "Zapier",
        url: "https://zapier.com",
        image: "https://logo.clearbit.com/zapier.com",
        category: "No-Code",
        description: "The #1 workflow automation platform.",
        isOfficial: true,
        clicks: 450,
        isPublic: true,
        tags: ["automation", "integration", "workflow"]
    },
    {
        title: "Airtable",
        url: "https://www.airtable.com",
        image: "https://logo.clearbit.com/airtable.com",
        category: "No-Code",
        description: "Connect your data, workflows, and teams.",
        isOfficial: true,
        clicks: 360,
        isPublic: true,
        tags: ["database", "spreadsheet", "automation"]
    },
    {
        title: "Make",
        url: "https://www.make.com",
        image: "https://logo.clearbit.com/make.com",
        category: "No-Code",
        description: "Design, build, and automate anything with your work flows.",
        isOfficial: true,
        clicks: 280,
        isPublic: true,
        tags: ["automation", "integromat", "visual"]
    },
    {
        title: "Softr",
        url: "https://www.softr.io",
        image: "https://logo.clearbit.com/softr.io",
        category: "No-Code",
        description: "Build custom apps for your business, as easy as legos.",
        isOfficial: true,
        clicks: 200,
        isPublic: true,
        tags: ["client portal", "airtable", "builder"]
    },
    {
        title: "Glide",
        url: "https://www.glideapps.com",
        image: "https://logo.clearbit.com/glideapps.com",
        category: "No-Code",
        description: "Create the software your business needs.",
        isOfficial: true,
        clicks: 210,
        isPublic: true,
        tags: ["mobile apps", "sheets", "internal tools"]
    },
    {
        title: "Adalo",
        url: "https://www.adalo.com",
        image: "https://logo.clearbit.com/adalo.com",
        category: "No-Code",
        description: "Build apps to the App Store and Play Store without code.",
        isOfficial: true,
        clicks: 190,
        isPublic: true,
        tags: ["mobile", "native", "builder"]
    },
    {
        title: "Carrd",
        url: "https://carrd.co",
        image: "https://logo.clearbit.com/carrd.co",
        category: "No-Code",
        description: "Simple, free, fully responsive one-page sites for pretty much anything.",
        isOfficial: true,
        clicks: 260,
        isPublic: true,
        tags: ["landing page", "simple", "website"]
    },
    {
        title: "Gumroad",
        url: "https://gumroad.com",
        image: "https://logo.clearbit.com/gumroad.com",
        category: "No-Code",
        description: "Go from zero to $1 on the internet.",
        isOfficial: true,
        clicks: 310,
        isPublic: true,
        tags: ["ecommerce", "creators", "sales"]
    },

    // --- Data & Analytics ---
    {
        title: "Tableau",
        url: "https://www.tableau.com",
        image: "https://logo.clearbit.com/tableau.com",
        category: "Data & Analytics",
        description: "Visual analytics platform transforming the way we use data to solve problems.",
        isOfficial: true,
        clicks: 290,
        isPublic: true,
        tags: ["visualization", "bi", "enterprise"]
    },
    {
        title: "Power BI",
        url: "https://powerbi.microsoft.com",
        image: "https://logo.clearbit.com/microsoft.com",
        category: "Data & Analytics",
        description: "Turn data into opportunity with Microsoft Power BI.",
        isOfficial: true,
        clicks: 350,
        isPublic: true,
        tags: ["microsoft", "bi", "reporting"]
    },
    {
        title: "Snowflake",
        url: "https://www.snowflake.com",
        image: "https://logo.clearbit.com/snowflake.com",
        category: "Data & Analytics",
        description: "The Data Cloud.",
        isOfficial: true,
        clicks: 220,
        isPublic: true,
        tags: ["cloud", "warehouse", "data"]
    },
    {
        title: "Databricks",
        url: "https://www.databricks.com",
        image: "https://logo.clearbit.com/databricks.com",
        category: "Data & Analytics",
        description: "Combine the best of data warehouses and data lakes.",
        isOfficial: true,
        clicks: 200,
        isPublic: true,
        tags: ["lakehouse", "ai", "spark"]
    },
    {
        title: "Mixpanel",
        url: "https://mixpanel.com",
        image: "https://logo.clearbit.com/mixpanel.com",
        category: "Data & Analytics",
        description: "Product analytics for mobile, web, and more.",
        isOfficial: true,
        clicks: 240,
        isPublic: true,
        tags: ["product", "analytics", "tracking"]
    },
    {
        title: "Looker",
        url: "https://looker.com",
        image: "https://logo.clearbit.com/looker.com",
        category: "Data & Analytics",
        description: "A business intelligence software and big data analytics platform.",
        isOfficial: true,
        clicks: 180,
        isPublic: true,
        tags: ["google", "bi", "cloud"]
    },
    {
        title: "Segment",
        url: "https://segment.com",
        image: "https://logo.clearbit.com/segment.com",
        category: "Data & Analytics",
        description: "The leading Customer Data Platform (CDP).",
        isOfficial: true,
        clicks: 210,
        isPublic: true,
        tags: ["cdp", "integration", "customer data"]
    },
    {
        title: "Amplitude",
        url: "https://amplitude.com",
        image: "https://logo.clearbit.com/amplitude.com",
        category: "Data & Analytics",
        description: "Digital optimization system.",
        isOfficial: true,
        clicks: 190,
        isPublic: true,
        tags: ["product", "growth", "analytics"]
    },
    {
        title: "Kaggle",
        url: "https://www.kaggle.com",
        image: "https://logo.clearbit.com/kaggle.com",
        category: "Data & Analytics",
        description: "The world's largest data science community with powerful tools and resources.",
        isOfficial: true,
        clicks: 400,
        isPublic: true,
        tags: ["data science", "datasets", "competition"]
    },
    {
        title: "Splunk",
        url: "https://www.splunk.com",
        image: "https://logo.clearbit.com/splunk.com",
        category: "Data & Analytics",
        description: "The Data-to-Everything Platform.",
        isOfficial: true,
        clicks: 170,
        isPublic: true,
        tags: ["logs", "monitoring", "security"]
    },

    // --- Security ---
    {
        title: "1Password",
        url: "https://1password.com",
        image: "https://logo.clearbit.com/1password.com",
        category: "Security",
        description: "Password Manager for Families, Businesses, Teams.",
        isOfficial: true,
        clicks: 320,
        isPublic: true,
        tags: ["passwords", "privacy", "secure"]
    },
    {
        title: "Auth0",
        url: "https://auth0.com",
        image: "https://logo.clearbit.com/auth0.com",
        category: "Security",
        description: "Secure access for everyone. But not just anyone.",
        isOfficial: true,
        clicks: 280,
        isPublic: true,
        tags: ["authentication", "identity", "dev"]
    },
    {
        title: "Cloudflare",
        url: "https://www.cloudflare.com",
        image: "https://logo.clearbit.com/cloudflare.com",
        category: "Security",
        description: "The Web Performance & Security Company.",
        isOfficial: true,
        clicks: 450,
        isPublic: true,
        tags: ["cdn", "ddos", "dns"]
    },
    {
        title: "Have I Been Pwned",
        url: "https://haveibeenpwned.com",
        image: "https://logo.clearbit.com/haveibeenpwned.com",
        category: "Security",
        description: "Check if your email or phone is in a data breach.",
        isOfficial: true,
        clicks: 500,
        isPublic: true,
        tags: ["breach", "check", "info"]
    },
    {
        title: "NordVPN",
        url: "https://nordvpn.com",
        image: "https://logo.clearbit.com/nordvpn.com",
        category: "Security",
        description: "Best VPN Service. Online Security Starts with a Click.",
        isOfficial: true,
        clicks: 350,
        isPublic: true,
        tags: ["vpn", "privacy", "internet"]
    },
    {
        title: "LastPass",
        url: "https://www.lastpass.com",
        image: "https://logo.clearbit.com/lastpass.com",
        category: "Security",
        description: "Password Manager, Auto Form Filler, Random Password Generator.",
        isOfficial: true,
        clicks: 300,
        isPublic: true,
        tags: ["passwords", "manager", "vault"]
    },
    {
        title: "Wireshark",
        url: "https://www.wireshark.org",
        image: "https://logo.clearbit.com/wireshark.org",
        category: "Security",
        description: "The world's most popular network protocol analyzer.",
        isOfficial: true,
        clicks: 220,
        isPublic: true,
        tags: ["network", "analysis", "open source"]
    },
    {
        title: "Yubico",
        url: "https://www.yubico.com",
        image: "https://logo.clearbit.com/yubico.com",
        category: "Security",
        description: "Hardware security keys for strong two-factor authentication.",
        isOfficial: true,
        clicks: 190,
        isPublic: true,
        tags: ["hardware", "2fa", "key"]
    },
    {
        title: "ProtonMail",
        url: "https://proton.me/mail",
        image: "https://logo.clearbit.com/proton.me",
        category: "Security",
        description: "Secure email based in Switzerland.",
        isOfficial: true,
        clicks: 270,
        isPublic: true,
        tags: ["email", "encrypted", "privacy"]
    },
    {
        title: "CrowdStrike",
        url: "https://www.crowdstrike.com",
        image: "https://logo.clearbit.com/crowdstrike.com",
        category: "Security",
        description: "Cloud-native endpoint protection platform.",
        isOfficial: true,
        clicks: 150,
        isPublic: true,
        tags: ["cybersecurity", "enterprise", "endpoint"]
    },

    // --- Sales ---
    {
        title: "Salesforce",
        url: "https://www.salesforce.com",
        image: "https://logo.clearbit.com/salesforce.com",
        category: "Sales",
        description: "The world's #1 CRM.",
        isOfficial: true,
        clicks: 500,
        isPublic: true,
        tags: ["crm", "enterprise", "cloud"]
    },
    {
        title: "Pipedrive",
        url: "https://www.pipedrive.com",
        image: "https://logo.clearbit.com/pipedrive.com",
        category: "Sales",
        description: "The first CRM designed by salespeople, for salespeople.",
        isOfficial: true,
        clicks: 240,
        isPublic: true,
        tags: ["crm", "pipeline", "sme"]
    },
    {
        title: "Gong",
        url: "https://www.gong.io",
        image: "https://logo.clearbit.com/gong.io",
        category: "Sales",
        description: "Revenue Intelligence Platform.",
        isOfficial: true,
        clicks: 210,
        isPublic: true,
        tags: ["intelligence", "analytics", "calls"]
    },
    {
        title: "Outreach",
        url: "https://www.outreach.io",
        image: "https://logo.clearbit.com/outreach.io",
        category: "Sales",
        description: "Sales Execution Platform.",
        isOfficial: true,
        clicks: 190,
        isPublic: true,
        tags: ["engagement", "automation", "b2b"]
    },
    {
        title: "Apollo.io",
        url: "https://www.apollo.io",
        image: "https://logo.clearbit.com/apollo.io",
        category: "Sales",
        description: "Find and contact your ideal buyers.",
        isOfficial: true,
        clicks: 280,
        isPublic: true,
        tags: ["leads", "database", "prospecting"]
    },
    {
        title: "Zoho CRM",
        url: "https://www.zoho.com/crm",
        image: "https://logo.clearbit.com/zoho.com",
        category: "Sales",
        description: "Convert more leads, engage with customers, and grow your revenue.",
        isOfficial: true,
        clicks: 300,
        isPublic: true,
        tags: ["crm", "suite", "affordable"]
    },
    {
        title: "Hunter",
        url: "https://hunter.io",
        image: "https://logo.clearbit.com/hunter.io",
        category: "Sales",
        description: "Find professional email addresses in seconds.",
        isOfficial: true,
        clicks: 260,
        isPublic: true,
        tags: ["email", "finder", "tools"]
    },
    {
        title: "Lusha",
        url: "https://www.lusha.com",
        image: "https://logo.clearbit.com/lusha.com",
        category: "Sales",
        description: "B2B database for sales and marketing.",
        isOfficial: true,
        clicks: 230,
        isPublic: true,
        tags: ["data", "contacts", "b2b"]
    },
    {
        title: "PandaDoc",
        url: "https://www.pandadoc.com",
        image: "https://logo.clearbit.com/pandadoc.com",
        category: "Sales",
        description: "Create, approve, track, and eSign documents faster.",
        isOfficial: true,
        clicks: 210,
        isPublic: true,
        tags: ["proposals", "documents", "closing"]
    },
    {
        title: "Lemlist",
        url: "https://www.lemlist.com",
        image: "https://logo.clearbit.com/lemlist.com",
        category: "Sales",
        description: "Cold email software aimed at building relationships.",
        isOfficial: true,
        clicks: 180,
        isPublic: true,
        tags: ["email", "outreach", "cold"]
    },

    // --- Finance ---
    {
        title: "Stripe",
        url: "https://stripe.com",
        image: "https://logo.clearbit.com/stripe.com",
        category: "Finance",
        description: "Financial infrastructure platform for the internet.",
        isOfficial: true,
        clicks: 600,
        isPublic: true,
        tags: ["payments", "api", "business"]
    },
    {
        title: "PayPal",
        url: "https://www.paypal.com",
        image: "https://logo.clearbit.com/paypal.com",
        category: "Finance",
        description: "The safer, easier way to pay online.",
        isOfficial: true,
        clicks: 800,
        isPublic: true,
        tags: ["payments", "wallet", "global"]
    },
    {
        title: "Wise",
        url: "https://wise.com",
        image: "https://logo.clearbit.com/wise.com",
        category: "Finance",
        description: "The cheap, fast way to send money abroad.",
        isOfficial: true,
        clicks: 400,
        isPublic: true,
        tags: ["transfer", "currency", "banking"]
    },
    {
        title: "QuickBooks",
        url: "https://quickbooks.intuit.com",
        image: "https://logo.clearbit.com/intuit.com",
        category: "Finance",
        description: "Accounting software for small businesses.",
        isOfficial: true,
        clicks: 350,
        isPublic: true,
        tags: ["accounting", "bookkeeping", "tax"]
    },
    {
        title: "Xero",
        url: "https://www.xero.com",
        image: "https://logo.clearbit.com/xero.com",
        category: "Finance",
        description: "Beautiful business and accounting software.",
        isOfficial: true,
        clicks: 280,
        isPublic: true,
        tags: ["accounting", "cloud", "business"]
    },
    {
        title: "Revolut",
        url: "https://www.revolut.com",
        image: "https://logo.clearbit.com/revolut.com",
        category: "Finance",
        description: "One app for all things money.",
        isOfficial: true,
        clicks: 320,
        isPublic: true,
        tags: ["banking", "app", "travel"]
    },
    {
        title: "Robinhood",
        url: "https://robinhood.com",
        image: "https://logo.clearbit.com/robinhood.com",
        category: "Finance",
        description: "Commission-free stock trading & investing app.",
        isOfficial: true,
        clicks: 450,
        isPublic: true,
        tags: ["investing", "stocks", "trading"]
    },
    {
        title: "Mint",
        url: "https://mint.intuit.com",
        image: "https://logo.clearbit.com/mint.com",
        category: "Finance",
        description: "Personal finance and budgeting.",
        isOfficial: true,
        clicks: 390,
        isPublic: true,
        tags: ["budgeting", "personal", "tracking"]
    },
    {
        title: "Expensify",
        url: "https://www.expensify.com",
        image: "https://logo.clearbit.com/expensify.com",
        category: "Finance",
        description: "One-click expense reporting.",
        isOfficial: true,
        clicks: 210,
        isPublic: true,
        tags: ["expenses", "business", "receipts"]
    },
    {
        title: "Brex",
        url: "https://www.brex.com",
        image: "https://logo.clearbit.com/brex.com",
        category: "Finance",
        description: "Corporate cards and spend management.",
        isOfficial: true,
        clicks: 230,
        isPublic: true,
        tags: ["credit card", "startup", "banking"]
    },

    // --- Education ---
    {
        title: "Coursera",
        url: "https://www.coursera.org",
        image: "https://logo.clearbit.com/coursera.org",
        category: "Education",
        description: "Build skills with courses, certificates, and degrees online from world-class universities.",
        isOfficial: true,
        clicks: 550,
        isPublic: true,
        tags: ["courses", "university", "learning"]
    },
    {
        title: "Udemy",
        url: "https://www.udemy.com",
        image: "https://logo.clearbit.com/udemy.com",
        category: "Education",
        description: "Online courses - Learn anything, on your schedule.",
        isOfficial: true,
        clicks: 520,
        isPublic: true,
        tags: ["courses", "skills", "marketplace"]
    },
    {
        title: "Khan Academy",
        url: "https://www.khanacademy.org",
        image: "https://logo.clearbit.com/khanacademy.org",
        category: "Education",
        description: "Free Online Courses, Lessons & Practice.",
        isOfficial: true,
        clicks: 600,
        isPublic: true,
        tags: ["free", "k12", "nonprofit"]
    },
    {
        title: "edX",
        url: "https://www.edx.org",
        image: "https://logo.clearbit.com/edx.org",
        category: "Education",
        description: "Access 2000+ free online courses from 140 leading institutions worldwide.",
        isOfficial: true,
        clicks: 400,
        isPublic: true,
        tags: ["university", "courses", "certificates"]
    },
    {
        title: "Duolingo",
        url: "https://www.duolingo.com",
        image: "https://logo.clearbit.com/duolingo.com",
        category: "Education",
        description: "The world's best way to learn a language.",
        isOfficial: true,
        clicks: 700,
        isPublic: true,
        tags: ["language", "gamification", "app"]
    },
    {
        title: "freeCodeCamp",
        url: "https://www.freecodecamp.org",
        image: "https://logo.clearbit.com/freecodecamp.org",
        category: "Education",
        description: "Learn to code for free.",
        isOfficial: true,
        clicks: 550,
        isPublic: true,
        tags: ["coding", "free", "community"]
    },
    {
        title: "Codecademy",
        url: "https://www.codecademy.com",
        image: "https://logo.clearbit.com/codecademy.com",
        category: "Education",
        description: "Learn to code interactively, for free.",
        isOfficial: true,
        clicks: 480,
        isPublic: true,
        tags: ["coding", "interactive", "pro"]
    },
    {
        title: "MasterClass",
        url: "https://www.masterclass.com",
        image: "https://logo.clearbit.com/masterclass.com",
        category: "Education",
        description: "Learn from the best.",
        isOfficial: true,
        clicks: 320,
        isPublic: true,
        tags: ["celebrity", "video", "skills"]
    },
    {
        title: "Pluralsight",
        url: "https://www.pluralsight.com",
        image: "https://logo.clearbit.com/pluralsight.com",
        category: "Education",
        description: "The technology workforce development company.",
        isOfficial: true,
        clicks: 250,
        isPublic: true,
        tags: ["tech", "skills", "training"]
    },
    {
        title: "Quizlet",
        url: "https://quizlet.com",
        image: "https://logo.clearbit.com/quizlet.com",
        category: "Education",
        description: "Learning tools and flashcards, for free.",
        isOfficial: true,
        clicks: 410,
        isPublic: true,
        tags: ["study", "flashcards", "students"]
    },
    {
        title: "Udacity",
        url: "https://www.udacity.com",
        image: "https://logo.clearbit.com/udacity.com",
        category: "Education",
        description: "Nanodegree programs in tech fields.",
        isOfficial: true,
        clicks: 300,
        isPublic: true,
        tags: ["tech", "nanodegree"]
    },
    {
        title: "MIT OpenCourseWare",
        url: "https://ocw.mit.edu",
        image: "https://logo.clearbit.com/mit.edu",
        category: "Education",
        description: "Free MIT course materials.",
        isOfficial: true,
        clicks: 500,
        isPublic: true,
        tags: ["free", "university"]
    },
    {
        title: "Google Digital Garage",
        url: "https://learndigital.withgoogle.com/digitalgarage",
        image: "https://logo.clearbit.com/google.com",
        category: "Education",
        description: "Free digital marketing courses.",
        isOfficial: true,
        clicks: 350,
        isPublic: true,
        tags: ["marketing", "certification"]
    },
    {
        title: "W3Schools",
        url: "https://www.w3schools.com",
        image: "https://logo.clearbit.com/w3schools.com",
        category: "Education",
        description: "Web development tutorials.",
        isOfficial: true,
        clicks: 800,
        isPublic: true,
        tags: ["html", "css", "js"]
    },
    {
        title: "LeetCode",
        url: "https://leetcode.com",
        image: "https://logo.clearbit.com/leetcode.com",
        category: "Education",
        description: "Coding interview practice platform.",
        isOfficial: true,
        clicks: 900,
        isPublic: true,
        tags: ["coding", "dsa"]
    },

    // --- E-commerce ---
    {
        title: "Shopify",
        url: "https://www.shopify.com",
        image: "https://logo.clearbit.com/shopify.com",
        category: "E-commerce",
        description: "The all-in-one commerce platform to start, run, and grow a business.",
        isOfficial: true,
        clicks: 580,
        isPublic: true,
        tags: ["store", "builder", "business"]
    },
    {
        title: "WooCommerce",
        url: "https://woocommerce.com",
        image: "https://logo.clearbit.com/woocommerce.com",
        category: "E-commerce",
        description: "The most customizable open-source eCommerce platform for WordPress.",
        isOfficial: true,
        clicks: 420,
        isPublic: true,
        tags: ["wordpress", "open source", "plugin"]
    },
    {
        title: "BigCommerce",
        url: "https://www.bigcommerce.com",
        image: "https://logo.clearbit.com/bigcommerce.com",
        category: "E-commerce",
        description: "Open SaaS ecommerce platform for fast-growing and established brands.",
        isOfficial: true,
        clicks: 210,
        isPublic: true,
        tags: ["enterprise", "saas", "store"]
    },
    {
        title: "Amazon Seller",
        url: "https://sell.amazon.com",
        image: "https://logo.clearbit.com/amazon.com",
        category: "E-commerce",
        description: "Sell on Amazon with the Seller Central portal.",
        isOfficial: true,
        clicks: 700,
        isPublic: true,
        tags: ["marketplace", "retail", "global"]
    },
    {
        title: "Etsy",
        url: "https://www.etsy.com",
        image: "https://logo.clearbit.com/etsy.com",
        category: "E-commerce",
        description: "Shop for handmade, vintage, custom, and unique gifts.",
        isOfficial: true,
        clicks: 650,
        isPublic: true,
        tags: ["handmade", "marketplace", "crafts"]
    },
    {
        title: "Magento",
        url: "https://business.adobe.com/products/magento/magento-commerce.html",
        image: "https://logo.clearbit.com/magento.com",
        category: "E-commerce",
        description: "Flexible, scalable eCommerce solutions.",
        isOfficial: true,
        clicks: 250,
        isPublic: true,
        tags: ["enterprise", "adobe", "open source"]
    },
    {
        title: "Wix eCommerce",
        url: "https://www.wix.com/ecommerce",
        image: "https://logo.clearbit.com/wix.com",
        category: "E-commerce",
        description: "Create your own online store.",
        isOfficial: true,
        clicks: 390,
        isPublic: true,
        tags: ["builder", "easy", "store"]
    },
    {
        title: "Printful",
        url: "https://www.printful.com",
        image: "https://logo.clearbit.com/printful.com",
        category: "E-commerce",
        description: "On-demand printing and warehousing fulfillment.",
        isOfficial: true,
        clicks: 300,
        isPublic: true,
        tags: ["dropshipping", "print", "merch"]
    },
    {
        title: "Oberlo",
        url: "https://www.oberlo.com",
        image: "https://logo.clearbit.com/oberlo.com",
        category: "E-commerce",
        description: "Dropshipping made easy.",
        isOfficial: true,
        clicks: 280,
        isPublic: true,
        tags: ["dropshipping", "shopify", "sourcing"]
    },
    {
        title: "Squarespace",
        url: "https://www.squarespace.com",
        image: "https://logo.clearbit.com/squarespace.com",
        category: "E-commerce",
        description: "Website builder with ecommerce features.",
        isOfficial: true,
        clicks: 410,
        isPublic: true,
        tags: ["design", "store", "builder"]
    },

    // --- Customer Support ---
    {
        title: "Zendesk",
        url: "https://www.zendesk.com",
        image: "https://logo.clearbit.com/zendesk.com",
        category: "Customer Support",
        description: "Champions of customer service.",
        isOfficial: true,
        clicks: 330,
        isPublic: true,
        tags: ["helpdesk", "tickets", "enterprise"]
    },
    {
        title: "Intercom",
        url: "https://www.intercom.com",
        image: "https://logo.clearbit.com/intercom.com",
        category: "Customer Support",
        description: "The best way to connect with your customers.",
        isOfficial: true,
        clicks: 310,
        isPublic: true,
        tags: ["chat", "bot", "messaging"]
    },
    {
        title: "Freshdesk",
        url: "https://freshdesk.com",
        image: "https://logo.clearbit.com/freshdesk.com",
        category: "Customer Support",
        description: "Customer service software by Freshworks.",
        isOfficial: true,
        clicks: 260,
        isPublic: true,
        tags: ["tickets", "support", "cloud"]
    },
    {
        title: "Drift",
        url: "https://www.drift.com",
        image: "https://logo.clearbit.com/drift.com",
        category: "Customer Support",
        description: "Conversational Marketing and Sales.",
        isOfficial: true,
        clicks: 240,
        isPublic: true,
        tags: ["chat", "marketing", "leads"]
    },
    {
        title: "Help Scout",
        url: "https://www.helpscout.com",
        image: "https://logo.clearbit.com/helpscout.com",
        category: "Customer Support",
        description: "Simple customer service software.",
        isOfficial: true,
        clicks: 220,
        isPublic: true,
        tags: ["email", "shared inbox", "team"]
    },
    {
        title: "Tidio",
        url: "https://www.tidio.com",
        image: "https://logo.clearbit.com/tidio.com",
        category: "Customer Support",
        description: "Live Chat and Chatbots for your website.",
        isOfficial: true,
        clicks: 200,
        isPublic: true,
        tags: ["chat", "bots", "small business"]
    },
    {
        title: "Crisp",
        url: "https://crisp.chat",
        image: "https://logo.clearbit.com/crisp.chat",
        category: "Customer Support",
        description: "The business messaging platform for startups and SMBs.",
        isOfficial: true,
        clicks: 180,
        isPublic: true,
        tags: ["chat", "free", "messaging"]
    },
    {
        title: "Gorgias",
        url: "https://www.gorgias.com",
        image: "https://logo.clearbit.com/gorgias.com",
        category: "Customer Support",
        description: "Ecommerce helpdesk for Shopify, Magento and BigCommerce.",
        isOfficial: true,
        clicks: 190,
        isPublic: true,
        tags: ["ecommerce", "shopify", "helpdesk"]
    },
    {
        title: "LiveChat",
        url: "https://www.livechat.com",
        image: "https://logo.clearbit.com/livechat.com",
        category: "Customer Support",
        description: "Customer service platform that delights your customers and fuels your sales.",
        isOfficial: true,
        clicks: 210,
        isPublic: true,
        tags: ["chat", "support", "sales"]
    },
    {
        title: "UserVoice",
        url: "https://www.uservoice.com",
        image: "https://logo.clearbit.com/uservoice.com",
        category: "Customer Support",
        description: "Product feedback management software.",
        isOfficial: true,
        clicks: 150,
        isPublic: true,
        tags: ["feedback", "product", "roadmap"]
    },

    // --- HR & Hiring ---
    {
        title: "Indeed",
        url: "https://www.indeed.com",
        image: "https://logo.clearbit.com/indeed.com",
        category: "HR & Hiring",
        description: "Job Search | Indeed.",
        isOfficial: true,
        clicks: 800,
        isPublic: true,
        tags: ["jobs", "search", "hiring"]
    },
    {
        title: "Glassdoor",
        url: "https://www.glassdoor.com",
        image: "https://logo.clearbit.com/glassdoor.com",
        category: "HR & Hiring",
        description: "Search jobs and see what employees say about companies.",
        isOfficial: true,
        clicks: 500,
        isPublic: true,
        tags: ["reviews", "salaries", "jobs"]
    },
    {
        title: "Greenhouse",
        url: "https://www.greenhouse.io",
        image: "https://logo.clearbit.com/greenhouse.io",
        category: "HR & Hiring",
        description: "Talent acquisition software.",
        isOfficial: true,
        clicks: 280,
        isPublic: true,
        tags: ["ats", "recruiting", "enterprise"]
    },
    {
        title: "Workday",
        url: "https://www.workday.com",
        image: "https://logo.clearbit.com/workday.com",
        category: "HR & Hiring",
        description: "Enterprise management cloud for finance and HR.",
        isOfficial: true,
        clicks: 350,
        isPublic: true,
        tags: ["enterprise", "hcm", "finance"]
    },
    {
        title: "BambooHR",
        url: "https://www.bamboohr.com",
        image: "https://logo.clearbit.com/bamboohr.com",
        category: "HR & Hiring",
        description: "HR software for small and medium businesses.",
        isOfficial: true,
        clicks: 290,
        isPublic: true,
        tags: ["hris", "sme", "people"]
    },
    {
        title: "Deel",
        url: "https://www.deel.com",
        image: "https://logo.clearbit.com/deel.com",
        category: "HR & Hiring",
        description: "Payroll and compliance for international teams.",
        isOfficial: true,
        clicks: 310,
        isPublic: true,
        tags: ["remote", "payroll", "global"]
    },
    {
        title: "Remote",
        url: "https://remote.com",
        image: "https://logo.clearbit.com/remote.com",
        category: "HR & Hiring",
        description: "Global HR solutions for distributed teams.",
        isOfficial: true,
        clicks: 260,
        isPublic: true,
        tags: ["eor", "global", "remote"]
    },
    {
        title: "Upwork",
        url: "https://www.upwork.com",
        image: "https://logo.clearbit.com/upwork.com",
        category: "HR & Hiring",
        description: "The world's work marketplace.",
        isOfficial: true,
        clicks: 650,
        isPublic: true,
        tags: ["freelance", "contractors", "hiring"]
    },
    {
        title: "Fiverr",
        url: "https://www.fiverr.com",
        image: "https://logo.clearbit.com/fiverr.com",
        category: "HR & Hiring",
        description: "Freelance services marketplace.",
        isOfficial: true,
        clicks: 620,
        isPublic: true,
        tags: ["gigs", "freelance", "services"]
    },
    {
        title: "Lever",
        url: "https://www.lever.co",
        image: "https://logo.clearbit.com/lever.co",
        category: "HR & Hiring",
        description: "Talent acquisition suite.",
        isOfficial: true,
        clicks: 220,
        isPublic: true,
        tags: ["ats", "recruiting", "hiring"]
    },

    // --- Legal ---
    {
        title: "LegalZoom",
        url: "https://www.legalzoom.com",
        image: "https://logo.clearbit.com/legalzoom.com",
        category: "Legal",
        description: "Online legal help for business and family.",
        isOfficial: true,
        clicks: 380,
        isPublic: true,
        tags: ["incorporation", "documents", "help"]
    },
    {
        title: "Rocket Lawyer",
        url: "https://www.rocketlawyer.com",
        image: "https://logo.clearbit.com/rocketlawyer.com",
        category: "Legal",
        description: "Affordable legal services, free legal documents.",
        isOfficial: true,
        clicks: 340,
        isPublic: true,
        tags: ["contracts", "advice", "forms"]
    },
    {
        title: "Ironclad",
        url: "https://ironcladapp.com",
        image: "https://logo.clearbit.com/ironcladapp.com",
        category: "Legal",
        description: "Digital contracting platform.",
        isOfficial: true,
        clicks: 180,
        isPublic: true,
        tags: ["contracts", "enterprise", "automation"]
    },
    {
        title: "Clio",
        url: "https://www.clio.com",
        image: "https://logo.clearbit.com/clio.com",
        category: "Legal",
        description: "Legal practice management software.",
        isOfficial: true,
        clicks: 220,
        isPublic: true,
        tags: ["lawyers", "practice", "management"]
    },
    {
        title: "TermsFeed",
        url: "https://www.termsfeed.com",
        image: "https://logo.clearbit.com/termsfeed.com",
        category: "Legal",
        description: "Generator of Privacy Policies, Terms & Conditions.",
        isOfficial: true,
        clicks: 250,
        isPublic: true,
        tags: ["compliance", "generator", "privacy"]
    },
    {
        title: "HelloSign",
        url: "https://www.hellosign.com",
        image: "https://logo.clearbit.com/hellosign.com",
        category: "Legal",
        description: "Secure and legally binding eSignatures.",
        isOfficial: true,
        clicks: 290,
        isPublic: true,
        tags: ["esignature", "dropbox", "documents"]
    },
    {
        title: "Justia",
        url: "https://www.justia.com",
        image: "https://logo.clearbit.com/justia.com",
        category: "Legal",
        description: "Legal information and lawyer directory.",
        isOfficial: true,
        clicks: 300,
        isPublic: true,
        tags: ["directory", "resources", "free"]
    },
    {
        title: "FindLaw",
        url: "https://www.findlaw.com",
        image: "https://logo.clearbit.com/findlaw.com",
        category: "Legal",
        description: "Trusted legal information, lawyers and legal forms.",
        isOfficial: true,
        clicks: 280,
        isPublic: true,
        tags: ["search", "info", "lawyers"]
    },
    {
        title: "Nolo",
        url: "https://www.nolo.com",
        image: "https://logo.clearbit.com/nolo.com",
        category: "Legal",
        description: "Legal encyclopedia, books, forms, and software.",
        isOfficial: true,
        clicks: 260,
        isPublic: true,
        tags: ["diy", "books", "resources"]
    },
    {
        title: "Avvo",
        url: "https://www.avvo.com",
        image: "https://logo.clearbit.com/avvo.com",
        category: "Legal",
        description: "Find a lawyer and get legal advice.",
        isOfficial: true,
        clicks: 270,
        isPublic: true,
        tags: ["directory", "ratings", "advice"]
    },

    // --- Web3 & Crypto ---
    {
        title: "Bitcoin",
        url: "https://bitcoin.org",
        image: "https://logo.clearbit.com/bitcoin.org",
        category: "Web3 & Crypto",
        description: "Open source P2P money.",
        isOfficial: true,
        clicks: 900,
        isPublic: true,
        tags: ["crypto", "blockchain", "currency"]
    },
    {
        title: "Ethereum",
        url: "https://ethereum.org",
        image: "https://logo.clearbit.com/ethereum.org",
        category: "Web3 & Crypto",
        description: "Home of the Ethereum blockchain.",
        isOfficial: true,
        clicks: 850,
        isPublic: true,
        tags: ["smart contracts", "blockchain", "dapps"]
    },
    {
        title: "MetaMask",
        url: "https://metamask.io",
        image: "https://logo.clearbit.com/metamask.io",
        category: "Web3 & Crypto",
        description: "A crypto wallet & gateway to blockchain apps.",
        isOfficial: true,
        clicks: 700,
        isPublic: true,
        tags: ["wallet", "web3", "browser"]
    },
    {
        title: "OpenSea",
        url: "https://opensea.io",
        image: "https://logo.clearbit.com/opensea.io",
        category: "Web3 & Crypto",
        description: "The world's first and largest digital marketplace for crypto collectibles and NFTs.",
        isOfficial: true,
        clicks: 650,
        isPublic: true,
        tags: ["nft", "marketplace", "collectibles"]
    },
    {
        title: "Coinbase",
        url: "https://www.coinbase.com",
        image: "https://logo.clearbit.com/coinbase.com",
        category: "Web3 & Crypto",
        description: "Buy, sell, and manage your cryptocurrency portfolio.",
        isOfficial: true,
        clicks: 800,
        isPublic: true,
        tags: ["exchange", "wallet", "trading"]
    },
    {
        title: "Binance",
        url: "https://www.binance.com",
        image: "https://logo.clearbit.com/binance.com",
        category: "Web3 & Crypto",
        description: "The world's leading blockchain ecosystem.",
        isOfficial: true,
        clicks: 750,
        isPublic: true,
        tags: ["exchange", "global", "trading"]
    },
    {
        title: "Uniswap",
        url: "https://uniswap.org",
        image: "https://logo.clearbit.com/uniswap.org",
        category: "Web3 & Crypto",
        description: "Swap, earn, and build on the leading decentralized crypto trading protocol.",
        isOfficial: true,
        clicks: 500,
        isPublic: true,
        tags: ["defi", "dex", "swap"]
    },
    {
        title: "Solana",
        url: "https://solana.com",
        image: "https://logo.clearbit.com/solana.com",
        category: "Web3 & Crypto",
        description: "Powerful for developers. Fast for everyone.",
        isOfficial: true,
        clicks: 450,
        isPublic: true,
        tags: ["blockchain", "fast", "layer1"]
    },
    {
        title: "Polygon",
        url: "https://polygon.technology",
        image: "https://logo.clearbit.com/polygon.technology",
        category: "Web3 & Crypto",
        description: "Ethereum's Internet of Blockchains.",
        isOfficial: true,
        clicks: 400,
        isPublic: true,
        tags: ["scaling", "ethereum", "l2"]
    },
    {
        title: "Chainlink",
        url: "https://chain.link",
        image: "https://logo.clearbit.com/chain.link",
        category: "Web3 & Crypto",
        description: "Connect the world to blockchains.",
        isOfficial: true,
        clicks: 350,
        isPublic: true,
        tags: ["oracle", "infrastructure", "smart contracts"]
    },

    // --- Utilities ---
    {
        title: "Google Translate",
        url: "https://translate.google.com",
        image: "https://logo.clearbit.com/google.com",
        category: "Utilities",
        description: "Instantly translate text, web pages, and files.",
        isOfficial: true,
        clicks: 950,
        isPublic: true,
        tags: ["language", "tool", "google"]
    },
    {
        title: "Speedtest",
        url: "https://www.speedtest.net",
        image: "https://logo.clearbit.com/speedtest.net",
        category: "Utilities",
        description: "Test your internet connection speed.",
        isOfficial: true,
        clicks: 800,
        isPublic: true,
        tags: ["internet", "test", "network"]
    },
    {
        title: "TinyPNG",
        url: "https://tinypng.com",
        image: "https://logo.clearbit.com/tinypng.com",
        category: "Utilities",
        description: "Smart WebP, PNG and JPEG compression.",
        isOfficial: true,
        clicks: 450,
        isPublic: true,
        tags: ["image", "optimization", "compress"]
    },
    {
        title: "Archive.org",
        url: "https://archive.org",
        image: "https://logo.clearbit.com/archive.org",
        category: "Utilities",
        description: "Internet Archive: Digital Library.",
        isOfficial: true,
        clicks: 600,
        isPublic: true,
        tags: ["history", "wayback machine", "library"]
    },
    {
        title: "Whois",
        url: "https://www.whois.com",
        image: "https://logo.clearbit.com/whois.com",
        category: "Utilities",
        description: "Whois Lookup, Domain Availability & IP Search.",
        isOfficial: true,
        clicks: 300,
        isPublic: true,
        tags: ["domain", "dns", "lookup"]
    },
    {
        title: "Calculator.net",
        url: "https://www.calculator.net",
        image: "https://logo.clearbit.com/calculator.net",
        category: "Utilities",
        description: "Free online calculators for everything.",
        isOfficial: true,
        clicks: 400,
        isPublic: true,
        tags: ["math", "finance", "tools"]
    },
    {
        title: "Time.is",
        url: "https://time.is",
        image: "https://logo.clearbit.com/time.is",
        category: "Utilities",
        description: "Exact time for any time zone.",
        isOfficial: true,
        clicks: 350,
        isPublic: true,
        tags: ["clock", "timezone", "world"]
    },
    {
        title: "Weather.com",
        url: "https://weather.com",
        image: "https://logo.clearbit.com/weather.com",
        category: "Utilities",
        description: "Weather forecasts and news.",
        isOfficial: true,
        clicks: 700,
        isPublic: true,
        tags: ["weather", "forecast", "news"]
    },
    {
        title: "Google Maps",
        url: "https://maps.google.com",
        image: "https://logo.clearbit.com/google.com",
        category: "Utilities",
        description: "Find local businesses, view maps and get driving directions.",
        isOfficial: true,
        clicks: 980,
        isPublic: true,
        tags: ["navigation", "gps", "travel"]
    },
    {
        title: "Remove.bg",
        url: "https://www.remove.bg",
        image: "https://logo.clearbit.com/remove.bg",
        category: "Utilities",
        description: "Remove Image Background for free.",
        isOfficial: true,
        clicks: 500,
        isPublic: true,
        tags: ["image", "editing", "ai"]
    },

    // --- Other ---
    {
        title: "Reddit",
        url: "https://www.reddit.com",
        image: "https://logo.clearbit.com/reddit.com",
        category: "Other",
        description: "Dive into anything.",
        isOfficial: true,
        clicks: 950,
        isPublic: true,
        tags: ["social", "community", "forum"]
    },
    {
        title: "Wikipedia",
        url: "https://www.wikipedia.org",
        image: "https://logo.clearbit.com/wikipedia.org",
        category: "Other",
        description: "The free encyclopedia.",
        isOfficial: true,
        clicks: 990,
        isPublic: true,
        tags: ["reference", "education", "wiki"]
    },
    {
        title: "IMDb",
        url: "https://www.imdb.com",
        image: "https://logo.clearbit.com/imdb.com",
        category: "Other",
        description: "Ratings, Reviews, and Where to Watch the Best Movies & TV Shows.",
        isOfficial: true,
        clicks: 800,
        isPublic: true,
        tags: ["movies", "tv", "database"]
    },
    {
        title: "TripAdvisor",
        url: "https://www.tripadvisor.com",
        image: "https://logo.clearbit.com/tripadvisor.com",
        category: "Other",
        description: "Read reviews, compare prices & book.",
        isOfficial: true,
        clicks: 600,
        isPublic: true,
        tags: ["travel", "hotels", "reviews"]
    },
    {
        title: "Yelp",
        url: "https://www.yelp.com",
        image: "https://logo.clearbit.com/yelp.com",
        category: "Other",
        description: "User Reviews and Recommendations of Best Restaurants, Shopping, Nightlife.",
        isOfficial: true,
        clicks: 550,
        isPublic: true,
        tags: ["local", "reviews", "food"]
    },
    {
        title: "Eventbrite",
        url: "https://www.eventbrite.com",
        image: "https://logo.clearbit.com/eventbrite.com",
        category: "Other",
        description: "Discover Great Events or Create Your Own & Sell Tickets.",
        isOfficial: true,
        clicks: 400,
        isPublic: true,
        tags: ["events", "tickets", "local"]
    },
    {
        title: "Patreon",
        url: "https://www.patreon.com",
        image: "https://logo.clearbit.com/patreon.com",
        category: "Other",
        description: "Membership platform for creators.",
        isOfficial: true,
        clicks: 350,
        isPublic: true,
        tags: ["creators", "funding", "membership"]
    },
    {
        title: "Kickstarter",
        url: "https://www.kickstarter.com",
        image: "https://logo.clearbit.com/kickstarter.com",
        category: "Other",
        description: "Crowdfunding platform for creative projects.",
        isOfficial: true,
        clicks: 380,
        isPublic: true,
        tags: ["crowdfunding", "startups", "projects"]
    },
    {
        title: "GoFundMe",
        url: "https://www.gofundme.com",
        image: "https://logo.clearbit.com/gofundme.com",
        category: "Other",
        description: "The #1 fundraising platform for everything.",
        isOfficial: true,
        clicks: 420,
        isPublic: true,
        tags: ["fundraising", "charity", "personal"]
    },
    {
        title: "Pinterest",
        url: "https://www.pinterest.com",
        image: "https://logo.clearbit.com/pinterest.com",
        category: "Other",
        description: "Discover recipes, home ideas, style inspiration and other ideas to try.",
        isOfficial: true,
        clicks: 750,
        isPublic: true,
        tags: ["visual", "inspiration", "social"]
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');

        // Find an admin user to assign these links to (or just the first user found)
        // Optionally, you can create a dedicated 'admin' account here if needed.
        const adminUser = await User.findOne();

        if (!adminUser) {
            console.log('No users found. Please register a user first to assign links to.');
            process.exit(1);
        }

        console.log(`Assigning official links to user: ${adminUser.username}`);

        // OPTION 1: Clear existing official links to avoid duplicates
        await Link.deleteMany({ isOfficial: true });
        console.log('Cleared existing official links...');

        // Add User ID to links and update images to use Google's Favicon Service
        const linksWithUser = officialLinks.map(link => {
            try {
                const hostname = new URL(link.url).hostname;
                return {
                    ...link,
                    image: `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`,
                    user: adminUser._id
                };
            } catch (error) {
                console.warn(`Invalid URL for ${link.title}: ${link.url}`);
                return {
                    ...link,
                    user: adminUser._id
                };
            }
        });

        await Link.insertMany(linksWithUser);
        console.log('Official Links Seeded Successfully!');

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
