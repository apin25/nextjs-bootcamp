import dynamic from "next/dynamic"; // Make sure you import Link from 'next/link'

const LayoutComponent = dynamic(() => import("@/layout"));

export default function Posts({ posts }) {
  console.log("data post =>", posts);
  return (
    <>
      <LayoutComponent metaTitle="Posts">
        {posts.map((item) => (
          <div>
            <p>{item.id}</p>
            <p>
              <b>{item.title}</b>
            </p>
            <p>{item.body}</p>
          </div>
        ))}
      </LayoutComponent>
    </>
  );
}
export async function getServerSideProps() {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts");
  const posts = await res.json();
  return { props: { posts } };
}
