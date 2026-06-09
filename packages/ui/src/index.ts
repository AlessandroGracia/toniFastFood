export type Tone = "neutral" | "positive" | "warning" | "danger";

export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
