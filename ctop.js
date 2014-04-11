/* 
 * Content MathML to Presentation MathML conversion
 *
 * based on David Carlisle's ctop.js - https://web-xslt.googlecode.com/svn/trunk/ctop/ctop.js
 *
 */

var CToP = {
	/* Transform the given <math> elements from Content MathML to Presentation MathML
	 */
	transform: function(elements){
		for (var i = 0; i< elements.length;i++){
			var mathNode = elements[i].cloneNode(false);
			for(var j=0;j<elements[i].childNodes.length; j++ ) {
				CToP.applyTransform(mathNode,elements[i].childNodes[j],0);
			}
			elements[i].parentNode.replaceChild(mathNode,elements[i]); 
		}
	},

	/* Create an element with given name, belonging to the MathML namespace
	 */
	createElement: function(name) {
		return document.createElementNS("http://www.w3.org/1998/Math/MathML",name);
	},

	/* Get node's children
	 */
	children: function(node) {
		var children=[];
		for(var j=0;j<node.childNodes.length; j++ ) {
			if(node.childNodes[j].nodeType==document.ELEMENT_NODE) {
				children.push(node.childNodes[j]);
			}
		}
		return children;
	},

	/* Add an element with given name and text content
	 */
	appendToken: function(parentNode,name,textContent) {
		var element = CToP.createElement(name);
		element.textContent = textContent;
		parentNode.appendChild(element);
	},

	/* Transform a Content MathML node to Presentation MathML node(s), and attach it to the parent
	 */
	applyTransform: function(parentNode,contentMMLNode,precedence) {
		if (contentMMLNode.nodeType==document.ELEMENT_NODE) {
			if(CToP.tokens[contentMMLNode.localName]) {
				CToP.tokens[contentMMLNode.localName](parentNode,contentMMLNode,precedence);
			} else if (contentMMLNode.childNodes.length==0) {
				CToP.appendToken(parentNode,'mi',contentMMLNode.localName);
			} else {
				var clonedChild = contentMMLNode.cloneNode(false);
				parentNode.appendChild(clonedChild);
				for(var j=0;j<contentMMLNode.childNodes.length; j++ ) {
					CToP.applyTransform(clonedChild,contentMMLNode.childNodes[j],precedence);
				}
			}
		} else if (contentMMLNode.nodeType==document.TEXT_NODE) {
			parentNode.appendChild(contentMMLNode.cloneNode(false));
		}
	},

	/* Transform an identifier symbol
	 */
	identifier: function(textContent) {
		return function(parentNode,contentMMLNode,precedence) {
			CToP.appendToken(parentNode,'mi',textContent);
		}
	},

	/* Make an mfenced environment
	 */
	mfenced: function(children,open,close) {
		var mf = CToP.createElement('mfenced');
		mf.setAttribute('open',open);
		mf.setAttribute('close',close);
		for(var j=0;j<children.length; j++ ) {
			CToP.applyTransform(mf,children[j],0);
		}
		return mf;
	},

	/* Transform a set or set-like notation
	 */
	set: function(parentNode,args,open,close) {
		parentNode.appendChild(CToP.mfenced(args,open,close));
	},

	/* Transform a content token to a presentation token
	 *
	 * (function factory)
	 * @param {string} name - name of the corresponding presentation MML tag
	 */
	token: function(name) {
		return function(parentNode,contentMMLNode) {
			if(contentMMLNode.childNodes.length==1 && contentMMLNode.childNodes[0].nodeType==document.TEXT_NODE) {
				CToP.appendToken(parentNode,name,contentMMLNode.textContent);
			} else {
				var mrow = CToP.createElement('mrow');
				for(var j=0;j<contentMMLNode.childNodes.length; j++ ) {
					if (contentMMLNode.childNodes[j].nodeType==document.TEXT_NODE) {
						CToP.appendToken(parentNode,name,contentMMLNode.childNodes[j].textContent);
					}else{
						CToP.applyTransform(mrow,contentMMLNode.childNodes[j],0);
					}
				}
				parentNode.appendChild(mrow);
			}
		}
	},

	/* Enclose an operation in brackets, if necessary
	 *
	 * (function factory)
	 */
	bracket: function(name,tokenPrecedence) {
		return function(parentNode,contentMMLNode,firstArg,args,bvars,qualifiers,precedence) {
			var mrow = CToP.createElement('mrow');
			var needsBrackets = tokenPrecedence<precedence || (tokenPrecedence==precedence && name=="-");
			if(needsBrackets) {
				CToP.appendToken(mrow,'mo','(');
			}
			if(args.length>1){
				CToP.applyTransform(mrow,args[0],tokenPrecedence);
			}
			CToP.appendToken(mrow,'mo',name);
			if(args.length>0){
				var z = args[(args.length==1)?0:1];
				CToP.applyTransform(mrow,z,tokenPrecedence);
			}	
			if(needsBrackets) {
				CToP.appendToken(mrow,'mo',')');
			}
			parentNode.appendChild(mrow);
		}
	},

	/* Transform an infix operator
	 *
	 * (function factory)
	 */
	infix: function(name,tokenPrecedence) {
		return function(parentNode,contentMMLNode,firstArg,args,bvars,qualifiers,precedence) {
			var mrow = CToP.createElement('mrow');
			var needsBrackets = precedence>tokenPrecedence;
			if(needsBrackets) {
				CToP.appendToken(mrow,'mo','(');
			}
			for(var j=0;j<args.length; j++ ) {
				if(j>0) {
					CToP.appendToken(mrow,'mo',name);
				}
				CToP.applyTransform(mrow,args[j],tokenPrecedence);
			}
			if(needsBrackets) {
				CToP.appendToken(mrow,'mo',')');
			}
			parentNode.appendChild(mrow);
		}
	},

	/* Transform an iterated operation, e.g. summation
	 *
	 * (function factory
	 */
	iteration: function(name) {
		return function(parentNode,contentMMLNode,firstArg,args,bvars,qualifiers,precedence) {
			var mrow = CToP.createElement('mrow');
			var mo = CToP.createElement('mo');
			mo.textContent = name;
			var munderover = CToP.createElement('munderover');
			munderover.appendChild(mo);
			var mrow1 = CToP.createElement('mrow');
			for(var i=0; i<qualifiers.length;i++){
				if(qualifiers[i].localName=='lowlimit'||
						qualifiers[i].localName=='condition'||
						qualifiers[i].localName=='domainofapplication')
				{
					if(qualifiers[i].localName=='lowlimit'){
						for(var j=0; j<bvars.length;j++){
							var bvar = bvars[j];
							var children = CToP.children(bvar);
							if(children.length){
								mrow1.appendChild(children[0]);
								CToP.applyTransform(bvar,0);	// ???? This needs three arguments
							}
						}
						if(bvars.length){
							CToP.appendToken(mrow1,"mo","=");
						}
					}
					var children = CToP.children(qualifiers[i]);
					for(j=0;j<children.length;j++){
						CToP.applyTransform(mrow1,children[j],0);
					}
				} else {
					var children = CToP.children(qualifiers[i]);
					if (qualifiers[i].localName=='interval' && children.length==2) {
						for(var j=0; j<bvars.length;j++){
							var bvar = b[j];
							var children = CToP.children(bvar);
							if(children.length){
								CToP.applyTransform(mrow1,children[0],0);
							}
						}
						if(bvars.length){
							CToP.appendToken(mrow1,"mo","=");
						}
						CToP.applyTransform(mrow1,CToP.children(qualifiers[i])[0],0);
					}
				}
			}
			munderover.appendChild(mrow1);
			var mjrow = CToP.createElement('mjrow');
			for(var i=0; i<qualifiers.length;i++){
				if(qualifiers[i].localName=='uplimit' ||qualifiers[i].localName=='interval' )
				{
					var children = CToP.children(qualifiers[i]);
					for(j=0;j<children.length;j++){
						CToP.applyTransform(mjrow,children[j],0);
					}
				}
			}
			munderover.appendChild(mjrow);
			mrow.appendChild(munderover);
			for(var i=0; i<args.length;i++){
				CToP.applyTransform(mrow,args[i],0);
			}
			parentNode.appendChild(mrow);
		}
	},

	/* Transform something which binds a variable, e.g. forall or lambda
	 *
	 * (function factory)
	 */
	bind: function(name,argSeparator) {
		return function(parentNode,contentMMLNode,firstArg,args,bvars,qualifiers,precedence) {
			var mrow = CToP.createElement('mrow');
			CToP.appendToken(mrow,'mo',name);
				for(var j=0; j<bvars.length;j++){
					var bvar = bvars[j];
					var children = CToP.children(bvar);
					if(children.length){
						CToP.applyTransform(mrow,children[0],0);
					}
				}

			var conditions_mrow = CToP.createElement('mrow');
			var conditions = false, children;
			for(var i=0; i<qualifiers.length;i++){
				if(qualifiers[i].localName=='condition')	{
					conditions = true;
					children = CToP.children(qualifiers[i]);
					for(var j=0;j<children.length;j++){
						CToP.applyTransform(conditions_mrow,children[j],0);
					}
				}
			}
			if(conditions){
				CToP.appendToken(mrow,'mo',',');
			}
			mrow.appendChild(conditions_mrow);
			for(var i=0; i<qualifiers.length;i++){
				if(qualifiers[i].localName!='condition')	{
					CToP.appendToken(mrow,'mo','\u2208');
					children = CToP.children(qualifiers[i]);
					for(var j=0;j<children.length;j++){
						CToP.applyTransform(mrow,children[j],0);
					}
				}
			}
			if(bvars.length||children.length){
				CToP.appendToken(mrow,'mo',argSeparator);
			}
			for(var i=0; i<args.length;i++){
				CToP.applyTransform(mrow,args[i],0);
			}
			parentNode.appendChild(mrow);
		}
	}

}

