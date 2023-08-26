LiveFX: Real-Time Currency Converter is a Chrome Extension that simplifies your browsing experience by instantly converting currencies for you. Whether you are shopping online or checking out financial news, you can see prices in USD and EUR automatically converted into PLN without leaving the page.

Features:
Real-Time Conversion: Utilizes the latest exchange rates fetched from the NBP API.
Multi-Currency Support: Currently supports USD and EUR to PLN conversion.
In-Page Conversion: Converts currencies directly within the text of a webpage.
Easy On/Off: Built-in functionality to easily enable or disable conversions.
Smart Caching: Remembers the original text so you can revert back at any time.
Installation & Usage:
To get started, clone this repository and load the extension into your Chrome browser:

bash
Copy code
git clone <repository_url>
# Navigate to chrome://extensions/ in Chrome and enable "Developer Mode"
# Click "Load Unpacked" and choose the cloned directory
Save to grepper
Once installed, the extension automatically activates and converts USD and EUR prices to PLN whenever you load a page. You can also manually control the conversion through the extension's pop-up interface.

Limitations:
The extension is currently optimized for PLN and supports only USD and EUR conversion.
Exchange rates are fetched from the NBP API, so the extension's accuracy relies on the accuracy and availability of this third-party service.
Technical Details:
Built using JavaScript and Chrome's Extension APIs.
Utilizes fetch for API requests and the DOM’s createNodeIterator for in-page text manipulation.
This extension is intended for educational and personal use. Always make sure to double-check the current exchange rates for any critical financial decisions."

Feel free to tailor the description according to the specific functionalities or limitations of your extension!
