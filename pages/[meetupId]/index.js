import { MongoClient, ObjectId } from "mongodb";
import { Fragment } from "react";
import Head from "next/head";

import MeetupDetail from "../../components/meetups/MeetupDetail";

function MeetupDetails(props) {
  return (
    <Fragment>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta name="description" content={props.meetupData.description} />
      </Head>
      <MeetupDetail
        image={props.meetupData.image}
        title={props.meetupData.title}
        address={props.meetupData.address}
        description={props.meetupData.description}
      />
    </Fragment>
  );
}

//require if in dynamic pages
export async function getStaticPaths() {
  const client = await MongoClient.connect(
    "mongodb+srv://aungchitmin:dontforgettosmile@cluster1.epgs9.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

  client.close();

  return {
    //false- paths contains all supported meetupId values
    //true&blocking- will generate that url dynamically
    fallback: false,
    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })),
  };
}

export async function getStaticProps(context) {
  //fetch data for a single meetup

  //cannot use useRouter here to get url, but with context.params we can get that
  const meetupId = context.params.meetupId;
  //console.log(meetupId); //only on dev server side not in browser
  const client = await MongoClient.connect(
    "mongodb+srv://aungchitmin:dontforgettosmile@cluster1.epgs9.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const selectedMeetup = await meetupsCollection.findOne({
    _id: ObjectId(meetupId),
  });

  client.close();

  return {
    props: {
      meetupData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        address: selectedMeetup.address,
        image: selectedMeetup.image,
        description: selectedMeetup.description,
      },
    },
  };
}

export default MeetupDetails;
