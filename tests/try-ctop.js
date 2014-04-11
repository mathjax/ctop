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
function doTransform() {
	var content = document.querySelector('#content-mml').value;
	var output = document.querySelector('#output');
	output.innerHTML = content;
	CToP.transform(output.querySelectorAll('math'));
	var presentation = formatXml(output.innerHTML);
	document.querySelector('#presentation-mml').textContent = presentation;
	MathJax.Hub.Queue(['Typeset',MathJax.Hub,output]);
	localStorage['content-mml'] = content;
}

document.querySelector('#transform').onclick = doTransform;
document.querySelector('#content-mml').onchange = doTransform;
document.querySelector('#content-mml').onkeyup = doTransform;

if('content-mml' in localStorage) {
	document.querySelector('#content-mml').value = localStorage['content-mml'];
	doTransform();
}
