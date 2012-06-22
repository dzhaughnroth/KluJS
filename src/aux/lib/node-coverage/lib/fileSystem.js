var instrument = require("./instrument");
var clientCode = require("./clientCode");
var fs = require("fs");
var path = require("path");
var mkdirp = require("mkdirp");

var interpreters = [];
var subModules = fs.readdirSync(__dirname + "/interpreters");
subModules.forEach(function (moduleName) {
	var module = require("./interpreters/" + moduleName);

	if (!module.filter || !module.interpret) {
		console.error("Invalid module definition, " + moduleName);
	} else {
		interpreters.push(module);
	}
});

/* These functions are sync to avoid too many opened files */
function statFileOrFolder (fileOrFolder, basePath, callback, options) {
	var toBeExluded = options ? options.exclude : null;

	fileOrFolder.forEach(function (item) {
		var fileName = path.join(basePath, item);
		var stat = fs.statSync(fileName);

		if (!clientCode.shouldBeExcluded(fileName, toBeExluded)) {
			if (stat.isFile()) {
				instrumentFile(item, basePath, callback, options);
			} else if (stat.isDirectory()) {
				instrumentFolder(item, basePath, callback, options);
			} else {
				console.error("Unable to instrument, niether a file nor a folder.", item, stats);
			}
		}
	});
}

function instrumentFile (file, basePath, callback, options) {
	var fileName = path.join(basePath, file);
	var encoding = "utf-8";
	var content = fs.readFileSync(fileName, encoding);

	var instructed = instrument(fileName, content, options).clientCode;
	if (instructed === content) {
		instructed = fs.readFileSync(fileName);
		encoding = null;
	}

	if (callback) {
		callback.call(null, fileName, instructed, encoding);
	}
}

function instrumentFolder (folder, basePath, callback, options) {
	var folderPath = path.join(basePath, folder);
	var files = fs.readdirSync(folderPath);

	statFileOrFolder(files, folderPath, callback, options);
}

function writeFileTo (src, dest) {
	var destinationRoot = path.resolve(dest);
	if (path.existsSync(destinationRoot)) {
		throw new Error(destinationRoot + " exists already");
	}

	fs.mkdirSync(destinationRoot);

	return function (file, code, encoding) {
		var relative = path.relative(src, file);
		var fileName = path.resolve(destinationRoot, relative);
		var dirName = path.dirname(fileName);

		mkdirp.sync(dirName, 0777);

		fs.writeFileSync(fileName, code, encoding);
		fs.chmodSync(fileName, 0777);
	};
}

function getInterpreter (file, content, override) {
	var chooseFrom = override || interpreters;
	var specificify = 0, bestModule = null;
	
	chooseFrom.forEach(function (module) {
		var value = 0;

		if (matchFile(module.filter, file)) {
			value += 1;

			if (matchContent(module.filter, content)) {
				value += 2;
			}
		}

		if (value > specificify) {
			bestModule = module;
			specificify = value;
		} else if (value > 0 && value === specificify) {
			if (module.filter.files.toString().length > bestModule.filter.files.toString().length) {
				bestModule = module;
			}
		}
	});

	return bestModule;
}

function matchFile (filter, file) {
	if (!filter || !filter.files || !(filter.files instanceof RegExp)) {
		return false;
	}

	return filter.files.test(file);
}

function matchContent (filter, content) {
	if (!filter || !filter.content || !(filter.content instanceof RegExp)) {
		return false;
	}

	return filter.content.test(content);
}


exports.statFileOrFolder = statFileOrFolder;
exports.instrumentFile = instrumentFile;
exports.instrumentFolder = instrumentFolder;
exports.writeFileTo = writeFileTo;
exports.interpreters = interpreters;
exports.getInterpreter = getInterpreter;