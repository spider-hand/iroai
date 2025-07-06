# iroai

<img width="240" alt="screenshot" src="https://github.com/user-attachments/assets/31b56415-030e-41bb-bbb2-009fec369a9c" />

Generate color shades in CLI

> "iroai" (色合い) means "color shade" in Japanese.

## Installation

```sh
npm install iroai
```

## Usage

```sh
iroai <base-hex-color> [OPTIONS]
```

Or simply run:

```sh
iroai
```

to launch interactive mode.

## Options

| Option          | Description                                  | Values                                                      | Default    |
| --------------- | -------------------------------------------- | ----------------------------------------------------------- | ---------- |
| `-h, --help`    | Help text                                    |                                                             |            |
| `-v, --version` | Version                                      |                                                             |            |
| `-n, --name`    | Name of the color                            |                                                             |            |
| `-p, --preset`  | Color preset to use                          | `ant`, `bootstrap`, `chakra`, `material` `tailwind`         | `tailwind` |
| `-m, --mode`    | Function to apply to the color shades        | `linear`, `quad`, `cubic`, `quart`, `quint`, `sine`, `expo` | `linear`   |
| `-e, --ease`    | Easing function to apply to the color shades | `ease-in`, `ease-out`, `ease-in-out`                        | `ease-in`  |
| `-s, --spread`  | Spread of the color shades                   | `narrow`, `normal`, `wide`                                  | `normal`   |
| `-f, --format`  | Output format                                | `plain`, `css`, `scss`                                      | `plain`    |

### Preset

- `ant`: 1-10
- `bootstrap`: 100-900
- `chakra`: 50-950
- `material`: 0-100
- `tailwind`: 50-950

### Format

- `--format plain` (Default):

```bash
#FDDBE2 primary-50
#FCC4CF primary-100
#FAA8B8 primary-200
#F8889E primary-300
#F66683 primary-400
#F44366 primary-500
#C63653 primary-600
#9A2A40 primary-700
#711F2F primary-800
#4D1520 primary-900
#2F0D13 primary-950
```

- `--format css`:

```css
--primary-50: hsl(24, 98%, 37%);
--primary-100: hsl(79, 87%, 46%);
--primary-200: hsl(53, 83%, 29%);
--primary-300: hsl(358, 87%, 25%);
--primary-400: hsl(91, 91%, 34%);
--primary-500: hsl(46, 84%, 15%);
--primary-600: hsl(83, 90%, 37%);
--primary-700: hsl(17, 83%, 32%);
--primary-800: hsl(56, 99%, 38%);
--primary-900: hsl(12, 96%, 48%);
--primary-950: hsl(111, 90%, 37%);
```

- `--format scss`:

```scss
$primary-50: hsl(24, 98%, 37%);
$primary-100: hsl(79, 87%, 46%);
$primary-200: hsl(53, 83%, 29%);
$primary-300: hsl(358, 87%, 25%);
$primary-400: hsl(91, 91%, 34%);
$primary-500: hsl(46, 84%, 15%);
$primary-600: hsl(83, 90%, 37%);
$primary-700: hsl(17, 83%, 32%);
$primary-800: hsl(56, 99%, 38%);
$primary-900: hsl(12, 96%, 48%);
$primary-950: hsl(111, 90%, 37%);
```

## License

[MIT](./LICENSE)
