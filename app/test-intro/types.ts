export interface WizardState {
    // Step 1
    continents: { code: string; name: string; priority?: number }[];
    targetCountries: string[]; // Max 3

    // Step 2
    interests: string[];
    subjectPriority: string[]; // Ordered list

    // Step 3
    exams: {
        ielts: { taken: boolean; score: number | null };
        sat: { taken: boolean; score: number | null };
        olympiads: { taken: boolean; level: 'School' | 'City' | 'Regional' | 'International' | null };
        volunteering: { taken: boolean; description: string };
    };

    // Step 4
    motivation: {
        researchInterest: string;
        gapYearActivity: string;
    };
}
