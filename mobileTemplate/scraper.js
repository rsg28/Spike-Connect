const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const volleyballUrl = 'https://anc.ca.apm.activecommunities.com/burnaby/activity/search?onlineSiteId=0&activity_select_param=2&activity_keyword=volleyball&viewMode=list';

async function scrapeVolleyballLinks() {
    try {
        const response = await axios.get(volleyballUrl);
        const $ = cheerio.load(response.data);

        // Debugging: Print the first 500 characters of the page's HTML to inspect the structure
        console.log('Page HTML (first 500 chars):', response.data.slice(0, 500));

        // Scrape links where aria-label contains "Reserve In Advance: Volleyball"
        const links = [];
        $('a[aria-label*="Reserve In Advance: Volleyball"]').each((i, el) => {
            const link = $(el).attr('href');
            if (link) {
                links.push(link);
            }
        });

        // Debugging: Check how many links were found
        console.log(`Found ${links.length} links`);

        // Save the links to a file (volleyball_links.json)
        if (links.length > 0) {
            fs.writeFileSync('volleyball_links.json', JSON.stringify(links, null, 2));
            console.log('Links saved to volleyball_links.json');
        } else {
            console.log('No links found.');
        }
    } catch (error) {
        console.error('Error scraping links:', error);
    }
}

// Run the scraping every 6 hours (21600000ms)
setInterval(scrapeVolleyballLinks, 21600000);

// Run once when the service starts
scrapeVolleyballLinks();
