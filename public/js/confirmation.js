console.log('hi! confirmation page');

const initialiseConfirmation = async () => {
  let response = null;
  // Make request to node > axios > adyen to get payments methods from Adyen gateway
  try {
    // Append the querystring params from the redirect referer //
    // (POLI or similar) so the server has access to them, for
    // forwarding to the Adyen gateway
    response = await axios.get(`/api/handleShopperRedirect${ window.location.search }`);

    console.log("handleShopperRedirect:", response);
  } catch(err) {

    console.dir("error:", err);
  }
}

document.addEventListener("DOMContentLoaded", initialiseConfirmation);
