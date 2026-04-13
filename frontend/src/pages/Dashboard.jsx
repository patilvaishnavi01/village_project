import Autocomplete from "../components/Autocomplete";

function Dashboard() {
  const handleSelect = (item) => {
    console.log("Selected:", item);
  };

  return (
    <div style={{ padding: "40px", maxWidth: "600px", margin: "auto" }}>
      <h1>Search Villages</h1>

      <Autocomplete onSelect={handleSelect} />
    </div>
  );
}

export default Dashboard;