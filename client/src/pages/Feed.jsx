import axios from "axios";
import React, { useEffect, useState } from "react";
import BASE_URL from "../config/baseurl";
import { useDispatch, useSelector } from "react-redux";
import { addUserToFeed } from "../utils/feedSlice";
import UserCard from "../components/UserCard";

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);
  const [loading, setLoading] = useState(false);

  const getFeed = async () => {
    if (feed) return;

    setLoading(true);
    try {
      const feedData = await axios.get(
        BASE_URL + "/user/feed?page=1&limit=10",
        {
          withCredentials: true,
        }
      );

      dispatch(addUserToFeed(feedData?.data?.data));
    } catch (error) {
      console.log("Axios Error: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  if (loading)
    return <div className="flex justify-center my-10">Loading...</div>;
  if (!feed)
    return <div className="flex justify-center my-10">No new users...</div>;
  if (feed.length == 0)
    return <h1 className="flex justify-center my-10">No new users founds!</h1>;
  return (
    feed && (
      <div>
        <UserCard userFeed={feed[0]} showButtons={true} />
      </div>
    )
  );
};

export default Feed;
