import { Pinecone, PineconeRecord } from "@pinecone-database/pinecone";
import { downloadFromS3 } from "./vkcloud-server";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import md5 from "md5";

import {
  Document,
  RecursiveCharacterTextSplitter,
} from "@pinecone-database/doc-splitter";
import { getEmbeddings } from "./embeddings";
import { convertToAscii } from "./utils";

export const getPineconeClient = () => {
  return new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
  });
};

type PDFPage = {
  pageContent: string;
  metadata: {
    loc: { pageNumber: number };
  };
};

export async function loadS3IntoPinecone(fileKey: string) {
  // TODO: 1. получить pdf -> скачать и cчитать из PDF
  console.log("downloading s3 into file system");
  const file_name = await downloadFromS3(fileKey);
  if (!file_name) {
    throw new Error("could not download from s3");
  }
  console.log("loading pdf into memory" + file_name);
  const loader = new PDFLoader(file_name);
  const pages = (await loader.load()) as PDFPage[];

  // TODO: 2. разделить и сегментировать PDF
  const documents = await Promise.all(pages.map(prepareDocument));

  // TODO: 3. векторизация и ембединг отдельных документов
  const vectors = await Promise.all(documents.flat().map(embedDocument));

  // TODO 4. загрузить в pinecone то, что разобрали на кусочки, а затем собрали в похожие векторы
  const client = await getPineconeClient();
  const pineconeIndex = await client.index("docai");
  const namespace = pineconeIndex.namespace(convertToAscii(fileKey));

  console.log("inserting vectors into pinecone");
  await namespace.upsert(vectors);

  return documents[0];
}

async function embedDocument(doc: Document) {
  // теперь подвергаю пришедшие документы ембидингу и векторизации
  try {
    const embeddings = await getEmbeddings(doc.pageContent);
    const hash = md5(doc.pageContent);

    // здесь нужно вернуть специфичный вектор PineconeRecord для pineconedb
    return {
      id: hash,
      values: embeddings,
      metadata: {
        text: doc.metadata.text,
        pageNumber: doc.metadata.pageNumber,
      },
    } as PineconeRecord;
  } catch (error) {
    console.log("error embedding document", error);
    throw error;
  }
}

export const truncateStringByBytes = (str: string, bytes: number) => {
  // лучше перевести в поток закодированных utf-8 кодов
  const enc = new TextEncoder();
  return new TextDecoder("utf-8").decode(enc.encode(str).slice(0, bytes));
};

async function prepareDocument(page: PDFPage) {
  // фуникция, которая разделяет и сегментирует
  let { pageContent, metadata } = page;
  pageContent = pageContent.replace(/\n/g, "");
  // встроенная фича RecursiveCharacterTextSplitter, которая делает это разделение разумно,
  // что позволит не засовывать полную страницу в один вектор
  const splitter = new RecursiveCharacterTextSplitter();
  const docs = await splitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        pageNumber: metadata.loc.pageNumber,
        text: truncateStringByBytes(pageContent, 36000),
      },
    }),
  ]);
  return docs;
}