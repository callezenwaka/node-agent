import { openai } from "./openai.js";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Document } from "langchain/document";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { CharacterTextSplitter } from "langchain/text_splitter";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { YoutubeLoader } from "@langchain/community/document_loaders/web/youtube";
import { load } from "langchain/load";

const question = process.argv[2] || 'hi';
const video = 'https://youtu.be/zR_iuq2evXo';

const createStore = (docs) => 
    MemoryVectorStore.fromDocuments(docs, new OpenAIEmbeddings());

const docsFromYTVideo = async(video) => {
    const loader = YoutubeLoader.createFromUrl(video, {
        language: 'en',
        addVideoInfo: true,
    });
    
    const loadedDoc = await loader.load();

    const splitter = new CharacterTextSplitter({
        separator: ' ',
        chunkSize: 2500,
        chunkOverlap: 200,
    });

    return await splitter.splitDocuments(loadedDoc);
}

const docsFromPDF = async() => {
    const loader = new PDFLoader('xbox.pdf');

    const loadedDoc = await loader.load();

    const splitter = new CharacterTextSplitter({
        separator: '. ',
        chunkSize: 2500,
        chunkOverlap: 200,
    });

    return await splitter.splitDocuments(loadedDoc);
}

const loadStore = async() => {
    const videoDocs = await docsFromYTVideo(video);
    const pdfDocs = await docsFromPDF();
    // console.log(videoDocs[0], pdfDocs[0]);

    return createStore([...videoDocs, ...pdfDocs]);
}

const query = async() => {
    const store = await loadStore();

    const results = await store.similaritySearch(question, 2);

    // console.log(results);
    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        temperature: 0,
        messages: [
            {
                role: 'system',
                content: 'You are a helpful AI assistant. Answser questions to your best ability.',
            },
            {
                role: 'user',
                content: `Answer the following question using the provided context. If you cannot answer the question with the context, don't lie and make up stuff. Just say you need more context.
                    Question: ${question}
            
                    Context: ${results.map((r) => r.pageContent).join('\n')}`,
            },
        ],
    });

    console.log(
        `Answer: ${response.choices[0].message.content}\n
        Sources: ${results.map((r) => r.metadata.source).join(', ')}`
    );
}

query();