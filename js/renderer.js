define( [
    'jquery',
    'markdown'
], function( $, markdown ) {

    /**
     * @param {function} requestFunction A function with `path` and `defer` parameters
     * @return {function} A function with `key` and `callback` parameters
     */
    var createPromiseCaches = function( requestFunction ) {
        var promiseCaches = {};
        return function( key, callback ) {
            if ( !promiseCaches[ key ] ) {
                promiseCaches[ key ] = $.Deferred( function( defer ) {
                    requestFunction( key, defer );
                } ).promise();
            }
            return promiseCaches[ key ].done( function( response ) {
                callback( key, response );
            } );
        };
    };

    /**
     * @param {string} str
     * @return {string}
     */
    var encodeHtml = function( str ) {
        return str.replace( /&/g, '&amp;' )
                .replace( /</g, '&lt;' )
                .replace( />/g, '&gt;' )
                .replace( /"/g, '&quot;' )
                .replace( /'/g, '&apos;' );
    };

    return function( options ) {

        var opts = $.extend( true, {
            config: {},
            elMenuBox: null,
            elNavBox: null,
            elMainBox: null,
            elIndexBox: null,
            githubApiUrl: 'https://api.github.com',
            githubOwner: null,
            githubRepository: null
        }, options );

        var elMenuBox = $( opts.elMenuBox );
        var elNavBox = $( opts.elNavBox );
        var elMainBox = $( opts.elMainBox );
        var elIndexBox = $( opts.elIndexBox );

        var markdownConverter = new markdown.Converter();

        /**
         * @param {string} hash
         * @return {string} path
         */
        var getPathByHash = function( hash ) {
            return (hash && hash.indexOf( '#' ) === 0) ? hash.substr( 1 ) : '';
        };

        /**
         * @param {object} data
         * @return {string} HTML
         */
        var getIndexBoxHtml = function( data ) {
            var html = '<ul>';
            for ( var i = 0; i < data.length; i++ ) {
                html += '<li>';
                if ( data[i].children && data[i].children.length > 0 ) {
                    html += '<a href="javascript:;"><span>' + data[i].title + '</span></a>' +
                            getIndexBoxHtml( data[i].children );
                } else {
                    html += '<a href="' + data[i].href + '"><span>' + data[i].title + '</span></a>';
                }
                html += '</li>';
            }
            html += '</ul>';
            return html;
        };

        /**
         * @param {object} data
         */
        var updateIndexBox = function( data ) {
            elNavBox.html( getIndexBoxHtml( data ) );
        };

        /**
         * @param {string} content
         */
        var updateMainBox = function( content ) {
            elMainBox.html( '<div class="markdown">' + markdownConverter.makeHtml( content ) + '</div>' );
        };

        /**
         * @param {string} path
         * @param {function} result
         */
        var updateStage = function( path, result ) {
            updateMainBox( result );
        };

        var parsePath = createPromiseCaches( function( path, defer ) {
            $.get( 'data/' + path + '.md' ).then( defer.resolve, defer.reject );
        } );

        var buildMenuBox = function() {
            var html = '<ul>';
            for ( var i = 0; i < opts.config.length; i++ ) {
                html += '<li><a';
                if ( opts.config[i].children ) {
                    html += ' data-children="' + encodeHtml( JSON.stringify( opts.config[i].children ) ) + '"';
                }
                html += ' href="' + (opts.config[i].href ? opts.config[i].href : 'javascript:;') + '"><span>' + opts.config[i].title + '</span></a></li>';
            }
            html += '</ul>';
            elMenuBox.html( html ).on( 'click', 'a', function() {
                var el = $( this );
                el.closest( 'li' ).addClass( 'current' ).siblings().removeClass( 'current' );
                var children = el.data( 'children' );
                if ( children ) {
                    updateIndexBox( children );
                }
            } );
        };

        buildMenuBox();

        parsePath( getPathByHash( window.location.hash || '#home' ), updateStage );

        $( opts.elMenuBox + ',' + opts.elNavBox + ',' + opts.elMainBox ).on( 'click', 'a', function() {
            if ( this.hash ) {
                parsePath( getPathByHash( this.hash ), updateStage );
            }
        } );

    };

} );