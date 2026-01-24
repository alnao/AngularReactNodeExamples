//https://github.com/github/copilot-sdk?utm_source=email-cli-sdk-repo-cta&utm_medium=email&utm_campaign=cli-sdk-jan-2026
//https://github.com/github/copilot-sdk/blob/main/docs/getting-started.md

//npm install @github/copilot-sdk tsx
//npx tsx index.ts

import { CopilotClient, defineTool, SessionEvent } from "@github/copilot-sdk";

const [,, argPrompt, argModel] = process.argv;
const model = argModel || "gpt-4.1"; //4.1 free, 5.2
const prompt = argPrompt || "Generate a python function to generate a random password of 12 characters";

/**
 * Avvia una sessione Copilot e restituisce la risposta generata.
 * @param {string} prompt - Il prompt da inviare al modello.
 * @param {string} model - Il modello da utilizzare (es: "gpt-4.1").
 * @returns {Promise<string|undefined>} - Il contenuto della risposta generata.
 */
async function mainSimple(prompt, model) {
	const client = new CopilotClient();
	try {
		const session = await client.createSession({ model });
		const response = await session.sendAndWait({ prompt });
		return response?.data.content;
	} finally {
		await client.stop();
	}
}

// Parsing CLI args: node index.js "prompt" "model"
function runSimple(prompt, model) {

	mainSimple(prompt, model)
	.then((result) => {
		if (result !== undefined) {
			console.log(result);
		} else {
			console.error("Nessuna risposta generata.");
			process.exitCode = 1;
		}
	})
	.catch((error) => {
		console.error(error);
		process.exitCode = 1;
	});
}
runSimple(prompt, model);
