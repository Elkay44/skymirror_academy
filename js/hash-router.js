// Enhanced Hash Router for Clean URLs
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

    function handleHashChange() {
        const hash = window.location.hash.substring(1);
        if (hash && routes[hash]) {
            navigate(hash);
        }
    }

    // Update all internal links to use hash navigation
    function updateLinks() {
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
                    
                    // Add smooth transition class
                    link.classList.add('hash-nav-link');
                }
            }
        });
    }

    // Handle direct .html access - redirect to hash version
    function handleDirectAccess() {
        const currentPath = window.location.pathname;
        const fileName = currentPath.split('/').pop();
        
        if (fileName && fileName.endsWith('.html') && reverseRoutes[fileName]) {
            const hashRoute = reverseRoutes[fileName];
            if (hashRoute) {
                // Redirect to hash version
                window.location.href = window.location.origin + window.location.pathname.replace(fileName, '') + '#' + hashRoute;
                return;
            }
        }
    }

    // Initialize router
    function init() {
        // Handle direct access to .html files
        handleDirectAccess();
        
        // Update all links on page load
        updateLinks();
        
        // Re-update links when new content is loaded (for dynamic content)
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    updateLinks();
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
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
