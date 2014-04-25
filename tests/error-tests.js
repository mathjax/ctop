function formatXml(xml) {
    var formatted = '';
    var reg = /(>)(<)(\/*)/g;
    xml = xml.replace(reg, '$1\r\n$2$3');
    var pad = 0;
    xml.split('\r\n').map(function(node,index) {
        var indent = 0;
        if (node.match( /.+<\/\w[^>]*>$/ )) {
            indent = 0;
        } else if (node.match( /^<\/\w/ )) {
            if (pad != 0) {
                pad -= 1;
            }
        } else if (node.match( /^<\w[^>]*[^\/]>.*$/ )) {
            indent = 1;
        } else {
            indent = 0;
        }
 
        var padding = '';
        for (var i = 0; i < pad; i++) {
            padding += '  ';
        }
 
        formatted += padding + node + '\r\n';
        pad += indent;
    });
 
    return formatted;
}

Array.prototype.map.call(document.querySelectorAll('.unit'),function(unit) {
	try {
		var mathNodes = unit.querySelectorAll('math');
		CToP.transform(mathNodes);
		var math = unit.querySelector('math').outerHTML;
		var t = document.createElement('pre');
		t.textContent = formatXml(math);
		unit.appendChild(t);
		MathJax.Hub.Queue(["Typeset",MathJax.Hub,unit]);
	}
	catch(e) {
		console.log(e);
		console.log(e.stack);
	}
})
