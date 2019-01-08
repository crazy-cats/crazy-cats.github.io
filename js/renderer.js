define( [
    'jquery',
    'markdown'
], function( $ ) {

    /**
     * @param {function} requestFunction A function with `path` and `defer` parameters
     * @return {function} A function with `path` and `callback` parameters
     */
    var createPromiseCaches = function( requestFunction ) {
        var promiseCaches = {};
        return function( path, callback ) {
            if ( !promiseCaches[ path ] ) {
                promiseCaches[ path ] = $.Deferred( function( defer ) {
                    requestFunction( path, defer );
                } ).promise();
            }
            return promiseCaches[ path ].done( function( response ) {
                callback( path, response );
            } );
        };
    };

    /**
     * @param {string} str
     * @return {string}
     */
    var encodeAttr = function( str ) {
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
            elIndexBox: null,
            elMainBox: null,
            githubApiUrl: 'https://api.github.com',
            githubOwner: null,
            githubRepository: null
        }, options );

        var elMenuBox = $( opts.elMenuBox );
        var elIndexBox = $( opts.elIndexBox );
        var elMainBox = $( opts.elMainBox );

        /**
         * { xxx: { title: xxx, children: {  ...  } } }
         */
        var data = {};

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
            var html = '';
            for ( var i = 0; i < data.length; i++ ) {
                html += '<li class="item">';
                if ( data[i].children && data[i].children.length > 0 ) {
                    html += '<a href="javascript:;"><span>' + data[i].title + '</span></a>' +
                            '<ul>' + getIndexBoxHtml( data[i].children ) + '</ul>';
                } else {
                    html += '<a href="' + data[i].href + '"><span>' + data[i].title + '</span></a>';
                }
                html += '</li>';
            }
            return html;
        };

        var updateIndexBox = function( data ) {
            elIndexBox.html( getIndexBoxHtml( data ) );
        };

        var updateMainBox = function( path ) {
        };

        /**
         * @param {string} path
         * @param {function} result
         */
        var updateStage = function( path, result ) {
            //updateIndexBox( path );
            //updateMainBox( path );
            console.log( path );
            console.log( result );
        };

        var updatePath = createPromiseCaches( function( path, defer ) {
            var url = opts.githubApiUrl + '/repos/' + opts.githubOwner + '/' + opts.githubRepository + '/contents/data/' + path + '.md';
            $.getJSON( url ).then( defer.resolve, defer.reject );
        } );

        var buildMenuBox = function() {
            var html = '<ul>';
            for ( var i = 0; i < opts.config.length; i++ ) {
                html += '<li><a';
                if ( opts.config[i].children ) {
                    html += ' data-children="' + encodeAttr( JSON.stringify( opts.config[i].children ) ) + '"';
                }
                html += ' href="' + (opts.config[i].href ? opts.config[i].href : 'javascript:;') + '"><span>' + opts.config[i].title + '</span></a></li>';
            }
            html += '</ul>';
            elMenuBox.html( html ).on( 'click', 'a', function() {
                var children = $( this ).data( 'children' );
                if ( children ) {
                    updateIndexBox( children );
                }
            } );
        };
        buildMenuBox();

        updatePath( getPathByHash( window.location.hash ), updateStage );

    };

} );