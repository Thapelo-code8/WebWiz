
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
                const response = await fetch('https://phishunt_io.p.rapidapi.com/suspicious/feed_csv', {
                    method: 'GET',
                    headers: {
                        'x-rapidapi-key': RAPIDAPI_KEY,
                        'x-rapidapi-host': 'phishunt_io.p.rapidapi.com'
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch scam database');
                }

                const csvText = await response.text();
                const lines = csvText.trim().split('\n');
                
                let found = false;
                const lowerUrl = url.toLowerCase();

                for (let i = 1; i < lines.length; i++) {
                    const columns = lines[i].split(',');
                    if (columns.length > 0) {
                        const suspiciousUrl = columns[0].trim().toLowerCase();
                        if (suspiciousUrl &&
                            (lowerUrl.includes(suspiciousUrl) ||
                             suspiciousUrl.includes(lowerUrl.replace('https://', '').replace('http://', '')))) {
                            found = true;
                            break;
                        }
                    }
                }

                if (found) {
                    resultsDiv.innerHTML = `
                        <div class="result-card danger">
                            <h3> HIGH RISK</h3>
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