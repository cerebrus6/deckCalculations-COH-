// Calculates the starting time of a proxy
// Current time - Current Progress (mm.hh)
async function startTimeCaclulator() {
	const fs = require('fs');
	const rl = require('readline');
	const prompt = require('prompt-sync')({sigint: true});

	function getInput(question="") {
		let input = rl.createInterface({
			input: process.stdin,
			output: process.stdout
		});

		return new Promise(
			(resolve) => {
				input.question(question, 
					ans => {
						input.close();
						resolve(ans);
					}	
				)
			}
		);
	}

	let timeToSubtract = await getInput("Input the current progress (hh.mm): ");
	console.log(millisecondsToDate(getTimeDifference(timeToSubtract)))
};

function getTimeDifference(time, currentTime = Date.now()) {
	let currentProgress = time.split(".");
	currentProgress[0] = parseInt(currentProgress[0])
	currentProgress[1] = parseInt(currentProgress[1])
	let totalProgress = (currentProgress[0]*60*60*1000) + (currentProgress[1]*60*1000)
	return new Date(currentTime-totalProgress);
}

function millisecondsToDate(today) {
	let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	let resultingMonth = months[today.getMonth()];

	return resultingMonth.concat(" ", today.getDate(), ", ", today.getFullYear(), " ", ((today.getHours()<10)?"0".concat(today.getHours()):today.getHours()), ":", ((today.getMinutes()<10)?"0".concat(today.getMinutes()):today.getMinutes()), ":", ((today.getSeconds()<10)?"0".concat(today.getSeconds()):today.getSeconds()));
}
startTimeCaclulator();
module.exports = startTimeCaclulator;