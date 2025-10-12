mergeInto(LibraryManager.library, {

  Haptic: function () {
    tg.HapticFeedback.impactOccurred('light');
  },

  GetEndpoint: function()
  {
    var url = getUrl();
    console.log(url);
    var bufferSize = lengthBytesUTF8(url) + 1;
    var buffer = _malloc(bufferSize);
    stringToUTF8(url, buffer, bufferSize)
    return buffer;
  },

  GetPlatform: function () 
  {
    var platform = tg.platform;
    var bufferSize = lengthBytesUTF8(platform) + 1;
    var buffer = _malloc(bufferSize);
    stringToUTF8(platform, buffer, bufferSize)
    return buffer;
  },

  GetUserInfo: function () {
    var userData = JSON.stringify(tg.initData, null, 2);
    var bufferSize = lengthBytesUTF8(userData) + 1;
    var buffer = _malloc(bufferSize);
    stringToUTF8(userData, buffer, bufferSize);
    return buffer;
  },

  GetUserInfoUnsafe: function () {
    var userData = JSON.stringify(tg.initDataUnsafe, null, 2);
    var bufferSize = lengthBytesUTF8(userData) + 1;
    var buffer = _malloc(bufferSize);
    stringToUTF8(userData, buffer, bufferSize);
    return buffer;
  },

  GetStartParams: function() 
  {
        var userData = '';

        if (tg.initDataUnsafe.start_param !== undefined && tg.initDataUnsafe.start_param !== '')
        {
            console.log(tg.initDataUnsafe.start_param);
            userData = JSON.stringify(tg.initDataUnsafe.start_param, null, 2);
        }
        var bufferSize = lengthBytesUTF8(userData) + 1;
        var buffer = _malloc(bufferSize);
        stringToUTF8(userData, buffer, bufferSize);
        return buffer;
  },


  OpenURL: function (url) 
  {
        var jsString = UTF8ToString(url);
        console.log("open url: "+ jsString);
        var encodedURL = encodeURI(jsString);
        openUrl(encodedURL);
        window.open(encodedURL, '_blank'); 
  },
  
  OpenUrlTelegram: function (url, text)
  {
        var urlString = UTF8ToString(url);
        var textString = UTF8ToString(text);
        var str = `https://t.me/share/url?url=${urlString}&text=${textString}`;
        var encodedURL = encodeURI(str);
        tg.openTelegramLink(encodedURL);
        tg.close();
  },
 
 //It works on web 
  OpenUrlTelegram: function (text)
   {
         var textString = UTF8ToString(text);
         var str = `https://t.me/share/url?url=&text=${textString}`;
         var encodedURL = encodeURI(str);
         encodedURL = encodedURL.trim();
         encodedURL = encodedURL.replace(/\s+/, "");
         tg.openTelegramLink(encodedURL);
         tg.close();
   },  

   CopyToClipboard: function (text) 
   {
        var t = UTF8ToString(text);
        const tempInput = document.createElement("textarea");
        tempInput.value = t;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
    },

    DisconnectWallet: function(text)
   {
        disconnect();
    },

    ConnectWallet: function()
    {
        connect();
    },
     SendTransaction: function(address, amount, payload)
     {  
         var addressString = UTF8ToString(address);
         var payloadString = UTF8ToString(payload);
         
        sendTransaction(addressString, amount, payloadString);
     },
     
     GetWalletBalance: function(address) {
         var addressString = UTF8ToString(address);
         var balance = getWalletBalance(addressString); 

         return balance;
     },
     
     GetWalletUrl: function() {
        var url = getWalletUrl();
        
        var urlBufferSize = lengthBytesUTF8(url) + 1;
        var urlBuffer = _malloc(urlBufferSize);
        stringToUTF8(url, urlBuffer, urlBufferSize);
        
        return urlBuffer;
     },
     
     GetWalletUQAddress: function(address) {
        let addressUTF8 = UTF8ToString(address);
        let uqAddress = getWalletUQAddress(addressUTF8);
        
        var uqAddressBufferSize = lengthBytesUTF8(uqAddress) + 1;
        var uqAddressBuffer = _malloc(uqAddressBufferSize);
        stringToUTF8(uqAddress, uqAddressBuffer, uqAddressBufferSize);
        
        return uqAddressBuffer;
     },
     
     GetStartAppRef: function() {
        var refInfo = getStartAppRef();
        
        var refInfoBufferSize = lengthBytesUTF8(refInfo) + 1;
        var refInfoBuffer = _malloc(refInfoBufferSize);
        stringToUTF8(refInfo, refInfoBuffer, refInfoBufferSize);
        
        return refInfoBuffer;
     },
     
     ReadFromClipBoard: function() {
        readFromClipBoard();
     },
     
     ShowOnClickAd: function() {
        showOnclickAds();
     },
     
     IsFullscreen: function() {
        return isFullscreen();
     },
     
     Close: function() {
        tg.close();
     },
     
     ToggleFullscreen: function(isFullscreen) {
        toggleFullscreen(isFullscreen);
     },
     
     GetSafeAreaTop: function() {
        return tg.contentSafeAreaInset.top;
     },
     
     GetSafeAreaBottom: function() {
        return tg.contentSafeAreaInset.bottom;
     },
     
     GetSafeAreaLeft: function() {
        return tg.contentSafeAreaInset.left;
     },
     
     GetSafeAreaRight: function() {
        return tg.contentSafeAreaInset.right;
     }
});