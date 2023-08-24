// popup.js

async function getExchangeRates() {
	const response = await fetch('https://api.nbp.pl/api/exchangerates/tables/A?format=json');
	const data = await response.json();
	const rates = data[0].rates;
	const exchangeRates = {
	  USD: rates.find((rate) => rate.code === 'USD').mid,
	  EUR: rates.find((rate) => rate.code === 'EUR').mid
	};
	return exchangeRates;
  }
  
  async function displayExchangeRates() {
	const exchangeRates = await getExchangeRates();
	document.getElementById("usdRate").textContent = exchangeRates.USD.toFixed(4);
	document.getElementById("eurRate").textContent = exchangeRates.EUR.toFixed(4);
  }
  
  function isSameOrigin(url1, url2) {
	const a = document.createElement('a');
	a.href = url1;
	const origin1 = a.origin;
  
	a.href = url2;
	const origin2 = a.origin;
  
	return origin1 === origin2;
  }
  
document.getElementById("convertCurrency").addEventListener("click", () => {
  chrome.storage.local.get(['conversionMade', 'conversionMessage'], (data) => {
    if (data.conversionMade) {
      return;
    }

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "convertCurrency" });
    });

    displayExchangeRates().then(() => {
      let usdRate = document.getElementById("usdRate").textContent;
      let eurRate = document.getElementById("eurRate").textContent;
      let conversionMessage = document.getElementById("conversionMessage");
      conversionMessage.innerHTML = `Waluty przeliczono według kursów:<br> 1 USD = ${usdRate} PLN,<br> 1 EUR = ${eurRate} PLN`;
      conversionMessage.style.display = "block";

      document.getElementById("convertCurrency").disabled = true;
      document.getElementById("undoConversion").style.display = "block";

      chrome.storage.local.set({
        conversionMade: true,
        conversionMessage: conversionMessage.innerHTML,
        initialURL: window.location.href
      });
    });
  });
});

  
  document.getElementById("undoConversion").addEventListener("click", () => {
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
	  chrome.tabs.sendMessage(tabs[0].id, { action: "revertConversion" });
	});
	document.getElementById("conversionMessage").style.display = "none";
	document.getElementById("convertCurrency").disabled = false;
	document.getElementById("undoConversion").style.display = "none";
  
	chrome.storage.local.set({
	  conversionMade: false,
	  conversionMessage: "",
	  initialURL: ""
	});
  });
  
  // Load the conversion state, initial URL, and message when the popup is opened
  chrome.storage.local.get(['conversionMade', 'conversionMessage', 'initialURL'], (data) => {
	if (data.conversionMade && isSameOrigin(data.initialURL, window.location.href)) {
	  document.getElementById('convertCurrency').disabled = true;
	  document.getElementById('conversionMessage').style.display = 'block';
	  document.getElementById('undoConversion').style.display = 'block';
	} else {
	  document.getElementById('undoConversion').style.display = 'none';
	}
  });
  
  displayExchangeRates();
  