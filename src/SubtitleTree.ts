import IntervalTree, { Interval } from "@flatten-js/interval-tree";

export interface Subtitle {
  start: number;
  end: number;
  text: string[];
}

function parseSrt(data: string): Subtitle[] {
  try {
    return data
      .trim()
      .split("\n\n")
      .filter(Boolean)
      .map((section) => {
        const [_id, times, ...text] = section.split("\n");
        const [start, end] = times.split(" --> ");
        return {
          start: toSeconds(start),
          end: toSeconds(end),
          text,
        };
      });
  } catch (e) {
    throw new SrtParseError("Data invalid");
  }
}
class SrtParseError extends Error {}

// "hh:mm:ss,ms" to seconds
function toSeconds(timeString: string): number {
  const [hours, minutes, seconds] = timeString.split(":");
  return (
    3600 * parseInt(hours) +
    60 * parseInt(minutes) +
    parseFloat(seconds.replace(",", "."))
  );
}

export class SubtitleTree extends IntervalTree<string[]> {
  constructor(data?: Subtitle[]) {
    super();
    for (const { start, end, text } of data ?? []) {
      this.insert([start, end], text);
    }
  }

  static fromSrt(srtData: string): SubtitleTree {
    return new SubtitleTree(parseSrt(srtData));
  }

  static fromSerialized(data: string): SubtitleTree {
    const tree = new SubtitleTree();
    const values = JSON.parse(`[${data}]`);
    let lastTime = 0;
    for (let i = 0; i < values.length; i += 3) {
      const start = values[i] / 10 + lastTime;
      const end = values[i + 1] / 10 + start;
      const text = values[i + 2].split("\n");
      tree.insert([start, end], text);
      lastTime = end;
    }
    return tree;
  }

  serialize(): string {
    const result: (number | string)[] = [];
    let lastTime = 0;

    for (const { key, value } of this.items ?? []) {
      const [start, end] = key as unknown as [number, number];
      result.push(
        Math.round((start - lastTime) * 10),
        Math.round((end - start) * 10),
        value.join("\n")
      );
      lastTime = end;
    }

    return JSON.stringify(result).slice(1, -1);
  }

  find(time: number): Subtitle | undefined {
    return this.search([time, time], (value, key) => ({
      start: key.low,
      end: key.high,
      text: value,
    }))?.[0];
  }
}