/* Functions to transform variable/atom tokens
 */
CToP.tokens = {
	"ci": CToP.token('mi'),
	"cs": CToP.token('ms'),

	"csymbol": function(parentNode,contentMMLNode,precedence) {
		if(CToP.symbols[contentMMLNode.textContent]){
			CToP.appendToken(parentNode,'mi',CToP.symbols[contentMMLNode.textContent]);
		} else {
			CToP.tokens['ci'](parentNode,contentMMLNode);
		}
	},
	"fn": function(parentNode,contentMMLNode,precedence) {
		CToP.applyTransform(parentNode,CToP.children(contentMMLNode)[0],precedence);
	},

	"naturalnumbers": CToP.identifier('\u2115'),
	"integers": CToP.identifier('\u2124'),
	"reals": CToP.identifier('\u211D'),
	"rationals": CToP.identifier('\u211A'),
	"complexes": CToP.identifier('\u2102'),
	"primes": CToP.identifier('\u2119'),
	"exponentiale": CToP.identifier('e'),
	"imaginaryi": CToP.identifier('i'),
	"notanumber": CToP.identifier('NaN'),
	"eulergamma": CToP.identifier('\u03B3'),
	"gamma": CToP.identifier('\u0263'),
	"pi": CToP.identifier('\u03C0'),
	"infinity": CToP.identifier('\u221E'),
	"emptyset": CToP.identifier('\u2205'),
	"true": CToP.identifier('true'),
	"false": CToP.identifier('false'),
}

