import NoteReadingPage from "@/components/NoteReadingPage";

// Helper function to convert title to slug
function titleToSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim('-'); // Remove leading/trailing hyphens
}

// Sample notes data - in a real app, this would come from a database
const notesData = {
  "how-to-stay-productive-as-a-developer": {
    id: "101",
    title: "How to Stay Productive as a Developer",
    slug: "how-to-stay-productive-as-a-developer",
    content: `Discover actionable strategies and tips for maintaining productivity, focus, and motivation as a software developer, even when working remotely or facing distractions.\n\n## Tips\n1. **Set clear goals**: Know what you want to accomplish each day.\n2. **Eliminate distractions**: Use tools and routines to stay focused.\n3. **Take breaks**: Regular breaks boost creativity and prevent burnout.\n4. **Stay connected**: Collaborate and communicate with your team.`,
    author: { name: "Alex Kim", avatar: "/placeholder.svg", initials: "AK" },
    publishedDate: "Aug 1, 2024",
    readTime: "4 min read",
    category: "Productivity",
    tags: ["productivity", "developer", "focus", "motivation"],
    likes: 12,
    bookmarks: 5
  },
  "understanding-async-await-in-javascript": {
    id: "102",
    title: "Understanding Async/Await in JavaScript",
    slug: "understanding-async-await-in-javascript",
    content: `A beginner's guide to mastering async programming in JS.\n\nAsync/await makes asynchronous code easier to read and write.\n\n## Key Points\n1. **Async functions** return a promise.\n2. **Await** pauses execution until the promise resolves.\n3. **Error handling**: Use try/catch for async code.`,
    author: { name: "Priya S.", avatar: "/placeholder.svg", initials: "PS" },
    publishedDate: "Aug 2, 2024",
    readTime: "3 min read",
    category: "Tech",
    tags: ["javascript", "async", "await", "programming"],
    likes: 8,
    bookmarks: 3
  },
  "work-life-balance-for-remote-engineers": {
    id: "103",
    title: "Work-Life Balance for Remote Engineers",
    slug: "work-life-balance-for-remote-engineers",
    content: `How to set boundaries and thrive while working remotely.\n\n## Strategies\n1. **Set boundaries**: Define clear work and personal time.\n2. **Create a workspace**: Separate work from home life.\n3. **Stay active**: Incorporate movement into your day.\n4. **Connect socially**: Don't neglect team and social interactions.`,
    author: { name: "Maria L.", avatar: "/placeholder.svg", initials: "ML" },
    publishedDate: "Aug 3, 2024",
    readTime: "5 min read",
    category: "Life",
    tags: ["work-life", "remote", "engineer", "balance"],
    likes: 10,
    bookmarks: 2
  },
  "meeting-notes": {
    id: 1,
    title: "Meeting Notes",
    slug: "meeting-notes",
    content: `These are my comprehensive meeting notes from today's important discussion.

We covered several key topics including project timelines, budget allocations, and team responsibilities. The meeting was productive and we made significant progress on our quarterly goals.

## Key Discussion Points

1. **Project Timeline**: We reviewed the current project timeline and made adjustments to accommodate the new requirements.
2. **Budget Review**: The finance team presented the updated budget figures for Q2.
3. **Team Assignments**: New role assignments were discussed and finalized.
4. **Next Steps**: We outlined the action items for the coming weeks.

The team showed great collaboration and we're on track to meet our objectives. Follow-up meetings have been scheduled for next week.`,
    author: {
      name: "John Doe",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      initials: "JD"
    },
    publishedDate: "Jan 20, 2024",
    readTime: "3 min read",
    category: "Work",
    tags: ["meeting", "work", "planning", "team"],
    likes: 15,
    bookmarks: 8
  },
  "project-brainstorm": {
    id: 2,
    title: "Project Brainstorm",
    slug: "project-brainstorm",
    content: `Creative brainstorming session for our upcoming project. We explored various innovative approaches and potential solutions.

The session was highly productive with team members contributing diverse perspectives and creative ideas. We used various brainstorming techniques to generate and refine concepts.

## Brainstorming Techniques Used

1. **Mind Mapping**: Visual representation of ideas and their connections
2. **SCAMPER Method**: Systematic creative thinking approach
3. **Six Thinking Hats**: Different perspectives on the same problem
4. **Brainwriting**: Individual idea generation followed by group discussion

## Key Ideas Generated

- Innovative user interface designs
- New feature implementations
- Performance optimization strategies
- User experience improvements

The session concluded with a prioritized list of actionable ideas that we'll develop further in upcoming meetings.`,
    author: {
      name: "Sarah Wilson",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      initials: "SW"
    },
    publishedDate: "Jan 18, 2024",
    readTime: "4 min read",
    category: "Creative",
    tags: ["brainstorm", "creative", "project", "innovation"],
    likes: 28,
    bookmarks: 12
  },
  "grocery-list": {
    id: 3,
    title: "Grocery List",
    slug: "grocery-list",
    content: `My weekly grocery shopping list with all the essentials and some special items for upcoming events.

This list includes both regular household items and special ingredients for the dinner party I'm hosting this weekend.

## Fresh Produce
- Organic spinach
- Cherry tomatoes
- Avocados (3-4 pieces)
- Bananas
- Apples (Honeycrisp)
- Lemons

## Pantry Items
- Olive oil (extra virgin)
- Quinoa
- Brown rice
- Canned beans (black beans, chickpeas)
- Pasta (whole wheat)

## Dairy & Proteins
- Greek yogurt
- Almond milk
- Free-range eggs
- Salmon fillets
- Chicken breast

## Special Items for Dinner Party
- Fresh herbs (basil, cilantro)
- Parmesan cheese
- Pine nuts
- Balsamic vinegar

Remember to check for organic options and compare prices between different brands.`,
    author: {
      name: "Emily Chen",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      initials: "EC"
    },
    publishedDate: "Jan 22, 2024",
    readTime: "2 min read",
    category: "Personal",
    tags: ["shopping", "food", "planning", "personal"],
    likes: 8,
    bookmarks: 3
  },
  "travel-plans": {
    id: 4,
    title: "Travel Plans",
    slug: "travel-plans",
    content: `Detailed travel itinerary and planning notes for my upcoming vacation to tropical destinations.

This trip has been months in the planning, and I'm excited to finally put all the pieces together. The itinerary includes a mix of relaxation, adventure, and cultural experiences.

## Destination Overview
We'll be visiting three beautiful islands over the course of 10 days, each offering unique experiences and breathtaking scenery.

## Day-by-Day Itinerary

**Days 1-3: Island Paradise**
- Arrival and hotel check-in
- Beach relaxation and swimming
- Sunset dinner cruise
- Local market exploration

**Days 4-6: Adventure Island**
- Hiking to waterfalls
- Snorkeling and diving
- Zip-lining through rainforest
- Cultural village visit

**Days 7-10: Cultural Immersion**
- Historical site tours
- Cooking classes with locals
- Art gallery visits
- Traditional music and dance shows

## Packing Essentials
- Lightweight, breathable clothing
- Waterproof camera
- Reef-safe sunscreen
- Comfortable hiking shoes
- Snorkeling gear

The weather forecast looks perfect, and I can't wait to disconnect from work and enjoy this well-deserved break.`,
    author: {
      name: "Michael Rodriguez",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      initials: "MR"
    },
    publishedDate: "Jan 16, 2024",
    readTime: "6 min read",
    category: "Travel",
    tags: ["travel", "vacation", "planning", "adventure"],
    likes: 35,
    bookmarks: 22
  },
  "book-recommendations": {
    id: 5,
    title: "Book Recommendations",
    slug: "book-recommendations",
    content: `A curated list of my favorite books from this year, spanning various genres and topics.

Reading has been a constant source of inspiration and learning for me. These books have particularly stood out and I highly recommend them to fellow book lovers.

## Fiction Favorites

**"The Seven Husbands of Evelyn Hugo"** by Taylor Jenkins Reid
A captivating story about a reclusive Hollywood icon who finally decides to tell her story. The narrative is engaging and the character development is exceptional.

**"Klara and the Sun"** by Kazuo Ishiguro
A beautiful and thought-provoking novel told from the perspective of an artificial friend. Ishiguro's prose is elegant and the themes are deeply moving.

## Non-Fiction Gems

**"Atomic Habits"** by James Clear
Practical strategies for building good habits and breaking bad ones. The book provides actionable advice backed by scientific research.

**"Educated"** by Tara Westover
A powerful memoir about education, family, and the struggle between loyalty and independence. Westover's writing is both beautiful and heartbreaking.

## Business & Self-Development

**"The Psychology of Money"** by Morgan Housel
Insightful perspectives on how psychology affects our financial decisions. The book combines storytelling with practical financial wisdom.

Each of these books has left a lasting impact on my thinking and I find myself returning to their lessons regularly.`,
    author: {
      name: "Lisa Thompson",
      avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
      initials: "LT"
    },
    publishedDate: "Jan 14, 2024",
    readTime: "5 min read",
    category: "Books",
    tags: ["books", "reading", "recommendations", "literature"],
    likes: 42,
    bookmarks: 28
  },
  "personal-journal": {
    id: 6,
    title: "Personal Journal",
    slug: "personal-journal",
    content: `Reflections on personal growth, daily experiences, and life lessons learned along the way.

Journaling has become an essential part of my daily routine. It helps me process experiences, track personal growth, and maintain perspective on what truly matters.

## Morning Reflections

Today started with a beautiful sunrise and a sense of gratitude for the opportunities ahead. I've been practicing mindfulness more consistently, and it's making a noticeable difference in how I approach challenges.

## Key Insights from This Week

1. **Patience is a Practice**: Learning to be patient with myself and others requires daily effort
2. **Small Steps Matter**: Consistent small actions lead to significant changes over time
3. **Connection is Essential**: Meaningful relationships are the foundation of happiness
4. **Growth Through Discomfort**: The most valuable lessons come from stepping outside my comfort zone

## Goals for Next Week

- Continue morning meditation practice
- Reach out to old friends I haven't spoken to in a while
- Try a new creative activity
- Spend more time in nature

## Evening Gratitude

I'm grateful for:
- Good health and energy
- Supportive family and friends
- Opportunities to learn and grow
- Simple pleasures like a good book and warm coffee

Journaling continues to be a powerful tool for self-reflection and personal development. It's amazing how writing down thoughts can bring such clarity.`,
    author: {
      name: "David Park",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      initials: "DP"
    },
    publishedDate: "Jan 12, 2024",
    readTime: "4 min read",
    category: "Personal",
    tags: ["journal", "reflection", "growth", "mindfulness"],
    likes: 19,
    bookmarks: 14
  },
  "recipe-collection": {
    id: 7,
    title: "Recipe Collection",
    slug: "recipe-collection",
    content: `My curated collection of favorite recipes from around the world, tested and perfected over time.

Cooking has become one of my greatest passions, and this collection represents years of experimentation, family traditions, and culinary adventures.

## Italian Classics

**Homemade Pasta Carbonara**
- 400g spaghetti
- 200g pancetta or guanciale
- 4 large eggs
- 100g Pecorino Romano cheese
- Fresh black pepper
- Salt

The secret is to remove the pan from heat before adding the egg mixture to prevent scrambling.

**Margherita Pizza Dough**
- 500g tipo 00 flour
- 325ml warm water
- 10g salt
- 3g active dry yeast
- 2 tbsp olive oil

Let the dough rise for at least 24 hours in the refrigerator for best flavor.

## Asian Fusion

**Korean-Style Beef Bulgogi**
- 1kg thinly sliced ribeye
- Soy sauce, sesame oil, garlic marinade
- Asian pear for natural sweetness
- Serve with steamed rice and kimchi

**Thai Green Curry**
- Fresh green chilies, lemongrass, galangal
- Coconut milk base
- Thai basil and lime leaves
- Perfect balance of sweet, spicy, and aromatic

## Comfort Food Favorites

**Grandmother's Chicken Soup**
- Free-range chicken, slow-simmered
- Fresh vegetables and herbs
- Homemade egg noodles
- The ultimate comfort food for any season

Each recipe tells a story and brings people together around the dinner table.`,
    author: {
      name: "Maria Rodriguez",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      initials: "MR"
    },
    publishedDate: "Jan 16, 2024",
    readTime: "6 min read",
    category: "Food",
    tags: ["recipes", "cooking", "food", "international"],
    likes: 67,
    bookmarks: 45
  },
  "workout-routine": {
    id: 8,
    title: "Workout Routine",
    slug: "workout-routine",
    content: `My comprehensive fitness routine designed for strength, endurance, and overall wellness.

After years of trial and error, I've developed a sustainable workout plan that fits into my busy schedule while delivering consistent results.

## Weekly Schedule

**Monday - Upper Body Strength**
- Push-ups: 3 sets of 12-15
- Pull-ups: 3 sets of 8-10
- Dumbbell rows: 3 sets of 12
- Shoulder press: 3 sets of 10
- Plank: 3 sets of 60 seconds

**Tuesday - Cardio & Core**
- 30-minute run or cycling
- Russian twists: 3 sets of 20
- Mountain climbers: 3 sets of 30
- Dead bugs: 3 sets of 10 each side

**Wednesday - Lower Body**
- Squats: 3 sets of 15
- Lunges: 3 sets of 12 each leg
- Deadlifts: 3 sets of 10
- Calf raises: 3 sets of 20
- Hip bridges: 3 sets of 15

**Thursday - Active Recovery**
- 20-minute walk
- Yoga or stretching
- Foam rolling

**Friday - Full Body Circuit**
- Burpees: 3 sets of 8
- Kettlebell swings: 3 sets of 15
- Push-up to T: 3 sets of 10
- Jump squats: 3 sets of 12

**Weekend - Outdoor Activities**
- Hiking, swimming, or sports
- Focus on fun and movement

## Nutrition Notes

- Protein within 30 minutes post-workout
- Stay hydrated throughout the day
- Balance of carbs, protein, and healthy fats
- Listen to your body and rest when needed

Consistency beats perfection. The best workout is the one you'll actually do.`,
    author: {
      name: "Alex Johnson",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      initials: "AJ"
    },
    publishedDate: "Jan 15, 2024",
    readTime: "5 min read",
    category: "Health",
    tags: ["fitness", "workout", "health", "exercise"],
    likes: 89,
    bookmarks: 56
  },
  "learning-goals": {
    id: 9,
    title: "Learning Goals",
    slug: "learning-goals",
    content: `My learning objectives and skill development plan for continuous personal and professional growth.

Lifelong learning is essential in today's rapidly changing world. These goals represent my commitment to staying curious and expanding my knowledge.

## Technical Skills

**Programming & Development**
- Master React and Next.js frameworks
- Learn TypeScript for better code quality
- Explore machine learning with Python
- Understand cloud architecture (AWS/Azure)

**Data & Analytics**
- SQL query optimization
- Data visualization with D3.js
- Statistical analysis fundamentals
- Business intelligence tools

## Creative Skills

**Design & UX**
- Figma for interface design
- User research methodologies
- Accessibility best practices
- Color theory and typography

**Content Creation**
- Technical writing
- Video editing basics
- Photography composition
- Storytelling techniques

## Language Learning

**Spanish** (Intermediate → Advanced)
- Daily conversation practice
- Business Spanish vocabulary
- Cultural immersion through media
- Target: Fluency by end of year

**Mandarin** (Beginner)
- Basic characters and pronunciation
- Essential phrases for travel
- Cultural context understanding

## Professional Development

**Leadership & Management**
- Team building strategies
- Conflict resolution
- Project management methodologies
- Public speaking confidence

**Industry Knowledge**
- Emerging technology trends
- Market analysis skills
- Networking and relationship building
- Strategic thinking frameworks

## Learning Methods

- Online courses (Coursera, Udemy)
- Books and audiobooks
- Hands-on projects
- Mentorship and peer learning
- Conference attendance
- Practice and application

The goal is not just to accumulate knowledge, but to apply it meaningfully in real-world situations.`,
    author: {
      name: "Rachel Kim",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      initials: "RK"
    },
    publishedDate: "Jan 13, 2024",
    readTime: "7 min read",
    category: "Education",
    tags: ["learning", "goals", "skills", "development"],
    likes: 34,
    bookmarks: 28
  },
  "garden-planning": {
    id: 10,
    title: "Garden Planning",
    slug: "garden-planning",
    content: `Planning my dream garden for the upcoming growing season with a focus on sustainability and biodiversity.

Gardening has become my meditation and connection to nature. This year's plan emphasizes native plants, companion planting, and creating a habitat for beneficial insects.

## Spring Planting (March-May)

**Vegetables**
- Tomatoes: Cherokee Purple, San Marzano
- Peppers: Bell peppers, jalapeños
- Herbs: Basil, oregano, thyme, rosemary
- Lettuce and spinach for early harvest
- Radishes and carrots in succession

**Flowers**
- Marigolds for pest control
- Sunflowers along the back fence
- Zinnias for cutting garden
- Native wildflower mix

## Summer Maintenance

**Watering Strategy**
- Drip irrigation system installation
- Mulching to retain moisture
- Rain barrel collection system
- Morning watering schedule

**Pest Management**
- Beneficial insect hotel
- Companion planting (tomatoes with basil)
- Neem oil for organic treatment
- Regular inspection and early intervention

## Fall Preparation

**Cover Crops**
- Crimson clover for nitrogen fixing
- Winter rye to prevent erosion
- Buckwheat to improve soil structure

**Perennial Additions**
- Fruit trees: apple, pear, cherry
- Berry bushes: blueberries, raspberries
- Asparagus bed establishment
- Rhubarb for early spring harvest

## Composting System

**Three-Bin Method**
- Active pile for fresh materials
- Turning pile for decomposition
- Finished compost ready for use

**Materials**
- Kitchen scraps (no meat/dairy)
- Yard waste and fallen leaves
- Coffee grounds from local café
- Proper carbon to nitrogen ratio

## Wildlife Habitat

**Bird-Friendly Features**
- Native berry-producing plants
- Water feature with shallow areas
- Nesting boxes for different species
- Seed-producing flowers left standing

**Pollinator Support**
- Continuous bloom succession
- Native plant emphasis
- Pesticide-free environment
- Diverse flower shapes and colors

The garden is not just about growing food, but creating a thriving ecosystem that supports all forms of life.`,
    author: {
      name: "Tom Wilson",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      initials: "TW"
    },
    publishedDate: "Jan 11, 2024",
    readTime: "8 min read",
    category: "Gardening",
    tags: ["garden", "plants", "sustainability", "nature"],
    likes: 52,
    bookmarks: 38
  },
  "photography-tips": {
    id: 11,
    title: "Photography Tips",
    slug: "photography-tips",
    content: `Essential photography techniques and tips I've learned through years of capturing moments and telling stories through images.

Photography is about seeing the world differently and sharing that unique perspective with others. These tips have transformed my approach to visual storytelling.

## Composition Fundamentals

**Rule of Thirds**
- Place subjects along grid lines
- Intersections create natural focal points
- Break the rule intentionally for impact
- Use camera grid overlay for practice

**Leading Lines**
- Roads, fences, rivers guide the eye
- Diagonal lines create dynamic energy
- S-curves add graceful movement
- Architectural elements as guides

**Framing**
- Natural frames: trees, archways, windows
- Creates depth and context
- Draws attention to the subject
- Adds layers to the composition

## Lighting Mastery

**Golden Hour Magic**
- First hour after sunrise
- Last hour before sunset
- Warm, soft, directional light
- Long shadows add dimension

**Blue Hour Atmosphere**
- 20-30 minutes after sunset
- Even, diffused light
- Perfect for cityscapes
- Balanced ambient and artificial light

**Overcast Advantages**
- Natural softbox effect
- Even lighting for portraits
- Saturated colors
- No harsh shadows

Remember: the best camera is the one you have with you. Technical perfection matters less than capturing the moment and emotion.`,
    author: {
      name: "Sophie Chen",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      initials: "SC"
    },
    publishedDate: "Jan 10, 2024",
    readTime: "9 min read",
    category: "Photography",
    tags: ["photography", "tips", "composition", "lighting"],
    likes: 124,
    bookmarks: 89
  },
  "budget-planning": {
    id: 12,
    title: "Budget Planning",
    slug: "budget-planning",
    content: `My comprehensive approach to personal finance management and long-term wealth building strategies.

Effective budgeting isn't about restriction—it's about intentional spending that aligns with your values and goals.

## Monthly Budget Breakdown

**Fixed Expenses (50%)**
- Rent/Mortgage: $1,200
- Utilities: $150
- Insurance: $200
- Phone: $50
- Internet: $60
- Subscriptions: $40

**Variable Expenses (30%)**
- Groceries: $400
- Transportation: $200
- Dining out: $150
- Entertainment: $100
- Personal care: $75
- Miscellaneous: $75

**Savings & Investments (20%)**
- Emergency fund: $300
- Retirement (401k): $400
- Investment account: $200
- Vacation fund: $100

## Emergency Fund Strategy

**Target Amount**
- 6 months of essential expenses
- Currently at $8,000 (goal: $12,000)
- High-yield savings account
- Automatic monthly transfers

**Emergency Criteria**
- Job loss or income reduction
- Major medical expenses
- Essential home/car repairs
- NOT for vacations or wants

Budgeting is a skill that improves with practice. Start simple, be consistent, and adjust as your life changes.`,
    author: {
      name: "James Miller",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      initials: "JM"
    },
    publishedDate: "Jan 9, 2024",
    readTime: "8 min read",
    category: "Finance",
    tags: ["budget", "finance", "money", "planning"],
    likes: 78,
    bookmarks: 62
  },
  "home-improvement": {
    id: 13,
    title: "Home Improvement",
    slug: "home-improvement",
    content: `My ongoing home renovation projects and improvement plans to create a more functional and beautiful living space.

Home improvement is a journey of creating spaces that reflect your personality while adding value and functionality.

## Current Projects

**Kitchen Renovation**
- Cabinet painting: Benjamin Moore Simply White
- New hardware: Brushed brass pulls
- Subway tile backsplash installation
- Under-cabinet LED lighting
- Budget: $3,500 | Timeline: 3 weeks

**Bathroom Updates**
- Replace vanity with floating design
- Install rainfall showerhead
- Add storage niches in shower
- Heated tile floors
- Budget: $4,200 | Timeline: 2 weeks

**Living Room Refresh**
- Paint accent wall: Deep navy blue
- Built-in shelving around fireplace
- Hardwood floor refinishing
- Window treatment upgrades
- Budget: $2,800 | Timeline: 4 weeks

## Planned Improvements

**Outdoor Spaces**
- Deck staining and sealing
- Landscape design with native plants
- Outdoor lighting installation
- Fire pit area creation
- Vegetable garden expansion

**Energy Efficiency**
- Smart thermostat installation
- Window weatherstripping
- Attic insulation upgrade
- LED lighting throughout
- Energy audit scheduling

## DIY vs. Professional

**DIY Projects**
- Painting (walls, cabinets, trim)
- Basic plumbing (faucets, toilets)
- Flooring (laminate, vinyl)
- Landscaping and gardening
- Simple electrical (switches, outlets)

**Professional Jobs**
- Major electrical work
- Plumbing rough-in
- Structural changes
- HVAC installation
- Roofing and siding

Home improvement is about creating spaces that enhance your daily life and bring you joy every time you walk through the door.`,
    author: {
      name: "Linda Davis",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      initials: "LD"
    },
    publishedDate: "Jan 8, 2024",
    readTime: "7 min read",
    category: "Home",
    tags: ["home", "renovation", "DIY", "improvement"],
    likes: 95,
    bookmarks: 71
  },
  "movie-watchlist": {
    id: 14,
    title: "Movie Watchlist",
    slug: "movie-watchlist",
    content: `My curated list of must-watch films across genres, from classic cinema to modern masterpieces.

Movies have the power to transport us, challenge our perspectives, and create shared cultural experiences. This watchlist represents films that have shaped cinema and continue to inspire.

## Classic Cinema

**Citizen Kane (1941)**
- Orson Welles' masterpiece
- Revolutionary cinematography
- Timeless story of power and corruption
- Status: ✅ Watched - 5/5 stars

**Casablanca (1942)**
- Humphrey Bogart and Ingrid Bergman
- Perfect screenplay and dialogue
- Romance set against WWII backdrop
- Status: ✅ Watched - 5/5 stars

**The Godfather Trilogy**
- Francis Ford Coppola's epic
- Marlon Brando's iconic performance
- Family saga spanning decades
- Status: ✅ Parts I & II watched, III pending

## Modern Masterpieces

**Parasite (2019)**
- Bong Joon-ho's social thriller
- Perfect blend of genres
- Academy Award Best Picture
- Status: ✅ Watched - 5/5 stars

**Mad Max: Fury Road (2015)**
- George Miller's action spectacle
- Practical effects mastery
- Feminist action hero narrative
- Status: ✅ Watched - 4/5 stars

**Moonlight (2016)**
- Barry Jenkins' coming-of-age story
- Beautiful cinematography
- Powerful performance by cast
- Status: 📝 Priority watch

## Sci-Fi & Fantasy

**Blade Runner 2049 (2017)**
- Denis Villeneuve's sequel
- Stunning visual effects
- Philosophical depth
- Status: ✅ Watched - 4/5 stars

**The Lord of the Rings Trilogy**
- Peter Jackson's epic adaptation
- Groundbreaking visual effects
- Epic storytelling
- Status: ✅ Extended editions watched

## Horror & Thriller

**The Shining (1980)**
- Stanley Kubrick's psychological horror
- Jack Nicholson's iconic performance
- Masterful use of space and sound
- Status: ✅ Watched - 4/5 stars

**Get Out (2017)**
- Jordan Peele's social thriller
- Brilliant social commentary
- Perfect blend of horror and satire
- Status: ✅ Watched - 5/5 stars

## Viewing Goals

**Monthly Target**: 4-6 films
**Annual Goal**: 50+ films
**Focus Areas**: International cinema, film noir, documentaries
**Platforms**: Criterion Channel, local arthouse theater, streaming services

Cinema is the art form of our time, capable of combining all other arts into a singular, powerful experience.`,
    author: {
      name: "Chris Anderson",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      initials: "CA"
    },
    publishedDate: "Jan 7, 2024",
    readTime: "6 min read",
    category: "Entertainment",
    tags: ["movies", "cinema", "watchlist", "film"],
    likes: 156,
    bookmarks: 98
  },
  "tech-trends": {
    id: 15,
    title: "Tech Trends",
    slug: "tech-trends",
    content: `Exploring the latest technology trends and their potential impact on society, business, and daily life.

Staying current with technology trends is essential for understanding where our world is heading and how to adapt and thrive in an increasingly digital landscape.

## Artificial Intelligence & Machine Learning

**Large Language Models**
- GPT-4 and beyond capabilities
- Multimodal AI (text, image, audio)
- Code generation and debugging
- Creative writing and content creation
- Ethical considerations and limitations

**AI in Business**
- Customer service automation
- Predictive analytics
- Process optimization
- Personalized recommendations
- Decision support systems

## Web Development Evolution

**Frontend Frameworks**
- React 18 with concurrent features
- Next.js 13+ app directory
- Svelte and SvelteKit growth
- Vue 3 composition API
- Web Components adoption

**Backend Technologies**
- Serverless architecture expansion
- Edge computing benefits
- GraphQL vs REST APIs
- Microservices patterns
- Container orchestration

## Cloud Computing Advances

**Multi-Cloud Strategies**
- Avoiding vendor lock-in
- Best-of-breed services
- Cost optimization
- Disaster recovery
- Geographic distribution

**Edge Computing**
- Reduced latency benefits
- IoT device processing
- Content delivery networks
- Real-time applications
- 5G network integration

## Cybersecurity Focus

**Zero Trust Architecture**
- Never trust, always verify
- Identity-based security
- Micro-segmentation
- Continuous monitoring
- Least privilege access

**Privacy Regulations**
- GDPR compliance requirements
- Data protection by design
- User consent management
- Right to be forgotten
- Cross-border data transfers

## Emerging Technologies

**Quantum Computing**
- Current limitations and potential
- Cryptography implications
- Scientific research applications
- Timeline for practical use
- Investment and research trends

**Augmented Reality (AR)**
- Mobile AR applications
- Industrial training uses
- Retail and e-commerce
- Social media integration
- Hardware improvements

## Future Predictions

**Next 2-3 Years**
- AI integration in all software
- Voice interfaces mainstream
- Remote work technology maturity
- Sustainable tech focus
- Privacy-first design

**Long-term Vision**
- Fully autonomous systems
- Brain-computer interfaces
- Sustainable computing
- Universal basic connectivity
- Ethical AI governance

The key to thriving in this technological evolution is continuous learning and adaptability.`,
    author: {
      name: "Kevin Zhang",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      initials: "KZ"
    },
    publishedDate: "Jan 6, 2024",
    readTime: "10 min read",
    category: "Technology",
    tags: ["technology", "trends", "AI", "future"],
    likes: 203,
    bookmarks: 145
  },
  "event-planning": {
    id: 16,
    title: "Event Planning",
    slug: "event-planning",
    content: `Comprehensive guide to planning memorable events, from intimate gatherings to large celebrations.

Event planning is about creating experiences that bring people together and leave lasting memories. Here's my approach to organizing successful events.

## Upcoming Events

**Summer Garden Party**
- Date: July 15th, 2024
- Guests: 25-30 people
- Theme: Mediterranean garden party
- Budget: $800
- Venue: Backyard with string lights

**Anniversary Celebration**
- Date: August 20th, 2024
- Guests: 50 people
- Theme: Elegant dinner party
- Budget: $1,500
- Venue: Private dining room

## Planning Timeline

**8 Weeks Before**
- Set date and create guest list
- Choose venue and theme
- Send save-the-dates
- Book vendors (catering, music)

**4 Weeks Before**
- Send formal invitations
- Finalize menu and decorations
- Confirm RSVPs
- Create detailed timeline

**1 Week Before**
- Final headcount confirmation
- Prepare decorations
- Coordinate with vendors
- Create day-of schedule

## Menu Planning

**Appetizers**
- Mediterranean mezze platter
- Bruschetta with fresh tomatoes
- Stuffed mushrooms
- Cheese and charcuterie board

**Main Course**
- Grilled salmon with herbs
- Vegetarian pasta primavera
- Roasted seasonal vegetables
- Fresh garden salad

**Desserts**
- Tiramisu cups
- Fresh fruit tart
- Chocolate-dipped strawberries
- Coffee and tea service

## Decoration Ideas

**Garden Party Theme**
- String lights and lanterns
- Fresh flower centerpieces
- Linen tablecloths in earth tones
- Potted herbs as party favors

**Entertainment**
- Acoustic guitar playlist
- Outdoor games setup
- Photo booth with props
- Sunset cocktail hour

Successful events are about attention to detail and creating an atmosphere where guests feel welcomed and celebrated.`,
    author: {
      name: "Jessica Taylor",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      initials: "JT"
    },
    publishedDate: "Jan 5, 2024",
    readTime: "6 min read",
    category: "Events",
    tags: ["events", "planning", "party", "celebration"],
    likes: 87,
    bookmarks: 54
  },
  "career-goals": {
    id: 17,
    title: "Career Goals",
    slug: "career-goals",
    content: `My professional development roadmap and career aspirations for the next five years.

Career growth requires intentional planning, continuous learning, and strategic networking. These goals represent my commitment to professional excellence.

## Short-term Goals (1-2 Years)

**Technical Skills Enhancement**
- Complete AWS Solutions Architect certification
- Master advanced React patterns and performance optimization
- Learn system design principles
- Contribute to open-source projects

**Leadership Development**
- Lead a cross-functional project team
- Mentor junior developers
- Improve public speaking skills
- Take on technical writing responsibilities

**Professional Network**
- Attend 4 industry conferences annually
- Join professional associations
- Build relationships with industry leaders
- Participate in tech meetups and workshops

## Medium-term Goals (3-5 Years)

**Career Advancement**
- Transition to Senior Software Engineer role
- Take on architectural decision-making
- Lead product development initiatives
- Build and manage a development team

**Expertise Development**
- Become subject matter expert in cloud architecture
- Develop expertise in machine learning applications
- Master DevOps and CI/CD practices
- Understand business strategy and product management

**Industry Impact**
- Speak at major tech conferences
- Publish technical articles and tutorials
- Contribute to industry standards
- Mentor the next generation of developers

## Long-term Vision (5+ Years)

**Leadership Role**
- Engineering Manager or Technical Director
- Drive technical strategy for organization
- Build high-performing engineering teams
- Influence product roadmap and business decisions

**Entrepreneurial Aspirations**
- Launch a tech startup
- Develop innovative software solutions
- Build products that solve real-world problems
- Create jobs and opportunities for others

## Skill Development Plan

**Technical Skills**
- Cloud platforms (AWS, Azure, GCP)
- Microservices architecture
- Machine learning and AI
- Mobile development (React Native)
- Blockchain and Web3 technologies

**Soft Skills**
- Strategic thinking
- Team leadership
- Communication and presentation
- Project management
- Business acumen

## Networking Strategy

**Online Presence**
- Maintain active LinkedIn profile
- Share insights on Twitter
- Contribute to GitHub projects
- Write technical blog posts

**Industry Engagement**
- Conference speaking opportunities
- Panel discussions and webinars
- Podcast guest appearances
- Industry advisory roles

## Success Metrics

**Professional Growth**
- Salary progression targets
- Responsibility expansion
- Team size and impact
- Industry recognition

**Personal Satisfaction**
- Work-life balance maintenance
- Continuous learning engagement
- Meaningful project contributions
- Positive team relationships

Success is not just about climbing the corporate ladder, but about making meaningful contributions to technology and society.`,
    author: {
      name: "Michael Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      initials: "MC"
    },
    publishedDate: "Jan 4, 2024",
    readTime: "8 min read",
    category: "Career",
    tags: ["career", "goals", "professional", "development"],
    likes: 142,
    bookmarks: 97
  },
  "music-playlist": {
    id: 18,
    title: "Music Playlist",
    slug: "music-playlist",
    content: `My curated collection of songs that soundtrack different moods, activities, and moments in life.

Music has the power to transport us, energize us, and connect us to our emotions. These playlists are carefully crafted for various life situations.

## Focus & Productivity

**Instrumental Focus**
- Ólafur Arnalds - "Near Light"
- Max Richter - "On The Nature of Daylight"
- Nils Frahm - "Says"
- Kiasmos - "Blurred EP"
- GoGo Penguin - "Hopopono"

**Lo-Fi Hip Hop**
- Nujabes - "Aruarian Dance"
- J Dilla - "Time: The Donut of the Heart"
- Emancipator - "Soon It Will Be Cold Enough"
- Bonobo - "Kong"
- Tycho - "A Walk"

## Workout Energy

**High-Intensity Training**
- The Prodigy - "Spitfire"
- Pendulum - "Propane Nightmares"
- Skrillex - "Bangarang"
- Deadmau5 - "Ghosts 'n' Stuff"
- Justice - "Genesis"

**Running Rhythm**
- LCD Soundsystem - "Dance Yrself Clean"
- Daft Punk - "Harder Better Faster Stronger"
- Chemical Brothers - "Go"
- Fatboy Slim - "Right Here, Right Now"
- Moby - "Flower"

## Chill & Relaxation

**Sunday Morning**
- Bon Iver - "Holocene"
- Iron & Wine - "Boy with a Coin"
- The National - "Bloodbuzz Ohio"
- Fleet Foxes - "White Winter Hymnal"
- Sufjan Stevens - "Mystery of Love"

**Evening Wind Down**
- Radiohead - "Daydreaming"
- Thom Yorke - "Hearing Damage"
- Sigur Rós - "Hoppípolla"
- Explosions in the Sky - "Your Hand in Mine"
- Godspeed You! Black Emperor - "East Hastings"

## Road Trip Adventures

**Classic Rock Essentials**
- Queen - "Don't Stop Me Now"
- The Beatles - "Come On Eileen"
- Fleetwood Mac - "Go Your Own Way"
- Tom Petty - "Free Fallin'"
- Eagles - "Take It Easy"

**Modern Indie**
- Arctic Monkeys - "Do I Wanna Know?"
- Tame Impala - "Feels Like We Only Go Backwards"
- The Strokes - "Last Nite"
- Vampire Weekend - "A-Punk"
- Foster the People - "Pumped Up Kicks"

## Seasonal Moods

**Summer Vibes**
- Kygo - "Firestone"
- Disclosure - "Latch"
- Calvin Harris - "Feel So Close"
- Avicii - "Wake Me Up"
- Swedish House Mafia - "Don't You Worry Child"

**Winter Contemplation**
- Bon Iver - "Re: Stacks"
- The Paper Kites - "Bloom"
- Daughter - "Youth"
- City and Colour - "The Girl"
- Phoebe Bridgers - "Motion Sickness"

## Discovery Queue

**Recently Added**
- Parcels - "Overnight"
- RÜFÜS DU SOL - "Innerbloom"
- Odesza - "Say My Name"
- Lane 8 - "Road"
- Yotto - "The One You Left Behind"

**Genres to Explore**
- Afrobeat and world music
- Jazz fusion and experimental
- Ambient and drone music
- Post-rock and shoegaze
- Electronic and synthwave

Music is the soundtrack to our lives, and the right song at the right moment can transform an ordinary experience into something magical.`,
    author: {
      name: "Alex Rivera",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      initials: "AR"
    },
    publishedDate: "Jan 3, 2024",
    readTime: "7 min read",
    category: "Music",
    tags: ["music", "playlist", "songs", "mood"],
    likes: 189,
    bookmarks: 112
  },
  "weekend-projects": {
    id: 19,
    title: "Weekend Projects",
    slug: "weekend-projects",
    content: `Creative and practical projects to tackle during weekends, combining productivity with personal satisfaction.

Weekends are perfect for diving into projects that we don't have time for during busy weekdays. These projects range from quick fixes to longer creative endeavors.

## Current Projects

**DIY Floating Shelves**
- Materials: Pine wood, brackets, stain
- Tools needed: Drill, level, stud finder
- Estimated time: 4-6 hours
- Budget: $75
- Status: Planning phase

**Garden Herb Spiral**
- Design: Permaculture-inspired spiral garden
- Plants: Basil, rosemary, thyme, oregano
- Materials: Stones, soil, compost
- Estimated time: Full weekend
- Budget: $120
- Status: Site preparation

**Photo Organization Project**
- Goal: Digitize and organize 10 years of photos
- Tools: Scanner, cloud storage, photo software
- Estimated time: 3-4 weekends
- Budget: $50 (storage)
- Status: 30% complete

## Quick Weekend Fixes

**Home Maintenance**
- Caulk bathroom tiles
- Touch up paint on walls
- Clean and organize garage
- Replace air filters
- Deep clean appliances

**Organization Projects**
- Closet decluttering
- Digital file organization
- Spice rack reorganization
- Book collection sorting
- Cable management setup

## Creative Projects

**Woodworking**
- Build a simple coffee table
- Create custom picture frames
- Make a wooden plant stand
- Craft a spice rack
- Design a bookshelf

**Crafts & Art**
- Watercolor landscape painting
- Macrame plant hangers
- Pottery wheel session
- Jewelry making workshop
- Calligraphy practice

## Technology Projects

**Smart Home Setup**
- Install smart light switches
- Set up home automation
- Configure security cameras
- Create media server
- Optimize WiFi network

**Learning Projects**
- Build a personal website
- Create a mobile app prototype
- Set up a home lab server
- Learn Arduino programming
- Experiment with 3D printing

## Seasonal Projects

**Spring/Summer**
- Garden bed preparation
- Outdoor furniture restoration
- Deck cleaning and staining
- Window screen repairs
- Sprinkler system maintenance

**Fall/Winter**
- Winterizing outdoor equipment
- Holiday decoration crafting
- Indoor plant propagation
- Cozy reading nook creation
- Fireplace maintenance

## Project Planning Tips

**Preparation**
- Research thoroughly before starting
- Gather all materials in advance
- Set realistic time expectations
- Have backup plans ready
- Consider skill level honestly

**Execution**
- Start early in the day
- Take breaks to avoid fatigue
- Document progress with photos
- Don't rush the finishing touches
- Clean up as you go

**Tools & Workspace**
- Invest in quality basic tools
- Organize workspace efficiently
- Ensure proper lighting
- Have safety equipment ready
- Keep first aid kit accessible

Weekend projects are about more than just getting things done—they're opportunities for creativity, learning, and the satisfaction of building something with your own hands.`,
    author: {
      name: "Ryan Thompson",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      initials: "RT"
    },
    publishedDate: "Jan 2, 2024",
    readTime: "8 min read",
    category: "DIY",
    tags: ["projects", "DIY", "weekend", "crafts"],
    likes: 134,
    bookmarks: 78
  },
  "mindfulness-practice": {
    id: 20,
    title: "Mindfulness Practice",
    slug: "mindfulness-practice",
    content: `My journey with mindfulness meditation and techniques for cultivating present-moment awareness in daily life.

Mindfulness has transformed how I experience life, reducing stress and increasing appreciation for simple moments. This practice continues to evolve and deepen.

## Daily Practice Routine

**Morning Meditation (20 minutes)**
- 5 minutes: Breath awareness
- 10 minutes: Body scan meditation
- 5 minutes: Loving-kindness practice
- Setting intention for the day
- Gratitude reflection

**Midday Check-in (5 minutes)**
- Three conscious breaths
- Body tension release
- Emotional state awareness
- Mindful transition between activities
- Brief walking meditation

**Evening Reflection (15 minutes)**
- Day review without judgment
- Gratitude journaling
- Stress release visualization
- Preparation for restful sleep
- Tomorrow's intention setting

## Mindfulness Techniques

**Breathing Practices**
- 4-7-8 breathing for relaxation
- Box breathing for focus
- Natural breath observation
- Alternate nostril breathing
- Breath counting meditation

**Body Awareness**
- Progressive muscle relaxation
- Full body scan meditation
- Mindful movement and stretching
- Tension and release exercises
- Posture awareness practice

**Mindful Activities**
- Eating meditation with full attention
- Walking meditation in nature
- Mindful listening to music
- Conscious dishwashing or cleaning
- Mindful communication practice

## Stress Management

**Acute Stress Response**
- STOP technique (Stop, Take a breath, Observe, Proceed)
- 5-4-3-2-1 grounding exercise
- Emergency breath work
- Quick body scan
- Mindful self-compassion

**Chronic Stress Prevention**
- Regular meditation schedule
- Mindful work breaks
- Boundary setting practice
- Digital detox periods
- Nature connection time

## Emotional Regulation

**Difficult Emotions**
- RAIN technique (Recognize, Allow, Investigate, Non-attachment)
- Emotional labeling practice
- Self-compassion meditation
- Loving-kindness for difficult people
- Acceptance and letting go

**Positive Emotions**
- Gratitude amplification
- Joy and appreciation practice
- Loving-kindness meditation
- Compassion cultivation
- Mindful celebration

## Integration into Daily Life

**Work Applications**
- Mindful email checking
- Conscious meeting participation
- Stress-aware decision making
- Mindful communication
- Present-moment task focus

**Relationship Practice**
- Mindful listening skills
- Compassionate response
- Conflict resolution awareness
- Empathy cultivation
- Loving presence

## Resources and Learning

**Books**
- "Wherever You Go, There You Are" by Jon Kabat-Zinn
- "The Power of Now" by Eckhart Tolle
- "Real Happiness" by Sharon Salzberg
- "Mindfulness in Plain English" by Bhante Henepola Gunaratana

**Apps and Guided Meditations**
- Headspace for structured programs
- Calm for sleep and relaxation
- Insight Timer for variety
- Ten Percent Happier for skeptics
- Waking Up for advanced practice

**Retreats and Workshops**
- Local meditation groups
- Weekend mindfulness retreats
- Online courses and workshops
- Nature-based mindfulness
- Silent retreat experiences

## Benefits Experienced

**Mental Health**
- Reduced anxiety and worry
- Improved emotional regulation
- Greater self-awareness
- Enhanced focus and concentration
- Increased resilience to stress

**Physical Health**
- Better sleep quality
- Lower blood pressure
- Reduced muscle tension
- Improved immune function
- Greater energy levels

**Relationships**
- More compassionate responses
- Better listening skills
- Reduced reactivity
- Increased empathy
- Deeper connections

Mindfulness is not about achieving a perfect state of calm, but about developing a kind and aware relationship with whatever is present in each moment.`,
    author: {
      name: "Sarah Martinez",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      initials: "SM"
    },
    publishedDate: "Jan 1, 2024",
    readTime: "9 min read",
    category: "Wellness",
    tags: ["mindfulness", "meditation", "wellness", "mental-health"],
    likes: 267,
    bookmarks: 156
  }
};

export async function generateMetadata({ params }) {
  const note = notesData[params.slug];
  
  if (!note) {
    return {
      title: "Note Not Found | Notezy"
    };
  }

  return {
    title: `${note.title} | Notezy`,
    description: note.content.substring(0, 160) + "..."
  };
}

export default function NotePage({ params }) {
  const note = notesData[params.slug];

  if (!note) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Note Not Found</h1>
          <p className="text-gray-600 mb-8">The note you're looking for doesn't exist.</p>
          <a
            href="/"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Notes
          </a>
        </div>
      </div>
    );
  }

  return <NoteReadingPage note={note} />;
}
