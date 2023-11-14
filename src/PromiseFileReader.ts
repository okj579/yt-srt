import type { ArgumentsType, FunctionArgs } from "@vueuse/core";

function useFileReader<Result extends string | ArrayBuffer>(
  fn: (reader: FileReader) => void
): Promise<Result> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result as Result));
    reader.addEventListener("error", () => reject(reader.error));
    fn(reader);
  });
}

export const PromiseFileReader = {
  readAsArrayBuffer: (blob: Blob) =>
    useFileReader<ArrayBuffer>((r) => r.readAsArrayBuffer(blob)),
  readAsBinaryString: (blob: Blob) =>
    useFileReader<string>((r) => r.readAsBinaryString(blob)),
  readAsDataURL: (blob: Blob) =>
    useFileReader<string>((r) => r.readAsDataURL(blob)),
  readAsText: (blob: Blob, encoding?: string) =>
    useFileReader<string>((r) => r.readAsText(blob, encoding)),
};
