import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const TASKS_DATA = [
  {
    id: 1,
    title: 'Consumer Shopping Habits Survey',
    description: 'Help AI understand consumer behavior by completing this short shopping habits survey.',
    category: 'Survey',
    reward: 1.50,
    time: '5 min',
    icon: '🛒',
    questions: [
      { text: 'How often do you shop online?', type: 'radio', options: ['Daily', 'Weekly', 'Monthly', 'Rarely'] },
      { text: 'What influences your purchase decisions most?', type: 'radio', options: ['Price', 'Brand', 'Reviews', 'Convenience'] },
      { text: 'Which payment method do you prefer?', type: 'radio', options: ['M-Pesa', 'Cash', 'Credit Card', 'Bank Transfer'] },
    ]
  },
  {
    id: 2,
    title: 'Content Sentiment Analysis',
    description: 'Classify the emotional tone of social media posts to improve AI understanding.',
    category: 'Sentiment',
    reward: 2.00,
    time: '8 min',
    icon: '😊',
    questions: [
      { text: 'Analyze: "This product completely ruined my day, absolute garbage!" — What is the sentiment?', type: 'radio', options: ['Positive', 'Neutral', 'Negative', 'Mixed'] },
      { text: 'Analyze: "Okay experience, not the best but not terrible either." — Sentiment?', type: 'radio', options: ['Positive', 'Neutral', 'Negative', 'Mixed'] },
      { text: 'Analyze: "Absolutely love this app, changed my life!" — Sentiment?', type: 'radio', options: ['Positive', 'Neutral', 'Negative', 'Mixed'] },
    ]
  },
  {
    id: 3,
    title: 'Image Description Task',
    description: 'Write clear, concise descriptions for images to help train computer vision AI models.',
    category: 'Labeling',
    reward: 2.50,
    time: '10 min',
    icon: '🖼️',
    questions: [
      { text: 'Describe an image showing two children playing football in a muddy field at sunset, in one clear sentence:', type: 'textarea' },
      { text: 'What objects would typically be found in a Kenyan kitchen? List at least 5:', type: 'textarea' },
    ]
  },
  {
    id: 4,
    title: 'Food Preferences Survey',
    description: 'Share your food preferences to help AI build better recommendation systems.',
    category: 'Survey',
    reward: 1.50,
    time: '4 min',
    icon: '🍽️',
    questions: [
      { text: 'What type of cuisine do you eat most frequently?', type: 'radio', options: ['Kenyan Traditional', 'Fast Food', 'Indian', 'Western'] },
      { text: 'How often do you cook at home?', type: 'radio', options: ['Every day', '3-4 times/week', 'Weekends only', 'Rarely'] },
    ]
  },
  {
    id: 5,
    title: 'Spam Email Classification',
    description: 'Mark emails as spam or legitimate to improve email filtering AI.',
    category: 'Classification',
    reward: 1.80,
    time: '6 min',
    icon: '📧',
    questions: [
      { text: '"CONGRATULATIONS! You have won KES 1,000,000! Click here NOW!" — Is this spam?', type: 'radio', options: ['Spam', 'Legitimate', 'Unsure'] },
      { text: '"Dear Customer, your monthly bank statement is ready to view online." — Is this spam?', type: 'radio', options: ['Spam', 'Legitimate', 'Unsure'] },
      { text: '"50% OFF everything this weekend only! Limited stock!" — Is this spam?', type: 'radio', options: ['Spam', 'Legitimate', 'Unsure'] },
    ]
  },
  {
    id: 6,
    title: 'Voice Command Dataset',
    description: 'Transcribe short audio descriptions to help build Swahili voice recognition AI.',
    category: 'Transcription',
    reward: 3.00,
    time: '12 min',
    icon: '🎙️',
    questions: [
      { text: 'Translate to English: "Ninahitaji msaada wako leo"', type: 'radio', options: ['I need your help today', 'I want to go home', 'The food is ready', 'Help me find my phone'] },
      { text: 'What does "Habari yako?" mean in English?', type: 'radio', options: ['How are you?', 'Good morning', 'Thank you', 'Goodbye'] },
    ]
  },
  {
    id: 7,
    title: 'Product Review Quality Check',
    description: 'Rate the quality and helpfulness of e-commerce product reviews for AI training.',
    category: 'Review',
    reward: 2.20,
    time: '9 min',
    icon: '⭐',
    questions: [
      { text: '"Good." — Rate the helpfulness of this review:', type: 'radio', options: ['Very Helpful', 'Helpful', 'Somewhat Helpful', 'Not Helpful'] },
      { text: '"Battery lasts 2 days, camera takes crisp photos in low light, and the build quality feels premium." — Rate it:', type: 'radio', options: ['Very Helpful', 'Helpful', 'Somewhat Helpful', 'Not Helpful'] },
    ]
  },
  {
    id: 8,
    title: 'Healthcare Survey',
    description: 'Help AI understand healthcare access patterns in Kenya by sharing your experience.',
    category: 'Survey',
    reward: 2.00,
    time: '7 min',
    icon: '🏥',
    questions: [
      { text: 'How far is the nearest health facility from your home?', type: 'radio', options: ['< 1 km', '1-5 km', '5-10 km', '> 10 km'] },
      { text: 'Do you have health insurance (NHIF or other)?', type: 'radio', options: ['Yes, NHIF', 'Yes, private', 'No insurance', 'Currently applying'] },
      { text: 'How do you typically pay for healthcare?', type: 'radio', options: ['NHIF', 'Cash', 'M-Pesa', 'Other'] },
    ]
  },
  {
    id: 9,
    title: 'Traffic Sign Identification',
    description: 'Identify traffic signs in street-view images to improve self-driving car AI.',
    category: 'Labeling',
    reward: 1.70,
    time: '6 min',
    icon: '🚦',
    questions: [
      { text: 'What does a red octagonal sign represent?', type: 'radio', options: ['Yield', 'Stop', 'Speed Limit', 'No Entry'] },
      { text: 'What is the standard speed limit for urban areas in Kenya?', type: 'radio', options: ['50 km/h', '80 km/h', '100 km/h', '110 km/h'] },
    ]
  },
  {
    id: 10,
    title: 'Travel Preferences Survey',
    description: 'Share your travel habits to help AI personalize vacation recommendations.',
    category: 'Survey',
    reward: 2.10,
    time: '8 min',
    icon: '✈️',
    questions: [
      { text: 'What type of vacation do you prefer?', type: 'radio', options: ['Beach', 'Adventure', 'City Break', 'Cultural Experience'] },
      { text: 'How do you usually book your flights?', type: 'radio', options: ['Directly from airline', 'Travel Agency', 'Aggregator sites', 'Mobile App'] },
    ]
  },
  {
    id: 11,
    title: 'Customer Service Bot Feedback',
    description: 'Rate the efficiency of an AI customer service interaction.',
    category: 'Review',
    reward: 1.40,
    time: '5 min',
    icon: '🤖',
    questions: [
      { text: 'Did the bot resolve your issue?', type: 'radio', options: ['Fully resolved', 'Partially resolved', 'Not resolved', 'I preferred a human agent'] },
      { text: 'How natural did the conversation feel?', type: 'radio', options: ['Very natural', 'Fairly natural', 'Stilted/Artificial', 'Very mechanical'] },
    ]
  },
  {
    id: 12,
    title: 'App Localisation Check',
    description: 'Verify the Swahili translation of a newly launched mobile app.',
    category: 'Transcription',
    reward: 3.50,
    time: '15 min',
    icon: '🌍',
    questions: [
      { text: '"Your payment was successful" — Best Swahili translation?', type: 'radio', options: ['Malipo yako yamefanikiwa', 'Malipo yako ni sawa', 'Umeweza kulipa', 'Pesa imefika'] },
      { text: '"Settings" — Best Swahili translation?', type: 'radio', options: ['Mipangilio', 'Habari', 'Picha', 'Sauti'] },
    ]
  },
  {
    id: 13,
    title: 'Mobile Banking Experience',
    description: 'Rate your experience with various mobile banking apps in Kenya.',
    category: 'Survey',
    reward: 1.80,
    time: '7 min',
    icon: '📲',
    questions: [
      { text: 'Which mobile banking app do you use most frequently?', type: 'radio', options: ['Equity', 'KCB', 'Co-op', 'M-Shwari'] },
      { text: 'Rate the security of your primary banking app:', type: 'radio', options: ['Excellent', 'Good', 'Average', 'Poor'] },
    ]
  },
  {
    id: 14,
    title: 'Public Transport Satisfaction',
    description: 'Help map Matatu usage and satisfaction levels across Nairobi.',
    category: 'Survey',
    reward: 1.60,
    time: '6 min',
    icon: '🚐',
    questions: [
      { text: 'Which Matatu route do you use most daily?', type: 'textarea' },
      { text: 'Rate the cleanliness of public transport:', type: 'radio', options: ['Clean', 'Acceptable', 'Dirty', 'Unbearable'] },
    ]
  },
  {
    id: 15,
    title: 'E-commerce Search Quality',
    description: 'Evaluate the relevance of search results on African shopping sites.',
    category: 'Classification',
    reward: 1.90,
    time: '8 min',
    icon: '🔍',
    questions: [
      { text: 'Search: "Samsung Galaxy S23" — Result: "iPhone 14 Case". Is this relevant?', type: 'radio', options: ['Highly Relevant', 'Somewhat Relevant', 'Irrelevant', 'I don\'t know'] },
      { text: 'Search: "Men\'s Sneakers" — Result: "Nike Air Max". Is this relevant?', type: 'radio', options: ['Highly Relevant', 'Somewhat Relevant', 'Irrelevant', 'I don\'t know'] },
    ]
  },
  {
    id: 16,
    title: 'Job Market Insights',
    description: 'Share your career experiences to help improve AI job matching algorithms.',
    category: 'Survey',
    reward: 2.30,
    time: '10 min',
    icon: '💼',
    questions: [
      { text: 'What is your current industry?', type: 'radio', options: ['Tech', 'Education', 'Finance', 'Agriculture', 'Other'] },
      { text: 'What is the biggest challenge in finding a job today?', type: 'textarea' },
    ]
  },
  {
    id: 17,
    title: 'News Headline Accuracy',
    description: 'Detect clickbait and misleading headlines in online news articles.',
    category: 'Classification',
    reward: 1.50,
    time: '5 min',
    icon: '📰',
    questions: [
      { text: '"YOU WON\'T BELIEVE what this celebrity did at lunch!" — Clickbait?', type: 'radio', options: ['Definite Clickbait', 'Informative', 'Unsure'] },
      { text: '"Nairobi Governor announces new waste management plan." — Clickbait?', type: 'radio', options: ['Definite Clickbait', 'Informative', 'Unsure'] },
    ]
  },
  {
    id: 18,
    title: 'Streaming Content Rating',
    description: 'Rate the quality of original African series on streaming platforms.',
    category: 'Review',
    reward: 2.00,
    time: '8 min',
    icon: '🎬',
    questions: [
      { text: 'Have you watched "Country Queen"? Rate it:', type: 'radio', options: ['⭐⭐⭐⭐⭐', '⭐⭐⭐⭐', '⭐⭐⭐', '⭐⭐', '⭐'] },
      { text: 'Which streaming service has the best local content?', type: 'radio', options: ['Netflix', 'Showmax', 'Viusasa', 'Prime Video'] },
    ]
  },
  {
    id: 19,
    title: 'Agriculture Tech Usage',
    description: 'Share your expertise on modern farming tools and mobile apps for farmers.',
    category: 'Survey',
    reward: 2.50,
    time: '12 min',
    icon: '🚜',
    questions: [
      { text: 'Do you use any mobile app for weather or market prices?', type: 'radio', options: ['Yes', 'No', 'Sometimes', 'I don\'t farm'] },
      { text: 'What is the most useful digital tool for a farmer today?', type: 'textarea' },
    ]
  },
  {
    id: 20,
    title: 'AI Translation Correction',
    description: 'Fix errors in AI-generated Swahili-English translations.',
    category: 'Transcription',
    reward: 3.20,
    time: '14 min',
    icon: '✍️',
    questions: [
      { text: 'AI translated "Pole pole" as "Sorry sorry". Is this correct?', type: 'radio', options: ['Correct', 'Incorrect - means slowly', 'Partially correct', 'I don\'t know'] },
      { text: 'How would you translate "Mambo vipi?" colloquially?', type: 'textarea' },
    ]
  },
  {
    id: 21,
    title: 'Real Estate Query Relevance',
    description: 'Evaluate if property search results match the user\'s criteria.',
    category: 'Classification',
    reward: 1.75,
    time: '7 min',
    icon: '🏠',
    questions: [
      { text: 'Search: "Bedsitter in Roysambu" — Result: "3 Bedroom in Kilimani". Relevant?', type: 'radio', options: ['Highly Relevant', 'Somewhat Relevant', 'Irrelevant'] },
      { text: 'Search: "House for sale in Nakuru" — Result: "House for rent in Nakuru". Relevant?', type: 'radio', options: ['Highly Relevant', 'Somewhat Relevant', 'Irrelevant'] },
    ]
  },
  {
    id: 22,
    title: 'Entertainment News Sentiment',
    description: 'Analyze the tone of reporting on local celebrities.',
    category: 'Sentiment',
    reward: 1.55,
    time: '6 min',
    icon: '🎭',
    questions: [
      { text: 'Headline: "Local star loses everything in crypto scam." — Sentiment of article?', type: 'radio', options: ['Sympathetic', 'Critical', 'Objective/Neutral', 'Sensationalist'] },
    ]
  },
  {
    id: 23,
    title: 'Video Game Experience Survey',
    description: 'Help AI understand gaming trends among African youth.',
    category: 'Survey',
    reward: 1.90,
    time: '9 min',
    icon: '🎮',
    questions: [
      { text: 'What is your favorite gaming platform?', type: 'radio', options: ['Mobile', 'PlayStation', 'Xbox', 'PC'] },
      { text: 'How many hours a week do you spend gaming?', type: 'radio', options: ['0-5', '5-15', '15-30', '30+'] },
    ]
  },
  {
    id: 24,
    title: 'Handwriting Recognition',
    description: 'Transcribe handwritten notes into digital text for AI training.',
    category: 'Labeling',
    reward: 2.80,
    time: '11 min',
    icon: '📝',
    questions: [
      { text: 'Transcribe this word [Assume image of "Karibu"]: ', type: 'textarea' },
    ]
  },
  {
    id: 25,
    title: 'Website Usability Test',
    description: 'Find specific information on a new landing page and rate the ease of use.',
    category: 'Review',
    reward: 2.40,
    time: '10 min',
    icon: '💻',
    questions: [
      { text: 'Was the "Contact Us" button easy to find?', type: 'radio', options: ['Very Easy', 'Easy', 'Hard', 'Impossible'] },
      { text: 'Rate the design aesthetics from 1-10:', type: 'radio', options: ['1-3', '4-6', '7-8', '9-10'] },
    ]
  },
  {
    id: 26,
    title: 'Social Media Ad Relevance',
    description: 'Help refine ad targeting for regional audiences.',
    category: 'Classification',
    reward: 1.50,
    time: '5 min',
    icon: '📱',
    questions: [
      { text: 'Ad for "Winter Coats" shown to user in Mombasa. Is this relevant?', type: 'radio', options: ['Relevant', 'Irrelevant', 'Unsure'] },
    ]
  },
  {
    id: 27,
    title: 'Music Genre Classification',
    description: 'Categorize local music tracks into their correct genres.',
    category: 'Labeling',
    reward: 1.85,
    time: '8 min',
    icon: '🎵',
    questions: [
      { text: 'Genre of "Suzanna" by Sauti Sol?', type: 'radio', options: ['Afro-pop', 'Rhumba', 'Genge', 'Kapuka'] },
      { text: 'Genre of "Wamlambez"?', type: 'radio', options: ['Gengetone', 'Bongo', 'Reggae', 'Hip Hop'] },
    ]
  },
  {
    id: 28,
    title: 'Energy Conservation Habits',
    description: 'Share how you save electricity to help build smart home AI.',
    category: 'Survey',
    reward: 1.65,
    time: '7 min',
    icon: '💡',
    questions: [
      { text: 'Do you use energy-saving LED bulbs?', type: 'radio', options: ['Yes, throughout', 'Some of them', 'None', 'What are those?'] },
    ]
  },
  {
    id: 29,
    title: 'Chatbot Intent Discovery',
    description: 'Match user queries to the correct intended action.',
    category: 'Classification',
    reward: 2.15,
    time: '9 min',
    icon: '🗨️',
    questions: [
      { text: 'Query: "Where is my order?" — Intent?', type: 'radio', options: ['Track Order', 'Cancel Order', 'New Purchase', 'Complaint'] },
    ]
  },
  {
    id: 30,
    title: 'Podcast Transcription',
    description: 'Transcribe a 1-minute segment of a popular local podcast.',
    category: 'Transcription',
    reward: 4.00,
    time: '18 min',
    icon: '🎧',
    questions: [
      { text: 'Transcribe the first 10 seconds of the provided audio:', type: 'textarea' },
    ]
  },
  {
    id: 31,
    title: 'Digital Literacy Survey',
    description: 'Help AI developers understand the digital skills of various age groups.',
    category: 'Survey',
    reward: 1.70,
    time: '8 min',
    icon: '🎓',
    questions: [
      { text: 'How comfortable are you with using spreadsheets?', type: 'radio', options: ['Expert', 'Intermediate', 'Beginner', 'N/A'] },
    ]
  },
  {
    id: 32,
    title: 'Image Quality Assessment',
    description: 'Rate the clarity and lighting of photographs for stock image AI.',
    category: 'Review',
    reward: 1.60,
    time: '6 min',
    icon: '📷',
    questions: [
      { text: 'Is this image blurry? [Assume image of Nairobi Skyline]', type: 'radio', options: ['Yes', 'No', 'Slightly'] },
    ]
  },
  {
    id: 33,
    title: 'Fitness Tracking Apps',
    description: 'Share your experience with health and fitness monitoring tools.',
    category: 'Survey',
    reward: 2.05,
    time: '10 min',
    icon: '🏃',
    questions: [
      { text: 'Do you use a smartwatch or fitness tracker?', type: 'radio', options: ['Yes', 'No', 'Planning to buy'] },
    ]
  },
  {
    id: 34,
    title: 'Legal Document Sentiment',
    description: 'Analyze the tone of legal notices for better accessibility.',
    category: 'Sentiment',
    reward: 3.50,
    time: '15 min',
    icon: '⚖️',
    questions: [
      { text: 'Tone of this paragraph: "Failure to comply will result in immediate termination." — Sentiment?', type: 'radio', options: ['Formal/Neutral', 'Aggressive/Threatening', 'Informative', 'Persuasive'] },
    ]
  },
  {
    id: 35,
    title: 'Grocery App Feedback',
    description: 'Help improve the user experience of local grocery delivery apps.',
    category: 'Review',
    reward: 2.25,
    time: '11 min',
    icon: '🥖',
    questions: [
      { text: 'Which grocery app has the best delivery time estimation?', type: 'radio', options: ['Glovo', 'Uber Eats', 'Jumia Food', 'Other'] },
    ]
  },
  {
    id: 36,
    title: 'Product Catalog Cleanup',
    description: 'Identify duplicate items in a large e-commerce database.',
    category: 'Classification',
    reward: 1.80,
    time: '8 min',
    icon: '🗃️',
    questions: [
      { text: 'Product 1: "Unga wa Dola 2kg", Product 2: "Dola Maize Flour 2kg". Same item?', type: 'radio', options: ['Yes', 'No', 'Unsure'] },
    ]
  },
  {
    id: 37,
    title: 'Financial Goals Survey',
    description: 'Share your saving goals to help AI improve wealth management bots.',
    category: 'Survey',
    reward: 2.40,
    time: '12 min',
    icon: '🏦',
    questions: [
      { text: 'What is your primary financial goal for 2024?', type: 'textarea' },
    ]
  },
  {
    id: 38,
    title: 'Audio Sentiment Analysis',
    description: 'Determine the emotion of a speaker in a recorded voice message.',
    category: 'Sentiment',
    reward: 2.70,
    time: '10 min',
    icon: '🗣️',
    questions: [
      { text: 'Emotional tone of the speaker?', type: 'radio', options: ['Happy', 'Angry', 'Sad', 'Excited', 'Bored'] },
    ]
  },
  {
    id: 39,
    title: 'Technical Support Quality',
    description: 'Evaluate the accuracy of technical troubleshooting steps.',
    category: 'Review',
    reward: 3.00,
    time: '13 min',
    icon: '🔧',
    questions: [
      { text: 'Problem: "PC won\'t start". Instruction: "Check if the power cable is plugged in". Helpful?', type: 'radio', options: ['Very', 'Somewhat', 'Not really'] },
    ]
  },
  {
    id: 40,
    title: 'Home Decoration Survey',
    description: 'Share your interior design tastes for AI-driven home stylists.',
    category: 'Survey',
    reward: 2.30,
    time: '11 min',
    icon: '🏡',
    questions: [
      { text: 'Which style do you prefer for your living room?', type: 'radio', options: ['Minimalist', 'Bohemian', 'Modern', 'Rustic', 'Traditional'] },
    ]
  },
];

