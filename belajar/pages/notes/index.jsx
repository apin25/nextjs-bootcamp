import dynamic from "next/dynamic";
import Link from "next/link"; // Make sure you import Link from 'next/link'

const LayoutComponent = dynamic(() => import("@/layout"));

export default function Notes({ notes }) {
  console.log("notes data =>", notes);
  return (
    <>
      <LayoutComponent metaTitle="Notes">
        {notes.data.map((item) => (
          <div style={{ border: "1 px solid grey", marginBottom: "5px" }}>
            <Link href={`/notes/${item.id}`}>
              <p>{item.title}</p>
            </Link>
          </div>
        ))}
      </LayoutComponent>
    </>
  );
}

export async function getStaticProps() {
  const res = await fetch("https://service.pace-unv.cloud/api/notes");
  const notes = await res.json();
  return { props: { notes }, revalidate:10 };
}