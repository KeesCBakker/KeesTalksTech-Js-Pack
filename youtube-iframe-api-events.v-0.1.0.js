/*! YouTube iframe API DOM events v0.1.0 | (c) Kees C. Bakker | MIT | keestalkstech.com */

(function () {

    //everything is loaded
    if (typeof window['onYouTubeReady'] === 'function') {
        return;
    }

    //add function
    var onYouTubeReady = window['onYouTubeReady'] = function (player) {

        //ensure player ID
        if (!player.id) {
            player.id = '_ytifrm' + document.getElementsByTagName('iframe').length;
        }

        //ensure api enabled on source
        if (player.src && player.src.indexOf('enablejsapi=1') == -1) {

            if (player.src.indexOf('?') == -1) {
                player.src += '?';
            }

            player.src = player.src.replace('?', '?enablejsapi=1&');
        }

        //Don't initialize a player twice!
        var YT = window['YT'];
        if (typeof YT.get(player.id) === 'undefined') {

            new YT.Player(player.id, {
                events: {
                    'onReady': function (state) {
                        dispatch(player, 'YT-onReady', state);
                    },
                    'onStateChange': function (state) {
                        dispatch(player, 'YT-onStateChange', state);
                    }
                }
            });
        }
    };

    if (typeof window['YT'] === 'undefined') {
        loadYouTubeJsApi();
    }
    else {
        parseframes();
    }

    function loadJsApi() {

        //load it
        window['onYouTubeIframeAPIReady'] = function () {
            if (document.readyState === "complete") {
                parseframes();
            }
            else {
                document.addEventListener('DOMContentLoaded', function (event) {
                    parseframes();
                });
            }
        }

        //load script
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";

        //insert script
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    function parseframes() {
        var iframes = document.getElementsByTagName('iframe');
        for (var i = 0; i < iframes.length; i++) {
            if (iframes[0].src && iframes[0].src.indexOf('https://www.youtube.com/embed/') == 0) {
                onYouTubeReady(iframes[0]);
            }
        }
    }

    function dispatch(player, name, state) {

        var evnt = new createEvent(name, { 'detail': state });
        evnt.initEvent(name, true, false);
        player.dispatchEvent(evnt);

        /* polyfilled event */
        function createEvent(name, params) {

            if (typeof window.CustomEvent !== 'function') {

                function CustomPolyFilledEvent(event, params) {
                    params = params || { bubbles: false, cancelable: false, detail: undefined };
                    var evt = document.createEvent('CustomEvent');
                    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
                    return evt;
                }

                CustomPolyFilledEvent.prototype = window.Event.prototype;
                return new CustomPolyFilledEvent(name, params);
            }

            return new CustomEvent(name, params);
        }
    }
})();
