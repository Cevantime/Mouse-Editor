import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import imageIcon from '@ckeditor/ckeditor5-core/theme/icons/image.svg';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

export default class InsertMedia extends Plugin {
    init() {
        const editor = this.editor;
        editor.ui.componentFactory.add('insertMedia', locale => {
            const view = new ButtonView(locale);

            view.set({
                label: 'Insert media',
                icon: imageIcon,
                tooltip: true
            });

            // Callback executed once the image is clicked.
            view.on('execute', () => {

                window.open("http://sharesources.fr/filebrowser/index/index?model=filebrowser/file&filters=all", "Add media", 'width=720,height=480');
                window.filebrowser_callback = (data) => {
                    console.log(data);
                };
                window.filebrowser_model = "filebrowser/file";
                window.filebrowser_filters = "all";
                return false;
            });

            return view;
        });
    }
}