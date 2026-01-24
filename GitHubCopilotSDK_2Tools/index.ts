//https://github.com/github/copilot-sdk?utm_source=email-cli-sdk-repo-cta&utm_medium=email&utm_campaign=cli-sdk-jan-2026
//https://github.com/github/copilot-sdk/blob/main/docs/getting-started.md

//npm install @github/copilot-sdk tsx
//npx tsx index.ts

import { CopilotClient, defineTool, SessionEvent } from "@github/copilot-sdk";

const [,, argPrompt, argModel] = process.argv; 
const model = argModel || "gpt-4.1"; //4.1 free, 5.2
const prompt = argPrompt || "What's the current weather in Seattle ? and Tokyo?";

// Define a tool that Copilot can call
const getWeather = defineTool("get_weather", {
    description: "Get the current weather for a city",
    parameters: {
        type: "object",
        properties: {
            city: { type: "string", description: "The city name" },
        },
        required: ["city"],
    },
    handler: async (args: { city: string }) => {
        const { city } = args;
        // In a real app, you'd call a weather API here
        const conditions = ["sunny", "cloudy", "rainy", "partly cloudy"];
        const temp = Math.floor(Math.random() * 30) + 50;
        const condition = conditions[Math.floor(Math.random() * conditions.length)];
        return { city, temperature: `${temp}°F`, condition };
    },
});
async function runWithTool(prompt, model) {
    const client = new CopilotClient();
    const session = await client.createSession({
        model: model,
        streaming: true,
        tools: [getWeather],
    });

    session.on((event: SessionEvent) => {
        if (event.type === "assistant.message_delta") {
            process.stdout.write(event.data.deltaContent);
        }
    });

    await session.sendAndWait({
        prompt: prompt //"What's the weather like in Seattle and Tokyo?",
    });

    await client.stop();
    process.exit(0);
}
runWithTool(prompt, model);