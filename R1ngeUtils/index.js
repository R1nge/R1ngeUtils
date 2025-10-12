 // window.addEventListener("load", function () {
 //        if ("serviceWorker" in navigator) {
 //          navigator.serviceWorker.register("ServiceWorker.js");
 //        }
 //      });

      var container = document.querySelector("#unity-container");
      var canvas = document.querySelector("#unity-canvas");
      var loadingBar = document.querySelector("#unity-loading-bar");
      var progressBarFull = document.querySelector("#unity-progress-bar-full");
      var warningBanner = document.querySelector("#unity-warning");

      var unity;
      var tg = window.Telegram.WebApp;

      tg.expand();
      
      try {

          let platform = tg.platform;
          let isDesktop = platform == "tdesktop" || platform == "weba" || platform == "web";
          
          if (!isDesktop){
              tg.requestFullscreen?.();
              tg.lockOrientation?.();   
          }
      } catch (e) {
          console.log(e) 
      }
      
      function toggleFullscreen(on){
      try {
            let platform = tg.platform;
            let isDesktop = platform == "tdesktop" || platform == "weba" || platform == "web";
                      
            if (!isDesktop){
      
                if (on) {
                    tg.requestFullscreen?.();
                }else{
                    tg.exitFullscreen?.();
                }
            
                tg.lockOrientation?.();
                
            }
      } catch (e) {
          console.log(e) 
      }
      }
     
      
      function isFullscreen() {
                try {
                
                    let platform = tg.platform;
                    let isDesktop = platform == "tdesktop" || platform == "weba" || platform == "web";
                                          
                    if (isDesktop){
                        return false;
                    }
                
                   //check if 16:9
                    if (parseInt(window.getComputedStyle(canvas).width) / parseInt(window.getComputedStyle(canvas).height) > 0.5) {
                        return false;    
                    }
                    
                    return tg.isFullscreen;
                } catch (e) {
                    return false;
                }
                
                return false;
            }

      //buttons click
      Telegram.WebApp.onEvent('settingsButtonClicked', function () {
         console.log('Settings opened!');
      });

      Telegram.WebApp.onEvent('backButtonClicked', function () {
         console.log('Settings opened!');
      });

      //fixes bug: if player taps non stop the sync request won't be sent
      tg.isClosingConfirmationEnabled = true;


      //scroll fix
      tg.disableVerticalSwipes?.();

 try {
     tg.BackButton.isVisible = true;
     tg.onEvent('backButtonClicked', () => { 
         console.log('close button clicked');
         unity.SendMessage('PayloadManager', 'OnClose');
         tg.close();
     });
 } catch (e)
 {
     console.log(e);
 }

      

 function ensureDocumentIsScrollable() {
     const isScrollable = document.documentElement.scrollHeight > window.innerHeight;
     if (!isScrollable) {
         document.documentElement.style.setProperty("height", "calc(100vh + 1px)", "important");
     }
 }

 function preventCollapse() {
     if (window.scrollY === 0) {
         window.scrollTo(0, 1);
     }
 }
    const scrollableElement = document.documentElement;
    scrollableElement.addEventListener("touchstart", preventCollapse);
    ensureDocumentIsScrollable();

      
      window.addEventListener("touchmove", (e) => e.preventDefault(), { passive: false });
      window.scrollTo(0, 100);

     //get app Url
     function getUrl()
     {
         if (window.origin.includes("rent-tycoon-dev"))
         {
             return "https://game-dev.rent-tycoon.me";
         }
         else if (window.origin.includes("rent-tycoon-qa"))
         {
             return "https://game-qa.rent-tycoon.me";
         }
         else 
         {
             return "https://game.rent-tycoon.com";
         }
     }
     
     function showOnclickAds(){
         
        try {
                 tg.exitFullscreen?.();
             } catch (e) {
                 console.log(e)
             } 
         
         window.show().then(() => {
             
             console.log('tma ad played'); 
             onAdPlayed(); 
         }).catch(e => console.error('ad error', e))
     }
     
     function onAdPlayed(){
        try {
                 tg.requestFullscreen?.();
             } catch (e) {
                 console.log(e)
             }
         fetch(`${getUrl()}/api/v2/webhooks/partners/onclicka?userid=${tg?.initDataUnsafe?.user.id}`)
         .catch(e => console.error('ad error', e))
     }
     
     function getManifest()
     {
         if (window.origin.includes("rent-tycoon-dev"))
         {
             return "https://rent-tycoon-dev.fra1.digitaloceanspaces.com/manifest.json";
         } 
         else if (window.origin.includes("rent-tycoon-qa"))
         {
             return "https://rent-tycoon-qa.fra1.digitaloceanspaces.com/manifest.json";
         } 
         else 
         {
             return "https://rent-tycoon.fra1.digitaloceanspaces.com/manifest.json";
         }
     }

      //orientation check
      window.addEventListener("orientationchange", onViewportChanged)
      function onViewportChanged() 
      {
          if (unity) 
          {
  	      setTimeout(() => {
          if (window.orientation == 0 || window.orientation == 180)
          {
           unity.SendMessage('PayloadManager', 'OrientationChanged',"portrait");
          }
          else if (window.orientation == 90 || window.orientation == -90)
          {
          unity.SendMessage('PayloadManager', 'OrientationChanged',"landscape");
          }
          }, 1000);
          }
      }

      //get user data
      var initData = tg.initData;
     const startAppRef = tg?.initDataUnsafe?.start_param ?? "";
      var userData = JSON.stringify(initData, null, 2);
      console.log(userData);
      


      tg.ready();
      
      const tonConnectOptions = 
      {
            disableAutoPauseConnection: true,
            manifestUrl: getManifest()
      };

        const tonConnectUI = new TON_CONNECT_UI.TonConnectUI(tonConnectOptions);

        tonConnectUI.uiOptions = {
            twaReturnUrl: 'https://t.me/Rent_Tower_Game_bot/TapTower',
        };

       async function disconnect()
       {
           if (tonConnectUI.connected)
       {
           await tonConnectUI.disconnect();
       }
       }
       
       let isTransaction = false;

