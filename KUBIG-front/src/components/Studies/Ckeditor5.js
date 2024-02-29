import React, { useEffect, useState } from "react";
import client from "../../lib/httpClient";

import { CKEditor } from '@ckeditor/ckeditor5-react';

import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic';

import { Essentials } from '@ckeditor/ckeditor5-essentials';
import { Bold, Italic } from '@ckeditor/ckeditor5-basic-styles';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';

// import Math from '@isaul32/ckeditor5-math/src/math';
// import AutoformatMath from '@isaul32/ckeditor5-math/src/autoformatmath';

export function Ckeditor5({htmlStr, changeHtmlStr}) {
  const [flag, setFlag] = useState(false);

  const customUploadAdapter = (loader) => {
    return {
        upload(){
          return new Promise ((resolve, reject) => {
              const formData = new FormData();

              loader.file.then( (file) => {
                  formData.append("file", file);

                  client.post(
                      process.env.REACT_APP_KUBIG_PUBLIC_API_URL + "/s3",
                      formData
                      ).then((res) => {
                      if(!flag){
                          setFlag(true);
                      }
                      resolve({
                          default: res.data
                      });
                  })
                  .catch((err)=>reject(err));

              })})
        }
      }
    }

    // function uploadPlugin (editor) { 
    //   editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
    //     return customUploadAdapter(loader);
    //   }
    // }   

    useEffect(() => {
      console.log(ClassicEditor)
    })

    const editorConfiguration = {
      plugins: [ Essentials, Bold, Italic, Paragraph ],
      // extraPlugins: [uploadPlugin],
      toolbar: [ 'bold', 'italic' ]
    };

  return (
    <CKEditor
        editor={ClassicEditor}
        config={editorConfiguration}
        data={htmlStr}
        onReady={ editor => {
            // You can store the "editor" and use when it is needed.
            // console.log( 'Editor is ready to use!', editor );
        } }
        onChange={ ( event, editor ) => {
          changeHtmlStr( editor.getData() );
        } }
        onBlur={ ( event, editor ) => {
            // console.log( 'Blur.', editor );
        } }
        onFocus={ ( event, editor ) => {
            // console.log( 'Focus.', editor );
        } }
    />
  );
}


