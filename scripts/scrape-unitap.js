/**
 * Unitap Universities Scraper (Node.js + Puppeteer)
 */
import puppeteer from 'puppeteer';
import fs from 'fs';

async function scrapeUnitap() {
    console.log('='.repeat(60));
    console.log('UNITAP UNIVERSITIES SCRAPER');
    console.log('='.repeat(60));

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: { width: 1280, height: 800 }
    });

    const page = await browser.newPage();

    console.log('🌐 Navigating to Unitap...');
    await page.goto('https://unitap.org/universities', {
        waitUntil: 'networkidle2',
        timeout: 30000
    });

    console.log('✅ Page loaded');

    // Scroll to load more universities
    for (let i = 0; i < 15; i++) {
        console.log(`📜 Scrolling ${i + 1}/15...`);
        await page.evaluate(() => window.scrollBy(0, 1000));
        await page.waitForTimeout(2000);
    }

    console.log('🔍 Extracting universities...');

    // Extract data
    const universities = await page.evaluate(() => {
        // Try multiple selectors to find university cards
        let cards = Array.from(document.querySelectorAll('[class*="university"]'));

        if (cards.length === 0) {
            cards = Array.from(document.querySelectorAll('[class*="card"]'));
        }

        if (cards.length === 0) {
            cards = Array.from(document.querySelectorAll('article, .item'));
        }

        return cards.slice(0, 50).map((card, idx) => {
            try {
                // Extract name
                const nameElem = card.querySelector('h2, h3, [class*="title"], [class*="name"]');
                const name = nameElem ? nameElem.textContent.trim() : `University ${idx + 1}`;

                // Extract all text
                const allText = card.textContent;

                // Try to extract location
                let city = '';
                let country = '';

                const locationMatch = allText.match(/([A-Za-z\s]+),\s*([A-Za-z\s]+)/);
                if (locationMatch) {
                    city = locationMatch[1].trim();
                    country = locationMatch[2].trim();
                }

                // Extract ranking if visible
                const rankMatch = allText.match(/#(\d+)|Rank:\s*(\d+)|(\d+)(?:st|nd|rd|th)/);
                const ranking = rankMatch ? parseInt(rankMatch[1] || rankMatch[2] || rankMatch[3]) : idx + 1;

                // Extract tuition
                const tuitionMatch = allText.match(/\$?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/);
                const tuition = tuitionMatch ? parseInt(tuitionMatch[1].replace(/,/g, '')) : null;

                return {
                    name,
                    country: country || 'Kazakhstan',
                    city: city || 'Unknown',
                    ranking,
                    tuition_fee: tuition,
                    acceptance_rate: null,
                    requirements: {},
                    website_url: '',
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
    const outputFile = 'scraped_unitap_data.json';
    fs.writeFileSync(outputFile, JSON.stringify(universities, null, 2));

    console.log(`\n✅ Scraped ${universities.length} universities`);
    console.log(`💾 Saved to: ${outputFile}`);

    // Countries breakdown
    const countries = {};
    universities.forEach(u => {
        countries[u.country] = (countries[u.country] || 0) + 1;
    });

    console.log('\n📊 Countries breakdown:');
    Object.entries(countries).sort().forEach(([country, count]) => {
        console.log(`   - ${country}: ${count}`);
    });

    return universities;
}

scrapeUnitap().catch(console.error);
