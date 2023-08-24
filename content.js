// content.js



async function getExchangeRates() {
	const response = await fetch('https://api.nbp.pl/api/exchangerates/tables/A?format=json');
	const data = await response.json();
	const rates = data[0].rates;
	const exchangeRates = {
	  USD: rates.find((rate) => rate.code === 'USD').mid,
	  EUR: rates.find((rate) => rate.code === 'EUR').mid,
	};
	return exchangeRates;
  }
  
  const originalText = new Map();
  
  function convertCurrencies(exchangeRates) {
	const regexUSD = /((?:\$|USD)\s?[0-9,]+(?:\.\d{1,2})?)/g;
	const regexEUR = /((?:EUR)\s?[0-9,]+(?:\.\d{1,2})?)/g;
	chrome.storage.local.get['conversionMade'], (data) => {
		if (data.conversionMade) {
		  getExchangeRates().then((exchangeRates) => {
			convertCurrencies(exchangeRates);
		  });
		}
	}
	
  
	function replacerUSD(match) {
	  const amount = parseFloat(match.replace(/[$,]/g, ''));
	  const convertedAmount = (amount * exchangeRates.USD).toFixed(2);
	  return `${match} (${convertedAmount} PLN)`;
	}
  
	function replacerEUR(match) {
	  const amount = parseFloat(match.replace(/[,]/g, '.').replace(/[^\d.]/g, ''));
	  const convertedAmount = (amount * exchangeRates.EUR).toFixed(2);
	  return `${match} (${convertedAmount} PLN)`;
	}
  
	const allTextNodes = document.createNodeIterator(document.body, NodeFilter.SHOW_TEXT);
  
	let currentNode;
	while ((currentNode = allTextNodes.nextNode())) {
		if (!originalText.has(currentNode) || originalText.get(currentNode) !== currentNode.textContent) {
		  originalText.set(currentNode, currentNode.textContent);
		}
		currentNode.textContent = currentNode.textContent
		.replace(regexUSD, replacerUSD)
		.replace(regexEUR, replacerEUR);
	}
}
  
function revertConversion() {
  for (const [node, text] of originalText.entries()) {
    node.textContent = text;
  }
  originalText.clear(); // Dodane: wyczyść mapę, aby uniknąć ponownego przywracania tego samego tekstu
}

  
  
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.action === "revertConversion") {
	  revertConversion();
	}
  });
  
  chrome.storage.local.get(['conversionMade'], (data) => {
	if (data.conversionMade) {
	  getExchangeRates().then((exchangeRates) => {
		convertCurrencies(exchangeRates);
	  });
	}
  });

  // ... (reszta kodu w pliku content.js)

  function onPageLoad() {
	chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	  if (request.action === "convertCurrency") {
		getExchangeRates().then((exchangeRates) => {
		  convertCurrencies(exchangeRates);
		});
	  } else if (request.action === "revertConversion") {
		revertConversion();
	  }
	});
  }
  
  if (document.readyState === "complete") {
	onPageLoad();
  } else {
	window.addEventListener("load", onPageLoad);
  }

  