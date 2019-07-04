/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

// The editor creator to use.
import ClassicEditorBase from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';

import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import UploadAdapter from '@ckeditor/ckeditor5-adapter-ckfinder/src/uploadadapter';
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote';
import CKFinder from '@ckeditor/ckeditor5-ckfinder/src/ckfinder';
import EasyImage from '@ckeditor/ckeditor5-easy-image/src/easyimage';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import Image from '@ckeditor/ckeditor5-image/src/image';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload';
import Link from '@ckeditor/ckeditor5-link/src/link';
import List from '@ckeditor/ckeditor5-list/src/list';
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice';
import Table from '@ckeditor/ckeditor5-table/src/table';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';
import Mention from '@ckeditor/ckeditor5-mention/src/mention';

export default class ClassicEditor extends ClassicEditorBase {}

function MentionLinks( editor ) {
	// The upcast converter will convert a view
	//
	//		<a href="..." class="mention" data-mention="...">...</a>
	//
	// element to the model "mention" text attribute.
	editor.conversion.for( 'upcast' ).elementToAttribute( {
		view: {
			name: 'a',
			key: 'data-mention',
			classes: 'mention',
			attributes: {
				href: true
			}
		},
		model: {
			key: 'mention',
			value: viewItem => editor.plugins.get( 'Mention' ).toMentionAttribute( viewItem )
		},
		converterPriority: 'high'
	} );

	// Downcast the model "mention" text attribute to a view
	//
	//		<a href="..." class="mention" data-mention="...">...</a>
	//
	// element.
	editor.conversion.for( 'downcast' ).attributeToElement( {
		model: 'mention',
		view: ( modelAttributeValue, viewWriter ) => {
			// Do not convert empty attributes (lack of value means no mention).
			if ( !modelAttributeValue ) {
				return;
			}

			let href;

			// User mentions are downcasted as mailto: links. Tags become normal URLs.
			if ( modelAttributeValue.id[ 0 ] === '@' ) {
				href = `mailto:${ modelAttributeValue.id.slice( 1 ) }@example.com`;
			} else {
				href = `https://example.com/social/${ modelAttributeValue.id.slice( 1 ) }`;
			}

			return viewWriter.createAttributeElement( 'a', {
				class: 'mention',
				'data-mention': modelAttributeValue.id,
				href
			} );
		},
		converterPriority: 'high'
	} );
}

// Plugins to include in the build.
ClassicEditor.builtinPlugins = [
	Essentials,
	UploadAdapter,
	Autoformat,
	Bold,
	Italic,
	BlockQuote,
	CKFinder,
	EasyImage,
	Heading,
	Image,
	ImageCaption,
	ImageStyle,
	ImageToolbar,
	ImageUpload,
	Link,
	List,
	MediaEmbed,
	Paragraph,
	PasteFromOffice,
	Table,
	TableToolbar,
	Mention,
	MentionLinks
];

// Editor configuration.
ClassicEditor.defaultConfig = {
	toolbar: {
		items: [
			'heading',
			'|',
			'bold',
			'italic',
			'link',
			'bulletedList',
			'numberedList',
			'imageUpload',
			'blockQuote',
			'insertTable',
			'mediaEmbed',
			'undo',
			'redo'
		]
	},
	image: {
		toolbar: [
			'imageStyle:full',
			'imageStyle:side',
			'|',
			'imageTextAlternative'
		]
	},
	table: {
		contentToolbar: [
			'tableColumn',
			'tableRow',
			'mergeTableCells'
		]
	},
	// This value must be kept in sync with the language defined in webpack.config.js.
	language: 'en'
};
