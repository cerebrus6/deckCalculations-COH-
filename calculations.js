const fs = require("fs");

(async function() {
	// Data
	let data = JSON.parse(fs.readFileSync("data.json", "utf-8"));
	let commandList = fs.readFileSync("commands.txt", "utf-8");

	// Backup current data and log the current commands
	let backUpName = "./history/".concat(backupFileName(), ".json");
	fs.writeFileSync(backUpName, JSON.stringify(data).concat("\n\n", printing(data), "\n\n", commandList), "utf-8", (err, data) => {return data});

	// Current Command Examples
	// add 1000 coins
	// subtract 10 clones

	// Read and execute Commands
	commands(data, separatorForCommands(commandList))
	console.log(data);

	// Checkers
	warmachine(data);	// Check if warmachine have exceeded maximum capacity
	illusory(data);		// Check if illusory have exceeded maximum capacity

	// Write data to data.json and deck text into deckText.txt
	fs.writeFileSync("data.json", JSON.stringify(data), "utf-8", (err, data) => {return data});
	let printData = printing(data);
	fs.writeFileSync("deckText.txt", printData, "utf-8", (err, data) => {return data});
	console.log(printData);
}());

function backupFileName() {
	let today = new Date();
	let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	let time = today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds();
	let dateTime = date + '_' + time;
	return dateTime;
}

// 
function addTo(num, obj, property) {
	if(Number.isInteger(obj[property]))
		obj[property] += num;
}

// 
function subtractTo(num, obj, property) {
	if(Number.isInteger(obj[property]))
		obj[property] -= num;
}

// Command Structure: keyword ammount property
// add 10000 collectives
// subtract 2 coins
function separatorForCommands(commandFile) {
	let arr = commandFile.split(/\r?\n/);
	for(let i = 0; i < arr.length; i++) {
		arr[i] = arr[i].split(" ");
		arr[i][1] = parseInt(arr[i][1]);
	}

	return arr;
}

// This loops through every command
function commands(obj, commandList) {
	for(let i = 0; i < commandList.length; i++) {
		executeCommand(obj, commandList[i]);
	}
}

// This executes a command
function executeCommand(obj, commandArray) {
	switch(commandArray[0]) {
		case "add":
			console.log(commandArray[1], commandArray[2])
			addTo(commandArray[1], obj, commandArray[2]);
			break;
		case "subtract":
			subtractTo(commandArray[1], obj, commandArray[2]);
			break;
	}
}

// Get the hours and minutes of the duration a proxy is running
function getTime(startTime) {
	let startingTime = Date.parse(new Date(startTime));
	let currentTime = Date.now();
	let timeDifference = currentTime - startingTime;
	let hh, mm;
	hh = Math.floor(timeDifference/3600000);
	mm = Math.floor(timeDifference/60000)%60;
	return [hh, mm];
}

// Example: To calculate units for warmachine
// calculateUnits(50, 24, 15000)
function calculateUnits(totalTime, time, unitsPerTime) {
	return Math.floor(totalTime/time)*unitsPerTime;
}

function illusory(obj) {
	let currentUnits = calculateUnits(getTime(obj.illusory.startTime)[0], 24, 1500);
	if(currentUnits>450000) {
		obj.defenders += 450000;
		obj.illusory.activated = false;
	}
}

function warmachine(obj) {
	let currentUnits = calculateUnits(getTime(obj.warmachine.startTime)[0], 24, 1500);
	if(currentUnits>45000) {
		obj.collectives += 45000;
		obj.warmachine.activated = false;
	}
}

function printing(obj) {
		let numOfCollectives = (obj.illusory.activated==true)?obj.collectives+calculateUnits(getTime(obj.warmachine.startTime)[0], 24, 1500):obj.collectives
		let numOfDefenders = (obj.illusory.activated==true)?obj.defenders+calculateUnits(getTime(obj.illusory.startTime)[0], 24, 1500):obj.defenders		
		let str = `a;\n@${obj.player}\n—:Clone:Clones | ${putCommas(obj.clones)} |—:Collective:Collective | ${putCommas(numOfCollectives)} |—:Defender:Defenders | ${putCommas(numOfDefenders)} |\n—| PROXIES • 3/3 (Full)\n:`
		if(obj.illusory.activated == true) {
			str += `Habit: Illusory —\n\`\`\`Activated — ${getTime(obj.illusory.startTime)[0]}.${getTime(obj.illusory.startTime)[1]}/720 Hours • ${putCommas(calculateUnits(getTime(obj.illusory.startTime)[0], 24, 1500))}/450,000 Defenders Collected\`\`\``
		}
		if(obj.warmachine.activated == true) {
			str += `:Protosthetic: Warmachine —\n\`\`\`Activated — ${getTime(obj.warmachine.startTime)[0]}.${getTime(obj.warmachine.startTime)[1]}/720 Hours • ${putCommas(calculateUnits(getTime(obj.warmachine.startTime)[0], 24, 1500))}/45,000 Collectives Collected\`\`\`@:o:Genetoware's `
		}
		str += `:Void:Void x1\n\n:Coins:Coins \`${putCommas(obj.coins)}\`\n:Chances:Chances \`${putCommas(obj.chances)}\`\n\n\`\`\`UNIT PROPERTIES\n—AUTOHP ${putCommas(totalOffense(obj.clones, obj.defenders))} | Total Offense • ${obj.collectives*(3+obj.offenseBonus)} |— Casualties ${putCommas(obj.casualties)} | Conquered ${putCommas(obj.conquered)} |\`\`\``;
		return str;
}

function totalOffense(clones, defenders) {
	return clones + (defenders*2);
}

function putCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}