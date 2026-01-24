//https://github.com/github/copilot-sdk?utm_source=email-cli-sdk-repo-cta&utm_medium=email&utm_campaign=cli-sdk-jan-2026
//https://github.com/github/copilot-sdk/blob/main/docs/getting-started.md

//npm install @github/copilot-sdk tsx
//npx tsx index.ts

import { CopilotClient, defineTool, SessionEvent } from "@github/copilot-sdk";
import { mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const [,, argPrompt, argModel] = process.argv; 
const model = argModel || "gpt-4.1"; //4.1 free, 5.2
const prompt = argPrompt || "What's the current weather in Seattle ? ";

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

const readFileTool = defineTool("read_file", {
    description: "Read a file from disk",
    parameters: {
        type: "object",
        properties: {
            path: { type: "string", description: "Absolute or relative file path" },
        },
        required: ["path"],
    },
    handler: async (args: { path: string }) => {
        const content = await readFile(args.path, "utf8");
        return { path: args.path, content };
    },
});

const writeFileTool = defineTool("write_file", {
    description: "Write content to a file on disk",
    parameters: {
        type: "object",
        properties: {
            path: { type: "string", description: "Absolute or relative file path" },
            content: { type: "string", description: "File content to write" },
        },
        required: ["path", "content"],
    },
    handler: async (args: { path: string; content: string }) => {
        const cwd = process.cwd();
        const targetPath = path.resolve(args.path);
        if (!targetPath.startsWith(path.resolve(cwd) + path.sep)) {
            throw new Error("Path is outside current working directory");
            //Nota: questo NON funziona perchè comunque GitHub Copilot SDK esegue il salvataggio!
        }
        const dirPath = path.dirname(targetPath);
        await mkdir(dirPath, { recursive: true });
        await writeFile(targetPath, args.content, "utf8");
        return { path: targetPath, written: true };
    },
});

const getCwdTool = defineTool("get_cwd", {
    description: "Get the current working directory",
    parameters: {
        type: "object",
        properties: {},
    },
    handler: async () => {
        return { cwd: process.cwd() };
    },
});

async function findFileByName(dir: string, fileName: string): Promise<string | null> {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
        const entryPath = path.join(dir, entry.name);
        if (entry.isFile() && entry.name === fileName) {
            return entryPath;
        }
        if (entry.isDirectory()) {
            const found = await findFileByName(entryPath, fileName);
            if (found) {
                return found;
            }
        }
    }
    return null;
}

const findFileTool = defineTool("find_file_path", {
    description: "Find a file path by name within the current working directory",
    parameters: {
        type: "object",
        properties: {
            name: { type: "string", description: "File name to search for" },
        },
        required: ["name"],
    },
    handler: async (args: { name: string }) => {
        const cwd = process.cwd();
        const foundPath = await findFileByName(cwd, args.name);
        if (!foundPath) {
            return { found: false, cwd, name: args.name };
        }
        const resolved = path.resolve(foundPath);
        if (!resolved.startsWith(path.resolve(cwd) + path.sep)) {
            return { found: false, cwd, name: args.name };
        }
        const fileInfo = await stat(resolved);
        if (!fileInfo.isFile()) {
            return { found: false, cwd, name: args.name };
        }
        return { found: true, path: resolved };
    },
});
async function runWithTool(prompt, model) {
    const client = new CopilotClient();
    const session = await client.createSession({
        model: model,
        streaming: true,
        tools: [getWeather, readFileTool, writeFileTool, getCwdTool, findFileTool],
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