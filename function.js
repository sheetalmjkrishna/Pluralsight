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
	if (Object.keys(dictOfDeps).length != 0) { //there are still some packages that weren't installed because their dependencies weren't installed
		console.log("Rejected. Cycles present.\n");
		// console.log(dictOfDeps);
	} 
	else { //no dependencies left, all packages install successfully
		//console.log("Valid Input, no cycles present!\n");
		console.log(output.join(', '));		
	}	
	return output.join(', ');
}