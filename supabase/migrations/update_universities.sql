-- Update KBTU with UNT requirements
UPDATE universities 
SET requirements = jsonb_set(requirements, '{min_unt}', '100')
WHERE name = 'KBTU';

-- Update SDU with UNT requirements
UPDATE universities 
SET requirements = jsonb_set(requirements, '{min_unt}', '90')
WHERE name = 'Suleyman Demirel University';

-- Insert more universities
INSERT INTO universities (name, country, city, ranking, tuition_fee, acceptance_rate, requirements, website_url) VALUES
('Astana IT University', 'Kazakhstan', 'Astana', 4, 2000, 35.0, '{"min_ielts": 5.5, "min_gpa": 3.0, "min_unt": 95}', 'https://astanait.edu.kz'),
('KIMEP University', 'Kazakhstan', 'Almaty', 5, 4000, 40.0, '{"min_ielts": 6.0, "min_gpa": 3.0, "min_unt": 105}', 'https://kimep.kz'),
('Satbayev University', 'Kazakhstan', 'Almaty', 6, 1500, 45.0, '{"min_ielts": 5.0, "min_gpa": 2.8, "min_unt": 85}', 'https://satbayev.university'),
('Harvard University', 'USA', 'Cambridge', 2, 57000, 3.4, '{"min_ielts": 7.5, "min_gpa": 4.0, "min_sat": 1550}', 'https://harvard.edu'),
('Oxford University', 'UK', 'Oxford', 4, 40000, 17.5, '{"min_ielts": 7.5, "min_gpa": 3.9, "min_sat": 1450}', 'https://ox.ac.uk');
