function testTransform(id) {
	test("transform "+id,function() {
		var fixture = document.getElementById(id);
		var original = fixture.cloneNode(true);
		var cps = CToP.transform(fixture.getElementsByTagName('math'));
		var davids = ctop(original.getElementsByTagName('math'));
		ok(cps==davids);
	});
}

module("tests\\Content");

module("tests\\Content\\ArithmeticAlgebraLogic");
testTransform("arithmetic_1");
testTransform("arithmetic_2");
testTransform("arithmetic_3");
testTransform("arithmetic_4");
testTransform("logic5");
testTransform("logic6");
testTransform("logic7");

module("tests\\Content\\ArithmeticAlgebraLogic\\abs");
testTransform("abs1");
testTransform("abs2");
testTransform("rec-abs3");

module("tests\\Content\\ArithmeticAlgebraLogic\\and");
testTransform("and1");
testTransform("and2");
testTransform("rec-and2");

module("tests\\Content\\ArithmeticAlgebraLogic\\arg");
testTransform("rec-arg1");

module("tests\\Content\\ArithmeticAlgebraLogic\\ceiling");
testTransform("rec-ceiling1");
testTransform("rec-ceiling2");

module("tests\\Content\\ArithmeticAlgebraLogic\\conjugate");
testTransform("rec-conjugate1");

module("tests\\Content\\ArithmeticAlgebraLogic\\divide");
testTransform("divide1");
testTransform("divide2");
testTransform("divide3");
testTransform("divide5");
testTransform("rec-divide4");

module("tests\\Content\\ArithmeticAlgebraLogic\\exists");
testTransform("rec-exists1");

module("tests\\Content\\ArithmeticAlgebraLogic\\factorial");
testTransform("factorial1");
testTransform("factorial3");
testTransform("factorial4");
testTransform("rec-factorial2");

module("tests\\Content\\ArithmeticAlgebraLogic\\floor");
testTransform("rec-floor1");
testTransform("rec-floor2");

module("tests\\Content\\ArithmeticAlgebraLogic\\forall");
testTransform("forall1");
testTransform("forall2");
testTransform("rec-forall2");
testTransform("rec-forall3");
testTransform("rec-forall4");
testTransform("rec-forall5");
testTransform("rec-forall6");
testTransform("rec-forall7");

module("tests\\Content\\ArithmeticAlgebraLogic\\gcd");
testTransform("rec-gcd1");

module("tests\\Content\\ArithmeticAlgebraLogic\\imaginary");
testTransform("rec-imaginary1");

module("tests\\Content\\ArithmeticAlgebraLogic\\implies");
testTransform("implies2");
testTransform("rec-implies1");

module("tests\\Content\\ArithmeticAlgebraLogic\\lcm");
testTransform("rec-lcm1");

module("tests\\Content\\ArithmeticAlgebraLogic\\max");
testTransform("max3");
testTransform("rec-max1");
testTransform("rec-max2");

module("tests\\Content\\ArithmeticAlgebraLogic\\min");
testTransform("min1");
testTransform("rec-min2");

module("tests\\Content\\ArithmeticAlgebraLogic\\minus");
testTransform("minus1");
testTransform("minus2");
testTransform("minus3");
testTransform("minus4");
testTransform("minus5");
testTransform("minus6");
testTransform("minus7");
testTransform("minus9");
testTransform("rec-minus8");

module("tests\\Content\\ArithmeticAlgebraLogic\\not");
testTransform("not1");
testTransform("rec-not2");
testTransform("rec-not3");

module("tests\\Content\\ArithmeticAlgebraLogic\\or");
testTransform("rec-or1");

module("tests\\Content\\ArithmeticAlgebraLogic\\plus");
testTransform("plus1");
testTransform("plus2");
testTransform("plus3");
testTransform("plus4");
testTransform("plus6");
testTransform("plus7");
testTransform("rec-plus5");

module("tests\\Content\\ArithmeticAlgebraLogic\\power");
testTransform("power1");
testTransform("power2");
testTransform("power3");
testTransform("power5");
testTransform("power6");
testTransform("power7");
testTransform("power8");
testTransform("rec-power4");

module("tests\\Content\\ArithmeticAlgebraLogic\\quotient");
testTransform("rec-quotient1");

