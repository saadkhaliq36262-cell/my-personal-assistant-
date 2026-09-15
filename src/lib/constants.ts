import { TopicInfo, EnglishLevel } from '@/types';

export const ENGLISH_LEVELS: { id: EnglishLevel; label: string; tag: string; description: string; focus: string }[] = [
  {
    id: 'beginner',
    label: 'Beginner',
    tag: 'A1–A2',
    description: 'Simple vocabulary, short sentences, and gentle basic grammar corrections.',
    focus: 'Everyday words, basic tenses & sentence structure'
  },
  {
    id: 'intermediate',
    label: 'Intermediate',
    tag: 'B1–B2',
    description: 'Natural conversational pace, practical idioms, phrasal verbs, and connecting thoughts.',
    focus: 'Fluency, natural phrasing & conversational idioms'
  },
  {
    id: 'advanced',
    label: 'Advanced',
    tag: 'C1–C2',
    description: 'Sophisticated phrasing, subtle nuance, professional vocabulary, and native expressions.',
    focus: 'Nuance, advanced vocabulary & professional polish'
  }
];

export const PRACTICE_TOPICS: TopicInfo[] = [
  {
    id: 'free',
    title: 'Free Conversation',
    icon: '💬',
    category: 'General',
    description: 'Chat freely about anything on your mind with no set rules.',
    starterPrompt: "Hi there! I am your English coach. How are you doing today? Tell me what you did today or what is on your mind!",
    starterSuggestions: [
      "I had a busy day at work today.",
      "I am planning to learn something new this weekend.",
      "The weather has been really nice lately."
    ]
  },
  {
    id: 'daily',
    title: 'Daily Life & Routines',
    icon: '☕',
    category: 'Lifestyle',
    description: 'Talk about your habits, meals, morning routines, and day-to-day life.',
    starterPrompt: "Let's talk about your daily routines! What is your morning routine like after you wake up?",
    starterSuggestions: [
      "I usually wake up at 7 AM and drink a hot cup of coffee.",
      "In the evening, I like to cook dinner and watch movies.",
      "On weekends, I enjoy going for a relaxing walk in the park."
    ]
  },
  {
    id: 'interview',
    title: 'Job Interview Practice',
    icon: '💼',
    category: 'Career',
    description: 'Practice answering common behavioral and professional interview questions.',
    starterPrompt: "Welcome to your mock interview! Please tell me a little bit about yourself and your professional background.",
    starterSuggestions: [
      "I have been working as a software developer for three years.",
      "One of my greatest strengths is problem-solving under pressure.",
      "I am looking for new opportunities to grow my leadership skills."
    ]
  },
  {
    id: 'business',
    title: 'Business English',
    icon: '📈',
    category: 'Professional',
    description: 'Master workplace conversations, meeting discussions, presentations, and emails.',
    starterPrompt: "Let's practice business communication! How would you give an update to your team about a project deadline?",
    starterSuggestions: [
      "I would like to schedule a quick sync meeting tomorrow morning.",
      "Our team completed the milestones ahead of schedule.",
      "We need to allocate additional resources to meet our quarterly target."
    ]
  },
  {
    id: 'travel',
    title: 'Travel & Vacations',
    icon: '✈️',
    category: 'Leisure',
    description: 'Describe favorite destinations, airport situations, hotel check-ins, and dream trips.',
    starterPrompt: "I love exploring new places! What is the most memorable trip you have ever taken?",
    starterSuggestions: [
      "Last summer, I traveled to the mountains with my friends.",
      "I want to visit Japan next year to see the cherry blossoms.",
      "Traveling allows me to experience different cultures and food."
    ]
  },
  {
    id: 'shopping',
    title: 'Shopping & Dining Out',
    icon: '🛍️',
    category: 'Practical',
    description: 'Simulate ordering at restaurants, buying clothes, and asking for recommendations.',
    starterPrompt: "Imagine we are at a nice coffee shop or restaurant! What would you like to order today?",
    starterSuggestions: [
      "Could I get an iced latte with oat milk, please?",
      "Do you have this shirt in a medium size?",
      "Can you recommend the most popular dish on the menu?"
    ]
  },
  {
    id: 'tech',
    title: 'Technology & AI',
    icon: '🚀',
    category: 'Modern',
    description: 'Discuss gadgets, software, artificial intelligence, and future innovations.',
    starterPrompt: "Technology is changing so fast! How do you use AI or smartphones in your daily life?",
    starterSuggestions: [
      "I use AI tools to help me write emails and brainstorm ideas.",
      "Do you think artificial intelligence will change most jobs?",
      "I recently upgraded to a new smartphone with a great camera."
    ]
  },
  {
    id: 'hobbies',
    title: 'Hobbies & Free Time',
    icon: '🎨',
    category: 'Personal',
    description: 'Discuss your favorite creative passions, sports, music, books, and relaxation.',
    starterPrompt: "What do you like to do when you have free time on the weekend?",
    starterSuggestions: [
      "In my free time, I really enjoy reading non-fiction books and playing music.",
      "I have recently started learning photography as a creative hobby.",
      "Playing football with my friends helps me stay fit and active."
    ]
  }
];

export const SUGGESTED_REPLIES = [
  "Tell me more about that",
  "Ask me a question",
  "What do you think?",
  "Let's practice another example",
  "How can I say this better?"
];

export const PRACTICE_GOALS = [5, 10, 15, 30] as const;

export const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];