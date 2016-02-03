/* scroll to bottom of page after generate
// copy text to clip board ; http://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
// Share to: Whatsapp, Twitter http://w3lessons.info/2015/03/14/how-to-share-content-on-whatsapp-using-jquery/
// BulkSMS : http://developer.bulksms.com/eapi/overview.html
// remove QR and open link button when on mobile
// Email to customer
// merchant ID populates from URL
// generate a QR code
// only number input
// SMS text for Mr Delivery - probably pre-filled based on deploy?
// change
// <script src="scripts/vendor/qrcode.min.js">
// <script src="scripts/app.js"> */

// whatsapp share button
$(document).ready(function() {
var isMobile = {
Android: function() {
    return navigator.userAgent.match(/Android/i);
},
BlackBerry: function() {
    return navigator.userAgent.match(/BlackBerry/i);
},
iOS: function() {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
},
Opera: function() {
    return navigator.userAgent.match(/Opera Mini/i);
},
Windows: function() {
    return navigator.userAgent.match(/IEMobile/i);
},
any: function() {
    return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
}
        };
$(document).on("click", '.whatsapp', function() {
    if( isMobile.any() ) {

        var text = $(this).attr("data-text");
        var url = $(this).attr("data-link");
        var message = encodeURIComponent(text) + " - " + encodeURIComponent(url);
        var whatsapp_url = "whatsapp://send?text=" + message;
        window.location.href = whatsapp_url;
    } else {
        alert("Please share this article in mobile device");
    }

});
});

//button : create link
$('#generateButton').click(function() {
  var merchantId = $('#merchantId').val();
  var amountOwed = $('#amountOwed').val();
  var reference = $('#reference').val();
  var output = generate(merchantId, amountOwed, reference);
  var qrImage = (generateQR(merchantId, amountOwed, reference));
  var page=document.getElementById('qr-link-output');

  sms_client(output, "27724605771");

  if (merchantId) {
  $('#output').val(output);
  $('#output').select();
  $('#qrImage').attr("src",qrImage)
  $('#snapscan-qr-image').attr("src",qrImage)
  $('#qrLink').attr("href",output)
  $('#whatsappShare').attr("data-link",output)
  page.style.visibility='visible';
  $('#amountOwed').val('');
  $('#reference').val('');

  }
  else {
  alert("Please enter a merchantId to create a link")
  }

});

function copyToClipboard(text) {
    window.prompt("Copy to clipboard: Ctrl+C, Enter", text);
  }

// get parameter from URL
$.urlParam = function(name){
var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
if (results==null){
   return null;
}
else{
   return results[1] || 0;
}
}


function sms_client(paylink, number) {
    $.ajax({
      type: "POST",
      url: '/send_link',
      data : JSON.stringify({ paylink: paylink, client_number: number}),
      dataType: 'json',
      contentType: 'application/json'
    });
}
// generate PayLink
function generate(merchantId, amountOwed, reference) {
    var paylink = "https://pos.snapscan.io/qr/" + merchantId

    if (amountOwed || reference) {
    paylink = paylink + "?";

    if (amountOwed) {
    paylink = paylink + "&amount=" + amountOwed*100;
    }

    if (reference) {
    paylink = paylink + "&id=" + reference;
    }

    }

    return paylink;
}

// generate link for QR code
function generateQR(merchantId, amountOwed, reference) {
    var qrlink = "https://pos.snapscan.io/qr/" + merchantId + '.svg'

    if (amountOwed !== null || reference !== null) {
    qrlink = qrlink + "?";

    if (amountOwed !== null) {
    qrlink = qrlink + "&amount=" + amountOwed*100;
    }

    if (reference !== null) {
    qrlink = qrlink + "&id=" + reference;
    }

    }

    qrlink = qrlink + "&snap_code_size=250";

    return qrlink;
}