module("tests\\Content\\ArithmeticAlgebraLogic\\real");
testTransform("rec-real1");

module("tests\\Content\\ArithmeticAlgebraLogic\\rem");
testTransform("rec-rem1");

module("tests\\Content\\ArithmeticAlgebraLogic\\root");
testTransform("rec-root1");
testTransform("root2");

module("tests\\Content\\ArithmeticAlgebraLogic\\times");
testTransform("rec-times1");
testTransform("times2");
testTransform("times3");
testTransform("times4");
testTransform("times5");
testTransform("times6");
testTransform("times7");

module("tests\\Content\\ArithmeticAlgebraLogic\\xor");
testTransform("rec-xor1");

module("tests\\Content\\BasicContentElements");

module("tests\\Content\\BasicContentElements\\apply");
testTransform("rec-apply1");
testTransform("rec-apply2");
testTransform("rec-apply3");
testTransform("rec-apply4");

module("tests\\Content\\BasicContentElements\\codomain");
testTransform("rec-codomain1");

module("tests\\Content\\BasicContentElements\\compose");
testTransform("rec-compose1");
testTransform("rec-compose2");
testTransform("rec-compose3");
testTransform("rec-compose4");

module("tests\\Content\\BasicContentElements\\condition");
testTransform("rec-condition1");

module("tests\\Content\\BasicContentElements\\declare");
testTransform("rec-declare1");
testTransform("rec-declare2");
testTransform("rec-declare3");
testTransform("rec-declare4");
testTransform("rec-declare5");

module("tests\\Content\\BasicContentElements\\domain");
testTransform("rec-domain1");

module("tests\\Content\\BasicContentElements\\domainofapplication");
testTransform("rec-domainofapplication1");

module("tests\\Content\\BasicContentElements\\fn");
testTransform("fn1");
testTransform("fn4");
testTransform("rec-fn2");
testTransform("rec-fn3");

module("tests\\Content\\BasicContentElements\\ident");
testTransform("ident1");
testTransform("rec-ident2");

module("tests\\Content\\BasicContentElements\\image");
testTransform("rec-image1");

module("tests\\Content\\BasicContentElements\\interval");
testTransform("rec-interval1");
testTransform("rec-interval2");

module("tests\\Content\\BasicContentElements\\inverse");
testTransform("rec-inverse1");
testTransform("rec-inverse2");
testTransform("rec-inverse3");
testTransform("rec-inverse4");

module("tests\\Content\\BasicContentElements\\lambda");
testTransform("rec-lambda1");
testTransform("rec-lambda2");
testTransform("rec-lambda3");

module("tests\\Content\\BasicContentElements\\piecewise");
testTransform("rec-piecewise1");
testTransform("rec-piecewise2");

module("tests\\Content\\BasicContentElements\\reln");
testTransform("rec-reln1");
testTransform("rec-reln2");
testTransform("rec-reln3");

module("tests\\Content\\BasicContentElements\\share");
testTransform("rec3-share-1");

module("tests\\Content\\Calculus");

module("tests\\Content\\Calculus\\bvar");
testTransform("rec-bvar1");
testTransform("rec-bvar2");

module("tests\\Content\\Calculus\\curl");
testTransform("rec-curl1");

module("tests\\Content\\Calculus\\degree");
testTransform("degree2");
testTransform("rec-degree1");

module("tests\\Content\\Calculus\\diff");
testTransform("rec-diff1");
testTransform("rec-diff2");

module("tests\\Content\\Calculus\\divergence");
testTransform("rec-divergence1");
testTransform("rec-divergence2");

module("tests\\Content\\Calculus\\grad");
testTransform("rec-grad1");

module("tests\\Content\\Calculus\\int");
testTransform("int1");
testTransform("int2");
testTransform("rec-int3");
testTransform("rec-int4");
testTransform("rec-int5");
testTransform("rec-int6");

module("tests\\Content\\Calculus\\laplacian");
testTransform("rec-laplacian1");

module("tests\\Content\\Calculus\\lowlimit");
testTransform("rec-lowlimit1");

module("tests\\Content\\Calculus\\partialdiff");
testTransform("partialdiff1");
testTransform("partialdiff2");
testTransform("rec-partialdiff3");
testTransform("rec-partialdiff4");
testTransform("rec-partialdiff5");

