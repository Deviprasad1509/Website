-- Sample data for testing the BuisBuz Ebook Store
-- Note: You'll need to have actual user IDs from Supabase Auth after user registration

-- Sample ebooks data
INSERT INTO ebooks (title, author, description, price, category, tags, is_featured) VALUES
(
    'The Midnight Library',
    'Matt Haig',
    'Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived. To see how things would be if you had made other choices... Would you have done anything different, if you had the chance to undo your regrets?',
    24.99,
    'Fiction',
    ARRAY['Philosophy', 'Contemporary Fiction', 'Mental Health', 'Life Choices'],
    true
),
(
    'Atomic Habits',
    'James Clear',
    'No matter your goals, Atomic Habits offers a proven framework for improving--every day. James Clear, one of the world''s leading experts on habit formation, reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results.',
    18.99,
    'Self-Help',
    ARRAY['Self-Improvement', 'Psychology', 'Productivity', 'Personal Development'],
    true
),
(
    'Dune',
    'Frank Herbert',
    'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world where the only thing of value is the "spice" melange, a drug capable of extending life and enhancing consciousness.',
    19.99,
    'Science Fiction',
    ARRAY['Epic Fantasy', 'Space Opera', 'Politics', 'Ecology'],
    true
),
(
    'The Psychology of Money',
    'Morgan Housel',
    'Doing well with money isn''t necessarily about what you know. It''s about how you behave. And behavior is hard to teach, even to really smart people.',
    16.99,
    'Business',
    ARRAY['Finance', 'Psychology', 'Investing', 'Personal Finance'],
    false
),
(
    'Educated',
    'Tara Westover',
    'An unforgettable memoir about a young girl who, kept out of school, leaves her survivalist family and goes on to earn a PhD from Cambridge University.',
    22.99,
    'Biography',
    ARRAY['Memoir', 'Education', 'Family', 'Resilience'],
    true
),
(
    'The Subtle Art of Not Giving a F*ck',
    'Mark Manson',
    'In this generation-defining self-help guide, a superstar blogger cuts through the crap to show us how to stop trying to be "positive" all the time so that we can truly become better, happier people.',
    15.99,
    'Self-Help',
    ARRAY['Philosophy', 'Personal Development', 'Psychology', 'Mindfulness'],
    false
),
(
    'Sapiens',
    'Yuval Noah Harari',
    'From a renowned historian comes a groundbreaking narrative of humanity''s creation and evolution—a #1 international bestseller—that explores the ways in which biology and history have defined us and enhanced our understanding of what it means to be "human."',
    21.99,
    'History',
    ARRAY['Anthropology', 'Evolution', 'Civilization', 'Philosophy'],
    true
),
(
    'The Alchemist',
    'Paulo Coelho',
    'Paulo Coelho''s masterpiece tells the mystical story of Santiago, an Andalusian shepherd boy who yearns to travel in search of a worldly treasure. His quest will lead him to riches far different—and far more satisfying—than he ever imagined.',
    14.99,
    'Fiction',
    ARRAY['Philosophy', 'Adventure', 'Spiritual Journey', 'Dreams'],
    false
),
(
    'Becoming',
    'Michelle Obama',
    'In her memoir, a work of deep reflection and mesmerizing storytelling, Michelle Obama invites readers into her world, chronicling the experiences that have shaped her—from her childhood on the South Side of Chicago to her years as an executive balancing the demands of motherhood and work.',
    26.99,
    'Biography',
    ARRAY['Politics', 'Leadership', 'Women', 'Inspiration'],
    true
),
(
    'The 7 Habits of Highly Effective People',
    'Stephen R. Covey',
    'In The 7 Habits of Highly Effective People, author Stephen R. Covey presents a holistic, integrated, principle-centered approach for solving personal and professional problems.',
    17.99,
    'Self-Help',
    ARRAY['Leadership', 'Productivity', 'Personal Development', 'Business'],
    false
),
(
    'Steve Jobs',
    'Walter Isaacson',
    'Based on more than forty interviews with Jobs conducted over two years—as well as interviews with more than a hundred family members, friends, adversaries, competitors, and colleagues—Walter Isaacson has written a riveting story of the roller-coaster life and searingly intense personality of a creative entrepreneur.',
    23.99,
    'Biography',
    ARRAY['Technology', 'Entrepreneurship', 'Innovation', 'Leadership'],
    false
),
(
    'The Lean Startup',
    'Eric Ries',
    'Most startups fail. But many of those failures are preventable. The Lean Startup is a new approach being adopted across the globe, changing the way companies are built and new products are launched.',
    19.99,
    'Business',
    ARRAY['Entrepreneurship', 'Innovation', 'Strategy', 'Technology'],
    false
),
(
    'Think and Grow Rich',
    'Napoleon Hill',
    'Think and Grow Rich has been called the "Granddaddy of All Motivational Literature." It was the first book to boldly ask, "What makes a winner?"',
    13.99,
    'Self-Help',
    ARRAY['Success', 'Wealth', 'Motivation', 'Philosophy'],
    false
),
(
    '1984',
    'George Orwell',
    'Winston Smith works for the Ministry of Truth in London, chief city of Airstrip One. Big Brother stares out from every poster, the Thought Police uncover every act of betrayal. When Winston finds love with Julia, he discovers that life does not have to be dull and deadening, and awakens to new possibilities.',
    16.99,
    'Fiction',
    ARRAY['Dystopian', 'Political', 'Classic Literature', 'Philosophy'],
    true
),
(
    'The Power of Now',
    'Eckhart Tolle',
    'It''s no wonder that The Power of Now has sold over 16 million copies worldwide and has been translated into over 30 foreign languages. Much more than simple principles and platitudes, the book takes readers on an inspiring spiritual journey to find their true and deepest self.',
    18.99,
    'Self-Help',
    ARRAY['Spirituality', 'Mindfulness', 'Philosophy', 'Personal Growth'],
    false
),
(
    'The Girl with the Dragon Tattoo',
    'Stieg Larsson',
    'Harriet Vanger, scion of one of Sweden''s wealthiest families disappeared over forty years ago. All these years later, her aged uncle continues to seek the truth. He hires Mikael Blomkvist, a crusading journalist recently trapped by a libel conviction, to investigate.',
    20.99,
    'Mystery',
    ARRAY['Crime', 'Thriller', 'Scandinavian Noir', 'Investigation'],
    false
),
(
    'The Code Breaker',
    'Walter Isaacson',
    'When Jennifer Doudna was in sixth grade, she came home to find that her dad had left a paperback titled The Double Helix on her bed. She put it aside, thinking it was one of those detective tales she loved.',
    25.99,
    'Biography',
    ARRAY['Science', 'Innovation', 'CRISPR', 'Technology'],
    false
),
(
    'Klara and the Sun',
    'Kazuo Ishiguro',
    'Klara and the Sun, the first novel by Kazuo Ishiguro since he was awarded the Nobel Prize in Literature, tells the story of Klara, an Artificial Friend with outstanding observational qualities, who, from her place in the store, watches carefully the behavior of those who come in to browse.',
    24.99,
    'Science Fiction',
    ARRAY['AI', 'Philosophy', 'Human Nature', 'Future Society'],
    false
),
(
    'The Four Winds',
    'Kristin Hannah',
    'Texas, 1921. A time of abundance. The Great War is over, the bounty of the land is plentiful, and America is on the brink of a new and optimistic era. But for Elsa Wolcott, deemed too old to marry in a time when marriage is a woman''s only option, the future seems bleak.',
    23.99,
    'Fiction',
    ARRAY['Historical Fiction', 'Family Saga', 'Great Depression', 'Women'],
    false
),
(
    'Project Hail Mary',
    'Andy Weir',
    'Ryland Grace is the sole survivor on a desperate, last-chance mission—and if he fails, humanity and the earth itself will perish. Except that right now, he doesn''t know that. He can''t even remember his own name, let alone the nature of his assignment or how to complete it.',
    22.99,
    'Science Fiction',
    ARRAY['Space', 'Science', 'Adventure', 'Problem Solving'],
    true
);
