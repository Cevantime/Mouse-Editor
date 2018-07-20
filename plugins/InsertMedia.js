import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import imageIcon from '@ckeditor/ckeditor5-core/theme/icons/image.svg';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import ajax from '../utils/Ajax.js';

export default class InsertMedia extends Plugin {
  init() {
    const editor = this.editor;
    editor.ui.componentFactory.add('insertMedia', locale => {
      const view = new ButtonView(locale);
      const filebrowserConfig = editor.config._config.filebrowser;
      const filebrowserHost = filebrowserConfig.host;
      

      view.set({
        label: 'Insert media',
        icon: imageIcon,
        tooltip: true
      });

      // Callback executed once the image is clicked.
      view.on('execute', () => {
        let url = filebrowserHost + "/filebrowser/index?model=filebrowser/file&filters=all";
        if (filebrowserConfig.token) {
          url += '&access_token=' + filebrowserConfig.token;
        }
        if (filebrowserConfig.folder) {
          url += '&folder=' + filebrowserConfig.folder;
        }
        const child = window.open(url, "Add media", 'width=720,height=480');
        const interval = window.setInterval(function () {

          if (child.closed) {
            ajax.get(filebrowserHost + "/filebrowser/disconnect");
            clearInterval(interval);
          }
        }, 500);
        
        window.filebrowser_callback = (data) => {
          
          ajax.get(filebrowserHost + "/filebrowser/disconnect");

          editor.model.change(writer => {
            if (data.type.substring(0, 6) === 'image/') {
              const imageElement = writer.createElement('image', {
                src: data.src
              });
              // Insert the image in the current selection location.
              editor.model.insertContent(imageElement, editor.model.document.selection);
            } else {
              const insertPosition = editor.model.document.selection.getFirstPosition();
              writer.insertText(data.infos.name, {linkHref: data.src}, insertPosition);
            }

          });
        };
        window.filebrowser_model = "filebrowser/file";
        window.filebrowser_filters = "all";
        return false;
      });

      return view;
    });
  }
}