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

	// Write to 
	fs.writeFileSync("data.json", JSON.stringify(data), "utf-8", (err, data) => {return data});
	fs.writeFileSync("deckText.txt", printing(data), "utf-8", (err, data) => {return data});
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

// Command Structure: keyword ammount to property
// add 10000 collectives
// add 1 coins
function separatorForCommands(commandFile) {
	let arr = commandFile.split(/\r?\n/);
	for(let i = 0; i < arr.length; i++) {
		arr[i] = arr[i].split(" ");
		arr[i][1] = parseInt(arr[i][1]);
	}

	return arr;
}

// This loops through every command
// Use Separator for commans
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

function getTime(startTime) {
	let startingTime = Date.parse(new Date(startTime));
	let currentTime = Date.now();
	let timeDifference = currentTime - startingTime;
	let hh, mm;
	hh = Math.floor(timeDifference/3600000);
	mm = Math.floor(timeDifference/60000)%60;
	return [hh, mm];
}

// Example: To calculate units
// calculateUnits(50, 24, 15000)
function calculateUnits(totalTime, time, unitsPerTime) {
	return Math.floor(totalTime/time)*unitsPerTime;
}

function printing(obj) {
		let str = `a;\n@${putCommas(obj.player)}\n—:Clone:Clones | ${putCommas(obj.clones)} |—:Collective:Collective | ${putCommas(obj.collectives)} |—:Defender:Defenders | ${putCommas(obj.defenders)} |\n—| PROXIES • 3/3 (Full)\n:`
		if(obj.illusory.activated == true) {
			str += `Habit: Illusory —\n\`\`\`Activated — ${getTime(obj.illusory.startTime)[0]}.${getTime(obj.illusory.startTime)[1]}/720 Hours • ${putCommas(calculateUnits(getTime(obj.illusory.startTime)[0], 24, 1500))}/450,000 Defenders Collected\`\`\``
		}
		if(obj.warmachine.activated == true) {
			str += `:Protosthetic: Warmachine —\n\`\`\`Activated — ${putCommas(obj.player)}/720 Hours • ${putCommas(calculateUnits(getTime(obj.warmachine.startTime)[0], 24, 1500))}/45,000 Collectives Collected\`\`\`@:o:Genetoware's `
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