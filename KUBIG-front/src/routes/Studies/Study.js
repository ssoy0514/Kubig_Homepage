import { useSearchParams } from "react-router-dom";

import StudyList from "../../components/Studies/StudyList";
import StudySideBar from "../../components/Studies/StudySideBar";
import { useEffect, useState } from "react";
import client from "../../lib/httpClient";

export default function Study() {
  const [difficultySearchParams] = useSearchParams();
  const session = difficultySearchParams.get("difficulty");

  const [semesters, setSemesters] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchSemester = async () => {
    try {
      const res = await client.get("/studies/semesters");
      if (res) {
        setSemesters(res.data);
        setSelectedSemester(res.data[0].id);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchSemester();
  }, []);

  const fetchCategory = async (semester, session) => {
    try {
      if (semester) {
        const res = await client.get("/studies/category/" + semester + "?session=" + session);

        if (res) setCategories(res.data);
      }
    } catch (err) {
      alert("올바르지 않은 접근입니다.");
    }
  };

  const handleSelectHandler = (e) => {
    setSelectedSemester(e.target.value);
  }

  useEffect(() => {
    fetchCategory(selectedSemester, session);
  }, [selectedSemester, session]);
  return (
    <div style={{ display: "flex", gap: "3.5rem" }}>
      <StudySideBar
        category={session}
        semesters={semesters}
        setSelectedSemester={setSelectedSemester}
        categories={categories}
        setSelectedCategory={setSelectedCategory}
        selectedCategory={selectedCategory}
        handleSelectHandler={handleSelectHandler}
      />
      <StudyList difficulty={session} categories={categories} selectedSemester={selectedSemester} selected={selectedCategory} />
    </div>
  );
}
