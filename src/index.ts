import { Command } from "commander";
import chalk from "chalk";
import { text, select, cancel, isCancel } from "@clack/prompts";

export type RGB = [number, number, number];

export type PresetOption =
  | "ant"
  | "bootstrap"
  | "chakra"
  | "material"
  | "tailwind";

export type ModeOption =
  | "linear"
  | "quad"
  | "cubic"
  | "quart"
  | "quint"
  | "sine"
  | "expo";

export type EaseOption = "ease-in" | "ease-out" | "ease-in-out";

export type SpreadOption = "narrow" | "normal" | "wide";

export type FormatOption = "plain" | "css" | "scss";

export interface CLIOptions {
  help?: boolean;
  version?: boolean;
  name?: string;
  preset?: PresetOption;
  mode?: ModeOption;
  ease?: EaseOption;
  spread?: SpreadOption;
  format?: FormatOption;
}

export type ColorArray = [hex: string, hsl: string];

const ANT_DESIGN_PRESET = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;
const BOOTSTRAP_PRESET = [100, 200, 300, 400, 500, 600, 700, 800, 900] as const;
const CHAKRA_PRESET = [
  50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
] as const;
const MATERIAL_PRESET = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100] as const;
const TAILWIND_PRESET = [
  50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
] as const;

const PRESETS: Record<PresetOption, readonly number[]> = {
  ant: ANT_DESIGN_PRESET,
  bootstrap: BOOTSTRAP_PRESET,
  chakra: CHAKRA_PRESET,
  material: MATERIAL_PRESET,
  tailwind: TAILWIND_PRESET,
} as const;

const SPREAD_MAP: Record<SpreadOption, number> = {
  narrow: 0.4,
  normal: 0.6,
  wide: 0.8,
} as const;

function getEaseFactor(t: number, mode: ModeOption): number {
  switch (mode) {
    case "linear":
    default:
      return t;
    case "quad":
      return Math.pow(t, 2);
    case "cubic":
      return Math.pow(t, 3);
    case "quart":
      return Math.pow(t, 4);
    case "quint":
      return Math.pow(t, 5);
    case "sine":
      return Math.sin(t * (Math.PI / 2));
    case "expo":
      return t === 0 ? 0 : Math.pow(2, 10 * (t - 1));
  }
}

function getFactor(t: number, mode: ModeOption, ease: EaseOption): number {
  t = Math.abs(t);

  switch (ease) {
    case "ease-in":
    default:
      return getEaseFactor(t, mode);
    case "ease-out":
      return 1 - getEaseFactor(1 - t, mode);
    case "ease-in-out":
      if (t < 0.5) {
        return 0.5 * getEaseFactor(t * 2, mode);
      } else {
        return 1 - 0.5 * getEaseFactor(2 - t * 2, mode);
      }
  }
}

function convertIntoHSL(hex: string): string {
  hex = hex.replace(/^#/, "");

  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  let l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);

  return `hsl(${h}, ${s}%, ${l}%)`;
}

function getShadeColor(
  hex: string,
  t: number,
  mode: ModeOption,
  ease: EaseOption
): ColorArray {
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);

  const factor = getFactor(t, mode, ease);

  if (t >= 0) {
    r = Math.round(r + (255 - r) * factor);
    g = Math.round(g + (255 - g) * factor);
    b = Math.round(b + (255 - b) * factor);
  } else {
    r = Math.round(r * (1 - factor));
    g = Math.round(g * (1 - factor));
    b = Math.round(b * (1 - factor));
  }

  const hexString =
    `#${r.toString(16).padStart(2, "0")}` +
    `${g.toString(16).padStart(2, "0")}` +
    `${b.toString(16).padStart(2, "0")}`.toUpperCase();

  const hslString = convertIntoHSL(hexString);

  return [hexString, hslString];
}

function generatePalette(
  baseColor: string,
  preset: PresetOption,
  mode: ModeOption,
  ease: EaseOption,
  spread: SpreadOption
): ColorArray[] {
  const palette: ColorArray[] = [];
  for (let i = 0; i < PRESETS[preset].length; i++) {
    // Use the base color as the middle color of the palette
    const middle = Math.floor(PRESETS[preset].length / 2);
    const spreadValue = SPREAD_MAP[spread] ?? SPREAD_MAP["normal"];
    const t = ((middle - i) / middle) * spreadValue;
    palette.push(getShadeColor(baseColor, t, mode, ease));
  }
  return palette;
}

// @see: https://www.w3.org/TR/WCAG20/#relativeluminancedef
function calcLuminance([r, g, b]: RGB): number {
  const [r1, g1, b1] = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r1 + 0.7152 * g1 + 0.0722 * b1;
}

// @see: https://www.w3.org/TR/WCAG20/#contrast-ratiodef
function calcContrast(rgb1: RGB, rgb2: RGB): number {
  const lum1 = calcLuminance(rgb1);
  const lum2 = calcLuminance(rgb2);
  const brighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (brighter + 0.05) / (darker + 0.05);
}

