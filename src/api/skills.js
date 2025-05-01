useEffect(() => {
    axios.get("http://localhost:8081/api/skills")
      .then(res => {
        const grouped = res.data.reduce((acc, skill) => {
          const { category, label } = skill;
          if (!acc[category]) acc[category] = [];
          acc[category].push({ label });
          return acc;
        }, {});
        setSkillsByCategory(grouped);
      })
      .catch(err => console.error(err));
  }, []);
  