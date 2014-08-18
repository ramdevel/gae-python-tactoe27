
/**
* Contains methods on client side to update through google Channel API.
*/
var UIUpdater = {};

/**
* Calls 'name' method with 'arguments'.
* @param name method name.
*/
UIUpdater.execute = function ( name ) {
    return UIUpdater[name] && UIUpdater[name].apply( UIUpdater, [].slice.call(arguments, 1) );
};

onOpened = function () {
    console.log('opened..........');
};

onMessage = function ( m ) {
    var data = $.parseJSON( m.data );
    UIUpdater.execute( data.event, data.args );
};

onError = function() {
    console.log("Error => ");
};

onClose = function() {
    console.log("channel closed");
};

setChannel = function( token ) {
    var channel = new goog.appengine.Channel(token);
    var socket = channel.open();
    socket.onopen = onOpened;
    socket.onmessage = onMessage;
    socket.onerror =  onError;
    socket.onclose =  onClose;
};

loadContent = function (url) {
    var copy_url = url;
    openLoading();
    if (url == '') {
        copy_url = '/';
    }
    $.ajax({
        type: 'GET',
        url: '/ajax' + copy_url,
        dataType: 'json',
        data: {},
        success: function(data) {
            $( '#content .post' ).empty();
            $( '.tmp_dialog' ).remove();
            $(  '#content .post'  ).html(data);
            closeLoading();
        },
        error: function (data) {
            closeLoading();
            showErrorMsg(data.status + ': ' + data.statusText + '\n' + data.responseText);
        }
    });
};

openLoading = function () {
    $( '#load' ).removeClass( 'hide' );
};

closeLoading = function () {
    $( '#load' ).addClass( 'hide' );
};


showErrorMsg = function ( msg ) {
    $( '#warning_msg' ).text(msg);
    $( "#error-message" ).dialog( "open" );
};

addCallBackMethods = function ( methods ) {
    for ( var name in methods ) {
        UIUpdater [name] = methods[name];
    }
};

highlight = function (comp) {
    comp.addClass( "ui-state-highlight" );
    setTimeout(function() {
        comp.removeClass( "ui-state-highlight", 1500 );
    }, 5500 );
};