CToP.tokens['apply'] = CToP.tokens['reln'] = CToP.tokens['bind'] = function(parentNode,contentMMLNode,precedence) {
	var firstArg=null;
	var args = [], bvars = [], qualifiers = [];

	for(var j=0;j<contentMMLNode.childNodes.length; j++ ) {
		if(contentMMLNode.childNodes[j].nodeType==document.ELEMENT_NODE) {
			var childNode = contentMMLNode.childNodes[j], name = childNode.localName;
			if(name=='bvar'){
				bvars.push(childNode);
			} else if(name=='condition'||
					name=='degree'||
					name=='logbase'||
					name=='lowlimit'||
					name=='uplimit'||
					(name=='interval' && !(args.length))||
					name=='domainofapplication') {
						qualifiers.push(childNode);
					} else if(firstArg==null){
						firstArg = childNode;		
					} else {
						args.push(childNode);
					}
		}
	}

	if(firstArg) {
		var name = firstArg.localName;
		name = (name=="csymbol") ? firstArg.textContent : name;
		if(CToP.applyTokens[name]) {
			CToP.applyTokens[name](parentNode,contentMMLNode,firstArg,args,bvars,qualifiers,precedence);
		} else {
			var mrow = CToP.createElement('mrow');
			if(firstArg.childNodes.length){
				CToP.applyTransform(mrow,firstArg,0);
			} else {
				CToP.appendToken(mrow,'mi',name);
			}
			CToP.appendToken(mrow,'mo','\u2061');
			mrow.appendChild(CToP.mfenced(args,'(',')'));
			parentNode.appendChild(mrow);
		}
	} else {
		parentNode.appendChild(CToP.createElement('mrow'));
	}
}

CToP.tokens['cn'] = function(parentNode,contentMMLNode,precedence) {
	var type = contentMMLNode.getAttribute("type");
	var base = contentMMLNode.getAttribute("base");
	if(type || base) {
		var apply = CToP.createElement('apply');
		var mrow = CToP.createElement('mrow');
		var c;
		if(base) {
			type = 'based-integer';
			c = CToP.createElement(type);
			apply.appendChild(c);
			CToP.appendToken(apply,'mn',base);
		} else {
			c = CToP.createElement(type);
			apply.appendChild(c);
		}
		for(var j=0;j<contentMMLNode.childNodes.length; j++ ) {
			if (contentMMLNode.childNodes[j].nodeType==document.TEXT_NODE) {
				CToP.appendToken(mrow,'cn',contentMMLNode.childNodes[j].textContent);
			}else if (contentMMLNode.childNodes[j].localName=='sep'){
				apply.appendChild(mrow);
				mrow = CToP.createElement('mrow');
			} else {
				mrow.appendChild(contentMMLNode.childNodes[j].cloneNode(true));
			}
		}
		apply.appendChild(mrow);
		CToP.applyTransform(parentNode,apply,0);
	} else {  
		CToP.token('mn')(parentNode,contentMMLNode);
	}
}

CToP.tokens['set'] = function(parentNode,contentMMLNode,precedence) {
	CToP.set(parentNode,CToP.children(contentMMLNode),'{','}');
}

CToP.tokens['list'] = function(parentNode,contentMMLNode,precedence) {
	CToP.set(parentNode,CToP.children(contentMMLNode),'(',')');
}

CToP.tokens['piecewise'] = function(parentNode,contentMMLNode,precedence) {
	var mrow = CToP.createElement('mrow');
	CToP.appendToken(mrow,'mo','{');
	var mtable = CToP.createElement('mtable');
	mrow.appendChild(mtable);
	var children = CToP.children(contentMMLNode);
	for(var i=0;i<children.length;i++){
		CToP.applyTransform(mtable,children[i],0);
	}
	parentNode.appendChild(mrow);
}

CToP.tokens['piece'] = function(parentNode,contentMMLNode,precedence) {
	var mtr = CToP.createElement('mtr');
	var children = CToP.children(contentMMLNode);
	for(i=0;i<children.length;i++){
		var mtd = CToP.createElement('mtd');
		mtr.appendChild(mtd);
		CToP.applyTransform(mtd,children[i],0);
		if(i==0){
			var mtd = CToP.createElement('mtd');
			CToP.appendToken(mtd,"mtext","\u00A0if\u00A0");
			mtr.appendChild(mtd);
		}
	}
	parentNode.appendChild(mtr);
}

CToP.tokens['otherwise'] = function(parentNode,contentMMLNode,precedence) {
	var mtr = CToP.createElement('mtr');
	var children = CToP.children(contentMMLNode);
	if(children.length){
		var mtd = CToP.createElement('mtd');
		mtr.appendChild(mtd);
		CToP.applyTransform(mtd,children[0],0);
		var mtd = CToP.createElement('mtd');
		mtd.setAttribute('columnspan','2');
		CToP.appendToken(mtd,"mtext","\u00A0otherwise");
		mtr.appendChild(mtd);
	}
	parentNode.appendChild(mtr);
}

