const [search, setSearch] = useState("");
const filteredVendors = vendors.filter(
  v =>
    v.businessName?.toLowerCase().includes(search.toLowerCase()) ||
    v.email?.toLowerCase().includes(search.toLowerCase())
);

return (
  <>
    <input
      className="border px-2 py-1 mb-2 rounded"
      placeholder="Search vendor name or email"
      value={search}
      onChange={e => setSearch(e.target.value)}
    />
    <table> {/* map filteredVendors not vendors! */} </table>
  </>
)