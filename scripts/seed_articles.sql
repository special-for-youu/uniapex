-- Insert default articles if they don't exist
INSERT INTO articles (title, description, image_url, link_url)
VALUES 
    (
        'About Admission', 
        'Everything you need to know about the university admission process, deadlines, and requirements.',
        'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1000',
        '/articles/about-admission'
    ),
    (
        'Early Admission Guide', 
        'Benefits of applying early, how to prepare, and what universities look for in early applicants.',
        'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1000',
        '/articles/early-admission'
    ),
    (
        'How to Find Your Fit University', 
        'A comprehensive guide on choosing the right university based on your academic goals, culture, and budget.',
        'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1000',
        '/articles/find-fit-university'
    );