module("tests\\Content\\Calculus\\uplimit");
testTransform("rec-uplimit1");

module("tests\\Content\\ConstantsAndSymbols");

module("tests\\Content\\ConstantsAndSymbols\\complexes");
testTransform("rec-complexes1");

module("tests\\Content\\ConstantsAndSymbols\\emptyset");
testTransform("rec-emptyset1");

module("tests\\Content\\ConstantsAndSymbols\\eulergamma");
testTransform("rec-eulergamma1");

module("tests\\Content\\ConstantsAndSymbols\\exponentiale");
testTransform("rec-exponentiale1");

module("tests\\Content\\ConstantsAndSymbols\\false");
testTransform("rec-false1");

module("tests\\Content\\ConstantsAndSymbols\\imaginaryi");
testTransform("rec-imaginaryi1");

module("tests\\Content\\ConstantsAndSymbols\\infinity");
testTransform("rec-infinity1");

module("tests\\Content\\ConstantsAndSymbols\\integers");
testTransform("rec-integers1");

module("tests\\Content\\ConstantsAndSymbols\\naturalnumbers");
testTransform("rec-naturalnumbers1");

module("tests\\Content\\ConstantsAndSymbols\\notanumber");
testTransform("rec-notanumber1");

module("tests\\Content\\ConstantsAndSymbols\\pi");
testTransform("rec-pi1");

module("tests\\Content\\ConstantsAndSymbols\\primes");
testTransform("rec-primes1");

module("tests\\Content\\ConstantsAndSymbols\\rationals");
testTransform("rec-rationals1");

module("tests\\Content\\ConstantsAndSymbols\\reals");
testTransform("rec-reals1");

module("tests\\Content\\ConstantsAndSymbols\\true");
testTransform("rec-true1");

module("tests\\Content\\ElementaryFunctions");
testTransform("rec-trig1");
testTransform("rec-trig2");
testTransform("trigonometry_3");
testTransform("trigonometry_4");
testTransform("trigonometry_5");
testTransform("trigonometry_6");
testTransform("trigonometry_7");
testTransform("trigonometry_8");

module("tests\\Content\\ElementaryFunctions\\arccos");
testTransform("arccos1");
testTransform("arccos2");
testTransform("arccos3");
testTransform("arccos4");

module("tests\\Content\\ElementaryFunctions\\arccosh");
testTransform("arccosh1");
testTransform("arccosh2");
testTransform("arccosh3");
testTransform("arccosh4");

module("tests\\Content\\ElementaryFunctions\\arccot");
testTransform("arccot1");
testTransform("arccot2");
testTransform("arccot3");

module("tests\\Content\\ElementaryFunctions\\arccoth");
testTransform("arccoth1");
testTransform("arccoth2");
testTransform("arccoth3");

module("tests\\Content\\ElementaryFunctions\\arccsc");
testTransform("arccsc1");
testTransform("arccsc2");
testTransform("arccsc3");

module("tests\\Content\\ElementaryFunctions\\arccsch");
testTransform("arccsch1");
testTransform("arccsch2");
testTransform("arccsch3");

module("tests\\Content\\ElementaryFunctions\\arcsec");
testTransform("arcsec1");
testTransform("arcsec2");
testTransform("arcsec3");

module("tests\\Content\\ElementaryFunctions\\arcsech");
testTransform("arcsech1");
testTransform("arcsech2");
testTransform("arcsech3");

module("tests\\Content\\ElementaryFunctions\\arcsin");
testTransform("arcsin1");
testTransform("arcsin2");
testTransform("arcsin3");
testTransform("factorial3");

module("tests\\Content\\ElementaryFunctions\\arcsinh");
testTransform("arcsinh1");
testTransform("arcsinh2");
testTransform("arcsinh3");

module("tests\\Content\\ElementaryFunctions\\arctan");
testTransform("arctan1");
testTransform("arctan2");
testTransform("arctan3");

module("tests\\Content\\ElementaryFunctions\\arctanh");
testTransform("arctanh1");
testTransform("arctanh2");
testTransform("arctanh3");

module("tests\\Content\\ElementaryFunctions\\cos");
testTransform("cos1");
testTransform("cos2");
testTransform("cos3");
testTransform("cos4");

