// Simple Clean URL Handler - Multi-page Website
(function() {
    const routes = {
        '': 'index.html',
        'home': 'index.html',
        'programs': 'programs.html',
        'apply': 'apply.html',
        'about': 'about.html',
        'vanguard-cohort': 'Vanguard Cohort.html',
        'fullstack-syllabus': 'fullstack-syllabus.html',
        'greentech-syllabus': 'greentech-syllabus.html',
        'ai-syllabus': 'ai-syllabus.html',
        'ai-ml-syllabus': 'ai-ml-syllabus.html'
    };

    // Create reverse mapping for easier lookup
    const reverseRoutes = {};
    Object.keys(routes).forEach(key => {
        reverseRoutes[routes[key]] = key;
    });

    function navigate(page) {
        if (routes[page]) {
            window.location.href = routes[page];
        }
    }

    // Only handle hash navigation on homepage
    function handleHashChange() {
        const currentPath = window.location.pathname;
        const fileName = currentPath.split('/').pop();
        
        // Only handle hash navigation if we're on the homepage
        if (fileName === 'index.html' || fileName === '' || currentPath === '/' || currentPath.endsWith('/')) {
            const hash = window.location.hash.substring(1);
            if (hash && routes[hash]) {
                navigate(hash);
            }
        }
    }

    // Update links only on homepage to use hash navigation
    function updateLinksOnHomepage() {
        const currentPath = window.location.pathname;
        const fileName = currentPath.split('/').pop();
        
        // Only update links to hash navigation if we're on the homepage
        if (fileName === 'index.html' || fileName === '' || currentPath === '/' || currentPath.endsWith('/')) {
            document.querySelectorAll('a[href]').forEach(link => {
                const href = link.getAttribute('href');
                
                // Only update internal HTML links
                if (href && 
                    href.endsWith('.html') && 
                    !href.startsWith('http') && 
                    !href.startsWith('mailto:') && 
                    !href.startsWith('tel:')) {
                    
                    const pageName = reverseRoutes[href];
                    if (pageName) {
                        link.setAttribute('href', '#' + pageName);
                        link.classList.add('hash-nav-link');
                    }
                }
            });
        }
    }

    // Initialize
    function init() {
        const currentPath = window.location.pathname;
        const fileName = currentPath.split('/').pop();
        
        // If we're on homepage and have a hash, navigate to that page
        if ((fileName === 'index.html' || fileName === '' || currentPath === '/' || currentPath.endsWith('/')) && window.location.hash) {
            const hash = window.location.hash.substring(1);
            if (routes[hash]) {
                navigate(hash);
                return;
            }
        }
        
        // Update links only on homepage
        updateLinksOnHomepage();
    }

    // Event listeners
    window.addEventListener('hashchange', handleHashChange);
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose utility function globally
    window.hashRouter = {
        navigate: function(route) {
            window.location.hash = route;
        },
        getCleanURL: function(htmlFile) {
            return '#' + (reverseRoutes[htmlFile] || '');
        }
    };
})();
