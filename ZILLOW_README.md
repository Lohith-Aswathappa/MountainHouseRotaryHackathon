# 🏠 Zillow Data Extractor

A powerful web application that extracts property information from Zillow URLs using RapidAPI. Simply paste a Zillow property URL, and the app will automatically extract the ZPID (Zillow Property ID) and fetch comprehensive property data.

## ✨ Features

- **🔗 URL Parsing**: Automatically extracts ZPID from various Zillow URL formats
- **📊 Data Extraction**: Fetches comprehensive property information via RapidAPI
- **💾 Data Export**: Export data in JSON or CSV formats
- **🎨 Modern UI**: Clean, responsive design with smooth animations
- **🔑 API Key Management**: Secure storage of RapidAPI keys
- **📱 Mobile Friendly**: Works perfectly on all devices

## 🚀 How It Works

1. **Input Zillow URL**: Paste any Zillow property URL
2. **Extract ZPID**: App automatically parses the URL to find the ZPID
3. **Fetch Data**: Uses RapidAPI to get comprehensive property information
4. **Display Results**: Shows property details in a beautiful, organized format
5. **Export Data**: Download data in JSON or CSV format

## 🛠️ Setup Instructions

### 1. Get RapidAPI Key

1. Visit [RapidAPI Zillow API](https://rapidapi.com/realty-mole-pro-realty-mole-pro-default/api/zillow-com1/)
2. Sign up for a free account
3. Subscribe to the Zillow API (free tier available)
4. Copy your API key

### 2. Configure the App

1. Open `zillow-extractor.html` in your browser
2. Enter your RapidAPI key in the "RapidAPI Configuration" section
3. Click "Save Key" to store it securely

### 3. Start Extracting Data

1. Paste a Zillow property URL
2. Click "Extract Data"
3. View the extracted property information
4. Export data as needed

## 📋 Supported Zillow URL Formats

The app automatically detects and extracts ZPID from these URL formats:

- **Home Details**: `https://www.zillow.com/homedetails/12345678_zpid/`
- **Short Format**: `https://www.zillow.com/h/12345678/`
- **Property Format**: `https://www.zillow.com/property/12345678/`
- **Direct ZPID**: Any URL containing an 8+ digit number

## 📊 Extracted Data Fields

### Basic Information
- **Address**: Full property address
- **Price**: Formatted property price
- **ZPID**: Zillow Property ID
- **Property Type**: Type of home (Single Family, Condo, etc.)

### Property Details
- **Bedrooms**: Number of bedrooms
- **Bathrooms**: Number of bathrooms
- **Square Feet**: Living area in square feet
- **Listed Date**: When the property was listed

### Additional Information
- **Description**: Property description and summary
- **Features**: Property amenities and features
- **Lot Size**: Property lot dimensions
- **Year Built**: Construction year
- **Property Tax**: Tax information

## 🔧 Technical Details

### Technologies Used
- **HTML5**: Semantic markup structure
- **CSS3**: Modern styling with Flexbox and Grid
- **JavaScript (ES6+)**: Class-based architecture with async/await
- **RapidAPI**: Zillow data integration
- **Local Storage**: Secure API key storage

### API Integration
- **Endpoint**: `https://zillow-com1.p.rapidapi.com/property`
- **Method**: GET request with ZPID parameter
- **Headers**: RapidAPI authentication headers
- **Response**: JSON property data

### Data Processing
- **URL Parsing**: Regex-based ZPID extraction
- **Data Formatting**: Price, area, and date formatting
- **Feature Extraction**: Dynamic feature tag generation
- **Export Functions**: JSON and CSV export capabilities

## 📁 File Structure

```
├── zillow-extractor.html    # Main HTML interface
├── zillow-styles.css        # CSS styling and animations
├── zillow-script.js         # JavaScript functionality
└── ZILLOW_README.md         # This documentation
```

## 🎯 Usage Examples

### Example 1: Basic Property Extraction
```
Input URL: https://www.zillow.com/homedetails/12345678_zpid/
Result: Complete property data with all available fields
```

### Example 2: Short URL Format
```
Input URL: https://www.zillow.com/h/87654321/
Result: Same comprehensive data extraction
```

### Example 3: Export Data
```
1. Extract property data
2. Click "Export as JSON" for raw data
3. Click "Export as CSV" for spreadsheet format
```

## 🔒 Security Features

- **API Key Storage**: Secure local storage (not transmitted to external servers)
- **Input Validation**: URL format validation before API calls
- **Error Handling**: Comprehensive error handling and user feedback
- **Rate Limiting**: Respects RapidAPI rate limits

## 🚨 Error Handling

The app handles various error scenarios:

- **Invalid URLs**: Clear error messages for malformed URLs
- **API Errors**: HTTP status code handling and user feedback
- **Missing Data**: Graceful fallbacks for missing property information
- **Network Issues**: Connection error handling and retry suggestions

## 📱 Browser Compatibility

- **Chrome**: 60+ (Full support)
- **Firefox**: 55+ (Full support)
- **Safari**: 12+ (Full support)
- **Edge**: 79+ (Full support)
- **Mobile Browsers**: iOS Safari, Chrome Mobile

## 🔄 Future Enhancements

- **Batch Processing**: Extract data from multiple URLs
- **Data Comparison**: Compare multiple properties side-by-side
- **Historical Data**: Track property price changes over time
- **Market Analysis**: Neighborhood and market insights
- **Image Extraction**: Property photos and virtual tours
- **Advanced Filtering**: Filter properties by specific criteria

## 🆘 Troubleshooting

### Common Issues

1. **"Could not extract ZPID"**
   - Ensure the URL is a valid Zillow property page
   - Check if the URL contains a property ID number

2. **"Error fetching property data"**
   - Verify your RapidAPI key is correct
   - Check your internet connection
   - Ensure you haven't exceeded API rate limits

3. **"No data to export"**
   - Extract property data first before attempting to export
   - Refresh the page if needed

### Getting Help

- **Check Console**: Open browser developer tools for detailed error logs
- **Verify API Key**: Ensure your RapidAPI key is valid and active
- **Test URL**: Try with a different Zillow property URL
- **Clear Cache**: Clear browser cache and local storage if needed

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- **RapidAPI**: For providing the Zillow API integration
- **Zillow**: For property data access
- **Font Awesome**: For beautiful icons
- **Google Fonts**: For typography

---

**Happy Property Data Extraction! 🏠✨**

*Extract, analyze, and export Zillow property data with ease using this powerful web application.*
