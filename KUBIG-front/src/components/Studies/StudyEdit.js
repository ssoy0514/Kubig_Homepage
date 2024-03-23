import { styled } from "styled-components";
import { useEffect, useState } from "react";
import QuillEditor from "./QuillEditor";
import TitleAndCategory from "../common/TitleAndCategory";
import { useSearchParams } from "react-router-dom";
import client from "../../lib/httpClient";

import CKEditor5 from "./Ckeditory5";

export default function StudyEdit() {
  const [htmlStr, setHtmlStr] = useState("");
  const [title, setTitle] = useState("");
  const [thumbnailImg, setThumbnailImg] = useState("");

  const [semesters, setSemesters] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [categorySearchParams] = useSearchParams();
  const session = categorySearchParams.get("category");

  const handleThumbnailChange = (event) => {
    if (event.target.files[0].type.startsWith("image")) {
      setThumbnailImg(event.target.files[0]);
    } else alert("이미지 파일만 등록가능합니다.");
  };
  const fetchSemester = async () => {
    try {
      const res = await client.get("/studies/semesters");

      if (res) setSemesters(res.data);
    } catch (err) {
      alert(err);
    }
  };
  useEffect(() => {
    fetchSemester();
  }, []);

  const fetchCategory = async (semester) => {
    try {
      if (semester) {
        const res = await client.get(
          "/studies/category/" + semester + "?session=" + session
        );
        if (res) setCategories(res.data);
      }
    } catch (err) {
      alert("올바르지 않은 접근입니다.");
    }
  };



  useEffect(() => {
    fetchCategory(selectedSemester);
  }, [selectedSemester]);
  return (
    <NewWrapper>
      <TitleAndCategory
        htmlStr={htmlStr}
        pdfFile={null}
        title={title}
        setTitle={setTitle}
        semesters={semesters}
        setSelectedSemester={setSelectedSemester}
        selectedSemester={selectedSemester}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        thumbnailImg={thumbnailImg}
        categories={categories}
        session={session}
      />

      <EditorWrapper>
        {/* <QuillEditor htmlStr={htmlStr} setHtmlStr={setHtmlStr}></QuillEditor> */}

        <CKEditor5 htmlStr={htmlStr} setHtmlStr={setHtmlStr} />

      </EditorWrapper>
      <PdfInputWrapper style={{ height: "12rem" }}>
        {thumbnailImg ? thumbnailImg.name : "파일을 선택해주세요."}
        <Label for="thumbnail">
          썸네일 이미지 업로드
          <InputFile
            id="thumbnail"
            type="file"
            onChange={handleThumbnailChange}
            accept="image/*"
          />
        </Label>
      </PdfInputWrapper>
    </NewWrapper>
  );
}
export const NewWrapper = styled.div`
  width: 100%;
  padding-top: 1rem;
  padding-left: 7%;
  padding-right: 7%;
  padding-bottom: 5%;

`;
export const EditorWrapper = styled.div`
  width: 100%;
  height: 80vh;
  display: flex;
  justify-content: center;
  padding-top: 0.75rem;
`;

const Label = styled.label`
  width: 26.6875rem;
  height: 3.5625rem;
  background: #9e1f15;
  border: 1px solid;
  color: white;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const PdfInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 40vh;
  /* border-radius: 0.3125rem; */
  border: 1px solid #d6d8db;
  margin-top: 10px;

  background: #fff;
`;
const InputFile = styled.input`
  display: none;
`;