const WITHDRAWAL_DATA = [
  { phone: '+254 7** *** 234', amount: 'KES 2,450', time: '2 min ago' },
  { phone: '+254 7** *** 891', amount: 'KES 800', time: '5 min ago' },
  { phone: '+254 7** *** 112', amount: 'KES 5,200', time: '8 min ago' },
  { phone: '+254 7** *** 567', amount: 'KES 1,650', time: '12 min ago' },
  { phone: '+254 7** *** 743', amount: 'KES 3,800', time: '15 min ago' },
  { phone: '+254 7** *** 029', amount: 'KES 920', time: '19 min ago' },
  { phone: '+254 7** *** 385', amount: 'KES 4,100', time: '23 min ago' },
  { phone: '+254 7** *** 614', amount: 'KES 2,750', time: '31 min ago' },
];

const PLANS = [
  { id: 'beginner', name: 'Beginner', price: 300, tasksPerDay: 9, features: ['9 tasks/day', 'Basic surveys', 'M-Pesa withdrawals', 'Email support'] },
  { id: 'average', name: 'Average Skilled', price: 550, tasksPerDay: 15, features: ['15 tasks/day', 'All task types', 'Priority withdrawals', 'Chat support'], popular: true },
  { id: 'expert', name: 'Expert', price: 800, tasksPerDay: 25, features: ['25 tasks/day', 'Premium tasks', 'Same-day withdrawals', '24/7 support'] },
  { id: 'elite', name: 'Elite', price: 1200, tasksPerDay: 40, features: ['40 tasks/day', 'Elite-only tasks', 'Instant withdrawals', 'Dedicated manager'] },
];

