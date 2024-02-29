import { styled } from "styled-components";
import PageBtn from "../common/PageBtn";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  StudyAndProjectWrapper as ProjectWrapper,
  ContentContainer as ProjectContentContainer,
  Content as ProjectContent,
  ContentImageContainer,
  HeaderContainer,
} from "../common/StudyAndProject";
import { EditButton, AddButton } from "../common/AddButton";
import axios from "../../api/axios";

export default function ProjectList({ category, categories, selectedSemester, selectedCategory }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [projects, setProjects] = useState([]);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const categoryStr = category.toUpperCase();
  const fetchProjects = async (page, category) => {
    const res = await axios.get(
      process.env.REACT_APP_KUBIG_PUBLIC_API_URL +
        `/project/list?` +
        `session=${categoryStr.toLowerCase()}&` +
        `${category ? `category=${category}&` : ""}page=${page}`
    );
    const { data } = res;
    setTotalPages(data.last_page);
    setProjects(data.projectList);
  };
  useEffect(() => {
    fetchProjects(currentPage, selectedCategory, categories, selectedSemester);
  }, [selectedCategory, currentPage,  categories, selectedSemester, category]);

  return (
    <ProjectWrapper>
      <HeaderContainer>
        <h1>KUBIG {categoryStr}</h1>
        <EditButton>
          <Link to={`/projects/new?category=${category}`}>글쓰기</Link>
        </EditButton>
      </HeaderContainer>
      <ProjectContentContainer>
        {projects.map((study, i) => (
          <Link key={i} to={`/projects/${study.id}`}>
            <ProjectContent key={study.id}>
              <ContentImageContainer>
                <img src={study.thumbnailUrl} alt="fixed" />
                <div>
                  <h3>{study.title}</h3>
                  <h5>{study.createdAt.substring(0, 10)}</h5>
                </div>
              </ContentImageContainer>
            </ProjectContent>
          </Link>
        ))}
        <PageBtn
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </ProjectContentContainer>
    </ProjectWrapper>
  );
}
