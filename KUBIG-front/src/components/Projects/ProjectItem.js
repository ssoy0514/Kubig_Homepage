import { styled } from "styled-components";
import { ItemWrapper as ProjectItemWrapper } from "../common/StudyAndProject";
import PdfViewer from "./PdfViewer";
import { useContext } from "react";
import AuthContext from "../Auth/AuthContext";
import { Link } from "react-router-dom";
import client from "../../lib/httpClient";
export default function ProjectItem({ project }) {
  const authContext = useContext(AuthContext);
  const handleDelete = async () => {
    try {
      await client.get("/project/delete/" + project.id);
      window.location.href = "/projects?category=" + project.category.sessionType;
    } catch (err) {
      alert(err.data.message);
    }
  };
  return (
    project && (
      <ProjectItemWrapper>
        <Title>
          <h3 style={{ color: "#9E1F15" }}>방학 세션</h3>
          <p style={{ color: "#979797" }}> / </p>
          <h3 style={{ color: "#9E1F15" }}>KUBIG {project.category.sessionType.toUpperCase()}</h3>
          <p style={{ color: "#979797" }}> / </p>
          <h3>{project.category.semester.name}</h3>
          <p style={{ color: "#979797" }}> / </p>
          <h3>{project.category.name}</h3>
          <p style={{ color: "#979797" }}> / </p>
          <h3>{project.title}</h3>
        </Title>
        <a href={project.fileUrl}>파일 보기</a>
        <InfoWrapper>
          <Author>{project.author.name}</Author>
          <DateWrapper>{new Date(project.createdAt).toLocaleString()}</DateWrapper>{" "}
          <menu
            style={{
              display:
                (authContext.name && authContext.name === project.author.name) ||
                authContext.role === "admin"
                  ? "flex"
                  : "none",
              gap: 10,
              flex: 1,
              justifyContent: 'space-between',
              paddingRight: '10px'
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
        </InfoWrapper>
        <PdfViewer fileUrl={project.fileUrl} />
      </ProjectItemWrapper>
    )
  );
}

const Title = styled.div`
  display: flex;
  h3 {
    font-weight: 700;
  }
`;

const InfoWrapper = styled.div`
  width: 100%;
  display: flex;
  height: 41px;
  border-radius: 5px;
  border: 1px solid #d9d9d9;
  background: #fff;

  padding-left: 24px;
  margin-bottom: 9px;
  text-align: center;
  align-items: center;
  gap: 25px;
`;
const Author = styled.div`
  color: #1e1e1e;
  /* body */
  font-family: Pretendard Variable;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 180%;
`;

const DateWrapper = styled.div`
  color: #9fa0a7;
  /* Caption */
  font-family: Pretendard Variable;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 180%; /* 21.6px */
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
