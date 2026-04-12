/**
 * AI Question Bank — covers AI/LLM topics aligned with
 * foundation (预科), international year one (国际大一), and study group curricula.
 *
 * Each question has: category, difficulty, question, options, correctIndex, explanation, resource link.
 */

const questions = [
  // ===== Category: AI Fundamentals (AI 基础) =====
  {
    id: 1,
    category: "AI Fundamentals",
    categoryZh: `AI 基础`,
    difficulty: "beginner",
    question: "What does LLM stand for?",
    questionZh: `LLM 代表什么？`,
    options: ["Large Language Model", "Linear Learning Machine", "Logical Language Method", "Long-term Learning Memory"],
    correctIndex: 0,
    explanation: "LLM stands for Large Language Model — AI systems trained on massive text datasets to understand and generate human language. Examples include GPT-4, Claude, and Gemini.",
    explanationZh: `LLM 代表 Large Language Model（大型语言模型）— 在大量文本数据上训练的 AI 系统，能够理解和生成人类语言。例如 GPT-4、Claude 和 Gemini。`,
    resource: "https://en.wikipedia.org/wiki/Large_language_model"
  },
  {
    id: 2,
    category: "AI Fundamentals",
    categoryZh: `AI 基础`,
    difficulty: "beginner",
    question: "Which of the following is NOT a type of machine learning?",
    questionZh: `以下哪个不是机器学习的类型？`,
    options: ["Supervised Learning", "Unsupervised Learning", "Reinforcement Learning", "Descriptive Learning"],
    correctIndex: 3,
    explanation: "The three main types of machine learning are: Supervised (labeled data), Unsupervised (unlabeled data), and Reinforcement (reward-based). 'Descriptive Learning' is not a standard ML category.",
    explanationZh: `机器学习的三种主要类型是：监督学习（标记数据）、无监督学习（未标记数据）和强化学习（基于奖励）。"描述性学习"不是标准的 ML 类别。`,
    resource: "https://www.coursera.org/articles/types-of-machine-learning"
  },
  {
    id: 3,
    category: "AI Fundamentals",
    categoryZh: `AI 基础`,
    difficulty: "beginner",
    question: "What is a 'neural network' inspired by?",
    questionZh: `神经网络的设计灵感来自什么？`,
    options: ["Computer circuits", "The human brain", "The internet", "Quantum physics"],
    correctIndex: 1,
    explanation: "Neural networks are inspired by the structure of the human brain — interconnected neurons that process and transmit information.",
    explanationZh: `神经网络的灵感来自人脑的结构——相互连接的神经元处理和传输信息。`,
    resource: "https://www.ibm.com/think/topics/neural-networks"
  },
  {
    id: 4,
    category: "AI Fundamentals",
    categoryZh: `AI 基础`,
    difficulty: "intermediate",
    question: "What is 'training data' in AI?",
    questionZh: `AI 中的"训练数据"是什么？`,
    options: ["Data the AI generates", "Data used to teach the AI model patterns", "Data stored after AI makes predictions", "Data used only for testing"],
    correctIndex: 1,
    explanation: "Training data is the dataset fed to an AI model so it can learn patterns, relationships, and rules. The quality and size of training data directly affects model performance.",
    explanationZh: `训练数据是提供给 AI 模型的数据集，使其能够学习模式、关系和规则。训练数据的质量和大小直接影响模型性能。`,
    resource: "https://www.coursera.org/articles/training-data"
  },
  {
    id: 5,
    category: "AI Fundamentals",
    categoryZh: `AI 基础`,
    difficulty: "intermediate",
    question: "What is the 'Transformer' architecture mainly known for?",
    questionZh: `Transformer 架构主要以什么闻名？`,
    options: ["Image recognition", "Self-attention mechanism for processing sequences", "Robotic control", "Database management"],
    correctIndex: 1,
    explanation: "The Transformer architecture (introduced in 'Attention Is All You Need', 2017) uses self-attention to process all parts of a sequence simultaneously, making it the foundation of GPT, BERT, Claude, and most modern LLMs.",
    explanationZh: `Transformer 架构（2017 年论文《Attention Is All You Need》）使用自注意力机制同时处理序列的所有部分，是 GPT、BERT、Claude 和大多数现代 LLM 的基础。`,
    resource: "https://en.wikipedia.org/wiki/Transformer_(deep_learning_architecture)"
  },

  // ===== Category: Prompt Engineering (提示词工程) =====
  {
    id: 6,
    category: "Prompt Engineering",
    categoryZh: `提示词工程`,
    difficulty: "beginner",
    question: "What is 'prompt engineering'?",
    questionZh: `什么是"提示词工程"？`,
    options: ["Building AI hardware", "Crafting effective inputs to get better AI outputs", "Programming in Python", "Designing computer chips"],
    correctIndex: 1,
    explanation: "Prompt engineering is the practice of designing and refining the text inputs (prompts) given to LLMs to produce more accurate, relevant, and useful outputs.",
    explanationZh: `提示词工程是设计和优化提供给 LLM 的文本输入（提示词），以获得更准确、相关和有用的输出的实践。`,
    resource: "https://www.coursera.org/articles/what-is-prompt-engineering"
  },
  {
    id: 7,
    category: "Prompt Engineering",
    categoryZh: `提示词工程`,
    difficulty: "intermediate",
    question: "What is 'few-shot prompting'?",
    questionZh: `什么是"少样本提示"？`,
    options: ["Giving the AI very little computing power", "Providing a few examples in the prompt to guide the AI's response", "Training the AI on a small dataset", "Asking the AI only one question"],
    correctIndex: 1,
    explanation: "Few-shot prompting means including a few examples of the desired input-output format in your prompt, so the AI understands the pattern you want it to follow.",
    explanationZh: `少样本提示是在提示词中包含几个期望的输入-输出格式示例，让 AI 理解你希望它遵循的模式。`,
    resource: "https://www.promptingguide.ai/techniques/fewshot"
  },
  {
    id: 8,
    category: "Prompt Engineering",
    categoryZh: `提示词工程`,
    difficulty: "intermediate",
    question: "What does 'Chain of Thought' (CoT) prompting do?",
    questionZh: `思维链（CoT）提示有什么作用？`,
    options: ["Makes the AI respond faster", "Encourages the AI to show its reasoning step-by-step", "Connects multiple AI models together", "Reduces the AI's memory usage"],
    correctIndex: 1,
    explanation: "Chain of Thought prompting asks the AI to 'think step by step', which significantly improves accuracy on math, logic, and reasoning tasks.",
    explanationZh: `思维链提示要求 AI "逐步思考"，这显著提高了数学、逻辑和推理任务的准确性。`,
    resource: "https://www.promptingguide.ai/techniques/cot"
  },

  // ===== Category: AI Tools & Applications (AI 工具与应用) =====
  {
    id: 9,
    category: "AI Tools & Applications",
    categoryZh: `AI 工具与应用`,
    difficulty: "beginner",
    question: "Which of the following is an AI chatbot?",
    questionZh: `以下哪个是 AI 聊天机器人？`,
    options: ["Microsoft Excel", "ChatGPT", "Adobe Photoshop", "Google Sheets"],
    correctIndex: 1,
    explanation: "ChatGPT (by OpenAI) is one of the most well-known AI chatbots, powered by GPT large language models. Other examples include Claude (Anthropic) and Gemini (Google).",
    explanationZh: `ChatGPT（OpenAI）是最知名的 AI 聊天机器人之一，由 GPT 大型语言模型驱动。其他例子包括 Claude（Anthropic）和 Gemini（Google）。`,
    resource: "https://openai.com/chatgpt"
  },
  {
    id: 10,
    category: "AI Tools & Applications",
    categoryZh: `AI 工具与应用`,
    difficulty: "beginner",
    question: "What can AI image generators like DALL-E and Midjourney do?",
    questionZh: `像 DALL-E 和 Midjourney 这样的 AI 图像生成器能做什么？`,
    options: ["Only edit existing photos", "Create new images from text descriptions", "Only recognize objects in photos", "Only compress image files"],
    correctIndex: 1,
    explanation: "AI image generators create brand-new images from text prompts (text-to-image). You describe what you want, and the AI generates it visually.",
    explanationZh: `AI 图像生成器根据文本提示创建全新的图像（文本到图像）。你描述你想要什么，AI 就会可视化地生成它。`,
    resource: "https://openai.com/dall-e"
  },
  {
    id: 11,
    category: "AI Tools & Applications",
    categoryZh: `AI 工具与应用`,
    difficulty: "intermediate",
    question: "What is RAG (Retrieval-Augmented Generation)?",
    questionZh: `什么是 RAG（检索增强生成）？`,
    options: ["A type of computer virus", "A technique that lets AI retrieve external documents before generating answers", "A programming language", "A social media algorithm"],
    correctIndex: 1,
    explanation: "RAG combines retrieval (searching a knowledge base) with generation (LLM output). This lets AI answer questions using up-to-date or private data it wasn't trained on.",
    explanationZh: `RAG 将检索（搜索知识库）与生成（LLM 输出）相结合。这使 AI 能够使用它未经训练的最新或私有数据来回答问题。`,
    resource: "https://aws.amazon.com/what-is/retrieval-augmented-generation/"
  },

  // ===== Category: AI Ethics & Safety (AI 伦理与安全) =====
  {
    id: 12,
    category: "AI Ethics & Safety",
    categoryZh: `AI 伦理与安全`,
    difficulty: "beginner",
    question: "What is 'AI hallucination'?",
    questionZh: `什么是"AI 幻觉"？`,
    options: ["When AI sees images", "When AI confidently generates false or made-up information", "When AI runs out of memory", "When AI crashes"],
    correctIndex: 1,
    explanation: "AI hallucination is when an LLM generates information that sounds confident and plausible but is factually incorrect or completely made up. This is a major challenge in AI safety.",
    explanationZh: `AI 幻觉是指 LLM 生成听起来自信且合理但实际上不正确或完全虚构的信息。这是 AI 安全中的一个主要挑战。`,
    resource: "https://en.wikipedia.org/wiki/Hallucination_(artificial_intelligence)"
  },
  {
    id: 13,
    category: "AI Ethics & Safety",
    categoryZh: `AI 伦理与安全`,
    difficulty: "intermediate",
    question: "What is 'bias' in AI models?",
    questionZh: `AI 模型中的"偏见"是什么？`,
    options: ["A feature that makes AI faster", "Systematic errors that reflect societal prejudices in training data", "A type of AI architecture", "A way to improve accuracy"],
    correctIndex: 1,
    explanation: "AI bias occurs when models reflect prejudices present in their training data — for example, gender or racial stereotypes. Reducing bias is a critical part of responsible AI development.",
    explanationZh: `AI 偏见发生在模型反映训练数据中存在的偏见时——例如性别或种族刻板印象。减少偏见是负责任 AI 开发的关键部分。`,
    resource: "https://www.ibm.com/think/topics/ai-bias"
  },

  // ===== Category: GEO & AI Marketing (GEO 与 AI 营销) =====
  {
    id: 14,
    category: "GEO & AI Marketing",
    categoryZh: `GEO 与 AI 营销`,
    difficulty: "beginner",
    question: "What does GEO stand for in AI marketing?",
    questionZh: `在 AI 营销中，GEO 代表什么？`,
    options: ["Geographic Engine Optimization", "Generative Engine Optimization", "General Education Online", "Global Enterprise Operations"],
    correctIndex: 1,
    explanation: "GEO = Generative Engine Optimization. It's the practice of optimizing content so AI-powered search engines (ChatGPT, Perplexity, Gemini) can find and cite it — the AI era equivalent of SEO.",
    explanationZh: `GEO = 生成式引擎优化。这是优化内容使 AI 搜索引擎（ChatGPT、Perplexity、Gemini）能够找到并引用它的实践——AI 时代的 SEO。`,
    resource: "https://searchengineland.com/generative-engine-optimization-geo-447842"
  },
  {
    id: 15,
    category: "GEO & AI Marketing",
    categoryZh: `GEO 与 AI 营销`,
    difficulty: "intermediate",
    question: "What is JSON-LD structured data used for in GEO?",
    questionZh: `JSON-LD 结构化数据在 GEO 中有什么用？`,
    options: ["Styling web pages", "Helping LLMs understand and cite your web content", "Encrypting data", "Compressing images"],
    correctIndex: 1,
    explanation: "JSON-LD (JavaScript Object Notation for Linked Data) is a way to embed structured data in web pages. LLMs and search engines use it to understand what your content is about, making it far more likely to be cited.",
    explanationZh: `JSON-LD（关联数据的 JavaScript 对象表示法）是在网页中嵌入结构化数据的方式。LLM 和搜索引擎使用它来理解你的内容，使其更有可能被引用。`,
    resource: "https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data"
  },
  {
    id: 16,
    category: "GEO & AI Marketing",
    categoryZh: `GEO 与 AI 营销`,
    difficulty: "intermediate",
    question: "Why do 'named entities' (people, brands, places) improve LLM discoverability?",
    questionZh: `为什么"命名实体"（人、品牌、地点）能提高 LLM 可发现性？`,
    options: ["They make posts shorter", "They link content to knowledge graph entries that LLMs already know about", "They reduce server costs", "They improve image quality"],
    correctIndex: 1,
    explanation: "LLMs have internal knowledge graphs. When you mention specific entities (e.g., 'OpenAI', 'San Francisco', 'Elon Musk'), the LLM can connect your content to what it already knows, increasing citation likelihood.",
    explanationZh: `LLM 有内部知识图谱。当你提到特定实体（如 'OpenAI'、'旧金山'、'Elon Musk'）时，LLM 可以将你的内容与它已知的知识连接起来，增加被引用的可能性。`,
    resource: "https://en.wikipedia.org/wiki/Knowledge_graph"
  },

  // ===== Category: AI in Education (AI 与教育) =====
  {
    id: 17,
    category: "AI in Education",
    categoryZh: `AI 与教育`,
    difficulty: "beginner",
    question: "How can AI tutors help students in foundation/pre-university courses?",
    questionZh: `AI 辅导工具如何帮助预科/大学预科课程的学生？`,
    options: ["By replacing teachers completely", "By providing personalized practice, instant feedback, and 24/7 availability", "By writing essays for students", "By grading final exams only"],
    correctIndex: 1,
    explanation: "AI tutors like Khan Academy's Khanmigo provide personalized learning paths, instant feedback on practice problems, and are available 24/7 — supplementing (not replacing) human teachers.",
    explanationZh: `像可汗学院的 Khanmigo 这样的 AI 辅导工具提供个性化学习路径、即时练习反馈，并且 24/7 可用——补充（而非替代）人类教师。`,
    resource: "https://www.khanacademy.org/khan-labs"
  },
  {
    id: 18,
    category: "AI in Education",
    categoryZh: `AI 与教育`,
    difficulty: "beginner",
    question: "What is the main benefit of AI-powered study groups?",
    questionZh: `AI 驱动的学习小组的主要好处是什么？`,
    options: ["They cost more money", "They can match students by level, generate discussion questions, and track group progress", "They only work in person", "They replace all textbooks"],
    correctIndex: 1,
    explanation: "AI-powered study groups use algorithms to match students at similar levels, auto-generate relevant discussion questions, and track each member's progress to keep everyone engaged.",
    explanationZh: `AI 驱动的学习小组使用算法匹配相似水平的学生、自动生成相关讨论问题，并跟踪每个成员的进度以保持参与度。`,
    resource: "https://www.coursera.org/articles/ai-in-education"
  },

  // ===== Category: AI Programming Basics (AI 编程基础) =====
  {
    id: 19,
    category: "AI Programming Basics",
    categoryZh: `AI 编程基础`,
    difficulty: "beginner",
    question: "Which programming language is most commonly used in AI/ML?",
    questionZh: `AI/ML 中最常用的编程语言是哪个？`,
    options: ["Java", "Python", "C++", "Ruby"],
    correctIndex: 1,
    explanation: "Python is the dominant language in AI/ML due to its simple syntax and powerful libraries like TensorFlow, PyTorch, scikit-learn, and Hugging Face Transformers.",
    explanationZh: `Python 是 AI/ML 中的主导语言，因为它语法简单且拥有 TensorFlow、PyTorch、scikit-learn 和 Hugging Face Transformers 等强大库。`,
    resource: "https://www.python.org/"
  },
  {
    id: 20,
    category: "AI Programming Basics",
    categoryZh: `AI 编程基础`,
    difficulty: "intermediate",
    question: "What is an API in the context of AI services like ChatGPT?",
    questionZh: `在 ChatGPT 等 AI 服务的上下文中，API 是什么？`,
    options: ["A physical connection cable", "A programming interface that lets your app send prompts and receive AI responses", "A type of AI model", "An AI training method"],
    correctIndex: 1,
    explanation: "An API (Application Programming Interface) lets developers send requests to AI services programmatically. For example, the OpenAI API or Anthropic API lets you integrate ChatGPT or Claude into your own applications.",
    explanationZh: `API（应用程序编程接口）使开发者能够以编程方式向 AI 服务发送请求。例如，OpenAI API 或 Anthropic API 让你将 ChatGPT 或 Claude 集成到自己的应用程序中。`,
    resource: "https://docs.anthropic.com/en/api/getting-started"
  },

  // ===== More GEO-specific questions =====
  {
    id: 21,
    category: "GEO & AI Marketing",
    categoryZh: `GEO 与 AI 营销`,
    difficulty: "beginner",
    question: "Which type of social media content is MOST likely to be cited by LLMs?",
    questionZh: `哪种社交媒体内容最有可能被 LLM 引用？`,
    options: ["A photo with no caption", "A fact-rich post with statistics, named entities, and structured format", "A post that only says 'link in bio'", "A repost with no original text"],
    correctIndex: 1,
    explanation: "LLMs cite content that is factual, structured, and quotable. Posts with statistics, specific names, and clear formatting give LLMs the most usable information to reference.",
    explanationZh: `LLM 引用事实性强、结构化和可引用的内容。包含统计数据、具体名称和清晰格式的帖子为 LLM 提供了最可用的参考信息。`,
    resource: "https://searchengineland.com/generative-engine-optimization-geo-447842"
  },
  {
    id: 22,
    category: "AI Fundamentals",
    categoryZh: `AI 基础`,
    difficulty: "intermediate",
    question: "What is 'fine-tuning' an AI model?",
    questionZh: `什么是 AI 模型的"微调"？`,
    options: ["Making the AI run faster", "Further training a pre-trained model on a specific dataset for a particular task", "Reducing the model's file size", "Deleting parts of the model"],
    correctIndex: 1,
    explanation: "Fine-tuning takes a pre-trained foundation model and trains it further on a smaller, task-specific dataset. This adapts the model to perform better on specialized tasks without training from scratch.",
    explanationZh: `微调是将预训练的基础模型在更小的、特定任务的数据集上进一步训练。这使模型能够更好地执行专门任务，而无需从头训练。`,
    resource: "https://platform.openai.com/docs/guides/fine-tuning"
  },
  {
    id: 23,
    category: "AI Tools & Applications",
    categoryZh: `AI 工具与应用`,
    difficulty: "beginner",
    question: "What is Perplexity AI primarily used for?",
    questionZh: `Perplexity AI 主要用于什么？`,
    options: ["Image editing", "AI-powered search with cited sources", "Video streaming", "Social networking"],
    correctIndex: 1,
    explanation: "Perplexity AI is an AI-powered search engine that answers questions using LLMs and cites its sources. It represents the shift from traditional search (Google) to generative search.",
    explanationZh: `Perplexity AI 是一个 AI 驱动的搜索引擎，使用 LLM 回答问题并引用来源。它代表了从传统搜索（Google）到生成式搜索的转变。`,
    resource: "https://www.perplexity.ai/"
  },
  {
    id: 24,
    category: "Prompt Engineering",
    categoryZh: `提示词工程`,
    difficulty: "intermediate",
    question: "What is a 'system prompt'?",
    questionZh: `什么是"系统提示词"？`,
    options: ["An error message from the computer", "Hidden instructions that define how an AI assistant should behave", "The first message a user sends", "A prompt used to train the model"],
    correctIndex: 1,
    explanation: "A system prompt is a set of instructions given to an AI model (usually hidden from the end user) that defines its behavior, tone, capabilities, and restrictions.",
    explanationZh: `系统提示词是给 AI 模型的一组指令（通常对最终用户隐藏），定义其行为、语气、能力和限制。`,
    resource: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/system-prompts"
  },
  {
    id: 25,
    category: "AI Ethics & Safety",
    categoryZh: `AI 伦理与安全`,
    difficulty: "beginner",
    question: "Why is it important to verify information provided by AI?",
    questionZh: `为什么验证 AI 提供的信息很重要？`,
    options: ["AI is always wrong", "AI can hallucinate — generating plausible but incorrect information", "AI is too slow", "AI only speaks English"],
    correctIndex: 1,
    explanation: "LLMs can generate convincing but factually wrong information (hallucinations). Always verify important claims from AI against reliable sources, especially for academic or professional work.",
    explanationZh: `LLM 可以生成令人信服但实际错误的信息（幻觉）。始终根据可靠来源验证 AI 的重要声明，特别是在学术或专业工作中。`,
    resource: "https://en.wikipedia.org/wiki/Hallucination_(artificial_intelligence)"
  },
];

