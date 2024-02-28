import React, { useMemo, useState } from "react";
import { styled } from "styled-components";
import axios from "axios";
import katex from "katex";
import "katex/dist/katex.min.css";
import client from "../../lib/httpClient";

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import { Image, ImageResizeButtons, ImageResizeEditing, ImageToolbar } from '@ckeditor/ckeditor5-image';


export default function CKEditor5({
  htmlStr,
  setHtmlStr,
}) {
  const [flag, setFlag] = useState(false);
  window.katex = katex;

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

  return (
    <CKEditor
        editor={ ClassicEditor }
        config={{
          extraPlugins: [uploadPlugin]
        }}
        data={htmlStr}
        onReady={ editor => {
            // You can store the "editor" and use when it is needed.
            // console.log( 'Editor is ready to use!', editor );
        } }
        onChange={ ( event, editor ) => {
            setHtmlStr( editor.getData() );
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


