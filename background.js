const redirectURL = chrome.identity.getRedirectURL();
const { oauth2 } = chrome.runtime.getManifest();
const clientId = oauth2.client_id;
const authParams = new URLSearchParams({
    client_id: clientId,
    response_type: 'token',
    redirect_uri: redirectURL,
    scope: 'email',
});
const authURL = `https://accounts.google.com/o/oauth2/auth?${authParams.toString()}`;

// Função para realizar o fluxo de autenticação
function performAuthentication() {
    chrome.identity.launchWebAuthFlow({ url: authURL, interactive: true }, (responseUrl) => {
        if (chrome.runtime.lastError || !responseUrl) {
            console.error(chrome.runtime.lastError);
            return;
        }

        console.warn({ responseUrl, authURL });
        const url = new URL(responseUrl);
        const urlParams = new URLSearchParams(url.hash.slice(1));
        const params = Object.fromEntries(urlParams.entries()); // access_token, expires_in
        fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        }).then(response => response.json()).then((data) => {
            alert(JSON.stringify(data));
            alert("LOGUIN REALIZADO COM SUCESSO")
            localStorage.setItem('isAuthenticated', true);
            const expirationTimestamp = Date.now() + 8 * 60 * 60 * 1000; // Define uma expiração em 8 horas
            localStorage.setItem('isAuthenticatedExpiration', expirationTimestamp);
            window.location.href = '/main.html';
        }).catch((error) => {
            alert("FALHA NO LOGUIN")
            console.warn(error.message);
        });
    });
}

// Chamar a função de autenticação quando a extensão é carregada
//performAuthentication();

document.addEventListener('DOMContentLoaded', async function() {
    document.querySelector('#customBtn').addEventListener('click', function(){
        performAuthentication()
    });
})