const unsubscribeModal = tonConnectUI.onModalStateChange(
(state) => 
    {
       // update state/reactive variables to show updates in the ui
       // state.status will be 'opened' or 'closed'
       if(state.status == 'closed' && unity)
       {
            if(tonConnectUI.wallet)
		    {
                const rawAddress = new TonWeb.utils.Address(tonConnectUI.wallet.account.address);
                const addressEQ = rawAddress.toString(true, true, true);
                const addressUQ = rawAddress.toString(true, true, false);
 			    unity.SendMessage('WalletService', 'WalletConnected', addressEQ);
                 unity.SendMessage('WalletService', 'WalletConnectedUI', addressUQ);
		    }
        	else
		    {
 			    unity.SendMessage('WalletService', 'WalletNotConnected', "wallet is null");
		    }
            
            if (isTransaction){
                unity.SendMessage('PayloadManager', 'OnTransactionSent', "If your transaction fails, the payment will be returned within 10 minutes.");
                isTransaction = false;
            }
       }
    }
);

 function getStartAppRef(){
     return startAppRef;
 }

 function getUserInfo(){
        return userData;
 }

 function getWalletUQAddress(EQAddress){
     if (EQAddress){
         const adddressUQ = new TonWeb.utils.Address(EQAddress);
         return adddressUQ.toString(true, true, false);     
     }
     //alert(EQAddress);
    return '';
 }
 
function getWalletUrl(){
    if (tonConnectUI.wallet){
        let link = tonConnectUI.walletInfo.universalLink;
        //alert(link);
        unity.SendMessage('PayloadManager', 'OnWalletUrlReceive', link);
        return link;
    }
}

