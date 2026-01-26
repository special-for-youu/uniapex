-- Seed Universities Data (Kazakhstan First Strategy)

-- Insert Kazakhstan Universities
INSERT INTO universities (name, country, city, ranking, tuition_fee, acceptance_rate, requirements, website_url) VALUES
('Nazarbayev University', 'Kazakhstan', 'Astana', 1, 8000, 12, '{"min_ielts": 6.5, "min_gpa": 3.8, "min_sat": 1350, "min_unt": 120}', 'https://nu.edu.kz'),
('KBTU (Kazakh-British Technical University)', 'Kazakhstan', 'Almaty', 2, 6000, 25, '{"min_ielts": 6.0, "min_gpa": 3.5, "min_sat": 1250, "min_unt": 110}', 'https://kbtu.edu.kz'),
('Suleyman Demirel University', 'Kazakhstan', 'Kaskelen', 3, 5500, 30, '{"min_ielts": 6.0, "min_gpa": 3.4, "min_sat": 1200, "min_unt": 105}', 'https://sdu.edu.kz'),
('Astana IT University', 'Kazakhstan', 'Astana', 4, 4500, 35, '{"min_ielts": 5.5, "min_gpa": 3.3, "min_sat": 1150, "min_unt": 100}', 'https://astanait.edu.kz'),
('KIMEP University', 'Kazakhstan', 'Almaty', 5, 7000, 28, '{"min_ielts": 6.5, "min_gpa": 3.6, "min_sat": 1300, "min_unt": 115}', 'https://kimep.kz'),
('Satbayev University', 'Kazakhstan', 'Almaty', 6, 3500, 40, '{"min_ielts": 5.5, "min_gpa": 3.2, "min_unt": 95}', 'https://satbayev.university'),
('Al-Farabi Kazakh National University', 'Kazakhstan', 'Almaty', 7, 2000, 45, '{"min_ielts": 5.0, "min_gpa": 3.0, "min_unt": 90}', 'https://kaznu.kz'),
('L.N. Gumilyov Eurasian National University', 'Kazakhstan', 'Astana', 8, 2500, 42, '{"min_ielts": 5.0, "min_gpa": 3.1, "min_unt": 92}', 'https://enu.kz'),
('Karaganda Buketov University', 'Kazakhstan', 'Karaganda', 9, 1800, 50, '{"min_ielts": 5.0, "min_gpa": 2.9, "min_unt": 85}', 'https://ksu.kz'),
('Abai Kazakh National Pedagogical University', 'Kazakhstan', 'Almaty', 10, 1500, 55, '{"min_ielts": 5.0, "min_gpa": 2.8, "min_unt": 80}', 'https://kaznpu.kz');

-- Insert Top Global Universities (Dream Schools)
INSERT INTO universities (name, country, city, ranking, tuition_fee, acceptance_rate, requirements, website_url) VALUES
('Harvard University', 'USA', 'Cambridge', 1, 54000, 3, '{"min_ielts": 7.5, "min_gpa": 4.0, "min_sat": 1550}', 'https://harvard.edu'),
('Stanford University', 'USA', 'Stanford', 2, 56000, 4, '{"min_ielts": 7.5, "min_gpa": 4.0, "min_sat": 1540}', 'https://stanford.edu'),
('MIT', 'USA', 'Cambridge', 3, 55000, 4, '{"min_ielts": 7.5, "min_gpa": 4.0, "min_sat": 1560}', 'https://mit.edu'),
('University of Oxford', 'UK', 'Oxford', 4, 35000, 17, '{"min_ielts": 7.5, "min_gpa": 3.9}', 'https://ox.ac.uk'),
('University of Cambridge', 'UK', 'Cambridge', 5, 33000, 18, '{"min_ielts": 7.5, "min_gpa": 3.9}', 'https://cam.ac.uk'),
('University of Toronto', 'Canada', 'Toronto', 15, 45000, 43, '{"min_ielts": 6.5, "min_gpa": 3.7, "min_sat": 1350}', 'https://utoronto.ca'),
('University of British Columbia', 'Canada', 'Vancouver', 20, 42000, 52, '{"min_ielts": 6.5, "min_gpa": 3.5, "min_sat": 1300}', 'https://ubc.ca'),
('McGill University', 'Canada', 'Montreal', 25, 38000, 46, '{"min_ielts": 6.5, "min_gpa": 3.6, "min_sat": 1320}', 'https://mcgill.ca'),
('Imperial College London', 'UK', 'London', 8, 40000, 14, '{"min_ielts": 7.0, "min_gpa": 3.8, "min_sat": 1450}', 'https://imperial.ac.uk'),
('ETH Zurich', 'Switzerland', 'Zurich', 10, 1500, 27, '{"min_ielts": 7.0, "min_gpa": 3.8}', 'https://ethz.ch');

-- Insert Regional Strong Universities
INSERT INTO universities (name, country, city, ranking, tuition_fee, acceptance_rate, requirements, website_url) VALUES
('Koç University', 'Turkey', 'Istanbul', 30, 25000, 15, '{"min_ielts": 6.5, "min_gpa": 3.5, "min_sat": 1350}', 'https://ku.edu.tr'),
('Lomonosov Moscow State University', 'Russia', 'Moscow', 35, 6000, 20, '{"min_ielts": 6.0, "min_gpa": 3.4}', 'https://msu.ru'),
('KAIST', 'South Korea', 'Daejeon', 12, 8000, 10, '{"min_ielts": 6.5, "min_gpa": 3.7, "min_sat": 1400}', 'https://kaist.ac.kr'),
('National University of Singapore', 'Singapore', 'Singapore', 11, 35000, 15, '{"min_ielts": 7.0, "min_gpa": 3.8, "min_sat": 1450}', 'https://nus.edu.sg');
