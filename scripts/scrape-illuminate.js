/**
 * Illuminate Extracurriculars Scraper (Node.js + Puppeteer)
 */
import puppeteer from 'puppeteer';
import fs from 'fs';

async function scrapeIlluminate() {
    console.log('='.repeat(60));
    console.log('ILLUMINATE EXTRACURRICULARS SCRAPER');
    console.log('='.repeat(60));

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: { width: 1280, height: 800 }
    });

    const page = await browser.newPage();

    console.log('🌐 Navigating to Illuminate...');
    await page.goto('https://illuminate.projectempower.io/', {
        waitUntil: 'networkidle2',
        timeout: 30000
    });

    console.log('✅ Page loaded');

    // Scroll to load more content
    const scrollContainer = '.ecScrollRemove';

    for (let i = 0; i < 10; i++) {
        console.log(`📜 Scrolling ${i + 1}/10...`);
        await page.evaluate((selector) => {
            const element = document.querySelector(selector);
            if (element) {
                element.scrollBy(0, 1000);
            } else {
                window.scrollBy(0, 1000);
            }
        }, scrollContainer);
        await page.waitForTimeout(2000);
    }

    console.log('🔍 Extracting activities...');

    // Extract data from the page
    const activities = await page.evaluate(() => {
        const cards = Array.from(document.querySelectorAll('.ecButton'));

        return cards.map((card, idx) => {
            try {
                // Extract title
                const titleDiv = card.querySelector('div > div');
                const title = titleDiv ? titleDiv.textContent.trim() : `Activity ${idx}`;

                // Extract website
                const linkElem = card.querySelector('a');
                const website = linkElem ? linkElem.href : '';

                // Extract description
                const allDivs = card.querySelectorAll('div');
                let description = '';
                for (let div of allDivs) {
                    const text = div.textContent.trim();
                    if (text.length > 50 && text.length < 500) {
                        description = text;
                        break;
                    }
                }

                // Extract tags
                const tagList = card.querySelector('ul:last-of-type');
                const tags = tagList
                    ? Array.from(tagList.querySelectorAll('li')).map(li => li.textContent.trim())
                    : [];

                // Determine category
                let category = 'Other';
                if (tags.includes('Competition')) category = 'Competition';
                else if (tags.includes('Internship') || tags.includes('Job')) category = 'Internship';
                else if (tags.includes('Volunteer')) category = 'Volunteering';
                else if (tags.includes('Hackathon')) category = 'Hackathon';
                else if (tags.includes('Course') || tags.includes('Program')) category = 'Course';

                const location = tags.includes('Online') ? 'Online' :
                    tags.includes('In-Person') ? 'In-Person' : 'Various';

                return {
                    title,
                    description: description.slice(0, 500),
                    category,
                    organization: 'Illuminate',
                    location,
                    website_url: website,
                    tags,
                    scraped_at: new Date().toISOString()
                };
            } catch (e) {
                console.error(`Error extracting card ${idx}:`, e.message);
                return null;
            }
        }).filter(Boolean);
    });

    await browser.close();

    // Save to JSON
    const outputFile = 'scraped_illuminate_data.json';
    fs.writeFileSync(outputFile, JSON.stringify(activities, null, 2));

    console.log(`\n✅ Scraped ${activities.length} activities`);
    console.log(`💾 Saved to: ${outputFile}`);

    // Category breakdown
    const categories = {};
    activities.forEach(a => {
        categories[a.category] = (categories[a.category] || 0) + 1;
    });

    console.log('\n📊 Categories breakdown:');
    Object.entries(categories).sort().forEach(([cat, count]) => {
        console.log(`   - ${cat}: ${count}`);
    });

    return activities;
}

scrapeIlluminate().catch(console.error);