CToP.tokens['matrix'] = function(parentNode,contentMMLNode,precedence) {
	var args = [], bvars = [], qualifiers = [];
	for(var j=0;j<contentMMLNode.childNodes.length; j++ ) {
		var childNode = contentMMLNode.childNodes[j]
			if(childNode.nodeType==document.ELEMENT_NODE) {
				if(childNode.localName=='condition' || childNode.localName=='domainofapplication' ) {
					qualifiers.push(childNode);
				} else if(childNode.localName=='bvar') {
					bvars.push(childNode)
				} else {
					args.push(childNode);
				}
			}
	}

	if(bvars.length || qualifiers.length) {
		var mrow = CToP.createElement('mrow');
		CToP.appendToken(mrow,"mo","[");
		var msub = CToP.createElement('msub');
		CToP.appendToken(msub,'mi','m');
		var mrow2 = CToP.createElement('mrow');
		for(var i=0;i<bvars.length;i++){
			if(i!=0){
				CToP.appendToken(mrow2,'mo',',');
			}	
			CToP.applyTransform(mrow2,bvars[i].childNodes[0],0);
		}
		msub.appendChild(mrow2);
		mrow.appendChild(msub);
		var msub2 = msub.cloneNode(true);
		CToP.appendToken(mrow,'mo','|');
		mrow.appendChild(msub2);
		CToP.appendToken(mrow,'mo','=');
		for(var i=0;i<args.length;i++){
			if(i!=0){
				CToP.appendToken(mrow,'mo',',');
			}	
			CToP.applyTransform(mrow,args[i],0);
		}
		CToP.appendToken(mrow,'mo',';');
		for(var i=0;i<qualifiers.length;i++){
			if(i!=0){
				CToP.appendToken(mrow,'mo',',');
			}	
			CToP.applyTransform(mrow,qualifiers[i],0);
		}
		CToP.appendToken(mrow,'mo',']');
		parentNode.appendChild(mrow);
	} else {
		var mfenced = CToP.createElement('mfenced');
		var mtable = CToP.createElement('mtable');
		for(var i=0;i<args.length;i++){
			CToP.applyTransform(mtable,args[i],0);
		}
		mfenced.appendChild(mtable);
		parentNode.appendChild(mfenced);
	}
}

CToP.tokens['matrixrow'] = function(parentNode,contentMMLNode,precedence) {
	var mtr = CToP.createElement('mtr');
	var children = CToP.children(contentMMLNode);
	for(var i=0;i<children.length;i++){
		var mtd = CToP.createElement('mtd');
		CToP.applyTransform(mtd,children[i],0);
		mtr.appendChild(mtd);
	}
	parentNode.appendChild(mtr);
}

CToP.tokens['condition'] = function(parentNode,contentMMLNode,precedence) {
	var mrow = CToP.createElement('mrow');
	var children = CToP.children(contentMMLNode);
	for(var i=0;i<children.length;i++){
		CToP.applyTransform(mrow,children[i],0);
	}
	parentNode.appendChild(mrow);
}
CToP.tokens['lambda'] = function(parentNode,contentMMLNode,precedence) {
	var firstArg = CToP.createElement('lambda');
	var args = [], bvars = [], qualifiers = [];
	for(var j=0;j<contentMMLNode.childNodes.length; j++ ) {
		if(contentMMLNode.childNodes[j].nodeType==document.ELEMENT_NODE) {
			var childNode = contentMMLNode.childNodes[j], name = childNode.localName;
			if(name == 'bvar'){
				bvars.push(childNode);
			} else if(name=='condition'||
					name=='degree'||
					name=='logbase'||
					name=='lowlimit'||
					name=='uplimit'||
					(name=='interval' && !(args.length))||
					name=='domainofapplication') {
						qualifiers.push(childNode);
					} else {
						args.push(childNode);
					}
		}
	}
	if(bvars.length){
		CToP.applyTokens["lambda"](parentNode,contentMMLNode,firstArg,args,bvars,qualifiers,precedence);
	} else {
		var mrow=CToP.createElement('mrow');
		for(var i=0;i<args.length;i++){
			CToP.applyTransform(mrow,args[i],0);
		}
		if(qualifiers.length){
			var msub = CToP.createElement('msub');
			CToP.appendToken(msub,'mo','|');
			var mrow2 = CToP.createElement('mrow');
			for(var i=0;i<qualifiers.length;i++){
				var children = CToP.children(qualifiers[i]);
				for(var j=0;j<children.length;j++){
					CToP.applyTransform(mrow2,children[j],0);
				}
			}
			msub.appendChild(mrow2);
			mrow.appendChild(msub);
		}
		parentNode.appendChild(mrow);
	}
}
CToP.tokens["ident"] = function(parentNode,contentMMLNode,precedence) {
	CToP.appendToken(parentNode,"mi","id")
}

CToP.tokens["domainofapplication"] = function(parentNode,contentMMLNode,precedence) {
	var merror = CToP.createElement('merror');
	CToP.appendToken(merror,'mtext','unexpected domainofapplication');
	parentNode.appendChild(merror);
}

CToP.tokens["share"] = function(parentNode,contentMMLNode,precedence) {
	var mi = CToP.createElement('mi');
	mi.setAttribute('href',contentMMLNode.getAttribute('href'));
	mi.textContent = "share" + contentMMLNode.getAttribute('href');
	parentNode.appendChild(mi);
}

