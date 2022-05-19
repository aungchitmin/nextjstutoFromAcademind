import { MongoClient } from "mongodb";
import Head from "next/head";
import { Fragment } from "react";
import MeetupList from "../components/meetups/MeetupList";

function HomePage(props) {
  return (
    <Fragment>
      <Head>
        <title>React Meetups</title>
        <meta
          name="description"
          content="browse a huge list of active react nextjs meetups"
        />
      </Head>
      <MeetupList meetups={props.meetups} />;
    </Fragment>
  );
}

// export async function getServerSideProps() {
//   //runs on server,for every incoming req
//   //fetch data from api or sth like that

//   return {
//     props: {
//       meetups: DUMMY_MEETUPS,
//     },
//   };
// }

export async function getStaticProps() {
  //run during build
  //fetch data from an api
  //return an obj
  const client = await MongoClient.connect(
    "mongodb+srv://aungchitmin:dontforgettosmile@cluster1.epgs9.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find().toArray();

  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 1, //pre-generate the page for every 1 sec
  };
}

export default HomePage;
