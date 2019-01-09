define( [ 'jquery' ], function( $ ) {

    /**
     * @return {string} uuid
     * @see https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
     */
    var uuidv4 = function() {
        return ([ 1e7 ] + -1e3 + -4e3 + -8e3 + -1e11).replace( /[018]/g, c =>
            (c ^ window.crypto.getRandomValues( new Uint8Array( 1 ) )[0] & 15 >> c / 4).toString( 16 )
        );
    };

    $.fn.extend( {
        readingProgress: function( params ) {

            /**
             * @param {object} elContentBox 
             * @param {object} options 
             */
            var init = function( elContentBox, options ) {

                var opts = $.extend( true, {
                    elProgressBox: null
                }, options );

                var elProgressBox = $( opts.elProgressBox );

                elProgressBox.on( 'click', 'a', function() {
                    $( 'html, body' ).animate( {'scrollTop': elContentBox.find( this.hash ).offset().top - elContentBox.offset().top} );
                    return false;
                } );

                elContentBox.data( 'reading-progress', {
                    elProgressBox: elProgressBox
                } );

                $( document ).on( 'scroll', function() {
                    console.log( $( 'html, body' ).scrollTop() );
                } );

                updateProgress( elContentBox );

            };

            /**
             * @param {object} elContentBox 
             */
            var updateProgress = function( elContentBox ) {

                var elProgressBox = elContentBox.data( 'reading-progress' ).elProgressBox;
                var totalHeight = elContentBox.outerHeight();

                if ( totalHeight === 0 ) {
                    elProgressBox.html( '' );
                    return;
                }

                var collectData = function() {
                    var data = [ ];
                    var currentH2 = {id: uuidv4(), children: [ ]};
                    var currentH1 = {id: uuidv4(), children: [ currentH2 ]};
                    elContentBox.find( 'h1, h2, h3' ).each( function() {
                        var el = $( this );
                        var id = el.attr( 'id' ) || uuidv4();
                        el.attr( 'id', id );
                        if ( el.is( 'h1' ) ) {
                            currentH1 = {id: id, title: el.text(), children: [ ]};
                            data.push( currentH1 );
                        } else if ( el.is( 'h2' ) ) {
                            currentH2 = {id: id, title: el.text(), children: [ ]};
                            currentH1.children.push( currentH2 );
                        } else {
                            currentH2.children.push( {id: id, title: el.text()} );
                        }
                    } );
                    return data;
                };

                var getProgressBoxHtml = function( data ) {
                    var html = '<ul>';
                    for ( var i = 0; i < data.length; i++ ) {
                        html += '<li>' +
                                '<a href="#' + data[i].id + '">' +
                                '<span class="progress" data-target="' + data[i].id + '"><span></span></span>' +
                                '<span class="title">' + data[i].title + '</span></a>';
                        if ( data[i].children && data[i].children.length > 0 ) {
                            html += getProgressBoxHtml( data[i].children );
                        }
                        html += '</li>';
                    }
                    html += '</ul>';
                    return html;
                };

                var rebuildProgressBox = function() {
                    elProgressBox.html( getProgressBoxHtml( collectData() ) );
                };

                rebuildProgressBox();

            };

            if ( typeof (params) === 'string' ) {
                if ( !this.data( 'reading-progress' ) ) {
                    return;
                }
                switch ( params ) {
                    case 'update' :
                        updateProgress( this );
                        break;
                }

            } else {
                init( this, params );
            }

        }
    } );

} );