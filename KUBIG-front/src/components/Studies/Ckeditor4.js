import React, { useState } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import client from "../../lib/httpClient";

import { CKEditor } from 'ckeditor4-react';

export default function CKEditor4({htmlStr, setHtmlStr}) {
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
        initData="<p>Hello from CKEditor 4!</p>"
        onInstanceReady={ () => {
            alert( 'Editor is ready!' );
        } }
    />
  );
}


