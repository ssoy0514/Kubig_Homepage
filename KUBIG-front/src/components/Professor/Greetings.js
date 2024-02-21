import React from "react";
import { styled } from "styled-components";
import Logo from "../../image/KubigCircleLogo.png";

export default function Greetings() {
  return (
    <>
      <Wrapper className="outer">
        <Wrapper className="inner">
          <ProfileContainer>
            <ImageContainer>
              <img src={Logo} alt="logo" />
            </ImageContainer>
          </ProfileContainer>

          <ContentContainer>
            <TitleBox>
              <p className="title">학회장 인사말</p>
              <p className="head">
                <b>KUBIG</b> 에 <br />
                오신 것을 환영합니다!
              </p>
              <br />
              <p>
                고려대학교 데이터 사이언스 학회 <b>KUBIG</b>은 데이터 사이언스에
                관심이 있는 학생들끼리 <br />
                같이 공부하며 학습 네트워크를 형성하는 교내 학회입니다.
              </p>
            </TitleBox>

            <TextContainer>
              <Line />
              <TextBox>
                <p>
                  2015년 고려대학교 빅데이터 연구회라는 이름으로 통계학과 출범한
                  KUBIG은, 그간 학회원들의 열정과 역량에 힘입어 현재 명실상부
                  고려대학교를 대표하는 데이터 사이언스 학회가 되었습니다.
                </p>
                <p>
                  앞으로 KUBIG과 함께할 시간이 여러분에게 있어 많은 것을
                  얻어가는 기회와 경험이 되길 바랍니다.
                </p>
              </TextBox>
            </TextContainer>
          </ContentContainer>
        </Wrapper>
      </Wrapper>
    </>
  );
}
//////////////////////////////////////////////////

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  padding-left: 14%;
  padding-right: 14%;
  min-width: 1080px;

  .outer {
    width: auto;
    justify-content: center;
  }
  .inner {
    width: 80%;
    justify-items: center;
    grid-gap: 10rem;
  }
`;

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  height: 37rem;
`;

const ImageContainer = styled.div`
  img {
    width: 24.625rem;
  }
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 5rem;
`;

const TitleBox = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;

  p {
    color: #000;
    font-size: 1.4rem;
    font-style: normal;
    font-weight: 400;
    line-height: 180%; /* 2.7rem */
  }

  .title {
    color: #9e1f15;
    /* font-family: Noto Sans; */
    font-size: 1.375rem;
    font-style: normal;
    font-weight: 700;
    line-height: 100%; /* 2.7rem */
  }

  .head {
    color: #000;
    font-size: 3rem;
    font-style: normal;
    font-weight: 400;
    line-height: 150%; /* 3rem */
    margin-bottom: 0%;
    margin-top: 1rem;
  }
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  //gap: 5rem;
  padding-top: 4.2rem;
`;

const Line = styled.div`
  position: relative;
  box-sizing: border-box;
  width: 5.4375rem;
  height: 0.3125rem;
  flex-shrink: 0;
  background: #9e1f15;
  margin-bottom: 1rem;
`;

const TextBox = styled.div`
  width: 50.625rem;
  height: 14.4375rem;
  flex-shrink: 0;
  line-height: 180%;
  color: #000;

  font-style: normal;
  font-weight: 400;
  p {
    margin-top: 1rem;
    font-size: 1.125rem;
  }
`;
