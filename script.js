const menuBtn = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');

if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('open');
    });
}

const checkBtn = document.getElementById('checkBtn');
const urlInput = document.getElementById('urlInput');
const loading = document.getElementById('loading');
const resultsDiv = document.getElementById('results');
const RAPIDAPI_KEY = '515c21EME9M9cSy9FvfHvcx2gMPkp1H5Dj4YaKufPRsAyon8Tf';

if (checkBtn && urlInput && resultsDiv && loading) {
    checkBtn.addEventListener('click', async () => {
        const url = urlInput.value.trim();

        if (!url) {
            alert("Enter URL");
            return;
        }

        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            alert("Enter Full URL starting with http:// or https://");
            return;
        }

        loading.style.display = 'block';
        resultsDiv.innerHTML = '';

        try {
            const response = await fetch('https://phishunt.io/api/v1/domains?limit=500', {
                method: 'GET',
                headers: {
                    'x-rapidapi-key': RAPIDAPI_KEY,
                    'x-rapidapi-host': 'phishunt_io.p.rapidapi.com'
                }
            });

            if (!response.ok) {
                throw new Error('HTTP error! Status: ${response.status}');
            }

            const data = await response.json();
            const lowerUrl = url.toLowerCase();
            const hostname = new URL(url).hostname.toLowerCase();

            let found = false;

            // Loop through API results
            for (const entry of data) {
                if (!entry.url) continue;

                const feedUrl = entry.url.toLowerCase();
                let feedHost = '';
                
                try {
                    feedHost = new URL(feedUrl).hostname.toLowerCase();
                } catch (e) {
                    // Fallback if entry.url isn't a valid full URL
                    feedHost = feedUrl;
                }

                if (hostname === feedHost || lowerUrl.includes(feedUrl) || feedUrl.includes(hostname)) {
                    found = true;
                    break;
                }
            }

            if (found) {
                resultsDiv.innerHTML = `
                    <div class="result-card danger">
                        <h3> HIGH RISK - MATCH FOUND</h3>
                        <p>This URL matches known suspicious/phishing entries in the latest database.</p>
                        <strong>Recommendation:</strong> Do not visit this link. Report it if you received it via email/SMS.
                    </div>`;
            } else {
                resultsDiv.innerHTML = `
                    <div class="result-card safe">
                        <h3> No direct match found</h3>
                        <p>This URL was not found in the current suspicious feed.</p>
                        <strong>Note:</strong> Absence of a match does not guarantee safety. Always verify the source.
                    </div>`;
            }

        } catch (error) {
            console.error(error);
            resultsDiv.innerHTML = `
                <div class="result-card warning">
                    <h3> Check has Failed</h3>
                    <p> Couldn't connect to scam database. Try again later.</p>
                </div>`;
        } finally {
            loading.style.display = 'none';
        }
    });

    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkBtn.click();
    });
}       
