import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources";
import { generatePromptDetermine, generatePromt } from "./proms/prompt";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const run = async (name: string, phoneNumber: string, history: ChatCompletionMessageParam[]): Promise<string> => {
    const prompt = generatePromt(name, phoneNumber, true);

    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                "role": "system",
                "content": prompt
            },
            ...history
        ],
        temperature: 1,
        max_tokens: 200,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    });
    return response.choices[0].message.content
}

const runDetermine = async ( history: ChatCompletionMessageParam[]): Promise<string> => {
    const prompt = generatePromptDetermine()

    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                "role": "system",
                "content": prompt
            },
            ...history
        ],
        temperature: 1,
        max_tokens: 200,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    });
    return response.choices[0].message.content
}
export { run, runDetermine };

