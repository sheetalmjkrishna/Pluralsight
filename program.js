/********************************************************************************
*********************************************************************************
Title: Deliverable #2: Coding Exercise - Pluralsight program in node.js to implement package installer
Author: Sheetal Krishna

*********************************************************************************
*********************************************************************************/

function init() {	
		var file = process.argv[2];
		try {
			var fs = require('fs');
			var contents = fs.readFileSync(file, 'utf8'); //read the input file
			var dependencies = JSON.parse(contents); //parse the file contents as an array
			//var dependencies = contents.replace("[","").replace("]","").replace(/'/g,"").replace(/"/g,"").split(","); //manually parsing string as array
			return dependencies;			
		} catch (e) {
			console.log(e);
			console.log('\n\nPlease ensure that the file exists and the array is in the form: ["xyz: abc", "abc: ", "lmn: pqr","pqr: "] where abc and pqr are dependencies for xyz and lmn respectively.')
		}
}


function checkAndInstallDependencies(dependencies) {
	var dictOfDeps = {}; //dictionary of dependencies, a waiting queue in the form "package required":[list of dependent packages]
	var output = [],
		outputDict = {};
	for (var dep of dependencies) {
		var temp = dep.split(':');
		temp[0] = temp[0].trim();
		temp[1] = temp[1].trim();
		if (temp[1] == "" || temp[1] in outputDict) { //if a package has no dependency or the dependency has already been installed
			addAndRemove(temp[0], outputDict, output, dictOfDeps); //install package and remove packages dependent on this package, from the wait queue
		} 
		else { //the package has a dependency which hasn't been met yet, so store in a waiting queue in the form "package required":[dependent packages]
			if (!(temp[1] in dictOfDeps)) //if this is the first package that has this particular dependency
				dictOfDeps[temp[1]] = [];
			dictOfDeps[temp[1]].push(temp[0]); //add to the list of packages dependant on this package
		}
	}
	console.log("\n______________________________________\n");
	if (Object.keys(dictOfDeps).length != 0) { //there are still some packages that weren't installed because their dependencies weren't installed
		console.log("Invalid Input, cycles present! Packages that could not be installed are given below in the order 'dependency':['package(s) dependent on it']\n");
		console.log(dictOfDeps);
	} 
	else { //no dependencies left, all packages install successfully
		console.log("Valid Input, no cycles present!\n");
		console.log(output.join(', '));		
	}
	console.log("\n______________________________________\n");
	return output.join(', ');
}


function addAndRemove(item, outputDict, output, dictOfDeps) {
	// console.log("<<< "+item+" is in addAndRemove() >>>"); //to check which dependency is currently being resolved
	outputDict[item] = ""; //using a dictionary to make searching more efficient
	output.push(item); //output array with dependencies in order of installation
	if (item in dictOfDeps) { //if this package was a dependency for any other package(s)
		for (var innerDep of dictOfDeps[item]) { //each of the dependent packages
			addAndRemove(innerDep, outputDict, output, dictOfDeps); //recursive call to install this package and the packages that depend on this package
		}
		delete dictOfDeps[item] //dependency has been resolved, so remove from the wait queue
	}
}

var dependencies = init();
checkAndInstallDependencies(dependencies);
