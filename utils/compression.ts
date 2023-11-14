import { PromiseFileReader } from "@@/src/PromiseFileReader";

async function decompressBlob(blob: Blob): Promise<Blob> {
  const ds = new DecompressionStream("gzip");
  const decompressedStream = blob.stream().pipeThrough(ds);
  return await new Response(decompressedStream).blob();
}

async function compressBlob(blob: Blob): Promise<Blob> {
  const ds = new CompressionStream("gzip");
  const decompressedStream = blob.stream().pipeThrough(ds);
  return await new Response(decompressedStream).blob();
}

async function blobToBase64(blob: Blob): Promise<string> {
  const url = await PromiseFileReader.readAsDataURL(blob);
  return url.replace(/^data:[^;]*;base64,/, "");
}

async function base64ToBlob(data: string): Promise<Blob> {
  const res = await fetch("data:application/octet-stream;base64," + data);
  return res.blob();
}

export async function compressString(text: string | Blob): Promise<string> {
  if (typeof text === "string") text = new Blob([text]);
  return blobToBase64(await compressBlob(text));
}

export async function decompressString(data: string): Promise<string> {
  return (await decompressBlob(await base64ToBlob(data))).text();
}
