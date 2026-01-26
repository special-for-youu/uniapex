-- Update all rows in the universities table to set specific columns to NULL
UPDATE universities
SET 
    acceptance_rate = NULL,
    min_ielts = NULL,
    min_gpa = NULL,
    min_sat = NULL,
    application_deadline = NULL,
    enrollment_size = NULL,
    -- Note: User requested 'is_international_students', but previous context suggests 'international_students_percent'.
    -- Uncomment the one that is correct for your schema.
    -- is_international_students = NULL; 
    international_students_percent = NULL;
