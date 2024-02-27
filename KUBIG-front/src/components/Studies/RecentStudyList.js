import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { styled } from "styled-components";
import axios from "../../api/axios";

export default function RecentStudyList() {
  const [STUDY, setSTUDY] = useState([]);

  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_KUBIG_PUBLIC_API_URL +
          "/studies/recent_list"
      );
      const data = response.data;
      setSTUDY(data.study);
    } catch (err) {
      console.log(err);
      // alert("에러가 발생하였습니다.");
    }
  };

  return (
    <>
        <div>
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
                  <h5>{study.createdAt.substring(0, 10)}</h5>
                </StudyText>
              </StudyContent>
            </Link>
          ))}
        </div>
    </>
  );
}

const StudyContent = styled.div`
  width: 100%;
  padding-top: 0.2rem;
  padding-bottom: 0.2rem;

  display: flex;
  gap: 1.25rem;
`;
const StudyImageContainer = styled.div`
  width: 30%;
  position: relative;
  &::after {
    padding-bottom: 100%;

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
  flex: 1;
  overflow: hidden;
  h3 {
    text-align: center;
    white-space: nowrap;
    width: 100%;
    overflow:hidden;
    text-overflow: ellipsis;
  }
  h5 {
    color: #9fa0a7;
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 400;
    line-height: 180%;
  }
`;
