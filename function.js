import { openai } from "./openai.js";
import Maths from "advanced-calculator";

const QUESTION = process.argv[2] || 'hi';

const messages = [
    {
        role: 'user',
        content: QUESTION,
    },
];

const functions = {
    calculator: async({ expression }) => {
        return Maths.evaluate(expression);
    },
    generator: async({ prompt }) => {
        const results = await openai.images.generate({ prompt });
        console.log(results);
        return results;
    },
}

const getCompletion = async(messages) => {
    const response = await openai.chat.completions.create({
        model: 'gpt-4-0613',
        messages,
        temperature: 0,
        tools: [
            {
                type: "function",
                function: {
                    name: 'calculator',
                    description: 'Run maths expression.',
                    parameters: {
                        type: 'object',
                        properties: {
                            expression: {
                                type: 'string',
                                description: 'The maths expression to evaluate like "2 * 3 + (21 / 2) ^ 2"',
                            }
                        },
                        required: ['expression'],
                    }
                }
            },
            {
                type: "function", 
                function: {
                    name: 'generator',
                    description: 'Generate image from prompt.',
                    parameters: {
                        type: 'object',
                        properties: {
                            prompt: {
                                type: 'string',
                                description: 'The description of the image to generate.',
                            }
                        },
                        required: ['prompt'],
                    }
                }
            }
        ],
    })

    return response;
}

let response;
while(true) {
    response = await getCompletion(messages);

    if(response.choices[0].finish_reason === 'stop') {
        console.log(response.choices[0].message.content);
        break;
    } else if(response.choices[0].message.tool_calls) {
        console.log('toolCall: ', response.choices[0].message);

        for(const toolCall of response.choices[0].message.tool_calls) {
            const func_name = toolCall.function.name;
            const func_args = toolCall.function.arguments;

            const functionToCall = functions[func_name];
            if(!functionToCall) {
                throw new Error(`Function ${func_name} not found!`);
            }

            const params = JSON.parse(func_args);
            const results = await functionToCall(params);

            messages.push({
                role: 'assistant',
                content: null,
                tool_calls: [
                    {
                        id: toolCall.id,
                        type: "function",
                        function: {
                            name: func_name,
                            arguments: func_args,
                        },
                    }
                ],
            });

            messages.push({
                role: 'tool',
                tool_call_id: toolCall.id,
                name: func_name,
                content: JSON.stringify({ results }),
            });
        }
    }
}