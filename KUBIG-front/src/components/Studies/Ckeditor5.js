import React, { useEffect, useState } from "react";
import client from "../../lib/httpClient";

import Editor from 'ckeditor5-custom-build/build/ckeditor'; 
import { CKEditor } from '@ckeditor/ckeditor5-react';

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

    function uploadPlugin (editor) { 
      editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
        return customUploadAdapter(loader);
      }
    }   

    useEffect(() => {
      // console.log(Editor)
    })

    const editorConfiguration = {
      extraPlugins: [uploadPlugin],
    };

  return (
    <CKEditor
        editor={Editor}
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


