-- Seed Extracurricular Activities Data (Kazakhstan First Strategy)

INSERT INTO extracurricular_activities (title, description, category, organization, location, start_date, end_date, application_deadline, website_url, tags) VALUES

-- Internships
('Software Engineering Internship', 'Backend development internship at a leading fintech company', 'Internship', 'Kaspi.kz', 'Almaty', '2025-06-01', '2025-08-31', '2025-04-15', 'https://kaspi.kz/careers', ARRAY['Grade 11', 'Grade 12', 'CS', 'Programming']),
('Data Science Internship', 'Work with big data and machine learning models', 'Internship', 'Yandex Kazakhstan', 'Almaty', '2025-07-01', '2025-09-01', '2025-05-01', 'https://yandex.kz/jobs', ARRAY['Grade 12', 'Math', 'CS', 'AI']),
('Marketing Intern', 'Assist in digital marketing campaigns and analytics', 'Internship', 'Chocofamily', 'Almaty', '2025-06-15', '2025-08-15', '2025-04-30', 'https://chocofamily.kz', ARRAY['Grade 11', 'Grade 12', 'Business', 'Marketing']),

-- Olympiads
('International Mathematical Olympiad (IMO)', 'The world''s most prestigious mathematics competition for high school students', 'Olympiad', 'IMO', 'Global', '2025-07-15', '2025-07-22', '2025-03-01', 'https://imo-official.org', ARRAY['Grade 10', 'Grade 11', 'Math']),
('Kazakhstan National Physics Olympiad', 'Annual physics competition for students across Kazakhstan', 'Olympiad', 'Ministry of Education KZ', 'Astana', '2025-03-10', '2025-03-12', '2025-02-01', 'https://nis.edu.kz', ARRAY['Grade 9', 'Grade 10', 'Grade 11', 'Physics']),
('International Olympiad in Informatics (IOI)', 'Global programming competition for secondary school students', 'Olympiad', 'IOI', 'Global', '2025-08-05', '2025-08-12', '2025-04-01', 'https://ioinformatics.org', ARRAY['Grade 10', 'Grade 11', 'CS', 'Programming']),
('BilimLand Chemistry Challenge', 'National chemistry olympiad with online rounds', 'Olympiad', 'BilimLand', 'Online', '2025-04-15', '2025-04-20', '2025-03-15', 'https://bilimland.kz', ARRAY['Grade 10', 'Grade 11', 'Chemistry']),

-- Hackathons
('Qazaqstan AI Hackathon', 'Build AI solutions for local problems', 'Hackathon', 'Astana Hub', 'Astana', '2025-05-20', '2025-05-22', '2025-05-01', 'https://astanahub.com', ARRAY['Grade 11', 'Grade 12', 'AI', 'CS']),
('FinTech Innovation Challenge', '48-hour hackathon focused on financial technology', 'Hackathon', 'Kaspi.kz', 'Almaty', '2025-06-10', '2025-06-12', '2025-05-20', 'https://kaspi.kz/hackathon', ARRAY['Grade 12', 'CS', 'Business']),
('Youth Tech Summit Hackathon', 'Develop mobile apps for social good', 'Hackathon', 'NURIS', 'Astana', '2025-04-25', '2025-04-27', '2025-04-10', 'https://nuris.gov.kz', ARRAY['Grade 10', 'Grade 11', 'CS', 'Social']),

-- Volunteering
('Teach Kazakhstan', 'Volunteer as a tutor for students in rural areas', 'Volunteering', 'Teach For Kazakhstan', 'Various', '2025-06-01', '2025-08-31', '2025-04-15', 'https://teachforkz.org', ARRAY['Grade 11', 'Grade 12', 'Teaching', 'Social']),
('Red Crescent Youth', 'Humanitarian aid and disaster response training', 'Volunteering', 'Kazakhstan Red Crescent', 'Almaty', '2025-05-01', '2025-12-31', '2025-04-01', 'https://redcrescent.kz', ARRAY['Grade 9', 'Grade 10', 'Grade 11', 'Health', 'Social']),
('EcoVolunteers KZ', 'Environmental cleanup and awareness campaigns', 'Volunteering', 'EcoMuseum', 'Almaty', '2025-04-22', '2025-10-31', '2025-04-01', 'https://ecomuseum.kz', ARRAY['Grade 9', 'Grade 10', 'Grade 11', 'Environment']),

-- Competitions
('National Debate Championship', 'English-language debate competition for high school students', 'Competition', 'Kazakhstan Debate Association', 'Astana', '2025-03-15', '2025-03-17', '2025-02-20', 'https://debate.kz', ARRAY['Grade 10', 'Grade 11', 'Public Speaking', 'English']),
('ShymkentTech Robotics Challenge', 'Build and compete with autonomous robots', 'Competition', 'ShymkentTech', 'Shymkent', '2025-04-05', '2025-04-07', '2025-03-10', 'https://shymtech.kz', ARRAY['Grade 9', 'Grade 10', 'Grade 11', 'Robotics', 'Engineering']),
('Essay Writing Contest: My Future in Tech', 'Win scholarships by writing about your tech aspirations', 'Competition', 'KBTU', 'Online', '2025-02-01', '2025-03-01', '2025-02-25', 'https://kbtu.edu.kz', ARRAY['Grade 11', 'Grade 12', 'Writing', 'CS']),

-- Courses & Programs
('YouTube Creator Bootcamp', 'Learn video production and content creation', 'Course', 'Google for Startups', 'Online', '2025-05-10', '2025-06-20', '2025-04-30', 'https://startup.google.com', ARRAY['Grade 10', 'Grade 11', 'Media', 'Business']),
('Astana Hub Junior Developer Program', '3-month intensive coding bootcamp for teens', 'Course', 'Astana Hub', 'Astana', '2025-06-01', '2025-08-31', '2025-05-01', 'https://astanahub.com/junior', ARRAY['Grade 11', 'Grade 12', 'CS', 'Programming']),
('Business Academy for Teens', 'Entrepreneurship and business fundamentals', 'Course', 'KIMEP', 'Almaty', '2025-07-01', '2025-07-15', '2025-06-01', 'https://kimep.kz/academy', ARRAY['Grade 10', 'Grade 11', 'Business']);
