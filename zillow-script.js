// Zillow Data Extractor using RapidAPI
class ZillowExtractor {
    constructor() {
        this.apiKey = localStorage.getItem('rapidApiKey') || '';
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadSavedApiKey();
    }

    bindEvents() {
        // Form submission
        document.getElementById('zillowForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.extractZillowData();
        });

        // Save API key
        document.getElementById('saveApiKey').addEventListener('click', () => {
            this.saveApiKey();
        });

        // Export buttons
        document.getElementById('exportJson').addEventListener('click', () => {
            this.exportData('json');
        });

        document.getElementById('exportCsv').addEventListener('click', () => {
            this.exportData('csv');
        });
    }

    loadSavedApiKey() {
        if (this.apiKey) {
            document.getElementById('rapidApiKey').value = this.apiKey;
        }
    }

    saveApiKey() {
        const apiKey = document.getElementById('rapidApiKey').value.trim();
        if (!apiKey) {
            this.showError('Please enter a valid RapidAPI key');
            return;
        }

        this.apiKey = apiKey;
        localStorage.setItem('rapidApiKey', apiKey);
        this.showNotification('API key saved successfully!', 'success');
    }

    extractZillowData() {
        const zillowUrl = document.getElementById('zillowUrl').value.trim();
        
        if (!zillowUrl) {
            this.showError('Please enter a Zillow URL');
            return;
        }

        if (!this.apiKey) {
            this.showError('Please enter and save your RapidAPI key first');
            return;
        }

        // Extract ZPID from URL
        const zpid = this.extractZPID(zillowUrl);
        if (!zpid) {
            this.showError('Could not extract ZPID from the provided URL. Please check if it\'s a valid Zillow property URL.');
            return;
        }

        this.showLoading();
        this.fetchPropertyData(zpid);
    }

    extractZPID(url) {
        try {
            // Handle different Zillow URL formats
            let zpid = null;
            
            // Format 1: https://www.zillow.com/homedetails/12345678_zpid/
            const homedetailsMatch = url.match(/homedetails\/(\d+)_zpid/);
            if (homedetailsMatch) {
                zpid = homedetailsMatch[1];
            }
            
            // Format 2: https://www.zillow.com/h/12345678/
            const hMatch = url.match(/\/h\/(\d+)\//);
            if (hMatch) {
                zpid = hMatch[1];
            }
            
            // Format 3: https://www.zillow.com/property/12345678/
            const propertyMatch = url.match(/property\/(\d+)\//);
            if (propertyMatch) {
                zpid = propertyMatch[1];
            }

            // Format 4: Direct ZPID in URL
            const directMatch = url.match(/(\d{8,})/);
            if (directMatch && !zpid) {
                zpid = directMatch[1];
            }

            return zpid;
        } catch (error) {
            console.error('Error extracting ZPID:', error);
            return null;
        }
    }

    async fetchPropertyData(zpid) {
        try {
            const url = 'https://zillow-com1.p.rapidapi.com/property';
            const params = new URLSearchParams({
                zpid: zpid
            });

            const response = await fetch(`${url}?${params}`, {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': this.apiKey,
                    'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.displayPropertyData(data);
            this.hideLoading();
            this.showResults();

        } catch (error) {
            console.error('Error fetching property data:', error);
            this.hideLoading();
            this.showError(`Error fetching property data: ${error.message}`);
        }
    }

    displayPropertyData(data) {
        // Store data for export
        this.propertyData = data;

        // Basic property information
        document.getElementById('propertyAddress').textContent = data.address || 'Address not available';
        document.getElementById('propertyPrice').textContent = this.formatPrice(data.price);
        document.getElementById('bedrooms').textContent = data.bedrooms || 'N/A';
        document.getElementById('bathrooms').textContent = data.bathrooms || 'N/A';
        document.getElementById('squareFeet').textContent = this.formatSquareFeet(data.livingArea);
        document.getElementById('listedDate').textContent = this.formatDate(data.datePosted);
        document.getElementById('zpid').textContent = data.zpid || 'N/A';
        document.getElementById('propertyType').textContent = data.homeType || 'N/A';

        // Description
        const description = data.description || data.summary || 'No description available.';
        document.getElementById('description').textContent = description;

        // Features
        this.displayFeatures(data);
    }

    displayFeatures(data) {
        const featuresContainer = document.getElementById('features');
        featuresContainer.innerHTML = '';

        // Common features to look for
        const featureKeys = [
            'features', 'amenities', 'appliances', 'heating', 'cooling',
            'parking', 'lotFeatures', 'interiorFeatures'
        ];

        let allFeatures = [];
        
        featureKeys.forEach(key => {
            if (data[key] && Array.isArray(data[key])) {
                allFeatures = allFeatures.concat(data[key]);
            } else if (data[key] && typeof data[key] === 'string') {
                allFeatures.push(data[key]);
            }
        });

        // If no features found, show some basic property info
        if (allFeatures.length === 0) {
            const basicInfo = [
                data.homeType,
                data.lotSize,
                data.yearBuilt,
                data.propertyTaxRate
            ].filter(Boolean);

            allFeatures = basicInfo;
        }

        // Display features as tags
        allFeatures.forEach(feature => {
            if (feature && feature.trim()) {
                const featureTag = document.createElement('span');
                featureTag.className = 'feature-tag';
                featureTag.textContent = feature.trim();
                featuresContainer.appendChild(featureTag);
            }
        });

        if (allFeatures.length === 0) {
            featuresContainer.innerHTML = '<p>No features available</p>';
        }
    }

    formatPrice(price) {
        if (!price) return 'Price not available';
        
        if (typeof price === 'string') {
            // Remove any non-numeric characters and convert to number
            const numericPrice = parseFloat(price.replace(/[^0-9.]/g, ''));
            if (isNaN(numericPrice)) return price;
            price = numericPrice;
        }

        if (price >= 1000000) {
            return `$${(price / 1000000).toFixed(1)}M`;
        } else if (price >= 1000) {
            return `$${(price / 1000).toFixed(0)}K`;
        } else {
            return `$${price.toLocaleString()}`;
        }
    }

    formatSquareFeet(area) {
        if (!area) return 'N/A';
        
        if (typeof area === 'string') {
            const numericArea = parseFloat(area.replace(/[^0-9.]/g, ''));
            if (isNaN(numericArea)) return area;
            area = numericArea;
        }

        return `${area.toLocaleString()} sq ft`;
    }

    formatDate(dateString) {
        if (!dateString) return 'N/A';
        
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return dateString;
            
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            return dateString;
        }
    }

    exportData(format) {
        if (!this.propertyData) {
            this.showError('No data to export');
            return;
        }

        if (format === 'json') {
            this.exportAsJSON();
        } else if (format === 'csv') {
            this.exportAsCSV();
        }
    }

    exportAsJSON() {
        const dataStr = JSON.stringify(this.propertyData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `zillow-property-${this.propertyData.zpid || 'data'}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        this.showNotification('Data exported as JSON successfully!', 'success');
    }

    exportAsCSV() {
        // Flatten the data for CSV export
        const flatData = this.flattenObject(this.propertyData);
        const csvContent = this.convertToCSV(flatData);
        
        const dataBlob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `zillow-property-${this.propertyData.zpid || 'data'}.csv`;
        link.click();
        
        URL.revokeObjectURL(url);
        this.showNotification('Data exported as CSV successfully!', 'success');
    }

    flattenObject(obj, prefix = '') {
        const flattened = {};
        
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const newKey = prefix ? `${prefix}_${key}` : key;
                
                if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
                    Object.assign(flattened, this.flattenObject(obj[key], newKey));
                } else if (Array.isArray(obj[key])) {
                    flattened[newKey] = obj[key].join('; ');
                } else {
                    flattened[newKey] = obj[key];
                }
            }
        }
        
        return flattened;
    }

    convertToCSV(data) {
        const headers = Object.keys(data);
        const values = Object.values(data);
        
        const csvHeaders = headers.join(',');
        const csvValues = values.map(value => {
            if (typeof value === 'string' && value.includes(',')) {
                return `"${value}"`;
            }
            return value;
        }).join(',');
        
        return `${csvHeaders}\n${csvValues}`;
    }

    showLoading() {
        document.getElementById('loadingSection').style.display = 'block';
        document.getElementById('resultsSection').style.display = 'none';
        document.getElementById('errorSection').style.display = 'none';
    }

    hideLoading() {
        document.getElementById('loadingSection').style.display = 'none';
    }

    showResults() {
        document.getElementById('resultsSection').style.display = 'block';
        document.getElementById('errorSection').style.display = 'none';
    }

    showError(message) {
        document.getElementById('errorMessage').textContent = message;
        document.getElementById('errorSection').style.display = 'block';
        document.getElementById('loadingSection').style.display = 'none';
        document.getElementById('resultsSection').style.display = 'none';
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            max-width: 400px;
            animation: slideInRight 0.3s ease;
        `;
        
        // Add close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.remove();
        });
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
        
        document.body.appendChild(notification);
    }
}

// Add notification animations to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        margin-left: 1rem;
        padding: 0;
        line-height: 1;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
`;
document.head.appendChild(style);

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new ZillowExtractor();
    console.log('Zillow Data Extractor loaded successfully! 🏠✨');
});
