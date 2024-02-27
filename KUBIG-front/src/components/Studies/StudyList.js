import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { styled } from "styled-components";
import PageBtn from "../common/PageBtn";
import {
  StudyAndProjectWrapper as StudyWrapper,
  ContentContainer as FixedStudyContainer,
  Content as FixedStudyContent,
  ContentImageContainer,
  HeaderContainer,
} from "../common/StudyAndProject";
import axios from "../../api/axios";
import { EditButton, AddButton } from "../common/AddButton";

export default function StudyList({ difficulty, categories, selectedSemester, selected }) {
  const pageTitle =
    difficulty === "basic"
      ? "방학 세션 / BASIC"
      : difficulty === "magazine"
      ? "KUBIG MAGAZINE"
      : "학기 중 세션 / Advanced";

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [STUDY, setSTUDY] = useState([]);
  const [FixedStudy, setFixedStudy] = useState([]);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // useEffect(() => {
  //   fixedFetch(selected);
  // }, [selected, difficulty]);

  useEffect(() => {
    fetch(currentPage, selectedSemester, selected, categories);
  }, [currentPage, selected, selectedSemester, categories, difficulty]);

  const fetch = async (page, selectedSemester, selected, categories) => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_KUBIG_PUBLIC_API_URL +
          "/studies/list" +
          `?session=${difficulty}&` +
          `${selected ? `category=${selected}&` : ""}` +
          `${selectedSemester ? `semester=${selectedSemester}&` : ""}` +
          `page=${page}`
      );

      if(categories.length === 0){
        setSTUDY([]);
        return;
      }

      const data = response.data;
      setSTUDY(data.study);
    } catch (err) {
      alert("에러가 발생하였습니다.");
    }
  };

  // const fixedFetch = async (selected) => {
  //   try {
  //     const response = await axios.get(
  //       process.env.REACT_APP_KUBIG_PUBLIC_API_URL +
  //         "/studies/fixed" +
  //         `?session=${difficulty}` +
  //         `${selected ? `&category=${selected}` : ""}`
  //     );
  //     const data = response.data;
  //     console.log(data);
  //     setTotalPages(data.last_page);
  //     setFixedStudy(data.study);
  //   } catch (err) {
  //     alert("에러가 발생하였습니다.");
  //   }
  // };
  const parser = new DOMParser();

  return (
    <>
      <StudyWrapper>
        <HeaderContainer>
          <h1>{pageTitle}</h1>
          <EditButton>
            <Link to={`/studies/new?category=${difficulty}`}>글쓰기</Link>
          </EditButton>
        </HeaderContainer>
        {/* <FixedStudyContainer>
          {FixedStudy.map((study) => (
            <Link to={`/studies/${study.id}`}>
              <FixedStudyContent key={study.id}>
                <ContentImageContainer>
                  <img src={study.thumbnailUrl} alt="fixed" />
                </ContentImageContainer>
              </FixedStudyContent>
            </Link>
          ))}
        </FixedStudyContainer> */}
        <StudyContentContainer>
          {STUDY.map((study, i) => (
            <Link key={i} to={`/studies/${study.id}`}>
              <StudyContent key={study.id}>
                <StudyImageContainer>
                  <img src={study.thumbnailUrl} alt="fixed" />
                </StudyImageContainer>
                <StudyText>
                  <h3>
                    <strong>{study.title} </strong>
                  </h3>
                  <h4>
                    작성자 :{study.author.generation}기 {study.author.name}
                  </h4>
                  <div
                    style={{
                      width: '100%',
                      maxWidth: 846, 
                      height: 125,
                      overflow: "hidden",
                      whiteSpace: "normal",
                      wordWrap: "break-word",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {
                      parser.parseFromString(study.content, "text/html").body
                        .textContent
                    }
                  </div>
                  <h5>{study.createdAt.substring(0, 10)}</h5>
                </StudyText>
              </StudyContent>
            </Link>
          ))}
        </StudyContentContainer>
        <PageBtn
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </StudyWrapper>
    </>
  );
}

const StudyContentContainer = styled.div`
  margin-top: 5vh;
  margin-bottom: 3rem;
`;
const StudyContent = styled.div`
  width: 100%;
  border-top: 1px #d6d8db solid;
  padding-top: 2rem;
  padding-bottom: 2rem;

  display: flex;
  gap: 1.25rem;
`;
const StudyImageContainer = styled.div`
  width: 30%;
  min-width: 260px;

  position: relative;
  &::after {
    padding-bottom: 60%;

    display: block;
    content: "";
  }
  img {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 0.3125rem;
    object-fit: contain;
  }
`;
const StudyText = styled.div`
  display: flex;
  flex-direction: column;
  h5 {
    color: #9fa0a7;
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 400;
    line-height: 180%;
    margin-top: auto;
  }
`;