module("tests\\Content\\ElementaryFunctions\\cosh");
testTransform("cosh1");
testTransform("cosh2");
testTransform("cosh3");
testTransform("cosh4");

module("tests\\Content\\ElementaryFunctions\\cot");
testTransform("cot1");
testTransform("cot2");
testTransform("cot3");

module("tests\\Content\\ElementaryFunctions\\coth");
testTransform("coth1");
testTransform("coth2");
testTransform("coth3");

module("tests\\Content\\ElementaryFunctions\\csc");
testTransform("csc1");
testTransform("csc2");
testTransform("csc3");

module("tests\\Content\\ElementaryFunctions\\csch");
testTransform("csch1");
testTransform("csch2");
testTransform("csch3");

module("tests\\Content\\ElementaryFunctions\\exp");
testTransform("exp1");
testTransform("exp2");
testTransform("rec-exp3");

module("tests\\Content\\ElementaryFunctions\\ln");
testTransform("rec-ln1");

module("tests\\Content\\ElementaryFunctions\\log");
testTransform("log1");
testTransform("rec-log2");

module("tests\\Content\\ElementaryFunctions\\sec");
testTransform("sec1");
testTransform("sec2");
testTransform("sec3");

module("tests\\Content\\ElementaryFunctions\\sech");
testTransform("sech1");
testTransform("sech2");
testTransform("sech3");

module("tests\\Content\\ElementaryFunctions\\sin");
testTransform("factorial3");
testTransform("sin1");
testTransform("sin2");
testTransform("sin3");

module("tests\\Content\\ElementaryFunctions\\sinh");
testTransform("sinh1");
testTransform("sinh2");
testTransform("sinh3");

module("tests\\Content\\ElementaryFunctions\\tan");
testTransform("tan1");
testTransform("tan2");
testTransform("tan3");

module("tests\\Content\\ElementaryFunctions\\tanh");
testTransform("tanh1");
testTransform("tanh2");
testTransform("tanh3");

module("tests\\Content\\Error");
testTransform("rec-cerror1");

module("tests\\Content\\LinearAlgebra");

module("tests\\Content\\LinearAlgebra\\determinant");
testTransform("rec-determinant1");

module("tests\\Content\\LinearAlgebra\\matrix");
testTransform("inverse1");
testTransform("matrix3");
testTransform("rec-matrix1");
testTransform("rec-matrix2");
testTransform("rec-matrix3");

module("tests\\Content\\LinearAlgebra\\outerproduct");
testTransform("rec-outerproduct1");

module("tests\\Content\\LinearAlgebra\\scalarproduct");
testTransform("rec-scalarproduct1");

module("tests\\Content\\LinearAlgebra\\selector");
testTransform("rec-selector1");
testTransform("rec-selector2");

module("tests\\Content\\LinearAlgebra\\transpose");
testTransform("rec-transpose1");

module("tests\\Content\\LinearAlgebra\\vector");
testTransform("rec-vector1");
testTransform("rec-vector2");
testTransform("vector3");

module("tests\\Content\\LinearAlgebra\\vectorproduct");
testTransform("rec-vectorproduct1");

module("tests\\Content\\Relations");

module("tests\\Content\\Relations\\approx");
testTransform("rec-approx1");

module("tests\\Content\\Relations\\eq");
testTransform("eq2");
testTransform("rec-eq1");

module("tests\\Content\\Relations\\equivalent");
testTransform("rec-equivalent1");

module("tests\\Content\\Relations\\factorof");
testTransform("rec-factorof1");

module("tests\\Content\\Relations\\geq");
testTransform("geq2");
testTransform("rec-geq1");

module("tests\\Content\\Relations\\gt");
testTransform("gt2");
testTransform("rec-gt1");

module("tests\\Content\\Relations\\leq");
testTransform("rec-leq1");

module("tests\\Content\\Relations\\lt");
testTransform("lt2");
testTransform("rec-lt1");

module("tests\\Content\\Relations\\neq");
testTransform("neq2");
testTransform("rec-neq1");

module("tests\\Content\\SemanticMappingElements");

module("tests\\Content\\SemanticMappingElements\\annotation");
testTransform("rec-annotation1");

module("tests\\Content\\SemanticMappingElements\\semantics");
testTransform("rec-semantics1");