// Study group resources — online courses for foundation & international year one
const studyResources = [
  {
    category: "AI & Machine Learning Courses",
    categoryZh: `AI 与机器学习课程`,
    items: [
      { name: "Google AI Essentials (Coursera)", nameZh: "Google AI 基础（Coursera）", url: "https://www.coursera.org/learn/google-ai-essentials", level: "Beginner", free: true },
      { name: "AI For Everyone — Andrew Ng (Coursera)", nameZh: "人人都能学 AI — 吴恩达（Coursera）", url: "https://www.coursera.org/learn/ai-for-everyone", level: "Beginner", free: true },
      { name: "Introduction to Generative AI (Google Cloud)", nameZh: "生成式 AI 入门（Google Cloud）", url: "https://www.cloudskillsboost.google/paths/118", level: "Beginner", free: true },
      { name: "ChatGPT Prompt Engineering for Developers (DeepLearning.AI)", nameZh: "ChatGPT 提示词工程（DeepLearning.AI）", url: "https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/", level: "Intermediate", free: true },
      { name: "Machine Learning Specialization — Andrew Ng (Coursera)", nameZh: "机器学习专项课程 — 吴恩达（Coursera）", url: "https://www.coursera.org/specializations/machine-learning-introduction", level: "Intermediate", free: false },
    ]
  },
  {
    category: "Foundation & International Year One Prep",
    categoryZh: `预科 / 国际大一准备课程`,
    items: [
      { name: "Khan Academy — Computing & AI", nameZh: "可汗学院 — 计算与 AI", url: "https://www.khanacademy.org/computing", level: "Beginner", free: true },
      { name: "Harvard CS50: Introduction to AI with Python", nameZh: "哈佛 CS50：Python AI 入门", url: "https://cs50.harvard.edu/ai/", level: "Intermediate", free: true },
      { name: "MIT OpenCourseWare — Intro to Deep Learning", nameZh: "MIT 公开课 — 深度学习入门", url: "https://introtodeeplearning.com/", level: "Intermediate", free: true },
      { name: "Elements of AI (University of Helsinki)", nameZh: "AI 基础要素（赫尔辛基大学）", url: "https://www.elementsofai.com/", level: "Beginner", free: true },
      { name: "Fast.ai Practical Deep Learning", nameZh: "Fast.ai 实用深度学习", url: "https://course.fast.ai/", level: "Intermediate", free: true },
    ]
  },
  {
    category: "Study Group & Collaboration Tools",
    categoryZh: `学习小组与协作工具`,
    items: [
      { name: "Notion — AI-powered notes & collaboration", nameZh: "Notion — AI 驱动的笔记与协作", url: "https://www.notion.so/", level: "All", free: true },
      { name: "Discord Study Servers", nameZh: "Discord 学习服务器", url: "https://discord.com/", level: "All", free: true },
      { name: "Hugging Face Community", nameZh: "Hugging Face 社区", url: "https://huggingface.co/", level: "Intermediate", free: true },
      { name: "Kaggle — Learn & Compete", nameZh: "Kaggle — 学习与竞赛", url: "https://www.kaggle.com/learn", level: "Intermediate", free: true },
    ]
  }
];

module.exports = { questions, studyResources };
