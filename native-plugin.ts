export default () => {
  return {
    name: "native-plugin",
    async transform(src: any, id: string) {
      if (id.endsWith(".node")) {
        return `
                    try {
                        global.process.dlopen(module, '${id}');
                    } catch(exception) {
                        throw new Error('Cannot open  ${id} :'+ exception);
                    }
                    export default module.exports;
                `;
      }
    },
  };
};
