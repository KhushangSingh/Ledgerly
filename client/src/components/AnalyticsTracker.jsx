import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';

const AnalyticsTracker = () => {
    const location = useLocation();

    useEffect(() => {
        // Only run if Measurement ID is present
        const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

        if (GA_MEASUREMENT_ID) {
            // Initialize if not already done
            if (!window.ga_initialized) {
                ReactGA.initialize(GA_MEASUREMENT_ID);
                window.ga_initialized = true;
            }

            // Send pageview with path and search query
            ReactGA.send({
                hitType: "pageview",
                page: location.pathname + location.search
            });
        }
    }, [location]);

    return null;
};

export default AnalyticsTracker;
