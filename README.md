# based-launcher

Linux application launcher and multitool

## Installation

Get the latest release for your distro from the [releases page](https://github.com/nukeop/based-launcher/releases). You can also build it from source.

### Building

```shell
$ npm i
$ npm run build
```

The binaries will be in the `releases` folder.

## Usage

```shell
# Shows available arguments
$ based-launcher --help

# Pipe a list of options to the launcher to use the dmenu mode
$ exa -1 | based-launcher
```

## Features

- **Dmenu mode** - pipe a list of options to the launcher, when you select one it will output it to stdout
- **App launcher** - search for applications and launch them (work in progress)
- **Performant** - launches in 150ms, despite being Electron. Browse and filter thousands of options without lag. Brutally mogs other JS launchers.
  - Development is fast and easy thanks to Vite and Vitest. Tests run in under 1s. The program starts in dev mode with live reload in 200ms.
- **Themable** - the UI can be styled with CSS or SCSS using all their modern features. Immediate feedback due to your styles being reloaded on the fly.

## Themes

based-launcher can load custom css themes. Use the `--theme` or `-t` flag to select the stylesheet file.

In addition to user themes, the repository comes with some custom theme files (in the `themes` folder). To build them, run `npm run themes`. If you want to work on a theme using css, you can run `npm run themes:watch`, and it will recompile all `.scss` files in the `themes` folder as they're changed. The launcher will live reload the theme as well.