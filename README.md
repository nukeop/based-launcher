# based-launcher

Linux application launcher and multitool

## Features

- **Dmenu mode** - pipe a list of options to the launcher, when you select one it will output it to stdout. It also accepts json input.
- **App launcher** - search for applications and launch them. This works by searching for .desktop files according to freedesktop.org specifications. Currently it's slow, because it needs to search for icons in several locations. I'm planning to improve this by caching the results.
- **Performant** - launches in 150ms, despite being Electron. Browse and filter thousands of options without lag. Brutally mogs other JS launchers.
  - Development is fast and easy thanks to Vite and Vitest. Tests run in under 1s. The program starts in dev mode with live reload in 200ms.
- **Themable** - the UI can be styled with CSS or SCSS using all their modern features. Immediate feedback due to your styles being reloaded on the fly.

## Installation

Get the latest release for your distro from the [releases page](https://github.com/nukeop/based-launcher/releases). You can also build it from source.
You will need `gtk-launch` installed on your system to launch programs.

### Building

```shell
$ npm i
$ npm run dev # starts in dev mode
$ npm run build # builds a production version
```

The binaries will be in the `releases` folder.

## Usage

```shell
# Shows available arguments
$ based-launcher --help

# Pipe a list of options to the launcher to use the dmenu mode
$ exa -1 | based-launcher
```

## Flags
You can see all the flags in [electron/main/args.ts](electron/main/args.ts).

- `--mode <mode>` - either `dmenu` or `apps`, with `dmenu` being the default
- `--input-prefix <prefix>` - This will be shown to the left of the input field. Use something like "run:" or "open:"
- `--input-format <format>` - either `text/plain` or `application/json`, indicates the format of the input data in dmenu mode. Defaults to `text/plain`.
- `--item-size` - indicates the vertical size of elements if you're using a custom theme. This is needed to calculate the total height of the list, because the list is virtualized.
- `--item-size-with-description` - same as `--item-size`, but for items with descriptions. The description typically takes another line.

## Themes

based-launcher can load custom css themes. Use the `--theme` or `-t` flag to select the stylesheet file.

In addition to user themes, the repository comes with some custom theme files (in the `themes` folder). To build them, run `npm run themes`. If you want to work on a theme using css, you can run `npm run themes:watch`, and it will recompile all `.scss` files in the `themes` folder as they're changed. The launcher will live reload the theme as well.