CToP.tokens["cerror"] = function(parentNode,contentMMLNode,precedence) {
	var merror = CToP.createElement('merror');
	var children = CToP.children(contentMMLNode);
	for(var i=0;i<children.length;i++){
		CToP.applyTransform(merror,children[i],0);
	}
	parentNode.appendChild(merror);
}

CToP.tokens["semantics"] = function(parentNode,contentMMLNode,precedence)  {
	var mrow = CToP.createElement('mrow');
	var children = CToP.children(contentMMLNode);
	if(children.length){
		var z = children[0];
		for(var i=0;i<children.length;i++){
			if(children[i].localName=='annotation-xml' && children[i].getAttribute('encoding')=='MathML-Presentation'){
				z = children[i];
				break;
			}
		}
		CToP.applyTransform(mrow,z,0);
	}
	parentNode.appendChild(mrow);
}

CToP.tokens["annotation-xml"] = function(parentNode,contentMMLNode,precedence)  {
	var mrow = CToP.createElement('mrow');
	var children = CToP.children(contentMMLNode);
	for(var i=0;i<children.length;i++){
		CToP.applyTransform(mrow,children[i],0);
	}
	parentNode.appendChild(mrow);
}


/* Symbol names to translate to characters
 */
CToP.symbols = {
	"gamma": '\u03B3'
}

/* Functions to transform function/operation application tokens
 */
CToP.applyTokens = {
	"rem": CToP.bracket('mod',3),
	"divide": CToP.bracket('/',3),
	"remainder": CToP.bracket('mod',3),
	"implies": CToP.bracket('\u21D2',3),
	"factorof": CToP.bracket('\21D2',3),
	"in": CToP.bracket('\u2208',3),
	"notin": CToP.bracket('\u2209',3),
	"notsubset": CToP.bracket('\u2288',2),
	"notprsubset": CToP.bracket('\u2284',2),
	"setdiff": CToP.bracket('u2216',2),
	"eq": CToP.infix('=',1),
	"compose": CToP.infix('\u2218',1),
	"left_compose": CToP.infix('\u2218',1),
	"and": CToP.infix('\u2227',2),
	"or": CToP.infix('\u2228',3),
	"xor": CToP.infix('xor',3),
	"neq": CToP.infix('\u2260',1),
	"gt": CToP.infix('>',1),	// ???? gt and lt were the other way round in ctop.js!
	"lt": CToP.infix('<',1),
	"geq": CToP.infix('\u2265',1),
	"leq": CToP.infix('\u2264',1),
	"equivalent": CToP.infix('\u2261',1),
	"approx": CToP.infix('\u2248',1),
	"union": CToP.infix('\u222A',2),
	"intersect": CToP.infix('\u2229',3),
	"subset": CToP.infix('u2286',2),
	"prsubset": CToP.infix('u2282',2),
	"cartesianproduct": CToP.infix('\u00D7',2),
	"cartesian_product": CToP.infix('\u00D7',2),
	"vectorproduct": CToP.infix('\u00D7',2),
	"scalarproduct": CToP.infix('.',2),
	"outerproduct": CToP.infix('\u2297',2),
	"sum": CToP.iteration('\u2211'),
	"product": CToP.iteration('\u220F'),
	"forall": CToP.bind('\u2200',','),
	"exists": CToP.bind('\u2203','\u007c'),
	"lambda": CToP.bind('\u03BB','.'),

}
CToP.applyTokens['not'] = function(parentNode,contentMMLNode,firstArg,args,bvars,qualifiers,precedence) {
	var mrow = CToP.createElement('mrow');
	CToP.appendToken(mrow,'mo','\u00ac');
	var needsBrackets = args[0].localName=='apply';
	if(needsBrackets) {
		CToP.appendToken(mrow,'mo','(');
	}
	CToP.applyTransform(mrow,args[0],precedence);
	if(needsBrackets) {
		CToP.appendToken(mrow,'mo',')');
	}
	parentNode.appendChild(mrow)
}
CToP.applyTokens['divide'] = function(parentNode,contentMMLNode,firstArg,args,bvars,qualifiers,precedence) {
	var mfrac = CToP.createElement('mfrac');
	CToP.applyTransform(mfrac,args[0],0);
	CToP.applyTransform(mfrac,args[1],0);
	parentNode.appendChild(mfrac);
}
CToP.applyTokens['tendsto'] = function(parentNode,contentMMLNode,firstArg,args,bvars,qualifiers,precedence) {
	var type;
	if(firstArg.localName=='tendsto') {
		type = firstArg.getAttribute('type');
	} else {
		type = args[0].textContent;
		args = args.slice(1);
	}
	var name = (type=='above')? '\u2198' :
		(type=='below') ? '\u2198' : '\u2192' ;
	CToP.bracket(name,2)(parentNode,contentMMLNode,firstArg,args,bvars,qualifiers,precedence);
}
CToP.applyTokens['minus'] = function(parentNode,contentMMLNode,firstArg,args,bvars,qualifiers,precedence) {
	if(args.length==1) {
		CToP.bracket('-',5)(parentNode,contentMMLNode,firstArg,args,bvars,qualifiers,precedence);
	} else {
		CToP.bracket('-',2)(parentNode,contentMMLNode,firstArg,args,bvars,qualifiers,precedence);
	}
}
CToP.applyTokens['complex-cartesian'] = function(parentNode,contentMMLNode,firstArg,args,bvars,qualifiers,precedence) {
	var mrow = CToP.createElement('mrow');
	CToP.applyTransform(mrow,args[0],0);
	CToP.appendToken(mrow,'mo','+');
	CToP.applyTransform(mrow,args[1],0);
	CToP.appendToken(mrow,'mo','\u2062');
	CToP.appendToken(mrow,'mi','i');
	parentNode.appendChild(mrow);
}

