class JobExtractor {
    extractLinkedIn() {
        try {
            const jobTitle = document.querySelector('[class*="title"]')?.textContent || '';
            const company = document.querySelector('[class*="company-name"]')?.textContent ||
                document.querySelector('h1')?.textContent?.split(' at ')?.[1] || '';
            const location = document.querySelector('[class*="job-details-location"]')?.textContent || '';
            const jobUrl = window.location.href;
            const jobDescription = document.querySelector('[class*="description"]')?.textContent || '';

            return {
                jobTitle: jobTitle.trim(),
                company: company.trim(),
                location: location.trim(),
                jobUrl,
                jobDescription: jobDescription.substring(0, 2000),
                portal: 'LINKEDIN'
            };
        } catch (e) {
            return { portal: 'LINKEDIN' };
        }
    }

    extractNaukri() {
        try {
            const jobTitle = document.querySelector('[class*="job-title"]')?.textContent ||
                document.querySelector('h1')?.textContent || '';
            const company = document.querySelector('[class*="company-name"]')?.textContent || '';
            const location = document.querySelector('[class*="location"]')?.textContent || '';
            const jobUrl = window.location.href;
            const jobDescription = document.body.innerText.substring(0, 2000);

            return {
                jobTitle: jobTitle.trim(),
                company: company.trim(),
                location: location.trim(),
                jobUrl,
                jobDescription,
                portal: 'NAUKRI'
            };
        } catch (e) {
            return { portal: 'NAUKRI' };
        }
    }

    extractInternshala() {
        try {
            const jobTitle = document.querySelector('[class*="heading"]')?.textContent || '';
            const company = document.querySelector('[class*="company-name"]')?.textContent || '';
            const location = document.querySelector('[class*="location"]')?.textContent || '';
            const jobUrl = window.location.href;
            const jobDescription = document.body.innerText.substring(0, 2000);

            return {
                jobTitle: jobTitle.trim(),
                company: company.trim(),
                location: location.trim(),
                jobUrl,
                jobDescription,
                portal: 'INTERNSHALA'
            };
        } catch (e) {
            return { portal: 'INTERNSHALA' };
        }
    }

    extractGeneric() {
        try {
            const jobTitle = document.querySelector('h1')?.textContent || '';
            const jobUrl = window.location.href;
            const jobDescription = document.body.innerText.substring(0, 2000);

            return {
                jobTitle: jobTitle.trim(),
                jobUrl,
                jobDescription,
                portal: 'OTHER'
            };
        } catch (e) {
            return { portal: 'OTHER' };
        }
    }

    detectPortal() {
        const url = window.location.href;
        if (url.includes('linkedin.com')) return 'LINKEDIN';
        if (url.includes('naukri.com')) return 'NAUKRI';
        if (url.includes('internshala.com')) return 'INTERNSHALA';
        if (url.includes('unstop.com')) return 'UNSTOP';
        return 'OTHER';
    }

    extract() {
        const portal = this.detectPortal();

        switch(portal) {
            case 'LINKEDIN':
                return this.extractLinkedIn();
            case 'NAUKRI':
                return this.extractNaukri();
            case 'INTERNSHALA':
                return this.extractInternshala();
            default:
                return this.extractGeneric();
        }
    }
}

// Send extracted data to popup when it requests
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'extractJobData') {
        const extractor = new JobExtractor();
        const data = extractor.extract();
        sendResponse(data);
    }
});