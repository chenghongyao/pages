


window.onmessage = function(event) {
  const data = event.data;
  if (event.origin !== "app://obsidian.md" || !data["app"] || data["app"] !== "obsidian-book")return;
  const funMap = {
    openFile: function(data) {
      const doc = instance.Core.documentViewer.getDocument()
      if (doc) {
        this.saveFile(instance.currentFile, doc, data);
      } else {
        instance.UI.loadDocument(data.blob);
        instance.currentFile = data.path;
      }

    },

    saveFile: function(oldPath, doc, newData) {
			instance.Core.annotationManager.exportAnnotations().then((xfdfString) => {
        // console.log("annotation data");
        // console.log(xfdfString);
        doc.getFileData({xfdfString}).then(data => {
          const arr = new Uint8Array(data);
          window.parent.postMessage({
            app: instance.customData["id"],
            type: "saveData",
            data: {
              path: oldPath,
              array: arr,
            },
          },"*")
          if (newData) {
            console.log("load file");
            console.log("extension:",newData.extension)
            instance.UI.loadDocument(newData.blob, {extension:newData.extension});
            instance.currentFile = newData.path;
          }
        });
			})
    }
  }

  if (funMap[data.type]) {
    funMap[data.type](data.data);
  }
};

// TODO:重复添加？？
window.addEventListener('viewerLoaded', () => {

  // console.log("viewerLoaded");
  // instance.UI.setTheme('dark');

  instance.customData = JSON.parse(instance.UI.getCustomData());
  window.parent.postMessage({
          app: instance.customData["id"],
          type: "viewReady",
        },"*")
})

window.addEventListener('documentLoaded', () => {
  console.log("documentLoaded");
  instance.UI.setFitMode(instance.UI.FitMode.FitWidth)
  // console.log(instance);
}) 


window.onclose = event => {
  console.log("window close")
}

// console.log("config.js sdfsdfasdf ")
// console.log(window.parent)


