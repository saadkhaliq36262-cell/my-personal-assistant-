import { TopicInfo, EnglishLevel } from '@/types';

export const ENGLISH_LEVELS: { id: EnglishLevel; label: string; tag: string; description: string }[] = [
  {
    id: 'beginner',
    label: 'Beginner',
    tag: 'A1-A2',
    description: 'Simple vocabulary, short sentences, gentle basic corrections.'
  },
  {
    id: 'intermediate',
    label: 'Intermediate',
    tag: 'B1-B2',
    description: 'Natural conversational pace, phrasal verbs, daily idioms.'
  },
  {
    id: 'advanced',
    label: 'Advanced',
    tag: 'C1-C2',
    description: 'Sophisticated phrasing, subtle nuance, professional vocabulary.'
  }
];

export const PRACTICE_TOPICS: TopicInfo[] = [
  {
    id: 'free',
    title: 'Free Conversation',
    icon: '💬',
    description: 'Chat freely about anything on your mind.',
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
    description: 'Talk about your habits, meals, hobbies, and day-to-day life.',
    starterPrompt: "Let us talk about your daily routines! What is your morning routine like after you wake up?",
    starterSuggestions: [
      "I usually wake up at 7 AM and drink a hot cup of coffee.",
      "In the evening, I like to cook dinner and watch movies.",
      "On weekends, I enjoy going for a walk in the park."
    ]
  },
  {
    id: 'interview',
    title: 'Job Interview Practice',
    icon: '💼',
    description: 'Practice answering common professional and interview questions.',
    starterPrompt: "Welcome to your mock interview! Please tell me a little bit about yourself and your professional background.",
    starterSuggestions: [
      "I have been working as a software developer for three years.",
      "One of my greatest strengths is problem-solving under pressure.",
      "I am looking for new opportunities to grow my leadership skills."
    ]
  },
  {
    id: 'travel',
    title: 'Travel & Vacations',
    icon: '✈️',
    description: 'Describe favorite destinations, hotels, airports, and dream trips.',
    starterPrompt: "I love exploring new places! What is the most memorable trip you have ever taken?",
    starterSuggestions: [
      "Last summer, I traveled to the mountains with my friends.",
      "I want to visit Japan next year to see the cherry blossoms.",
      "Traveling allows me to experience different cultures and food."
    ]
  },
  {
    id: 'shopping',
    title: 'Ordering Food & Shopping',
    icon: '🛍️',
    description: 'Simulate ordering in restaurants, buying clothes, and asking for prices.',
    starterPrompt: "Imagine we are at a nice coffee shop or restaurant! What would you like to order today?",
    starterSuggestions: [
      "Could I get an iced latte with oat milk, please?",
      "Do you have this shirt in a medium size?",
      "Can you recommend the most popular dish on the menu?"
    ]
  },
  {
    id: 'introduction',
    title: 'Self Introduction',
    icon: '👋',
    description: 'Introduce yourself naturally to new people and colleagues.',
    starterPrompt: "Nice to meet you! How would you introduce yourself if you met someone new at a social event?",
    starterSuggestions: [
      "Hello, my name is Alex and I am from California.",
      "In my free time, I love playing guitar and reading books.",
      "I am currently practicing English to travel around the world."
    ]
  },
  {
    id: 'tech',
    title: 'Technology & AI',
    icon: '🚀',
    description: 'Discuss gadgets, software, artificial intelligence, and future tech.',
    starterPrompt: "Technology is changing so fast! How do you use AI or smartphones in your daily life?",
    starterSuggestions: [
      "I use AI tools to help me write emails and brainstorm ideas.",
      "Do you think artificial intelligence will change most jobs?",
      "I recently upgraded to a new smartphone with a great camera."
    ]
  },
  {
    id: 'family',
    title: 'Friends & Family',
    icon: '👨‍👩‍👧‍👦',
    description: 'Talk about relationships, favorite memories, and family traditions.',
    starterPrompt: "Tell me about your family or a close friend who inspires you!",
    starterSuggestions: [
      "My best friend and I have known each other since college.",
      "We usually celebrate holidays together with a big family dinner.",
      "My parents taught me the value of hard work and honesty."
    ]
  }
];

export const PRACTICE_GOALS = [5, 10, 15, 30] as const;