function getReadableTextColor(backgroundHex: string): string {
  const r = parseInt(backgroundHex.slice(1, 3), 16);
  const g = parseInt(backgroundHex.slice(3, 5), 16);
  const b = parseInt(backgroundHex.slice(5, 7), 16);

  const bg: RGB = [r, g, b];
  const white: RGB = [243, 244, 246]; // #F3F4F6 (text-gray-100 in Tailwind)
  const black: RGB = [17, 24, 39]; // #111827 (text-gray-900 in Tailwind)

  const contrastWhite = calcContrast(bg, white);
  const contrastDark = calcContrast(bg, black);

  return contrastWhite > contrastDark ? "#F3F4F6" : "#111827";
}

function getColorToken(name: string, shade: number): string {
  if (name === "") return `${shade}`;
  return `${name}-${shade}`;
}

function getOutput(
  [hex, hsl]: ColorArray,
  colorToken: string,
  format: FormatOption
): string {
  switch (format) {
    case "plain":
    default:
      return `${hex} ${colorToken}`;
    case "css":
      return `--${colorToken}: ${hsl};`;
    case "scss":
      return `$${colorToken}: ${hsl};`;
  }
}

function isValidHexColor(str: string): boolean {
  return /^#(?:[0-9a-fA-F]{3}){1,2}$/.test(str);
}

function handleCanel(resp: string | symbol): void {
  if (isCancel(resp)) {
    cancel("Operation cancelled.");
    process.exit(1);
  }
}

export async function main() {
  const program = new Command()
    .name("iroai")
    .helpOption(false)
    .description("Generate color shades in CLI")
    .argument("[base-hex-color]", "Base hex color")
    .option("-h, --help", "Help")
    .option("-v, --version", "Version")
    .option("-n, --name <name>", "Name of the color")
    .option("-p, --preset <preset>", "Color preset to use")
    .option("-m, --mode <mode>", "Function to apply to the color shades")
    .option("-e, --ease <ease>", "Easing function to apply to the color shades")
    .option("-s, --spread <spread>", "Spread of the color shades")
    .option("-f, --format <format>", "Output format");

  program.parse();
  const options = program.opts<CLIOptions>();

  // Help
  if (options.help) {
    program.help();
    process.exit(0);
  }

  // Version
  if (options.version) {
    console.log("1.0.0");
    process.exit(0);
  }

  // Base color
  let baseColor = program.args[0];
  if (!baseColor || !isValidHexColor(baseColor)) {
    const resp = await text({
      message: "Enter base hex color.",
      placeholder: "#F44336",
      validate: (value) => {
        return isValidHexColor(value) ? undefined : "❌ Invalid hex color";
      },
    });

    handleCanel(resp);

    baseColor = resp as string;
  }

  // Name
  let name = options.name;
  if (!name) {
    const resp = await text({
      message: "Enter name of the color.",
      placeholder: "primary",
    });

    handleCanel(resp);

    name = (resp as string) ?? "";
  }

  // Preset
  let preset = options.preset;
  if (!preset) {
    const resp = await select<PresetOption>({
      message: "Select color preset.",
      options: Object.keys(PRESETS).map((key) => ({
        label: key,
        value: key as PresetOption,
      })),
      initialValue: "tailwind" as PresetOption,
    });

    handleCanel(resp);

    preset = resp as PresetOption;
  }

  // Mode
  let mode = options.mode;
  if (!mode) {
    const resp = await select<ModeOption>({
      message: "Select mode for color generation.",
      options: [
        { label: "Linear", value: "linear" },
        { label: "Quadratic", value: "quad" },
        { label: "Cubic", value: "cubic" },
        { label: "Quartic", value: "quart" },
        { label: "Quintic", value: "quint" },
        { label: "Sine", value: "sine" },
        { label: "Exponential", value: "expo" },
      ],
    });

    handleCanel(resp);

    mode = resp as ModeOption;
  }

  // Ease
  let ease = options.ease;
  if (!ease) {
    const resp = await select<EaseOption>({
      message: "Select easing function.",
      options: [
        { label: "Ease In", value: "ease-in" },
        { label: "Ease Out", value: "ease-out" },
        { label: "Ease In Out", value: "ease-in-out" },
      ],
    });

    handleCanel(resp);

    ease = resp as EaseOption;
  }

  // Spread
  let spread = options.spread;
  if (!spread) {
    const resp = await select<SpreadOption>({
      message: "Select spread of the color shades.",
      options: [
        { label: "Narrow", value: "narrow" },
        { label: "Normal", value: "normal" },
        { label: "Wide", value: "wide" },
      ],
      initialValue: "normal",
    });

    handleCanel(resp);

    spread = resp as SpreadOption;
  }

  // Format
  let format = options.format;
  if (!format) {
    const resp = await select<FormatOption>({
      message: "Select output format.",
      options: [
        { label: "Plain", value: "plain" },
        { label: "CSS", value: "css" },
        { label: "SCSS", value: "scss" },
      ],
      initialValue: "plain",
    });

    handleCanel(resp);

    format = resp as FormatOption;
  }

  const palette = generatePalette(baseColor, preset, mode, ease, spread);

  palette.forEach(([hex, hsl], index) => {
    const textColor = getReadableTextColor(hex);
    const colorToken = getColorToken(name, PRESETS[preset][index]);
    const output = getOutput([hex, hsl], colorToken, format);

    console.log(`${chalk.bgHex(hex).hex(textColor)(output)}`);
  });
}