CToP.applyTokens['complex-polar'] = function(parentNode,contentMMLNode,firstArg,args,bvars,qualifiers,precedence) {
	var mrow = CToP.createElement('mrow');
	CToP.applyTransform(mrow,args[0],0);
	CToP.appendToken(mrow,'mo','\u2062');
	var msup = CToP.createElement('msup');
	CToP.appendToken(msup,'mi','e');
	var exponent = CToP.createElement('mrow');
	CToP.applyTransform(exponent,args[1],0);
	CToP.appendToken(exponent,'mo','\u2062');
	CToP.appendToken(exponent,'mi','i');
	msup.appendChild(exponent);
	mrow.appendChild(msup);
	parentNode.appendChild(mrow);
}

CToP.applyTokens['integer'] = function(parentNode,contentMMLNode,firstArg,args,bvars,qualifiers,precedence) {
	CToP.applyTransform(parentNode,args[0],0);
}

CToP.applyTokens['based-integer'] = function(parentNode,contentMMLNode,firstArg,args,bvars,qualifiers,precedence) {
	var msub = CToP.createElement('msub');
	CToP.applyTransform(msub,args[1],0);
	CToP.applyTransform(msub,args[0],0);
	parentNode.appendChild(msub);
}

CToP.applyTokens['rational'] = function(parentNode,contentMMLNode,firstArg,args,bvars,qualifiers,precedence) {
	var mfrac = CToP.createElement('mfrac');
	CToP.applyTransform(mfrac,args[0],0);
	CToP.applyTransform(mfrac,args[1],0);
	parentNode.appendChild(mfrac);
}

CToP.applyTokens['times'] = function(parentNode,contentMMLNode,firstArg,args,bvars,qualifiers,precedence) {
	var mrow = CToP.createElement('mrow');
	var needsBrackets = precedence>3;
	if(needsBrackets) {
		CToP.appendToken(mrow,'mo','(');
	}
	for(var j=0;j<args.length; j++ ) {
		if(j>0) {
			CToP.appendToken(mrow,'mo',(args[j].localName=='cn') ? "\u00D7" :"\u2062");
		}
		CToP.applyTransform(mrow,args[j],3);
	}
	if(needsBrackets) {
		CToP.appendToken(mrow,'mo',')');
	}
	parentNode.appendChild(mrow);
}

CToP.applyTokens["plus"] = function(parentNode,contentMMLNode,firstArg,args,bvars,qualifiers,precedence) {
	var mrow = CToP.createElement('mrow');
	var needsBrackets = precedence>2;
	if(needsBrackets) {
		CToP.appendToken(mrow,'mo','(');
	}
	for(var j=0;j<args.length; j++ ) {
		var arg = args[j];
		var children = CToP.children(arg);
		if(j>0) {
			var n;
			if(arg.localName=='cn' && !(children.length) && (n=Number(arg.textContent)) <0) {
				CToP.appendToken(mrow,'mo','\u2212');
				CToP.appendToken(mrow,'mn', -n);
			} else if(arg.localName=='apply' && children.length==2 && children[0].localName=='minus') {
				CToP.appendToken(mrow,'mo','\u2212');
				CToP.applyTransform(mrow,children[1],3);
			} else if(arg.localName=='apply' && children.length>2 && children[0].localName=='times' && children[1].localName=='cn' && ( n=Number(children[1].textContent) < 0)) {
				CToP.appendToken(mrow,'mo','\u2212');
				children[1].textContent=-n;// fix me: modifying document
				CToP.applyTransform(mrow,arg,3);
			} else{
				CToP.appendToken(mrow,'mo','+');
				CToP.applyTransform(mrow,arg,3);
			}
		} else {
			CToP.applyTransform(mrow,arg,3);	
		}
	}
	if(needsBrackets) {
		CToP.appendToken(mrow,'mo',')');
	}
	parentNode.appendChild(mrow);
}

CToP.applyTokens['set'] = function(parentNode,contentMMLNode,firstArg,args,bvars,qualifiers,precedence) {
	CToP.set(parentNode,args,'{','}');
}

CToP.applyTokens['list'] = function(parentNode,contentMMLNode,firstArg,args,bvars,qualifiers,precedence) {
	CToP.set(parentNode,args,'(',')');
}

CToP.applyTokens['power'] = function(parentNode,contentMMLNode,firstArg,args,bvars,qualifiers,precedence) {
	var msup = CToP.createElement('msup');
	CToP.applyTransform(msup,args[0],precedence);
	CToP.applyTransform(msup,args[1],precedence);
	parentNode.appendChild(msup);
}

CToP.applyTokens['selector'] = function(parentNode,contentMMLNode,firstArg,args,bvars,qualifiers,precedence) {
	var msub = CToP.createElement('msub');
	var mrow = args ? args[0]: CToP.createElement('mrow');
	CToP.applyTransform(msub,mrow,0);
	var mrow2 = CToP.createElement('mrow');
	for(var i=1;i<args.length;i++){
		if(i!=1){
			CToP.appendToken(mrow2,'mo',',');
		}	
		CToP.applyTransform(mrow2,args[i],0);
	}
	msub.appendChild(mrow2);
	parentNode.appendChild(msub);
}

