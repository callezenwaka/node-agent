import { openai } from "./openai.js";
import readline from "node:readline";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const newMessage = async (history, message) => {
    const results = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [...history, message],
    });

    return results.choices[0].message;
}

const formatmessage = (userInput) => ({
    role: 'user',
    content: userInput,
});

const chat = () => {
    const history = [
        {
            role: 'system',
            content: 'You are a helpuful AI assistant. Answer questions to the best of your knowledge!',
        },
    ]

    const start = () => {
        rl.question('You: ', async(userInput) => {
            if(userInput.toLowerCase() === 'exit') {
                rl.close();
                return;
            }

            const message = formatmessage(userInput);
            const response = await newMessage(history, message);

            history.push(message, response);
            console.log(`AI: ${response.content}`);
            start();
            console.log();
        });
    }

    console.log();
    start();
}

console.log('Chat bot initialized! Type `exit` to end the chat!');
chat();