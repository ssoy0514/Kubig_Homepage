import { Link, useSubmit } from "react-router-dom";
import { styled } from "styled-components";
import { ItemWrapper as StudyItemWrapper } from "../common/StudyAndProject";
import { useContext } from "react";
import AuthContext from "../Auth/AuthContext";
import client from "../../lib/httpClient";
export default function StudyItem({ study }) {
  const handleDelete = async () => {
    if(window.confirm("삭제하시겠습니까?")){
      try {
        await client.get("/studies/delete/" + study.id);
        alert("삭제되었습니다.");
        window.location.href =
          "/studies?difficulty=" + study.category.sessionType;
      } catch (err) {
        alert(err.data.message);
      }
    }else{}
  };

  const authContext = useContext(AuthContext);
  return (
    study &&
    study.category && (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <StudyItemWrapper>
          <HeaderWrapper>
            <Title>{study.title}</Title>
            <StudyInfo>
              <h4 style={{ color: "#9E1F15" }}>
                {study.category.sessionType === "basic"
                  ? "Basic"
                  : study.category.sessionType === "magazine"
                  ? "Magazine"
                  : "Advanced"}
                /{study.category ? study.category.name : "fetching"}
              </h4>
              <h4 style={{ color: "#9FA0A7" }}>
                by.{" "}
                {study.author
                  ? study.author.generation + "기 " + study.author.name
                  : "fetching"}
                {study.createdAt
                  ? study.createdAt.substring(0, 10)
                  : "fetching"}
              </h4>
              <menu
                style={{
                  display:
                    (authContext.name &&
                      (authContext.name === study.author.name ||
                        authContext.name === "임성빈")) ||
                    authContext.role === "admin"
                      ? "flex"
                      : "none",
                  flex: '1',
                  justifyContent: 'space-between'
                }}
              >
                <ButtonWrapper>
                  <Link to="edit" style={{ color: "white" }}>
                    Edit
                  </Link>
                </ButtonWrapper>
                <ButtonWrapper
                  onClick={() => {
                    handleDelete();
                  }}
                >
                  Delete
                </ButtonWrapper>
              </menu>
            </StudyInfo>
          </HeaderWrapper>

          <div
            style={{ width: "85%", padding: "2rem" }}
            dangerouslySetInnerHTML={{ __html: study.content }}
          />
        </StudyItemWrapper>
      </div>
    )
  );
}

const HeaderWrapper = styled.div`
  border-bottom: 1px solid #d6d8db;
  margin-right: 8.5vw;
  margin-bottom: 2.5rem;
  h4 {
    font-size: small;
    line-height: 200%;
  }
`;
const Title = styled.h2``;
const StudyInfo = styled.div`
  display: flex;
  gap: 1rem;
`;
const ButtonWrapper = styled.div`
  width: 3rem;
  height: 2rem;
  background-color: #9e1f15;
  color: #fff;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.8rem;

  cursor: pointer;
`;