function openUrl(url){     
    openedWindow = window.open(url);
}

 async function connect()
    {
        if (tonConnectUI.connected)
        {
            await tonConnectUI.disconnect();
        }   
            tonConnectUI.openModal().then(() => {
                console.log('Modal opened successfully');    
            })
            .catch((error) => {
                console.error('Failed to open modal:', error);
            });;
  
    }

    //wallet address, amount in nano coins 1e9, payload from backend
 async function sendTransaction(address, amount, payload) {
     if (await ensureWalletConnected()){
         try {
             await sendTonToContract(address, amount, payload);
         } catch (e) {
             console.log('Transaction error: ' + e.message);
             unity.SendMessage('PayloadManager', 'OnTransactionSent', "Error: " + e.message);
             // unity.SendMessage('PayloadManager', 'OnTransactionWalletNotConnected');
             isTransaction = false;
             //setTimeout(unity.SendMessage('PayloadManager', 'OnTransactionSent', "If your transaction fails, Tapcoins will be returned within 10 minutes."), 10000)
         }    
     }else{
         unity.SendMessage('PayloadManager', 'OnTransactionWalletNotConnected'); 
         isTransaction = false;
     }
 }

 async function ensureWalletConnected() {
     if (!tonConnectUI.connected) {
         return false;
     }
     
     if (!tonConnectUI.connected){
         const connectedWallet = await tonConnectUI.connectWallet();             
         console.log('Wallet connected: ' + connectedWallet.address);
         return false;
     }
     
     return true;
 }

 async function sendTonToContract(address, amount, payload) {
    isTransaction = true;
    console.log("sendTonToContract: " + address + " " + amount + " " + payload);
    
     const transaction = {
         validUntil: Math.floor(Date.now() / 1000) + 60 * 60,
         messages: [
             {
                 "address": address,
                 "amount": amount.toString(),
                 "payload": payload,
             }
         ]
     };

     try {
         const result = await tonConnectUI.sendTransaction(transaction, {
             modals: ['before'],
             notifications: ['before', 'success', 'error']
         });
         
         unity.SendMessage('PayloadManager', 'OnTransactionSent', "If your transaction fails, the payment will be returned within 10 minutes.");
     } catch (e) {
         alert('Transaction error in sendTonToContract: ' + e.message);
         throw e;
     }
 }

 window.addEventListener('ton-connect-transaction-sent-for-signature', (event) => {
     //tg.showAlert("Open your wallet and confirm the transaction");
     //let link = tonConnectUI.walletInfo.universalLink;
     //window.open(link + "?open=1", '_blank');
 });