const useStore = create(
  persist(
    (set, get) => ({
      // Auth
      user: null,
      isAuthenticated: false,
      assessmentDone: false,

      // Financial
      balance: 0,
      plan: null,
      earnings: [],

      // Tasks
      tasks: TASKS_DATA,
      completedTaskIds: [],
      tasksCompletedToday: 0,
      accuracyRate: 0,

      // Data
      withdrawals: WITHDRAWAL_DATA,
      plans: PLANS,

      // Actions
      register: (userData) => set({
        user: userData,
        isAuthenticated: true,
        assessmentDone: false,
        balance: 0,
        plan: null,
        earnings: [],
        completedTaskIds: [],
        tasksCompletedToday: 0,
        accuracyRate: 0,
      }),

      login: (userData) => set({ user: userData, isAuthenticated: true }),

      logout: () => set({
        user: null,
        isAuthenticated: false,
        // We preserve other state (progress, assessment, etc.)
      }),

      completeAssessment: () => {
        const welcomeBonus = 600; // KES
        set((state) => ({
          assessmentDone: true,
          balance: state.balance + welcomeBonus,
          accuracyRate: 96,
          earnings: [
            { id: Date.now(), type: 'bonus', description: 'Welcome Bonus', amount: welcomeBonus, date: new Date().toISOString() },
            ...state.earnings,
          ],
        }));
      },

      completeTask: (taskId) => {
        const task = get().tasks.find(t => t.id === taskId);
        if (!task) return;
        const rewardKES = Math.round(task.reward * 130); // Convert USD to KES approx
        set((state) => ({
          completedTaskIds: [...state.completedTaskIds, taskId],
          tasksCompletedToday: state.tasksCompletedToday + 1,
          balance: state.balance + rewardKES,
          accuracyRate: Math.min(99, state.accuracyRate + 0.5),
          earnings: [
            { id: Date.now(), type: 'task', description: task.title, amount: rewardKES, date: new Date().toISOString() },
            ...state.earnings,
          ],
        }));
      },

      selectPlan: (planId) => {
        const plan = PLANS.find(p => p.id === planId);
        if (!plan) return;
        set((state) => ({
          plan: planId,
          earnings: [
            { id: Date.now(), type: 'payment', description: `${plan.name} Plan - Monthly`, amount: -plan.price, date: new Date().toISOString() },
            ...state.earnings,
          ],
        }));
      },

      withdraw: (amount, phone) => {
        set((state) => ({
          balance: state.balance - amount,
          earnings: [
            { id: Date.now(), type: 'withdrawal', description: `M-Pesa Withdrawal to ${phone}`, amount: -amount, date: new Date().toISOString() },
            ...state.earnings,
          ],
        }));
      },

      getAvailableTasks: () => {
        const state = get();
        return state.tasks.filter(t => !state.completedTaskIds.includes(t.id));
      },

      getDailyLimit: () => {
        const state = get();
        const plan = PLANS.find(p => p.id === state.plan);
        return plan ? plan.tasksPerDay : 3;
      },

      canDoMoreTasks: () => {
        const state = get();
        return state.tasksCompletedToday < get().getDailyLimit();
      },
    }),
    {
      name: 'remotasks-storage',
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...persistedState,
        // Always enforce static data from the source code, ignoring persisted ones
        tasks: TASKS_DATA,
        plans: PLANS,
        withdrawals: WITHDRAWAL_DATA,
      }),
    }
  )
);

export { TASKS_DATA, PLANS };
export default useStore;