CToP.applyTokens["log"] = function(parentNode,contentMMLNode,firstArg,args,bvars,qualifiers,precedence)  {
	var mrow = CToP.createElement('mrow');
	var mi = CToP.createElement('mi');
	mi.textContent = 'log';
	if(qualifiers.length && qualifiers[0].localName=='logbase'){
		var msub = CToP.createElement('msub');
		msub.appendChild(mi);
		CToP.applyTransform(msub,CToP.children(qualifiers[0])[0],0);
		mrow.appendChild(msub);
	} else {
		mrow.appendChild(mi);
	}
	CToP.applyTransform(mrow,args[0],7);
	parentNode.appendChild(mrow);
}

CToP.applyTokens["int"] = function(parentNode,contentMMLNode,firstArg,args,bvars,qualifiers,precedence)  {
	var mrow = CToP.createElement('mrow');
	var mo = CToP.createElement('mo');
	mo.textContent='\u222B';
	var msubsup = CToP.createElement('msubsup');
	msubsup.appendChild(mo);
	var mrow1 = CToP.createElement('mrow');
	for(var i=0; i<qualifiers.length;i++){
		if(qualifiers[i].localName=='lowlimit'||
				qualifiers[i].localName=='condition'||
				qualifiers[i].localName=='domainofapplication')
		{
			var children = CToP.children(qualifiers[i]);
			for(var j=0;j<children.length;j++){
				CToP.applyTransform(mrow1,children[j],0);
			}
		} else {
			var children = CToP.children(qualifiers[i]);
			if (qualifiers[i].localName=='interval' && children.length==2) {
				CToP.applyTransform(mrow1,children[0],0);
			}
		}
	}
	msubsup.appendChild(mrow1);
	var mrow2 = CToP.createElement('mrow');
	for(var i=0; i<qualifiers.length;i++){
		if(qualifiers[i].localName=='uplimit'){
			var children = CToP.children(qualifiers[i]);
			for(j=0;j<children.length;j++){
				CToP.applyTransform(mrow2,children[j],0);
			}
			break;
		} else if(qualifiers[i].localName=='interval' ){
			var children = CToP.children(qualifiers[i]);
			CToP.applyTransform(mrow2,children[children.length-1],0);
			break;
		}
	}
	msubsup.appendChild(mrow2);
	mrow.appendChild(msubsup);
	for(var i=0; i<args.length;i++){
		CToP.applyTransform(mrow,args[i],0);
	}
	for(var i=0; i<bvars.length;i++){
		var bvar = bvars[i];
		var children = CToP.children(bvar);
		if(children.length){
			var mrow3 = CToP.createElement("mrow");
			CToP.appendToken(mrow3,'mi','d');
			CToP.applyTransform(mrow3,children[0],0);
			mrow.appendChild(mrow3);
		}
	}
	parentNode.appendChild(mrow);
}

CToP.applyTokens["inverse"] = function(parentNode,contentMMLNode,firstArg,args,bvars,qualifiers,precedence)  {
	var msup = CToP.createElement('msup');
	var arg = (args.length) ? args[0] : CToP.createElement('mrow');
	CToP.applyTransform(msup,arg,precedence);
	var mfenced = CToP.createElement('mfenced');
	CToP.appendToken(mfenced,'mn','-1');
	msup.appendChild(mfenced);
	parentNode.appendChild(msup);
}

CToP.applyTokens["quotient"] = function(parentNode,contentMMLNode,firstArg,args,bvars,qualifiers,precedence)  {
	var mrow = CToP.createElement('mrow');
	CToP.appendToken(mrow,'mo','\u230A');
	if(args.length) {
		CToP.applyTransform(mrow,args[0],0);
		CToP.appendToken(mrow,'mo','/');
		if(args.length>1){
			CToP.applyTransform(mrow,args[1],0);
		}
	}
	CToP.appendToken(mrow,'mo','\u230B');
	parentNode.appendChild(mrow);
}

CToP.applyTokens["factorial"] = function(parentNode,contentMMLNode,firstArg,args,bvars,qualifiers,precedence)  {
	var mrow = CToP.createElement('mrow');
	CToP.applyTransform(mrow,args[0],0);
	CToP.appendToken(mrow,'mo','!');
	parentNode.appendChild(mrow);
}

CToP.applyTokens["root"] = function(parentNode,contentMMLNode,firstArg,args,bvars,qualifiers,precedence)  {
	var mr;
	if(firstArg.localName=='root' && (qualifiers.length==0 || (qualifiers[0].localName=='degree' && qualifiers[0].textContent=='2'))){
		mr = CToP.createElement('msqrt');
		for(var i=0;i<args.length;i++){
			CToP.applyTransform(mr,args[i],0);
		}
	} else {
		mr = CToP.createElement('mroot');
		CToP.applyTransform(mr,args[0],0);
		var arg = (firstArg.localName=='root') ? qualifiers[0].childNodes[0] : args[1];
		CToP.applyTransform(mr,arg,0);
	}
	parentNode.appendChild(mr);
}