window.addEventListener('ton-connect-transaction-sent-for-signature', (event) => {
    
});

 async function readFromClipBoard() {
     return new Promise((resolve, reject) => {
         const invisibleElement = document.createElement('div');
         invisibleElement.className = 'invisible';
         document.body.appendChild(invisibleElement);

         // Add click event listener to the invisible element
         invisibleElement.addEventListener('click', async () => {
             try {
                 const text = await navigator.clipboard.readText();
                 console.log('Clipboard text:', text);
                 resolve(text); // Resolve the promise with the clipboard text
             } catch (err) {
                 console.error('Failed to read clipboard:', err);
                 reject(err); // Reject the promise with the error
             } finally {
                 // Remove the invisible element
                 document.body.removeChild(invisibleElement);
             }
         });

         // Programmatically trigger a click on the invisible element
         invisibleElement.click();
     });
 }

 const TonWeb = window.TonWeb;
 const tonweb = new TonWeb(new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC'));
     async function getWalletBalance(address) {
         try {
             const balance = await tonweb.provider.getBalance(address);
             //alert((balance / 1e9).toString());
             
             if (isNaN(balance)){
                 unity.SendMessage('PayloadManager', 'OnWalletBalanceReceive', 0);
             }else{
                 unity.SendMessage('PayloadManager', 'OnWalletBalanceReceive', parseFloat(balance));
             }
             //unity.SendMessage('PayloadManager', 'OnWalletBalanceReceive', (balance / 1e9).toString());
         }catch (e){
             //alert("Get balace error:" + e);
             unity.SendMessage('PayloadManager', 'OnWalletBalanceReceive', 0);
             //alert(address);
         }
     }


 // Shows a temporary message banner/ribbon for a few seconds, or
      // a permanent error message on top of the canvas if type=='error'.
      // If type=='warning', a yellow highlight color is used.
      // Modify or remove this function to customize the visually presented
      // way that non-critical warnings and error messages are presented to the
      // user.
      function unityShowBanner(msg, type) {
        function updateBannerVisibility() {
          warningBanner.style.display = warningBanner.children.length ? 'block' : 'none';
        }
        
        if (msg.includes("Content-Type")){
            return;
        }
        
        var div = document.createElement('div');
        div.innerHTML = msg;
        warningBanner.appendChild(div);
        if (type == 'error') div.style = 'background: red; padding: 10px;';
        else {
          if (type == 'warning') div.style = 'background: yellow; padding: 10px;';
          setTimeout(function() {
            warningBanner.removeChild(div);
            updateBannerVisibility();
          }, 5000);
        }
        updateBannerVisibility();
      }
      

      
     var buildUrl = "Build";
  var loaderUrl = buildUrl + "/{{{ LOADER_FILENAME }}}";
  var config = {
    dataUrl: buildUrl + "/{{{ DATA_FILENAME }}}",
    frameworkUrl: buildUrl + "/{{{ FRAMEWORK_FILENAME }}}",
#if USE_THREADS
    workerUrl: buildUrl + "/{{{ WORKER_FILENAME }}}",
#endif
#if USE_WASM
    codeUrl: buildUrl + "/{{{ CODE_FILENAME }}}",
#endif
#if MEMORY_FILENAME
    memoryUrl: buildUrl + "/{{{ MEMORY_FILENAME }}}",
#endif
#if SYMBOLS_FILENAME
    symbolsUrl: buildUrl + "/{{{ SYMBOLS_FILENAME }}}",
#endif
    streamingAssetsUrl: "StreamingAssets",
    companyName: {{{ JSON.stringify(COMPANY_NAME) }}},
    productName: {{{ JSON.stringify(PRODUCT_NAME) }}},
    productVersion: {{{ JSON.stringify(PRODUCT_VERSION) }}},
    showBanner: unityShowBanner,
  };

      // By default Unity keeps WebGL canvas render target size matched with
      // the DOM size of the canvas element (scaled by window.devicePixelRatio)
      // Set this to false if you want to decouple this synchronization from
      // happening inside the engine, and you would instead like to size up
      // the canvas DOM size and WebGL render target sizes yourself.
      // config.matchWebGLToCanvasSize = false;

      if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
        // Mobile device style: fill the whole browser client area with the game canvas:
        var meta = document.createElement('meta');
        meta.name = 'viewport';
        meta.content = 'width=device-width, height=device-height, initial-scale=1.0, user-scalable=no, shrink-to-fit=yes';
        document.getElementsByTagName('head')[0].appendChild(meta);
      }

      loadingBar.style.display = "block";

    
      var script = document.createElement("script");
script.src = loaderUrl;
script.onload = () => {
    
    
  createUnityInstance(canvas, config, (progress) => {
    progressBarFull.style.width = 100 * progress + "%";
  }).then((unityInstance) => {
    unity = unityInstance;
    loadingBar.style.display = "none";
      if ("virtualKeyboard" in navigator) {
          console.log(navigator.virtualKeyboard.overlaysContent); // false
          navigator.virtualKeyboard.overlaysContent = true; // Opt out of the automatic handling.
      }

      //activity checking
    document.addEventListener('visibilitychange', function() {
      if (document.hidden) {
          if ('virtualKeyboard' in navigator) {
              navigator.virtualKeyboard.hide();
          }
              unityInstance.SendMessage("PayloadManager", "Hide");
      } else {
        unityInstance.SendMessage("PayloadManager", "Show");
      }
    });
    onViewportChanged();
  }).catch((message) => {
    alert(message);
    window.location.reload();
  });
};
      document.body.appendChild(script);
