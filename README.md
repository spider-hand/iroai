# iroai

Generate color shades in CLI

## Installation

```sh
npm install iroai
```

## Usage

```sh
iroai <base-color-code> [OPTIONS]
```

## Options

| Option           | Description                               | Values                                                        | Default    |
| ---------------- | ----------------------------------------- | ------------------------------------------------------------- | ---------- |
| `-h, --help`     | Show help information                     |                                                               |            |
| `-v, --version`  | Display the version number                |                                                               |            |
| `-f, --format`   | Specify the output format                 | `hex`, `rgb`, `hsl`                                           | `hsl`      |
| `-n, --name`     | Set the name of the color                 |                                                               |            |
| `-s, --scale`    | Specify the scale of the output           | `ant`, `bootstrap`, `chakra`, `material` `tailwind`           | `tailwind` |
| `-f, --function` | Specify the function to create the shades | `linear`, `quad`, `cubic`, `quart` , `quint`, `sine` , `expo` | `linear`   |

### Format

Example:
- `hex`: `#FFFFFF`
- `rgb`: `rgb(255, 255, 255)`
- `hsl`: `hsl(0, 0%, 100%)`

### Scale

- `ant`: 1-10
- `bootstrap`: 100-900
- `chakra`: 50-950
- `material`: 0-100
- `tailwind`: 50-950

## License

[MIT](./LICENSE)
