// ==============================================
// File:   css.js
// Author: Keith Majhor <KeithMajhor@gmail.com>
// ==============================================
window.css = function( a )
{
    var decl = { },
        elem = { },
        rule,
        prop;

    css = function( a )
    {
        if ( typeof( a ) === "string" )
        {
            rule = a;
            if ( !decl[rule] )
            {
                decl[rule] = { };
                elem[rule] = document.createElement( "style" );
                             document.head.appendChild( elem[rule] );
            }
        }
        else if ( rule )
        {
            for ( prop in a )
                    decl[rule][prop] = a[prop];

            var temp = rule + "{";
            for ( prop in decl[rule] )
                    temp += prop + ":" + decl[rule][prop] + ";";
            elem[rule].innerHTML = temp + "}";
        }

        return css;
    }

    return css( a );
}

