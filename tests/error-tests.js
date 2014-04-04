CToP.transform(document.querySelectorAll('math'));
Array.prototype.map.call(document.querySelectorAll('.unit'),function(unit) {
	var math = unit.querySelector('math').outerHTML;
	var t = document.createElement('pre');
	t.textContent = math;
	unit.appendChild(t);
})

MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
