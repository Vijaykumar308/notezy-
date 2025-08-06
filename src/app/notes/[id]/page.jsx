import NoteReadingPage from "@/components/NoteReadingPage";

// Sample notes data - in a real app, this would come from a database
const notesData = {
  1: {
    id: 1,
    title: "Meeting Notes",
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
  2: {
    id: 2,
    title: "Project Brainstorm",
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
  3: {
    id: 3,
    title: "Grocery List",
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
  4: {
    id: 4,
    title: "Travel Plans",
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
  5: {
    id: 5,
    title: "Book Recommendations",
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
  6: {
    id: 6,
    title: "Personal Journal",
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
  }
};

export async function generateMetadata({ params }) {
  const note = notesData[params.id];
  
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
  const note = notesData[params.id];

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
