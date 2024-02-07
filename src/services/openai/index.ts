import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources";
import { generatePromt } from "./proms/prompt";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const run = async (name: string, phoneNumber: string, history: ChatCompletionMessageParam[]): Promise<string> => {
    const prompt = generatePromt(name, phoneNumber)
    console.log(`[PROMPT]:`, prompt)

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
        max_tokens: 300,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    });
    return response.choices[0].message.content
}

export { run };
