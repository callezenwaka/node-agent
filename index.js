import { openai } from "./openai.js";

const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
        {
            role: 'system', 
            content: 'You are an AI assistant, answer any question to the best of your ability.',
        },
        // {
        //     role: 'user',
        //     content: 'What is assembly language and how do I learn it?',
        // },
        {
            role: 'user',
            content: 'Who is Trump?',
        },
    ],
});

console.log(completion.choices[0].message.content);
// console.log(completion.choices[0].message);