module("tests\\Content\\SequencesAndSeries");

module("tests\\Content\\SequencesAndSeries\\limit");
testTransform("limit1");
testTransform("limit2");
testTransform("limit3");
testTransform("limit4");
testTransform("limit5");
testTransform("limit6");
testTransform("limit7");
testTransform("rec-limit8");
testTransform("rec-limit9");

module("tests\\Content\\SequencesAndSeries\\product");
testTransform("product1");
testTransform("product2");
testTransform("rec-product3");

module("tests\\Content\\SequencesAndSeries\\sum");
testTransform("rec-sum1");
testTransform("sum2");
testTransform("sum3");

module("tests\\Content\\SequencesAndSeries\\tendsto");
testTransform("rec-tendsto1");
testTransform("rec-tendsto2");
testTransform("tendsto3");
testTransform("tendsto4");
testTransform("tendsto5");
testTransform("tendsto6");
testTransform("tendsto7");
testTransform("tendsto8");
testTransform("tendsto9");

module("tests\\Content\\Statistics");

module("tests\\Content\\Statistics\\mean");
testTransform("rec-mean1");

module("tests\\Content\\Statistics\\median");
testTransform("rec-median1");

module("tests\\Content\\Statistics\\mode");
testTransform("rec-mode1");

module("tests\\Content\\Statistics\\moment");
testTransform("rec-moment1");
testTransform("rec-moment2");

module("tests\\Content\\Statistics\\momentabout");
testTransform("rec-momentabout1");

module("tests\\Content\\Statistics\\sdev");
testTransform("rec-sdev1");

module("tests\\Content\\Statistics\\variance");
testTransform("rec-variance1");

module("tests\\Content\\TheoryOfSets");
testTransform("equation1");

module("tests\\Content\\TheoryOfSets\\card");
testTransform("rec-card1");

module("tests\\Content\\TheoryOfSets\\cartesianproduct");
testTransform("rec-cartesianproduct1");
testTransform("rec-cartesianproduct2");

module("tests\\Content\\TheoryOfSets\\in");
testTransform("in2");
testTransform("in3");
testTransform("rec-in1");

module("tests\\Content\\TheoryOfSets\\intersect");
testTransform("intersect1");
testTransform("rec-intersect2");

module("tests\\Content\\TheoryOfSets\\list");
testTransform("list-empty");
testTransform("list3");
testTransform("rec-list1");
testTransform("rec-list2");

module("tests\\Content\\TheoryOfSets\\notin");
testTransform("notin2");
testTransform("rec-notin1");

module("tests\\Content\\TheoryOfSets\\notprsubset");
testTransform("notprsubset2");
testTransform("rec-notprsubset1");

module("tests\\Content\\TheoryOfSets\\notsubset");
testTransform("notsubset2");
testTransform("rec-notsubset1");

module("tests\\Content\\TheoryOfSets\\prsubset");
testTransform("prsubset2");
testTransform("rec-prsubset1");

module("tests\\Content\\TheoryOfSets\\set");
testTransform("rec-set1");
testTransform("rec-set2");
testTransform("set-empty");
testTransform("set3");
testTransform("set4");
testTransform("set5");
testTransform("set6");

module("tests\\Content\\TheoryOfSets\\setdiff");
testTransform("rec-setdiff1");

module("tests\\Content\\TheoryOfSets\\subset");
testTransform("rec-subset1");
testTransform("subset2");

module("tests\\Content\\TheoryOfSets\\union");
testTransform("rec-union1");
testTransform("union2");
testTransform("union3");

module("tests\\Content\\TokenElements");

module("tests\\Content\\TokenElements\\cbytes");
testTransform("cbytes1");

module("tests\\Content\\TokenElements\\ci");
testTransform("ci4");
testTransform("rec-ci1");
testTransform("rec-ci2");
testTransform("rec-ci3");

module("tests\\Content\\TokenElements\\cn");
testTransform("cn2");
testTransform("rec-cn1");

module("tests\\Content\\TokenElements\\cs");
testTransform("rec-cs1");

module("tests\\Content\\TokenElements\\csymbol");
testTransform("rec-csymbol1");
testTransform("rec-csymbol2");
testTransform("rec-csymbol3");