CToP.applyTokens["diff"] = function(parentNode,contentMMLNode,firstArg,args,bvars,qualifiers,precedence)  {
	var m;
	var mrow1 = CToP.createElement('mrow');
	if(bvars.length){
		m = CToP.createElement('mfrac');
		var msup, bvar;
		var mi = CToP.createElement('mi');
		mi.textContent = 'd';
		var children = CToP.children(bvars[0]);
		for(var j=0;j<children.length;j++){
			if(children[j].localName=='degree'){
				var childNode = CToP.children(children[j])[0];
				if(childNode.textContent!='1'){
					msup = CToP.createElement('msup');
					msup.appendChild(mi);
					CToP.applyTransform(msup,childNode,0);
				}
			} else {
				bvar = CToP.children(bvars[0])[j];
			}
		}
		mrow1.appendChild(msup || mi);
		if(args.length){
			CToP.applyTransform(mrow1,args[0],0);
		}
		m.appendChild(mrow1);
		mrow1 = CToP.createElement('mrow');
		CToP.appendToken(mrow1,'mi','d');
		if(msup){
			var msup2 = msup.cloneNode(true);
			msup2.replaceChild(bvar,msup2.childNodes[0]); // fix me
			mrow1.appendChild(msup2);
			//CToP.applyTransform(bv,0);
		} else {
			CToP.applyTransform(mrow1,bvar,0);
		}
		m.appendChild(mrow1);
	} else {
		m = CToP.createElement('msup');
		m.appendChild(mrow1);
		CToP.applyTransform(mrow1,args[0],0); 
		CToP.appendToken(m,'mo','\u2032');
	}
	parentNode.appendChild(m);
}

CToP.applyTokens["partialdiff"] = function(parentNode,contentMMLNode,firstArg,args,bvars,qualifiers,precedence)  {
	var m, mi, msup, mrow, mo, z;

	if(bvars.length==0 && args.length==2 && args[0].localName=='list'){
		if(args[1].localName=='lambda') {
			m = CToP.createElement('mfrac');
			msup = CToP.createElement('msup');
			CToP.appendToken(msup,'mo','\u2202');
			var degree = CToP.children(args[0]).length;
			CToP.appendToken(msup,'mn',degree);
			mrow = CToP.createElement('mrow');
			mrow.appendChild(msup);
			var children = CToP.children(args[1]);
			z = children[children.length - 1];
			CToP.applyTransform(mrow,z,0);
			m.appendChild(mrow);
			mrow = CToP.createElement('mrow');
			var bvarNames = [];
			var lambdaChildren = CToP.children(args[1]);	// names of bound variables
			var lambdaSequence = CToP.children(args[0]);	// indices of bound variable names, in order
			for(var i=0;i<lambdaChildren.length;i++){
				if(lambdaChildren[i].localName=='bvar'){
					bvarNames.push(CToP.children(lambdaChildren[i])[0]);
				}
			}
			for(var i=0;i<lambdaSequence.length;i++){
				CToP.appendToken(mr,'mo','\u2202');
				var n = Number(lambdaSequence[i].textContent)-1;
				var bvar = bvarNames[n];
				CToP.applyTransform(mrow,bvar,0);
			}
			m.appendChild(mrow);
			parentNode.appendChild(m);
		} else {
			m = CToP.createElement('mrow');
			var msub = CToP.createElement('msub');
			CToP.appendToken(msub,'mi','D');
			var bvar = CToP.children(args[0]);
			msub.appendChild(CToP.mfenced(bvar,'',''));
			m.appendChild(msub);
			CToP.applyTransform(m,args[1],0);
			parentNode.appendChild(m);
		}
	} else {
		m = CToP.createElement('mfrac');
		msup = CToP.createElement('msup');
		CToP.appendToken(msup,'mo','\u2202');
		mrow = CToP.createElement('mrow');
		if(qualifiers.length && qualifiers[0].localName=='degree' && CToP.children(qualifiers[0]).length){
			var qualifier = CToP.children(qualifiers[0])[0];
			CToP.applyTransform(mrow,qualifier,0);
		} else {
			var degree = 0;
			var hadFirst = false;
			for(var i=0;i<bvars.length;i++){
				var children = CToP.children(bvars[i]);
				if(children.length==2){
					for(j=0;j<2;j++){
						if(children[j].localName=='degree') {
							if(/^\s*\d+\s*$/.test(children[j].textContent)){
								degree += Number(children[j].textContent);
							} else {
								if(hadFirst){
									CToP.appendToken(mrow,'mo','+');
								}
							}
							hadFirst = true;
							var degreeNode = CToP.children(children[j])[0];
							CToP.applyTransform(mrow,degreeNode,0);
						}
					}
				} else {
					degree++;
				}
			}
			if(degree>0){
				if(hadFirst){
					CToP.appendToken(mrow,'mo','+');
				}   
				CToP.appendToken(mrow,'mn',degree);
			}
		}
		msup.appendChild(mrow);
		mrow = CToP.createElement('mrow');
		mrow.appendChild(msup);
		if(args.length){
			CToP.applyTransform(mrow,args[0],0);
		}
		m.appendChild(mrow);
		mrow = CToP.createElement('mrow');
		for(var i=0;i<bvars.length;i++){
			CToP.appendToken(mrow,'mo','\u2202');
			var children = CToP.children(bvars[i]);
			if(children.length==2){
				for(j=0;j<2;j++){
					if(children[j].localName=='degree'){
						msup = CToP.createElement('msup');
						CToP.applyTransform(msup,children[1-j],0);
						var degreeNode = CToP.children(children[j])[0];
						CToP.applyTransform(msup,degreeNode,0);
						mrow.appendChild(msup);
					}
				}
			} else if(children.length==1) {
				CToP.applyTransform(mrow,children[0],0);
			}
		}
		m.appendChild(mrow);
		parentNode.appendChild(m);
	}
}

