import { useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { styled } from "styled-components";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;
export default function PdfViewer({ fileUrl }) {

  const [numPages, setNumPages] = useState(null); // 총 페이지수
  const [pageNumber, setPageNumber] = useState(1); // 현재 페이지
  const [pageScale, setPageScale] = useState(1);
  const pdfRef = useRef(null);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <Wrapper>
      <PageBtnWrapper>
        <PageBtn onClick={() => (pageScale > 0.1 ? setPageScale(pageScale - 0.1) : setPageScale(0.1))}>-</PageBtn>
        {/* <PageBtn
          onClick={() => {
            setPageNumber(pageNumber === 1 ? pageNumber : pageNumber - 1);
          }}
        >
          &lt;
        </PageBtn>
        <span>
          {pageNumber} / {numPages}
        </span>
        <PageBtn onClick={() => (pageNumber < numPages ? setPageNumber(pageNumber + 1) : null)}>
          &gt;
        </PageBtn> */}
          <span>
          / 
        </span>
        <PageBtn onClick={() => setPageScale(pageScale + 0.1)}>+</PageBtn>
      </PageBtnWrapper>

      <PdfWrapper>
        <Document
          inputRef={pdfRef}
          file={fileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onError={(err) => {
            console.log(err);
          }}
        >
          {/* <Page
            pageNumber={pageNumber}
            scale={pageScale}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            customTextRenderer={false}
          /> */}
          {Array.from(
            new Array(numPages),
            (el, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                scale={pageScale}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                customTextRenderer={false}
              />
            ),
          )}
        </Document>
      </PdfWrapper>
    </Wrapper>
  );
}
const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
`;
const PdfWrapper = styled.div`
  width: 100%;
  height: 100vh;
  overflow: scroll;
`;
const PageBtnWrapper = styled.div`
  width: 100%;
  border-radius: 0.3125rem;
  border: 1px solid #d9d9d9;
  background: #f9fafc;
  display: flex;
  justify-content: center;
  gap: 5px;
`;

const PageBtn = styled.button``;
