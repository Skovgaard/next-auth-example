async function getData() {
  const res = await fetch("https://dummyjson.com/products/1");

  // Recommendation: handle errors
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default async function ServerComponent() {
  const data = await getData();
  
  return <div>{data.title}</div>;
}
